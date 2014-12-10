'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  $scope.checkAll = function() {
    angular.forEach($scope.members, function(member) {
      member.checked = true;
    });
  };

  $scope.uncheckAll = function() {
    angular.forEach($scope.members, function(member) {
      member.checked = false;
    });
  };

  $scope.members = [
    {id: 1, name: '空条承太郎'},
    {id: 2, name: 'ジョセフ・ジョースター'},
    {id: 3, name: 'モハメド・アヴドゥル'},
    {id: 4, name: '花京院典明'},
    {id: 5, name: 'ジャン=ピエール・ポルナレフ'},
    {id: 6, name: 'イギー'}
  ];

  $scope.members.map(function(m) {m.checked = false;});
}])

.controller('CheckboxTableCtrl', ['$scope', function($scope) {
  this.checkboxItems = [];
  this.checkboxItemElems = [];
  this.checkboxHead = null;
  this.checkboxHeadElem = null;

  this.addCheckboxHead = function(checkbox) {
    this.checkboxHead = checkbox;
  };

  this.addCheckboxHeadElem = function(checkboxElem) {
    this.checkboxHeadElem = checkboxElem;
  };

  this.addCheckboxItem = function(checkbox) {
    this.checkboxItems.push(checkbox);
  };

  this.addCheckboxItemElem = function(checkboxElem) {
    this.checkboxItemElems.push(checkboxElem);
  };

  this.reviewItem = function() {
    var headValue = this.checkboxHeadElem.checked;
    angular.forEach(this.checkboxItems, function(item) {
      item.$setViewValue(headValue);
      item.$render();
    });
    this.checkboxHead.$setViewValue(headValue);
    this.checkboxHead.$render();
  };

  this.reviewHead = function() {
    var checked = [];
    angular.forEach(this.checkboxItemElems, function(item) {
      if (item.checked) {
        checked.push(item);
      }
    });
    this.checkboxHead.$setViewValue(this.checkboxItems.length === checked.length);
    this.checkboxHead.$render();
  };
}])

.directive('checkboxTable', function() {
  return {
    restrict: 'A',
    replace: false,
    controller: 'CheckboxTableCtrl',
    link: function(scope, elem, attrs, ctrl) {
    }
  };
})

.directive('checkboxHead', function() {
  return {
    restrict: 'A',
    require: ['ngModel', '^checkboxTable'],
    link: function(scope, elem, attrs, ctrls) {
      ctrls[1].addCheckboxHead(ctrls[0]);
      ctrls[1].addCheckboxHeadElem(elem[0]);
      elem.on('click', function() {
        ctrls[1].reviewItem();
      });
    }
  };
})

.directive('checkboxItem', function() {
  return {
    restrict: 'A',
    require: ['ngModel', '^checkboxTable'],
    link: function(scope, elem, attrs, ctrls) {
      ctrls[1].addCheckboxItem(ctrls[0]);
      ctrls[1].addCheckboxItemElem(elem[0]);

      // DOM eventに対応
      elem.on('click', function(event) {
        ctrls[1].reviewHead();
      });

      // modelValueの変更に対応
      scope.$watch(function () {
        return ctrls[0].$modelValue;
      }, function(newValue, oldValue) {
        ctrls[1].reviewHead();
      });
    }
  };
});
