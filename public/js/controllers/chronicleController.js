app.controller('ChronicleController', ['$scope', '$http', 'loading', function ($scope, $http, loading) {
    $scope.log = function (event) {
        console.log(event);
    }

    $scope.chronicles = [];

    $scope.addChronicle = function(){
        $http.post("/chronicle/insert", {name: $scope.name, description: $scope.description}).then(function(response){
            $scope.name = '';
            $scope.description = '';
            $scope.init();
        });
    };

    $scope.init = function () {
        loading.show();
        var root = $scope;
        $http.get("/chronicle/all").then(function(response) {
            root.chronicles = response.data;
            loading.hide();
        });
    };
}]);