
var template = require('./bool-template')

module.exports = {
  /*
  validator: function (scope, ctrl) {
    return function (value) {
      if (value === 'true') return true;
      if (value === 'false') return false;
    };
  },
  formatter: function (value) {
    return value + '';
  },
  */
  template: template
};
