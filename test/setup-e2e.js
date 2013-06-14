
var angular = require('angularjs')
  , settings = require('settings')
  , angularSettings = require('angular-settings');

var testmod = angular.module('test', ['settings']);

function Tester($scope) {
};

angularSettings.config('tester', {
  name: 'thetests'
});

var sets = settings.getSettings('thetests');
sets.add({
  name: 'PageOne',
  type: 'bool',
  settings: [
    {
      name: 'Name',
      type: 'text',
      value: 'George',
      description: 'Your Name'
    },
    {
      name: 'Male',
      type: 'bool',
      value: true,
      description: 'Masculinity'
    }
  ]
});
