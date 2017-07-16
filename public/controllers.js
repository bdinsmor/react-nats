angular.module('PriceDigests')
    .controller('LoginController', ['ENV', '$scope', '$location', 'LoginService', loginController])
    .controller('LogoutController', ['ENV', '$scope', '$location', 'SessionService', logoutController])
    .controller('MainController', ['ENV', '$scope', '$location', 'SessionService', MainController])
    .controller('PopularityController', ['ENV', '$scope', '$http', '$q', '$uibModal', PopularityController])
    .controller('UsageController', ['ENV', '$scope', '$http', '$q', '$uibModal', UsageController])
    .controller('RegionAdjustmentsController', ['ENV', '$scope', '$http', '$q', '$uibModal', RegionAdjustmentsController])
    .controller('UtilizationAdjustmentsController', ['ENV', '$scope', '$http', '$q', '$uibModal', UtilizationAdjustmentsController])
    .controller('ConditionAdjustmentsController', ['ENV', '$scope', '$http', '$q', '$uibModal', ConditionAdjustmentsController])
    .controller('ValuesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ValuesController])
    .controller('OptionsController', ['ENV', '$scope', '$http', '$q', '$uibModal', OptionsController])
    .controller('SpecsController', ['ENV', '$scope', '$http', '$q', '$uibModal', SpecsController])
    .controller('ManufacturerAliasesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ManufacturerAliasesController])
    .controller('ManufacturerVinsController', ['ENV', '$scope', '$http', '$q', '$uibModal', ManufacturerVinsController])
    .controller('ModelAliasesController', ['ENV', '$scope', '$http', '$q', '$uibModal', ModelAliasesController])
    .controller('TaxonomyController', ['ENV', '$scope', '$http', '$q', '$uibModal', TaxonomyController])
    .controller('ConfigurationsController', ['ENV', '$scope', '$http', '$q', '$uibModal', ConfigurationsController])
    .controller('SyncController', ['ENV', '$scope', '$http', '$q', SyncController])
    .controller('ImportController', ['ENV', '$scope', '$http', '$q', "$timeout", "Upload", ImportController])

function ImportController(ENV, $scope, $http, $q, $timeout, Upload) {
    var canceler = $q.defer();
    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });
    $scope.tables = [{
        name: "configurations",
        title: "Configurations",
        header: {
            "append": ["modelId", "vinModelNumber", "modelYear", "sizeClassId"],
            // "update": ["configurationId", "modelId", "vinModelNumber", "modelYear", "sizeClassId"]
        }
    }, {
        name: "models",
        title: "Models",
        header: {
            "append": ["modelName", "manufacturerId"],
            // "update": ["modelId", "modelName", "manufacturerId"]
        }
    }, {
        name: "manufacturers",
        title: "Manufacturers",
        header: {
            "append": ["manufacturerName"],
            // "update": ["manufacturerId", "manufacturerName"]
        }
    }, {
        name: "sizeclasses",
        title: "Size Classes",
        header: {
            "append": ["sizeClassName", "sizeClassMin", "sizeClassMax", "sizeClassUom", "subtypeId"],
            // "update": ["sizeClassId", "sizeClassName", "sizeClassMin", "sizeClassMax", "sizeClassUom", "subtypeId"]
        }
    }, {
        name: "subtypes",
        title: "Subtypes",
        header: {
            "append": ["subtypeName", "categoryId"],
            // "update": ["subtypeId", "subtypeName", "categoryId"]
        }
    }, {
        name: "categories",
        title: "Categories",
        header: {
            "append": ["categoryName", "classificationId"],
            // "update": ["categoryId", "categoryName", "classificationId"]
        }
    }, {
        name: "classifications",
        title: "Classifications",
        header: {
            "append": ["classificationName"],
            // "update": ["classificationId", "classificationName"]
        }
    }, {
        name: "modelAliases",
        title: "Model Aliases",
        header: {
            "append": ["modelId", "modelAlias"]
        }
    }, {
        name: "manufacturerAliases",
        title: "Manufacturer Aliases",
        header: {
            "append": ["manufacturerId", "manufacturerAlias"]
        }
    }, {
        name: "manufacturerVins",
        title: "Manufacturer Vins",
        header: {
            "append": ["vinManufacturerCode", "vinYearCode", "modelYear", "shortVin", "cicCode"]
        }
    }, {
        name: "specs",
        title: "Specs",
        header: {
            "append": ["configurationId", "specName", "specNameFriendly", "specValue", "specUom", "specFamily", "specDescription"]
        }
    }, {
        name: "options",
        title: "Options",
        header: {
            "append": ["sizeClassId", "optionFamilyId", "modelYear", "optionName", "optionValue"]
        }
    }, {
        name: "optionFamilies",
        title: "Option Familes",
        header: {
            "append": ["optionFamilyName"]
        }
    }, {
        name: "values",
        title: "Values",
        header: {
            "append": ["configurationId", "askingPrice", "auctionPrice", "msrp", "low", "high", "finance", "wholesale", "retail", "tradeIn", "revisionDate"]
        }
    }, {
        name: "conditionAdjustments",
        title: "Condition Adjustments",
        header: {
            "replace": ["sizeClassId", "condition", "adjustmentFactor"]
        }
    }, {
        name: "regionAdjustments",
        title: "Region Adjustments",
        header: {
            "replace": ["sizeClassId", "country", "state", "adjustmentValue"]
        }
    }, {
        name: "utilizationAdjustments",
        title: "Utilization Adjustments",
        header: {
            "replace": ["sizeClassId", "fuelType", "modelYear", "lowValue", "highValue", "uom", "adjustmentValue"]
        }
    }, {
        name: "usage",
        title: "Usage",
        header: {
            "replace": ["modelId", "modelYear", "age", "benchmarkLevel", "meanAnnualUsage", "recordCount", "percentile25", "percentile45", "percentile55", "percentile75", "percentile99", "distribution25", "distribution45", "distribution55", "distribution75", "distribution99"]
        }
    }, {
        name: "popularity",
        title: "Popularity",
        header: {
            "replace": ["modelId", "recordCount", "marketPopularityIndex", "benchmarkGroup", "marketPopularityLabel", "twenty", "forty", "sixty", "eighty", "hundred", "twentyPercent", "fortyPercent", "sixtyPercent", "eightyPercent", "hundredPercent"]
        }
    }]
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.import = function() {
        $scope.progress = 0;
        $scope.processing = true;
        $http.post(ENV['API_URL'] + '/analyst/import/url', {
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
                        $timeout(function() {
                            $scope.file = null;
                            $http.post(ENV['API_URL'] + '/analyst/import/done', {
                                    "id": response.data.id,
                                    "type": $scope.importType
                                }, {
                                    "timeout": canceler.promise,
                                    "withCredentials": true
                                })
                                .then(function() {
                                    $scope.processing = false;
                                    $scope.alerts.unshift({
                                        type: "success",
                                        title: "Upload Successful",
                                        msg: 'A status email will be sent shortly.<br>Import Id assigned:' + response.data.id
                                    });
                                })
                                .catch(function() {
                                    $scope.processing = false;
                                    $scope.alerts.unshift({
                                        type: "danger",
                                        title: "Upload Error!",
                                        msg: 'Error uploading file. Please retry.'
                                    });
                                })
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

function UsageController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return [
            "modelId",
            "modelYear",
            "age",
            "benchmarkLevel",
            "meanAnnualUsage",
            "recordCount",
            "percentile25",
            "percentile45",
            "percentile55",
            "percentile75",
            "percentile99",
            "distribution25",
            "distribution45",
            "distribution55",
            "distribution75",
            "distribution99"
        ];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "modelId" },
        { name: "modelYear" },
        { name: "age" },
        { name: "benchmarkLevel" },
        { name: "meanAnnualUsage" },
        { name: "recordCount" },
        { name: "percentile25" },
        { name: "percentile45" },
        { name: "percentile55" },
        { name: "percentile75" },
        { name: "percentile99" },
        { name: "distribution25" },
        { name: "distribution45" },
        { name: "distribution55" },
        { name: "distribution75" },
        { name: "distribution99" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var model = $scope.model;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-usage.html',
            controller: function($scope, $http) {
                $scope.title = [model.manufacturerName, model.modelName].join(' ');
                $scope.item = item;
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/usage", $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/usage", {
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
            .then(function(data) {
                if (data) $scope.load();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(model) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-usage.html',
            controller: function($scope, $http) {
                $scope.title = [model.manufacturerName, model.modelName].join(' ');
                $scope.item = {
                    "modelId": model.modelId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/usage", $scope.item, {
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
                if (result) $scope.load();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function() {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/usage', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "modelId": $scope.model.modelId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    var cancelSearchModel = $q.defer();
    $scope.searchModel = function(model) {
        cancelSearchModel.resolve();
        cancelSearchModel = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/models", {
                timeout: cancelSearchModel.promise,
                "withCredentials": true,
                params: {
                    "model": model,
                    "manufacturerId": $scope.manufacturer.manufacturerId
                }
            })
            .then(function(response) {
                return response.data;
            });
    }
}

function PopularityController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return [
            "modelId",
            "recordCount",
            "marketPopularityIndex",
            "benchmarkGroup",
            "marketPopularityLabel",
            "twenty",
            "forty",
            "sixty",
            "eighty",
            "hundred",
            "twentyPercent",
            "fortyPercent",
            "sixtyPercent",
            "eightyPercent",
            "hundredPercent"
        ];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "modelId" },
        { name: "recordCount" },
        { name: "marketPopularityIndex" },
        { name: "benchmarkGroup" },
        { name: "marketPopularityLabel" },
        { name: "twenty" },
        { name: "forty" },
        { name: "sixty" },
        { name: "eighty" },
        { name: "hundred" },
        { name: "twentyPercent" },
        { name: "fortyPercent" },
        { name: "sixtyPercent" },
        { name: "eightyPercent" },
        { name: "hundredPercent" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var model = $scope.model;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-popularity.html',
            controller: function($scope, $http) {
                $scope.title = [model.manufacturerName, model.modelName].join(' ');
                $scope.item = item;
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/popularity", $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/popularity", {
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
            .then(function(data) {
                if (data) $scope.load();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(model) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-popularity.html',
            controller: function($scope, $http) {
                $scope.title = [model.manufacturerName, model.modelName].join(' ');
                $scope.item = {
                    "modelId": model.modelId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/popularity", $scope.item, {
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
                if (result) $scope.load();
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(modelId) {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/popularity', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "modelId": $scope.model.modelId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    var cancelSearchModel = $q.defer();
    $scope.searchModel = function(model) {
        cancelSearchModel.resolve();
        cancelSearchModel = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/models", {
                timeout: cancelSearchModel.promise,
                "withCredentials": true,
                params: {
                    "model": model,
                    "manufacturerId": $scope.manufacturer.manufacturerId
                }
            })
            .then(function(response) {
                return response.data;
            });
    }
}

function UtilizationAdjustmentsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return [
            "sizeClassId",
            "modelYear",
            "fuelType",
            "lowValue",
            "highValue",
            "uom",
            "adjustmentValue"
        ];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "sizeClassId" },
        { name: "modelYear" },
        { name: "fuelType" },
        { name: "lowValue" },
        { name: "highValue" },
        { name: "uom" },
        { name: "adjustmentValue" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-utilization-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = item;
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/utilization-adjustments", $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/utilization-adjustments", {
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
            .then(function(data) {
                if (data) $scope.load(item.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(sizeClass) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-utilization-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "sizeClassId": sizeClass.sizeClassId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/utilization-adjustments", $scope.item, {
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
                if (result) $scope.load(result.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(sizeClassId) {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/sizes/' + sizeClassId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.sizeClass = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/utilization-adjustments', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "sizeClassId": sizeClassId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    $scope.classifications = [];
    $scope.categories = [];
    $scope.subtypes = [];
    $scope.sizeclasses = [];
    $scope.selection = {};
    $scope.getClassifications = function getClassifications() {
        $scope.classifications = [];
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.classificationId = null;
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/classifications", {
                timeout: canceler.promise,
                "withCredentials": true,
            })
            .then(function(response) {
                $scope.classifications = response.data;
            });
    }

    $scope.getCategories = function getCategories() {
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/categories", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId
                }
            })
            .then(function(response) {
                $scope.categories = response.data;
            });
    }

    $scope.getSubtypes = function getSubtypes() {
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/subtypes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId
                }
            })
            .then(function(response) {
                $scope.subtypes = response.data;
            });
    }

    $scope.getSizeClasses = function getSizeClasses() {
        $scope.sizeclasses = [];
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/sizes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId,
                    "subtypeId": $scope.selection.subtypeId
                }
            })
            .then(function(response) {
                $scope.sizeclasses = response.data;
            });
    }

    // Get initial classifications
    $scope.getClassifications();
}

function RegionAdjustmentsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return [
            "sizeClassId",
            "country",
            "state",
            "adjustmentValue"
        ];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "sizeClassId" },
        { name: "country" },
        { name: "state" },
        { name: "adjustmentValue" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-region-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = item;
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/region-adjustments", $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/region-adjustments", {
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
            .then(function(data) {
                if (data) $scope.load(item.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(sizeClass) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-region-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "sizeClassId": sizeClass.sizeClassId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/region-adjustments", $scope.item, {
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
                if (result) $scope.load(result.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(sizeClassId) {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/sizes/' + sizeClassId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.sizeClass = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/region-adjustments', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "sizeClassId": sizeClassId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    $scope.classifications = [];
    $scope.categories = [];
    $scope.subtypes = [];
    $scope.sizeclasses = [];
    $scope.selection = {};
    $scope.getClassifications = function getClassifications() {
        $scope.classifications = [];
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.classificationId = null;
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/classifications", {
                timeout: canceler.promise,
                "withCredentials": true,
            })
            .then(function(response) {
                $scope.classifications = response.data;
            });
    }

    $scope.getCategories = function getCategories() {
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/categories", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId
                }
            })
            .then(function(response) {
                $scope.categories = response.data;
            });
    }

    $scope.getSubtypes = function getSubtypes() {
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/subtypes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId
                }
            })
            .then(function(response) {
                $scope.subtypes = response.data;
            });
    }

    $scope.getSizeClasses = function getSizeClasses() {
        $scope.sizeclasses = [];
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/sizes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId,
                    "subtypeId": $scope.selection.subtypeId
                }
            })
            .then(function(response) {
                $scope.sizeclasses = response.data;
            });
    }

    // Get initial classifications
    $scope.getClassifications();
}

function ConditionAdjustmentsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["sizeClassId", "condition", "adjustmentFactor"];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "sizeClassId" },
        { name: "condition" },
        { name: "adjustmentFactor" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-condition-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "sizeClassId": item.sizeClassId,
                    "condition": item.condition,
                    "adjustmentFactor": item.adjustmentFactor
                };
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/condition-adjustments", $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/condition-adjustments", {
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
            .then(function(data) {
                if (data) $scope.load(item.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(sizeClass) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-condition-adjustment.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "sizeClassId": sizeClass.sizeClassId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/condition-adjustments", $scope.item, {
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
                if (result) $scope.load(result.sizeClassId);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.load = function(sizeClassId) {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/taxonomy/sizes/' + sizeClassId, {
                timeout: canceler.promise,
                "withCredentials": true
            })
            .then(function(response) {
                $scope.sizeClass = response.data;
                return $http.get(ENV['API_URL'] + '/analyst/condition-adjustments', {
                    timeout: canceler.promise,
                    "withCredentials": true,
                    params: {
                        "sizeClassId": sizeClassId
                    },
                })
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    $scope.classifications = [];
    $scope.categories = [];
    $scope.subtypes = [];
    $scope.sizeclasses = [];
    $scope.selection = {};
    $scope.getClassifications = function getClassifications() {
        $scope.classifications = [];
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.classificationId = null;
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/classifications", {
                timeout: canceler.promise,
                "withCredentials": true,
            })
            .then(function(response) {
                $scope.classifications = response.data;
            });
    }

    $scope.getCategories = function getCategories() {
        $scope.categories = [];
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.categoryId = null;
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/categories", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId
                }
            })
            .then(function(response) {
                $scope.categories = response.data;
            });
    }

    $scope.getSubtypes = function getSubtypes() {
        $scope.subtypes = [];
        $scope.sizeclasses = [];
        $scope.selection.subtypeId = null;
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/subtypes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId
                }
            })
            .then(function(response) {
                $scope.subtypes = response.data;
            });
    }

    $scope.getSizeClasses = function getSizeClasses() {
        $scope.sizeclasses = [];
        $scope.selection.sizeclass = null;
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/sizes", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "classificationId": $scope.selection.classificationId,
                    "categoryId": $scope.selection.categoryId,
                    "subtypeId": $scope.selection.subtypeId
                }
            })
            .then(function(response) {
                $scope.sizeclasses = response.data;
            });
    }

    // Get initial classifications
    $scope.getClassifications();
}

function ManufacturerVinsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["vinManufacturerCode", "vinYearCode", "modelYear", "shortVin", "cicCode"];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    $scope.load = function(manufacturerId) {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/manufacturer-vins', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "manufacturerId": $scope.manufacturer.manufacturerId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function ManufacturerAliasesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["manufacturerId", "manufacturerAlias"];
    }

    $scope.manufacturer = null;

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

    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "manufacturerId" },
        { name: "manufacturer" },
        { name: "alias", field: "manufacturerAlias" },
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
                    "manufacturerAlias": item.manufacturerAlias
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

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    $scope.load = function() {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/manufacturer-aliases', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "manufacturerId": $scope.manufacturer.manufacturerId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }
}

function ModelAliasesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["modelId", "modelAlias"];
    }

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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "modelId", width: 100 },
        { name: "alias", field: "modelAlias", width: '*' },
        { name: "lastModified", width: 200, field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", width: 200, field: "user" }
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
                    "modelAlias": item.modelAlias
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

    $scope.load = function() {
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/model-aliases', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "modelId": $scope.model.modelId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    var cancelSearchModel = $q.defer();
    $scope.searchModel = function(model) {
        cancelSearchModel.resolve();
        cancelSearchModel = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/models", {
                timeout: cancelSearchModel.promise,
                "withCredentials": true,
                params: {
                    "model": model,
                    "manufacturerId": $scope.manufacturer.manufacturerId
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

}

function SpecsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return [
            "configurationId",
            "specName",
            "specNameFriendly",
            "specValue",
            "specUom",
            "specFamily",
            "specDescription"
        ];
    }

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

    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "specFamily" },
        { name: "specNameFriendly" },
        { name: "specName" },
        { name: "specValue", cellTooltip: true },
        { name: "specUom" },
        { name: "specDescription", cellTooltip: true },
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

    $scope.edit = function(item) {
        var manufacturer = $scope.configuration.manufacturerName;
        var model = $scope.configuration.modelName;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-spec.html',
            controller: function($scope, $http) {
                $scope.title = [item.modelYear, manufacturer, model].join(' ');
                $scope.item = angular.copy(item);
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/specs/" + $scope.item.id, $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/specs/" + $scope.item.id, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close({
                                "configurationId": item.configurationId
                            });
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

    $scope.add = function(configurationId) {
        var manufacturer = $scope.configuration.manufacturerName;
        var model = $scope.configuration.modelName;
        var modelYear = $scope.configuration.modelYear;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-spec.html',
            controller: function($scope, $http) {
                $scope.title = [modelYear, manufacturer, model].join(' ');
                $scope.item = {
                    configurationId: configurationId
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/specs", $scope.item, {
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
}

function OptionsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["sizeClassId", "optionFamilyId", "modelYear", "optionName", "optionValue"];
    }
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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "optionName" },
        { name: "optionValue" },
        { name: "optionFamilyId" },
        { name: "optionFamilyName" },
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

    $scope.edit = function(item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-option.html',
            controller: function($scope, $http) {
                $scope.item = angular.copy(item);
                $scope.save = function() {
                    $http.put(ENV['API_URL'] + "/analyst/options/" + $scope.item.id, $scope.item, {
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
                    $http.delete(ENV['API_URL'] + "/analyst/options/" + $scope.item.id, {
                            timeout: canceler.promise,
                            "withCredentials": true,
                        })
                        .then(function(response) {
                            $scope.$close({
                                "sizeClassId": item.sizeClassId,
                                "modelYear": item.modelYear
                            });
                        })
                        .catch(function(err) {
                            $scope.$dismiss(err);
                        });
                }
            }
        });
        modalInstance.result
            .then(function(result) {
                if (result) $scope.load(result.sizeClassId, result.modelYear);
            })
            .catch(function(err) {
                console.log(err)
            });
    }

    $scope.add = function(sizeClassId, year) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-option.html',
            controller: function($scope, $http) {
                $scope.item = {
                    "sizeClassId": sizeClassId,
                    "modelYear": year
                };
                $scope.save = function() {
                    $http.post(ENV['API_URL'] + "/analyst/options", $scope.item, {
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
                if (result) $scope.load(result.sizeClassId, result.modelYear);
            })
            .catch(function(err) {
                console.log(err)
            });
    }
}

function ValuesController(ENV, $scope, $http, $q, $uibModal) {
    $scope.getHeader = function() {
        return ["configurationId", "askingPrice", "auctionPrice", "msrp", "low", "high", "finance", "wholesale", "retail", "tradeIn", "revisionDate"];
    }
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
    $scope.gridOptions.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "configurationId", width: 150 },
        { name: "modelYear", width: 150 },
        { name: "revisionDate", width: 150 },
        { name: "msrp", width: 100, enableFiltering: false },
        { name: "finance", width: 100, enableFiltering: false },
        { name: "retail", width: 100, enableFiltering: false },
        { name: "wholesale", width: 100, enableFiltering: false },
        { name: "tradeIn", width: 100, enableFiltering: false },
        { name: "askingPrice", width: 150, enableFiltering: false },
        { name: "auctionPrice", width: 150, enableFiltering: false },
        { name: "low", width: 100, enableFiltering: false },
        { name: "high", width: 100, enableFiltering: false },
        { name: "lastModified", width: 250, field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", width: 250, field: "user" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.edit = function(item) {
        var model = $scope.model.modelName;
        var manufacturer = $scope.manufacturer.manufacturerName;
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-value.html',
            controller: function($scope, $http) {
                $scope.title = [item.modelYear, manufacturer, model].join(' ');
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

    $scope.load = function() {
        $scope.configuration = null;
        $scope.gridOptions.data = [];
        $http.get(ENV['API_URL'] + '/analyst/values', {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "modelId": $scope.model.modelId
                },
            })
            .then(function(response) {
                $scope.gridOptions.data = response.data;
            });
    }

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    var cancelSearchModel = $q.defer();
    $scope.searchModel = function(model) {
        cancelSearchModel.resolve();
        cancelSearchModel = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/models", {
                timeout: cancelSearchModel.promise,
                "withCredentials": true,
                params: {
                    "model": model,
                    "manufacturerId": $scope.manufacturer.manufacturerId
                }
            })
            .then(function(response) {
                return response.data;
            });
    }
}

function TaxonomyController(ENV, $scope, $http, $q, $uibModal) {
    $scope.selection = {};
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
    $scope.classificationsGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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
    $scope.categoriesGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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
    $scope.subtypesGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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
    $scope.sizeclassesGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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
    $scope.manufacturersGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
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
    $scope.modelsGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "modelId" },
        { name: "modelName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.modelsGrid.data = [];


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

    $scope.getClassifications();
}

function ConfigurationsController(ENV, $scope, $http, $q, $uibModal) {
    $scope.selection = {};
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
    $scope.configurationsGrid.columnDefs = [{
            name: '',
            field: 'name',
            enableColumnMenu: false,
            enableFiltering: false,
            enableHiding: false,
            enableSorting: false,
            width: '50',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}.</div>'
        },
        { name: "configurationId" },
        { name: "sizeClassId" },
        { name: "modelId" },
        { name: "modelYear" },
        { name: "vinModelNumber" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.configurationsGrid.data = [];
    var canceler = $q.defer();
    $scope.update = function update() {
        $scope.configurationsGrid.data = [];
        $http.get(ENV['API_URL'] + "/analyst/taxonomy/configurations", {
                timeout: canceler.promise,
                "withCredentials": true,
                params: {
                    "modelId": $scope.selection.model.modelId
                }
            })
            .then(function(response) {
                $scope.configurationsGrid.data = response.data;
            });
    }

    var cancelSearchManufacturer = $q.defer();
    $scope.searchManufacturer = function(manufacturer) {
        cancelSearchManufacturer.resolve();
        cancelSearchManufacturer = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/manufacturers", {
                timeout: cancelSearchManufacturer.promise,
                "withCredentials": true,
                params: {
                    "manufacturer": manufacturer
                }
            })
            .then(function(response) {
                return response.data;
            });
    }

    var cancelSearchModel = $q.defer();
    $scope.searchModel = function(model) {
        cancelSearchModel.resolve();
        cancelSearchModel = $q.defer();
        return $http.get(ENV['API_URL'] + "/analyst/search/models", {
                timeout: cancelSearchModel.promise,
                "withCredentials": true,
                params: {
                    "model": model,
                    "manufacturerId": $scope.selection.manufacturer.manufacturerId
                }
            })
            .then(function(response) {
                return response.data;
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


    $scope.getHeader = function() {
        return [
            "configurationId",
            "sizeClassId",
            "modelId",
            "modelYear",
            "vinModelNumber"
        ]
    }
}

function MainController(ENV, $scope, $location, SessionService) {
    $scope.getUser = SessionService.getUser;
    $scope.getTitle = function() {
        switch ($location.path()) {
            case '/taxonomy':
                return "Taxonomy";
            case '/configurations':
                return "Configurations";
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
            case '/condition-adjustments':
                return "Condition Adjustments";
            case '/region-adjustments':
                return "Region Adjustments";
            case '/utilization-adjustments':
                return "Utilization Adjustments";
            case '/popularity':
                return "Popularity";
            case '/usage':
                return "Usage";
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