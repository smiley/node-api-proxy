# Node API Proxy
##### Proxy API-calls through an express-server

This repository contains everything to run a simpler API proxy.
You can either use the deploy button to create everything automatically. It should work in most cases. Or you can clone the repo and do it yourself.


#### Deploy directly to Heroku (requires login):

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Instructions

1 . Clone repository and `cd` into the folder.

2 . Install dependencies
```bash
npm install
```

3 . Create a `.env` file in the root folder and enter your credentials. `.env.example` is a template for setting your credentials:

```env
API_URL=
API_KEY_NAME=
API_KEY_VALUE=
```

4. Start the server by running the start script: 
```bash
npm start
```

5. Make your API-requests to [`http://localhost:3000`](http://localhost:3000) instead.

