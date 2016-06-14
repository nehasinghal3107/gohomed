angular.module('oz.UserApp')
  .controller('OZManageLocationController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'OZWallService', '$rootScope', '$upload', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, OZWallService, $rootScope, $upload) {
  // OZWallService.getAllZipCodesContent();
  

    $scope.showManageZipcodes = 0;

    $scope.selectZipcodeList = '';

    $scope.areasInZipcodes = '';

    $scope.ZipCodeContainer = [];

    $scope.CityContainer = [];

    $scope.CountryContainer = [];

    $scope.StateContainer = [];

    $scope.selectedCity = '';

    $scope.selectedState = '';

    $scope.selectedCountry = '';

    
  var cleanUpEventGetAllZipcodes = $scope.$on("gotAllZipCodes",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data.success)
            {      
               $scope.ZipCodeContainer = [];
               $scope.ZipCodeContainer = data.success.zipcode;

            } 
    });

    var cleanUpEventCriteriaNotGotZipCodes = $scope.$on("notGotAllZipcodeContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    var cleanUpEventGetAllCountries = $scope.$on("gotAllCountries",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data.success)
            {      
               $scope.CountryContainer = [];
               $scope.CountryContainer = data.success.country;

            } 
    });

    var cleanUpEventCriteriaNotGotCountries = $scope.$on("notGotAllCountries",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

      var cleanUpEventGetAllStates = $scope.$on("gotAllStates",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data.success)
            {      
               $scope.StateContainer = [];
               $scope.StateContainer = data.success.states;

            } 
    });

    var cleanUpEventCriteriaNotGotStates = $scope.$on("notGotAllStates",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    var cleanUpEventGetAllCities = $scope.$on("gotAllCities",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data.success)
            {      
               $scope.CityContainer = [];
               $scope.CityContainer = data.success.city;

            } 
    });

    var cleanUpEventCriteriaNotGotCitiess = $scope.$on("notGotAllCities",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });



  

    $scope.array = { city : '', state : '', country : '', zc : '', areas : '', latitude : '', longitude : ''};


    // $scope


    $scope.switchToAddCode = function()
    {
    	$scope.showManageZipcodes = 1;
      $scope.array = { city : '', state : '', country : '', zc : '', areas : '', latitude :'', longitude : ''};
    };

    $scope.switchToManageZipcode = function()
    {
    	$scope.showManageZipcodes = 0;
      $scope.array = { city : '', state : '', country : '', zc : '', areas : '', latitude :'', longitude : ''};
    };

    $scope.getAllCountries = function()
    {
      // if($scope.selectedCity === '')
      // {
      //   $rootScope.OZNotify('Please select state to get all cities', error);
      // }
      // else
      // {  
             OZWallService.getCountryContent();
      // }
    };

    $scope.getAllZip = function()
    {  $scope.ZipCodeContainer = [];
      if($scope.array.city === '')
      {
        $rootScope.OZNotify('Please select city', 'error');
      }
      else
      {
        OZWallService.getAllZipCodesContent($scope.array.city);
      }
    };

    $scope.getAllStates = function()
    {$scope.StateContainer = [];
      if($scope.array.country === '')
      {
        $rootScope.OZNotify('Please select Country', 'error');
      }
      else
      {
        OZWallService.getAllStates($scope.array.country);
      }
    };

    // $scope.getAllCities = function()
    // {
    //   if($scope.selectedState === '')
    //   {

    //   }
    // }

    $scope.addNewZipcode = function()
    {
        var partsOfStr = $scope.array.areas.toString().split(','); 
        $scope.newZipContents = [];
        for(var i = 0 ; i< partsOfStr.length ; i++)
        {
            if(partsOfStr[i] !== '')
                $scope.newZipContents.push(partsOfStr[i]);
        }
        if($scope.array === undefined)
        {
          $rootScope.OZNotify('please select all the entries', 'error');
        }
        if($scope.array.city === '')
        {
          $rootScope.OZNotify('Please select city!', 'error');
        }
        else if ($scope.newZipContents.length === 0)
        {
          $rootScope.OZNotify('Please enter atleast onearea', 'error');
        }
        else if($scope.array.latitude === '')
        {
          $rootScope.OZNotify('Please enter latitude of the zipcode', 'error');
        }
        else if ($scope.array.longitude === '')
        {
          $rootScope.OZNotify('Please enter longitude of the zipcode', 'error');
        }
        else
       {
            var content = {'location': {'country' : $scope.array.country, 'state' : $scope.array.state, 'city' : $scope.array.city, 'zipcode' : $scope.array.zc, 'area' : $scope.newZipContents , 'geo' : { 'lati' : $scope.array.latitude, 'longi' : $scope.array.longitude}}};
            OZWallService.insertNewZip(content);
      }
    };

    $scope.getAllCities = function()
    {$scope.CityContainer = [];
      if($scope.array.state === '')
      {
        $rootScope.OZNotify('Please select state', 'error');
      }
      else
      {
        OZWallService.getAllCities($scope.array.state);
      }
    };

    $scope.addAreaToZipcode = function()
    {    
        var partsOfStr = $scope.array.areas.toString().split(','); 
        $scope.newZipContent = [];
        for(var i = 0 ; i< partsOfStr.length ; i++)
        {
            if(partsOfStr[i] !== '')
                $scope.newZipContent.push(partsOfStr[i]);
        }
         // var contents = {'location : {'zipcode ': $scope.array.zc, 'area' : $scope.newTagContent} };
         var contents = { 'location' : { 'zipcode' : $scope.array.zc, 'area' : $scope.newZipContent}}; 
         if($scope.array.zc === '')
         {
          $rootScope.OZNotify('Please select zipcode', 'error');
         }
         else if ($scope.array.areas.length === 0)
         {
          $rootScope.OZNotify('Please add atleast one area', 'error');
         }
         else
         { 
                OZWallService.insertAreaContent(contents);
         }
    };

    $scope.getAllAreas = function()
    {    $scope.array.areas = '';
        if($scope.array.zc === '')
        {
          $rootScope.OZNotify('Please select zipcode', 'error');
        }
        else
        {
           OZWallService.getAllAreas($scope.array.zc);
        }
    };

    var cleanUpEventGotAllAreas = $scope.$on('gotAllAreas', function(event, data)
    {
      if(data.error)
      {
        if(data.error.code == 'AL001')
        {
          $rootScope.showModal();
        }
        else
        {
          $rootScope.OZNotify(data.error.message, 'error');
        }
      }
      if(data.success)
      {
        $scope.array.areas = '';
        $scope.array.areas = data.success.area;
      }
    });

    var cleanUpEventNotGotAllAreas = $scope.$on('notGotAllAreas', function(event, data)
    {
      $rootScope.OZNotify('Some issue with server! Please try after some time', 'error')
    });

    var cleanUpEventChangedZipAreas = $scope.$on('newAreaInserted', function(event, data)
    {
      if(data.error)
      {
        if(data.error.code == 'AL001')
        {
          $rootScope.showModal();
        }
        else
        {
          $rootScope.OZNotify(data.error.message, 'error');
        }
      }
      if(data.success)
      {
          $rootScope.OZNotify(data.success.message, 'success');
      }
    });

    var cleanUpEventNotChangedZipAreas = $scope.$on('newAreaNotInserted', function(event, data)
    {
      $rootScope.OZNotify('Some issue with server! Please try after some time', 'error')
    });

    var cleanUpEventAddedNewZip = $scope.$on('insertedCodeContent', function(event, data)
    {
      if(data.error)
      {
        if(data.error.code == 'AL001')
        {
          $rootScope.showModal();
        }
        else
        {
          $rootScope.OZNotify(data.error.message, 'error');
        }
      }
      if(data.success)
      {
               $rootScope.OZNotify(data.success.message, 'success');
      }
    });

    var cleanUpEventNotAddedNewZip = $scope.$on('notInsertZipcode', function(event, data)
    {
      $rootScope.OZNotify('Some issue with server! Please try after some time', 'error')
    });

    $scope.$on('$destroy', function(event, message)
    {
           cleanUpEventGetAllZipcodes();
           cleanUpEventCriteriaNotGotZipCodes();
           cleanUpEventGetAllCountries();
           cleanUpEventCriteriaNotGotCountries();
           cleanUpEventGetAllStates();
           cleanUpEventCriteriaNotGotStates();
           cleanUpEventGetAllCities();
           cleanUpEventCriteriaNotGotCitiess();
           cleanUpEventGotAllAreas();
           cleanUpEventNotGotAllAreas();
           cleanUpEventChangedZipAreas();
           cleanUpEventNotChangedZipAreas();
           cleanUpEventAddedNewZip();
           cleanUpEventNotAddedNewZip();
    });
}]);