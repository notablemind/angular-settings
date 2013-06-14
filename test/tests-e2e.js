
var expect = require('chai').expect;

var trigger = function (el, ev) {
  if ("fireEvent" in el)
    el.fireEvent("on" + ev);
  else {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(ev, false, true);
    el.dispatchEvent(evt);
  }
}

var bootstrap = function (templateId, mainModule) {
  var src = document.getElementById(templateId).innerHTML;
  var parent = document.createElement('div');
  parent.innerHTML = src;
  var node = parent.firstElementChild;
  document.body.appendChild(node);
  angular.bootstrap(node, [mainModule]);
  return node;
};

var qa = document.querySelectorAll.bind(document)
  , q = document.querySelector.bind(document);

describe('Settings Manager', function(){
  var node, sets;
  beforeEach(function(){
    sets = settings.getSettings('thetests');
    sets.clear();
  });
  
  afterEach(function(){
    if (node) node.parentNode.removeChild(node);
  });

  describe('the text setting', function(){
    var text, scope;
    beforeEach(function(){
      sets.add({
        name: 'one',
        settings: [{name: 'key', type: 'text', value: 'George'}]
      });
      node = bootstrap('template', 'test');
      text = q('#ang .key input')
      scope = angular.element(text).scope();
    });

    it('should correctly populate', function(){
      expect(text.value).to.eql('George');
    });

    it('should respond to settings changes', function(){
      sets.set('one.key', 'Sally');
      scope.$digest();
      expect(text.value).to.eql('Sally');
    });

    describe('changing the text', function () {
      beforeEach(function(){
        text.value = 'Brent';
        trigger(text, 'input');
      });
      it('should effect the setting', function(){
        expect(sets.get('one.key')).to.eql('Brent');
      });
    });
  });

  describe('with a bool setting', function(){
    var bool, scope;
    beforeEach(function(){
      sets.add({
        name: 'one',
        settings: [{name: 'key', type: 'bool', value: true}]
      });
      node = bootstrap('template', 'test');
      bool = q('#ang .key input');
      scope = angular.element(bool).scope();
    });

    it('should correctly populate', function(){
      expect(bool.checked).to.be.true;
    });

    it('should respond to scope changes', function(){
      sets.set('one.key', false);
      scope.$digest();
      expect(bool.checked).to.be.false;
    });

    describe('clicking the checkbox', function(){
      beforeEach(function(){
        bool.checked = false;
        trigger(bool, 'click');
      });
      it('should update the setting', function(){
        expect(sets.get('one.key')).to.be.false;
      });
    });
  });
});
