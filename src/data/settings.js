export const initialSettings = {
  // Branding
  branding: {
    logo: null,
    fallbackText: 'Wonder',
    subText: 'Fashions',
    favicon: null
  },

  // Splash Screen
  splashScreen: {
    enabled: true,
    duration: 3000,
    backgroundColor: '#771d1d',
    showTagline: true,
    tagline: 'Posh but Affordable'
  },

  // Header Logic
  header: {
    announcement: 'Direct from Manufacturer - No Middle Man | Posh but Affordable',
    showAnnouncement: true,
    sticky: true
  },

  // Footer Logic
  footer: {
    aboutText: 'Wonder Fashions brings you exquisite traditional wear directly from manufacturers. We offer posh styles at affordable prices.',
    copyrightText: '© 2024 Wonder Fashions. All Rights Reserved.',
    showNewsletter: true,
    columns: [
      {
        title: "Shop Women",
        links: [
          { "label": "Sarees Collection", "url": "/shop?category=sarees" },
          { "label": "Lehengas", "url": "/shop?category=lehenga" }
        ]
      },
      {
        title: "Support",
        links: [
          { "label": "Order Tracking", "url": "/order-history" },
          { "label": "Privacy Policy", "url": "/privacy-policy" }
        ]
      }
    ]
  },

  // Regional Config
  countries: {
    india: {
      enabled: true,
      name: 'India',
      flag: '🇮🇳',
      currency: { code: 'INR', symbol: '₹' },
      shipping: { freeShippingThreshold: 1999, standardShippingCost: 99 },
      storeInfo: { storeEmail: 'india@wonderfashions.com', storePhone: '+91 9876543210', storeAddress: { street: 'Main Rd', city: 'Mumbai' } }
    },
    uk: {
      enabled: true,
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: { code: 'GBP', symbol: '£' },
      shipping: { freeShippingThreshold: 100, standardShippingCost: 4.99 },
      storeInfo: { storeEmail: 'uk@wonderfashions.com', storePhone: '+44 20 1234 5678', storeAddress: { street: 'High St', city: 'London' } }
    }
  },

  // Content Lists
  socialMediaList: [
    { id: '1', platform: 'instagram', url: 'https://instagram.com', enabled: true },
    { id: '2', platform: 'facebook', url: 'https://facebook.com', enabled: true }
  ],
  
  categories: [
    { 
      id: 'women', name: 'Women', slug: 'women', enabled: true, order: 1,
      subcategories: [
        { id: 'sarees', name: 'Sarees', slug: 'sarees' },
        { id: 'lehenga', name: 'Lehenga', slug: 'lehenga' },
        { id: 'kurtis', name: 'Kurtis & Gowns', slug: 'kurtis' }
      ]
    },
    { 
      id: 'jewelry', name: 'Jewelry', slug: 'jewelry', enabled: true, order: 2,
      subcategories: [
        { id: 'bangles', name: 'Bangles', slug: 'bangles' },
        { id: 'necklaces', name: 'Necklace Sets', slug: 'necklaces' }
      ]
    }
  ],

  policies: {
    privacy: "# Privacy Policy\nYour data is safe...",
    terms: "# Terms & Conditions\n28 days refund guarantee..."
  },

  products: { india: [], uk: [] },
  
  homeDesign: {
    india: { heroSlides: [], sections: [], features: [] },
    uk: { heroSlides: [], sections: [], features: [] }
  }
};

// Required for Admin Selectors
export const socialMediaPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: 'Facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'Instagram' },
  { id: 'twitter', name: 'Twitter', icon: 'Twitter' },
  { id: 'youtube', name: 'Youtube', icon: 'Youtube' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle' }
];

export const sectionTypes = [
  { id: 'categories', type: 'categories', name: 'Categories Grid' },
  { id: 'featuredProducts', type: 'featuredProducts', name: 'Featured Products' },
  { id: 'promoBanner', type: 'promoBanner', name: 'Promo Banner' }
];

// THE MISSING EXPORT THAT CAUSED THE ERROR
export const featureIcons = [
  { id: 'Truck', name: 'Shipping' },
  { id: 'RotateCcw', name: 'Returns' },
  { id: 'Shield', name: 'Security' },
  { id: 'Headphones', name: 'Support' },
  { id: 'Award', name: 'Quality' },
  { id: 'Factory', name: 'Manufacturer' }
];

export const defaultHeroSlide = {
  id: '',
  heading: 'New Collection',
  description: 'Exquisite traditional wear',
  buttonText: 'Shop Now',
  buttonLink: '/shop',
  image: '',
  enabled: true
};

export const defaultSection = {
  id: '',
  type: 'featuredProducts',
  title: 'Collection Title',
  subtitle: 'Handpicked for you',
  enabled: true,
  backgroundColor: '#771d1d'
};

export const generateId = () => Math.random().toString(36).substr(2, 9);