/* global _, angular, i18n */
'use strict';

var controllers = angular.module('acs.controllers', []);

controllers.controller('root', ['$scope', '$location', '$q', 'user', function($scope, $location, $q, user) {

    $scope.loaded = false;
    $scope.user = user;
    $scope.permissions = {};
    $scope.waiting = false;

    $scope.init = function() {
        if (!user.loggedIn()) {
            $scope.loaded = true;
            return;
        }

        var promises = [];

        promises.push(user.permissions('administrator')
        .then(function(permissions) {
            $scope.permissions.administrator = permissions;
        }));
    
        promises.push(user.permissions('user')
        .then(function(permissions) {
            $scope.permissions.users = permissions;
        }));
    
        promises.push(user.permissions('role')
        .then(function(permissions) {
            $scope.permissions.roles = permissions;
        }));
        
        $q.all(promises)
        .then(function() {
            $scope.loaded = true;
        }, function() {
            $scope.loaded = true;
        });
    };

    $scope.active = function(path) {
        return $location.path().match(new RegExp(path + '.*', 'i')) != null;
    };

    $scope.logout = function() {
        $scope.user.clear();
        window.location.reload();
    };
    
}]);

controllers.controller('navigation', ['$scope', '$location', 'user', function($scope, $location, user) {

    $scope.user = user;

    $scope.navigation = function() {
        if ($scope.active('/administrator') && user.loggedIn()) {
            return 'pages/navigation/navigation-administrator.html';
        } else {
            return 'pages/navigation/navigation.html';
        }
    };
    
}]);

controllers.controller('login', ['$scope', '$location', '$http', '$window', 'alerts', 'user', function($scope, $location, $http, $window, alerts, user) {

    $scope.alerts = alerts;
    $scope.input = {};

    $scope.login = function() {
        $scope.waiting = true;
        $http.post('api/user/login', {
            email: $scope.input.email,
            password: $scope.input.password
        }).success(function(data) {
            $scope.waiting = false;
            if (data.status) {
                user.setEmail(data.email);
                user.setToken(data.token);
                $location.path('home');
                $window.location.reload();
            } else {
                if (_.isEmpty(data.errors)) {
                    data.errors = i18n.t('fill_out_login');
                }
                _.forEach(data.errors, function(error) {
                    if (error != null) {
                        alerts.fail(i18n.s(error.type, error.field));
                    }
                });
            }
        });
    };

}]);

controllers.controller('register', ['$scope', '$location', '$http', 'alerts', function($scope, $location, $http, alerts) {

    $scope.alerts = alerts;
    $scope.input = {};

    $scope.register = function() {
        $scope.waiting = true;
        if ($scope.input.password != $scope.input.confirmation) {
            alerts.fail(i18n.t('passwords_not_match'));
            $scope.waiting = false;
            return;
        }
        $http.post('api/user/register', {
            email: $scope.input.email,
            password: $scope.input.password
        }).success(function(data) {
            $scope.waiting = false;
            if (data.status) {
                alerts.success(i18n.t('you_may_login'));
                $location.path('login');
            } else {
                if (_.isEmpty(data.errors)) {
                    data.errors = '';
                }
                _.forEach(data.errors, function(error) {
                    if (error != null) {
                        alerts.fail(i18n.s(error.type, error.field));
                    }
                });
            }
        });
    };

}]);

controllers.controller('home', ['$scope', '$location', '$http', 'user', function($scope, $location, $http, user) {

    $scope.user = user;

}]);

controllers.controller('administrator', ['$scope', '$location', '$http', 'user', function($scope, $location, $http, user) {

    $scope.user = user;
    
    $scope.information = function() {
        $http.post('api/user/information', {
            token: $scope.user.token
        }).success(function(data) {
            if (data.status) {
                alert(data.message);
            } else {
            }
        });
    };

}]);

