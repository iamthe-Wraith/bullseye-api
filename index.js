const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const apiRouter = require('./src/routes/api');
const authRouter = require('./src/routes/auth');
const Response = require('./src/utils/response');
const serviceMiddleware = require('./src/middleware/service');
const {
  API_ROUTE,
  AUTH_ROUTE,
  ERROR
} = require('./src/constants');

mongoose.connection.on('open', () => console.log('[+] database connection open'));
mongoose.connection.on('error', err => console.log('[-] database connection error', err));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bullseye', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
// mongoose.set('useCreateIndex', true);

const app = express();
const port = process.env.PORT || 8080; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(serviceMiddleware);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use((err, req, res, next) => {
  if (err) {
    const error = new Error(err.message);
    error.data = ERROR.GEN;
    Response.error(error, req, res);
  } else {
    next();
  }
})

app.use(API_ROUTE, apiRouter);
app.use(AUTH_ROUTE, authRouter);

app.listen(port, () => console.log(`[+] server is ready and waiting on port: ${port}`));
