angular.module('oz.ProviderApp')

	.factory('ManageSellerService', [
	  '$resource',
	  function ($resource) {
	    var Seller = {
	      MyProvider: $resource('/api/myproviders', {}, { GetMyProvider: { method: 'GET'} }),
	      SelectedProvider: $resource('/api/productprovider/:providerid', {}, { GetSelectedProvider: { method: 'GET'} }),
	      LevelOneCategory: $resource('/api/leveloneCategory', {}, { GetSellerCategory: { method: 'GET'} }),
	      MyProviderBranch: $resource('/api/branch/:providerid', {}, { GetMyProviderBranch: { method: 'GET'} }),
	      Order_Status: $resource('/api/orderprocessconfig', {}, { GetOrderStatus: { method: 'GET'} }),
	      Pickup_Address: $resource('/api/pickupaddress/:providerid', {}, { GetPickupAddress: { method: 'GET'} })
	    }
	    return Seller;
	  }
	])
	.factory('ManageBranchService', [
	  '$rootScope',
	  '$resource',
	  '$http',
	  '$state',
	  '$log',
	  function ($rootScope, $resource, $http, $state, $log) {
	    var ManageBranchService = {
      	Add_Branch: $resource('/api/branch/:providerid', {}, { add_Seller_Branch: { method: 'POST', params: { providerid: '@providerid' } } }),
    		Publish_Branch: $resource('/api/publishunpublish/branch/:providerid/:branchid?action=:data', {}, { publish_Seller_Branch: { method: 'GET', params: { providerid: '@providerid', branchid: '@branchid', data: '@data' } } }),
    		Edit_Branch: $resource('/api/branch/:providerid/:branchid', {}, { edit_Seller_Branch: { method: 'PUT', params: { providerid: '@providerid', branchid: '@branchid'} } }),
    		Edit_Seller: $resource('/api/productprovider/:providerid', {}, { edit_Seller: { method: 'PUT', params: { providerid: '@providerid'} } }),
    		Add_Pickup_Address: $resource('/api/pickupaddress/:providerid', {}, { add_PickupAddress: { method: 'POST', params: { providerid: '@providerid'} } }),  
    		Delete_Pickup_Address: $resource('/api/pickupaddress/:providerid/:addressid', {}, { delete_PickupAddress: { method: 'DELETE', params: { providerid: '@providerid', addressid: '@addressid'} } }),
    		Update_Pickup_Address: $resource('/api/pickupaddress/:providerid/:addressid', {}, { update_PickupAddress: { method: 'PUT', params: { providerid: '@providerid', addressid: '@addressid'} } })
    	};
	    var branch = {};

	    branch.addBranch = function (branchdata) {
	      ManageBranchService.Add_Branch.add_Seller_Branch({providerid: $rootScope.selectedproviderid}, branchdata, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('addBranchDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('addBranchNotDone', error.status);
	      });
	    };

	    branch.publishBranch = function (branchid) {
	      ManageBranchService.Publish_Branch.publish_Seller_Branch({providerid: $rootScope.selectedproviderid,  branchid: branchid, data: 'publish'}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('publishBranchDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('publishBranchNotDone', error.status);
	      });
	    };

	    branch.editBranch = function (branchdata, branchid) {
	      ManageBranchService.Edit_Branch.edit_Seller_Branch({providerid: $rootScope.selectedproviderid, branchid: branchid}, branchdata, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('editBranchDone', success, branchid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('editBranchNotDone', error.status);
	      });
	    };

	    branch.update_seller = function (sellerdata, sellerid) {
	      ManageBranchService.Edit_Seller.edit_Seller({providerid: sellerid}, sellerdata, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('editSellerDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('editSellerNotDone', error.status);
	      });
	    };

	    branch.addPickupLocation = function (addressdata) {
	      ManageBranchService.Add_Pickup_Address.add_PickupAddress({providerid: $rootScope.selectedproviderid}, addressdata, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('addPickupAddressDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('addPickupAddressNotDone', error.status);
	      });
	    };

	    branch.deletePickupLocation = function (addressid) {
	      ManageBranchService.Delete_Pickup_Address.delete_PickupAddress({providerid: $rootScope.selectedproviderid, addressid: addressid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('deletePickupAddressDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('deletePickupAddressNotDone', error.status);
	      });
	    };

	    branch.updatePickupLocation = function (addressdata, addressid) {
	      ManageBranchService.Update_Pickup_Address.update_PickupAddress({providerid: $rootScope.selectedproviderid, addressid: addressid}, addressdata, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('updatePickupAddressDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('updatePickupAddressNotDone', error.status);
	      });
	    };

	    return branch;
	  }
	]);
