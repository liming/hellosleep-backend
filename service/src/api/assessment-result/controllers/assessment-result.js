'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::assessment-result.assessment-result', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const input = ctx.request.body?.data || {};

    // Support two create modes:
    // 1) Normal app flow (JWT user): force relation to current user.
    // 2) Data migration (API token): accept provided `user` relation if present.
    const data = {
      answers: input.answers || {},
      tags: input.tags || [],
      completedAt: input.completedAt || new Date().toISOString(),
    };

    if (user?.id) {
      data.user = user.id;
    } else if (input.user) {
      data.user = input.user;
    }

    const created = await strapi.entityService.create('api::assessment-result.assessment-result', {
      data,
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
