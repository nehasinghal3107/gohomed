angular.module('oz.ProviderApp')
  .controller('ManageLoyaltyController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', 'GetLoyaltySchemeService', 'loyaltyHistoryData', 'MyProviderData', 'LoyaltySchemeService', function($scope, $state, $http, $timeout, $sce, $log, $rootScope, GetLoyaltySchemeService, loyaltyHistoryData, MyProviderData, LoyaltySchemeService) {
  
    $log.debug("initialising manage loyalty scheme controller");

	  $scope.$state = $state;
	  $scope.form = {};
	  $scope.submitted = false;
	  $scope.loyalty_points_history = {history:[]};
	  $scope.My_provider_list = [];
	  $scope.providers_branch_list = [{branchname:"all",branchid:""}];
	  $scope.loyalty = {};
	  $scope.loyaltyschemehistory = false;
	  $scope.loyalty_schemes_history = [];
	  $scope.editloyalty = {};
	  

	  $scope.$watch('$state.$current.locals.globals.loyaltyHistoryData', function (loyaltyHistoryData) {
	    $log.debug(loyaltyHistoryData);
	    if (loyaltyHistoryData.success && loyaltyHistoryData.success.doc.history.length !== 0) {
	      $scope.loyalty_points_history = angular.copy(loyaltyHistoryData.success.doc);
	    } else if (loyaltyHistoryData.error && loyaltyHistoryData.error.message) {
	      $scope.loyalty_points_history = {history:[]};
	      $log.debug(loyaltyHistoryData.error.message);
	      $rootScope.OZNotify(loyaltyHistoryData.error.message, 'error');
	    } 
	  });

	  $scope.$watch('$state.$current.locals.globals.MyProviderData', function (MyProviderData) {
	    $log.debug(MyProviderData);
	    if (MyProviderData.success && MyProviderData.success.providerbranchinfo.length !== 0) {
	      $scope.My_provider_list = angular.copy(MyProviderData.success.providerbranchinfo);
	    } else if (MyProviderData.error && MyProviderData.error.message) {
	      $scope.My_provider_list = [];
	      $log.debug(MyProviderData.error.message);
	      $rootScope.OZNotify(MyProviderData.error.message, 'error');
	    } 
	  });

	  var cleanupEventChange_in_provideridDone = $scope.$on("change_in_providerid", function(event, data){
      $log.debug('change_in_providerid ' + data);
      $state.reload();     
    });


    $scope.getBranchesForSeller = function(provider){
    	if(provider){
    		var providerid = provider.providerid;
    		$scope.providers_branch_list = [{branchname:"all",branchid:""}];
    		for (var i = 0; i < $scope.My_provider_list.length; i++) {
    			if ($scope.My_provider_list[i].providerid === providerid) {
    				for (var j = 0; j < $scope.My_provider_list[i].branch.length; j++) {
    					$scope.providers_branch_list.push($scope.My_provider_list[i].branch[j])
    				};
    			}
    		}
    		LoyaltySchemeService.get_LoyaltyScheme(providerid);
    	}
    }


    // function to handle server side responses
	  $scope.handleGetLoyaltySchemeResponse = function(data){
	    if (data.success) {
	      console.log(data.success);
	      $scope.loyalty_schemes_history = angular.copy(data.success.loyaltyschme);
	      $scope.loyaltyschemehistory = true;
	      $rootScope.OZNotify(data.success.message,'success'); 
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	      $scope.loyalty_schemes_history = [];
	      $scope.loyaltyschemehistory = true;
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventGetLoyaltySchemeDone = $scope.$on("getLoyaltySchemeDone", function(event, message){
	    $log.debug(message);
	    $scope.handleGetLoyaltySchemeResponse(message);      
	  });

	  var cleanupEventGetLoyaltySchemeNotDone = $scope.$on("getLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });


	  $scope.resetAddLoyaltyScheme = function(){
	  	$scope.form.addLoyaltyScheme.$setPristine();
      $scope.form.addLoyaltyScheme.submitted = false;
      $scope.loyalty.point = '';
      $scope.loyalty.value = '';
      $scope.loyalty.minorderamount = '';
      $scope.loyalty.branchname = '';
	  }

    // function to send and stringify user registration data to Rest APIs
	  $scope.jsonAddLoyaltySchemeData = function(){
	  	var branchids = [];
	  	if ($scope.loyalty.branchname) {
	  		if ($scope.loyalty.branchname.branchname == 'all') {
	  			branchids.push('all');
	  		} else {
	  			branchids.push($scope.loyalty.branchname.branchid);
	  		}
	  	}
	    var loyaltyData = 
	    { 
	      loyaltyscheme : {
	      	"points":$scope.loyalty.point,
		      "amount":$scope.loyalty.value,
		      "minamount":$scope.loyalty.minorderamount
	      },
	      "branchids": branchids 
	    };
	    return JSON.stringify(loyaltyData); 
	  }

    $scope.addLoyaltyScheme = function(provider){
	    if(provider) {
	    	var providerid = provider.providerid;
	    	if ($scope.form.addLoyaltyScheme.$valid) {
	    		$rootScope.showSpinner();
	    		var data = $scope.jsonAddLoyaltySchemeData();
	    		console.log(data);
	    		LoyaltySchemeService.add_LoyaltyScheme(providerid, data);
	    	} else {
	    		$scope.form.addLoyaltyScheme.submitted = true;
	    	}
	    }
    }

    // function to handle server side responses
	  $scope.handleAddLoyaltySchemeResponse = function(data, providerid){
	    if (data.success) {
	      console.log(data.success);
	      LoyaltySchemeService.get_LoyaltyScheme(providerid);
	      $scope.resetAddLoyaltyScheme();
	      $rootScope.OZNotify(data.success.message,'success'); 
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventAddLoyaltySchemeDone = $scope.$on("addLoyaltySchemeDone", function(event, message, providerid){
	    $log.debug(message);
	    $scope.handleAddLoyaltySchemeResponse(message, providerid);      
	  });

	  var cleanupEventAddLoyaltySchemeNotDone = $scope.$on("addLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });

	  $scope.deleteLoyaltyScheme = function(provider, branchid, schemeid) {
	  	if (provider && branchid && schemeid) {
	  		var providerid = provider.providerid;
	  		LoyaltySchemeService.delete_LoyaltyScheme(providerid, branchid, schemeid);
	  	}
	  }


	  // function to handle server side responses
	  $scope.handleDeleteLoyaltySchemeResponse = function(data, providerid){
	    if (data.success) {
	      console.log(data.success);
	      LoyaltySchemeService.get_LoyaltyScheme(providerid);
	      $rootScope.OZNotify(data.success.message,'success'); 
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventDeleteLoyaltySchemeDone = $scope.$on("deleteLoyaltySchemeDone", function(event, message, providerid){
	    $log.debug(message);
	    $scope.handleDeleteLoyaltySchemeResponse(message, providerid);      
	  });

	  var cleanupEventDeleteLoyaltySchemeNotDone = $scope.$on("deleteLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });

	  $scope.activateLoyaltyScheme = function(provider, branchid, schemeid){
	  	if (provider && branchid && schemeid) {
	  		var providerid = provider.providerid;
	  		LoyaltySchemeService.activate_LoyaltyScheme(providerid, branchid, schemeid);
	  	}
	  }

	  // function to handle server side responses
	  $scope.handleActivateLoyaltySchemeResponse = function(data, providerid){
	    if (data.success) {
	      console.log(data.success);
	      LoyaltySchemeService.get_LoyaltyScheme(providerid);
	      $rootScope.OZNotify(data.success.message,'success'); 
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventActivateLoyaltySchemeDone = $scope.$on("activateLoyaltySchemeDone", function(event, message, providerid){
	    $log.debug(message);
	    $scope.handleActivateLoyaltySchemeResponse(message, providerid);      
	  });

	  var cleanupEventActivateLoyaltySchemeNotDone = $scope.$on("activateLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });

	  $scope.deactivateLoyaltyScheme = function(provider, branchid, schemeid){
	  	if (provider && branchid && schemeid) {
	  		var providerid = provider.providerid;
	  		LoyaltySchemeService.deactivate_LoyaltyScheme(providerid, branchid, schemeid);
	  	}
	  }

	  // function to handle server side responses
	  $scope.handleDeactivateLoyaltySchemeResponse = function(data, providerid){
	    if (data.success) {
	      console.log(data.success);
	      LoyaltySchemeService.get_LoyaltyScheme(providerid);
	      $rootScope.OZNotify(data.success.message,'success'); 
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventDeactivateLoyaltySchemeDone = $scope.$on("deactivateLoyaltySchemeDone", function(event, message, providerid){
	    $log.debug(message);
	    $scope.handleDeactivateLoyaltySchemeResponse(message, providerid);      
	  });

	  var cleanupEventDeactivateLoyaltySchemeNotDone = $scope.$on("deactivateLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });

	  $scope.enableEditLoyaltyScheme = function(parentindex, index, scheme) {
      $scope.editloyalty = angular.copy(scheme);
      $scope.editScheme = true;
      $scope.CurrentSchemeIndex = parentindex + '1' + index;
    }

    $scope.cancelEnableEditLoyaltyScheme = function() {
      $scope.editScheme = false;
      $scope.CurrentSchemeIndex = '';
      $scope.editloyalty = {};
      $scope.form.editLoyaltyScheme.$setPristine();
      $scope.form.editLoyaltyScheme.submitted = false;
    }

    // function to send and stringify user registration data to Rest APIs
	  $scope.jsonUpdateLoyaltySchemeData = function(schemeid){
	  	var editschemes = [];
	  	if (schemeid) {
	  		editschemes.push({points:$scope.editloyalty.points, amount: $scope.editloyalty.amount, minamount:$scope.editloyalty.minamount, schemeid:schemeid, isActive:$scope.editloyalty.isActive});
	  	}
	    var loyaltyData = 
	    { 
	      schemes : editschemes
	    };
	    return JSON.stringify(loyaltyData); 
	  }

    $scope.updateLoyaltyScheme = function(provider, branchid, schemeid){
    	if(provider) {
	    	var providerid = provider.providerid;
	    	if ($scope.form.editLoyaltyScheme.$valid) {
	    		$rootScope.showSpinner();
	    		var data = $scope.jsonUpdateLoyaltySchemeData(schemeid);
	    		console.log(data);
	    		LoyaltySchemeService.update_LoyaltyScheme(providerid, branchid, data);
	    	} else {
	    		$scope.form.addLoyaltyScheme.submitted = true;
	    	}
	    }
    }

    // function to handle server side responses
	  $scope.handleUpdateLoyaltySchemeResponse = function(data, providerid){
	    if (data.success) {
	      console.log(data.success);
	      LoyaltySchemeService.get_LoyaltyScheme(providerid);
	      $rootScope.OZNotify(data.success.message,'success'); 
	      $scope.cancelEnableEditLoyaltyScheme();
	    } else {
	      if(data.error.code=='AL001'){
	        $rootScope.showModal();
	      } else {
	        $log.debug(data.error.message);
	        $rootScope.OZNotify(data.error.message,'error');
	      }
	    }
	    $rootScope.hideSpinner();
	  };

	  var cleanupEventUpdateLoyaltySchemeDone = $scope.$on("updateLoyaltySchemeDone", function(event, message, providerid){
	    $log.debug(message);
	    $scope.handleUpdateLoyaltySchemeResponse(message, providerid);      
	  });

	  var cleanupEventUpdateLoyaltySchemeNotDone = $scope.$on("updateLoyaltySchemeNotDone", function(event, message){
	    $rootScope.hideSpinner();
	    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
	  });

    $scope.$on('$destroy', function(event, message) {
      cleanupEventAddLoyaltySchemeDone();
      cleanupEventAddLoyaltySchemeNotDone();
      cleanupEventGetLoyaltySchemeDone();
      cleanupEventGetLoyaltySchemeNotDone();
      cleanupEventDeleteLoyaltySchemeDone();
      cleanupEventDeleteLoyaltySchemeNotDone();
      cleanupEventActivateLoyaltySchemeDone();
      cleanupEventActivateLoyaltySchemeNotDone();
      cleanupEventDeactivateLoyaltySchemeDone();
      cleanupEventDeactivateLoyaltySchemeNotDone();
      cleanupEventUpdateLoyaltySchemeDone();
      cleanupEventUpdateLoyaltySchemeNotDone();
    });

 }]);

