#!/bin/bash

PATH=$(npm bin):$PATH tsc
PATH=$(npm bin):$PATH browserify ./dist/Main.js -o ./browser/bundle.js
