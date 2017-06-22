/* global jwt_decode  */

angular.module('PriceDigests')
    .service('SessionService', ['$window', sessionService])
    .service('LoginService', ['ENV', "$http", 'SessionService', loginService])
    .factory('jwtInjector', ['SessionService', jwtInjector]);

function loginService(ENV, $http, SessionService) {
    var self = this;
    self.login = function(credentials) {
        return $http.post(ENV['API_URL'] + "/analyst/login", {
            username: credentials.username,
            password: credentials.password,
        }).then(function(response) {
            SessionService.setToken(response.data);
        });
    }
    self.status = SessionService.getStatus()
}

function sessionService($window) {
    var self = this;
    var memToken = "";
    self.getStatus = function() {
        if ($window.Storage && $window.localStorage) {
            try {
                $window.localStorage.getItem("token");
                return "Your log in session will be active for 24hrs, or until you close your browser."
            } catch (e) {
                return "Your browser security settings will require you to log in after any page refresh."
            }
        } else {
            return "Your browser security settings require you to log in after any page refresh."
        }
    }
    self.getUser = function() {
        if ($window.Storage && $window.localStorage) {
            try {
                var token = $window.localStorage.getItem("token");
                if (token) return jwt_decode(token);
                else return null;
            } catch (e) {
                if (memToken) return jwt_decode(memToken);
                else return null;
            }
        } else {
            if (memToken) return jwt_decode(memToken);
            else return null;
        }
    }
    self.getToken = function() {
        if ($window.Storage && $window.localStorage) {
            try {
                var token = $window.localStorage.getItem("token");
                return token;
            } catch (e) {
                return memToken;
            }
        } else {
            return memToken;
        }
    }
    self.setToken = function(token) {
        if ($window.Storage) {
            try {
                $window.localStorage.setItem("token", token);
                // Set both in case security settings are changed within session
                memToken = token;
            } catch (e) {
                memToken = token;
            }
        } else {
            memToken = token;
        }
    }
    self.logout = function() {
        if ($window.Storage) {
            try {
                $window.localStorage.setItem("token", "");
                // Set both in case security settings are changed within session
                memToken = "";
            } catch (e) {
                memToken = "";
            }
        } else {
            memToken = "";
        }
    }
}

function jwtInjector(SessionService) {
    var jwtInjector = {
        request: function(config) {
            if (config.withCredentials === true) config.headers.Authorization = 'Bearer ' + SessionService.getToken();
            return config;
        }
    };
    return jwtInjector;
}