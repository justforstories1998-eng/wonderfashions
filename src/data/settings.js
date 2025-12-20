export const initialSettings = {
  // Store Information
  storeName: 'Wonder Fashions',
  storeEmail: 'hello@wonderfashions.com',
  storePhone: '+44 (0) 20 1234 5678',
  storeAddress: {
    street: '123 Fashion Street',
    city: 'London',
    postcode: 'W1A 1AA',
    country: 'United Kingdom'
  },

  // Currency
  currency: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound'
  },

  // Social Media Links
  socialMedia: {
    facebook: {
      enabled: true,
      url: 'https://facebook.com/wonderfashions',
      username: 'wonderfashions'
    },
    twitter: {
      enabled: true,
      url: 'https://twitter.com/wonderfashions',
      username: '@wonderfashions'
    },
    instagram: {
      enabled: true,
      url: 'https://instagram.com/wonderfashions',
      username: '@wonderfashions'
    },
    youtube: {
      enabled: true,
      url: 'https://youtube.com/@wonderfashions',
      username: 'Wonder Fashions'
    },
    tiktok: {
      enabled: false,
      url: '',
      username: ''
    },
    pinterest: {
      enabled: false,
      url: '',
      username: ''
    },
    linkedin: {
      enabled: false,
      url: '',
      username: ''
    }
  },

  // Shipping Settings
  shipping: {
    freeShippingThreshold: 100,
    standardShippingCost: 4.99,
    expressShippingCost: 9.99
  },

  // Tax Settings
  tax: {
    rate: 0.20, // 20% VAT
    name: 'VAT'
  }
};

export const socialMediaPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    placeholder: 'https://facebook.com/yourpage',
    icon: 'Facebook'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    placeholder: 'https://twitter.com/yourhandle',
    icon: 'Twitter'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    placeholder: 'https://instagram.com/yourhandle',
    icon: 'Instagram'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    placeholder: 'https://youtube.com/@yourchannel',
    icon: 'Youtube'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    placeholder: 'https://tiktok.com/@yourhandle',
    icon: 'Music'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    placeholder: 'https://pinterest.com/yourprofile',
    icon: 'Image'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    placeholder: 'https://linkedin.com/company/yourcompany',
    icon: 'Linkedin'
  }
];