'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/assessment-results',
      handler: 'assessment-result.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/assessment-results',
      handler: 'assessment-result.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