controllers.controller('users', ['$scope', '$location', '$http', 'user', 'alerts', 'ngTableParams', function($scope, $location, $http, user, alerts, ngTableParams) {

    $scope.user = user;
    $scope.alerts = alerts;
    $scope.tableLoaded = false;

    $scope.delete = function(id) {
        $http.post('api/user/delete', {
            token: $scope.user.getToken(),
            id: id
        }).success(function(data) {
            if (data.status) {
                $scope.tableParams.reload();
                $scope.alerts.success(i18n.t('user_delete'));
                $scope.alerts.success('User successfully deleted.');
            } else {
                $scope.alerts.fail(data.errors);
            }
        });
    };

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            id: 'asc'
        }
    }, {
        total: 0,
        getData: function($defer, params) {
            $http.post('api/user/table', {
                token: $scope.user.getToken(),
                params: JSON.stringify(params.$params)
            }).success(function(data) {
                params.total(data.total);
                $defer.resolve(data.users);
                $scope.tableLoaded = true;
            });
        }
    });

}]);

controllers.controller('user', ['$scope', '$timeout', '$location', '$http', '$routeParams', 'user', 'alerts', 'ngTableParams', function($scope, $timeout, $location, $http, $routeParams, user, alerts, ngTableParams) {

    $scope.user = user;
    $scope.alerts = alerts;
    $scope.input = {user: {roles: []}};

    $scope.read = function() {
        $http.post('api/user/read', {
            token: $scope.user.getToken(),
            id: $routeParams.id
        }).success(function(data) {
            if (data.status) {
                $scope.input = {user: data.user};
                $scope.tableParams.reload();
            }
        });
    };

    $scope.update = function(close) {
        $http.post('api/user/update', {
            token: $scope.user.getToken(),
            user: JSON.stringify($scope.input.user)
        }).success(function(data) {
            if (data.status) {
                if (_.isUndefined(close)) {
                    $scope.input = {user: data.user};
                    $scope.tableParams.reload();
                } else {
                    $location.path('administrator/users');
                }
                $scope.alerts.success(i18n.t('user_updated'));
            } else {
                _.forEach(data.errors, function(error) {
                    if (error != null) {
                        alerts.fail(i18n.s(error.type, error.field));
                    }
                });
            }
        });
    };

    $scope.getRoles = function() {
        $http.post('api/role/table', {
            token: $scope.user.getToken(),
            params: '{}'
        }).success(function(data) {
            if (data.status) {
                $scope.roles = data.roles;
            }
        });
    };

    $scope.addRole = function(role) {
        if (_.isEmpty(role)) {
            alerts.fail(i18n.t('enter_role_name'));
            return;
        }
        role = JSON.stringify(role.toLowerCase()).replace(/\W/g, '').trim();
        if (_.isEmpty(role)) {
            alerts.fail(i18n.t('enter_role_name'));
            return;
        }
        $scope.input.user.roles.push(role);
        $scope.tableParams.reload();
    };

    $scope.deleteRole = function(role) {
        $scope.input.user.roles = _.without($scope.input.user.roles, role);
        $scope.tableParams.reload();
    };
    
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            role: 'asc'
        }
    }, {
        total: 0,
        getData: function($defer, params) {
            params.total($scope.input.user.roles.length);
            $defer.resolve($scope.input.user.roles);
        }
    });

    $scope.cancel = function() {
        $location.path('administrator/users');
    };
    
}]);

controllers.controller('roles', ['$log', '$scope', '$location', '$http', 'user', 'alerts', 'ngTableParams', function($log, $scope, $location, $http, user, alerts, ngTableParams) {

    $scope.user = user;
    $scope.alerts = alerts;
    $scope.input = {};
    $scope.tableLoaded = false;

//    $scope.tableParams = new ngTableParams({
//        page: 1,
//        count: 10,
//        sorting: {
//            role: 'asc'
//        }
//    }, {
//        total: 0,
$scope.roles = {
        getData: function($defer, params) {
            $http.post('api/role/table', {
                token: $scope.user.getToken(),
                params: JSON.stringify(params.$params)
            }).success(function(data) {
                
                params.total(data.total);
                $defer.resolve(data.roles);
                $scope.tableLoaded = true;
            });
        }
    };
    $log.info($scope.roles);

    $scope.addRole = function(role) {
        if (_.isEmpty(role)) {
            alerts.fail(i18n.t('enter_role_name'));
            return;
        }
        role = JSON.stringify(role.toLowerCase()).replace(/\W/g, '').trim();
        if (_.isEmpty(role)) {
            alerts.fail(i18n.t('enter_role_name'));
            return;
        }
        $http.post('api/role/create', {
            token: $scope.user.getToken(),
            role: role
        }).success(function(data) {
            if (data.status) {
                $scope.tableParams.reload();
                $scope.alerts.success(i18n.t('role_added'));
            } else {
                _.forEach(data.errors, function(error) {
                    if (error != null) {
                        alerts.fail(i18n.s(error.type, error.field));
                    }
                });
            }
        });
    };

    $scope.deleteRole = function(role) {
        $http.post('api/role/delete', {
            token: $scope.user.getToken(),
            role: role
        }).success(function(data) {
            if (data.status) {
                $scope.tableParams.reload();
                $scope.alerts.success(i18n.t('role_deleted'));
            } else {
                _.forEach(data.errors, function(error) {
                    if (error != null) {
                        alerts.fail(i18n.s(error.type, error.field));
                    }
                });
            }
        });
    };

}]);

