
var angular = require('angularjs') 
  , settings = require('settings')
  , loco = require('loco')('angularSettings')
  , template = require('./template');

var _registry = {};
var register = function (type, obj) {
  if (_registry[type]) {
    throw new Error('Type already registered: ' + type);
  }
  _registry[type] = obj;
};

loco.addDefault({
  'Setting': 'Setting',
  'Value': 'Value',
  'Description': 'Description'
});

var mod = angular.module('settings', [])

  .directive('settingsManager', function() {
    return {
      scope: {},
      template: template,
      link: function (scope, element, attrs) {
        var name = attrs.settingsManager || 'default';
        if (!name || !settingsConfigs[name]) {
          console.error('Settings manager invalid initialization; must pass in a valid name to watch');
          return;
        }
        // TODO: figure out how I want to make this configurable. probably a
        // global localization solution
        scope.t = loco.get;
        /*
        scope.$parent.$watch(name, function(value) {
          scope.settings = value;
        });
        scope.$watch('settings', function(value) {
          scope.$parent[name] = value;
        });
        */
        var config = settingsConfigs[name]
          , manager = settings.getSettings(config.name)
          , sub = manager.getSub(config.sub || '');
        if (!config.pages) {
          scope.pages = [sub];
        } else {
          scope.pages = [];
          config.pages.forEach(function(name){
            // var page = [];
            // one.items.forEach(function(name) {
            var parts = name.split('.')
            , base = sub;
            while (parts.length) {
              base = base[parts.shift()];
            }
            scope.pages.push(base);
            // });
            // scope.pages.push(page);
          });
        }
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
              // scope.validate = plugin.validate;
              var template = plugin.template;
              element.html(template);
              $compile(element.contents())(scope);
              var ngModel = scope.$parent['setting-form'].setting;
              if (plugin.validator) {
                ngModel.$parsers.unshift(plugin.validator(scope, ngModel));
              }
              if (plugin.formatter) {
                ngModel.$formatters.push(plugin.formatter);
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

var settingsConfigs = {
  default: {
    name: 'default'
  }
};

module.exports = {
  factory: function (name, settings) {
    mod.factory(name, function () {
      return settings;
    });
  },
  register: register,
  config: function (name, config) {
    settingsConfigs[name] = config;
  }
};

// load the built-in modules
var built_in = ['bool', 'radio', 'text'];
for (var i=0; i<built_in.length; i++) {
  register(built_in[i], require('./plugins/' + built_in[i]));
}

