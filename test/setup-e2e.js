
var angular = require('angularjs')
  , settings = require('settings')
  , loco = require('loco')
  , angularSettings = require('angular-settings');

loco.add('en', {
  angularSettings: {
    Value: 'Mancakes'
  }
});

var testmod = angular.module('test', ['settings']);

function Tester($scope) {
  $scope.settings = settings.getSettings('thetests');
  $scope.pretty = function () {
    return JSON.stringify($scope.settings.json(), undefined, 2);
  };
};

angularSettings.config('tester', {
  name: 'thetests',
  sub: '',
  pages: [ 'myne' ]
});

var sets = settings.getSettings('thetests');
sets.add({
  name: 'myne',
  type: 'bool',
  settings: [
    {
      name: 'name',
      type: 'text',
      value: 'George',
      description: 'Your Name'
    },
    {
      name: 'male',
      type: 'bool',
      value: true,
      description: 'Masculinity'
    },
    {
      name: 'house',
      type: 'radio',
      value: 'Slytherine',
      description: 'Harry Potter Horwarts House',
      options: ['Slytherine', 'Frools', 'Ravenclaw']
    }
  ]
});
