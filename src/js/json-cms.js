angular.module("json-cms-app", ["ngRoute", "schemaForm", "schemaForm-tinymce", "ngFileUpload", "ui-notification"]);

angular.module("json-cms-app").config(["NotificationProvider", function(NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 90,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
    });
}]);

angular.module("json-cms-app").config(["$routeProvider", function (routeProvider) {
  routeProvider.when("/", {
    templateUrl: "partials/login.html",
    controller: "login-controller"
  }).when("/edit", {
    templateUrl: "partials/edit.html",
    controller: "edit-controller"
  }).otherwise({
    redirectTo: "/"
  });
}]);