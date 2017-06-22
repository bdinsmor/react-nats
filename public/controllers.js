angular.module('PriceDigests')
    .controller('LoginController', ['ENV', '$scope', '$location', 'LoginService', loginController])
    .controller('LogoutController', ['ENV', '$scope', '$location', 'SessionService', logoutController])
    .controller('MainController', ['ENV', '$scope', '$location', 'SessionService', MainController])
    .controller('ValuesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ValuesController])
    .controller('OptionsController', ['ENV', '$scope', '$http', '$q', OptionsController])
    .controller('SpecsController', ['ENV', '$scope', '$http', '$q', SpecsController])
    .controller('ManufacturerAliasesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ManufacturerAliasesController])
    .controller('ManufacturerVinsController', ['ENV', '$scope', '$http', '$q', '$uibModal', ManufacturerVinsController])
    .controller('ModelAliasesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ModelAliasesController])
    .controller('TaxonomyController', ['ENV', '$scope', '$http', '$q', '$uibModal', TaxonomyController])
    .controller('SyncController', ['ENV', '$scope', '$http', '$q', SyncController])
    .controller('ImportController', ['ENV', '$scope', '$http', '$q', "$timeout", "Upload", ImportController])

function ImportController(ENV, $scope, $http, $q, $timeout, Upload) {
    var canceler = $q.defer();
    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });
    $scope.importTypes = {
        "append": "Append New",
        //"update": "Update Existing"
    }
    $scope.tables = [{
        name: "configurations",
        title: "Configurations",
        header: {
            "append": ["modelId", "vinModelNumber", "modelYear", "sizeClassId"],
            "update": ["configurationId", "modelId", "vinModelNumber", "modelYear", "sizeClassId"]
        }
    }, {
        name: "manufacturers",
        title: "Manufacturers",
        header: {
            "append": ["manufacturerName"],
            "update": ["manufacturerId", "manufacturerName"]
        }
    }]
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.import = function() {
        $scope.progress = 0;
        $scope.processing = true;
        $http.post(ENV['API_URL'] + '/analyst/import', {
                "table": $scope.table.name,
                "type": $scope.importType,
                "contentType": $scope.file.type
            }, {
                "timeout": canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                if (!$scope.file.$error && response.data.url) {
                    Upload.http({
                        withCredentials: false,
                        method: "PUT",
                        url: response.data.url,
                        headers: {
                            "Content-Type": $scope.file.type
                        },
                        data: $scope.file
                    }).progress(function(evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
                        $scope.processing = false;
                        $timeout(function() {
                            $scope.alerts.unshift({
                                type: "success",
                                title: "Upload Successful",
                                msg: 'A status email will be sent shortly.<br>Import Id assigned:' + response.data.id
                            });
                            $scope.file = null;
                        });
                    }).error(function(data, status, headers, config) {
                        $timeout(function() {
                            $scope.processing = false;
                            $scope.alerts.unshift({
                                type: "danger",
                                title: "Upload Error!",
                                msg: 'Error uploading file. Please retry.'
                            });
                        });
                    });
                }
            });
    }
}

function SyncController(ENV, $scope, $http, $q) {
    var canceler = $q.defer();
    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });
    getHistory();

    $scope.sync = function() {
        $http.post(ENV['API_URL'] + '/analyst/sync', null, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                getHistory();
            });
    }

    function getHistory() {
        $scope.staged = null;
        $scope.history = [];
        $http.get(ENV['API_URL'] + '/analyst/sync', {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.history = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/staged', {
                    timeout: canceler.promise,
                    "withCredentials": true
                })
            })
            .then(function(response) {
                $scope.staged = response.data;
            });
    }
}

function ManufacturerVinsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.gridOptions = {
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "modelYear" },
        { name: "vinManufacturerCode" },
        { name: "vinYearCode" },
        { name: "shortVin" },
        { name: "cicCode" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-manufacturer-vin.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "id": item.id,
                    "manufacturerId": item.manufacturerId,
                    "manufacturerName": item.manufacturerName,
                    "vinManufacturerCode": item.vinManufacturerCode,
                    "vinYearCode": item.vinYearCode,
                    "shortVin": item.shortVin,
                    "modelYear": item.modelYear,
                    "cicCode": item.cicCode
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/manufacturer-vins", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
                $scope.delete = function() {
                    $http.delete(ENV['API_URL'] + "/analyst/manufacturer-vins/" + $scope.item.id, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function() {
                $scope.load(item.manufacturerId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(manufacturer) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-manufacturer-vin.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "manufacturerId": manufacturer.manufacturerId,
                    "manufacturerName": manufacturer.manufacturerName,
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/manufacturer-vins", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.load(result.manufacturerId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }
    $scope.load = function(manufacturerId) {
        $scope.manufacturer = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/manufacturer/' + manufacturerId, {
                timeout: canceler.promise
            })
            .then(function(response) {
                $scope.manufacturer = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/manufacturer-vins', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "manufacturerId": manufacturerId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function ManufacturerAliasesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.gridOptions = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "manufacturerId" },
        { name: "manufacturer" },
        { name: "alias" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();
    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-manufacturer-alias.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "id": item.id,
                    "manufacturerId": item.manufacturerId,
                    "manufacturerName": item.manufacturer,
                    "manufacturerAlias": item.alias
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/manufacturer-aliases", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
                $scope.delete = function() {
                    $http.delete(ENV['API_URL'] + "/analyst/manufacturer-aliases/" + $scope.item.id, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function() {
                $scope.load(item.manufacturerId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(manufacturer) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-manufacturer-alias.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "manufacturerId": manufacturer.manufacturerId,
                    "manufacturerName": manufacturer.manufacturerName,
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/manufacturer-aliases", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.load(result.manufacturerId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(manufacturerId) {
        $scope.manufacturer = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/manufacturer/' + manufacturerId, {
                timeout: canceler.promise
            })
            .then(function(response) {
                $scope.manufacturer = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/manufacturer-aliases', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "manufacturerId": manufacturerId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function ModelAliasesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.gridOptions = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "modelId" },
        { name: "model" },
        { name: "alias" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-model-alias.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "id": item.id,
                    "modelId": item.modelId,
                    "modelName": item.model,
                    "modelAlias": item.alias
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/model-aliases", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
                $scope.delete = function() {
                    $http.delete(ENV['API_URL'] + "/analyst/model-aliases/" + $scope.item.id, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function() {
                $scope.load(item.modelId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(model) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-model-alias.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "modelId": model.modelId,
                    "modelName": model.modelName,
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/model-aliases", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.load(result.modelId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }
    $scope.load = function(modelId) {
        $scope.model = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/model/' + modelId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.model = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/model-aliases', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "modelId": modelId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

}

function SpecsController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        enableFiltering: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "specFamily" },
        { name: "specNameFriendly" },
        { name: "specName" },
        { name: "specValue" },
        { name: "specUom" },
        { name: "specDescription" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });


    $scope.load = function(configurationId) {
        $scope.configuration = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/configurations/' + configurationId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.configuration = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/specs', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "configurationId": configurationId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function OptionsController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        enableFiltering: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "optionFamilyName" },
        { name: "optionName" },
        { name: "optionValue" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });
    $scope.load = function(sizeClassId, modelYear) {
        $scope.modelYearSelected = null;
        $scope.sizeClass = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/sizes/' + sizeClassId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.sizeClass = response.data;
                $scope.modelYearSelected = modelYear;
                return $http.get(ENV['API_URL'] + '/analyst/options', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "sizeClassId": sizeClassId,
                        "modelYear": modelYear
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function ValuesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.gridOptions = {
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selected = null;
                if (row.isSelected === true) $scope.selected = row.entity;
            });
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: "msrp" },
        { name: "finance" },
        { name: "retail" },
        { name: "wholesale" },
        { name: "tradeIn" },
        { name: "askingPrice" },
        { name: "auctionPrice" },
        { name: "low" },
        { name: "high" },
        { name: "revisionDate" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-value.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "configurationId": item.configurationId,
                    "msrp": item.msrp,
                    "finance": item.finance,
                    "retail": item.retail,
                    "wholesale": item.wholesale,
                    "tradeIn": item.tradeIn,
                    "askingPrice": item.askingPrice,
                    "auctionPrice": item.auctionPrice,
                    "low": item.low,
                    "high": item.high,
                    "revisionDate": item.revisionDate
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/values", $scope.item, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.load(result.configurationId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(configurationId) {
        $scope.configuration = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/configurations/' + configurationId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.configuration = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/values', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "configurationId": configurationId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function TaxonomyController(ENV, $scope, $http, $q, $uibModal) {
    $scope.classificationsGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedClassification = null;
                if (row.isSelected === true) $scope.selectedClassification = row.entity;
            });
        }
    };
    $scope.classificationsGrid.columnDefs = [
        { name: "classificationId" },
        { name: "classificationName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.classificationsGrid.data = [];

    $scope.categoriesGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedCategory = null;
                if (row.isSelected === true) $scope.selectedCategory = row.entity;
            });
        }
    };
    $scope.categoriesGrid.columnDefs = [
        { name: "categoryId" },
        { name: "categoryName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.categoriesGrid.data = [];

    $scope.subtypesGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedSubtype = null;
                if (row.isSelected === true) $scope.selectedSubtype = row.entity;
            });
        }
    };
    $scope.subtypesGrid.columnDefs = [
        { name: "subtypeId" },
        { name: "subtypeName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.subtypesGrid.data = [];

    $scope.sizeclassesGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedSizeClass = null;
                if (row.isSelected === true) $scope.selectedSizeClass = row.entity;
            });
        }
    };
    $scope.sizeclassesGrid.columnDefs = [
        { name: "sizeClassId" },
        { name: "sizeClassName" },
        { name: "sizeClassMin" },
        { name: "sizeClassMax" },
        { name: "sizeClassUom" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.sizeclassesGrid.data = [];

    $scope.manufacturersGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedManufacturer = null;
                if (row.isSelected === true) $scope.selectedManufacturer = row.entity;
            });
        }
    };
    $scope.manufacturersGrid.columnDefs = [
        { name: "manufacturerId" },
        { name: "manufacturerName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.manufacturersGrid.data = [];

    $scope.modelsGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedModel = null;
                if (row.isSelected === true) $scope.selectedModel = row.entity;
            });
        }
    };
    $scope.modelsGrid.columnDefs = [
        { name: "modelId" },
        { name: "modelName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.modelsGrid.data = [];

    $scope.configurationsGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                if (gridApi.selection.getSelectedRows().length === 0) $scope.selectedConfiguration = null;
                if (row.isSelected === true) $scope.selectedConfiguration = row.entity;
            });
        }
    };
    $scope.configurationsGrid.columnDefs = [
        { name: "configurationId" },
        { name: "sizeClassId" },
        { name: "modelId" },
        { name: "modelYear" },
        { name: "vinModelNumber" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.configurationsGrid.data = [];

    $scope.getHeader = function(key) {
        var headers = {
            "classifications": [
                "classificationId",
                "classificationName"
            ],
            "categories": [
                "categoryId",
                "categoryName",
                "classificationId"
            ],
            "subtypes": [
                "subtypeId",
                "subtypeName",
                "categoryId"
            ],
            "sizes": [
                "sizeClassId",
                "sizeClassName",
                "sizeClassMin",
                "sizeClassMax",
                "sizeClassUom",
                "subtypeId"
            ],
            "manufacturers": [
                "manufacturerId",
                "manufacturerName"
            ],
            "models": [
                "modelId",
                "modelName",
                "manufacturerId"
            ],
            "configurations": [
                "configurationId",
                "sizeClassId",
                "modelId",
                "modelYear",
                "vinModelNumber"
            ]
        }
        return headers[key];
    }

    $scope.selection = {};

    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.getClassifications = function getClassifications() {
        $scope.configurationsGrid.data = [];
        $scope.classificationsGrid.data = [];
        $scope.categoriesGrid.data = [];
        $scope.subtypesGrid.data = [];
        $scope.sizeclassesGrid.data = [];
        $scope.manufacturersGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.classification = null;
        $scope.selection.category = null;
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/classifications", {
                timeout: canceler.promise,
                "withCredentials": true,
            })
            .then(function(response) {
                $scope.classificationsGrid.data = response.data;
            });
    }

    $scope.getCategories = function getCategories() {
        $scope.configurationsGrid.data = [];
        $scope.categoriesGrid.data = [];
        $scope.subtypesGrid.data = [];
        $scope.sizeclassesGrid.data = [];
        $scope.manufacturersGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.category = null;
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/categories", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classification
                }
            })
            .then(function(response) {
                $scope.categoriesGrid.data = response.data;
            });
    }

    $scope.getSubtypes = function getSubtypes() {
        $scope.configurationsGrid.data = [];
        $scope.subtypesGrid.data = [];
        $scope.sizeclassesGrid.data = [];
        $scope.manufacturersGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/subtypes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classification,
                    "categoryId": $scope.selection.category
                }
            })
            .then(function(response) {
                $scope.subtypesGrid.data = response.data;
            });
    }

    $scope.getSizeClasses = function getSizeClasses() {
        $scope.configurationsGrid.data = [];
        $scope.sizeclassesGrid.data = [];
        $scope.manufacturersGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/sizes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classification,
                    "categoryId": $scope.selection.category,
                    "subtypeId": $scope.selection.subtype
                }
            })
            .then(function(response) {
                $scope.sizeclassesGrid.data = response.data;
            });
    }

    $scope.getManufacturers = function getManufacturers() {
        $scope.configurationsGrid.data = [];
        $scope.manufacturersGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.manufacturer = null;
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/manufacturers", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "sizeClassId": $scope.selection.sizeclass
                }
            })
            .then(function(response) {
                $scope.manufacturersGrid.data = response.data;
            });
    }
    $scope.getModels = function getModels() {
        $scope.configurationsGrid.data = [];
        $scope.modelsGrid.data = [];
        $scope.selection.model = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/models", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "sizeClassId": $scope.selection.sizeclass,
                    "manufacturerId": $scope.selection.manufacturer
                }
            })
            .then(function(response) {
                $scope.modelsGrid.data = response.data;
            });
    }
    $scope.update = function update() {
        $scope.configurationsGrid.data = [];
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/configurations", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classification,
                    "categoryId": $scope.selection.category,
                    "subtypeId": $scope.selection.subtype,
                    "sizeClassId": $scope.selection.sizeclass,
                    "manufacturerId": $scope.selection.manufacturer,
                    "modelId": $scope.selection.model
                }
            })
            .then(function(response) {
                $scope.configurationsGrid.data = response.data;
            });
    }

    $scope.editClassification = function(classification) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-classification.html',
            controller: function($scope, $http) {
                $scope.classification = {
                    classificationId: classification.classificationId,
                    classificationName: classification.classificationName
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/classifications", $scope.classification, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getClassifications();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editCategory = function(category) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-category.html',
            controller: function($scope, $http) {
                $scope.category = {
                    classificationId: category.classificationId,
                    categoryId: category.categoryId,
                    categoryName: category.categoryName
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/categories", $scope.category, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getCategories();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editSubtype = function(subtype) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-subtype.html',
            controller: function($scope, $http) {
                $scope.subtype = {
                    categoryId: subtype.categoryId,
                    subtypeId: subtype.subtypeId,
                    subtypeName: subtype.subtypeName
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/subtypes", $scope.subtype, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getSubtypes();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editSizeClass = function(sizeClass) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-sizeclass.html',
            controller: function($scope, $http) {
                $scope.sizeClass = {
                    subtypeId: sizeClass.subtypeId,
                    sizeClassId: sizeClass.sizeClassId,
                    sizeClassName: sizeClass.sizeClassName,
                    sizeClassMin: sizeClass.sizeClassMin,
                    sizeClassMax: sizeClass.sizeClassMax,
                    sizeClassUom: sizeClass.sizeClassUom
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/sizes", $scope.sizeClass, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getSizeClasses();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editManufacturer = function(manufacturer) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-manufacturer.html',
            controller: function($scope, $http) {
                $scope.manufacturer = {
                    manufacturerId: manufacturer.manufacturerId,
                    manufacturerName: manufacturer.manufacturerName
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/manufacturers", $scope.manufacturer, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getManufacturers();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editModel = function(model) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-model.html',
            controller: function($scope, $http) {
                $scope.model = {
                    manufacturerId: model.manufacturerId,
                    modelId: model.modelId,
                    modelName: model.modelName
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/models", $scope.model, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.getModels();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.editConfiguration = function(configuration) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-configuration.html',
            controller: function($scope, $http) {
                $scope.configuration = {
                    "configurationId": configuration.configurationId,
                    "modelId": configuration.modelId,
                    "sizeClassId": configuration.sizeClassId,
                    "modelYear": configuration.modelYear,
                    "vinModelNumber": configuration.vinModelNumber
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/taxonomy/configurations", $scope.configuration, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.update();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.addConfiguration = function(sizeClassId, modelId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-configuration.html',
            controller: function($scope, $http) {
                $scope.configuration = {
                    "modelId": modelId,
                    "sizeClassId": sizeClassId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/taxonomy/configurations", $scope.configuration, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close(response.data);
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.update();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.getClassifications();
}

function MainController(ENV, $scope, $location, SessionService) {
    $scope.getUser = SessionService.getUser;
    $scope.getTitle = function() {
        switch ($location.path()) {
            case '/taxonomy':
                return "Taxonomy";
            case '/model/alias':
                return "Model Aliases";
            case '/manufacturer/alias':
                return "Manufacturer Aliases";
            case '/manufacturer/vins':
                return "Manufacturer VINs";
            case '/options':
                return "Options";
            case '/specs':
                return "Specifications";
            case '/values':
                return "Values";
            default:
                return "PriceDigests Analyst";
        }
    }
}

function loginController(ENV, $scope, $location, LoginService) {
    $scope.user = '';
    $scope.pass = '';
    $scope.submit = function() {
        LoginService.login({
                username: $scope.user,
                password: $scope.pass
            })
            .then(function() {
                $location.url($location.search().next ? $location.search().next : "/home");
                $scope.loading = false;
            }, function() {
                $scope.loading = false;
            })
    };

    $scope.message = LoginService.status;
}

function logoutController(ENV, $scope, $location, SessionService) {
    SessionService.logout();
    $location.path("/login");
}