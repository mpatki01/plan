
function TaskCtrl($scope, $http, $window) {

    $scope.tasks = [];
    for (var i = 0; i < $window.initial.length; i++) {
        var task = $window.initial[i];
        $scope.tasks.push(task);
    }

    $scope.total = function() {
        return $scope.tasks.length;
    };

    $scope.addTask = function() {
        var task = {
            "name": $scope.taskText,
            "updated": Date.now()
        };
        $http.post('/api/v1/Tasks', task).
              success(function(data){
                $scope.tasks.push(task);
                $scope.taskText = "";
              }).
              error(function(data) {
                alert("Unable to save task.");
              });
    };

}

