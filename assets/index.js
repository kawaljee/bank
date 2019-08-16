let app = angular.module("myApp",[]);
app.controller("myCtrl",function($scope,$http){
    $scope.defaultCity ="Delhi";                                //for drop down
    $scope.currentPage = 0;                                     //for pagination
    $scope.searchResponse = [];                                 //for displaying response
    $scope.searchResp = [];  
    $scope.showFav = false;                                   //for recording response
    $scope.favArr = {
                        'DELHI':{indexes:[],data:[]},           // {
                        'MUMBAI':{indexes:[],data:[]},          //      for recording user's fav
                        'BANGALORE':{indexes:[],data:[]},       //      banks
                        'GOA':{indexes:[],data:[]},             //
                        'JAMSHEDPUR':{indexes:[],data:[]}       // }
                    };
    if(localStorage.getItem("favArr")){
        $scope.favArr = JSON.parse(localStorage.getItem("favArr"));     //localStorage
    }
    $scope.allCities = ['DELHI','MUMBAI','BANGALORE','GOA','JAMSHEDPUR'];
    $scope.changeCity = function(city){                 //if city change
            $scope.defaultCity = city;
            $scope.searchResult($scope.defaultCity);
        }
    
    $scope.setFav = function(obj,indx){                          // setting up fav.
        $scope.newObj = obj;
        if($scope.searchResponse[indx].fav == "red"){
            $scope.searchResponse[indx].fav = "";
            $scope.searchResp[indx].fav = "";
            $scope.favArr[$scope.defaultCity.toUpperCase()].indexes = 
                        $scope.favArr[$scope.defaultCity.toUpperCase()].indexes.filter((_val)=>(_val !== indx))
        }
        else{
            $scope.searchResponse[indx].fav = "red";
            $scope.searchResp[indx].fav = "red";
            $scope.favArr[$scope.defaultCity.toUpperCase()].indexes.push(indx);
        }
        $scope.favArr[$scope.defaultCity.toUpperCase()].data = $scope.searchResponse.filter(function(_obj){
                if(_obj.city==$scope.defaultCity.toUpperCase())
                    if(_obj.fav == "red")
                        return true;
        });
        localStorage.setItem("favArr", JSON.stringify($scope.favArr));

    }
    $scope.searchResult = function(city){              //api call with city input
        $http.get("https://vast-shore-74260.herokuapp.com/banks?city="+city.toUpperCase())
        .then(function successCallback(response){
            $scope.searchResponse = $scope.searchResp = response.data;
            for(let indx = 0 ; indx < response.data.length ; indx++){
                $scope.searchResponse[indx].fav = $scope.searchResp[indx].fav = "";
            }
            angular.forEach($scope.allCities, function(_city){
                if($scope.defaultCity.toUpperCase() == _city){
                    $scope.favArr[_city].indexes.forEach(function(_val){
                        $scope.searchResponse[_val].fav = $scope.searchResp[_val].fav = "red";
                    })
                }
            });
        },
        function errorCallback(response){
            console.log("Error has occured!");
        })
    }

    $scope.pagination = function(page){                //pagination function
        $scope.currentPage = page;
    }
    $scope.searchResult($scope.defaultCity);            //call for 1st time
})