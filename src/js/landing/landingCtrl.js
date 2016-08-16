module.exports = function($scope, $state, $q, $log, principal, projects) {
    $scope.projects = [];
    $scope.loadComplete = false;

    projects.list().then(function(result) {
        $scope.projects = result.data;
        $scope.loadComplete = true;
    });
};
