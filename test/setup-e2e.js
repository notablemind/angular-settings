
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

angularSettings.config('tester', 'thetests', {
  title: "Page 1",
  name: "page1",
  settings: [ "**" ]
});

var sets = settings.getSettings('thetests');
sets.config({
  myne: {
    _type: 'bool',
    _group: true,
    name: {
      type: 'text',
      value: 'George',
      description: 'Your Name'
    },
    male: {
      name: 'male',
      type: 'bool',
      value: true,
      description: 'Masculinity'
    },
    house: {
      name: 'house',
      type: 'radio',
      value: 'Slytherine',
      description: 'Harry Potter Horwarts House',
      options: [['Slytherine', 'slytherine'],
                ['Frools', 'frools'],
                ['Ravenclaw', 'ravenclaw']]
    }
  }
});
