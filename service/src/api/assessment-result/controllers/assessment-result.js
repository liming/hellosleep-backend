'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::assessment-result.assessment-result', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to save assessment results.');
    }
    ctx.request.body.data = {
      ...ctx.request.body.data,
      user: user.id,
      completedAt: new Date().toISOString(),
    };
    return super.create(ctx);
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view assessment results.');
    }
    ctx.query = {
      ...ctx.query,
      filters: {
        ...(ctx.query.filters || {}),
        user: { id: { $eq: user.id } },
      },
      sort: 'completedAt:desc',
    };
    return super.find(ctx);
  },
}));
