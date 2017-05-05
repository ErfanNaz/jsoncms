angular.module("json-cms-app").factory("sha-factory", [function () {

  let sha = {};
  let salt = "json-cms";

  sha.generate = function (password) {
    return sha256(salt + password);
  };

  return sha;

}]);
