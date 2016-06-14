(function() {
'use strict';

/*
* Overview: Comment Tags js
* All js relatred to tahs are defined here
* Dated: 20/11/2013.
* Author: Bhagyashri Jangam
* Copyright: Prodonus Software Private Limited and GiantLeap Systems Private Limited 2013
* Change History:
* ----------------------------------------------------------------------
* date | author | description 
* ----------------------------------------------------------------------
* 20-11/2013 | Bhagyashri | tag js
* 
*/
 

angular.module('tags-input', []).directive('tagsInput', function($interpolate) {
    function loadOptions(scope, attrs) {
        function getStr(name, defaultValue) {
            return attrs[name] ? $interpolate(attrs[name])(scope.$parent) : defaultValue;
        }

        function getInt(name, defaultValue) {
            var value = getStr(name, null);
            return value ? parseInt(value, 10) : defaultValue;
        }

        function getBool(name, defaultValue) {
            var value = getStr(name, null);
            return value ? value === 'true' : defaultValue;
        }

        scope.options = {
            list: eval($interpolate('{{ ' + getStr('list', 'list') + ' }}')(scope.$parent)),
            cssClass: getStr('ngClass', ''),
            placeholder: getStr('placeholder', ''),
            tabindex: getInt('tabindex', ''),
            removeTagSymbol: getStr('removeTagSymbol', String.fromCharCode(215)),
            replaceSpacesWithDashes: getBool('replaceSpacesWithDashes', true),
            minLength: getInt('minLength', 3),
            maxLength: getInt('maxLength', ''),
            addOnEnter: getBool('addOnEnter', true),
            addOnSpace: getBool('addOnSpace', false),
            addOnComma: getBool('addOnComma', true),
            allowedTagsPattern: new RegExp(getStr('allowedTagsPattern', '^[a-zA-Z0-9\\s]+$')),
            enableEditingLastTag: getBool('enableEditingLastTag', false)
        };
    }

    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel' },
        replace: false,
        template: '<div class="ngTagsInput {{ options.cssClass }}">' +
                  '  <ul class="ngTagsInputList">' +
                  '    <li ng-repeat="tag in tags track by $index" ng-class="getCssClass($index)">' +
                  '      <span>{{ tag }}</span>' +
                  '      <button type="button" ng-click="remove($index)">{{ options.removeTagSymbol }}</button>' +
                  '    </li>' +
                  '  </ul>' +
                  '  <input type="text" typeahead="item for item in list | filter:$viewValue | limitTo:8" placeholder="{{ options.placeholder }}" size="{{ options.placeholder.length }}" maxlength="{{ options.maxLength }}" tabindex="{{ options.tabindex }}" ng-model="newTag" />' +
                  '</div>',
        controller: function($scope, $attrs) {
            loadOptions($scope, $attrs);
        
            $scope.list = $scope.options.list;
            $scope.newTag = '';
            $scope.tags = $scope.tags || [];
 
            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.options.minLength && $scope.options.allowedTagsPattern.test(tag)) {

                    if ($scope.options.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);
                    }

                    $scope.newTag = '';
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;
                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        $scope.newTag = $scope.tags.pop();
                    }
                    else {
                        if ($scope.shouldRemoveLastTag) {
                            $scope.tags.pop();

                            $scope.shouldRemoveLastTag = false;
                        }
                        else {
                            $scope.shouldRemoveLastTag = true;
                        }
                    }
                    changed = true;
                }
                return changed;
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };

            $scope.getCssClass = function(index) {
                var isLastTag = index === $scope.tags.length - 1;
                return $scope.shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                $scope.shouldRemoveLastTag = false;
            });

        },
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8, TAB = 9;

            element.find('input')
                .bind('keydown', function(e) {
                    if (e.keyCode === ENTER && scope.options.addOnEnter ||
                        e.keyCode === TAB && scope.options.addOnEnter ||
                        e.keyCode === COMMA && scope.options.addOnComma ||
                        e.keyCode === SPACE && scope.options.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }

                        if (e.keyCode !== TAB)
                            e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE && this.value.length === 0) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();

                            e.preventDefault();
                        }
                    }
                })
                .on('focus', function(e) {
                    if (scope.tryAdd()) {
                        scope.safeApply();
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });


           scope.safeApply = function(fn) {
              var phase = this.$root.$$phase;
              if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                  fn();
                }
              } else {
                this.$apply(fn);
              }
           };

        }
    };
});
}());
