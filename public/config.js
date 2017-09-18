angular.module('PriceDigests').config(["ENV", "$routeProvider", "$httpProvider", function (ENV, $routeProvider, $httpProvider) {
    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                if (response.status === 401 || (response.status <= 0 && response.config.url === (ENV['API_URL'] + "/"))) {
                    var next = $location.url();
                    $location.url('/login');
                    $location.search('next', next);
                }
                return $q.reject(response);
            }
        };
    });
    $httpProvider.interceptors.push('jwtInjector');
    var checkLoggedin = function ($q, $timeout, $http) {
        // Initialize a new promise
        var deferred = $q.defer();
        // Make an AJAX call to check if the user is logged in
        var url = ENV['API_URL'] + "/analyst/";
        $http.get(url, {
            "withCredentials": true
        })
            .then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });
        return deferred.promise;
    };
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .when('/logout', {
            templateUrl: 'login.html',
            controller: 'LogoutController'
        })
        .when('/taxonomy', {
            templateUrl: 'taxonomy.html',
            controller: 'TaxonomyController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/configurations', {
            templateUrl: 'configurations.html',
            controller: 'ConfigurationsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/model/alias', {
            templateUrl: 'model-aliases.html',
            controller: 'ModelAliasesController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/manufacturer/alias', {
            templateUrl: 'manufacturer-aliases.html',
            controller: 'ManufacturerAliasesController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/manufacturer/vins', {
            templateUrl: 'manufacturer-vins.html',
            controller: 'ManufacturerVinsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/values', {
            templateUrl: 'values.html',
            controller: 'ValuesController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/options', {
            templateUrl: 'options.html',
            controller: 'OptionsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/specs', {
            templateUrl: 'specs.html',
            controller: 'SpecsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/condition-adjustments', {
            templateUrl: 'condition-adjustments.html',
            controller: 'ConditionAdjustmentsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/region-adjustments', {
            templateUrl: 'region-adjustments.html',
            controller: 'RegionAdjustmentsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/utilization-adjustments', {
            templateUrl: 'utilization-adjustments.html',
            controller: 'UtilizationAdjustmentsController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/popularity', {
            templateUrl: 'popularity.html',
            controller: 'PopularityController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/usage', {
            templateUrl: 'usage.html',
            controller: 'UsageController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/sync', {
            templateUrl: 'sync.html',
            controller: 'SyncController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/import', {
            templateUrl: 'import.html',
            controller: 'ImportController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/export', {
            templateUrl: 'export.html',
            controller: 'ExportController',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .otherwise({
            redirectTo: '/taxonomy'
        });
}]);