
function TaskCtrl($scope, $http, $window) {

    $scope.tasks = [];
    $scope.editing = false;

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
                $scope.tasks.push(data);
                $scope.taskText = "";
              }).
              error(function(data) {
                alert("Unable to save task.");
              });
    };

    $scope.updateTask = function(task) {
        $http.put('/api/v1/Tasks/' + task._id, task).
            success(function(data){
                $scope.editing = false;
            }).
            error(function(data) {
                alert("Unable to save task.");
            });
        $scope.editing = false;
    }

    $scope.removeTask = function(index) {
        var task = $scope.tasks[index];
        $http.delete('/api/v1/Tasks/' + task._id).
              success(function(data) {
                $scope.tasks.splice(index, 1);
              }).
              error(function(data) {
                 alert("Unable to delete task.");
              });
    }

}

