.PHONY: help setup generate docs test ci pack-check build clean new format evals patch minor major
.DEFAULT_GOAL := help
export RECIPE KIND

help:
	@echo "make setup                  Install locked development dependencies"
	@echo "make generate               Refresh exports and catalog data"
	@echo "make docs                   Refresh generated code and documentation"
	@echo "make test                   Run offline recipe and tooling tests"
	@echo "make test RECIPE=route      Run one recipe's tests"
	@echo "make ci                     Run all checks, including the npm archive"
	@echo "make pack-check             Build, inspect, and test the npm archive"
	@echo "make new RECIPE=my-recipe   Scaffold a recipe and its test file (KIND=choice|score|gate|comparison|labels)"
	@echo "make evals                  Evaluate the live model and update reports and guides (needs TYPESAFE_API_KEY)"
	@echo "make build / make clean     Build or remove compiled output"
	@echo "make format                 Format the codebase"
	@echo "make patch / minor / major  Bump the version and push main with tags"

setup:
	@npm ci --ignore-scripts
	@npm ci --ignore-scripts --prefix examples/support-routing

generate:
	@npm run generate

docs:
	@npm run docs

test:
	@node scripts/test.mjs

ci:
	@npm run ci

pack-check:
	@npm run pack:check

build:
	@npm run build

clean:
	@npm run clean

new:
	@node scripts/new-recipe.mjs

evals:
	@npm run eval:validate
	@npm run eval

format:
	@npm run format

patch:
	@npm version patch
	@git push origin main --tags

minor:
	@npm version minor
	@git push origin main --tags

major:
	@npm version major
	@git push origin main --tags