controllers.controller('role', ['$scope', '$location', '$http', '$routeParams', 'user', 'alerts', 'ngTableParams', function($scope, $location, $http, $routeParams, user, alerts, ngTableParams) {

    $scope.user = user;
    $scope.alerts = alerts;
    $scope.input = {resources: []};
    $scope.updateCount = 0;

    $scope.update = function(close) {
        $scope.failCount = 0;
        _.forEach($scope.input.resources, function(resource) {
            $scope.updateCount += 1;
            $http.post('api/role/update', {
                token: $scope.user.getToken(),
                role: $routeParams.role,
                resource: resource.name,
                permissions: JSON.stringify(resource.permissions)
            }).success(function(data) {
                if (!data.status) {
                    $scope.failCount += 1;
                    $scope.errors = data.errors;
                }
                $scope.updateCount -= 1;
                if ($scope.updateCount == 0) {
                    if (_.isUndefined(close)) {
                        $scope.tableParams.reload();
                    } else {
                        $location.path('administrator/roles');
                    }
                    if ($scope.failCount) {
                        _.forEach($scope.errors, function(error) {
                            if (error != null) {
                                alerts.fail(i18n.s(error.type, error.field));
                            }
                        });
                    } else {
                        alerts.success(i18n.t('role_updated'));
                    }
                }
            });
        });
    };

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            resource: 'asc'
        }
    }, {
        total: 0,
        getData: function($defer, params) {
            $http.post('api/resource/table', {
                token: $scope.user.getToken(),
                params: JSON.stringify(params.$params),
                role: $routeParams.role
            }).success(function(data) {
                $scope.input.resources = data.resources;
                params.total(data.total);
                $defer.resolve(data.resources);
            });
        }
    });

    $scope.cancel = function() {
        $location.path('administrator/roles');
    };

}]);

controllers.controller('congregationController', function ($scope, $http, Api, $location, popupService) {
    $scope.page = {title: 'Congregations'};
    $scope.congregations = Api.Congregations.query();
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.destroy = function (congregation) {
                if (popupService.showPopup('Really delete this congregation?')) {
                        congregation.$remove(function (congregation) {
                $scope.congregations.splice($scope.congregations.indexOf(congregation), 1);
                                $location.path('/congregations');
                        });
                }
        }
});


controllers.controller('createCongregationController', function ($scope, $http, $location, Api) {
    $scope.page = {title: 'Add New Congregation'};
    $scope.save = function () {
        Api.Congregations.insert($scope.congregations, function (congregation) {
            $location.path('/congregations/edit/' + congregation.id);
        });
    };
});

controllers.controller('editCongregationController', function ($routeParams, $scope, $http, $location, Api) {
    $scope.page = {title: 'Edit Congregation'};

    Api.Congregations.get({id: $routeParams.id}, function (congregations) {
        $scope.congregations = new Api.Congregations(congregations);
    });

    $scope.isClean = function (congregations) {
        return angular.equals(congregations, $scope.congregations);
    };

    $scope.destroy = function () {
        $scope.congregations.destroy(function () {
            $location.path('/congregations');
        });
    };

    $scope.save = function () {
        Api.Congregations.update($scope.congregations, function () {
            $location.path('/congregations');
        });
    };
});

