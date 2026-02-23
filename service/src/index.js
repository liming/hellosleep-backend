'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    await setAssessmentResultPermissions(strapi);
  },
};

async function setAssessmentResultPermissions(strapi) {
  try {
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const rolesResult = await strapi
      .query('plugin::users-permissions.role')
      .findMany({ where: { type: 'authenticated' } });

    if (!rolesResult || rolesResult.length === 0) return;

    const authenticatedRole = rolesResult[0];

    const actions = ['api::assessment-result.assessment-result.find', 'api::assessment-result.assessment-result.create'];

    for (const action of actions) {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: authenticatedRole.id } });

      if (!existing) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: authenticatedRole.id,
            enabled: true,
          },
        });
      } else if (!existing.enabled) {
        await strapi.query('plugin::users-permissions.permission').update({
          where: { id: existing.id },
          data: { enabled: true },
        });
      }
    }
  } catch (err) {
    strapi.log.warn('Failed to set assessment-result permissions:', err.message);
  }
}
