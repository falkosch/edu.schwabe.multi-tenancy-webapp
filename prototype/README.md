# Prototype

## How to Use

Set up package with `npm i`

Run the prototype with `npm start`

Build it into `dist/` with `npm build`

Serve `dist/` with `npm build:serve`

Run unit tests with `npm run test`

Lint JS files with `npm run lint:js`

Lint SCSS files with `npm run lint:scss`

Generate JSDoc into `docs/` with `npm run docs`

Serve `docs/` with `npm run docs:serve`

## Multi-Tenancy

You can specify a tenant for most of the above commands by adding `-- --env.tenant=<tenant-name>` at the end of the npm script. Look up available tenants in the folder `tenancy/`

Run a tenant with `npm start -- --env.tenant=<tenant-name>`

Build a tenant into `dist/` with `npm build -- --env.tenant=<tenant-name>`

Run unit tests of a tenant with `npm run test -- --env.tenant=<tenant-name>`

All other npm scripts do work for all tenants naturally, like `npm -i` or `npm run build:serve`.
