﻿# Tenant app 1

Simple tenant app that imports the base-app.

## How to Use

The package scripts `build*`, `clean*` and `start` can be run from within the package's root directory as usual.

The `test*` scripts are an exception. You need to run the test scripts at the repository's root using `npx lerna run ...`, f.e.:

- Run unit tests watcher with `/<repository-root>$ npx lerna run test --stream --no-prefix --scope */*tenant1`

See the README.md at the repository's root for more instructions.
