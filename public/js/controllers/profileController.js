app.controller('ProfileController', ['$scope', '$http', 'loading', '$route', function ($scope, $http, loading, $route) {

    $scope.profile = {};
    $scope.styles = ["default", "cerulean", "dark", "flatly", "sandstone", "slate", "superhero" ,"united"];

    $scope.saveStyle = function(){
        if($scope.profile.stylesheet == "default"){$scope.profile.stylesheet = "";}
        $http.post("/user/updateStylesheet/", {stylesheet: $scope.profile.stylesheet}).then(function(response){
            location.reload();
        });
    };

    $scope.updateEmail = function(){
        if($scope.profile.stylesheet == "default"){$scope.profile.stylesheet = "";}
        $http.post("/user/updateEmail/", {email: $scope.profile.emails[0].value}).then(function(response){
            init($scope.profile.googleId);
        });
    };

    $scope.init = function(id){
        loading.show();
        var root = $scope;
        $http.get("/user/find/" + id).then(function (response) {
            root.profile = response.data;
            if(root.profile.emails === undefined){
                root.profile.emails = [];
            }
            if(root.profile.emails.length == 0){
                root.profile.emails.push({value: ""});
            }
            if (!root.profile.stylesheet || root.profile.stylesheet == undefined || root.profile.stylesheet == "" || root.profile.stylesheet.length == 0) {
                root.profile.stylesheet = "default";
            }
            loading.hide();
        });
    };
}]);