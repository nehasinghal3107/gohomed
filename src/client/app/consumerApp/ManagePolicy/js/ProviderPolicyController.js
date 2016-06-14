angular.module('oz.ProviderApp')
  .controller('ProviderPolicyController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', function($scope, $state, $http, $timeout, $sce, $log, $rootScope) {
     // $log.debug(" provider policy");
     $scope.tabForPolicy={};

    $rootScope.$watch('selectedBranchId', function (selectedBranchId) {
      $rootScope.selectedBranchId=selectedBranchId;
      if($scope.tabForPolicy.op == true){
          $scope.getOP();
      }else if($scope.tabForPolicy.rp == true){
          $scope.getRP();
      }else if($scope.tabForPolicy.pp == true){
          $scope.getPP();
      }else if($scope.tabForPolicy.dp == true){
          $scope.getDP();
      }else if($scope.tabForPolicy.cp == true){
          $scope.getCP();
      }
      
    });

      // var formatTextInitial = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ $scope.template.content + '</div></html>';
    
   // ------------------------op-----------------------------------
     $scope.new_ordering_policy;
     $scope.ordering_policy;
     $scope.tempOrdering_policy
     $scope.opEditor=0;
     $scope.opAddEditor=0;
     $scope.addPolicyOP=function(ordering_policy){
	   // $log.debug(ordering_policy);
     if(ordering_policy==""){
      $rootScope.OZNotify("Please enter policy", 'error');  
     }else{

     var ordering_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ ordering_policy + '</div></html>';

        if($rootScope.selectedBranchId && $rootScope.selectedproviderid){
          $rootScope.showSpinner();
            $http({
               method: 'POST',
               url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=ordering_policy',
               data:{"text":ordering_policyFormated}, 
             }).success(function(data, status, headers, cfg){
               $rootScope.hideSpinner();
               $scope.handleAddOPData(data);
            }).error(function(data, status, headers, cfg){
               $rootScope.hideSpinner();
               $rootScope.OZNotify(status, 'error');  
           });
        }
     }
   
     };

     $scope.editPolicyOP=function(ordering_policy){
	   // $log.debug(ordering_policy);
      if(ordering_policy==""){
       $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var ordering_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ ordering_policy + '</div></html>';

        if($rootScope.selectedBranchId && $rootScope.selectedproviderid){ 
          $rootScope.showSpinner();
           $http({
    	        method: 'PUT',
    	        url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=ordering_policy',
    	        data:{"text":ordering_policyFormated}, 
    	    	 }).success(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
    	    	    $scope.handleAddOPData(data);
    		 	   }).error(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
    		        $rootScope.OZNotify(status, 'error');  
    		   	 });
          }
      }
     };

     $scope.handleAddOPData=function(data){
     	if(data.success){
         $rootScope.OZNotify(data.success.message, 'success');  
         $scope.opAddEditor=0;
         $scope.opEditor=0;
         $scope.opEditorEdit=0;
         $scope.getOP();
     	}
     	else {
     		$log.debug(data.error);
         if(data.error.code=='AL001'){
          $rootScope.showModal();
        }
     	}
     	// $log.debug(data);
     }

     $scope.getOP=function(){
      if($rootScope.selectedBranchId && $rootScope.selectedproviderid){ 
        $rootScope.showSpinner();
  	    $http({
  	          method: 'GET',
  	          url: '/api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=ordering_policy',
  	    	   }).success(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
  	    	      $scope.handleGetOPData(data);
  		    	 }).error(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
  		         $rootScope.OZNotify(status, 'error');  
  		    	 });
            }
     };
     $scope.getOP();

     $scope.handleGetOPData=function(data){
       if(data.error){
          if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
       	 $scope.opAddEditor=1;
       
       }
       else if(data.success){
       	$scope.opAddEditor=0;
       	$scope.ordering_policy=data.success.policy.ordering_policy;
       }

     };
     
     $scope.onOp=function(){
      $scope.opEditorEdit=1;
      $scope.tempOrdering_policy = angular.copy($scope.ordering_policy); 
     };

     $scope.cancelOP=function(){
         $scope.ordering_policy= $scope.tempOrdering_policy ;
         $scope.opAddEditor=0;
         $scope.opEditor=0;
         $scope.opEditorEdit=0;
         // $scope.getOP();

     };

   // ------------------------rp-----------------------------------

     $scope.new_refunds_policy;
     $scope.refunds_policy;
     $scope.tempRefunds_policy;
     $scope.rpEditor=0;
     $scope.rpAddEditor=0;
     $scope.addPolicyRP=function(refunds_policy){
	   // $log.debug(refunds_policy);
      if(refunds_policy==""){
       $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var refunds_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ refunds_policy + '</div></html>';

       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
         $rootScope.showSpinner();
         $http({
  	        method: 'POST',
  	        url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=refunds_policy',
  	        data:{"text":refunds_policyFormated}, 
  	    	  }).success(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
  	    	    $scope.handleAddRPData(data);
  		 	    }).error(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
  		        $rootScope.OZNotify(status, 'error');  
  		   	 });
          }
        }
     };

     $scope.editPolicyRP=function(refunds_policy){
	   // $log.debug("Saving..");
	   // $log.debug(refunds_policy);
      if(refunds_policy==""){
       $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var refunds_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ refunds_policy + '</div></html>';

       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
         $rootScope.showSpinner();
         $http({
  	        method: 'PUT',
  	        url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=refunds_policy',
  	        data:{"text":refunds_policyFormated}, 
  	    	 }).success(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
  	    	    $scope.handleAddRPData(data);
  		   	 }).error(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
  		       $rootScope.OZNotify(status, 'error');  
  		   	 });
          }
        }
     };

     $scope.handleAddRPData=function(data){
     	if(data.success){
         $rootScope.OZNotify(data.success.message, 'success');  
         $scope.rpAddEditor=0;
         $scope.rpEditor=0;
         $scope.rpEditorEdit=0;
         $scope.getRP();
     	}
     	else {
         if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
     		$log.debug(data.error);
     	}
     	// $log.debug(data);
     }

     $scope.getRP=function(){
       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
          $rootScope.showSpinner();
    	    $http({
    	        method: 'GET',
    	        url: '/api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=refunds_policy',
    	    	 }).success(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
    	    	    $scope.handleGetRPData(data);
    		 	 }).error(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
    		        $rootScope.OZNotify(status, 'error');  
    		   	 });
          }
     };
   

     $scope.handleGetRPData=function(data){
       if(data.error){
         if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
       	 $scope.rpAddEditor=1;
       }
       else if(data.success){
       	$scope.rpAddEditor=0;
       	$scope.refunds_policy=data.success.policy.refunds_policy;
       	// $log.debug($scope.refunds_policy);
       }

     };

     $scope.onRp=function(){
      $scope.rpEditorEdit=1;
      $scope.tempRefunds_policy = angular.copy($scope.refunds_policy); 
     };

      $scope.cancelRP=function(){
         $scope.rpAddEditor=0;
         $scope.rpEditor=0;
         $scope.rpEditorEdit=0;
         $scope.getRP();

     };

   // ------------------------rp-----------------------------------

