/* global angular, i18n */
'use strict';

var app = angular.module('acs', [
    'acs.filters', 
    'acs.services', 
    'acs.directives', 
    'acs.controllers', 
    'ngRoute', 
    'ui.bootstrap', 
    'ngTable',
    'ngResource',
    'angularUtils.directives.dirPagination',
    'isteven-multi-select'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

    $routeProvider.when('/home', {
        controller: 'home',
        templateUrl: 'pages/home/home.html'
    });

    $routeProvider.when('/administrator', {
        controller: 'administrator',
        templateUrl: 'pages/admin/administrator.html'
    });

    $routeProvider.when('/administrator/users', {
        controller: 'users',
        templateUrl: 'pages/auth/users.html'
    });

    $routeProvider.when('/administrator/user/:id', {
        controller: 'user',
        templateUrl: 'pages/auth/user.html'
    });

    $routeProvider.when('/administrator/roles', {
        controller: 'roles',
        templateUrl: 'pages/auth/roles.html'
    });
                
    $routeProvider.when('/administrator/role/:role', {
        controller: 'role',
        templateUrl: 'pages/auth/role.html'
    });

    $routeProvider.when('/login', {
        controller: 'login',
        templateUrl: 'pages/auth/login.html'
    });

    $routeProvider.when('/register', {
        controller: 'register',
        templateUrl: 'pages/auth/register.html'
    });

    $routeProvider.when('/administrator/congregations', {
        controller: 'congregationController',
        templateUrl: 'pages/congregations/browse.html'
    });

    $routeProvider.when('/administrator/congregations/edit/:id', {
        controller: 'editCongregationController',
        templateUrl: 'pages/congregations/edit.html'
    });

    $routeProvider.when('/administrator/congregations/new', {
        controller: 'createCongregationController',
        templateUrl: 'pages/congregations/create.html'
    });
    
    $routeProvider.when('/administrator/speakers', {
        controller: 'speakerController',
        templateUrl: 'pages/speakers/browse.html'
    });

    $routeProvider.when('/administrator/speakers/edit/:id', {
        controller: 'editSpeakerController',
        templateUrl: 'pages/speakers/edit.html'
    });

    $routeProvider.when('/administrator/speakers/new', {
        controller: 'createSpeakerController',
        templateUrl: 'pages/speakers/create.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/home'
    });

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
    
}]);

Array.prototype.contains = function(obj) {
    return this.indexOf(obj) > -1;
};