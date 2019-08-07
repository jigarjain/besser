require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import lusca from 'lusca';
import requestId from 'express-request-id';
import expressPino from 'express-pino-logger';

// Logger
import logger from './logger';

// Route Controllers
import Experiment from './controllers/ExperimentController';
import Goal from './controllers/GoalController';
import Visitor from './controllers/VisitorController';

// Other middlewares
import { errorHandler, notFoundHandler } from './utils/middlewares';

// Create a new express application instance
const app = express();

// Express configurations
app.set('port', process.env.PORT || 3000);
app.use((req, res, next) => {
  req.data = {};
  res.removeHeader('X-Powered-By');
  next();
});
app.use(
  lusca({
    xssProtection: true,
    nosniff: true
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(requestId());
app.use(
  expressPino({
    logger
  })
);

// Setting up routes
app.use(Experiment);
app.use(Goal);
app.use(Visitor);

// Setting up global error handler
app.use(notFoundHandler);
app.use(errorHandler);

// Setting up
export default app;
