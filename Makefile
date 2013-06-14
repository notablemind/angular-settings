
plugin_tpl := $(patsubst %.jade,%.js,$(wildcard plugins/*.jade))

build: components node_modules index.js angular-settings.styl template.js plugin-tpl
	@component build --dev --use component-stylus

node_modules:
	@npm install

template.js: template.html
	@component convert $<

template.html: template.jade
	@jade template.jade

plugin-tpl: $(plugin_tpl)

plugins/%.js: plugins/%.html
	@component convert $<

plugins/%.html: plugins/%.jade
	@jade $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

testem: build
	@testem -f test/testem.json -l Chrome

# open browser correctly in mac or linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
		open := google-chrome
endif
ifeq ($(UNAME_S),Darwin)
		open := open
endif

test: build
	@${open} test/index.html

testci: build
	@testem ci -f test/testem.json -l PhantomJS

.PHONY: clean testem test testci
