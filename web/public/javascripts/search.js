
function TaskCtrl($scope, $http, $window) {

    $scope.places = [];

    $scope.search = function() {
        var query = {
            "query": $scope.queryText
        };
        $http.post('/api/v1/Places/search', query).
              success(function(data){
                $scope.places = data.results;
                $scope.queryText = "";
              }).
              error(function(data) {
                alert("Unable to find any results.");
              });
    };

}

