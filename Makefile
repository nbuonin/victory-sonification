NODE_MODULES = ./node_modules
JS_SENTINAL = $(NODE_MODULES)/sentinal

$(JS_SENTINAL): package.json
	rm -rf $(NODE_MODULES)
	npm install
	touch $(JS_SENTINAL)
.PHONY: $(JS_SENTINAL)

runserver: $(JS_SENTINAL)
	npm run storybook
.PHONY: runserver

dev: $(JS_SENTINAL)
	npm run watch
.PHONY: dev
