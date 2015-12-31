var controllers = angular.module('app.controllers', []);

controllers.controller('speakerController', function ($scope, $http, Api, $location) {
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
        if (newValue) {
            $scope.speaker.congregation = newValue.id;
        }
    }, true);

    $scope.isClean = function (speaker) {
        return angular.equals(speaker, $scope.speaker);
    };

    $scope.save = function () {
        Api.Speakers.insert($scope.speaker, function (result) {
            angular.forEach($scope.selectedOutlines, function (val, key) {
                $scope.selectedOutlines[key].speaker = result.id;
            });
            Api.SpeakerOutlines.insert($scope.selectedOutlines);
            $location.path('/administrator/speakers/edit/' + result.id);
        });
    };
});

controllers.controller('editSpeakerController', function ($stateParams, $scope, $location, Api, $log) {
    $scope.page = {title: 'Edit Speakers'};
    $scope.speaker = Api.Speakers.get($stateParams, function (speaker) {
        $scope.currentSpeaker = speaker;
        $scope.congregations = Api.Congregations.query();
        $scope.selectedCongregation = Api.Congregations.get({id: speaker.congregation});
//        $scope.myOutlines = Api.SpeakerOutlines.get({speaker: speaker.id}, function (myOutlines) {
//            $scope.allOutlines = Api.Outlines.query({}, function (allOutlines) {
//                angular.forEach(allOutlines, function (all, key1) {
//                    angular.forEach(myOutlines, function (my, key2) {
//                        if (all.outline == my.outline) {
//                            all.ticked = true;
//                        }
//                    });
//                });
//            });
//        });
    });

//    $scope.$watch('selectedOutlines', function (newValue, oldValue) {
////        $log.info('ALL', $scope.allOutlines);
//        var json = {};
//        var newOutlines = [];
//        angular.forEach(newValue, function (val, key) {
////            $log.info('being watched oldValue:', oldValue, 'newValue:', newValue);
//            json = {speaker: $scope.speaker.id, outline: val.outline};
//            newOutlines.push(json);
//        });
//        if (newOutlines.length == 0) {
//            json = {speaker: $scope.speaker.id, outline: 0};
//            newOutlines.push(json);
//        }
//        $scope.selectedOutlines = newOutlines;
////        $log.info(newOutlines.length);
//
//
//    }, true);

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