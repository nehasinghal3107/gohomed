 angular.module('oz.ProviderApp')
 .factory('ProviderServices', [
  '$resource',
  function ($resource) {
    var ProviderServices = {
        get_allProviders: $resource('/api/myproviders', {}, { getAllProviders: { method: 'GET'}}),
        get_branches: $resource('/api/branch/:providerid', {}, { getBranches: { method: 'GET', params : { providerid:'@providerid'}} }),
        get_categories: $resource('/api/allproductcategories/:providerid', {}, { getCategories: { method: 'GET', params : { providerid:'@providerid'}} }),
        get_allProducts: $resource('/api/allproduct/:branchid/:providerid', {}, { getAllProducts: { method: 'GET', params : {branchid:'@branchid', providerid:'@providerid'}} }),
        get_product: $resource('/api/productcatalog/:branchid/:productid', {}, { getProduct: { method: 'GET', params : {branchid:'@branchid', productid:'@productid'}} }),
        delete_product: $resource('/api/productcatalog/:providerid/:productid ', {}, { deleteProduct: { method: 'DELETE', params : {providerid:'@providerid', productid:'@productid'}} }),
        get_Orders: $resource('api/suborder/:providerid/:branchid?criteriastatus=:criteriastatus', {}, { getOrders: { method: 'GET', params : { providerid:'@providerid',branchid:'@branchid',criteriastatus:'@criteriastatus'}} }),
        get_productUserTags: $resource('/api/productusertags', {}, { getProductUserTags: { method: 'GET'}}),
        get_provider: $resource('/api/productprovider/:providerid', {}, { getProvider: { method: 'GET', params : { providerid:'@providerid'}} }),
        get_productConfig: $resource('/api/productconfig/:categoryid', {}, { getProductConfig: { method: 'GET', params : { categoryid:'@categoryid'}} }),
        get_order_count: $resource('/api/suborderstatuscount/:providerid/:branchid', {}, { getOrderCount: { method: 'GET'} }),
        get_productConfig: $resource('/api/productconfig/:categoryid', {}, { getProductConfig: { method: 'GET', params : { categoryid:'@categoryid'}} })
        // get_AllProductOrders: $resource('api/allorders/:branchid?type=product&:providerid', {}, { getOrders: { method: 'GET', params : {branchid:'@branchid', providerid:'@providerid'}} }),
        
        
    }
    return ProviderServices;
  }

])
 .factory('ProviderServicesList', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope)
  {
    var services = {
      manageProductDiscount : $resource('/api/getOrderStatus', {}, {get : {method : 'GET', params : {branchid : '@branchid'}}}),
      addProductDiscount : $resource('/api/discount/:providerid/:branchid', {}, { post : {method : 'POST', params : {providerid : '@providerid', branchid : '@branchid'}}}),
      getProductCode : $resource('/api/discount/:providerid/:branchid', {} , {get : { method : 'GET', params : { providerid : '@providerid', branchid : '@branchid'}}}),
      get_allProducts: $resource('/api/products/:providerid/:branchid', {}, { getAllProducts: { method: 'GET', params : {providerid:'@providerid', branchid:'@branchid'}} }),
      // assignProductDiscounts : $resource('/api/discount/products/:branchid/:discountid', {}, {assign : {method : 'PUT', params : {branchid : '@branchid', discountid : '@discountid'}}}),
      assignDiscountCodes : $resource('/api/discount/manageproducts/:branchid/:discountid', {}, {assignCodes : { method : 'PUT', params : {branchid : '@branchid', discountid : '@discountid'}}}),
      // getExistingProductsCodes : $resource('/api/discountedproducts/:branchid/:discountid', {} ,  {method : 'GET', params : {branchid : '@branchid', discountid : '@discountid'}})
      getContentOfExistingProductDiscount : $resource('/api/discountedproducts/:branchid/:discountid', {}, {getContent : {method : 'GET', params : { branchid : '@branchid', discountid : '@discountid'}}}),
      Invoice : $resource('/api/invoice/:branchid/:suborderid', {}, {getInvoiceData : {method : 'GET', params : { branchid : '@branchid', suborderid : '@suborderid'}}}),
      updateDiscountCode : $resource('/api/discount/:discountid', {}, {put : {method : 'PUT', params : {discountid : '@discountid'}}}),
      removeCode : $resource('/api/discount/:providerid/:branchid/:discountid', {}, { remove : {method : 'DELETE' , params : {providerid : '@providerid' , branchid : '@branchid', discountid : '@discountid'}}}),
      addGroupContent : $resource('/api/branch/group/:providerid/:branchid', {}, {post : {method : 'POST', params : {providerid : '@providerid', branchid : '@branchid'}}}),
      deleteGroupContent : $resource('/api/branch/group/:branchid/:groupid', {}, {delete : {method : 'DELETE', params : {branchid : '@branchid', groupid : '@groupid'}}}),

      addMembersGroup : $resource('/api/branch/groupmember/:branchid/:groupid' , {}, {post :{ method : 'POST', params : { branchid : '@branchid', groupid : '@groupid'}}}),
      getGroupContent : $resource('/api/branch/group/:providerid/:branchid', {}, {get : {method : 'GET', params : {providerid : '@providerid', branchid : '@branchid'}}}),
      removeGroupMember : $resource('/api/branch/groupmember/:branchid/:groupid/:userid', {}, {delete : {method : 'DELETE', params : {branchid : '@branchid', groupid : '@groupid', userid : '@userid'}}}),
      getAllProductForAvailability : $resource('/api/allproduct/:branchid/:providerid', {}, {get : {method : 'GET' , params : {branchid : '@branchid', providerid : '@providerid'}}}),
      assignProductAvailabilityContent : $resource('/api/productavailability/:providerid/:productid' , {}, { put : {method : 'PUT', params : {providerid : '@providerid', productid : '@productid'}}}),
      editGroupContent : $resource('/api/branch/group/:providerid/:branchid/:groupid', {}, {put : {method : 'PUT', params : {providerid : '@providerid', branchid : '@branchid', groupid : '@groupid'}}}),
    };

    var productService = {};

    productService.getAllProducts = function(branchid)
    {
      services.manageProductDiscount.get({branchid:branchid}, function(success)
      {
        $rootScope.$broadcast('gotAllProductsWithDiscounts', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllProductsWithDiscounts', error);
      });
    };

    productService.addProductCode = function(object)
    {

      services.addProductDiscount.post({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId},object,function(success)
      {
        $rootScope.$broadcast('codeAddedSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('productNotAddedSuccessfully', error);
      });
    };

    productService.getAllDiscountCodes = function()
    {
      services.getProductCode.get({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, function(success)
      {
        $rootScope.$broadcast('gotAllDiscountCodes', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllCodes', error);
      });
    };

    productService.getAllProductList = function()
    {
      services.get_allProducts.getAllProducts({ providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, function(success)
      {
        $rootScope.$broadcast('gotAllProductsList', success);
      },
      function(error)
      { 
        $rootScope.$broadcast('getProductListFailure', error);
      });
    };


    productService.addignCodesToProd = function(content, id)
    {  
      services.assignDiscountCodes.assignCodes({branchid : $rootScope.selectedBranchId, discountid : id}, content,  function(success)
      {
        $rootScope.$broadcast('codeAssignedSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('codeNotAssignedSuccessfully',error);
      });
    };

    productService.getExistingProductDetails = function(id)
    {
      services.getContentOfExistingProductDiscount.getContent({branchid : $rootScope.selectedBranchId, discountid : id}, function(success)
      {
        $rootScope.$broadcast('gotProductContent', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotProductContent', error);
      });
    };
    productService.updateDiscountDetails = function(discountid, content, list)
    {   console.log(JSON.stringify(content));
         services.updateDiscountCode.put({discountid : discountid}, content, function(success)
         {
          $rootScope.$broadcast('codeChangedSuccessfully', success, list);
         },
         function(error)
         {
          $rootScope.$broadcast('codenotChangedSuccessfully', error);
         });
    };

    productService.deleteDiscountCode = function(ids)
    {
      // services.removeCode.remove({providerid : $rootScope.selectedproviderid , branchid : })



      services.removeCode.remove({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId, discountid : ids}, function(success){
        $rootScope.$broadcast('codeRemovedSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('codeNotRemovedSuccessfully', error);
      });
    };

    productService.addGroupContent = function(content)
    {
      services.addGroupContent.post({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, content, function(success)
      {
        $rootScope.$broadcast('groupAddedSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('groupNotAddedSuccessfully', error);
      });
    };

    productService.deleteGroupContent = function(ids)
    {
      services.deleteGroupContent.delete({branchid : $rootScope.selectedBranchId, groupid : ids}, function(success)
      {
        $rootScope.$broadcast('groupDeletesSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('groupNotDeletesSuccessfully',error);
      });
    };

    // productService.addMembersToGroup = function()
    // {
    //   services.addMembers2Group.post({branchid : $rootScope.selectedBranchId, groupid : ids}, content, function(success)
    //   {
    //     $rootScope.$broadcast('groupMembersAddedSuccessfullt')
    //   })
    // }

    productService.addMembersToGroup = function(content, ids)
    {    console.log(JSON.stringify(content));
      services.addMembersGroup.post({branchid : $rootScope.selectedBranchId, groupid : ids}, content, function(success)
      {
        $rootScope.$broadcast('membersAddedSuccessfully', success);
      },
      function(error)
      {
        $rootScope.$broadcast('membersNotAddedSuccessfully', error);
      });
    };

    productService.getAllGroupContent = function()
    {  
      services.getGroupContent.get({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, function(success)
      {
        $rootScope.$broadcast('gotAllContent', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotContent', error);
      });
    };

    productService.removeGroupMember = function(userid, grpid)
    {   console.log('userid '+userid+ 'grpid '  +grpid);
      services.removeGroupMember.delete({branchid : $rootScope.selectedBranchId, groupid : grpid, userid : userid}, function(success)
      {
        $rootScope.$broadcast('memberRemoveSuccess', success, grpid);
      },
      function(error)
      {
        $rootScope.$broadcast('memberRemoveUnsuccess', error);
      });
    };
    // productService.assignCodesToProduct = function(content, id)
    // {
    //      services.assignDiscountCodes.assignCodes({branchid: $rootScope.selectedBranchId, discountid : id}, content, function(success)
    //      {
    //       $rootScope.$broadcast('codeAssignedSuccessfully', success);
    //      },
    //      function(error)
    //      {
    //       $rootScope.$broadcast('codeNotAssignedSuccessfully', error);
    //      });

    // };
    productService.getAllProductForAvailability = function()
    {
      services.getAllProductForAvailability.get({branchid : $rootScope.selectedBranchId ,providerid : $rootScope.selectedproviderid}, function(success)
      {
        $rootScope.$broadcast('gotAllProducts', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllProducts', error);
      });
    };

    productService.assignProductAvailabilityContent = function(ids, content, list)
    {
      services.assignProductAvailabilityContent.put({providerid : $rootScope.selectedproviderid, productid : ids}, content, function(success)
      {
        $rootScope.$broadcast('assignedProductAvail', success, list);
      },
      function(error)
      {
        $rootScope.$broadcast('notAssignedProductAvail', error);
      });
    };

    productService.changeGroupContent = function(groupid,content, grps)
    {
      services.editGroupContent.put({providerid : $rootScope.selectedproviderid,  branchid : $rootScope.selectedBranchId, groupid : groupid}, content, function(success)
      {
        $rootScope.$broadcast('groupContentModified', success, grps);
      },
      function(error)
      {
        $rootScope.$broadcast('groupContentNotModified', error);
      });
    };

    productService.get_Invoice = function (suborderid,branchid) {
      services.Invoice.getInvoiceData({branchid: branchid, suborderid: suborderid}, function (success) {
        console.log(success);
        $rootScope.$broadcast('getInvoiceDataDone', success);
      }, function (error) {
        console.log(error);
        $rootScope.$broadcast('getInvoiceDataNotDone', error.status);
      });
    };
    return productService;
  }]);


