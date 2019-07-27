require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import lusca from 'lusca';
import requestId from 'express-request-id';

// Route Controllers
import Experiment from './controllers/ExperimentController';
import Goal from './controllers/GoalController';
import Error from './controllers/ErrorController';

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

// Setting up routes
app.use(Experiment);
app.use(Goal);
app.use(Error);

// Setting up
export default app;
