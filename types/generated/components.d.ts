import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsBlogPreview extends Struct.ComponentSchema {
  collectionName: 'components_sections_blog_previews';
  info: {
    displayName: 'Blog Preview';
    icon: 'feather';
  };
  attributes: {
    head: Schema.Attribute.Component<'shared.section-head', false>;
    latestLabel: Schema.Attribute.String;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
  };
}

export interface SectionsClientWall extends Struct.ComponentSchema {
  collectionName: 'components_sections_client_walls';
  info: {
    displayName: 'Client Wall';
    icon: 'emotionHappy';
  };
  attributes: {
    clients: Schema.Attribute.Component<'shared.client', true>;
    head: Schema.Attribute.Component<'shared.section-head', false>;
  };
}

export interface SectionsCtaBand extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_bands';
  info: {
    displayName: 'CTA Band';
    icon: 'bell';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_grids';
  info: {
    displayName: 'Feature Grid';
    icon: 'apps';
  };
  attributes: {
    head: Schema.Attribute.Component<'shared.section-head', false>;
    items: Schema.Attribute.Component<'shared.card', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
  };
}

export interface SectionsFunding extends Struct.ComponentSchema {
  collectionName: 'components_sections_fundings';
  info: {
    displayName: 'Funding Routes';
    icon: 'cash';
  };
  attributes: {
    chooseNote: Schema.Attribute.String;
    cta: Schema.Attribute.Component<'shared.link', false>;
    deskLabel: Schema.Attribute.String;
    deskNote: Schema.Attribute.String;
    deskTitle: Schema.Attribute.String;
    head: Schema.Attribute.Component<'shared.section-head', false>;
    instantBadge: Schema.Attribute.String;
    journeyText: Schema.Attribute.Text;
    journeyTitle: Schema.Attribute.String;
    methods: Schema.Attribute.Component<'shared.pay-method', true>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
    icon: 'rocket';
  };
  attributes: {
    badge: Schema.Attribute.String;
    cta: Schema.Attribute.Component<'shared.link', false>;
    marquee: Schema.Attribute.Component<'shared.tag', true>;
    stats: Schema.Attribute.Component<'shared.stat', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    subtitle: Schema.Attribute.Text;
    tickerSymbol: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'OANDA:XAUUSD'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsServicesPreview extends Struct.ComponentSchema {
  collectionName: 'components_sections_services_previews';
  info: {
    displayName: 'Services Preview';
    icon: 'layer';
  };
  attributes: {
    head: Schema.Attribute.Component<'shared.section-head', false>;
    viewAllLabel: Schema.Attribute.String;
    whatYouGetLabel: Schema.Attribute.String;
  };
}

export interface SectionsSteps extends Struct.ComponentSchema {
  collectionName: 'components_sections_steps';
  info: {
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    head: Schema.Attribute.Component<'shared.section-head', false>;
    items: Schema.Attribute.Component<'shared.card', true>;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    displayName: 'Card';
    icon: 'grid';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'LineChart',
        'Coins',
        'BarChart3',
        'Wallet',
        'Headset',
        'ShieldCheck',
        'Zap',
        'Globe2',
      ]
    >;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedClient extends Struct.ComponentSchema {
  collectionName: 'components_shared_clients';
  info: {
    displayName: 'Client';
    icon: 'user';
  };
  attributes: {
    location: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    quote: Schema.Attribute.Text;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    whatsappMessage: Schema.Attribute.Text;
  };
}

export interface SharedPayMethod extends Struct.ComponentSchema {
  collectionName: 'components_shared_pay_methods';
  info: {
    displayName: 'Pay Method';
    icon: 'wallet';
  };
  attributes: {
    how: Schema.Attribute.Text & Schema.Attribute.Required;
    key: Schema.Attribute.Enumeration<['whish', 'usdt', 'omt', 'bank']> &
      Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    speed: Schema.Attribute.String;
    tagline: Schema.Attribute.String;
  };
}

export interface SharedSectionHead extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_heads';
  info: {
    displayName: 'Section Head';
    icon: 'align-left';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'Tag';
    icon: 'priceTag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.blog-preview': SectionsBlogPreview;
      'sections.client-wall': SectionsClientWall;
      'sections.cta-band': SectionsCtaBand;
      'sections.feature-grid': SectionsFeatureGrid;
      'sections.funding': SectionsFunding;
      'sections.hero': SectionsHero;
      'sections.services-preview': SectionsServicesPreview;
      'sections.steps': SectionsSteps;
      'shared.card': SharedCard;
      'shared.client': SharedClient;
      'shared.link': SharedLink;
      'shared.pay-method': SharedPayMethod;
      'shared.section-head': SharedSectionHead;
      'shared.seo': SharedSeo;
      'shared.stat': SharedStat;
      'shared.tag': SharedTag;
    }
  }
}
