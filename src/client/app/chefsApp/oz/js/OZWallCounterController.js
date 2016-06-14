angular.module('oz.UserApp')
  .controller('OZWallCounterController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'OZWallService', '$rootScope', 'getInitialCount', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, OZWallService, $rootScope, getInitialCount) {
     // var clock;

     $scope.count = 20;

     $scope.count1 = 0;

     $scope.customers = 0;

     $scope.orders = 0;

     $scope.startC = function()
     {
          //setInterval(function(){$scope.count = $scope.count + 1; console.log($scope.count);},3000);
          $scope.count = $scope.count + 1;
     };

     if(getInitialCount.error)
     {
            if(getInitialCount.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                        $rootScope.OZNotify(getInitialCount.error.message, 'error');
                  }
     }

     if(getInitialCount.success)
     {
        $scope.customers = getInitialCount.success.count.users;
        $scope.orders = getInitialCount.success.count.orders;
     }

    //OZWallService.getCount();

    // var cleanUpEventgetAllCountSuccess = $scope.$on("gotInitialCount",function(event,data){
    //     if(data.error)
    //     {
    //            $rootScope.OZNotify(data.error, 'error');
    //     }
    //     if(data.success)
    //     {
    //            $scope.customers = data.success.count.users;
    //            $scope.orders= data.success.count.orders;
    //     } 
    // });

    // var cleanUpEventNotGotAllCount = $scope.$on("notGotInitialCount",function(event,data){
    //         $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    // });


     //  $(document).ready(function() {

     //    // Instantiate a counter
     //    clock = new FlipClock($('.clock'), {
     //      clockFace: 'Counter',
     //      minimumDigits: 7
     //    });
        
  
     //    // Attach a click event to a button a increment the clock
     //    $('.increment').click(function() {
     //      //clock.setValue(10);

     //      // Or you could decrease the clock
     //      // clock.decrement();

     //      clock.increment();

     //      // Or set it to a specific value
     //      // clock.setValue(x);
     //    });

     //    $('.reset').click(function() {
     //      clock.reset();
     //    });
     //  });

    //  $scope.start = function()
    //  {
    //         for( var i=0;i<3000;i++)
    //            {  
    //                        $scope.count = $scope.count +1;   
    //                        $("#test").delay( 8000 );
    //            }
    // };

    // $scope.$on('$destroy', function(event, message) 
    // {
  
    //     cleanUpEventgetAllCountSuccess();
    //     cleanUpEventNotGotAllCount();

    // });
             

    }]);