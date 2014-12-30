// Intializing app
var app = angular.module('app', []);
// Main controller
app.controller('main_controller', function ($scope, $http) {
  $scope.header = "What to do next?";
  $scope.logged = false;
  $scope.text = "";
  $scope.version = {app: "todo client", version: "0.1b"};
  
  // Error
  $scope.show_alert = false;
  $scope.error_msg = "";
  
  //authenticated
  
  //var hash = CryptoJS.SHA256("Message");
  //console.log(hash.toString());
  
  $http.get('/get_json').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(data);
      $scope.tasks = data
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("Error occured");
    });
  
  $http.get('/authenticated').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      if (data.result == "ok")
          $scope.logged = true;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("Error occured");
    });
  
  $scope.add_task = function() {
    $("#add_task").button('loading');
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks.push($scope.text);
    $http.post('/set_json', temp_tasks).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        
        if (data.status == "ok") {
          $scope.tasks = temp_tasks;
          $scope.text = "";
          $("#add_form").removeClass("has-error");
          $scope.show_alert = false;
          $scope.error_msg = data.msg;
        } else {
          $("#add_form").addClass("has-error");
          $scope.show_alert = true;
          $scope.error_msg = data.msg;
        }
        $("#add_task").button('reset');
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
        $("#add_task").button('reset');
      });
  };
  
  $scope.do_task = function(value, index) {
    //console.log(value);
    //console.log(index);
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks.splice(index, 1);
    $http.post('/set_json', temp_tasks).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(data);
        if (data.status == "ok") {
          $scope.tasks = temp_tasks;
        } else {
          $scope.show_alert = true;
          $scope.error_msg = data.msg;
        }
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };
  
  $scope.log_in = function() {
    //console.log($scope.username);
    //console.log($scope.password);
    //authentication
    var hash = CryptoJS.SHA256($scope.password).toString();
    var auth = {name: $scope.username, passhash: hash};
    $http.post('/authentication', auth).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(data);
        if (data.result == "ok") {
          $scope.logged = true;
          $('#myModal').modal('hide');
          $scope.username = "";
          $scope.password = "";
        }
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };
  
  $scope.log_out = function() {
    $http.get('/log_out').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      $scope.logged = false;
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("Error occured");
    });
  };
  
  $scope.register = function() {
    var hash = CryptoJS.SHA256($scope.password).toString();
    console.log(hash);
    var register_data = {name: $scope.username, passhash: hash, email: "none"};
    $http.post('/create_new_user', register_data).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        if (data.result == "ok") {
          $('#registerModal').modal('hide');
          $scope.log_in();
        } else {
          $scope.error_msg = data.msg;
          console.log(data);
        }
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };
});