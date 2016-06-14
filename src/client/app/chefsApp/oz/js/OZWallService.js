angular.module('oz.UserApp')
  .factory('OZWallService', [
    '$rootScope',
    '$resource',
    '$http',
    '$state',
    '$log',
    function ($rootScope, $resource, $http, $state, $log) {
    var wallService = {
    	getOrderData : $resource('/api/allproductprovider', {}, {getContentOfOrder : {method :'GET'} }),
      getAllBranchesProductorders : $resource('/api/allorders/:branchid?type=:data&ordertype=:orderdata', {}, { getOrderContent : {method : 'GET', params : { branchid : '@branchid', type : '@data', ordertype: '@orderdata'}}}),
      getAllBranchesorders : $resource('/api/allorders/:branchid?type=:data&ordertype=:orderdata', {}, { getOrderContent : {method : 'GET', params : { branchid : '@branchid', type : '@data', ordertype: '@orderdata'}}}),
      sendTemplates : $resource('/api/statictemplates' , {} , { sentTemplateContent : {method : 'POST'} }),
      getTemplates : $resource('/api/statictemplates?type=:data&result=json' , {} , { getTemplateContent : {method : 'GET', params : {data : '@data'}} }),
      changeTemplates : $resource('/api/statictemplates?type=:data' , {} , { changeTemplateContent : {method : 'PUT', params : {data : '@data'}} }),
      acceptProviderRequests : $resource('/api/acceptreject/:providerid?action=:data' , {} , { acceptProviderRequest : {method : 'GET',   params : {providerid : '@providerid', data : '@data'}} }),
      getProviders : $resource('/api/newproviders' , {} , { getProvidersList : {method : 'GET'} }),
      getSuborderContent : $resource('/api/searchsuborder/:suborderid', {} , { getContent : {method : 'GET', params : {suborderid : '@suborderid'}}}),
      loadMoreOrders : $resource('api/nextorders/:orderid?ordertype=:data', {}, {get : {method : 'GET', params : {orderid : '@orderid', ordertype: '@data'}}}),
      getAllCategories : $resource('api/productcategory', {}, {get : {method : 'GET'}}),
      insertLevelOne : $resource('api/createproductcategory', {}, { post : { method : 'POST'}}),//rejectProviderRequest : $resource('/api/reject/:providerid', {} , {rejectProvider : {method : 'POST', params : {providerid : '@providerid'}}}),
      insertLowerLevel : $resource('api/createproductcategory/:categoryid', {}, {insert: {method : 'POST', params : {categoryid : '@categoryid'}}}),
      
      getAllOZProviders : $resource('/api/allproductprovider?resultkey=id_name' , {} , { getAllOZProvidersList : {method : 'GET'} }),
      getProviderPayableReport:$resource('/api/sellerspayablerefundable?providerid=:providerid&transactiondate=:date', {}, {getProviderPayableReports : {method : 'GET', params : {providerid : '@providerid', date: '@date'}}}),
   
      modifyCategory : $resource('api/updatepc/:categoryid', {}, { put : { method : 'PUT', params : {categoryid : '@categoryid'}}}),
      insertUserDefinedTags : $resource('api/searchtag', {}, {post : {method : 'POST'}}),
      // getUserDefinedTags : $resource('api/searchtags')
      getUserDefinedTags : $resource('api/searchtag', {}, {get : {method : 'GET'}}),
      deleteUserDefinedTags : $resource('api/searchtag?tagname=:tagname', {}, {delete_tags : {method : 'DELETE', params : {tagname : '@tagname'}}}),
      getAllProvidersList : $resource('/api/allproductprovider', {}, { get : { method : 'GET' }}),
      getSellerAgreementContent : $resource('/api/sellersagreement/:providerid', {}, { get : {method : 'GET' , params : {providerid : '@providerid'}}}),
      addProductCriteria : $resource('/api/productconfig/:categoryid', {}, { post : {method : 'POST',  params : {categoryid : '@categoryid'}}}),
      // getAllCriteria : $resource('/api/', {})
      changeProductCriteria : $resource('/api/productconfig/:categoryid', {}, { put : { method : 'PUT', params : {categoryid : '@categoryid'}}}),
      getProductCriteria : $resource('/api/productconfig', {}, { get : {method : 'GET'}}),
      removeProductCriteria : $resource('/api/productconfig/:criteriaid', {}, { delete : {method : 'DELETE', params : { criteriaid : '@criteriaid'}}}),
      getAllZipcodes : $resource('/api/location?key=zipcode&value=:zc', {}, { get : {method : 'GET' , params : { zc : '@zc'}}}),
      insertNewZipcode : $resource('/api/location', {}, { post : { method : 'POST'}}),
      insertZipArea : $resource('/api/location', {}, {put : { method : 'PUT'}}),
      getCountryContent : $resource('/api/location?key=country&value=:test' , {}, { get : { method : 'GET', params : {test : '@test'}}}),
      getStateContent : $resource('/api/location?key=state&value=:state', {}, { get : { method : 'GET', params : { state : '@state'}}}),
      getCityContent : $resource('/api/location?key=city&value=:city', {}, { get : { method : 'GET', params : { city : '@city'}}}),
      getAreaContent : $resource('/api/location?key=area&value=:area', {}, { get :{ method : 'GET', params : { area : '@area'}}}),
      addOrderProcess : $resource('/api/orderprocessconfig', {}, {post : {method : 'POST'}}),
      getOrderProcess : $resource('/api/orderprocessconfig', {}, {get : {method : 'GET'}}),
      removeOrderProcess : $resource('/api/orderprocessconfig/:index', {}, {remove : {method : 'DELETE', params : {index : '@index'}}}),
      getAllFeedbacks : $resource('/api/feedback', {}, {get : {method : 'GET'}}),
      getAllHelpContent : $resource('/api/faq', {}, {get : { method : 'GET'}}),
      putHelpContent : $resource('/api/faq/:faqid', {}, {put : {method : 'PUT', params : { faqid : '@faqid'}}}),
      postHelpContent : $resource('/api/faq', {}, {post: {method : 'POST'}}),
      removeHelpContent : $resource('/api/faq/:faqid', {}, {delete : {method  : 'DELETE', params : {faqid : '@faqid'}}}),
      getAllAcceptedProviders : $resource('/api/glspaymentpercent', {}, {get : {method : 'GET'}}),
      // changeSellerPayableReceivables : $resource('/api/get/test', {}, {put : 'PUT'})
      changeSellerPayablePercent : $resource('/api/glspaymentpercent/:providerid', {}, {put : {method : 'PUT', params : {providerid : '@providerid'}}}),
      getPayableDetails : $resource('/get', {}, {get : {method : 'GET'}}),
      getReceivableDetails : $resource('/get', {}, {get : {method : 'GET'}}),
      getRefundsDetails : $resource('/get', {}, {get : {method : 'GET'}}),
      changePayableDetails : $resource('/put', {}, {put : {method : 'PUT', params : {providerid : '@providerid'}}}),
      changeReceivableDetails : $resource('/put', {}, {put : {method : 'PUT', params : {providerid : '@providerid'}}}),
      changeRefundDetails : $resource('/put', {}, {put : {method : 'PUT', params : {providerid : '@providerid'}}}),
    };

    var controller = {};

    controller.getContentOfOrder = function()
    { 
    	wallService.getOrderData.getContentOfOrder(function(success)
    	{  
    		$rootScope.$broadcast('gotAllOrders', success);
    	},
    	function(error)
    	{
    		$rootScope.$broadcast('notGotAllOrders', error);
    	})
    };

    controller.getAllBranchProductOrders = function(branchid, type)
    {
      wallService.getAllBranchesorders.getOrderContent({branchid: branchid, data : type}, function(success)
      {
        $rootScope.$broadcast('gotAllBranchProductSpecificOrders', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllBranchProductSpecificOrders', error);
      })
    };

    controller.getAllBranchPassedOrders = function(branchid, type)
    {
      wallService.getAllBranchesorders.getOrderContent({branchid: branchid, data : type, orderdata: 'passed'}, function(success)
      {
        $rootScope.$broadcast('gotAllBranchSpecificOrders', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllBranchSpecificOrders', error);
      })
    };

    controller.getAllBranchFailedOrders = function(branchid, type)
    {
      wallService.getAllBranchesorders.getOrderContent({branchid: branchid, data : type, orderdata: 'failed'}, function(success)
      {
        $rootScope.$broadcast('gotAllBranchSpecificFailedOrders', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllBranchSpecificFailedOrders', error);
      })
    };

    controller.insertTemplateContent = function(content, type)
    {
        wallService.sendTemplates.sentTemplateContent(content,function(success)
        {  console.log('success received '+ JSON.stringify(success));
          $rootScope.$broadcast('contentAddedSuccessfully', success, type);
        },
        function(error) 
        {
           $rootScope.$broadcast('contentNotAddedSuccessfully', error);
        });
    };

    // controller.insertTemplateContent = function(content)
    // {
    //     wallService.sendTemplates.sentTemplateContent(content,function(success)
    //     {  console.log('success received '+ JSON.stringify(success));
    //       $rootScope.$broadcast('contentAddedSuccessfully', success);
    //     },
    //     function(error) 
    //     {
    //        $rootScope.$broadcast('contentNotAddedSuccessfully', error);
    //     });
    // };

    controller.getTemplateContent = function(type)
    {
        wallService.getTemplates.getTemplateContent({data : type},function(success)
        {  
          $rootScope.$broadcast('gotTemplates', success);
        },
        function(error) 
        {
           $rootScope.$broadcast('notGotTemplates', error);
        });
    };

    controller.changeTemplateContent = function(content,type)
    {   
        wallService.changeTemplates.changeTemplateContent({data : type}, content,function(success)
        {  
          $rootScope.$broadcast('contentChangedSuccessfully', success, type);
        },
        function(error) 
        {
           $rootScope.$broadcast('contentNotChanged', error);
        });
    };

    controller.getAllProvidersList = function()
    {
      wallService.getProviders.getProvidersList(function(success) {
        $rootScope.$broadcast('gotAllProviders', success);
      }, function(error)
      {
        $rootScope.$broadcast('notGotAllProvider', error);
      });
    };

    controller.acceptProviderRequest = function(providerid, action)
    {
      wallService.acceptProviderRequests.acceptProviderRequest({providerid:  providerid, data : action}, function(success)
      {
        $rootScope.$broadcast('providerRequestAccepted', success);
      },
      function(error)
      {
        $rootScope.$broadcast('providerRequestNotAccepted', error);
      });
    };


    controller.rejectProviderRequest = function()
    {
      wallService.rejectProviderRequest.rejectProvider({providerid : providerid} , function(success) {
        $rootScope.$broadcast('providerRequestRejected', success);
      },
      function(error)
      {
        $rootScope.$broadcast('providerRequestNotRejected', error);
      });
    };

    controller.getSuborderDetails = function(suborderid)
    {
      wallService.getSuborderContent.getContent({suborderid : suborderid}, function(success) 
      {
        $rootScope.$broadcast('gotSuborderContent', success);
      }, function(error)
      {
        $rootScope.$broadcast('notGotSuborderContent', error);
      });
    };

    controller.loadMoreOrder = function(orderid, ordertype)
    {
      wallService.loadMoreOrders.get({orderid : orderid, data: ordertype} , function(success)
      {
        $rootScope.$broadcast('more', success);
      },
      function(error)
      {
        $rootScope.$broadcast('fail', error);
      });
    };

    controller.getCount = function()
    {
      wallService.getCount.count(function(success)
      {
        $rootScope.$broadcast('gotInitialCount', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotInitialCount', error);
      });
    };

    controller.getAllCategories = function()
    { 
      wallService.getAllCategories.get(function(success)
      {
        $rootScope.$broadcast('gotAllCategoriesContent', success);
      },
      function(error)
      {
        $rootScope.$broadcast('notGotAllCategories', error);
      });
    };

    controller.addToLevelFirst = function(content)
    {
      wallService.insertLevelOne.post(content, function(success)
        {
          $rootScope.$broadcast('addedToFirstCategory', success);
        }, function(error)
        {
          $rootScope.$broadcast('addedToFirstCategoryFailed', error);
        });

    };
    controller.addToLowerCategories = function(ids, content)
    {
        wallService.insertLowerLevel.insert({categoryid: ids}, content, function(success) {
        $rootScope.$broadcast('insertToLowerCategorySuccess', success);
      },
      function(error)
      {
        $rootScope.$broadcast('insertToLowerCategoryError', error);
      });
    };
      controller.modifyCategoryName = function(ids, content)
      {
        wallService.modifyCategory.put({categoryid : ids}, content , function(success)
        {
          $rootScope.$broadcast('categoryModifiedSuccessfully', success);
        },
        function(error)
        {
                $rootScope.$broadcast('categoryNotModifiedSuccessfully', error);
        });
      };

      controller.insertProductTags = function(content)
      {
        wallService.insertUserDefinedTags.post(content, function(success)
        {
          $rootScope.$broadcast('tagsInsertedSuccessfully', success);
        },
        function(error)
        {
          $rootScope.$broadcast('tagsNotInsertedSuccessfully', error);
        });
      };

      controller.getProductTags = function()
      {
        wallService.getUserDefinedTags.get(function(success)
        {
          $rootScope.$broadcast('gotAllTags', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllTags', error);
        });
      };

      controller.deleteProductTags = function(contents)
      {  console.log(contents);
        wallService.deleteUserDefinedTags.delete_tags({tagname : contents}, function(success)
        {
          $rootScope.$broadcast('productTagDeletedSuccessfully', success);
        },
        function(error)
        {
          $rootScope.$broadcast('productTagNotDeleted', error);
        });
      };


      controller.getAllProvidersLists = function()
      {
                 wallService.getAllProvidersList.get(function(success)
                 {
                  $rootScope.$broadcast('gotAllProviders', success);
                 },
                 function(error)
                 {
                  $rootScope.$broadcast('notGotAllProviders', error);
                 });
      };

      controller.getAllSellerAgreementContent = function(ids)
      {
        wallService.getSellerAgreementContent.get({providerid : ids}, function(success)
        {
          $rootScope.$broadcast('gotSellerAgreement', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotSellerAgreement' , error);
        });
      };

      controller.insertProductCriteria = function(content, ids)
      {
        wallService.addProductCriteria.post({categoryid : ids }, content, function(success)
        {
          $rootScope.$broadcast('categoryAddedSuccessfully', success);
        },
        function(error)
        {
          $rootScope.$broadcast('categoryNotAdded', error);
        });
      };

      controller.getProductCriteria = function()
      {
        wallService.getProductCriteria.get(function(success)
         {
            $rootScope.$broadcast('gotAllCriteriaSuccessfully', success);
         },
         function(error)
         {
           $rootScope.$broadcast('notGotProductCriteria', error);
         });
      };

      controller.changeProductCriteria = function(content, ids)
      {
        wallService.changeProductCriteria.put({categoryid : ids } , content , function(success)
        {
          $rootScope.$broadcast('productCriteriaChanged', success);
        },
        function(error)
        {
          $rootScope.$broadcast('productCriteriaNotChanged', error);
        });
      }

      // controller.removeProductCriteria = function()
      controller.removeProductCriteria = function(ids)
      {
        wallService.removeProductCriteria.delete({criteriaid : ids}, function(success)
        {
          $rootScope.$broadcast('productCriteriaRemoved', success);
        },
        function(error)
        {
           $rootScope.$broadcast('productCriteriaRemovedFailure', error);
        });
      }

      controller.getAllZipCodesContent = function(zip)
      {
        wallService.getAllZipcodes.get({zc : zip}, function(success)
        {
          $rootScope.$broadcast('gotAllZipCodes', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllZipcodeContent', error);
        });
      };

      controller.insertNewZip = function(content)
      {
        wallService.insertNewZipcode.post(content, function(success)
        {
          $rootScope.$broadcast('insertedCodeContent', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notInsertZipcode', error);
        });
      };

      controller.insertAreaContent = function(content)
      {
        wallService.insertZipArea.put(content, function(success)
        {
          $rootScope.$broadcast('newAreaInserted', success);
        },
        function(error)
        {
          $rootScope.$broadcast('newAreaNotInserted', error);
        });
      };

      controller.getCountryContent = function()
      {
        wallService.getCountryContent.get({ test : 'country'}, function(success)
        {
          $rootScope.$broadcast('gotAllCountries', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllCountries', error);
        });
      };

      controller.getAllStates = function(state)
      {
        wallService.getStateContent.get({state : state}, function(success){
          $rootScope.$broadcast('gotAllStates', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllStates', error);
        });
      };

      controller.getAllCities = function(city)
      {
        wallService.getCityContent.get({city : city}, function(success)
        {
          $rootScope.$broadcast('gotAllCities', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllCities', error);
        });
      };

      controller.getAllAreas = function(area)
      {
        wallService.getAreaContent.get({area : area}, function(success)
        {
          $rootScope.$broadcast('gotAllAreas', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotAllAreas', error);
        });
      };

      controller.addOrderProcessConfig = function(content)
      {
        wallService.addOrderProcess.post(content, function(success)
        {
          $rootScope.$broadcast('orderConfigAdded', success);
        },
        function(error)
        {
          $rootScope.$broadcast('orderConfigNotAdde', error);
        });
      };
       
      controller.getOrderProcessConfig = function()
      {
        wallService.getOrderProcess.get(function(success)
        {
          $rootScope.$broadcast('gotAllOrderProcessSuccessfully', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotOrderProcess', error);
        });
      };

      // controller.removeOrderConfig = function(index)
      // {
      //   wallService.removeOrderConfig.delete(function(success)
      //   {


      //   })
      // }
      controller.removeOrderConfigContent = function(index)
      {
        wallService.removeOrderProcess.remove({index : index}, function(success)
        {
          $rootScope.$broadcast('orderProcessConfigurationRemoved', success);
        },
        function(error)
        {
          $rootScope.$broadcast('orderProcessNotRemoved', error);
        })
      };

      controller.getAllFeedbacks = function()
      {
        wallService.getAllFeedbacks.get(function(success)
        {
          $rootScope.$broadcast('gotFeedbackContent', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotFeedbackContent', error);
        });
      };

      controller.getHelpContent = function()
      {
       wallService.getAllHelpContent.get(function(success)
       {
        $rootScope.$broadcast('gotHelpContent', success);
       }, function(error)
       {
        $rootScope.$broadcast('notGotHelpContent', error);
       });
      };

      controller.changeHelpContent = function(content,list)
      {
        wallService.putHelpContent.put({ faqid : list.faqid }, content, function(success)
        {
          $rootScope.$broadcast('changedHelpContent', success,list);
        }, 
        function(error)
        {
          $rootScope.$broadcast('notChangedHelpContent', error);
        });
      };

      controller.postHelpContent = function(content)
      {
        wallService.postHelpContent.post(content, function(success)
        {
          $rootScope.$broadcast('addHelpContent', success);
        }, function(error)
        {
          $rootScope.$broadcast('notAddedHelpContent', error);
        });
      };

      controller.removeHelpContent = function(faqid)
      {
        wallService.removeHelpContent.remove({faqid : faqid } , function(success)
        {
          $rootScope.$broadcast('removedHelpContent', success);
        }, function(error)
        {
          $rootScope.$broadcast('notRemovedHelpContent', error);
        });
      };

      controller.getAllAcceptedProviders = function()
      {
        wallService.getAllAcceptedProviders.get(function(success)
        {
          $rootScope.$broadcast('acceptedProvidersListGetSuccess', success);
        },
        function(error)
        {
          $rootScope.$broadcast('acceptedProvidersListGetError', error);
        });
      };

      controller.changeSellerPayablePercent = function(content, provider)
      {
          wallService.changeSellerPayablePercent.put({providerid : provider.providerid}, content, function(success)
          {
            $rootScope.$broadcast('changedSellerPayablePercent', success, provider);
          },
          function(error)
          {
            $rootScope.$broadcast('notChangedSellerPayablePercentCriteria', error);
          });
      };

      controller.getPayableDetails = function()
      {
        wallService.getPayableDetails.get(function(success)
        {
          $rootScope.$broadcast('gotPayableDetails', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotPayableDetails', error);
        });
      };

      controller.getReceivableDetails = function()
      {
        wallService.getReceivableDetails.get(function(success)
        {
          $rootScope.$broadcast('gotReceivableDetails', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotReceivableDetails', error);
        });
      };

      controller.getRefundsDetails = function()
      {
        wallService.getRefundsDetails.get(function(success)
        {
          $rootScope.$broadcast('gotRefundsDetails', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notGotRefundsDetails', error);
        });
      };

      controller.changePayableDetails = function(content, provider)
      {
        wallService.changeProductCriteria.put({providerid : provider.providerid}, content, function(success)
        {
          $rootScope.$broadcast('changedPayableDetails', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notChangedPayableDetails', error);
        });
      };

      controller.changeReceivableDetails = function(content, provider)
      {
        wallService.changeReceivableDetails.put({providerid : provider.providerid}, content, function(success)
        {
          $rootScope.$broadcast('changedReceivableDetails', success);
        },
        function(error)
        {
          $rootScope.$broadcast('notChangedReceivableDetails', error);
        });
      };

      controller.changeRefundsDetails = function(content, provider)
      {
        wallService.changeRefundsDetails.put({providerid : provider.providerid}, content, function(success)
        {
          $rootScope.$broadcast('refundsDetailsChanged', success);
        },
        function(error)
        {
          $rootScope.$broadcast('refundsDetailsNotChanged', error);
        });
      };
     
       controller.getAllOZProvidersList = function()
        {
          wallService.getAllOZProviders.getAllOZProvidersList(function(success) {
            $rootScope.$broadcast('gotAllOZProviders', success);
          }, function(error)
          {
            $rootScope.$broadcast('notAllOZProviders', error);
          });
        };
     

     controller.getProviderPayableReport = function(reportdate,provider1){
          wallService.getProviderPayableReport.getProviderPayableReports({date:reportdate , providerid : provider1.providerid}, function(success) {
            $rootScope.$broadcast('gotProviderPayableReport', success);
          }, function(error)
          {
            $rootScope.$broadcast('notProviderPayableReport', error);
          });

        };
         

        
    return controller;
    }]);


   angular.module('oz.UserApp').factory('OZGetCount', [
    '$rootScope',
    '$resource',
    '$http',
    '$state',
    '$log', 
    function ($rootScope, $resource, $http, $state, $log) {
      var count = {
          getCount : $resource('api/usersorders/count' , {}, {count : { method : 'GET'}}),
        };
        return count;
    }]);



    