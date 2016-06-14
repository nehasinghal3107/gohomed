angular.module('oz.ProviderApp')
  .controller('OZProductDiscountController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'ProviderServicesList', '$rootScope', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, ProviderServicesList, $rootScope) {

    $scope.codeContent = {'discountcode':'', 'description' : '', 'percent' : '', 'startdate': '', 'expirydate' : ''};                                                                               

    $scope.temporaryContentArray = [];

    $scope.today =  new Date();

    $scope.showFilterBoxes = 1;

    var lengthOfFinalProducts = 0;

    var status = '';

    $scope.submit = function()
    {    
        $scope.errorForEmptyCode = '';
        $scope.errorForEmptyDescription= '';
        $scope.errorForInvalidPercentage = '';
        $scope.errorForInvalidStartDate = '';
        $scope.errorForInvalidEnddate = '';
        $scope.allValidContent = 0;       
        if($scope.codeContent.discountcode === '')
        {
            $scope.errorForEmptyCode = 'Please enter valid discount code'; $scope.allValidContent = 1;
        }
        if($scope.codeContent.discountcode.length > 20)
        {
          $rootScope.OZNotify('The length of discount code should be less than 20 characters', 'error');$scope.allValidContent = 1;
        }
        if($scope.codeContent.description === '')
        {
            $scope.errorForEmptyDescription = 'Please enter valid description for discount code';$scope.allValidContent = 1;
        }
        if($scope.codeContent.percent === '' || $scope.regexForNumbers.test($scope.codeContent.percent) === false || $scope.codeContent.percent>100 || $scope.codeContent.percent<1)
        {
            $scope.errorForInvalidPercentage = 'Please enter valid percentage! Percent range should be between [1-100]';$scope.allValidContent = 1;
        }
        if($scope.codeContent.startdate === '' || $scope.codeContent.expirydate === '')
        {   
             if($scope.codeContent.startdate === '')
            {

                $scope.errorForInvalidStartDate = 'Please enter valid start date';$scope.allValidContent = 1;
            }
            if($scope.codeContent.expirydate === '')
            {
                $scope.errorForInvalidEnddate = 'Please enter valid end date';$scope.allValidContent = 1;
            }
        }
        if(moment.utc($scope.codeContent.startdate).diff(moment.utc($scope.codeContent.expirydate), 'days') > 0 )
        {
          $rootScope.OZNotify('The start date cant be greater than end date' , 'error');
          $scope.allValidContent = 1;
        }
        if($scope.allValidContent === 0 )
        {   

            $scope.codeContentObject = {'discountdata' : $scope.codeContent}; 
            ProviderServicesList.addProductCode($scope.codeContentObject);
        }
    };

    var countProductsLength = [];

    $scope.cancelAll = function()
    {
            $scope.errorForEmptyCode = '';
            $scope.errorForEmptyDescription= '';
            $scope.errorForInvalidPercentage = '';
            $scope.errorForInvalidStartDate = '';
            $scope.errorForInvalidEnddate = '';  
            $scope.codeContent = {'discountcode':'', 'description' : '', 'percent' : '', 'startdate': '', 'expirydate' : ''};  
            $scope.isCollapsed = !$scope.isCollapsed;        
    };

    $scope.regexForText = /^[a-zA-Z\s]*$/;

    $scope.regexForNumbers = /[0-9]/;

    $scope.regexForEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    $scope.regexForPhno = /^\(?[+]([0-9]{2,5})\)?[-]?([0-9]{10,15})$/;

    $scope.regexForMultipleEmail = /(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*,\s*|\s*$)+)/;

    $scope.regularExpressionForManufactuter = /^manufacturer/i;

    $scope.errorForEmptyCode = '';

    $scope.errorForEmptyDescription= '';

    $scope.errorForInvalidPercentage = '';

    $scope.errorForInvalidStartDate = '';

    $scope.errorForInvalidEnddate = '';

    $scope.containerOfDiscountCode = {};

    $scope.currentSelectedDiscount = [];

    $scope.discountid = '';

    $scope.searchProduct = '';

    $scope.filterCodesWithExistingDiscounts = '';

    $scope.filter = {};

    $scope.filter.searchProducts = '';

    $scope.filter.finalSelectedProducts = '';

   $scope.$watch('selectedBranchId', function (selectedBranchId) {
        $scope.containerOfDiscountCode = [];    
        $scope.discountid = '';
        $scope.productsList = [];
        $scope.finalSelectedProducts = [];
        $scope.currentSelectedDiscount = [];
        if(selectedBranchId !== undefined && selectedBranchId !== '')
        {
            ProviderServicesList.getAllDiscountCodes(); 
            ProviderServicesList.getAllProductList();
        }
    });

    $scope.productsList = [];

    $scope.finalSelectedProducts = [];

    $scope.set = 0;

    $scope.assignDiscountCodes = 0;

    $scope.manageDiscountCodes = 1;

    $scope.isCollapsed = true;

    $scope.checkForEmptyarray = 0;

     $scope.openAddDiscountCode = function(){
     $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.switchToManageDiscountCodes = function()
    {
         $scope.manageDiscountCodes = 1;
         $scope.assignDiscountCodes = 0;
    };

    $scope.switchToAssignDiscountCodes = function()
    {
         $scope.assignDiscountCodes = 1;
         $scope.manageDiscountCodes = 0;
         $scope.finalSelectedProducts = [];
         ProviderServicesList.getAllDiscountCodes();
         ProviderServicesList.getAllProductList();
         $scope.currentSelectedDiscount = [];
    };

    var cleanUpEventaddedProductDiscountCode = $scope.$on("codeAddedSuccessfully",function(event,data){
        if(data.error)
        {
             if(data.error.code === 'AL001')
              {
                    $rootScope.showModal();
              }
              else
              { $rootScope.OZNotify(data.error.message,'error');}
        }
        if(data.success)
        {    
             $rootScope.OZNotify(data.success.message,'success');
             $scope.openAddDiscountCode();
             ProviderServicesList.getAllDiscountCodes();
             $scope.codeContent = {'discountcode':'', 'description' : '', 'percent' : '', 'startdate': '', 'expirydate' : ''};                                 
        } 
    });
                                                                            
    var cleanUpEventnotaddedProductDiscountCode = $scope.$on("productNotAddedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

   var cleanUpEventGetProductDiscountCode = $scope.$on("gotAllDiscountCodes",function(event,data){
        if(data.error)
        {
              if(data.error.code === 'AL001')
              {
                    $rootScope.showModal();
              }
              else
              {
                $scope.containerOfDiscountCode = [];    $scope.discountid = '';
            }
        }
        if(data.success)
        {    
             $scope.containerOfDiscountCode = angular.copy(data.success.discountcodes);
             $scope.temporaryContentArray = [];
             $scope.temporaryContentArray = angular.copy(data.success.discountcodes);
        } 
    });
                                                                            
    var cleanUpEventnotgotProductDiscountCode = $scope.$on("notGotAllCodes",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    var cleanUpEventGotAllProducts = $scope.$on("gotAllProductsList",function(event,data){
            if(data.error)
            {
                  if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                        $rootScope.OZNotify(data.error.message,'error');$scope.productsList = [];
                  }
            }
            if(data.success)
            {    $scope.productsList = [];
                 $scope.productsList = angular.copy(data.success.products); 
                 countProductsLength = angular.copy(data.success.products);
                 var uniques = [];
                 uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                 $scope.productsList = [];
                 $scope.productsList = angular.copy(uniques);
            } 
    });
                                                                            
    var cleanUpEventnotgotAllProducts = $scope.$on("getProductListFailure",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
            $scope.showSpinners = 0;
    });
 
    var cleanUpEventGotExistingProductsWithCode = $scope.$on("gotProductContent",function(event,data){
            if(data.error)
            {
                  if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
            }
            if(data.success)
            {    $scope.finalSelectedProducts = [];
                 $scope.finalSelectedProducts = angular.copy(data.success.products); 
                 lengthOfFinalProducts = $scope.finalSelectedProducts.length; console.log('----' + lengthOfFinalProducts);
                 for(var i = 0 ;i<$scope.productsList.length;i++)
                 {
                    $scope.productsList[i].$$hashKey = undefined;
                 }
                 for(var j = 0 ;j<$scope.finalSelectedProducts.length;j++)
                 {
                    $scope.finalSelectedProducts[j].$$hashKey = undefined;
                 }
                 $scope.filterList();
                 var uniques = [];
                 uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                 $scope.productsList = [];
                 $scope.productsList = angular.copy(uniques);
            } 
    });
                                                                            
    var cleanUpEventNotGotExistingProductsWithCode = $scope.$on("notGotProductContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    $scope.selectedDiscountId = '';

    $scope.addToFinalProductList = function(list, index)
    {   
         var alertFlagShow = 0;
         for(var i = 0 ; i < $scope.finalSelectedProducts.length; i++)
         {
            if(list.productid === $scope.finalSelectedProducts[i].productid)
            {
                alertFlagShow = 1;
            }
         }
         if($scope.currentSelectedDiscount.length === 0)
         {
          $rootScope.OZNotify('Please select discount code before moving product!', 'error');
         }
         else if(alertFlagShow === 1)
         {
            $rootScope.OZNotify('The selected product already exists in the list', 'error');
         }
         else
         {
                 list.price.discountedprice = (list.price.value - (list.price.value)*($scope.currentSelectedDiscount.percent/100)).toFixed(2);
                 $scope.finalSelectedProducts.push(list);
                 // var indexOfSelectedProduct = '';
                 // for(var i = 0; i<$scope.productsList.length; i++)
                 // {
                 //       if($scope.productsList[i].productname === list.productname)
                 //       {
                 //        indexOfSelectedProduct = i;
                 //       }
                 // }
                 // $scope.productsList.splice(indexOfSelectedProduct,1);   
                 $rootScope.OZNotify('Selected product added successfully to the checklist', 'success');
       }
       $scope.set = 1;
       $scope.checkForEmptyarray = 1;
                              var uniques = [];
                 uniques = _.map(_.groupBy($scope.finalSelectedProducts,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                 $scope.finalSelectedProducts = [];
                 $scope.finalSelectedProducts = angular.copy(uniques);
    };

    $scope.insertProductToProductList = function(list, index)
    {
         $scope.productsList.push(list);
         var indexOfSelectedProduct = '';
         for(var i = 0; i<$scope.finalSelectedProducts.length; i++)
         {
               if($scope.finalSelectedProducts[i].productname === list.productname)
               {
                indexOfSelectedProduct = i;
               }
         }
         $scope.finalSelectedProducts.splice(indexOfSelectedProduct,1);
         $scope.set = 0;
         $scope.checkForEmptyarray = 1;
                          var uniques = [];
                 uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                 $scope.productsList = [];
                 $scope.productsList = angular.copy(uniques);
                 $rootScope.OZNotify('Selected product removed from the checklist', 'success');
    };

    $scope.addAllProductsToFinalList = function()
    {
            if($scope.currentSelectedDiscount.length === 0)
            {
              $rootScope.OZNotify('Please select discount code before moving products!', 'error');
            }
            else
            {
                if($scope.productsList.length !== 0)
                {
                    for(var i = 0; i<$scope.productsList.length ; i++)
                        {
                            $scope.productsList[i].price.discountedprice = ($scope.productsList[i].price.value - ($scope.productsList[i].price.value)*($scope.currentSelectedDiscount.percent/100)).toFixed(2);
                            $scope.finalSelectedProducts.push($scope.productsList[i]);
                        }
                }
                // $scope.productsList = [];
                $rootScope.OZNotify('All products added to checklist', 'success');
           }     
           $scope.set = 1;
           $scope.checkForEmptyarray = 1;
                                  var uniques = [];
                 uniques = _.map(_.groupBy($scope.finalSelectedProducts,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                 $scope.finalSelectedProducts = [];
                 $scope.finalSelectedProducts = angular.copy(uniques);
    };

    $scope.clearAllProductsToFinalList = function()
    {    
        if($scope.currentSelectedDiscount.length === 0)
        {
            $rootScope.OZNotify('Please select atleast one discount code from above list and then proceed', 'error');
        }
       else
       {
        var empty = 0;
        if($scope.finalSelectedProducts.length === 0)
        {
            empty = 5;
        }

                        if($scope.finalSelectedProducts.length !== 0)
                        {
                            for(var i = 0; i<$scope.finalSelectedProducts.length ; i++)
                                {
                                    $scope.productsList.push($scope.finalSelectedProducts[i]);
                                }
                        }
                        $scope.finalSelectedProducts = [];
                        $scope.set = 0;
                        $scope.checkForEmptyarray = 1;
                                         var uniques = [];
                                 uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
                                 $scope.productsList = [];
                                 $scope.productsList = angular.copy(uniques);
                                 if(empty !==5)
                                 {
                                     $rootScope.OZNotify('All products removed from checklist', 'success');
                                 }
                                 else
                                 {
                                    $rootScope.OZNotify('There are no products in the list to remove!', 'error');
                                 }
        }
    };

    $scope.assignDiscountsToProducts = function()
    {
        $scope.productids = [];
        if(($scope.finalSelectedProducts.length < lengthOfFinalProducts) && lengthOfFinalProducts.length !== 0)
        {
            status = 'removed';
        }
        else if($scope.finalSelectedProducts.length > lengthOfFinalProducts)
        {
            status = 'added';
        }
        else if($scope.finalSelectedProducts.length === lengthOfFinalProducts)
        {
            status = 'same';
        }
        else
        {
            status = 'check';
        }
        for(var i = 0 ; i<$scope.finalSelectedProducts.length ; i++)
        {
            $scope.productids.push($scope.finalSelectedProducts[i].productid);
        }
        $scope.content = {'products' : $scope.productids};
        if($scope.discountid === '' || $scope.currentSelectedDiscount.length === 0)
        {
            $rootScope.OZNotify('Please select discount code from dropdown list! If list is empty then please add discount code','error');
        }
        else
        {   //console.log('///////'+JSON.stringify($scope.content));
            ProviderServicesList.addignCodesToProd($scope.content,$scope.discountid);
        }
        $scope.filter.searchProducts = '';
        $scope.filter.filterCodesWithExistingDiscounts = '';
    };

   var cleanUpEventAssignedDiscountCodes = $scope.$on("codeAssignedSuccessfully",function(event,data){
        if(data.error)
        {
          if(data.error.code === 'AL001')
          {
                $rootScope.showModal();
          }
          else
          {
            $rootScope.OZNotify(data.error.message,'error');
            $scope.finalSelectedProducts = [];
            lengthOfFinalProducts = 0;
            ProviderServicesList.getAllProductList();
            ProviderServicesList.getExistingProductDetails($scope.currentSelectedDiscount.discountid);
          }
            $scope.searchProduct = '';
            $scope.filterCodesWithExistingDiscounts = '';
            $scope.filterList();
            var uniques = [];
            uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
            $scope.productsList = [];
            $scope.productsList = angular.copy(uniques);
        }
        if(data.success)
        {    
            var varProductsArray = data.success.alreadyappliedproductids; 
            $scope.successMessage = [];
            if(varProductsArray.length !== 0)
            {
                  for(var i = 0 ; i < varProductsArray.length; i++)
                  {
                    for(var j = 0 ; j < countProductsLength.length; j++)
                    {
                      if(countProductsLength[j].productid === varProductsArray[i])
                      {
                         $scope.successMessage.push(countProductsLength[j].productname);
                      }

                     }
                  }
                  var message = ''; lengthOfFinalProducts = 0;
                  ProviderServicesList.getAllProductList();ProviderServicesList.getExistingProductDetails($scope.currentSelectedDiscount.discountid);
                    $('#resultDiscountModal').modal({ 
                      keyboard: false,
                      backdrop: 'static',
                      show: true
                    });
            }
            else{
               // if($scope.set === 0)
               // {
               //  $rootScope.OZNotify('Discount code assigned/unassigned', 'success');
               // }
               // if($scope.set === 1)
               // {
               //  $rootScope.OZNotify('Discount code assigned for the selected products', 'success');
               // }
               if(status === 'added')
               {
                $rootScope.OZNotify('You have successfully assigned product/products to the selected discount code', 'success');
                status = '';
               }
               else if(status === 'removed')
               {
                $rootScope.OZNotify('You have successfully unassigned products from the selected discount code', 'success');
                status = '';
               }
               else if(status === 'same')
               {
                $rootScope.OZNotify('You have not made any changes in the list! Please move products and then click apply', 'error');
                status = '';
               }
               else
               {
                $rootScope.OZNotify('You have not made any changes in the list ! Please move products and then click apply', 'error');
                status = '';
               }
               ProviderServicesList.getAllProductList();lengthOfFinalProducts = 0;
               ProviderServicesList.getExistingProductDetails($scope.currentSelectedDiscount.discountid);

            } 
            var uniques = [];
            uniques = _.map(_.groupBy($scope.productsList,function(doc){return doc.productid;}),function(grouped){return grouped[0];});
            $scope.productsList = [];
            $scope.productsList = angular.copy(uniques);
        } 
    });
                                                                            
    var cleanUpEventNotAssignedDiscountCodes = $scope.$on("codeNotAssignedSuccessfully",function(event,data){
        $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
        $scope.searchProduct = '';
        $scope.filterCodesWithExistingDiscounts = '';
    });

    $scope.assignCodes = function(id)
    {
           $scope.discountid = id.discountid;$scope.checkForEmptyarray = 0
           ;// for(var z = 0 ; z < $scope.containerOfDiscountCode.length ; z ++)
           // {
           //      document.getElementById(z).style.backgroundColor = '#FFFFFF';
           // }
           // document.getElementById(hover).style.backgroundColor = '#ddd';
           $scope.filter.searchProducts = '';
           $scope.filter.filterCodesWithExistingDiscounts = '';
           $scope.showFilterBoxes = 0; $scope.showFilterBoxes = 1;             

           $scope.currentSelectedDiscount = [];
           for(var i = 0 ; i < $scope.containerOfDiscountCode.length; i++)
           {
            if(id.discountid === $scope.containerOfDiscountCode[i].discountid)
            {
                  $scope.currentSelectedDiscount = angular.copy($scope.containerOfDiscountCode[i]);
            }
           }
           $scope.productsList = [];
           $scope.finalSelectedProducts = [];
           lengthOfFinalProducts = 0;
           ProviderServicesList.getAllProductList();
           ProviderServicesList.getExistingProductDetails(id.discountid);
    };

    $scope.edit = function(list)
    {
        list.editing = true;
    };

    $scope.cancelEditing = function(list)
    {
        list.editing = false;
        $scope.containerOfDiscountCode = [];
        $scope.containerOfDiscountCode = angular.copy($scope.temporaryContentArray);
    };

    $scope.updateDiscountDetails = function(list)
    { 
        $scope.newCodeContents = {'description' : '', 'percent' : '', 'startdate': '', 'expirydate' : ''};  
        $scope.newCodeContents.description = list.description;
        $scope.newCodeContents.startdate = list.startdate;
        $scope.newCodeContents.expirydate = list.expirydate;
        $scope.newCodeContents.percent = list.percent; 
        $scope.newCodeContent = {'discountdata' : $scope.newCodeContents}; 
        if($scope.newCodeContents.description === '')
        {
            $rootScope.OZNotify('Please enter valid description before proceeding', 'error');
        }
        else if($scope.newCodeContents.percent === '' || $scope.regexForNumbers.test($scope.newCodeContents.percent) === false || $scope.newCodeContents.percent > 100 || $scope.newCodeContents.percent<1)
        {
            $rootScope.OZNotify('Please enter valid percentage before proceeding' , 'error');
        }
        else if(moment.utc($scope.newCodeContents.startdate).diff(moment.utc($scope.newCodeContents.expirydate), 'days') > 0 )
        {
          $rootScope.OZNotify('The start date cant be greater than end date' , 'error');
        }
        else
        {
                        ProviderServicesList.updateDiscountDetails(list.discountid, $scope.newCodeContent, list);
        }
        
    };

    var cleanUpEventcodeChangedSuccessfully = $scope.$on("codeChangedSuccessfully",function(event,data, list){
            if(data.error)
            {  if(data.error.code === 'AL001')
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
                $rootScope.OZNotify(data.success.message, 'success');
                list.editing = false;
                ProviderServicesList.getAllDiscountCodes();
            } 
    });
                                                                            
    var cleanUpEventcodenotChangedSuccessfully = $scope.$on("codenotChangedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    $scope.deleteCurrentCode = function(ids)
    {
            ProviderServicesList.deleteDiscountCode(ids);
    };

   var cleanUpEventcodeRemovedSuccessfully = $scope.$on("codeRemovedSuccessfully",function(event,data, list){
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
                $rootScope.OZNotify(data.success.message, 'success');
                ProviderServicesList.getAllDiscountCodes();
            } 
    });
                                                                            
    var cleanUpEventcodeNotRemovedSuccessfully = $scope.$on("codeNotRemovedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');$scope.showSpinners = 0;
    });

    $scope.currentDiscountCode = '';

    $scope.assignCodeContent = function(ids)
    {
             $scope.currentDiscountCode = ids;
    };

    $scope.filterList = function()
    {
                // for(var i = 0 ; i<$scope.finalSelectedProducts.length; i ++)
                //  {
                //     for(var j = 0; j < $scope.productsList.length ; j ++)
                //     {
                //         if($scope.productsList[j].productid === $scope.finalSelectedProducts[i].productid)
                //         {
                //             $scope.productsList.splice(j,1);
                //         }
                //     }
                //  }
    }

    $scope.$on('$destroy', function(event, message) 
    {
             cleanUpEventaddedProductDiscountCode();

             cleanUpEventnotaddedProductDiscountCode();

             cleanUpEventnotaddedProductDiscountCode();

             cleanUpEventnotgotProductDiscountCode();

             cleanUpEventGotAllProducts();

             cleanUpEventnotgotAllProducts();

             cleanUpEventAssignedDiscountCodes();

             cleanUpEventNotAssignedDiscountCodes();

             cleanUpEventGotExistingProductsWithCode();

             cleanUpEventcodeChangedSuccessfully();

             cleanUpEventcodenotChangedSuccessfully();

             cleanUpEventcodeRemovedSuccessfully();

             cleanUpEventcodeNotRemovedSuccessfully();
    });


  }]);