// OTTMoneySaver Central Data Store & Products Schema

export const PRIMARY_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Sparkles' },
  { id: 'fiber', name: 'Internet Fiber', icon: 'Wifi', group: 'Internet Fiber' },
  { id: 'ott', name: 'OTT Platforms', icon: 'Tv', group: 'OTT Platforms' },
  { id: 'mobiles', name: 'Mobile / Gadgets', icon: 'Smartphone', group: 'Mobile / Gadgets' },
  { id: 'other', name: 'Other Products', icon: 'Laptop', group: 'Other Products' }
];

export const FEATURED_DEALS = [
  {
    id: 'boat-550',
    title: 'boAt Rockerz 550 Bluetooth Headphones',
    subtitle: 'Over-Ear Wireless Headphone with 20H Playback',
    rating: 4.5,
    reviewsCount: 1256,
    price: 1499,
    originalPrice: 2999,
    discount: '50% OFF',
    category: 'Headphones',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Hot Deal',
    description: 'Immersion redefined. Up to 20H playback, 50mm dynamic drivers, physical noise isolation, plush earcushions and dual mode Bluetooth 5.0 + AUX support.'
  },
  {
    id: 'realme-narzo-70',
    title: 'Realme Narzo 70 Pro 5G',
    subtitle: '8GB RAM | 128GB Storage | Glass Green',
    rating: 4.6,
    reviewsCount: 982,
    price: 16999,
    originalPrice: 21999,
    discount: '23% OFF',
    category: 'Smartphones',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Best Seller',
    description: 'Flagship Sony IMX890 OIS camera, Dimensity 7050 5G processor, 67W SUPERVOOC charging, 120Hz Horizon OLED display, and Air Gesture controls.'
  },
  {
    id: 'jbl-flip-6',
    title: 'JBL Flip 6 Portable Bluetooth Speaker',
    subtitle: 'IP67 Waterproof | 12 Hours Playtime',
    rating: 4.7,
    reviewsCount: 1102,
    price: 7999,
    originalPrice: 12999,
    discount: '38% OFF',
    category: 'Bluetooth Speakers',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Popular',
    description: 'Louder, more powerful 2-way speaker system. Race-track shaped woofer, separate tweeter, and dual passive radiators tuned by JBL Original Pro Sound.'
  },
  {
    id: 'netflix-prem-4k',
    title: 'Netflix Premium 4K UHD Subscription',
    subtitle: '1 Month Full UHD Pack (4 Screens)',
    rating: 4.9,
    reviewsCount: 3420,
    price: 199,
    originalPrice: 649,
    discount: '70% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Top OTT Deal',
    description: 'Watch all global movies, web series, and anime in Ultra HD (4K) + HDR. Simultaneous streaming supported on 4 screens (TV, Phone, Laptop, Tablet).'
  },
  {
    id: 'fiber-200mbps-combo',
    title: '200 Mbps Unlimited Fiber + 12 OTT Combo',
    subtitle: 'All-in-One Home Entertainment Broadband',
    rating: 4.9,
    reviewsCount: 4120,
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    category: 'Fiber Internet',
    categoryGroup: 'Internet Fiber',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Best Value',
    description: 'Symmetric 200 Mbps speeds (equal upload & download), zero lag gaming, free dual-band Wi-Fi router + free installation and 12 premium OTT app subscriptions.'
  }
];

