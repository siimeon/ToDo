// Intializing app
var app = angular.module('app', []);
// Main controller
app.controller('main_controller', function ($scope, $http) {
  $scope.header = "What to do next?";
  $scope.tasks = ["Need to do something", "Need to do something else", "Need to do yet another thing"];
  $scope.text = "";
  
  $http.get('/get_json').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      $scope.tasks = data
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("Error occured");
    });
  
  $scope.add_task = function() {
    console.log($scope.text);
    $scope.tasks.push($scope.text);
    $scope.text = "";
    $http.post('/set_json', $scope.tasks).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };
  
  $scope.do_task = function(value, index) {
    console.log(value);
    console.log(index);
    $scope.tasks.splice(index, 1);
    $http.post('/set_json', $scope.tasks).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };
});