// ------------------------pp-----------------------------------

     $scope.new_price_policy;
     $scope.price_policy;
     $scope.tempPrice_policy;
     $scope.ppEditor=0;
     $scope.ppAddEditor=0;
     $scope.addPolicyPP=function(price_policy){
     // $log.debug(price_policy);
      if(price_policy==""){
       $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var price_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ price_policy + '</div></html>';
       $rootScope.showSpinner();
       $http({
          method: 'POST',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=price_policy',
          data:{"text":price_policyFormated}, 
         }).success(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $scope.handleAddPPData(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $rootScope.OZNotify(status, 'error');  
         });
      }
     };

     $scope.editPolicyPP=function(price_policy){
     // $log.debug("Saving..");
     // $log.debug(price_policy);
      if(price_policy==""){
       $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var price_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ price_policy + '</div></html>';
      $rootScope.showSpinner();
       $http({
          method: 'PUT',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=price_policy',
          data:{"text":price_policyFormated}, 
         }).success(function(data, status, headers, cfg){
           $rootScope.hideSpinner();
            $scope.handleAddPPData(data);
         }).error(function(data, status, headers, cfg){
           $rootScope.hideSpinner();
           $rootScope.OZNotify(status, 'error');  
         });
       }
     };

     $scope.handleAddPPData=function(data){
      if(data.success){
         $rootScope.OZNotify(data.success.message, 'success');  
         $scope.ppAddEditor=0;
         $scope.ppEditor=0;
         $scope.ppEditorEdit=0;
         $scope.getPP();
      }
      else {
        if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
        $log.debug(data.error);
      }
      // $log.debug(data);
     }

     $scope.getPP=function(){
       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
        $rootScope.showSpinner();
          $http({
              method: 'GET',
              url: '/api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=price_policy',
             }).success(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
                $scope.handleGetPPData(data);
           }).error(function(data, status, headers, cfg){
                $rootScope.hideSpinner();
                $rootScope.OZNotify(status, 'error');  
             });
         }
     };
   

     $scope.handleGetPPData=function(data){
       if(data.error){
         if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
         $scope.ppAddEditor=1;
       }
       else if(data.success){
        $scope.ppAddEditor=0;
        $scope.price_policy=data.success.policy.price_policy;
        // $log.debug($scope.price_policy);
       }

     };

     $scope.onPp=function(){
      $scope.ppEditorEdit=1;
      $scope.tempPrice_policy = angular.copy($scope.price_policy); 
     };

      $scope.cancelPP=function(){
         $scope.ppAddEditor=0;
         $scope.ppEditor=0;
         $scope.ppEditorEdit=0;
         $scope.getPP();

     };


   // ------------------------pp-----------------------------------

   
   // ------------------------dp-----------------------------------

     $scope.new_delivery_policy;
     $scope.delivery_policy;
     $scope.tempDelivery_policy;
     $scope.dpEditor=0;
     $scope.dpAddEditor=0;
     $scope.addPolicyDP=function(delivery_policy){
     // $log.debug(delivery_policy);
      if(delivery_policy==""){
        $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var delivery_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ delivery_policy + '</div></html>';
       $rootScope.showSpinner();
       $http({
          method: 'POST',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=delivery_policy',
          data:{"text":delivery_policyFormated}, 
         }).success(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $scope.handleAddDPData(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $rootScope.OZNotify(status, 'error');  
         });
       }
     };

     $scope.editPolicyDP=function(delivery_policy){
     // $log.debug(price_policy);
      if(delivery_policy==""){
        $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var delivery_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ delivery_policy + '</div></html>';
      $rootScope.showSpinner();
       $http({
          method: 'PUT',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=delivery_policy',
          data:{"text":delivery_policyFormated}, 
         }).success(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $scope.handleAddDPData(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
           $rootScope.OZNotify(status, 'error');  
         });
       }
     };

     $scope.handleAddDPData=function(data){
      if(data.success){
         $rootScope.OZNotify(data.success.message, 'success');  
         $scope.dpAddEditor=0;
         $scope.dpEditor=0;
         $scope.dpEditorEdit=0;
         $scope.getDP();
      }
      else {
          if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
        $log.debug(data.error);
      }
      // $log.debug(data);
     }

     $scope.getDP=function(){
       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
        $rootScope.showSpinner();
        $http({
            method: 'GET',
            url: '/api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=delivery_policy',
           }).success(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
              $scope.handleGetDPData(data);
         }).error(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
              $rootScope.OZNotify(status, 'error');  
           });
       }
     };

   

     $scope.handleGetDPData=function(data){
       if(data.error){
          if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
         $scope.dpAddEditor=1;
       }
       else if(data.success){
        $scope.dpAddEditor=0;
        $scope.delivery_policy=data.success.policy.delivery_policy;
        // $log.debug($scope.delivery_policy);
       }

     };

    $scope.onDp=function(){
      $scope.dpEditorEdit=1;
      $scope.tempDelivery_policy = angular.copy($scope.delivery_policy); 
     };

      $scope.cancelDP=function(){
         $scope.dpAddEditor=0;
         $scope.dpEditor=0;
         $scope.dpEditorEdit=0;
         $scope.getDP();
     };

   // ------------------------dp-----------------------------------


