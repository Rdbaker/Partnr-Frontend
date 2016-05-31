module.exports = function() {
  return {
    restrict: 'AE',
    template: "<div ng-include='contentUrl'></div>",
    scope: {
      connection_status: '=connectionStatus'
    },
    link: function($scope, elem) {
      if(!$scope.connection_status)
        $scope.connection_status = 'connect';

      $scope.contentUrl = '/shared/connection/connection_' + $scope.connection_status + '_btn.html';

      $scope.sendRequest = function() {
        console.log('sending connection request');
      };

      $scope.deleteConnection = function() {
        console.log('deleting connection');
      };

      $scope.approveRequest = function() {
        console.log('sending connection approval');
      };
    }
  }
};
