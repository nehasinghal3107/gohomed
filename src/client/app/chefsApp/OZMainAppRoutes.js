/**
* Main routing configuration
**/

angular.module('oz.OrderZappApp')
.config(['$stateProvider', '$urlRouterProvider', '$uiViewScrollProvider', function($stateProvider, $urlRouterProvider, $uiViewScrollProvider) { 
  $uiViewScrollProvider.useAnchorScroll(); 

  $stateProvider
    .state('home', {
      // url: '',
      abstract: true,
      templateUrl: 'OrderZapp/home/views/home.tpl.html',
      resolve: {
        CheckIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }
      }
    })    
    .state('home.start', {
      // url: '/signup',
      views: {
        'oz-signup' : {
          templateUrl:  'user/views/oz.signup.tpl.html',
          controller: 'OZRegistrationController'
        },
        'oz-signin' : {
          templateUrl:  'user/views/oz.signin.tpl.html',
          controller : 'OZSigninController'
        }
      }
    })  
    .state('home.start-forgotpassword', {
      views: {
        'oz-signup' : {
          templateUrl:  'user/views/oz.signup.tpl.html',
          controller: 'OZRegistrationController'
        },
        'oz-signin' : {
          templateUrl:  'user/views/oz.forgotpassword.tpl.html',
          controller : 'OZSigninController'
        }
      }
    }) 
    .state('staticcontent', {
      abstract: true,
      templateUrl: 'OrderZapp/staticContent/views/oz.staticcontent.tpl.html'
    })     
    .state('staticcontent.terms', {
      views: {
        'static-content': { 
          templateUrl: 'OrderZapp/staticContent/views/oz.staticcontent.terms.tpl.html'
        }
      }
    })
    .state('staticcontent.privacy', {
      views: {
        'static-content': { 
          templateUrl: 'OrderZapp/staticContent/views/oz.staticcontent.privacy.tpl.html'
        }
      }
    })
    .state('usersettings', {
      abstract: true,
      templateUrl: 'user/views/oz.user.settings.tpl.html',
      controller: 'UserSettingController',
      resolve: {
        MyUserData: function(UserSettingService, $rootScope) {
          return UserSettingService.MySettings.GetMyUserSettings({userid: $rootScope.usersession.currentUser.userid}).$promise;
        },
        checkIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }
      }
    })     
    .state('usersettings.manage', {
      views: {
        'user-settings': { 
          templateUrl: 'user/views/oz.user.manage.settings.tpl.html'
        }
      }
    })
    .state('help', {
      abstract: true,
      templateUrl: 'OrderZapp/help/views/oz.help.tpl.html'
    })     
    .state('help.view', {
      views: {
        'user-help': { 
          templateUrl: 'OrderZapp/help/views/oz.help.view.tpl.html'
        }
      }
    })
    .state('seller', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageSeller/views/oz.seller.tpl.html',
      controller: 'ManageSellerController',
      resolve: {
        MyProviderList: function(ManageSellerService, $rootScope) {
          return ManageSellerService.MyProvider.GetMyProvider().$promise;
        },
        ProviderCategoryList: function(ManageSellerService, $rootScope) {
          return ManageSellerService.LevelOneCategory.GetSellerCategory().$promise;
        },
        OrderStatusList: function(ManageSellerService, $rootScope) {
          return ManageSellerService.Order_Status.GetOrderStatus().$promise;
        },
        checkIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }  
      }
    })     
    .state('seller.view', {
      views: {
        'manage-seller': { 
          templateUrl: 'ProviderWall/ManageSeller/views/oz.seller.manage.tpl.html'
        }
      }
    })
    .state('sellerbranch', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageBranch/views/oz.seller.branch.tpl.html',
      controller: 'ManageSellerBranchController',
      resolve: {
        MyProviderBranchList: function(ManageSellerService, $rootScope) {
          if (!$rootScope.selectedproviderid){
            var NoProviderBranchExist = 'No branch exist for this seller account';
            return NoProviderBranchExist;
          } else {
            return ManageSellerService.MyProviderBranch.GetMyProviderBranch({providerid:$rootScope.selectedproviderid}).$promise;
          }
        },
        MySelectedProvider: function(ManageSellerService, $rootScope) {
          if (!$rootScope.selectedproviderid) {
            var NoProviderExist = 'No provider exist for this account';
            return NoProviderExist;
          } else {
            return ManageSellerService.SelectedProvider.GetSelectedProvider({providerid:$rootScope.selectedproviderid}).$promise;
          }
        },
        CountryData: function(GetLocationService, $rootScope) {
          return GetLocationService.LocationData.GetAllLocationData({keydata: 'country', data:'country'}).$promise;
        },
        checkIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }
      }
    })     
    .state('sellerbranch.view', {
      views: {
        'manage-branch': { 
          templateUrl: 'ProviderWall/ManageBranch/views/oz.seller.branch.manage.tpl.html'
        }
      }
    })
    .state('pickupaddress', {
      abstract: true,
      templateUrl: 'ProviderWall/ManagePickupAddress/views/oz.seller.pickupaddress.tpl.html',
      controller: 'ManagePickupAddressController',
      resolve: {
        PickupAddressList: function(ManageSellerService, $rootScope) {
          return ManageSellerService.Pickup_Address.GetPickupAddress({providerid:$rootScope.selectedproviderid}).$promise;
        },
        CountryDataList: function(GetLocationService, $rootScope) {
          return GetLocationService.LocationData.GetAllLocationData({keydata: 'country', data:'country'}).$promise;
        },
        checkIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }
      }
    })     
    .state('pickupaddress.view', {
      views: {
        'manage-pickupaddress': { 
          templateUrl: 'ProviderWall/ManagePickupAddress/views/oz.seller.pickupaddress.manage.tpl.html'
        }
      }
    })
    .state('deliverytime', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageDeliveryLeadTime/views/oz.deliveryleadtime.tpl.html',
      controller: 'ManageDeliveryLeadTimeController'
    })     
    .state('deliverytime.view', {
      views: {
        'manage-deliverytime': { 
          templateUrl: 'ProviderWall/ManageDeliveryLeadTime/views/oz.manage.deliveryleadtime.tpl.html'
        }
      }
    })
    .state('providerorders', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageOrders/views/oz.providerwall.tpl.html',
      controller: 'ProviderController',
      resolve: {
        GetBranches: function(ProviderServices, $rootScope) {
          if (!$rootScope.selectedproviderid) {
            var NoProviderExist = 'No seller exist for this account';
            return NoProviderExist;            
          } else {
            return ProviderServices.get_branches.getBranches({providerid:$rootScope.selectedproviderid}).$promise;
          }
        },
        BranchOrderCount: function(ProviderServices,GetBranches, $rootScope) {
          if (!$rootScope.selectedBranchId) {
            if (GetBranches.success !== undefined && GetBranches.success.branches.length > 0) {
              var branchid = GetBranches.success.branches[0].branchid;
              return ProviderServices.get_order_count.getOrderCount({providerid:$rootScope.selectedproviderid, branchid: branchid}).$promise;
            } else {
              var NoBranchExist = 'No branch exist for this seller';
              return NoBranchExist;
            }
          } else {
            return ProviderServices.get_order_count.getOrderCount({providerid:$rootScope.selectedproviderid, branchid: $rootScope.selectedBranchId}).$promise;
          }          
        }
      }
    })     
    .state('providerorders.view', {
      views: {
        'provider-view' : {
            templateUrl:  'ProviderWall/ManageOrders/views/oz.providerwall.provider-view.tpl.html'
          },
        'order-counter' : {
          templateUrl : 'ProviderWall/ManageOrders/views/oz.providerwall.order-counter.tpl.html'
        },
        'advertisment' : {
          templateUrl : 'ProviderWall/ManageOrders/views/oz.providerwall.advertisment.tpl.html'
        }
      }
    })
    .state('providerorders.view.orderbyBranch', {
      controller:'ManageOrderController',
      templateUrl:  'ProviderWall/ManageOrders/views/oz.providerContent.orderbyBranch.tpl.html'
    }) 
    .state('manageproduct', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageProduct/views/oz.manage.product.tpl.html',
      controller:'ManageProductController',
      resolve: {
        userproducttags: function(ProviderServices, $rootScope) {
          return ProviderServices.get_productUserTags.getProductUserTags().$promise;
        }
      }  
    })     
    .state('manageproduct.view', {
      views: {
        'manage-product': { 
          templateUrl:  'ProviderWall/ManageProduct/views/oz.providerContent.manageProduct.tpl.html'
          }
        }
    })
    .state('managediscount', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageDiscount/views/oz.manage.discount.tpl.html'
    })     
    .state('managediscount.view', {
      views: {
        'manage-discount': { 
          controller:'OZProductDiscountController',
          templateUrl:'ProviderWall/ManageDiscount/views/oz.providerContent.manageDiscount.tpl.html'
        }
      }
    })
    .state('managedeliverycharges', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageDeliveryCharges/views/oz.deliverycharges.tpl.html',
      resolve: {
        AllBranchDeliveryAreaList: function(GetLocationService, $rootScope) {
          if ($rootScope.selectedBranchId) {
            return GetLocationService.Get_AllBranchArea_For_Delivery.all_brancharea_for_delivery({branchid: $rootScope.selectedBranchId}).$promise;
          } else {
            return 'No branch exist for this seller';
          }
        },
        CountryData: function(GetLocationService, $rootScope) {
          return GetLocationService.LocationData.GetAllLocationData({keydata: 'country', data:'country'}).$promise;
        },
        StateData: function(GetLocationService, CountryData, $rootScope) {
          if (CountryData.success && CountryData.success.country.length !== 0) {
            var countries = CountryData.success.country;
            var result = countries.indexOf("india");
            if (result !== -1) {
              return GetLocationService.LocationData.GetAllLocationData({keydata: 'state', data:'india'}).$promise;
            } else {
              return GetLocationService.LocationData.GetAllLocationData({keydata: 'state', data:CountryData.success.country[0]}).$promise;
            }
          }           
        },
        CityData: function(GetLocationService, StateData, $rootScope) {
          if (StateData.success && StateData.success.states.length !==0) {
            var states = StateData.success.states;
            var result = states.indexOf("Maharashtra");
            if (result !== -1) {
              return GetLocationService.LocationData.GetAllLocationData({keydata: 'city', data:'Maharashtra'}).$promise;
            } else {
              return GetLocationService.LocationData.GetAllLocationData({keydata: 'city', data:StateData.success.states[0]}).$promise;
            }
          }
        },
        checkIfSessionExist: function(UserSettingService, $rootScope) {
          return UserSettingService.CheckIfUserLoggedin.checkUserSession().$promise;
        }
      }
    })     
    .state('managedeliverycharges.view', {
      views: {
        'manage-deliverycharges': { 
          controller:'ManageDeliveryChargesController',
          templateUrl:'ProviderWall/ManageDeliveryCharges/views/oz.deliverycharges.manage.tpl.html'
        }
      }
    })
    .state('managedeliverycharges.view.display', {
      templateUrl:'ProviderWall/ManageDeliveryCharges/views/oz.deliverycharges.display.tpl.html'
    })
    .state('managedeliverycharges.view.manage', {
      templateUrl:'ProviderWall/ManageDeliveryCharges/views/oz.deliverycharges.managearea.tpl.html'
    })
    .state('managepolicy', {
      abstract: true,
      templateUrl: 'ProviderWall/ManagePolicy/views/oz.manage.policy.tpl.html'
    })     
    .state('managepolicy.view', {
      views: {
        'manage-policy': { 
          controller:'ProviderPolicyController',
          templateUrl:'ProviderWall/ManagePolicy/views/oz.providerContent.policy.tpl.html'
        }
      }
    })
    .state('manageprices', {
      abstract: true,
      templateUrl: 'ProviderWall/ManagePrices/views/oz.manage.prices.tpl.html'
    })     
    .state('manageprices.view', {
      views: {
        'manage-prices': { 
          controller:'ManagePriceController',
          templateUrl:'ProviderWall/ManagePrices/views/oz.providerContent.managePrice.tpl.html'
        }
      }
    })
    .state('manageusergroup', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageUserGroup/views/oz.manage.usergroup.tpl.html'
    })     
    .state('manageusergroup.view', {
      views: {
        'manage-usergroup': { 
          controller:'OZUserGroupController',
          templateUrl:'ProviderWall/ManageUserGroup/views/oz.providerContent.userGroup.tpl.html'
        }
      }
    }) 

   .state('manageproductavailability', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageProductAvailability/views/oz.manage.product.availability.tpl.html'
    })     
    .state('manageproductavailability.view', {
      views: {
        'manage-productavailability': { 
          controller:'OZProductAvailabilityController',
          templateUrl:'ProviderWall/ManageProductAvailability/views/oz.manage.product.availability.content.tpl.html'
        }
      }
    }) 

    .state('manageloyaltyscheme', {
      abstract: true,
      templateUrl: 'ProviderWall/ManageLoyaltyScheme/views/oz.loyaltyscheme.tpl.html',
      resolve: {
        loyaltyHistoryData: function(GetLoyaltySchemeService, $rootScope) {
          return GetLoyaltySchemeService.Get_Loyalty_History_For_Seller.get_history_data({providerid: $rootScope.selectedproviderid}).$promise;
        },
        MyProviderData: function(GetLoyaltySchemeService, $rootScope) {
          return GetLoyaltySchemeService.MyProvider_Data.GetMyProviderData().$promise;
        }
      }
    })     
    .state('manageloyaltyscheme.view', {
      views: {
        'manage-loyaltyscheme': { 
          controller:'ManageLoyaltyController',
          templateUrl:'ProviderWall/ManageLoyaltyScheme/views/oz.loyaltyscheme.manage.tpl.html'
        }
      }
    })
    .state('manageloyaltyscheme.view.display', {
      templateUrl:'ProviderWall/ManageLoyaltyScheme/views/oz.loyaltyscheme.display.tpl.html'
    })
    .state('manageloyaltyscheme.view.manage', {
      templateUrl:'ProviderWall/ManageLoyaltyScheme/views/oz.loyaltyscheme.manageschemes.tpl.html'
    })

    .state('oz', {
      url: '',
      abstract: true,
      templateUrl: 'OrderZapp/oz/views/oz.tpl.html',
    })    
    .state('oz.ozWall', {
      // url: '/oz',
      resolve : {
        getInitialCount : function(OZGetCount)
        {
                  return OZGetCount.getCount.count().$promise;
        }
      },
      onEnter : function($rootScope, $state, UserSessionService)
      {
              if($rootScope.usersession.currentUser.isAdmin === true)
              {
                    $rootScope.OZNotify('Welcome OrderZapp Admin!', 'success');
              }
              else
              {
                UserSessionService.logoutUser();
              }
      },
      views: {
        'OrderZappWallView' : {
            templateUrl:  'OrderZapp/oz/views/oz.oz_content.tpl.html',
            controller : 'OZWallController',
          },
        'search' : {
          templateUrl : 'OrderZapp/oz/views/oz.sidebar.search.tpl.html',
          controller : 'OZWallSearchController',
        },
        'counters' : {
          templateUrl : 'OrderZapp/oz/views/oz.counter.tpl.html',
          controller : 'OZWallCounterController',
        }
      }
    })
    .state('oz.ozWall.ozOrderViewContent',{
      templateUrl : 'OrderZapp/oz/views/oz.order.view.tpl.html',
    })
    .state('oz.ozWall.ozProductContent', {
      templateUrl : 'OrderZapp/oz/views/oz.product.view.tpl.html',
    })
    .state('oz.ozWall.ozFailedOrderViewContent',{
      templateUrl : 'OrderZapp/oz/views/oz.failed.order.view.tpl.html',
    }) 
    .state('oz.ozWall.ozT&CContent', {
      templateUrl : 'OrderZapp/oz/views/oz.termsandconditions.view.tpl.html'
    })
    
    .state("oz.ozWall.ozHelp", {
      templateUrl : 'OrderZapp/oz/views/oz.helpContents.tpl.html'
    })
    .state("oz.ozWall.ozAbout", {
      templateUrl : 'OrderZapp/oz/views/oz.about.tpl.html'
    })
    .state("oz.ozWall.ozPrivacy", {
      templateUrl : 'OrderZapp/oz/views/oz.privacy.tpl.html'
    })
    .state("oz.ozWall.ozSellerParticipationAgreement",{
      templateUrl : 'OrderZapp/oz/views/oz.seller.participation.agreement.tpl.html'
    }) .state("oz.ozWall.ozProviderAcceptance",{
      templateUrl : 'OrderZapp/oz/views/oz.provider.acceptance.tpl.html'
    })
    .state('oz.ozWall.ozManageCategoriesTab',
    {
          templateUrl : 'OrderZapp/oz/views/oz.manage_categories.tpl.html',
          controller : 'OZAdminController'
    })
    .state('oz.ozWall.ozManageUserdefinedTags',
    {
      templateUrl : 'OrderZapp/oz/views/oz.userdefined.tags.tpl.html',
      controller : 'OZAdminController'
    }).
    state('oz.ozWall.ozManageSellerParticipation',
    {
      templateUrl : 'OrderZapp/oz/views/oz.seller.participation.manage.tpl.html',
      controller : 'OZAdminController'
    })
    .state('oz.ozWall.ozManageProductConfigurations',
    {
      templateUrl : 'OrderZapp/oz/views/oz.ozWall.ozManageProductConfiguration.tpl.html' ,
      controller : 'OZAdminController'
    })
    .state('oz.ozWall.ozManageLocations',
    {
      templateUrl : 'OrderZapp/oz/views/oz.manage.zipcodes.tpl.html',
      controller : 'OZManageLocationController'
    })
    .state('oz.ozWall.ozManageLoyaltyScheme',
    {
      templateUrl : 'OrderZapp/oz/views/oz.manage.loyalty.tpl.html',
      controller : 'OZManageLoyaltyController',
      resolve: {
        providerData: function(GetProviderService, $rootScope) {
          return GetProviderService.ProviderListData.GetAllProviders().$promise;
        }
      }
    })
    .state('oz.ozWall.ozOrderProcessCongiguration',
    {
      templateUrl : 'OrderZapp/oz/views/oz.orderProcess.tpl.html',
      controller : 'OZAdminController',
    })
    .state('oz.ozWall.ozViewFeedback',
    {
      templateUrl : 'OrderZapp/oz/views/oz.view.user.feedbacks.tpl.html',
    })
    .state('oz.ozWall.ozSellerPayableReceivableCriteria',
    {
      templateUrl : 'OrderZapp/oz/views/oz.seller.payablepercent.criteria.tpl.html',
      controller : 'OZAdminController'
    })
    .state('oz.ozWall.ozSellerPayableInterface',
    {
      templateUrl : 'OrderZapp/oz/views/oz.seller.payable.tpl.html',
      controller:'OZFinancialContentController'

    })
    .state('oz.ozWall.ozSellerReceivableInterface',
    {
      templateUrl : 'OrderZapp/oz/views/oz.seller.receivable.tpl.html'
    })
    .state('oz.ozWall.ozCustomerRefundInterface',
    {
      templateUrl : 'OrderZapp/oz/views/oz.customer.refunds.tpl.html'
    })
    .state('oz.ozWall.ozAPKUploadInterface',
    {
      templateUrl : 'OrderZapp/oz/views/oz.apk.upload.tpl.html',
      controller : 'OZAdminController'
    })

  }]);