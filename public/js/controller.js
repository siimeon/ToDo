// Intializing app
var app = angular.module('app', []);
// Main controller
app.controller('main_controller', function ($scope, $http) {
  $scope.header = "What to do next?";
  $scope.logged = false;
  $scope.text = "";
  $scope.version = {app: "todo client", version: "0.1.3b"};

  //
  $scope.logged_in_user = "";
  $scope.new_task_title = "";
  $scope.new_task_description = "";

  // Error
  $scope.show_alert = false;
  $scope.show_alert_modal1 = false;
  $scope.show_alert_modal2 = false;
  $scope.error_msg = "";

  // Edit
  $scope.edit_element_index = -1;
  $scope.edit_element = {};
  $scope.edit_task_title = "";
  $scope.edit_task_description = "";

  $http.get('/version').
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    //console.log(data);
    //console.log(data);
    if (data.version !== $scope.version.version) {
      $scope.show_alert = true;
      $scope.error_msg = "Client and server doesn't have same version";
    }
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log("Error occured");
  });

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
      // console.log(data);
      if (data.result == "ok") {
          $scope.logged = true;
          $scope.logged_in_user = data.user;
      }
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("Error occured");
    });

  $scope.add_task = function() {
    $("#add_task").button('loading');
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    new_task = {
      "task": $scope.new_task_title,
      "description": $scope.new_task_description,
      "user": $scope.logged_in_user,
      "started": false,
      "done": false,
      "archived": false
    };
    temp_tasks.push(new_task);
    $http.post('/set_json', temp_tasks).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available

        if (data.status == "ok") {
          $scope.tasks = temp_tasks;
          $scope.new_task_title = "";
          $scope.new_task_description = "";
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

  $scope.start_task = function(value, index) {
    //console.log(value);
    //console.log(index);
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks[index].started = true;
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

  $scope.do_task = function(value, index) {
    //console.log(value);
    //console.log(index);
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks[index].done = true;
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

  $scope.archive_task = function(value, index) {
    //console.log(value);
    //console.log(index);
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks[index].archived = true;
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

  $scope.save_change = function(index) {
    //console.log(value);
    //console.log(index);
    var temp_tasks = $scope.tasks.slice(0); // make copy of array
    temp_tasks[$scope.edit_element_index].task = $scope.edit_task_title;
    temp_tasks[$scope.edit_element_index].description = $scope.edit_task_description;
    $http.post('/set_json', temp_tasks).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(data);
      if (data.status == "ok") {
        $scope.tasks = temp_tasks;
        $('#editModal').modal('hide');
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

  $scope.delete_task = function(value, index) {
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

  $scope.open_edit = function(index) {
    $scope.edit_element_index = index;
    $scope.edit_task_title = $scope.tasks[$scope.edit_element_index].task;
    $scope.edit_task_description = $scope.tasks[$scope.edit_element_index].description;
    console.log(index);
    $('#editModal').modal('show');
  };

  $scope.log_in = function() {
    //authentication
    var auth = {name: $scope.username, passhash: $scope.password};
    $http.post('/authentication', auth).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(data);
        if (data.result == "ok") {
          $scope.logged = true;
          $scope.logged_in_user = $scope.username;
          $('#myModal').modal('hide');
          $scope.username = "";
          $scope.password = "";
          $scope.show_alert_modal1 = false;
        } else {
          $scope.show_alert_modal1 = true;
          $scope.error_msg_modal1 = "Incorrect username or password"
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
    var register_data = {name: $scope.username, passhash: $scope.password, email: $scope.email};
    $http.post('/create_new_user', register_data).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        if (data.result == "ok") {
          $('#registerModal').modal('hide');
          $scope.log_in();
          $scope.error_msg_modal2 = false;
        } else {
          $scope.show_alert_modal2 = true;
          $scope.error_msg_modal2 = data.msg;
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
