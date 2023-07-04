const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: '.env' });
/**
 * Here goes the server configuration
 */
const DB = process.env.DATABASEURI.replace(
  '<DBPASSWORD>',
  process.env.DBPASSWORD
);

mongoose.connect(DB).then((result) => {
  console.log('Connected to database... ');
});

app.listen(process.env.PORT, () => {
  console.log('listening on port ' + process.env.PORT);
});
