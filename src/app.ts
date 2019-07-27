import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import lusca from 'lusca';
import requestId from 'express-request-id';

// Route Controllers
import Experiment from './controllers/Experiment';
import Goal from './controllers/Goal';
import Error from './controllers/error';

// Create a new express application instance
const app = express();

// Express configurations
app.set('port', process.env.PORT || 3000);
app.use((req, res, next) => {
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

// Setting up routes
app.use(Experiment);
app.use(Goal);
app.use(Error);

// Setting up
export default app;
