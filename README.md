# Remote Sprint Planner

## Tech stack

### Front end

Vanilla JavaScript for everything.

Browser native EventSource API for uni-directional server-sent events.

### Back end

Node.js + Express for server.

Browser native `'Content-Type': 'text/event-stream'` header and Express `res.write` for server-sent events.

## Development

## npm scripts

```
$ npm start
```

Use `npx` to run locally installed devDependencies. For example, to run the sequelize-cli node_module installed in this directory:

```
$ npm install

$ npx sequelize-cli <command>
```

More info on how `npx` works: https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner

## Postico

I recommend using this to visualise the database: https://eggerapps.at/postico/