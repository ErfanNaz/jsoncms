angular.module("json-cms-app").controller("login-controller", ["$location", "connection-factory", function (location, connection) {

    let self = this;

    this.username = "admin";
    this.password = "password";
    this.remember = false;

    this.login = function () {
        connection.login(self.username + self.password)
            .success(onSuccess)
            .error(onError);
    };

    function onSuccess() {
        if(self.remember){
            connection.remember();
        }
        location.path('/edit');
    }

    function onError(data) {
        console.log(data);
    }

    function init() {
        if(connection.isLoggedIn){
            location.path('/edit');
        }
    }

    init();
}]);