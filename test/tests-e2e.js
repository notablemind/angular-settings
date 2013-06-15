
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
        name: 'myne',
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
      sets.set('myne.key', 'Sally');
      scope.$digest();
      expect(text.value).to.eql('Sally');
    });

    describe('changing the text', function () {
      beforeEach(function(){
        text.value = 'Brent';
        trigger(text, 'input');
      });
      it('should effect the setting', function(){
        expect(sets.get('myne.key')).to.eql('Brent');
      });
    });
  });

  describe('with a bool setting', function(){
    var bool, scope;
    beforeEach(function(){
      sets.add({
        name: 'myne',
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
      sets.set('myne.key', false);
      scope.$digest();
      expect(bool.checked).to.be.false;
    });

    describe('clicking the checkbox', function(){
      beforeEach(function(){
        bool.checked = false;
        trigger(bool, 'click');
      });
      it('should update the setting', function(){
        expect(sets.get('myne.key')).to.be.false;
      });
    });
  });

  describe('with a radio setting', function(){
    var radios, scope;
    beforeEach(function(){
      sets.add({
        name: 'myne',
        settings: [{name: 'key', type: 'radio', value: 'c',
                    options: ['a', 'c', 'f']}]
      });
      node = bootstrap('template', 'test');
      radios = qa('#ang .key input');
      scope = angular.element(radios[0]).scope().$parent;
    });

    it('should correctly populate', function(){
      expect(radios[1].checked).to.be.true;
      expect(radios[0].checked).to.be.false;
      expect(radios[2].checked).to.be.false;
    });

    it('should respond to scope changes', function(){
      sets.set('myne.key', 'f');
      scope.$digest();
      expect(radios[2].checked).to.be.true;
      expect(radios[1].checked).to.be.false;
    });

    describe('clicking an option', function(){
      beforeEach(function(){
        radios[0].checked = true;
        trigger(radios[0], 'click');
      });
      it('should update the setting', function(){
        expect(sets.get('myne.key')).to.eql('a');
      });
    });
  });

});
