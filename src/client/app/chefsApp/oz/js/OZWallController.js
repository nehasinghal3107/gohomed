angular.module('oz.UserApp')
  .controller('OZWallController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'OZWallService', '$rootScope' ,function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, OZWallService, $rootScope) {
     
     OZWallService.getContentOfOrder();

     $scope.branchNames = [];

     $scope.branchContent = [];

     $scope.currentBranch = {'branchname':''};

     $scope.type = "order";
  
     $scope.showOrderResult = 0 ;

     $scope.viewOrderContent = 0;

     $scope.viewProductContent = 0;

     $scope.controlWallView = 1;    

     $scope.showSorderView = 0;

     $scope.currentBranchId = '';
    
     $scope.products = {};

     $scope.orders = {};

     $scope.failed_orders = {};

     $scope.currentPage = 0;

     $scope.pageSize = 7;

     $scope.showTabs = 0; 

     $scope.searchCriteria = '';

     $scope.template = {};

     $scope.template.content = '';

     $scope.templates = {'hp' : '', 'au' : '', 'pp' : '', 'sa' : '', 'tc' : ''};

     $scope.orders = 10;

     $scope.customers = 110;

     $scope.active = {'init' : true, 'category' : false, 'policies' : false, 'analytics' : false};

    $scope.orderContentObject = {}; $scope.hideLoadMore = 0;

    $scope.showTextAngular = 0;
    $scope.active = {'init' :''};
    $scope.active.init = false; 

    OZWallService.getAllProvidersList();

    $scope.providers = {'list' : []};

    $scope.showSpinnerLogo = 0;

    $scope.allHelpData = [];

    $scope.tempAllHelpData = [];

    $scope.typeadheadFaqTitleArray = ['Refunds, Cancellation, Returns', 'Payments', 'Discounts', 'OrderZapp', 'Delivery', 'Order'];

    $scope.newFaqContentObject = {'question' : '', 'answer' : '', 'questionheading' : ''};
//Tab synchronisation
    $scope.trigger = function()
    {
      $scope.active.init = true;
      $scope.active.category = false;
       $scope.active.policies = false;
       $scope.active.analytics = false;
    };

    $scope.triggerConfigurationWizard = function()
    {
            $scope.active.init = false;
            $scope.active.category = true;
            $scope.active.analytics = false;
            $scope.active.policies = false;
            $scope.showSOrderView = 0;
            $scope.branchContent = [];
            $scope.currentBranchId = '';
            $scope.orders = [];
            $scope.products = [];
    };

    $scope.triggerPoliciesWizard = function()
    {
       $scope.active.init = false;
       $scope.active.category = false;
       $scope.active.policies = true;
       $scope.active.analytics = false;
       $scope.showSOrderView = 0;
          $scope.branchContent = [];
            $scope.currentBranchId = '';
             $scope.orders = [];
            $scope.products = [];
    };

    $scope.triggerAnalyticsWizard = function()
    {
       $scope.active.init = false;
       $scope.active.category = false;
       $scope.active.policies = false;
       $scope.active.analytics = true;
       $scope.showSOrderView = 0;
          $scope.branchContent = [];
            $scope.currentBranchId = '';
             $scope.orders = [];
            $scope.products = [];
    };
//End  
    $scope.providerlogo = '';
      
     $scope.showSpinners = 0;

     $scope.orderViewStatus = true;

     $scope.productViewStatus = false;

     $scope.getOrderContent = function()
     { 
              OZWallService.getContentOfOrder();
     };

     $scope.feedbackContentObject = [];
   
     $scope.showRadioButtonss = 0;
// Event listner from search controller
     $scope.$on('branch', function (event, name, branches, image, providerid)
      {
              $scope.emptyAllContent();
              $scope.branchNames = name; 
              $scope.branchContent = branches; 
              $scope.controlWallView = 0;if(branches !== undefined) {$scope.controlWallView = 1; $scope.showSorderView = 0;} 
              $scope.currentBranch = $scope.branchContent[0];
              $scope.providerlogo = image;    
              $scope.showSpinners = 0;           
              $scope.showTabs = 0;
              $rootScope.adminProviderId = providerid;
              $scope.active.init = true;
              // $state.transitionTo('');
      });
//End
     $scope.clearTemplatecontent = function()
     {
                $scope.template.content = '';
     };

      $scope.emptyAllContent = function()
      {
          $scope.branchNames = [];
          $scope.branchContent = {};
          $scope.showRadioButtonss = 0;
          $scope.orders = {};
          $scope.products = {};
          $scope.viewProductContent = 0;
          $scope.viewOrderContent = 0;
          $scope.orderContentObject = {};
      };
//Response from search controller
      $scope.$on('order', function(event, content)
      {
          $scope.orderContentObject = content; 
          $scope.showSOrderView = 1;
          $scope.controlWallView = 0;
          $state.transitionTo('oz.ozWall.ozOrderViewContent');
          $scope.trigger();
          // console.log('content from suborder search '+ content);
      });
//End  
     $scope.showOrderContent = function(branchid)
     {   
         $scope.orders = [];              $scope.hideLoadMore = 0; 
         $scope.showSpinners = 1;
         //$rootScope.showSpinner();
         $scope.currentBranchId = branchid;
         $scope.showOrderContents(); 
         $scope.showTabs = 0;
         $scope.orderViewStatus = true;$scope.productViewStatus = false;
     };

     $scope.showProductContent = function()
     {
           $scope.type = "product";
           if($scope.currentBranchId === '')
           {
            // $rootScope.OZNotify('Please search provider from sidebar and then proceed ! ', 'error');
            $rootScope.OZNotify('Please search provider from sidebar to view product details ! ', 'error');
           }
           else
           {
            OZWallService.getAllBranchProductOrders($scope.currentBranchId,$scope.type);
          }
           $scope.orderViewStatus = false;         
           $scope.productViewStatus = true;
     };

    $scope.handleAllBranchProductSpecificOrdersResponse = function(data){
      $scope.hideLoadMore = 0;
      if (data.success) {
        console.log(data);
        $scope.showSOrderView = 0;
        $scope.controlWallView = 1;
        $scope.showSpinners = 0;
        if(data.success.orders == undefined) { 
          $scope.products = {};
          $scope.products = data.success.doc;
          $scope.viewProductContent = 1;   
        }
        if($scope.orders !== undefined) {
          if($scope.orders.length >0){
            $scope.showOrderResult = 1;
          } else {
            $scope.showOrderResult = 0;
          }
        } 
        $scope.showTabs = 1;
        $scope.showSpinnerLogo = 0;
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $scope.showOrderResult = 0;
          $scope.showSpinners = 0; 
          $scope.showTabs = 1;
          $scope.products = {};
          $scope.orders = {};
          $scope.showSpinnerLogo = 0;
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
    };

    var cleanUpEventGetAllBranchProductSpecificorders = $scope.$on("gotAllBranchProductSpecificOrders",function(event,data){
      $log.debug(data);
      $scope.handleAllBranchProductSpecificOrdersResponse(data);
    });

    var cleanUpEventNotGotAllBranchProductSpecificorders = $scope.$on("notGotAllBranchProductSpecificOrders",function(event,data){
        $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

     $scope.showOrderContents = function()
     {
           $scope.type = "order";
           if($scope.currentBranchId === '')
           {
            // $rootScope.OZNotify('Please search provider from sidebar and then proceed ! ', 'error');
              $rootScope.OZNotify('Please search provider from sidebar to view order details ! ', 'error');
           }
           else
           {
            OZWallService.getAllBranchPassedOrders($scope.currentBranchId,$scope.type); $scope.showSpinnerLogo = 1;
          }
            $scope.showRadioButtonss = 1;
           $scope.viewOrderContent = 0;
           $scope.viewProductContent = 0;
           $scope.orderViewStatus = true;   
           $scope.productViewStatus = false;
     };

     $scope.handleAllBranchSpecificOrdersResponse = function(data){
      $scope.hideLoadMore = 0;
      if (data.success) {
        console.log(data);
        $scope.showSOrderView = 0;
        $scope.controlWallView = 1;
        $scope.showSpinners = 0;
        if(data.success.orders !== undefined) { 
          $scope.orders = data.success.orders; 
          $scope.viewOrderContent = 1;    
        }
        if($scope.orders !== undefined) {
          if($scope.orders.length >0){
            $scope.showOrderResult = 1;
          } else {
            $scope.showOrderResult = 0;
          }
        } 
        $scope.showTabs = 1;
        $scope.showSpinnerLogo = 0;
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $scope.showOrderResult = 0;
          $scope.showSpinners = 0; 
          $scope.showTabs = 1;
          $scope.products = {};
          $scope.orders = {};
          $scope.showSpinnerLogo = 0;
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
    };

    var cleanUpEventGetAllBranchSpecificorders = $scope.$on("gotAllBranchSpecificOrders",function(event,data){
      $log.debug(data);
      $scope.handleAllBranchSpecificOrdersResponse(data);   
    });

    var cleanUpEventNotGotAllBranchSpecificorders = $scope.$on("notGotAllBranchSpecificOrders",function(event,data){
      $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });


    $scope.showFailedOrderContents = function()
     {
           $scope.type = "order";
           if($scope.currentBranchId === '')
           {
            // $rootScope.OZNotify('Please search provider from sidebar and then proceed ! ', 'error');
              $rootScope.OZNotify('Please search provider from sidebar to view order details ! ', 'error');
           }
           else
           {
            OZWallService.getAllBranchFailedOrders($scope.currentBranchId,$scope.type); $scope.showSpinnerLogo = 1;
          }
            $scope.showRadioButtonss = 1;
           $scope.viewOrderContent = 0;
           $scope.viewProductContent = 0;
           $scope.orderViewStatus = true;   
           $scope.productViewStatus = false;
     };

     $scope.handleAllBranchSpecificFailedOrdersResponse = function(data){
      $scope.hideLoadMore = 0;
      if (data.success) {
        console.log(data);
        $scope.showSOrderView = 0;
        $scope.controlWallView = 1;
        $scope.showSpinners = 0;
        if(data.success.orders !== undefined) { 
          $scope.failed_orders = data.success.orders; 
          $scope.viewOrderContent = 1;    
        }
        if($scope.failed_orders !== undefined) {
          if($scope.failed_orders.length >0){
            $scope.showOrderResult = 1;
          } else {
            $scope.showOrderResult = 0;
          }
        } 
        $scope.showTabs = 1;
        $scope.showSpinnerLogo = 0;
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $scope.showOrderResult = 0;
          $scope.showSpinners = 0; 
          $scope.showTabs = 1;
          $scope.products = {};
          $scope.failed_orders = {};
          $scope.showSpinnerLogo = 0;
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
    };

    var cleanUpEventGetAllBranchSpecificFailedorders = $scope.$on("gotAllBranchSpecificFailedOrders",function(event,data){
      $log.debug(data);
      $scope.handleAllBranchSpecificFailedOrdersResponse(data);   
    });

    var cleanUpEventNotGotAllBranchSpecificFailedorders = $scope.$on("notGotAllBranchSpecificFailedOrders",function(event,data){
      $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });


    $scope.loadMoreOrder = function(id, ordertype)
    { 
          $scope.showSpinners = 1;
          OZWallService.loadMoreOrder(id, ordertype);
    };

     var cleanUpEventLoadMore = $scope.$on("more",function(event,data){
        if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {$rootScope.OZNotify(data.error.message,'error');  $scope.showSpinners = 0;}
        }
        if(data.success)
        {      $scope.showSpinners = 0;
               for (var j = 0 ; j<data.success.orders.length; j++)
               {
                      $scope.orders.push(data.success.orders[j]);
               }
               if(data.success.orders.length <10)
               {
                 $scope.hideLoadMore = 1;
               }
        } 
    });

    var cleanUpEventLoadMoreFail = $scope.$on("fail",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });
// Manage order done

//Manage T&C Help SA etc
    $scope.sendTemplateContent = function(type)
    {   
      OZWallService.insertTemplateContent($scope.jsonTemplateContent(type), type);
    };

   $scope.jsonTemplateContent = function(type) {
      var formatTextInitial = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ $scope.template.content + '</div></html>';

   
      var currentTemplate = 
        {
          'templatedata':
          {
            'type' : type,
            'template' : formatTextInitial,
          }
       
        };
      return JSON.stringify(currentTemplate); 
  };

     $scope.jsonTemplateContentChange = function() {
      var formatText = '<!DOCTYPE html><html><meta name="viewport" content="width=device-width, initial-scale=1"><div style = "text-align:justify">'+ $scope.template.content + '</div></html>';

      var currentTemplate = 
        {
          'templatedata':
          {
            'template' : formatText,
          }
       
        };
      return JSON.stringify(currentTemplate); 
  };

   var cleanUpEventSentTemplateSuccessfully = $scope.$on("contentAddedSuccessfully",function(event,data,type){
        if(data.error)
        {
          if(data.error.code === 'AL001')
              {
                    $rootScope.showModal();
              }
              else
              {
                $rootScope.OZNotify(data.error.message,'error');
              }
        }
        if(data.success)
        {
            $rootScope.OZNotify(data.success.message,'success');
            $scope.template.content = '';
            $scope.getTemplateContent(type);
            
        } 
    });

    var cleanUpEventNotSentTemplateSuccessfully = $scope.$on("contentNotAddedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    $scope.getTemplateContent = function(type)
    {   
               $scope.showTextAngular = 0;
               OZWallService.getTemplateContent(type);
    };

    $scope.updateCurrentTemplateContent = function(type)
    {     
          OZWallService.changeTemplateContent($scope.jsonTemplateContentChange(),type);
    };

   var cleanUpEventUpdateTemplateSuccessfully = $scope.$on("contentChangedSuccessfully",function(event,data,type){
        if(data.error)
        {
        if(data.error.code === 'AL001')
            {
                  $rootScope.showModal();
            }
            else
            {
                $rootScope.OZNotify(data.error.message,'error');
            }
        }
        if(data.success)
        { 
            $rootScope.OZNotify(data.success.message,'success');
            $scope.getTemplateContent(type);
        } 
    });

    var cleanUpEventUpdateTemplateFailure = $scope.$on("contentNotChanged",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });


    var cleanUpEventgetTemplateSuccessfully = $scope.$on("gotTemplates",function(event,data){
        if(data.error)
        {
           // $rootScope.OZNotify(data.error.message,'error');
               if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                
        }
        if(data.success)
        {    
            $scope.templates = {'hp' : '', 'au' : '', 'pp' : '', 'sa' : '', 'tc' : ''};
            if(data.success.template.type.toLowerCase() === 'hp')
            {
              $scope.templates.hp = data.success.template.template;
            }
            if(data.success.template.type.toLowerCase() === 'au')
            {
              $scope.templates.au = data.success.template.template;
            }
            if(data.success.template.type.toLowerCase() === 'tc')
            {
              $scope.templates.tc = data.success.template.template;
            }
            if(data.success.template.type.toLowerCase() === 'pp')
            {
              $scope.templates.pp = data.success.template.template;
            }
              if(data.success.template.type.toLowerCase() === 'sa')
            {
              $scope.templates.sa = data.success.template.template;
            }
        } 
    });

    var cleanUpEventNotGotTemplateSuccessfully = $scope.$on("notGotTemplates",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    $scope.updateCurrentTemplate = function(content)
    {  
      $scope.template.content = content;
        $scope.showTextAngular = 1;

    };
//Seller acceptance module
    $scope.accept = function(id)
    {
          OZWallService.acceptProviderRequest(id, 'accept');
    };

    $scope.reject = function(id)
    {
          OZWallService.acceptProviderRequest(id, 'reject');
    };

   var cleanUpEventproviderRequestAcceptORReject = $scope.$on("providerRequestAccepted",function(event,data){
        if(data.error)
        {

                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {$rootScope.OZNotify(data.error.message,'error');}
        }
        if(data.success)
        {    
            $rootScope.OZNotify(data.success.message, 'success');
            OZWallService.getAllProvidersList();
        } 
    });

    var cleanUpEventproviderRequestAcceptORRejectFail = $scope.$on("providerRequestNotAccepted",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });
    
    $scope.getAllProvidersList = function()
    {
          OZWallService.getAllProvidersList();
    };

    var cleanUpEventgetAllProvidersSuccess = $scope.$on("gotAllProviders",function(event,data){
        if(data.error)
        {
        if(data.error.code === 'AL001')
            {
                  $rootScope.showModal();
            }
            else
            {
            //$rootScope.OZNotify(data.error.message,'error');
            $scope.providers.list = [];
          }
        }
        if(data.success)
        {
               $scope.providers.list = data.success.provider;
        } 
    });

    var cleanUpEventNotGotAllProviders = $scope.$on("notGotAllProvider",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

   
// View user feedback
    $scope.getAllFeedbackContent = function()
    {
       OZWallService.getAllFeedbacks();
    };

    var cleanUpEventGotFeedback = $scope.$on("gotFeedbackContent",function(event,data){
        if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error');  
                  }
                  $scope.feedbackContentObject = [];
        }
        if(data.success)
        { 
            $scope.feedbackContentObject = [];
            $scope.feedbackContentObject = angular.copy(data.success.feedback);
        } 
    });

    var cleanUpEventNotGotFeedback = $scope.$on("notGotFeedbackContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });
//End
// Help module
    var cleanUpEventGotAllHelpContent = $scope.$on("gotHelpContent",function(event,data){
        if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error');  
                  }
                  $scope.allHelpData = [];
                  $scope.tempAllHelpData = [];
        }
        if(data.success)
        { 
            $scope.allHelpData = [];
            $scope.allHelpData = angular.copy(data.success.faqs);
            $scope.tempAllHelpData = [];
            $scope.tempAllHelpData = angular.copy(data.success.faqs);
        } 
    });

    var cleanUpEventNotGotAllHelpContent = $scope.$on("notGotHelpContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.editQuestionHere = function(list)
    {
      list.editing = true;
    };

    $scope.cancelQuestionChange = function(list)
    {
      list.editing = false;
      $scope.allHelpData = angular.copy($scope.tempAllHelpData);
    };


    $scope.changeQuestionContent = function(list)
    {
       var content = { 'faqdata' : { 'question' : "" , ' answer' :""} };
       content.faqdata.question = list.question;  content.faqdata.answer = list.answer;
       OZWallService.changeHelpContent(content,list);
    };

    var cleanUpEventChangeHelpContent = $scope.$on("changedHelpContent",function(event,data,list){
        if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error');  
                  }

        }
        if(data.success)
        { 
            list.editing = false;
            OZWallService.getHelpContent();
            $rootScope.OZNotify(data.success.message, 'success');

        } 
    });

    var cleanUpEventNotChangeHelpContent = $scope.$on("notChangedHelpContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.removeQuestionHere = function(faqid)
    {
           OZWallService.removeHelpContent(faqid);
    };

    var cleanUpEventRemoveHelpContent = $scope.$on("removedHelpContent",function(event,data){
        if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error');  
                  }
                  $scope.allHelpDate = [];
                  $scope.tempAllHelpData = [];
        }
        if(data.success)
        { 
              OZWallService.getHelpContent();
              $rootScope.OZNotify(data.success.message, 'success');
        } 
    });

    var cleanUpEventNotRemoveHelpContent = $scope.$on("notRemovedHelpContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.insertNewFaqContent = function()
    {
          var content = { 'faqdata' : { 'question' : "" , ' answer' :"", 'questionheading' : ''} };
          content.faqdata.question = $scope.newFaqContentObject.question;
          content.faqdata.answer = $scope.newFaqContentObject.answer;
          content.faqdata.questionheading = $scope.newFaqContentObject.questionheading;
          OZWallService.postHelpContent(content);
    };

   var cleanUpEventAddHelpContent = $scope.$on("addHelpContent",function(event,data){
   if(data.error)
        {
                if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error');  
                  }
        }
        if(data.success)
        { 
            OZWallService.getHelpContent();
            $rootScope.OZNotify(data.success.message, 'success');
            $scope.newFaqContentObject = {'question' : '', 'answer' : '', 'questionheading' : ''};

        } 
    });

    var cleanUpEventNotAddedHelpContent = $scope.$on("notAddedHelpContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });
// Help module done

    $scope.$on('$destroy', function(event, message) 
    {
        cleanUpEventGetAllBranchSpecificorders();
        cleanUpEventNotGotAllBranchSpecificorders();
        cleanUpEventSentTemplateSuccessfully();
        cleanUpEventNotSentTemplateSuccessfully();
        cleanUpEventgetTemplateSuccessfully();
        cleanUpEventNotGotTemplateSuccessfully();
        cleanUpEventUpdateTemplateSuccessfully();
        cleanUpEventUpdateTemplateFailure();
        cleanUpEventgetAllProvidersSuccess();
        cleanUpEventNotGotAllProviders();
        cleanUpEventproviderRequestAcceptORReject();
        cleanUpEventproviderRequestAcceptORRejectFail();
        cleanUpEventLoadMore();
        cleanUpEventLoadMoreFail();
        cleanUpEventGotFeedback();
        cleanUpEventNotGotFeedback();
        cleanUpEventGotAllHelpContent();
        cleanUpEventNotGotAllHelpContent();
        cleanUpEventChangeHelpContent();
        cleanUpEventNotChangeHelpContent();
        cleanUpEventRemoveHelpContent();
        cleanUpEventNotRemoveHelpContent();
        cleanUpEventAddHelpContent();
        cleanUpEventNotAddedHelpContent();
        cleanUpEventGetAllBranchProductSpecificorders();
        cleanUpEventNotGotAllBranchProductSpecificorders();
        // cleanUpEventgetAllCountSuccess();
        // cleanUpEventNotGotAllCount();

    });

    $scope.numberOfPages = function () 
    {    
         return Math.ceil($scope.branchContent.length / $scope.pageSize);
    };
    
    $scope.getAllProviders = function()
    {
          OZWallService.getAllProvidersList();
    };

    $scope.showConfigurationContent = function(product)
    {
       if(product.editing === true)
       {
        product.editing = false;
       }
       else
       {
        product.editing = true;
       }

    };

    $scope.clearContentT = function()
    {
          $scope.showSOrderView = 0;
    };
    // if(userCounter.error)
    // {
    //         $rootScope.OZNotify('There is some issue with server!', 'error');
    // }
    
    $scope.clearFAQObject = function()
    {
           $scope.newFaqContentObject = {'question' : '', 'answer' : '', 'questionheading' : ''};

    };

    $scope.resetToMain = function()
    {
          $scope.showSOrderView = 0;
          $scope.controlWallView = 1;
    };
    
    $scope.convertMomentFormat = function(time)
    {
       if (time != undefined) 
        { 
          return moment(time).format('dddd, MMMM Do YYYY')
        }; 
    };


    $scope.getHelpContent = function()
    {
      OZWallService.getHelpContent();
    };

     

 }]);

angular.module('oz.UserApp').filter('startFrom', function () {
  return function (input, start) {
    if (input !== undefined || start !== undefined) {
      start = +start;
      return input.slice(start);
    }
  }
})