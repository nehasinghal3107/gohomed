angular.module('oz.UserApp')
  .controller('OZFinancialContentController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'OZWallService', '$rootScope', '$upload', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, OZWallService, $rootScope, $upload) {


console.log("initialise Service....");
 $rootScope.allOZProvidersList = [];
  $scope.format='yyyy/MM/dd';
   $scope.todaysDate=moment();

    $scope.getAllOZProviders = function(){

    	OZWallService.getAllOZProvidersList();
    	         console.log("Service....");
    };
$scope.getAllOZProviders();


    $scope.getReports=function(reportdate,provider1){
    	if(reportdate){
    		if(provider1){
    			reportdate=moment(reportdate).format('YYYY/MM/DD')
    			console.log("geting report for "+reportdate +" "+ provider1.providerid);
    			// OZWallService.getProviderPayableReport(reportdate,provider1);

			     $http({
			        method: 'GET',
			        url: '/api/sellerspayablerefundable?providerid='+provider1.providerid+'&transactiondate='+reportdate
			      }).success(function(data, status, headers, config) {
			        $rootScope.hideSpinner();
			        console.log(document.URL+'api/sellerspayablerefundable?providerid='+provider1.providerid+'&transactiondate='+reportdate);
			        if(data.error){
			        	$rootScope.OZNotify(data.error.message, 'error');
			        }
			        else{
			    			console.log(document.URL+'api/sellerspayablerefundable?providerid='+provider1.providerid+'&transactiondate='+reportdate);
    						document.location=document.URL+'api/sellerspayablerefundable?providerid='+provider1.providerid+'&transactiondate='+reportdate;
			           
			         }
			      }).error(function (data, status, headers, cfg) {
			        $log.debug(status);
			     });
			}
    		else{
    			$rootScope.OZNotify('Please select provider', 'error');
    		}
    	}
    	else{
    		$rootScope.OZNotify('Please select date', 'error');
    	}

    };

   var cleanUpEventallOZProvidersSuccess = $scope.$on("gotAllOZProviders",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    // $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data.success)
            {      
                   $rootScope.allOZProvidersList = data.success.productprovider;
                   console.log($rootScope.allOZProvidersList);
            } 
    });

    var cleanUpEventallOZProvidersFailure = $scope.$on("notAllOZProviders",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });





   var cleanUpEventGetProvidersPayableReportSuccess = $scope.$on("gotProviderPayableReport",function(event,data){
            if(data.error)
            {
              if(data.error.code === 'AL001')
              {
                      $rootScope.showModal();
              }
              else
              {
                    // $rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;
              }
            }
            if(data)
            {         console.log(data);
            	console.log(document.URL);
            	
            	 var win= window.open("data:application/vnd.xmlFormats" + encodeURIComponent(data)); 
               
            } 
    });

    var cleanUpEventGetProvidersPayableReportFailure = $scope.$on("notProviderPayableReport",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });



    $scope.$on('$destroy', function(event, message)
    {
        cleanUpEventallOZProvidersSuccess();
		cleanUpEventallOZProvidersFailure();
		cleanUpEventGetProvidersPayableReportSuccess();
		cleanUpEventGetProvidersPayableReportFailure();
    });

}]);