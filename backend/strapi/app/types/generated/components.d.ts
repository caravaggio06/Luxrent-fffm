import type { Schema, Struct } from '@strapi/strapi';

export interface CarMedia extends Struct.ComponentSchema {
  collectionName: 'components_car_media';
  info: {
    description: '';
    displayName: 'media';
  };
  attributes: {
    audio: Schema.Attribute.String;
    poster: Schema.Attribute.String;
    video: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'car.media': CarMedia;
    }
  }
}
