angular.module('oz.AdminApp')
.factory('tagAddService', [
  '$rootScope',
  '$resource',
  '$http',
  '$state',
  '$log',
     function ($rootScope, $resource, $http, $state, $log) {
    var addService = { Product: $resource('/api/tagreffdictionary/addtag', {}, { addTagsK: { method: 'POST' } }) };
    var adds = {};
    adds.addTagFunction = function (tagInputData) {
      addService.Product.addTagsK(tagInputData,function (success) {
        $log.debug(success);
        $rootScope.$broadcast('tagAddedSuccessfully', success);
      }), function (error) {
        $log.debug(error);
        $rootScope.$broadcast('tagsNotAddedSuccessfully', error);
      };
    };
    return adds;


  }
])
