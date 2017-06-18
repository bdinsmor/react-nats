angular.module('PriceDigests')
    .controller('LoginController', ['ENV', '$scope', '$location', 'LoginService', loginController])
    .controller('LogoutController', ['ENV', '$scope', '$location', 'SessionService', logoutController])
    .controller('MainController', ['ENV', '$scope', '$location', 'SessionService', MainController])
    .controller('ValuesController', ['ENV', '$scope', '$http', '$q', ValuesController])
    .controller('OptionsController', ['ENV', '$scope', '$http', '$q', OptionsController])
    .controller('SpecsController', ['ENV', '$scope', '$http', '$q', SpecsController])
    .controller('ManufacturerAliasesController', ['ENV', '$scope', '$http', '$q', ManufacturerAliasesController])
    .controller('ManufacturerVinsController', ['ENV', '$scope', '$http', '$q', ManufacturerVinsController])
    .controller('ModelAliasesController', ['ENV', '$scope', '$http', '$q', ModelAliasesController])
    .controller('TaxonomyController', ['ENV', '$scope', '$http', '$q', '$uibModal', TaxonomyController])


function ManufacturerVinsController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false,
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        { name: "manufacturer" },
        { name: "modelYear" },
        { name: "vinManufacturerCode" },
        { name: "vinYearCode" },
        { name: "shortVin" },
        { name: "cicCode" },
        { name: "revisionDate" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(manufacturerId) {
        $http.get(ENV['API_URL'] + '/analyst/manufacturer/vins', {
                timeout: canceler.promise,
                params: {
                    "manufacturerId": manufacturerId
                },
            })
            .success(function(data) {
                data.forEach(function(element) {
                    element.revisionDate = element.revisionDate.split('T')[0]
                }, this);
                $scope.gridOptions.data = data;
            });
    }
}

function ManufacturerAliasesController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false
    };
    $scope.gridOptions.columnDefs = [
        { name: "manufacturer" },
        { name: "alias" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(manufacturerId) {
        $http.get(ENV['API_URL'] + '/analyst/manufacturer/alias', {
                timeout: canceler.promise,
                params: {
                    "manufacturerId": manufacturerId
                },
            })
            .success(function(data) {
                $scope.gridOptions.data = data;
            });
    }
}

function ModelAliasesController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false
    };
    $scope.gridOptions.columnDefs = [
        { name: "manufacturer" },
        { name: "model" },
        { name: "alias" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(modelId) {
        $http.get(ENV['API_URL'] + '/analyst/model/alias', {
                timeout: canceler.promise,
                params: {
                    "modelId": modelId
                },
            })
            .success(function(data) {
                $scope.gridOptions.data = data;
            });
    }
}

function SpecsController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false,
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        { name: "specFamily" },
        { name: "specNameFriendly" },
        { name: "specName" },
        { name: "specValue" },
        { name: "specUom" },
        { name: "specDescription" },
        { name: "revisionDate" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(configId) {
        $http.get(ENV['API_URL'] + '/analyst/specs', {
                timeout: canceler.promise,
                params: {
                    "configurationId": configId
                },
            })
            .success(function(data) {
                data.forEach(function(element) {
                    element.revisionDate = element.revisionDate.split('T')[0]
                }, this);
                $scope.gridOptions.data = data;
            });
    }
}

function OptionsController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false,
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        { name: "optionFamilyName" },
        { name: "optionName" },
        { name: "optionValue" },
        { name: "revisionDate" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(sizeClassId, modelYear) {
        $http.get(ENV['API_URL'] + '/analyst/options', {
                timeout: canceler.promise,
                params: {
                    "sizeClassId": sizeClassId,
                    "modelYear": modelYear
                },
            })
            .success(function(data) {
                data.forEach(function(element) {
                    element.revisionDate = element.revisionDate.split('T')[0]
                }, this);
                $scope.gridOptions.data = data;
            });
    }
}

function ValuesController(ENV, $scope, $http, $q) {
    $scope.gridOptions = {
        gridMenuShowHideColumns: false
    };
    $scope.gridOptions.columnDefs = [
        { name: "askingPrice" },
        { name: "auctionPrice" },
        { name: "msrp" },
        { name: "low" },
        { name: "high" },
        { name: "finance" },
        { name: "retail" },
        { name: "wholesale" },
        { name: "tradeIn" },
        { name: "revisionDate" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(configId) {
        $http.get(ENV['API_URL'] + '/analyst/values', {
                timeout: canceler.promise,
                params: {
                    "configurationId": configId
                },
            })
            .success(function(data) {
                data.forEach(function(element) {
                    element.revisionDate = element.revisionDate.split('T')[0]
                }, this);
                $scope.gridOptions.data = data;
            });
    }
}

function TaxonomyController(ENV, $scope, $http, $q, $uibModal) {
    $scope.classificationsGrid = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        enableSelectionBatchEvent: false,
        onRegisterApi: function(gridApi) {
            $scope.classificationsGridApi = gridApi;
        }
    };
    $scope.selectedClassification = function() {
        if ($scope.classificationsGridApi) {
            var rows = $scope.classificationsGridApi.selection.getSelectedRows();
            if (rows && rows.length > 0) return rows[0];
            else return null;
        } else return null;
    }
    $scope.classificationsGrid.columnDefs = [
        { name: "classificationId" },
        { name: "classificationName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.classificationsGrid.data = [];

    $scope.categoriesGrid = {
        gridMenuShowHideColumns: false
    };
    $scope.categoriesGrid.columnDefs = [
        { name: "categoryId" },
        { name: "categoryName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.categoriesGrid.data = [];

    $scope.subtypesGrid = {
        gridMenuShowHideColumns: false
    };
    $scope.subtypesGrid.columnDefs = [
        { name: "subtypeId" },
        { name: "subtypeName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.subtypesGrid.data = [];

    $scope.sizeclassesGrid = {
        gridMenuShowHideColumns: false
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
        gridMenuShowHideColumns: false
    };
    $scope.manufacturersGrid.columnDefs = [
        { name: "manufacturerId" },
        { name: "manufacturerName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.manufacturersGrid.data = [];

    $scope.modelsGrid = {
        gridMenuShowHideColumns: false
    };
    $scope.modelsGrid.columnDefs = [
        { name: "modelId" },
        { name: "modelName" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.modelsGrid.data = [];

    $scope.configurationsGrid = {
        gridMenuShowHideColumns: false
    };
    $scope.configurationsGrid.columnDefs = [
        { name: "configurationId" },
        { name: "modelId" },
        { name: "sizeClassId" },
        { name: "modelYear" },
        { name: "vinModelNumber" },
        { name: "lastModified", field: "ts", cellFilter: 'date:"medium"' },
        { name: "lastModifiedBy", field: "user" }
    ];
    $scope.configurationsGrid.data = [];

    $scope.getHeader = function() {
        return [
            "classificationId",
            "classificationName",
            "categoryId",
            "categoryName",
            "subtypeId",
            "subtypeName",
            "sizeClassId",
            "sizeClassName",
            "sizeClassMin",
            "sizeClassMax",
            "sizeClassUom",
            "manufacturerId",
            "manufacturerName",
            "modelId",
            "modelName",
            "configurationId",
            "modelYear",
            "vinModelNumber"
        ]
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

    $scope.editModel = function(id) {
        var modalInstance = $uibModal.open({
            templateUrl: 'edit-model.tpl.html'
        });
        modalInstance.result.then(function() {
            console.info('Modal dismissed at: ' + new Date());
        }, function() {
            console.info('Modal dismissed at: ' + new Date());
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