
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

function saveLocalStorage(manager) {
  var key = manager.name + '.angularSettings';
  localStorage[key] = JSON.stringify(manager.json());
}

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
        scope.t = loco.get;
        var config = settingsConfigs[name]
          , manager = settings.getSettings(config.name)
          , sub = manager.getSub(config.sub || '');
        scope.settings = manager.settings;
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
        scope.currentPage = scope.pages[0].name;
        scope.showPage = function (page) {
          scope.currentPage = page.name;
        };
        if (attrs.localStorage) {
          scope.$watch('settings', function (value) {
            saveLocalStorage(manager);
          }, true);
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
            if (value.type !== type){
              if (!_registry[value.type]) {
                console.error('Invalid setting type encountered:', value.type);
                return;
              }
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
              if (plugin.init) {
                plugin.init(scope, element, attrs);
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
  },
  loadLocalStorage: function (manager) {
    var values
      , name = manager.name + '.angularSettings';
    if (localStorage[name]) {
      try {
        values = JSON.parse(localStorage[name]);
      } catch (e) {
        console.log('Failed to load settings from localStorage');
        return;
      }
      manager.load(values);
    }
  }
};

// load the built-in modules
var built_in = ['bool', 'radio', 'text', 'select'];
for (var i=0; i<built_in.length; i++) {
  register(built_in[i], require('./plugins/' + built_in[i]));
}

