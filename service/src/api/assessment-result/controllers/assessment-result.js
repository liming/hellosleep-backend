'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::assessment-result.assessment-result', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to save assessment results.');
    }

    const input = ctx.request.body?.data || {};

    // Use entityService directly for Strapi v5 stability.
    const created = await strapi.entityService.create('api::assessment-result.assessment-result', {
      data: {
        answers: input.answers || {},
        tags: input.tags || [],
        completedAt: new Date().toISOString(),
        user: user.id,
      },
    });

    const sanitized = await this.sanitizeOutput(created, ctx);
    return this.transformResponse(sanitized);
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view assessment results.');
    }

    const entries = await strapi.entityService.findMany('api::assessment-result.assessment-result', {
      filters: { user: user.id },
      sort: [{ completedAt: 'desc' }],
    });

    const sanitized = await this.sanitizeOutput(entries, ctx);
    return this.transformResponse(sanitized);
  },
}));
