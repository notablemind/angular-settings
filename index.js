
var angular = require('angularjs') 
  , settings = require('settings')
  , template = require('./template');

var _registry = {};
var register = function (type, obj) {
  if (_registry[type]) {
    throw new Error('Type already registered: ' + type);
  }
  _registry[type] = obj;
};

var mod = angular.module('settings', [])

  .directive('settings', function() {
    return {
      scope: {},
      template: template,
      link: function (scope, element, attrs) {
        var name = attrs.settingsmanager;
        scope.$parent.$watch(name, function(value) {
          scope.settings = value;
        });
        scope.$watch('settings', function(value) {
          scope.$parent[name] = value;
        });
      }
    };
  })

  .directive('setting', [
    '$compile',
    function ($compile) {
      return {
        scope: {},
        link: function (scope, element, attrs) {
          var name = attrs.setting;
          var type;
          scope.$parent.$watch(name, function(value) {
            scope.setting = value;
            if (value.type !== type && _registry[value.type]) {
              type = value.type;
              var plugin = _registry[value.type];
              scope.validate = plugin.validate;
              var template = plugin.template;
              element.html(template);
              $compile(element.contents())(scope);
              var ngModel = scope.$parent['setting-form'].setting;
              if (plugin.validator) {
                ngModel.$parsers.unshift(plugin.validator(scope, ngModel));
              }
            }
          });
          scope.$watch('setting', function(value) {
            scope.$parent[name] = value;
          });
        }
      }
    }]
  );

module.exports = {
  factory: function (settings) {
    mod.factory('settings', function () {
      return settings;
    });
  },
  register: register
};

// load the built-in modules
var built_in = ['bool', 'radio', 'text'];
for (var i=0; i<built_in.length; i++) {
  register(built_in[i], require('./plugins/' + built_in[i]));
}

