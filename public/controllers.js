angular.module('PriceDigests')
    .controller('LoginController', ['ENV', '$scope', '$location', 'LoginService', loginController])
    .controller('LogoutController', ['ENV', '$scope', '$location', 'SessionService', logoutController])
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
        $http.get(ENV['API_URL'] + '/data/manufacturer/vins', {
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
        $http.get(ENV['API_URL'] + '/data/manufacturer/alias', {
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
        $http.get(ENV['API_URL'] + '/data/model/alias', {
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
        gridMenuShowHideColumns: false
    };
    $scope.gridOptions.columnDefs = [
        { name: "specName" },
        { name: "specNameFriendly" },
        { name: "specValue" },
        { name: "specUom" },
        { name: "specDescription" },
        { name: "specFamily" },
        { name: "revisionDate" }
    ];
    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.load = function(configId) {
        $http.get(ENV['API_URL'] + '/data/specs', {
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
        gridMenuShowHideColumns: false
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
        $http.get(ENV['API_URL'] + '/data/options', {
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
        $http.get(ENV['API_URL'] + '/data/values', {
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
    $scope.data = []
    $scope.selection = {};

    $scope.taxonomy = {};
    $scope.taxonomy.classifications = [];
    $scope.taxonomy.categories = [];
    $scope.taxonomy.subtypes = [];
    $scope.taxonomy.sizeclasses = [];
    $scope.taxonomy.manufacturers = [];

    var canceler = $q.defer();

    $scope.$on('$destroy', function() {
        canceler.resolve(); // Aborts the $http request if it isn't finished.
    });

    $scope.getClassifications = function getClassifications() {
        $scope.selection.classification = null;
        $scope.selection.category = null;
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $http.get(ENV['API_URL'] + "/data/taxonomy/classifications", {
                timeout: canceler.promise,
            })
            .then(function(response) {
                $scope.taxonomy.classifications = response.data
                $scope.data = response.data;
            });
    }

    $scope.getCategories = function getCategories() {
        $scope.selection.category = null;
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $http.get(ENV['API_URL'] + "/data/taxonomy/categories", {
                timeout: canceler.promise,
                params: {
                    "classificationId": $scope.selection.classification
                }
            })
            .then(function(response) {
                $scope.taxonomy.categories = response.data
                $scope.data = response.data;
            });
    }

    $scope.getSubtypes = function getSubtypes() {
        $scope.selection.subtype = null;
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $http.get(ENV['API_URL'] + "/data/taxonomy/subtypes", {
                timeout: canceler.promise,
                params: {
                    "classificationId": $scope.selection.classification,
                    "categoryId": $scope.selection.category
                }
            })
            .then(function(response) {
                $scope.taxonomy.subtypes = response.data
                $scope.data = response.data;
            });
    }

    $scope.getSizeClasses = function getSizeClasses() {
        $scope.selection.sizeclass = null;
        $scope.selection.manufacturer = null;
        $http.get(ENV['API_URL'] + "/data/taxonomy/sizes", {
                timeout: canceler.promise,
                params: {
                    "classificationId": $scope.selection.classification,
                    "categoryId": $scope.selection.category,
                    "subtypeId": $scope.selection.subtype
                }
            })
            .then(function(response) {
                $scope.taxonomy.sizeclasses = response.data
                $scope.data = response.data;
            });
    }

    $scope.getManufacturers = function getManufacturers() {
        $scope.selection.manufacturer = null;
        $http.get(ENV['API_URL'] + "/data/taxonomy/manufacturers", {
                timeout: canceler.promise,
                params: {
                    "sizeClassId": $scope.selection.sizeclass
                }
            })
            .then(function(response) {
                $scope.taxonomy.manufacturers = response.data
                $scope.data = response.data;
            });
    }
    $scope.getModels = function getModels() {
        $http.get(ENV['API_URL'] + "/data/taxonomy/models", {
                timeout: canceler.promise,
                params: {
                    "sizeClassId": $scope.selection.sizeclass,
                    "manufacturerId": $scope.selection.manufacturer
                }
            })
            .then(function(response) {
                $scope.data = response.data;
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