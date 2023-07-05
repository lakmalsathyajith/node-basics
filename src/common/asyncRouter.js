const express = require('express');
const methodsToWrap = ['get', 'post', 'put', 'patch', 'delete'];

const app = express();
const router = express.Router();
const _route = router.route.bind(router);

/**
 * using this to observe routes and catch errors in async controllers.
 */
router.route = function (path) {
  const route = _route(path);
  for (const method of methodsToWrap) {
    if (route[method]) {
      route[method] = wrapGlobalAsync(route[method]);
    }
  }
  return route;
};

const wrapGlobalAsync = (originRouterMethod) => {
  return function () {
    const existingMiddlewareStack = [...arguments];
    const wrappedMiddlewareStack = existingMiddlewareStack.map((fn) => {
      if (typeof fn !== 'function') {
        return fn;
      }

      return async function (req, res, next) {
        try {
          await fn.apply(null, arguments);
        } catch (err) {
          next(err);
        }
      };
    });
    originRouterMethod.call(this, wrappedMiddlewareStack);
  };
};

module.exports = router;
