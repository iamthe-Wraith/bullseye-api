const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const apiRouter = require('./src/routes/api');
const middleware = require('./src/middleware');
const Response = require('./src/utils/response');
const { API_ROUTE, ERROR } = require('./src/constants');

mongoose.connection.on('open', () => console.log('[+] database connection open'));
mongoose.connection.on('error', err => console.log('[-] database connection error', err));
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bullseye', {
// mongoose.connect(`mongodb://${bullseyeConfig.database.host}:${bullseyeConfig.database.port}/${bullseyeConfig.database.name}`, {
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
app.use(middleware.auth);
app.use((err, req, res, next) => {
  if (err) {
    const error = new Error(err.message);
    error.data = ERROR.GEN;
    Response.error(error, res);
  } else {
    next();
  }
})

app.use(API_ROUTE, apiRouter);

app.listen(port, () => console.log(`[+] server is ready and waiting on port: ${port}`));