controllers.service('popupService', function ($window) {
        this.showPopup = function (message) {
                return $window.confirm(message);
        }
});

controllers.controller('speakerController', function ($scope, $http, Api, $location, popupService) {
    $scope.page = {title: 'Speakers'};
    $scope.speakers = [];
    $scope.speakers = Api.Speakers.query();
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.destroy = function (speaker) {
                if (popupService.showPopup('Really delete this speaker?')) {
                        speaker.$remove(function (speaker) {
                $scope.speakers.splice($scope.speakers.indexOf(speaker), 1);
                                $location.path('/administrator/speakers');
                        });
                }
        }
});

controllers.controller('createSpeakerController', function ($scope, $http, $location, $log, Api) {
    $scope.page = {title: 'Add New Speaker'};
    $scope.speaker = {};
    $scope.congregations = Api.Congregations.query();
    $scope.allOutlines = Api.Outlines.query({});
    $scope.$watch('selectedOutlines', function (newValue, oldValue) {
        var json = {};
        var newOutlines = [];
        angular.forEach(newValue, function (val, key) {
            json = {outline: val.outline, speaker: ''};
            newOutlines.push(json);
        });
        if (newOutlines.length == 0) {
            json = {outline: 0, speaker: ''};
            newOutlines.push(json);
        }
        $scope.selectedOutlines = newOutlines;
    }, true);
    $scope.$watch('selectedCongregation', function (newValue, oldValue) {
        if(newValue){
            $scope.speaker.congregation = newValue.id;
        }
    }, true);
    
    $scope.isClean = function (speaker) {
        return angular.equals(speaker, $scope.speaker);
    };
    
    $scope.save = function () {
        Api.Speakers.insert($scope.speaker, function(result){
        angular.forEach($scope.selectedOutlines, function (val, key) {
            $scope.selectedOutlines[key].speaker = result.id;
        });
        Api.SpeakerOutlines.insert($scope.selectedOutlines);
        $location.path('/administrator/speakers/edit/' + result.id);
        });
    };
});

controllers.controller('editSpeakerController', function ($routeParams, $scope, $location, Api, popupService, $log) {
    $scope.page = {title: 'Edit Speakers'};
    $scope.allOutlines = Api.Outlines.query();
    $log.info($scope.allOutlines);
    $scope.speaker = Api.Speakers.get({id: $routeParams.id}, function (speaker) {
        $scope.congregations = Api.Congregations.query();
        $scope.selectedCongregation = Api.Congregations.get({id: speaker.congregation});
        $scope.myOutlines = Api.SpeakerOutlines.get({speaker: speaker.id}, function (myOutlines) {
            $scope.allOutlines = Api.Outlines.query({}, function (allOutlines) {
                
                angular.forEach(allOutlines, function (all, key1) {
                    angular.forEach(myOutlines, function (my, key2) {
                        if (all.outline == my.outline) {
                            all.ticked = true;
                        }
                    });
                });
            });
            
        });
    });

    $scope.$watch('selectedOutlines', function (newValue, oldValue) {
//        $log.info('ALL', $scope.allOutlines);
        var json = {};
        var newOutlines = [];
        angular.forEach(newValue, function (val, key) {
//            $log.info('being watched oldValue:', oldValue, 'newValue:', newValue);
            json = {speaker: $scope.speaker.id, outline: val.outline};
            newOutlines.push(json);
        });
        if (newOutlines.length == 0) {
            json = {speaker: $scope.speaker.id, outline: 0};
            newOutlines.push(json);
        }
        $scope.selectedOutlines = newOutlines;
//        $log.info(newOutlines.length);


    }, true);

    $scope.isClean = function (speaker) {
        return angular.equals(speaker, $scope.speaker);
    };

    $scope.destroy = function (speaker) {
            if (popupService.showPopup('Really delete this speaker?')) {
                speaker.$remove(function () {
                        $location.path('/administrator/speakers');
                });
            }
    }

    $scope.save = function () {
        $scope.speaker.congregation = $scope.selectedCongregation.id;
        Api.SpeakerOutlines.insert($scope.selectedOutlines);
        Api.Speakers.update($scope.speaker);
        $location.path('/administrator/speakers');
    };

});