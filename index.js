//IMPORTS
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');
const port = process.env.PORT || 3000;

//EXPRESS INSTANCE
const app = express();

//FOR RESPONSE IN JSON
app.use(express.json());

//CORS
const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};
app.use(cors(options));

//LOGIN
require('./utils/auth');

//ROUTES PRACTICE
app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});
app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

//ROUTES
routerApi(app);

//MIDDELWARES
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

//SERVER UP
app.listen(port, () => {
  console.log(`Mi port ${port}`);
});