export const ALL_PRODUCTS = [
  ...FEATURED_DEALS,

  // --- OTT PLATFORMS ---
  {
    id: 'hotstar-super-1y',
    title: 'Disney+ Hotstar Super Plan (1 Year)',
    subtitle: 'Live Cricket, Sports & Hotstar Specials',
    rating: 4.8,
    reviewsCount: 2890,
    price: 499,
    originalPrice: 899,
    discount: '45% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Live Sports Pass',
    description: 'Enjoy 1 year access to IPL, World Cup cricket, Premier League, Marvel Movies, Disney Animation & HBO Specials in Full HD.'
  },
  {
    id: 'prime-video-1y',
    title: 'Amazon Prime Video Premium (1 Year)',
    subtitle: '4K Video + Free Express Delivery',
    rating: 4.9,
    reviewsCount: 4120,
    price: 599,
    originalPrice: 1499,
    discount: '60% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Free Shipping Incl.',
    description: '1 Year Prime Video membership + Amazon Prime Music ad-free audio + Free express delivery on Amazon purchases.'
  },
  {
    id: 'zee5-premium-1y',
    title: 'ZEE5 Premium All-Access (1 Year)',
    subtitle: '2800+ Movies & 150+ Web Series',
    rating: 4.7,
    reviewsCount: 1540,
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Regional Blockbusters',
    description: 'Watch latest blockbuster movies and web series in 12 regional languages with ad-free 4K streaming.'
  },
  {
    id: 'sony-liv-1y',
    title: 'Sony LIV Premium HD Pass (1 Year)',
    subtitle: 'Champions League, WWE & Sony Originals',
    rating: 4.8,
    reviewsCount: 1980,
    price: 449,
    originalPrice: 999,
    discount: '55% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Live Sports',
    description: 'Full HD sports streaming for UEFA Champions League, UEFA Euro, WWE Raw/Smackdown & Sony Original Web Series.'
  },
  {
    id: 'mega-ott-combo-12in1',
    title: '12-in-1 Mega OTT Combo Bundle',
    subtitle: '1 Year Access to Netflix, Prime, Hotstar & 9 More',
    rating: 5.0,
    reviewsCount: 5210,
    price: 999,
    originalPrice: 3999,
    discount: '75% OFF',
    category: 'OTT Platforms',
    categoryGroup: 'OTT Platforms',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Ultimate Pack',
    description: 'Single unified dashboard login to access Netflix, Prime Video, Hotstar, ZEE5, SonyLIV, Aha, Voot, Lionsgate Play & SunNXT.'
  },

  // --- INTERNET FIBER ---
  {
    id: 'fiber-100mbps',
    title: '100 Mbps Unlimited Fiber Broadband',
    subtitle: 'Symmetric Speeds + Free Gigabit Router',
    rating: 4.7,
    reviewsCount: 1840,
    price: 499,
    originalPrice: 799,
    discount: '38% OFF',
    category: 'Fiber Internet',
    categoryGroup: 'Internet Fiber',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Free Setup',
    description: 'Symmetric 100 Mbps upload & download speeds, truly unlimited data with zero FUP limit, and free dual-band Wi-Fi router.'
  },
  {
    id: 'fiber-300mbps-ultra',
    title: '300 Mbps Ultra Fiber Pack',
    subtitle: 'Heavy 4K Family Streaming & Pro Gaming',
    rating: 4.9,
    reviewsCount: 2150,
    price: 1199,
    originalPrice: 1999,
    discount: '40% OFF',
    category: 'Fiber Internet',
    categoryGroup: 'Internet Fiber',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Wi-Fi 6 Ready',
    description: '300 Mbps ultra high speed connection with low-ping fiber routing, bundled 16 OTT apps including Netflix 4K UHD.'
  },
  {
    id: 'fiber-1gbps-gigabit',
    title: '1 Gbps Ultra Gigabit Fiber Connection',
    subtitle: 'Creator Studio & Smart Home Master Connection',
    rating: 5.0,
    reviewsCount: 890,
    price: 2499,
    originalPrice: 3999,
    discount: '38% OFF',
    category: 'Fiber Internet',
    categoryGroup: 'Internet Fiber',
    inStock: false, // Demonstrated Out of Stock item
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Gigabit Speed',
    description: '1000 Mbps Fiber connection with dedicated Static IP, Dual Mesh router system, and 99.99% uptime SLA.'
  },

  // --- MOBILE & GADGETS ---
  {
    id: 'earbuds-oneplus',
    title: 'OnePlus Nord Buds 2 Wireless Earbuds',
    subtitle: '25dB ANC | 12.4mm Dynamic Drivers',
    rating: 4.5,
    reviewsCount: 890,
    price: 2199,
    originalPrice: 3299,
    discount: '33% OFF',
    category: 'Earbuds',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    badge: '25dB ANC',
    description: 'Active Noise Cancellation up to 25dB, Dual-mic AI call noise cancellation, BassWave enhancement, and 36 hours total battery life.'
  },
  {
    id: 'fireboltt-ninja-3',
    title: 'Fire-Boltt Ninja 3 Smart Watch',
    subtitle: '1.69" HD Display | 60+ Sports Modes',
    rating: 4.4,
    reviewsCount: 763,
    price: 1299,
    originalPrice: 3499,
    discount: '63% OFF',
    category: 'Smart Watches',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    badge: '63% OFF',
    description: '1.69" HD full touch display, 60+ sports tracking modes, SpO2 blood oxygen sensor, 24/7 heart rate monitor, IP68 water resistance.'
  },
  {
    id: 'mi-33w-charger',
    title: 'Mi 33W SonicCharge 2.0 Fast Charger',
    subtitle: 'Type C Cable Included | Quick Charge 3.0',
    rating: 4.3,
    reviewsCount: 512,
    price: 499,
    originalPrice: 999,
    discount: '50% OFF',
    category: 'Chargers',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Essential',
    description: 'Qualcomm Quick Charge 3.0 certified 33W fast wall adapter with 380V surge protection and 100cm Type-C cable.'
  },
  {
    id: 'anker-powerbank-10k',
    title: 'Anker PowerCore 10000mAh Power Bank',
    subtitle: '20W PD Fast Charging | Ultra Slim Design',
    rating: 4.6,
    reviewsCount: 670,
    price: 1299,
    originalPrice: 2499,
    discount: '48% OFF',
    category: 'Power Banks',
    categoryGroup: 'Mobile / Gadgets',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1609592424089-98048f07a049?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592424089-98048f07a049?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Fast Charge',
    description: 'Charge iPhone 15 up to 50% in just 30 minutes with 20W Power Delivery USB-C output and PowerIQ protection.'
  },
  {
    id: 'samsung-galaxy-s23-fe',
    title: 'Samsung Galaxy S23 FE 5G',
    subtitle: '8GB RAM | 128GB | Graphite',
    rating: 4.8,
    reviewsCount: 1420,
    price: 49999,
    originalPrice: 59999,
    discount: '17% OFF',
    category: 'Smartphones',
    categoryGroup: 'Mobile / Gadgets',
    inStock: false, // Out of stock example
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Out of Stock',
    description: 'Flagship 50MP pro-grade camera, Exynos 2200 4nm processor, 120Hz Dynamic AMOLED 2X display, IP68 water resistance.'
  },

  // --- OTHER PRODUCTS ---
  {
    id: 'xiaomi-tv-55-4k',
    title: 'Xiaomi 55" 4K Ultra HD Smart TV',
    subtitle: 'Dolby Vision & Atmos | Android TV 11',
    rating: 4.8,
    reviewsCount: 1450,
    price: 32999,
    originalPrice: 49999,
    discount: '34% OFF',
    category: 'Smart TVs',
    categoryGroup: 'Other Products',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&auto=format&fit=crop&q=80'
    ],
    badge: '4K Smart TV',
    description: '4K HDR10+ bezel-less display, 30W Dolby Audio stereo speakers, PatchWall 4 content recommendation engine, Dual-band Wi-Fi & Bluetooth 5.0.'
  },
  {
    id: 'macbook-air-m2',
    title: 'Apple MacBook Air M2',
    subtitle: '8GB RAM | 256GB SSD | Starlight',
    rating: 4.9,
    reviewsCount: 3120,
    price: 89900,
    originalPrice: 99900,
    discount: '10% OFF',
    category: 'Laptops',
    categoryGroup: 'Other Products',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Apple M2 Chip',
    description: 'Supercharged by Apple M2 chip. 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3 charging, up to 18 hours battery life.'
  },
  {
    id: 'asus-vivobook-15',
    title: 'ASUS Vivobook 15 Intel i5',
    subtitle: '16GB RAM | 512GB SSD | Quiet Blue',
    rating: 4.6,
    reviewsCount: 940,
    price: 44990,
    originalPrice: 62990,
    discount: '28% OFF',
    category: 'Laptops',
    categoryGroup: 'Other Products',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    ],
    badge: '12th Gen i5',
    description: '15.6" FHD Anti-glare display, 12th Gen Intel Core i5 processor, ErgoSense keyboard, fingerprint scanner, and fast charging.'
  }
];

