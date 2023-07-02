const app = require('./app');

/**
 * Here goes the server configuration
 */

const port = 3000;
app.listen(port, () => {
  console.log('listening on port')
});