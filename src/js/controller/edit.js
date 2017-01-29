angular.module("json-cms-app").controller("edit-controller", ["$rootScope", "$location", "Upload", "connection-factory", "Notification", function (rootScope, location, Upload, connection, Notification) {

    let self = this;

    this.schema = null;
    this.form = null;
    this.model = null;
    this.uploads = null;
    this.uploadFolder = "./uploads/";
    this.uploadFilename = null;
    this.file = null;

    this.save = function (form) {
        rootScope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            connection.save(self.model)
                .success(onSaveSuccess)
                .error(onSaveError);
        }
    };

    this.logout = function () {
        connection.logout();
        location.path('/login');
    };

    this.onFileSelected = function(file){
        if(file){
            self.uploadFilename = file.name;
        } else {
            self.uploadFilename = null;
        }
    };

    this.uploadFile = function () {
        if(self.file){
            connection.uploadFile(self.file, self.uploadFilename)
            .success(onSuccessFileUpload)
            .error(onSaveError);
        }
    };

    this.deleteFile = function (fileUrl) {
        connection.deleteFile(fileUrl)
            .success(function (response) {
                refreshUploadList(response.uploads);
                onSaveSuccess(response);
            })
            .error(onSaveError);
    };

    function onSaveSuccess(data) {
        Notification.success(data.message);
    }

    function onSaveError(data) {
        Notification.error(data.message);
    }

    function onSuccessFileUpload(response) {
        refreshUploadList(response.uploads);
        onSaveSuccess(response);
    }

    function refreshUploadList(uploads) {
        try {
            self.uploads = JSON.parse(uploads);
            fileEnum = null;
            self.schema = replaceFileInSchema(self.schema);
            rootScope.$broadcast('schemaFormRedraw');
        } catch (e){
            Notification.error(e);
        }
    }

    let fileEnum;
    function getFileEnum() {
        if (!fileEnum && self.uploads) {
            fileEnum = [""];
            for (let i in self.uploads) {
                fileEnum.push(self.uploads[i].name);
            }
        }
        return fileEnum;
    }

    function replaceFileInSchema(data) {
        if (data.type === "string" && data.format === "file") {
            data.enum = getFileEnum();
        } else {
            if (data.type === "object" && data.properties) {
                for (let i in data.properties) {
                    data.properties[i] = replaceFileInSchema(data.properties[i]);
                }
                data.properties = replaceFileInSchema(data.properties);
            }
            if (data.type === "array" && data.items) {
                data.items = replaceFileInSchema(data.items);
            }
        }
        return data;
    }

    function init() {
        if (connection.isLoggedIn) {
            connection.data.then(function (response) {
                connection.cms.then(function (response) {
                    self.uploads = response.data.uploads;
                    response.data.schema = replaceFileInSchema(response.data.schema);
                    self.schema = response.data.schema;
                    self.form = response.data.form;
                    rootScope.$broadcast('schemaFormRedraw');
                });
                self.model = response.data;
            });
        } else {
            location.path('/login');
        }
    }

    init();

}]);