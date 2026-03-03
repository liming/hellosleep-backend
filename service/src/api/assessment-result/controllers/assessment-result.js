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

    // Strapi v5 may reject relation filters injected via ctx.query on this content-type.
    // Query directly via entityService to keep user scoping stable.
    const entries = await strapi.entityService.findMany('api::assessment-result.assessment-result', {
      filters: { user: user.id },
      sort: [{ completedAt: 'desc' }],
    });

    const sanitized = await this.sanitizeOutput(entries, ctx);
    return this.transformResponse(sanitized);
  },
}));
