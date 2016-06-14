angular.module('oz.ProviderApp')
  .controller('OZUserGroupController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'ProviderServicesList', '$rootScope', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, ProviderServicesList, $rootScope) {
  
  
   $scope.manageMembers = 1;

   $scope.contentOfGroup = {'groupdata' : {'grpname': '', description : ''}};

   $scope.errorForEmptyName = '';

   $scope.errorForEmptyDescription ='';

   $scope.$watch('selectedBranchId', function (selectedBranchId) {
     $scope.allGrpContents = []; 
       if(selectedBranchId !== undefined && selectedBranchId !== '')
        {
          ProviderServicesList.getAllGroupContent(); 
          $rootScope.showSpinner();
        }
    });

  // ProviderServicesList.getAllGroupContent();
 
   $scope.allGrpContents = [];

   $scope.groupId = '';

   $scope.idOfSelectedGroup ='';

   $scope.mobile = '';

   $scope.groupMembersNos = [];

   $scope.email = '';

   $scope.usermemberscount = [{'email' : '', 'mobileno' : ''}];

   $scope.isCollapsed = true;

   $scope.form = {};

   $scope.regexForEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
   
   $scope.regexForPhno = /^([0-9]{10,15})$/;

   // $scope.array = [];

   $scope.array = [{'email':0 , 'mobileno' : 0}];

   $scope.activeGroupContent = [];

   $scope.switchToManageMembers	 = function()
   {
          $scope.manageMembers = 1;
   };

   $scope.switchToManageGroups = function()
   {
          $scope.manageMembers = 0;
   };

   $scope.openAddGroup = function(){
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.errorForEmptyDescription = '';
    $scope.errorForEmptyName = '';$scope.contentOfGroup.groupdata.grpname = '';$scope.contentOfGroup.groupdata.description = '';
   }

   $scope.addGroupContent = function()
   {
   	$scope.errorForEmptyDescription = '';
   	$scope.errorForEmptyName = '';
   	if($scope.contentOfGroup.groupdata.grpname === '')
   	{
            $scope.errorForEmptyName = 'Please enter valid group name';
   	}
    else if($scope.contentOfGroup.groupdata.grpname.length > 50)
    {
            $scope.errorForEmptyName = 'Group name should be of less than 50 characters';
    }
   	if($scope.contentOfGroup.groupdata.description === '')
   	{
   		    $scope.errorForEmptyDescription = 'Please enter valid description';
   	}
   	if($scope.errorForEmptyName === '' && $scope.errorForEmptyDescription === '')
   	{
             
                 ProviderServicesList.addGroupContent($scope.contentOfGroup);
                 $rootScope.showSpinner();
   	}
   };

   var cleanUpEventGroupContentAddedSuccessfully = $scope.$on("groupAddedSuccessfully",function(event,data, list){
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
                  $rootScope.hideSpinner();
            }
            if(data.success)
            {    
                $rootScope.OZNotify('Group Added Successfully', 'success');
                $scope.openAddGroup();
                ProviderServicesList.getAllGroupContent();
                $scope.contentOfGroup.groupdata.grpname = '';
                $scope.contentOfGroup.groupdata.description = '';
            } 
    });
                                                                            
    var cleanUpEventGroupContentNotAddedSuccessfully = $scope.$on("groupNotAddedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
            $rootScope.hideSpinner();
    });
    var tempGroupContent = [];
    var cleanUpEventGotGroupsSuccessfully = $scope.$on("gotAllContent",function(event,data, list){
            if(data.error)
            {
                  if(data.error.code === 'AL001')
                  {
                        $rootScope.showModal();
                  }
                  else
                  {
                    $rootScope.OZNotify(data.error.message,'error'); $scope.allGrpContents = []; 
                  }
                  $rootScope.hideSpinner();
            }
            if(data.success)
            {    
                $scope.allGrpContents = []; 
                 $scope.allGrpContents = angular.copy(data.success.usergrp);
                 tempGroupContent = [];
                 tempGroupContent = angular.copy(data.success.usergrp);
                 $rootScope.hideSpinner();
            } 
    });
                                                                            
    var cleanUpEventNotGotGroupsSuccessfully = $scope.$on("notGotContent",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
            $rootScope.hideSpinner();
    });

    $scope.edit = function(grps)
    {
    	    grps.editing = true;
        
          // {"groupdata":{"grpname":"quality","description":"Testing"}}
          // $rootScope.OZNotify('This feature is not yet fully implemented! Please try after some days', 'success');
    };

    $scope.stop = function(grps)
    {
      grps.editing = false;
      $scope.allGrpContents = angular.copy(tempGroupContent);
    }

    $scope.assignGroupId = function(ids)
    {
          $scope.groupId = ids;
    };

    $scope.deleteCurrentGrp = function()
    {
    	ProviderServicesList.deleteGroupContent($scope.groupId);
    };

   var cleanUpEventGrpRemoved = $scope.$on("groupDeletesSuccessfully",function(event,data){
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
                $rootScope.OZNotify('Group Deleted Successfully', 'success');
                ProviderServicesList.getAllGroupContent();
            } 
    });
                                                                            
    var cleanUpEventGrpNotRemoved = $scope.$on("groupNotDeletesSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.assignGrpId = function(ids)
    {           
              $scope.idOfSelectedGroup = ids;
              $scope.groupMembersNos = []; $scope.activeGroupContent = [];
              for(var i = 0 ; i < $scope.allGrpContents.length; i ++)
              {
                if(ids === $scope.allGrpContents[i].groupid)
                {
                     $scope.grpnameContent = $scope.allGrpContents[i].grpname;
                }
              } 
            
    }; 

    $scope.addMemberToTheGroup = function()
    {
              $scope.grpname = '';
      	     for(var iii = 0 ;iii < $scope.allGrpContents.length; iii ++)
      	     {    
                         if($scope.idOfSelectedGroup === $scope.allGrpContents[iii].groupid)
                         {
                         	    $scope.grpname = $scope.allGrpContents[iii].grpname;
                         }    
      	     }

             if($scope.idOfSelectedGroup === undefined || $scope.idOfSelectedGroup === '')
             {
                      $rootScope.OZNotify('Please select group name before adding group members ', 'error');
             }
             else
             {     var allDataValidated = 0;  
                   $scope.invalidEmailIds = '';
                   $scope.errorForInvalidMobileNumbers = '';

                   for(var ii = 0 ; ii< $scope.array.length ; ii++)
                   {
                        $scope.array[ii].email = 0;
                        $scope.array[ii].mobileno = 0;
                   }
                  for(var i = 0; i < $scope.userinvites.length ; i++)
                  {
                         if($scope.regexForEmail.test($scope.userinvites[i].email) === false)
                         {
                            $scope.invalidEmailIds = 'Please verify email ids from above fields';
                            allDataValidated = 1;
                            $scope.array[i].email = 1;
                         }
                         if($scope.regexForPhno.test($scope.userinvites[i].mobileno) === false)
                         {
                           $scope.errorForInvalidMobileNumbers = 'Please verify mobile numbers from above fields';
                            allDataValidated = 1;
                           $scope.array[i].mobileno = 1;
                         }
                  }  
                  if(allDataValidated === 0)
                  {         
                          $scope.object = {"invites":{"grpname": $scope.grpname,"members":$scope.userinvites}};
                          $log.debug(JSON.stringify($scope.object));
                          ProviderServicesList.addMembersToGroup($scope.object,$scope.idOfSelectedGroup);
                  }
                 if(allDataValidated !== 0)
                 {
                  // $rootScope.OZNotify('Please check following errors!', 'error');
                 }
             }
    };

    var cleanUpEventGroupMemberAddedSuccessfully = $scope.$on("membersAddedSuccessfully",function(event,data,type){
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
            $scope.userinvites=[{'email': '','mobileno': ''}];
            $scope.array = [{'email':0 , 'mobileno' : 0}];
            ProviderServicesList.getAllGroupContent();   
        } 
    });

    var cleanUpEventGroupMemberNotAddedSuccessfully = $scope.$on("membersNotAddedSuccessfully",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.addMoreMembers = function()
    {
                $scope.usermemberscount.push({'email' : $scope.email, 'mobileno' : $scope.mobile});
                $scope.usermemberscount.push({'email' : '', 'mobileno' : ''});
    };

    $scope.userinvites=[{'email': '','mobileno': ''}];

    $scope.addUserInvites = function() { 
       if($scope.userinvites[$scope.userinvites.length-1].email !== undefined && $scope.userinvites[$scope.userinvites.length-1].mobileno !== undefined && $scope.userinvites[$scope.userinvites.length-1].email !== '' && $scope.userinvites[$scope.userinvites.length-1].mobileno !== '')
        {  $scope.invitesettingchange = '';
          $scope.userinvites.push({'email': '', 'mobileno': ''});
          $scope.array.push({'email':0 , 'mobileno' : 0});
        }
       else {
        $scope.invitesettingchange = 'New fields will only visible once you enter data here.';
      }
    };

    $scope.removeInvites = function(index) {
      if(index === 0 && $scope.userinvites.length === 1)
      {
        $scope.userinvites[index].email = '';
        $scope.userinvites[index].mobileno = '';
        $scope.array[index].email = 0;
        $scope.array[index].mobileno = 0;
      }
      else
      {
      $scope.userinvites.splice(index , 1);
      $scope.array[index].email = 0;
      $scope.array[index].mobileno = 0;
    }
    };
    $scope.removeMemberGroup = function(ids)
    {
        if($scope.idOfSelectedGroup === '')
        {
          $rootScope.OZNotify('Please select group name before deleting group member', 'error');
        }
        else {ProviderServicesList.removeGroupMember(ids, $scope.idOfSelectedGroup);}
    };

    var cleanUpEventGroupMemberRemovedSuccessfully = $scope.$on("memberRemoveSuccess",function(event,data,type, grpid){
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
            ProviderServicesList.getAllGroupContent();
        } 
    });

    var cleanUpEventGroupMemberNotRemovedSuccessfully = $scope.$on("memberRemoveUnsuccess",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });
   
    var cleanUpEventGroupMemberRemovedSuccessfully = $scope.$on("groupContentModified",function(event,data, grps){
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
            ProviderServicesList.getAllGroupContent();
            grps.editing = false;
        } 
    });

    var cleanUpEventGroupMemberNotRemovedSuccessfully = $scope.$on("groupContentNotModified",function(event,data){
            $rootScope.OZNotify('Some issue with server! Please try after some time', 'error');
    });

    $scope.editGroupContents = function(grps)
    {
        if(grps.grpname === '')
          {
            $rootScope.OZNotify('Please enter valid group name', 'error');
          }
          else if(grps.grpname.length>50)
          {
            $rootScope.OZNotify('Group name should be less than 50 characters', 'error');
          }
          else
          {
            var content = {};
            content = {'groupdata' : {'grpname': grps.grpname, 'description' : grps.description}};
            ProviderServicesList.changeGroupContent(grps.groupid, content, grps);
          }
    }

    $scope.$on('$destroy', function(event, message) 
    {
            cleanUpEventGroupContentAddedSuccessfully();
            cleanUpEventGroupContentNotAddedSuccessfully();
            cleanUpEventGotGroupsSuccessfully();
            cleanUpEventNotGotGroupsSuccessfully();
            cleanUpEventGrpRemoved();
            cleanUpEventGrpNotRemoved();
            cleanUpEventGroupMemberAddedSuccessfully();
            cleanUpEventGroupMemberNotAddedSuccessfully();
            cleanUpEventGroupMemberRemovedSuccessfully();
            cleanUpEventGroupMemberNotRemovedSuccessfully();
    });
  }]);