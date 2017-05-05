angular.module("json-cms-app").factory("connection-factory", ["$http", "sha-factory", "Upload", function ($http, sha, Upload) {

  let connection = {};
  let password = null;
  let uploadUrl = "restful/index.php/upload";

  connection.isLoggedIn = false;
  connection.cms = $http.get("cms.json");
  connection.data = $http.get("data.json");

  connection.login = function (pw) {
    password = sha.generate(pw);
    let params = { headers: { 'Authorization': password } };
    return $http.get("restful/index.php/login", params)
      .success(() => {
        connection.isLoggedIn = true;
      })
      .error(() => {
        connection.logout();
      });
  };

  connection.remember = function () {
    localStorage.setItem("password", password);
  };

  connection.logout = function () {
    password = null;
    connection.isLoggedIn = false;
    localStorage.removeItem("password");
  };

  connection.save = function (data) {
    let requestData = { "data": data };
    return $http.post("restful/index.php/edit", requestData, { headers: { 'Authorization': password } });
  };

  connection.deleteFile = function (fileUrl) {
    let requestData = { "fileUrl": fileUrl };
    return $http.delete("restful/index.php/upload", { "params": requestData, headers: { 'Authorization': password } });
  };

  connection.uploadFile = function (file, filename) {
    let data = { file: file };
    if (filename && filename.trim() !== "") {
      data.filename = filename;
    }
    return Upload.upload({
      url: uploadUrl,
      headers: { 'Authorization': password },
      data: data
    });
  };

  function init() {
    let storedPassword = localStorage.getItem("password");
    if (storedPassword) {
      password = localStorage.getItem("password");
      connection.isLoggedIn = true;
    }
  }

  init();

  return connection;
}]);
