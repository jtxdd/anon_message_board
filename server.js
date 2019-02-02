const express           = require('express');
const bodyParser        = require('body-parser');
const helmet            = require('helmet');
const expect            = require('chai').expect;
const cors              = require('cors');
const PORT              = process.env.PORT;
const TEST              = process.env.NODE_ENV === 'test';
const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const app               = express();

const MongoClient = require('mongodb').MongoClient;
const URL         = process.env.DB;
const dbName      = 'fcc_jtodd';
const client      = new MongoClient(URL, {useNewUrlParser: true});

app.use(express.static('public'));
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

//For FCC testing purposes
fccTestingRoutes(app);
    
client.connect(err => {
  if (err) console.log('Db connection error');
  const db = client.db(dbName);
  apiRoutes(app, db);
  app.listen(PORT, () => {
    console.log('Your app is listening on port ' + PORT);
    if (TEST) {
      console.log('Running Tests...');
      setTimeout(() => {
        try {
          runner.run();
        } catch(e) {
          var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  });
});


module.exports = app; //for testing