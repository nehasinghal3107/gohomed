angular.module('oz.ProviderApp')
  .controller('ManageSellerBranchController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', 'ProviderServices','$upload','$stateParams', 'ManageSellerService', 'ManageBranchService', 'ManageDeliveryChargesService', 'MyProviderBranchList', 'MySelectedProvider', 'CountryData', 'checkIfSessionExist',  function($scope, $state, $http, $timeout, $sce, $log, $rootScope,ProviderServices,$upload, $stateParams, ManageSellerService,ManageBranchService, ManageDeliveryChargesService, MyProviderBranchList, MySelectedProvider, CountryData, checkIfSessionExist) {
  
    $log.debug("initialising manage seller branch controller");
    $scope.submitted = false;
    $scope.$state = $state;
    $scope.providers_branch_list = [];
    $scope.addnewbranch = false;
    $scope.support_nos = [];
    var mobile_no = $rootScope.usersession.currentUser.mobileno; 
    var mobile_no_length = mobile_no.length;
    var user_mobile_no = mobile_no.slice(2, mobile_no_length);
    $scope.addbranch = {branchsmsmobileno: user_mobile_no, homedelivery: false,pickup: true, chargeinpercent:false , 'operationHours' : {'from': {'hours' : '', 'minutes' : ''}, 'to' : {'hours' : '', 'minutes' : ''}}, 'timeslots' : [{'from': {'hours':'', 'minutes': ''}, 'to': {'hours': '',' minutes': ''}}]};
    $scope.form = {};
    $scope.selectedprovider = {};
    $scope.showBranchDetail = false;
    $scope.editbranch = {};
    $scope.countries = [];
    // $scope.addbranch.timeslots = [{from: {hours:'', minutes: ''}, to: {hours: '', minutes: ''}}, {from: {hours:'', minutes: ''}, to: {hours: '', minutes: ''}}];
    $scope.currentBranchIndex;
    $scope.contact_regex = /^([0-9]{10,13})(,([0-9]{10,13}))*$/;
    var finalStart = '';
    var finalEnd = '';
    var operationStartTimeEdit = '';
    var operationEndTimeEdit = '';
    $scope.edit = {'from':{}, 'to':{}};
    $scope.editTimingSlots = []; 
    var deliveryslots = [];
    $scope.states = [];
    $scope.cities = [];
    $scope.branchcityareas = [];
    $scope.typeahead_select = false;
    $scope.current = {};
    $scope.currentToEdit = {};

    $scope.$watch('$state.$current.locals.globals.checkIfSessionExist', function (checkIfSessionExist) {
      if (checkIfSessionExist.error) {
        $rootScope.showModal();
      };
    });

    $scope.$watch('$state.$current.locals.globals.MyProviderBranchList', function (MyProviderBranchList) {
      $log.debug(MyProviderBranchList);
      if (MyProviderBranchList.success !== undefined && MyProviderBranchList.success.branches.length !== 0) {
        $scope.providers_branch_list = angular.copy(MyProviderBranchList.success.branches); 
        $rootScope.branches = angular.copy(MyProviderBranchList.success.branches);
        $rootScope.branch = $rootScope.branches[0];
        if (!$rootScope.selectedBranchId) {
          $rootScope.selectedBranchId = $scope.providers_branch_list[0].branchid;
        }
        $scope.addnewbranch = false;
      } else  {
        if (MyProviderBranchList.error != undefined) {
          $scope.providers_branch_list = [];
          $rootScope.branches = [];
          $scope.addnewbranch = true;
          $log.debug(MyProviderBranchList.error.message);
          $rootScope.OZNotify(MyProviderBranchList.error.message, 'error');
        } else {
          $scope.providers_branch_list = [];
          $rootScope.branches = [];
          $scope.addnewbranch = true;
          $log.debug(MyProviderBranchList);
          $rootScope.OZNotify(MyProviderBranchList, 'error');
        } 
      }
    });

    $scope.$watch('$state.$current.locals.globals.MySelectedProvider', function (MySelectedProvider) {
      $log.debug(MySelectedProvider);
      if (MySelectedProvider.success !== undefined && MySelectedProvider.success.productprovider !== undefined) {
        $scope.selectedprovider = angular.copy(MySelectedProvider.success.productprovider); 
      } else {
        if (MySelectedProvider.error != undefined) {
          $scope.selectedprovider = {};
          $log.debug(MySelectedProvider.error.message);
          $rootScope.OZNotify(MySelectedProvider.error.message, 'error');
        } else {
          $scope.selectedprovider = {};
          $log.debug(MySelectedProvider);
          $rootScope.OZNotify(MySelectedProvider, 'error');
        } 
      }
    });

    $scope.$watch('$state.$current.locals.globals.CountryData', function (CountryData) {
      $log.debug(CountryData);
      if (CountryData.success && CountryData.success.country.length !== 0) {
        $scope.countries = angular.copy(CountryData.success.country);
      }
    });

    var cleanupEventChange_in_provideridDone = $scope.$on("change_in_providerid", function(event, data){
      $log.debug(data);
      $state.reload();     
    });

    $scope.viewBranchDetail = function(index){
      if (index !== null) {
        $scope.currentBranchIndex = index;
      } else {
        $scope.currentBranchIndex = '';
      }
      $scope.showBranchDetail = !$scope.showBranchDetail;
    }

    $scope.to_time = function(time){
      var working_time = time;
      var hours = parseInt(working_time);
      var minutes = Math.round((working_time - hours) * 60);      
      return (hours + ' ' + 'Hrs' + ' ' + minutes + ' ' + 'Mins');
    }

    $scope.addSlots = function() { 
      $scope.addbranch.timeslots.push({from: {hours:'', minutes: ''}, to: {hours: '', minutes: ''}});
    };

    $scope.removeSlots = function(slot) {
      var timeslots = $scope.addbranch.timeslots;
      for (var i = 0, ii = timeslots.length; i < ii; i++) {
        if (slot === timeslots[i]) { 
          timeslots.splice(i, 1); 
        }
        else {
          timeslots.splice(i,0);
        } 
      }
    };

    $scope.add_provider_branch = function(){
      $scope.addnewbranch = true;
    }

    $scope.cancelAddSellerBranch = function(){
      $scope.form.addBranchForm.$setPristine();
      $scope.form.addBranchForm.submitted = false;
      $scope.addbranch = {branchsmsmobileno: user_mobile_no, homedelivery: false,pickup: true, chargeinpercent:false , 'operationHours' : {'from': {'hours' : '', 'minutes' : ''}, 'to' : {'hours' : '', 'minutes' : ''}}, 'timeslots' : [{'from': {'hours':'', 'minutes': ''}, 'to': {'hours': '',' minutes': ''}}, {'from': {'hours':'', 'minutes': ''}, 'to': {'hours': '', 'minutes': ''}}]};
      $scope.addnewbranch = false;
    }

    $scope.getStateForBranchCountry = function(country) {
      $rootScope.showSpinner();
      $scope.states = [];
      $scope.cities = [];
      $scope.branchcityareas = [];
      $scope.addbranch.zipcode = '';
      ManageDeliveryChargesService.GetStateList(country);
    }

     // function to handle server side responses
    $scope.handleGetStateListResponse = function(data, country){
      if (data.success) {
        if (data.success.states.length !== 0) {
          $scope.states = angular.copy(data.success.states);
        } else {
          $scope.states = [];
        }
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          scope.states = [];
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };

    var cleanupEventGetStateListDone = $scope.$on("getStateListDone", function(event, message, country){
      $log.debug(message);
      $scope.handleGetStateListResponse(message, country);      
    });

    var cleanupEventGetStateListNotDone = $scope.$on("getStateListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.getCityForBranchState = function(state) {
      $rootScope.showSpinner();
      $scope.cities = [];
      $scope.branchcityareas = [];
      $scope.addbranch.zipcode = '';
      ManageDeliveryChargesService.GetCityList(state);
    }

     // function to handle server side responses
    $scope.handleGetCityListResponse = function(data, state){
      if (data.success) {
        if (data.success.city.length !== 0) {
          $scope.cities = angular.copy(data.success.city);
        } else {
          $scope.cities = [];
        }
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          $scope.cities = [];
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };

    var cleanupEventGetCityListDone = $scope.$on("getCityListDone", function(event, message, state){
      $log.debug(message);
      $scope.handleGetCityListResponse(message, state);      
    });

    var cleanupEventGetCityListNotDone = $scope.$on("getCityListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.getAreaForBranchCity = function(city) {
      $rootScope.showSpinner();
      $scope.branchcityareas = [];
      $scope.addbranch.zipcode = '';
      ManageDeliveryChargesService.GetAreaForCityList(city);
    }

     // function to handle server side responses
    $scope.handleGetAreaListResponse = function(data, city){
      if (data.success) {
        if (data.success && data.success.location.length !== 0) {
          $scope.branchcityareas = angular.copy(data.success.location);
        } else {
          $scope.branchcityareas = [];
        }
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          scope.branchcityareas = [];
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };

    var cleanupEventGetAreaListDone = $scope.$on("getAreaForCityListDone", function(event, message, city){
      $log.debug(message);
      $scope.handleGetAreaListResponse(message, city);      
    });

    var cleanupEventGetAreaListNotDone = $scope.$on("getAreaForCityListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.getZipcodeForBranchArea = function(area) {
      if (area.area) {
        $scope.addbranch.zipcode = '';
        $scope.addbranch.zipcode = area.zipcode;   
      }  
    }
    
    // function to send and stringify user registration data to Rest APIs
    $scope.jsonAddBranchData = function(){
      var timeslots = [];
      var validated_timeslots = [];
      for (var i = 0; i < $scope.addbranch.timeslots.length; i++) {
        if ((parseInt($scope.addbranch.timeslots[i].from.hours) < parseInt($scope.addbranch.timeslots[i].to.hours)) || ( (parseInt($scope.addbranch.timeslots[i].from.hours) == parseInt($scope.addbranch.timeslots[i].to.hours)) && (parseInt($scope.addbranch.timeslots[i].from.minutes) < parseInt($scope.addbranch.timeslots[i].to.minutes)))) {
          var from_hrs = parseInt($scope.addbranch.timeslots[i].from.hours);
          var from_mins = Math.round( (($scope.addbranch.timeslots[i].from.minutes)/60) *100)/100;
          var from_timeslot = from_hrs + from_mins;
          var to_hrs = parseInt($scope.addbranch.timeslots[i].to.hours);
          var to_mins = Math.round( (($scope.addbranch.timeslots[i].to.minutes)/60) *100)/100;
          var to_timeslot = to_hrs + to_mins;
          timeslots.push({from:from_timeslot, to: to_timeslot});
        } 
      } 

      for (var i = 0; i < timeslots.length; i++) {
        if(i == 0) {
          validated_timeslots.push({from:timeslots[i].from, to: timeslots[i].to});
        } else if(i > 0){  
          if (timeslots[i].from >= timeslots[i-1].from && timeslots[i].from <= timeslots[i-1].to) {
            $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
          } else {
            if (timeslots[i].to >= timeslots[i-1].from && timeslots[i].to <= timeslots[i-1].to) {
              $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
            } else {
              if ((timeslots[i].from < timeslots[i-1].from) && (timeslots[i-1].to < timeslots[i].to)) {
                $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
              } else{
                validated_timeslots.push({from:timeslots[i].from, to: timeslots[i].to});
              }
            }
          } 
        }
      }; 

      console.log(validated_timeslots);
      if ((parseInt($scope.addbranch.operationHours.from.hours) < parseInt($scope.addbranch.operationHours.to.hours)) || ( (parseInt($scope.addbranch.operationHours.from.hours) == parseInt($scope.addbranch.operationHours.to.hours)) && (parseInt($scope.addbranch.operationHours.from.minutes) < parseInt($scope.addbranch.operationHours.to.minutes)))) {
        if (($scope.addbranch.timeslots.length == timeslots.length) && ($scope.addbranch.timeslots.length > 0  && timeslots.length > 0)) {
          var supportnos = $scope.addbranch.supportno;
          var from_minutes = Math.round( (($scope.addbranch.operationHours.from.minutes)/60) *100)/100;
          var working_from_time = parseInt($scope.addbranch.operationHours.from.hours) + from_minutes;
          var to_minutes = Math.round( (($scope.addbranch.operationHours.to.minutes)/60) *100)/100;
          var working_to_time = parseInt($scope.addbranch.operationHours.to.hours) + to_minutes;
          $scope.support_nos = supportnos.split(",");
          if ($scope.addbranch.homedelivery !== true) {
            if ($scope.addbranch.chargeinpercent == true) {
              $scope.addbranch.chargeinpercent = false;
            }
          }
          var Branchdata = 
          {
            branch:
              {
                'branchname' : $scope.addbranch.name,
                'branchcode' : $scope.addbranch.code,
                'branchsmsmobileno' : '91' + $scope.addbranch.branchsmsmobileno,
                'location':{
                  'address1': $scope.addbranch.address1,
                  'address2': $scope.addbranch.address2,
                  'area': $scope.addbranch.area.area,
                  'city': $scope.addbranch.city,
                  'country': $scope.addbranch.country,
                  'state': $scope.addbranch.state,
                  'zipcode': $scope.addbranch.area.zipcode
                },
                'delivery':{
                  'isprovidehomedelivery': $scope.addbranch.homedelivery,
                  'isprovidepickup': $scope.addbranch.pickup,
                  'isdeliverychargeinpercent': $scope.addbranch.chargeinpercent
                },
                'contact_supports': $scope.support_nos,
                'branchdescription' : $scope.addbranch.description,
                'note' : $scope.addbranch.note,
                "branch_availability" : {
                  'from' : working_from_time,
                  'to' : working_to_time
                },
                'deliverytimingslots': validated_timeslots
              }  
          };
          return JSON.stringify(Branchdata); 
        } else {
          $rootScope.OZNotify("For Delivery Time Slots 'From' hours must be less than 'To' hours.",'error');
          return false;
        }
      } else {
        $rootScope.OZNotify("Working 'From' hours must be less than 'To' hours.",'error');
        return false;
      }
    } 

    // function to handle server side responses
    $scope.handleAddBranchResponse = function(data){
      if (data.success) {
        $state.reload();
        $scope.cancelAddSellerBranch();
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
  
    $scope.addSellerBranch = function(){
      if ($scope.form.addBranchForm.$valid) {
        if ($scope.jsonAddBranchData()) {
          $log.debug($scope.jsonAddBranchData());
          $rootScope.showSpinner();
          ManageBranchService.addBranch($scope.jsonAddBranchData());
        } else {
          $scope.form.addBranchForm.submitted = true;
          $log.debug($scope.jsonAddBranchData());
        }    
      } else {
        $log.debug('incorrect data');
        $log.debug($scope.jsonAddBranchData());
        $scope.form.addBranchForm.submitted = true;
      }
    }


    var cleanupEventAddBranchDone = $scope.$on("addBranchDone", function(event, message){
      $log.debug(message);
      $scope.handleAddBranchResponse(message);      
    });

    var cleanupEventAddBranchNotDone = $scope.$on("addBranchNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // Publish Seller Branch Code.....................................................

    // function to handle server side responses
    $scope.handlePublishBranchResponse = function(data){
      if (data.success) {
        $state.reload();
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

    $scope.publishSellerBranch = function(branchid){
      $rootScope.showSpinner();
      ManageBranchService.publishBranch(branchid);
    }

    var cleanupEventPublishBranchDone = $scope.$on("publishBranchDone", function(event, message){
      $log.debug(message);
      $scope.handlePublishBranchResponse(message);      
    });

    var cleanupEventPublishBranchNotDone = $scope.$on("publishBranchNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    // Edit Seller Branch Code....................................................

    $scope.openEditBranch = function(branch){
      $scope.editbranch = {};
      $scope.editbranch = angular.copy(branch);
      ManageDeliveryChargesService.getLocation(branch.location);
      if (branch.branchsmsmobileno) {
        var edit_mobile_no = angular.copy(branch.branchsmsmobileno);
        var edit_mobile_no_length = edit_mobile_no.length;
        var edit_user_mobile_no = edit_mobile_no.slice(2, edit_mobile_no_length);
        $scope.editbranch.branchsmsmobileno = edit_user_mobile_no;
      }
      if ($scope.editbranch.branch_availability) {
        var working_from_time = $scope.editbranch.branch_availability.from;
        var working_to_time = $scope.editbranch.branch_availability.to;
        $scope.edit.from.hours = parseInt(working_from_time);
        if (Math.round((working_from_time - $scope.edit.from.hours) * 60).toString().length == 1) {
          $scope.edit.from.minutes = '0' + Math.round((working_from_time - $scope.edit.from.hours) * 60);
        } else {
          $scope.edit.from.minutes = Math.round((working_from_time - $scope.edit.from.hours) * 60);
        }
        $scope.edit.to.hours = parseInt(working_to_time);
        if (Math.round((working_to_time - $scope.edit.to.hours) * 60).toString().length == 1) {
          $scope.edit.to.minutes = '0' + Math.round((working_to_time - $scope.edit.to.hours) * 60);
        } else {
          $scope.edit.to.minutes = Math.round((working_to_time - $scope.edit.to.hours) * 60);
        }
      }
      var branch_supportnos = angular.copy($scope.editbranch.contact_supports);
      $scope.editbranch.edit_supportnos = branch_supportnos.toString();
      if (branch.deliverytimingslots && branch.deliverytimingslots.length !== 0) {
        $scope.editTimingSlots = []; 
        for (var i = 0; i < branch.deliverytimingslots.length; i++) {
          var from_slot = branch.deliverytimingslots[i].from;
          var from_slot_hours = parseInt(from_slot);
          if (Math.round((from_slot - from_slot_hours) * 60).toString().length == 1) {
            var from_slot_minutes = '0' + Math.round((from_slot - from_slot_hours) * 60);
          } else {
            var from_slot_minutes = Math.round((from_slot - from_slot_hours) * 60);
          }
          var to_slot = branch.deliverytimingslots[i].to;
          var to_slot_hours = parseInt(to_slot);
          if (Math.round((to_slot - to_slot_hours) * 60).toString().length == 1) {
            var to_slot_minutes = '0' + Math.round((to_slot - to_slot_hours) * 60);
          } else {
            var to_slot_minutes = Math.round((to_slot - to_slot_hours) * 60);
          }
          $scope.editTimingSlots.push({'from':{'hours':from_slot_hours, 'minutes': from_slot_minutes}, 'to': {'hours': to_slot_hours, 'minutes': to_slot_minutes}});
        };
      }
      $('#editBranchModal').modal({ 
        keyboard: false,
        backdrop: 'static',
        show: true
      });
    };

    // function to handle server side responses
    $scope.handleGetLocationDataResponse = function(stateData, cityData, areaData){
      if (stateData.success) {
        if (stateData.success.states.length !== 0) {
          $scope.states = angular.copy(stateData.success.states);
          if (cityData.success && cityData.success.city.length !== 0) {
            $scope.cities = angular.copy(cityData.success.city);
            if (areaData.success && areaData.success.location.length !== 0) {
              $scope.branchcityareas = angular.copy(areaData.success.location);
            } else {
              $scope.branchcityareas = [];
            }
          } else {
            $scope.cities = [];
          }
        } else {
          $scope.states = [];
        }
      } else {
        if(stateData.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(stateData.error.message);
          $rootScope.OZNotify(stateData.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    }; 

    var cleanupEventGetLocationDataDone = $scope.$on("getLocationDataDone", function(event, stateData, cityData, areaData){
      $log.debug(stateData);
      $log.debug(cityData);
      $log.debug(areaData);
      $scope.handleGetLocationDataResponse(stateData, cityData, areaData);      
    });

    var cleanupEventGetLocationDataNotDone = $scope.$on("getLocationDataNotDone", function(event, message){
      $rootScope.hideSpinner();
      $log.debug(message);
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.getStateForEditBranchCountry = function(country) {
      if (country) {
        $rootScope.showSpinner();
        $scope.states = [];
        $scope.cities = [];
        $scope.branchcityareas = [];
        $scope.editbranch.location.state = '';
        $scope.editbranch.location.city = '';
        $scope.editbranch.location.area = '';
        $scope.editbranch.location.zipcode = '';
        ManageDeliveryChargesService.GetStateList(country);
      }
    }

    $scope.getCityForEditBranchState = function(state) {
      if (state) {
        $rootScope.showSpinner();
        $scope.cities = [];
        $scope.branchcityareas = [];
        $scope.editbranch.location.city = '';
        $scope.editbranch.location.area = '';
        $scope.editbranch.location.zipcode = '';
        ManageDeliveryChargesService.GetCityList(state);
      }
    }

    $scope.getAreaForEditBranchCity = function(city) {
      if (city) {
        $rootScope.showSpinner();
        $scope.branchcityareas = [];
        $scope.editbranch.location.area = '';
        $scope.editbranch.location.zipcode = '';
        ManageDeliveryChargesService.GetAreaForCityList(city);
      }
    }

    $scope.getZipcodeForEditBranchArea = function(area) {
      if (area) {
        $scope.editbranch.location.zipcode = '';
        $scope.editbranch.location.zipcode = area.zipcode;
      }
    }

    $scope.addDeliverySlots = function(){
      $scope.editTimingSlots.push({from: {hours:'', minutes: ''}, to: {hours: '', minutes: ''}})
    }

    $scope.removeEditSlots = function(slot) {
      var timeslots = $scope.editTimingSlots;
      for (var i = 0, ii = timeslots.length; i < ii; i++) {
        if (slot === timeslots[i]) { 
          timeslots.splice(i, 1); 
        }
        else {
          timeslots.splice(i,0);
        } 
      }
    };

    // function to send and stringify user registration data to Rest APIs
    $scope.jsonEditBranchData = function(){
      var location = {};
      if ($scope.editbranch.location.area.area == undefined) {
        location.area = $scope.editbranch.location.area;
        location.zipcode = $scope.editbranch.location.zipcode;
      } else {
        location.area = $scope.editbranch.location.area.area;
        location.zipcode = $scope.editbranch.location.area.zipcode;
      }
      var timeslots = [];
      var validated_timeslots = [];
      for (var i = 0; i < $scope.editTimingSlots.length; i++) {
        if ((parseInt($scope.editTimingSlots[i].from.hours) < parseInt($scope.editTimingSlots[i].to.hours)) || ((parseInt($scope.editTimingSlots[i].from.hours) == parseInt($scope.editTimingSlots[i].to.hours)) && (parseInt($scope.editTimingSlots[i].from.minutes) < parseInt($scope.editTimingSlots[i].to.minutes)))) {
          var from_hrs = parseInt($scope.editTimingSlots[i].from.hours);
          var from_mins = Math.round( (($scope.editTimingSlots[i].from.minutes)/60) *100)/100;
          var from_timeslot = from_hrs + from_mins;
          var to_hrs = parseInt($scope.editTimingSlots[i].to.hours);
          var to_mins = Math.round( (($scope.editTimingSlots[i].to.minutes)/60) *100)/100;
          var to_timeslot = to_hrs + to_mins;
          timeslots.push({from:from_timeslot, to: to_timeslot});
        }
      }

      for (var i = 0; i < timeslots.length; i++) {
        if(i == 0) {
          validated_timeslots.push({from:timeslots[i].from, to: timeslots[i].to});
        } else if(i > 0){  
          if (timeslots[i].from >= timeslots[i-1].from && timeslots[i].from <= timeslots[i-1].to) {
            $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
          } else {
            if (timeslots[i].to >= timeslots[i-1].from && timeslots[i].to <= timeslots[i-1].to) {
              $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
            } else {
              if ((timeslots[i].from < timeslots[i-1].from) && (timeslots[i-1].to < timeslots[i].to)) {
                $rootScope.OZNotify("Every Delivery Time Slots must have different time intervals.",'error');
              } else{
                validated_timeslots.push({from:timeslots[i].from, to: timeslots[i].to});
              }
            }
          } 
        }
      }; 

      console.log(validated_timeslots);
      if (parseInt($scope.edit.from.hours) < parseInt($scope.edit.to.hours)) {
        if (($scope.editTimingSlots.length == timeslots.length) && ($scope.editTimingSlots.length > 0  && timeslots.length > 0)) {
          var from_minutes = Math.round( (($scope.edit.from.minutes)/60) *100)/100;
          var working_from_time = parseInt($scope.edit.from.hours) + from_minutes;
          var to_minutes = Math.round( (($scope.edit.to.minutes)/60) *100)/100;
          var working_to_time = parseInt($scope.edit.to.hours) + to_minutes;
          var result = $scope.contact_regex.test($scope.editbranch.edit_supportnos);
          if (result) {
            var supportnos = $scope.editbranch.edit_supportnos;
            $scope.support_nos = supportnos.split(",");
            if (timeslots.length !== 0) {
              deliveryslots = angular.copy(timeslots);
            }
            if ($scope.editbranch.delivery.isprovidehomedelivery !== true) {
              if ($scope.editbranch.delivery.isdeliverychargeinpercent == true) {
                $scope.editbranch.delivery.isdeliverychargeinpercent = false;
              }
            }
            var Branchdata = 
            {
              branch:
                {
                  'branchname' : $scope.editbranch.branchname,
                  'branchcode' : $scope.editbranch.branchcode,
                  'branchsmsmobileno' : '91' + $scope.editbranch.branchsmsmobileno,
                  'location':{
                    'address1': $scope.editbranch.location.address1,
                    'address2': $scope.editbranch.location.address2,
                    'area': location.area,
                    'city': $scope.editbranch.location.city,
                    'country': $scope.editbranch.location.country,
                    'state': $scope.editbranch.location.state,
                    'zipcode': location.zipcode
                  },
                  'delivery':{
                    'isprovidehomedelivery': $scope.editbranch.delivery.isprovidehomedelivery,
                    'isprovidepickup': $scope.editbranch.delivery.isprovidepickup,
                    'isdeliverychargeinpercent': $scope.editbranch.delivery.isdeliverychargeinpercent
                  },
                  'contact_supports': $scope.support_nos,
                  'branchdescription' : $scope.editbranch.branchdescription,
                  'note' : $scope.editbranch.note,
                  "branch_availability" : {
                    'from' : working_from_time,
                    'to' : working_to_time
                },
                'deliverytimingslots': validated_timeslots
                }  
            };
            return JSON.stringify(Branchdata); 
          } else {
            return false;
          }
        } else {
          $rootScope.OZNotify("For Delivery Time Slots 'From' hours must be less than 'To' hours.",'error');
          return false;
        } 
      } else {
        $rootScope.OZNotify("Working 'From' hours must be less than 'To' hours.",'error');
        return false;
      }
    }; 

    // function to handle server side responses
    $scope.handleEditBranchResponse = function(data, branchid){
      if (data.success) {
        $('#editBranchModal').modal('hide');
        if (branchid == $rootScope.selectedBranchId) {
          $rootScope.deliveryTimeSlots = deliveryslots;
        }
        $state.reload();
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $('#editBranchModal').modal('hide');
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };
  
    $scope.editSellerBranch = function(branchid){
      if ($scope.form.editBranchForm.$valid) {
        $log.debug($scope.jsonEditBranchData());
        if ($scope.jsonEditBranchData()) {   
          $rootScope.showSpinner();
          ManageBranchService.editBranch($scope.jsonEditBranchData(), branchid);
        } else {
          $scope.form.editBranchForm.editcontact.$invalid = true;
          $scope.form.editBranchForm.submitted = true;
        }
      } else {
        $log.debug('incorrect data');
        $scope.form.editBranchForm.submitted = true;
        // $scope.form.editBranchForm.editcontact.$invalid = true;
        $log.debug($scope.jsonEditBranchData());
      }
    }

    var cleanupEventEditBranchDone = $scope.$on("editBranchDone", function(event, message, branchid){
      $log.debug(message);
      $scope.handleEditBranchResponse(message, branchid);      
    });

    var cleanupEventEditBranchNotDone = $scope.$on("editBranchNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });



    $scope.$on('$destroy', function(event, message) {
      cleanupEventAddBranchDone();
      cleanupEventAddBranchNotDone();
      cleanupEventChange_in_provideridDone();
      cleanupEventPublishBranchDone();
      cleanupEventPublishBranchNotDone();
      cleanupEventEditBranchDone();
      cleanupEventEditBranchNotDone();
      cleanupEventGetStateListDone();
      cleanupEventGetStateListNotDone();
      cleanupEventGetCityListDone();
      cleanupEventGetCityListNotDone();
      cleanupEventGetAreaListDone();
      cleanupEventGetAreaListNotDone();
      cleanupEventGetLocationDataDone();
      cleanupEventGetLocationDataNotDone();
    });

 }]);