export const QUICK_CATEGORIES = [
  {
    id: 'ott',
    name: 'OTT Platforms',
    actionText: 'View Plans →',
    iconName: 'Tv',
    color: 'from-red-500/10 to-orange-500/10 border-red-200'
  },
  {
    id: 'fiber',
    name: 'Internet Fiber',
    actionText: 'View Plans →',
    iconName: 'Wifi',
    color: 'from-blue-500/10 to-cyan-500/10 border-blue-200'
  },
  {
    id: 'mobiles',
    name: 'Mobile / Gadgets',
    actionText: 'Shop Now →',
    iconName: 'Smartphone',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200'
  },
  {
    id: 'other',
    name: 'Other Products',
    actionText: 'Explore All →',
    iconName: 'Laptop',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-200'
  }
];

export const SHOP_BY_CATEGORIES = [
  { name: 'Smartphones', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80' },
  { name: 'Smart Watches', icon: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' },
  { name: 'Earbuds', icon: 'Radio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80' },
  { name: 'Bluetooth Speakers', icon: 'Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&auto=format&fit=crop&q=80' },
  { name: 'Headphones', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80' },
  { name: 'Power Banks', icon: 'BatteryCharging', image: 'https://images.unsplash.com/photo-1609592424089-98048f07a049?w=300&auto=format&fit=crop&q=80' },
  { name: 'Chargers', icon: 'Zap', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80' },
  { name: 'Smart TVs', icon: 'Tv', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&auto=format&fit=crop&q=80' },
  { name: 'Laptops', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80' }
];

export const VALUE_PROPOSITIONS = [
  {
    id: 1,
    title: '5+ Years of Experience',
    description: 'Serving customers with smart-value products and services.',
    iconName: 'Award',
    badgeColor: 'bg-amber-100 text-amber-600 border-amber-200'
  },
  {
    id: 2,
    title: 'Smart Savings',
    description: 'Get better deals without compromising on quality.',
    iconName: 'Percent',
    badgeColor: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 3,
    title: 'Wide Selection',
    description: '100–300+ products across multiple categories.',
    iconName: 'Box',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 4,
    title: 'Service You Can Trust',
    description: '"We compromise on Money but not in Service."',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-blue-100 text-blue-600 border-blue-200'
  }
];
