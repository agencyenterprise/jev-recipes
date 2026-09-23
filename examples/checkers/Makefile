.PHONY: play build test
.DEFAULT_GOAL := play

build:
	@$(MAKE) -C ../.. build

play: build
	@node --env-file-if-exists=.env server.mjs

test: build
	@node --test game.test.mjs match.test.mjs server.test.mjs
