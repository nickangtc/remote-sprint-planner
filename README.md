# Remote Sprint Planner

## Tech stack

### Front end

Vanilla JavaScript for everything.

Browser native EventSource API for uni-directional server-sent events.

### Back end

Node.js + Express for server.

Browser native `'Content-Type': 'text/event-stream'` header and Express `res.write` for server-sent events.

## Development

```
$ npm start
```