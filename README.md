# learnflow

SPA in Backbone.js, and API in Hapi to collect and display user wisdom about online educational resources

## screenshot 

![screenshot](https://raw.githubusercontent.com/eamonnbell/learnflow/master/screenshot.png)

## structure

### /server.js

Hapi.js server that serves API and client SPA

### api/

Hapi.js route definitions

### app/

#### app/{js, css}

SPA source

#### app/dist

Destination for webpack bundle

## using

```
npm install
sudo systemctl start mongodb
node server.js
```
## build/rebuild/dev

### API

```nodemon server.js```

### app

```
cd app/js
webpack --watch
```

