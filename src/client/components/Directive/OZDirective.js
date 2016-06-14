angular.module('oz.CommonApp').directive('prodonusPasswordCheck', [
  '$parse',
  function ($parse) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        scope.$watch(function () {
          return $parse(attrs.prodonusPasswordCheck)(scope) === ctrl.$modelValue;
        }, function (currentValue) {
          ctrl.$setValidity('mismatch', currentValue);
        });
      }
    };
  }
]).directive('prodonusPasswordValidate', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        scope.pwdValidLength = viewValue && viewValue.length >= 6 ? 'valid' : undefined;
        scope.pwdHasAlphabet = viewValue && /[A-z]/.test(viewValue) ? 'valid' : undefined;
        scope.pwdHasNumber = viewValue && /\d/.test(viewValue) ? 'valid' : undefined;
        scope.pwdHasSymbol = viewValue && /(?=(?:.*[!@#$%^&*-]){1})/.test(viewValue) ? 'valid' : undefined;
        if (scope.pwdValidLength && scope.pwdHasAlphabet && scope.pwdHasNumber && scope.pwdHasSymbol) {
          ctrl.$setValidity('pwd', true);
          return viewValue;
        } else {
          ctrl.$setValidity('pwd', false);
          return undefined;
        }
      });
    }
  };
}).directive('prodonusMultiEmailValidate', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function (viewValue) {
        scope.emailHas = viewValue && /(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*,\s*|\s*$)+)/.test(viewValue) ? 'valid' : undefined;
        if (scope.emailHas) {
          ctrl.$setValidity('email', true);
          return viewValue;
        } else {
          ctrl.$setValidity('email', false);
          return undefined;
        }
      });
    }
  };
}).directive('notification', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: { ngModel: '=' },
      template: '<div class="alert alert-info fade" bs-alert="ngModel"></div>',
      link: function (scope, element, attrs) {
        $timeout(function () {
          element.hide();
        }, 600000);
      }
    };
  }
]).directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
}).directive('popdown', function () {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    controller: [
      '$scope',
      'PopdownAPI',
      function ($scope, PopdownAPI) {
        $scope.show = false;
        $scope.api = PopdownAPI;
        $scope.$watch('api.status', toggledisplay);
        $scope.$watch('api.message', toggledisplay);
        $scope.hide = function () {
          $scope.show = false;
          $scope.api.clear();
        };
        function toggledisplay() {
          $scope.show = !!($scope.api.status && $scope.api.message);
        }
      }
    ],
    template: '<div class="alert alert-{{api.status}}" ng-show="show">' + '  <button type="button" class="close" ng-click="hide()">&times;</button>' + '  {{api.message}}' + '</div>'
  };
}).directive('ozAlertMessage', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div style="text-align:left; padding: 8px; margin: 10px;" class="alert {{mainAlert.alertType}}" ng-show="mainAlert.isShown">' + '<button type="button" class="close" ng-click="closeAlert()" aria-hidden="true">&times;</button>' + '{{mainAlert.message}}' + '<a href="#/{{mainAlert.linkpage}}" class="alert-link"> {{mainAlert.linkmessage}}</a>' + '</div>',
      controller: [
        '$scope',
        '$rootScope',
        function ($scope, $rootScope) {
          $scope.mainAlert = { isShown: false };
          $scope.showAlert = function (alertType, message, linkpage, linkmessage) {
            $scope.mainAlert.message = message;
            $scope.mainAlert.isShown = true;
            $scope.mainAlert.linkpage = linkpage;
            $scope.mainAlert.linkmessage = linkmessage;
            $scope.mainAlert.alertType = alertType;
          };
          $scope.showmessage = function (alertclass, msg, alertlink, linkmsg) {
            var alerttype = alertclass;
            var alertmessage = msg;
            var link = alertlink;
            var linkmessage = linkmsg;
            $scope.showAlert(alerttype, alertmessage, link, linkmessage);
            return true;
          };
          $scope.closeAlert = function () {
            $scope.mainAlert.isShown = false;
          };
          $scope.hideAlert = function () {
            $scope.mainAlert.isShown = false;
          };
        }
      ]
    };
}
]).directive('ozSpinner', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div style="position:fixed;z-index:100;left:0;right:0;width:100%;height:100%;margin:auto;background:#ffffff;opacity:.4;" ng-show="spinner.isShown">' + '<center>' + '<i style="margin:250px auto;" class="fa fa-spinner fa-spin fa-3x">' + '</i>' + '</center>' + '</div>',
      controller: [
        '$scope',
        '$rootScope',
        function ($scope, $rootScope) {
          $scope.spinner = { isShown: false };
          $rootScope.showSpinner = function () {
            $scope.spinner.isShown = true;
          };
          $rootScope.hideSpinner = function () {
            $scope.spinner.isShown = false;
          };
        }
      ]
    };
  }
]).directive('prodovideo', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: { video: '@' },
    template: '<div class="prodovideo">' + '<iframe ng-src="{{ video }}"></iframe>' + '</div>',
    link: function (scope, element, attrs) {
      var ratio = attrs.height / attrs.width * 100;
      element[0].style.paddingTop = ratio + '%';
    }
  };
}).directive('prodoSlider', function () {
  var sliderdef = {
      restrict: 'A',
      link: function (scope, ele, attrs, c) {
        $(ele).layerSlider();
      }
    };
  return sliderdef;
})
.directive('ozClock', function () {
  var sliderdef = {
      restrict: 'A',
      scope:{
                'currentValue':'='
            },
      link: function (scope, ele, attrs, c) {
        var clock;
        // Instantiate a counter
        clock = new FlipClock($(ele), {
          clockFace: 'Counter',
          minimumDigits: 7
        });  
        clock.setValue(scope.currentValue);
        // Attach a click event to a button a increment the clock
        // $('.increment').click(function() {
        //   //clock.setValue(10);

        //   // Or you could decrease the clock
        //   // clock.decrement();

        //   clock.increment();

        //   // Or set it to a specific value
        //   // clock.setValue(x);
        // });

        // $('.reset').click(function() {
        //   clock.reset();
        // });
     

      }
    };
  return sliderdef;
})
.directive('prodoNav', function () {
  var nav = {
      restrict: 'A',
      link: function (scope, ele, attrs, c) {
        $('document').ready(function () {
          $('ul.nav.nav-pills li a').click(function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
          });
        });
      }
    };
  return nav;
}).directive('prodoUnique', [
  '$http',
  function ($http) {
    var username = {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel) {
          $('#prodo-form-input-username-signup').on('keyup', function (e) {
            var value = $(this).val().trim();
            var req = { 'username': value };
            if (value.length > 2 && value.length < 15) {
              $http({
                method: 'GET',
                url: '/api/userunique/' + value,
                data: req
              }).success(function (data, status, headers, cfg) {
                if (data.success) {
                  console.log(data.success.message);
                  ngModel.$setValidity("nametaken",true); // username available
                } else {
                    if (data.error.code== 'AV001') { 
                        console.log(data.error.code + data.error.message); 
                        ngModel.$setValidity("namelength", false);
                        
                    } else if (data.error.code=='ED001') {
                        console.log(data.error.code + data.error.message);
                        ngModel.$setValidity("nametaken",false);
                    } else if (data.error.code=='ED003') {   
                        console.log(data.error.code + data.error.message);
                        ngModel.$setValidity("nametaken",false);
                    } 
                }
              }).error(function (data, status, headers, cfg) {
                console.log(data);
              });
            }
          });
        }
      };
    return username;
  }
]).directive('prodoBarchart', function () {
  var barchart = {
      restrict: 'EA',
      link: function (scope, element, a) {
        nv.addGraph(function () {
          var chart = nv.models.discreteBarChart().x(function (d) {
              return d.label;
            }).y(function (d) {
              return d.value;
            }).staggerLabels(true).tooltips(true).showValues(true);
          d3.select('#chart').datum(example()).transition().duration(50).call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        });
        function example() {
          return [{
              key: 'Product Ratings',
              values: [
                {
                  'label': 'Awsome ',
                  'value': 300
                },
                {
                  'label': 'Average',
                  'value': 600
                },
                {
                  'label': 'Good',
                  'value': 200
                },
                {
                  'label': 'Bad',
                  'value': 400
                },
                {
                  'label': 'Worst',
                  'value': 10
                },
                {
                  'label': 'Complaints',
                  'value': 20
                }
              ]
            }];
        }
      }
    };
  return barchart;
}).directive('prodoPiechart', function () {
  var piechart = {
      restrict: 'EA',
      link: function (scope, elem, attrs) {
        nv.addGraph(function () {
          var width = 500, height = 500;
          var chart = nv.models.pieChart().x(function (d) {
              return d.key;
            }).y(function (d) {
              return d.y;
            }).color(d3.scale.category10().range()).width(width).height(height);
          d3.select('#test1').datum(scope.data).transition().duration(1200).attr('width', width).attr('height', height).call(chart);
          chart.dispatch.on('stateChange', function (e) {
            nv.log('New State:', JSON.stringify(e));
          });
          return chart;
        });
      }
    };
  return piechart;
}).directive('prodoProductChart', function () {
  var g = {
      restrict: 'EA',
      link: function (scope, element, attr) {
        var tooltip = d3.select("#a").append("div")   
           .attr("class", "abc")               
           .style("opacity", 0);
        var z = d3.select('#a').style('background-image', 'url(http://s1.ibtimes.com/sites/www.ibtimes.com/files/styles/v2_article_large/public/2013/09/18/apple-iphone-5s-release.jpg) ').style('background-repeat', 'no-repeat' ).style('background-size', '78%');
        var zz = z.append('svg');




        var l = zz.append('circle').attr('cx', 540 + 9).attr('cy', 74).attr('r', 5).style('fill', 'blue');
        l.on('mouseenter', function () {
          l.attr('r', 10).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 5).style('fill', 'blue').style('stroke-opacity', 2);
          tooltip.text('Front Camera').style('opacity', 2).style("left","540px").style("bottom","265px");
          //.style("left", d3.select(this).attr("cx") + "px").style("top", d3.select(this).attr("cy") + "px");

          // .style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        }).on('mouseout', function () {
          l.attr('r', 5).style('stroke', 'none');
          tooltip.style('opacity', 0).style("left","0px").style("bottom","0px");
        });




        l2 = zz.append('circle').attr('cx', 52+10+130).attr('cy', 90+90).attr('r', 8).style('fill', 'blue')
        .on('mouseover', function () {
          l2.attr('r', 12).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 8).style('fill', 'blue').style('stroke-opacity', 2);
          tooltip.text('Screen').style('opacity', 2).style("left","192px").style("bottom","180px");
          // .style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        }).on('mouseout', function () {
          l2.attr('r', 8).style('stroke', 'none');
          tooltip.style('opacity', 0).style("left","0px").style("bottom","0px");
        });




        l3 = zz.append('circle').attr('cx', 220).attr('cy', 290).attr('r', 5).style('fill', 'blue').on('mouseover', function () {
          l3.attr('r', 10).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 5).style('fill', 'blue').style('stroke-opacity', 2);
          tooltip.text('Home Key').style('opacity', 2).style("left","220px").style("bottom","70px");
          // .style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        }).on('mouseout', function () {
          l3.attr('r', 5).style('stroke', 'none');
          tooltip.style('opacity', 0).style("left","0px").style("bottom","0px");
        });




        l4 = zz.append('circle').attr('cx', 180).attr('cy', 320).attr('r', 4).style('fill', 'blue').on('mouseover', function () {
          l4.attr('r', 10).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 4).style('fill', 'blue').style('stroke-opacity', 2);
          tooltip.text('Mini USB Port').style('opacity', 2).style("left","180px").style("bottom","38px");
          //.style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        }).on('mouseout', function () {
          l4.attr('r', 4).style('stroke', 'none').style("left","0px").style("bottom","0px");
          tooltip.style('opacity', 0);
        });
        // l5 = zz.append('circle').attr('cx', 280).attr('cy', 90).attr('r', 4).style('fill', 'blue').on('mouseover', function () {
        //   l5.attr('r', 10).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 4).style('fill', 'blue').style('stroke-opacity', 2);
        //   tooltip.text('Rear Main Camera').style('opacity', 2).style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        // }).on('mouseout', function () {
        //   l5.attr('r', 4).style('stroke', 'none');
        //   tooltip.style('opacity', 0);
        // });
        // l6 = zz.append('circle').attr('cx', 305).attr('cy', 67).attr('r', 4).style('fill', 'blue').on('mouseover', function () {
        //   l6.attr('r', 7).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 4).style('fill', 'blue').style('stroke-opacity', 2);
        //   tooltip.text('Flash').style('opacity', 2).style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        // }).on('mouseout', function () {
        //   l6.attr('r', 2).style('stroke', 'none');
        //   tooltip.style('opacity', 0);
        // });
        // l7 = zz.append('circle').attr('cx', 488).attr('cy', 140).attr('r', 4).style('fill', 'blue').on('mouseover', function () {
        //   l7.attr('r', 10).style('fill', 'none').style('stroke', 'red').style('stroke-opacity', 0.000001).style('stroke-width', 3).transition().duration(500).attr('r', 5).style('fill', 'blue').style('stroke-opacity', 2);
        //   tooltip.text('Volume Keys').style('opacity', 4).style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
        // }).on('mouseout', function () {
        //   l7.attr('r', 4).style('stroke', 'none');
        //   tooltip.style('opacity', 0);
        // });
      }
    };
  return g;
}).directive('prodoIndia', function () {
  var indiaData = {
      restrict: 'EA',
      link: function (scope, element, attr) {
        var proj = d3.geo.mercator();
        var path = d3.geo.path().projection(proj);
        var map = d3.select('#map').append('svg:svg').attr('class', 'maps').attr('width', 600).attr('height', 800).call(initialize);
        var india = map.append('svg:g').attr('id', 'india');
        var tooltip = d3.select('#map').append('div').attr('class', 'abctooltip').style('opacity', 0);
        var data;
        d3.json('../../dashboard/json/IndiaData.json', function (json) {
          india.selectAll('path').data(json.features).enter().append('path').attr('d', path);
        });
        d3.json('../../dashboard/json/Counties.json', function (json) {
          data = json.reduce(function (result, county) {
            result[county.id] = county;
            return result;
          }, {});
          india.selectAll('path').style('fill', function a(d) {
            if (d.amount < 2)
              return 'rgb(247,251,255)';
            else if (d.amount > 1 && d.amount < 3)
              return 'rgb(8,48,107)';
            else if (d.amount > 2 && d.amount < 4)
              return 'rgb(8,81,156)';
            else if (d.amount > 3 && d.amount < 5)
              return 'rgb(8,81,156)';
            else
              return 'rgb(8,48,107)';
          }).attr('d', path).on('mouseover', function (d) {
            var title = d3.select('#subtitle').text(d.id);
            tooltip.text('State: ' + d.id + '  ' + 'Number of Customers: ' + d.amount * 100000).style('opacity', 4).style('left', d3.event.pageX + 5 + 'px').style('top', d3.event.pageY + 5 + 'px');
            var subblurb = d3.select('#subblurb').text(d.comment);
            console.log('The amount is ' + d.amount);
          }).on('mouseout', function (d) {
            tooltip.style('opacity', 0);
          }).on('click', function () {
          });
        });
        function initialize() {
          proj.scale(6700);
          proj.translate([
            -1240,
            720
          ]);
        }
        function quantize(d) {
          console.log('q' + Math.min(8, ~~(d.amount * 9 / 12)) + '-9');
          return 'q' + Math.min(8, ~~(d.amount * 9 / 12)) + '-9';
        }
      }
    };
  return indiaData;
}).directive('generalSearch', [
  '$http','$rootScope',
  function ($http,$rootScope) {
    var search = {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ngModel , growl) {

          $('#searchText').on('keyup', function (e) { 
                      scope.errors="";scope.enhancement={};
                      var value = $(this).val().trim(); 
                      var req = { 'providername': value};
                      if(value !=="" && e.shiftKey === false)
                      { 
                         $http({
                         method: 'POST',
                         url: '/api/searchprovider/',
                         data: req
                         }).success(function (data) 
                         {
                         if(data.error)
                              {
                                  if(data.error.code==="AD001")                       
                                  {
                                      scope.errors="No provider found "; scope.providers = {};
                                   }
                                   else
                                   {
                                        scope.errors="No provider found "; scope.providers = {};
                                   }
                              }
                         else if(data.success)
                               { 
                                   if(data.success.provider.length===0)
                                   { 
                                        if(value==="")
                                        {  
                                              scope.errors="";
                                        }
                                        else
                                        {                                
                                        // scope.errors="No products found for \n '" + $rootScope.orgdata.name+"'";
                                           scope.errors = 'No provider found';
                                           window.setTimeout(function() {                                            
                                           scope.toggleTitleForDiv();
                                           }, 1000);
                                        }
                                    }    
                                    scope.providers = {};
                                    scope.providers = data.success.provider; 
                                
                                  }
                                    
                          }).error(function (data) {
                                   $rootScope.OZNotify("There is some error with the server! Please try after some time",'error');                                
                          });   
                       }
            });
          }
      };
    return search;
  }
])

// .directive('OZSigninModal', [
//   '$timeout', 'UserSessionService',
//   function ($timeout, UserSessionService) {
//     return {
//       restrict: 'EA',
//       replace: true,
//       templateUrl: 'OrderZapp/home/views/oz.session.out.tpl.html', 
//       controller: [
//         '$scope',
//         '$rootScope',
//         function ($scope, $rootScope) {
//           $rootScope.showModal = function () {
//             $('#mySessionModal').modal({ 
//               keyboard: false,
//               backdrop: 'static',
//               show: true
//             });
//           };

//           $scope.sessionout = function() {
//             UserSessionService.logoutUser();
//             $('#mySessionModal').modal('hide');
//           }
//         }
//       ]
//     };
//   }
// ]);
