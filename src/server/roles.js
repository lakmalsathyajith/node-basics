const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant('buyer')
    .readOwn('users')
    .updateOwn('users')
    .readAny('categories')
    .readAny('products');

  ac.grant('seller')
    .extend('buyer')
    .readAny('users')
    .createAny('categories')
    .updateAny('categories')
    .deleteAny('categories')
    .createAny('products');

  ac.grant('admin')
    .extend('buyer')
    .extend('seller')
    .updateAny('users')
    .deleteAny('users');

  return ac;
})();
