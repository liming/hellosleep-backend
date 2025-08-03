import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSharing extends Struct.ComponentSchema {
  collectionName: 'components_shared_sharings';
  info: {
    description: '';
    displayName: 'sharing';
    icon: 'cast';
  };
  attributes: {
    contributor: Schema.Attribute.String & Schema.Attribute.Required;
    userLink: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.sharing': SharedSharing;
    }
  }
}
