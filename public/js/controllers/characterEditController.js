app.controller('CharacterEditController', ['$scope', '$http', 'loading', 'resources', '$filter', function ($scope, $http, loading, resources, $filter) {
    $scope.log = function (event) {
        console.log(event);
    }
    var orderBy = $filter('orderBy');

    $scope.conscienceTypes = ["Conscience", "Conviction"];
    $scope.selfcontrolTypes = ["Self-Control", "Instinct"];
    $scope.resourcesLoaded = false;
    $scope.abilities = [];
    $scope.sability = {};
    $scope.backgrounds = [];
    $scope.sbackground = {};
    $scope.clans = [];
    $scope.disciplines = [];
    $scope.sdiscipline = {};
    $scope.flaws = [];
    $scope.sflaw = {};
    $scope.influences = [];
    $scope.sinfluences = {};
    $scope.mental = [];
    $scope.smental = {};
    $scope.merits = [];
    $scope.smerit = {};
    $scope.negativemental = [];
    $scope.snegativemental = {};
    $scope.negativephysical = [];
    $scope.snegativephysical = {};
    $scope.negativesocial = [];
    $scope.snegativesocial = {};
    $scope.paths = [];
    $scope.physical = [];
    $scope.sphysical = {};
    $scope.rituals = [];
    $scope.sritual = {};
    $scope.sects = [];
    $scope.social = [];
    $scope.ssocial = {};

    $scope.chronicle = null;
    $scope.character = [];
    $scope.players = [];
    $scope.statusses = [
        "Active", "Stopped", "Deceased"
    ];

    $scope.noteItem = {};
    $scope.selectedList = [];
    
    $scope.dirtylists = [];

    $scope.addTrait = function(value, list, total, select){
        if(value.length === undefined) return;
        var result = $.grep(list, function(e){ return e.name == value; });
        if(result.length === 0) {
            list.push({name: value, val: 1});
            list = orderBy(list, 'name', false);
        }else{
            result[0].val++;
        }

        if(total.length !== undefined)
        {
            var t = 0;
            $.each(list, function(index, item){
                t +=  item.val;
            });
            $scope.character.attributes[total] = t;
            $scope.setItemDirty("attributes." + total, t);
        }

        value = {};
        if(select !== undefined)
        {
            $("#slc-" + select).removeClass("ng-dirty");
            $("#slc-" + select).val(null);
        }
        $scope.setItemDirty(list);
    };

    $scope.removeTrait = function(value, list, total){
        var result = $.grep(list, function(e){ return e.name == value; });
        var attr = result[0];

        if(attr.val == 1){
            list.splice($.inArray(attr, list),1);
        }else{
            attr.val--;
        }
        if(total.length !== undefined)
        {
            var t = 0;
            $.each(list, function(index, item){
                t +=  item.val;
            });
            $scope.character.attributes[total] = t;
            $scope.setItemDirty("attributes." + total, t);
        }
        $scope.setItemDirty(list);
    };

    $scope.addAdvantage = function(value, notevalue, list, select){
        if(value.length === undefined) return;
        var result = $.grep(list, function(e){ return e.name == value; });
        if(result.length === 0) {
            list.push({name: value, note: notevalue, rating: 1});
            list = orderBy(list, 'name', false);
        }else{
            result[0].rating++;
        }
        
        value = {};
        if(select !== undefined)
        {
            $("#slc-" + select).removeClass("ng-dirty");
            $("#slc-" + select).val(null);
        }
        
        $scope.setItemDirty(list);
    };
    
    $scope.removeAdvantage = function(value, notevalue, list){
        var result = $.grep(list, function(e){ return e.name == value; });
        var adv = result[0];

        if(adv.rating == 1){
            list.splice($.inArray(adv, list),1);
        }else{
            adv.rating--;
        }
        $scope.setItemDirty(list);
    };

    $scope.updateAdvantageNote = function(value, notevalue, list)
    {
        var result = $.grep(list, function(e){ return e.name == value; });
        var adv = result[0];
        
        adv.note = notevalue;
        $scope.setItemDirty(list);
    };
    
    $scope.previousNoteValue = {};
    $scope.addNoteDialog = function(adv, list)
    {
        angular.copy(adv, $scope.previousNoteValue);
        $scope.noteItem = adv;
        $scope.selectedList = list;
        $("#advNoteModal").modal();           
    };

    $scope.revertNoteItem = function(){
        angular.copy($scope.previousNoteValue, $scope.noteItem);
        $scope.noteItem = {};
        $scope.selectedList = {};
    };
    
    $scope.saveNoteItem = function(){
        $scope.setItemDirty($scope.selectedList);
        
        $scope.noteItem = {};
        $scope.selectedList = {};
    }
    $scope.setItemDirty = function(list, value)
    {
        if (typeof list == 'string' || list instanceof String)
        {
            if($scope.dirtylists.indexOf({key: list, value: value}) > -1){
                $scope.dirtylists.splice($.inArray({key: list, value: value}, $scope.dirtylists),1);
            }
            $scope.dirtylists.push({key: list, value: value});
        }else{
            for(var key in $scope.character)
            {
                if($scope.character[key] === list)
                {
                    if($scope.dirtylists.indexOf({key: key, value: $scope.character[key]}) > -1){
                        $scope.dirtylists.splice($.inArray({key: key, value: $scope.character[key]}, $scope.dirtylists),1);
                    }
                    $scope.dirtylists.push({key: key, value: $scope.character[key]});
                }

                if(key == 'attributes')
                {
                    for(var akey in $scope.character[key])
                    {
                        
                        if($scope.dirtylists.indexOf({key: key + "." + akey, value: $scope.character[key][akey]}) > -1){
                            $scope.dirtylists.splice($.inArray({key: key + "." + akey, value: $scope.character[key][akey]}, $scope.dirtylists),1);
                        }
                        if($scope.character[key][akey] === list){
                            $scope.dirtylists.push({key: key + "." + akey, value: $scope.character[key][akey]});
                        }
                    }
                }
            }
        }
    };

    $scope.save = function(){
        var fields = {};
        fields;
        $(".ng-dirty").each(function(index, item){
            if($(item).data("field") !== undefined){

                    fields[$(item).data("field")] = angular.element(item).data('$ngModelController').$modelValue;
                
            }
        });
        $.each($scope.dirtylists, function(index, item){
            $.each(item.value, function(i, m){
                delete m._id;
            });
            fields[item.key] = item.value;
        });
        $http.post("/character/update", {id: $scope.character.id, fields: fields}).then(function(response){
            $scope.init($scope.character.id);
        });
        $scope.editId = 0;
        $scope.dirtylists = [];
    };

    $scope.display = function(player){
        if(player.emails[0] !== undefined)
        {
            return player.displayName + " (" + player.provider + " - " + player.emails[0].value + ")";
        }else {
            return player.displayName + " (" + player.provider + ")";
        }
    };

    $scope.revert = function(date){
        $http.post("/character/revert", {id: $scope.character.id, date: date}).then(function(response){
            $scope.init($scope.character.id);
        });
    };

    $scope.init = function (id) {
        loading.show();
        var root = $scope;
        if(!$scope.resourcesLoaded)
        {
            $scope.resourcesLoaded = true;
            resources.abilities.get(function(data){
                root.abilities = data;
            });
            resources.abilities.get(function(data){
                root.abilities = data;
            });
            resources.backgrounds.get(function(data){
                root.backgrounds = data;
            });
            resources.clans.get(function(data){
                root.clans = data;
            });
            resources.disciplines.get(function(data){
                root.disciplines = data;
            });
            resources.flaws.get(function(data){
                root.flaws = data;
            });
            resources.influences.get(function(data){
                root.influences = data;
            });
            resources.mental.get(function(data){
                root.mental = data;
            });
            resources.merits.get(function(data){
                root.merits = data;
            });
            resources.negativemental.get(function(data){
                root.negativemental = data;
            });
            resources.negativephysical.get(function(data){
                root.negativephysical = data;
            });
            resources.negativesocial.get(function(data){
                root.negativesocial = data;
            });
            resources.paths.get(function(data){
                root.paths = data;
            });
            resources.physical.get(function(data){
                root.physical = data;
            });
            resources.rituals.get(function(data){
                root.rituals = data;
            });
            resources.sects.get(function(data){
                root.sects = data;
            });
            resources.social.get(function(data){
                root.social = data;
            });
        }
        $http.get("/character/find/" + id).then(function (response) {
            root.character = response.data;
            root.character.experience.unspent = parseInt(root.character.experience.unspent);
            root.character.experience.total = parseInt(root.character.experience.total);
            if(root.chronicle === null)
            {
                root.chronicle = root.character.chronicle;
                $http.get("/chronicle/find/" + root.chronicle.id).then(function (response) {
                    $scope.players = response.data.playerDocs;
                    $scope.characterForm.$setPristine();
                    loading.hide();
                });
            }
            else
            {
                $scope.characterForm.$setPristine();
                loading.hide();
            }
        });
    };
}]);
