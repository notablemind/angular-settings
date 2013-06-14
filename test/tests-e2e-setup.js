
var settings = require('settings')
  , angular = require('angularjs');

var defaultSettings = {
  name: 'test',
  settings: [
    {
      name: 'one',
      value: false,
      type: 'bool'
    }, {
      name: 'three',
      value: '2',
      options: ['1', '2', '3'],
      type: 'radio'
    }, {
      name: 'name',
      value: 'Flour',
      type: 'text'
    }, {
      name: 'goodness',
      type: 'bool',
      settings: [
        {
          name: 'jam',
          value: true
        }, {
          name: 'butter',
          value: true
        }, {
          name: 'margerine',
          value: false
        }
      ]
    }
  ]
};

settings.add(defaultSettings);
