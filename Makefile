JS_SENTINAL = package.json

$(JS_SENTINAL):
	rm -rf node_modules
	npm install
	touch $(JS_SENTINAL)
.PHONY: $(JS_SENTINAL)

runserver: $(JS_SENTINAL)
	npm run storybook
.PHONY: runserver

dev: $(JS_SENTINAL)
	npm run watch
.PHONY: dev
