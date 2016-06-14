/*
* Overview: Order Directive
* Dated: 28/10/2013.
* Author: Bhagyashri Jangam
* Copyright: Prodonus Software Private Limited and GiantLeap Systems Private Limited 2013
* Change History:
* ----------------------------------------------------------------------
* date | author | description 
* ----------------------------------------------------------------------
* 27-3/2013 | xyx | Add a new property
* 
*/

angular.module('oz.ProviderApp').directive('ozOrders', function () {
return {
  restrict: 'A',
  templateUrl: function (tElement, tAttrs) {
        return tAttrs.templateUrl;
      },
  controller: [
  '$scope',
  '$log',
  'ProviderServices',
  '$rootScope',
  '$http',

  function ($scope, $log, ProviderServices, $rootScope, $http) {
    $scope.tabFortrack={};
    $scope.delivery_date={};
    $scope.todaysDate=moment();
    $scope.todaysDate1=new Date();
    var t_status;
    var t_orderid;
    $scope.today=Date();
    $scope.deliveryOption;
    $scope.ismeridian = false;
    $scope.format='dd-MM-yyyy';
    $scope.deliveryTimeSlot=[];
    $scope.NodeliveryTimeSlot;
    

$scope.fromNow = function (time) {
  if (time != undefined) {
    return moment(time).calendar();
    // return moment(time).subtract('hours', 5.5).calendar();
  }
};

$scope.convertMomentFormat = function(time)
{
       if (time != undefined) 
        { 
          return moment(time).format('dddd, MMMM Do YYYY')
        }; 
};


  $scope.open = function($event) { //for calender date picker
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

      
  $scope.getDeliveryTimeSlots=function(order){   
    var slots=[];
       $http({
        method: 'POST',
        url: '/api/timeslots', 
        data: {"new_delivery_date":$scope.delivery_date.date,"suborderid":order.suborderid } ,
      }).success(function(data, status, headers, config) {
        console.log(data)
        if(data.success){
          $scope.NodeliveryTimeSlot=false;
          $scope.deliveryTimeSlot=data.success.doc.deliverytimingslots;
          console.log($scope.deliveryTimeSlot);
          for (var i = $scope.deliveryTimeSlot.length - 1; i >= 0; i--) {
            if($scope.deliveryTimeSlot[i].available==true){
              slots.push($scope.deliveryTimeSlot[i]);
            }
          };
          if(slots.length<1){
            $scope.NodeliveryTimeSlot=true;
          }
        }
        else{
           if(data.error.code=='AL001'){
             $('#calenderModal').modal('hide');
             $('#cancelReasonModal').modal('hide');
             $rootScope.showModal();
          }
          $scope.NodeliveryTimeSlot=true;
          $scope.deliveryTimeSlot=[];
        }
      }).error(function (data, status, headers, cfg) {
        $scope.deliveryTimeSlot=[];
        $log.debug(status);
       // $rootScope.OZNotify(status, 'error'); 
     });
  }




 $scope.changeStatus=function(status,order){

  if( moment(order.preferred_delivery_date).format('DD-MM-YYYY')  ==  moment($scope.todaysDate1).format('DD-MM-YYYY') ){
    if($scope.todaysDate1.getHours() < order.prefdeltimeslot.to){
      $scope.deliveryOption='pref';
    }else{
       $scope.deliveryOption='custom';
    }

  }else{
      if( moment(order.preferred_delivery_date)  >  moment($scope.todaysDate1) ){
        $scope.deliveryOption='pref';
      }
      else{
         $scope.deliveryOption='custom';
      }
  }

  $scope.deliveryTimeSlot=[];
  $scope.delivery_date.newDeliverySlot={};
  $scope.delivery_date.date="";

  $scope.showCal=0; 
    $scope.search='';
    var orderid=order.suborderid
    $scope.order=order;
     $scope.orderPrefDate=new Date($scope.order.preferred_delivery_date);
  if(status=='accept'){
       t_status=status;
       t_order=order;
      // $('#calenderModal').modal('toggle');
      $('#calenderModal').modal('show');
  }
  else if(status=='reject' || status=='cancel'){
       t_status=status;
       t_order=order;
      // $('#calenderModal').modal('toggle');
      $('#cancelReasonModal').modal('show');
  }

  else{
    $scope.callServiceChangeStatus(status,order);
  }
};


$scope.changeTimeSlotDisplayFormat= function(slot){
    var slot_hours = parseInt(slot);
    var slot_minutes = Math.round((slot - slot_hours) * 60);
       
      var output1 = slot_hours + ''; //2 digit no 
       while (output1.length < 2) {
        output1 = '0' + output1;
       }
       slot_hours=output1;

       var output = slot_minutes + ''; //2 digit no 
       while (output.length < 2) {
        output = '0' + output;
       }
    slot_minutes=output;
    return slot_hours+':'+slot_minutes;
};

$scope.changeTimeSlotDisplayFormatDot= function(slot){
    var slot_hours = parseInt(slot);
    var slot_minutes = Math.round((slot - slot_hours) * 60);
       
      var output1 = slot_hours + ''; //2 digit no 
       while (output1.length < 2) {
        output1 = '0' + output1;
       }
       slot_hours=output1;

       var output = slot_minutes + ''; //2 digit no 
       while (output.length < 2) {
        output = '0' + output;
       }
    slot_minutes=output;
    return slot_hours+'.'+slot_minutes;
};

$scope.onDateSelected=function(delivery_date,deliveryOption,order){
 var date={};
     if(deliveryOption=='custom'){
      date=delivery_date;
      
     }else if(deliveryOption=='pref'){
      date={'date':order.preferred_delivery_date,
             'newDeliverySlot':order.prefdeltimeslot  };
     }
  if(date.date==null || date.date==undefined || date.date == '' || date.newDeliverySlot.to==null || date.newDeliverySlot.to==undefined || date.newDeliverySlot.to == '' || date.newDeliverySlot.from==null || date.newDeliverySlot.from==undefined || date.newDeliverySlot.from == ''){
      $rootScope.OZNotify("Please Select Delivery Date & Time Slot", 'error');  
  }
  else{
    $scope.callServiceChangeStatusApprove(t_status,t_order,date);
    $('#calenderModal').modal('hide');
    $scope.delivery_date.newDeliverySlot={};
    $scope.delivery_date.date="";
    $scope.deliveryOption='';
    $log.debug( date);
  }
};

$scope.callServiceChangeStatusApprove=function(status,order,date){
  $rootScope.OZNotify("Suborder "+order.suborderid+" moving to "+status, 'central'); 
  
    $http({
          method: 'GET',
          url: 'api/manageorder/'+order.suborderid+'?action='+status+'&deliverydate='+date.date+'&deliverytimeslot='+date.newDeliverySlot.from+'-'+date.newDeliverySlot.to,
         }).success(function(data, status, headers, cfg){
            $scope.handleChangeStatus(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.OZNotify(status, 'error');  
         });
};

$scope.reasonEntered=function(reason){

  if($scope.form.orderReason.$invalid){
      // $rootScope.OZNotify("Please add valid information", 'error');
      $scope.form.orderReason.submitted=true;
    }
  else{
    $scope.form.orderReason.$setPristine();
    $('#cancelReasonModal').modal('hide');
    $log.debug("t_order "+" reason = "+ reason.text);
    $scope.callServiceChangeStatusCancelReject(t_status,t_order,reason.text);
    $scope.delivery_date.newDeliverySlot={};
    $scope.delivery_date.date="";
   
   }
};

$scope.callServiceChangeStatusCancelReject=function(status,order,reason){
  $rootScope.OZNotify("Suborder "+order.suborderid+" moving to "+status, 'central'); 
  
    $http({
          method: 'GET',
          url: 'api/manageorder/'+order.suborderid+'?action='+status+'&remark='+reason,
         }).success(function(data, status, headers, cfg){
            $scope.reason.text="";
            $scope.handleChangeStatus(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.OZNotify(status, 'error');  
         });
};




$scope.callServiceChangeStatus=function(status,order){
   var orderid=order.suborderid;
    
    // if(status =='production' || status =='indelivery' || status =='done'){
    //    var index = $scope.orders.indexOf(order);
    //         if (index != -1){
    //            $scope.orders.splice(index, 1);
    //         }
    // }
   
  $rootScope.OZNotify("Suborder "+order.suborderid+" moving to "+status, 'central'); 
    $http({
          method: 'GET',
          url: 'api/manageorder/'+orderid+'?action='+status,
         }).success(function(data, status, headers, cfg){
            $scope.handleChangeStatus(data);
         }).error(function(data, status, headers, cfg){
            $rootScope.OZNotify(status, 'error');  
         });
 
};


$scope.getOrderDate=function(deliverydatetime){
  var format = 'DD-MM-YYYY, h:mm:ss a';
    return moment(deliverydatetime).format(format);
    // return moment(deliverydatetime).subtract('hours', 5.5).format(format);

  
};

$scope.getDate=function(dayorder){
  if($scope.orders[0].deliverydatetime){
     if(dayorder!==undefined || dayorder !==null){
       var d= new Date(dayorder.deliverydatetime.year,dayorder.deliverydatetime.month-1,dayorder.deliverydatetime.day);
      return moment(d).format("dddd, MMMM Do YYYY");
     }
  }
};

 $scope.handleChangeStatus=function(data){
   if(data.error){
        $rootScope.OZNotify(data.error.message, 'error');  
        $log.debug(data.error.message);
        if(data.error.code=='AL001'){
          $('#calenderModal').modal('hide');
          $('#cancelReasonModal').modal('hide');
          $rootScope.showModal();
        }
   }
   else if(data.success){
    // $rootScope.OZNotify(data.success.message, 'success');  
    $log.debug(data.success);
    $scope.getLatestOrders();
   }
  };

  $scope.chargesNoteShow=function(order){
  var products
   if(order.products){
    products=order.products;
   }
    // $log.debug(products);
    var yes=false;
    var no=false;
    if(products){
          for (var i = products.length - 1; i >= 0; i--) {
         if(products[i].productconfiguration){
          if((products[i].productconfiguration==undefined) || (products[i].productconfiguration==null) || (products[i].productconfiguration.length==0) ){
             no=true;
          }
          else{
            yes=true;
          }

        }
        };
    }

    if(yes==true){
     return {
      display: "block"
    }
    }
    else{
     return {
      display: "none"
    }
    }

  }

  $scope.firstTreeTabOpen=function(status){
    if(status=='orderreceived'){
       $scope.tab1=true;
       $scope.tab2=false;
       $scope.tab3=false;
       $scope.tab4=false;
     }

    if(status=='accepted'){
       $scope.tab1=true;
       $scope.tab2=false;
       $scope.tab3=false;
       $scope.tab4=false;
     }

    if(status=='inproduction'){
       $scope.tab1=false;
       $scope.tab2=true;
       $scope.tab3=false;
       $scope.tab4=false;
     }

    if(status=='packing'){
       $scope.tab1=false;
       $scope.tab2=true;
       $scope.tab3=false;
       $scope.tab4=false;
     }

    if(status=='factorytostore'){
       $scope.tab1=false;
       $scope.tab2=false;
       $scope.tab3=false;
       $scope.tab4=true;
     }

    if(status=='indelivery'){
       $scope.tab1=false;
       $scope.tab2=false;
       $scope.tab3=false;
       $scope.tab4=true;
     }


    if(status=='ordercomplete'){
       $scope.tab1=false;
       $scope.tab2=false;
       $scope.tab3=false;
       $scope.tab4=true;
     }

  };



$scope.displayAction = function (status) {


for (var i = $scope.orderConfigStatus.length - 1; i >= 0; i--) {
 if(status==$scope.orderConfigStatus[i].order_status){
   return {
      display: "block"
    }
 }
}
};

 $scope.printOrder = function(suborderid){
  // $("#"+suborderid).addClass('orderPrintZoom');

  var order_element="";
      order_element= document.getElementById(suborderid).outerHTML;
      // $("#"+suborderid).removeClass('orderPrintZoom');


order_element = order_element.split(';').join('');
order_element = order_element.split('₹').join('&#x20B9;');
order_element = order_element.split('removenghide ng-hide').join('removenghide');
order_element = order_element.split('removenghide  ng-hide').join('removenghide');
order_element = order_element.split('ng-hide removenghide').join('removenghide');
order_element = order_element.split('ng-hide  removenghide').join('removenghide');
order_element = order_element.split('orderbox1').join('orderbox1 orderPrintZoom');
order_element = order_element.split("printOrder(order.suborderid)").join("");
order_element = order_element.split("fa fa-print").join("");
order_element = order_element.split("hidecustinfo").join("");
// order_element = order_element.split("{ bgGreen1: (order.status =='orderreceived' ) , bgGreen: (order.status == 'accepted') , bgOrange: (order.status =='inproduction' ) ,       bgOrange1: (order.status == 'packing'),bgOrange2: (order.status =='factorytostore' ) , bgBlue: (order.status == 'indelivery') , bgGray: (order.status == 'ordercomplete') }").join("");
// order_element = order_element.split("{ bgRed: (order.status =='cancelled' ) , bgRed1: (order.status == 'rejected') }").join("");



      // order_element=S(order_element).replaceAll(";","");
      // order_element=S(order_element).replaceAll("₹","&#x20B9;");
      // order_element=S(order_element).replaceAll("removenghide ng-hide","removenghide");
      // order_element=S(order_element).replaceAll("removenghide ng-hide","removenghide");
      // order_element=S(order_element).replaceAll("ng-hide removenghide","removenghide");
      // order_element=S(order_element).replaceAll("ng-hide removenghide","removenghide");
      // order_element=S(order_element).replaceAll("orderbox1","orderbox1 orderPrintZoom");





      console.log(order_element);
       $rootScope.showSpinner();
       $http({
        method: 'POST',
        url: '/api/orderprint/'+suborderid,
        data:{"orderhtmldata":order_element}, 
      }).success(function(data, status, headers, config) {
        $rootScope.hideSpinner();
        // console.log(data.success.data)
        if(data.success){
        var win= window.open("data:application/pdf;base64," + data.success.data ); 
        }
        else{
            $rootScope.OZNotify(data.error.message, 'error');  
            $log.debug(data.error.message);
            if(data.error.code=='AL001'){
              $rootScope.showModal();
            }
         }
      }).error(function (data, status, headers, cfg) {
        $log.debug(status);
     });
 };

  }
  ]
  };
  });

angular.module('oz.ProviderApp').directive('altSrc', function() {
  return {
    link: function(scope, element, attrs) {
      var defaultSrc = attrs.src;
      element.bind('error', function() {
        if(attrs.errSrc) {
            element.attr('src', attrs.errSrc);
        }
        else if(attrs.src) {
            element.attr('src', defaultSrc);
        }
      });
    }
  }
});

angular.module('oz.ProviderApp').filter('datetime1', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input),
                              'yyyy-MM-dd @ HH:mm:ss');
  return _date.toUpperCase();

 };
});