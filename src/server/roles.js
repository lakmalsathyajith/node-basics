const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant('buyer').readOwn('users').updateOwn('users');

  ac.grant('seller').extend('buyer').readAny('users');

  ac.grant('admin')
    .extend('buyer')
    .extend('seller')
    .updateAny('users')
    .createAny('users')
    .deleteAny('users');

  return ac;
})();
