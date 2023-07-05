const methodsToWrap = ['get', 'post', 'put', 'patch', 'delete'];

/**
 * using this to observe routes and catch errors in async controllers.
 */
const createAsyncRouter = (router) => {
  const _route = router.route.bind(router);
  router.route = function (path) {
    const route = _route(path);
    for (const method of methodsToWrap) {
      if (route[method]) {
        route[method] = wrapGlobalAsync(route[method]);
      }
    }
    return route;
  };

  const wrapGlobalAsync = function (originRouterMethod) {
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
      return originRouterMethod.call(this, wrappedMiddlewareStack);
    };
  };
  return router;
};

exports.createAsyncRouter = createAsyncRouter;