// ------------------------cp-----------------------------------

     $scope.new_cancellation_policy;
     $scope.cancellation_policy;
     $scope.tempCancellation_policy;
     $scope.cpEditor=0;
     $scope.cpAddEditor=0;
     $scope.addPolicyCP=function(cancellation_policy){
     // $log.debug(cancellation_policy);
      if(cancellation_policy==""){
        $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var cancellation_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ cancellation_policy + '</div></html>';
      $rootScope.showSpinner();
       $http({
          method: 'POST',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=cancellation_policy',
          data:{"text":cancellation_policyFormated}, 
         }).success(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $scope.handleAddCPData(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $rootScope.OZNotify(status, 'error');  
         });
       }
     };

     $scope.editPolicyCP=function(cancellation_policy){
     // $log.debug("Saving..");
     // $log.debug(price_policy);
      if(cancellation_policy==""){
        $rootScope.OZNotify("Please enter policy", 'error');  
      }else{
     var cancellation_policyFormated = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ cancellation_policy + '</div></html>';
       $rootScope.showSpinner();
       $http({
          method: 'PUT',
          url: ' /api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=cancellation_policy',
          data:{"text":cancellation_policyFormated}, 
         }).success(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $scope.handleAddCPData(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.hideSpinner();
            $rootScope.OZNotify(status, 'error');  
         });
       }
     };

     $scope.handleAddCPData=function(data){
      if(data.success){
         $rootScope.OZNotify(data.success.message, 'success');  
         $scope.cpAddEditor=0;
         $scope.cpEditor=0;
         $scope.cpEditorEdit=0;
         $scope.getCP();
      }
      else {
          if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
        $log.debug(data.error);
      }
      // $log.debug(data);
     }

     $scope.getCP=function(){
       if($rootScope.selectedBranchId && $rootScope.selectedproviderid){  
       $rootScope.showSpinner();
        $http({
            method: 'GET',
            url: '/api/branchpolicy/'+$rootScope.selectedproviderid+'/'+$rootScope.selectedBranchId +'?type=cancellation_policy',
           }).success(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
              $scope.handleGetCPData(data);
         }).error(function(data, status, headers, cfg){
              $rootScope.hideSpinner();
              $rootScope.OZNotify(status, 'error');  
           });
     }
     };
   

     $scope.handleGetCPData=function(data){
       if(data.error){
          if(data.error.code=='AL001'){
            $rootScope.showModal();
          }
         $scope.cpAddEditor=1;
       }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
       else if(data.success){
        $scope.cpAddEditor=0;
        $scope.cancellation_policy=data.success.policy.cancellation_policy;
        // $log.debug($scope.cancellation_policy);
       }

     };

    $scope.onCp=function(){
      $scope.cpEditorEdit=1;
      $scope.tempCancellation_policy = angular.copy($scope.cancellation_policy); 
     };

     $scope.cancelCP=function(){
         $scope.cpAddEditor=0;
         $scope.cpEditor=0;
         $scope.cpEditorEdit=0;
         $scope.getCP();
     };

   // ------------------------cp-----------------------------------

 }]);

