/**
 * Copyright (C) Mercury Squad
 */

/**
 * The application entry point
 *
 * @author      Mercury Squad
 * @version     1.0
 */

require('dotenv').config();

require('./src/bootstrap');

const config = require('config');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const httpStatus = require('http-status');
const helmet = require('helmet');
const autoReap = require('multer-autoreap');

const methodOverride = require('method-override');

const logger = require('./src/common/logger');
const errorMiddleware = require('./src/common/ErrorMiddleware');

const app = express();
const http = require('http').Server(app);
const routes = require('./src/routes');

app.set('port', config.PORT);

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(autoReap);

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

app.use(config.API_VERSION, routes);

app.use(errorMiddleware());

app.use('*', (req, res) => {
  const pathKey = req.baseUrl.substring(config.API_VERSION.length + 1);
  const route = routes[pathKey];
  if (route) {
    res.status(httpStatus.METHOD_NOT_ALLOWED).json({ message: 'The requested method is not supported.' });
  } else {
    res.status(httpStatus.NOT_FOUND).json({ message: 'The requested resource cannot found.' });
  }
});

if (!module.parent) {
  http.listen(app.get('port'), () => {
    logger.info(`Express server listening on port ${app.get('port')}`);
  });
} else {
  module.exports = app;
}
