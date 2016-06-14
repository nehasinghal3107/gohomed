angular.module('oz.AdminApp')
        .controller('ozAdminTagInputController', ['$scope','$log', '$rootScope', 'prodoCommentService', 'UserSessionService','$http','tagAddService', function($scope, $log,$rootScope, prodoCommentService, UserSessionService,$http,tagAddService) {
  

  $scope.category_selection;
  $scope.option1;
  $scope.option2;
  $scope.query={};$scope.query1={};
  $scope.tagid;
  $scope.tagname;
  $scope.result;
  $scope.level; 
  $scope.emotion; $scope.urls;
  $scope.emotionvalueinsert;
  $scope.urll;

  $scope.setEmotion=function()
  {
  if($scope.category_selection==="Love")
  {
    $scope.option1="Serenity [10]"; 
    $scope.option2="Joy [20]";
    $scope.option3="Ecstasy [30]";
  }
  else if ($scope.category_selection==="Optimism")
  {
    $scope.option1="Interest [10]";
    $scope.option2="Anticipation [20]";
    $scope.option3="Vigilance [30]"; 
  }
  else if($scope.category_selection==="Aggressiveness") 
  {
    $scope.option1="Annoyance [10]";
    $scope.option2="Anger [20]";
    $scope.option3="Rage [30]";
  }
  else if($scope.category_selection==="Contempt")
  {
    $scope.option1="Boredom [10]";
    $scope.option2="Disgust [20]";
    $scope.option3="Loathing [30]";
  }
  else if($scope.category_selection==="Remorse")
  {
    $scope.option1="Pensiveness [10]";
    $scope.option2="Sadness [20]";
    $scope.option3="Grief [30]";
    
  }
  else if($scope.category_selection==="Disapproval")
  {
    $scope.option1="Distraction [10]";
    $scope.option2="Surprise [20]";
    $scope.option3="Amazement [30]";
  }
  else if($scope.category_selection==="Awe")
  {
    $scope.option1="Apprehension [10]";
    $scope.option2="Fear [20]";
    $scope.option3="Terror [30]";
  }
  else if($scope.category_selection==="Submission")
  {
    $scope.option1="Acceptance [10]";
    $scope.option2="Trust [20]"; 
    $scope.option3="Adoration [30]";
  } 
 

    
}; 
				  $scope.func=function()  
				  {
				 
				    //$scope.query.Tag_ID=$scope.tagid;
				    $scope.query.tagname=$scope.tagname;
				    $scope.query.emotions={};
				    $scope.query.emotions.category=$scope.category_selection;
				    $scope.query.emotions.emotion=$scope.emotion;
				    $scope.query.emotions.level=$scope.level;
				    $scope.query.emotions.result=$scope.result;
				             var fullPath = document.getElementById('4').value;
				                if (fullPath) {
				                	var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
				                	var filename = fullPath.substring(startIndex);
				                	if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
				                		filename = filename.substring(1);
				                	}
				                	$scope.urll=filename;
				                }
				   // $scope.query.Emotions.Emotion_URL=document.getElementById("4").files;
				$scope.query.emotions.emotion_url=$scope.urll;

         $scope.query1.tagreffdicdata={};
         $scope.query1.tagreffdicdata=$scope.query;
        // alert($scope.query);



      tagAddService.addTagFunction($scope.query1);
      $scope.$on('getSearchProductDone', function (event, data) {
      });
      $scope.$on('getSearchProductNotDone', function (event, data) {
      });










				 
				  }; 
  
				  $scope.funct=function()
				  {
				    var e = document.getElementById("1");
				    var strUser = e.options[e.selectedIndex].text;
				    $scope.emotion=strUser;
				    

				  };

}]);