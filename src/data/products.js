// OTTMoneySaver Data Store & Products List

export const FEATURED_DEALS = [
  {
    id: 'boat-550',
    title: 'boAt Rockerz 550',
    subtitle: 'Bluetooth Headphone',
    rating: 4.5,
    reviewsCount: 1256,
    price: 1499,
    originalPrice: 2999,
    discount: '50% OFF',
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    badge: 'Hot Deal',
    description: 'Immersion redefined. Up to 20H playback, 50mm dynamic drivers, physical noise isolation.'
  },
  {
    id: 'realme-narzo-70',
    title: 'Realme Narzo 70 Pro 5G',
    subtitle: '(8GB | 128GB)',
    rating: 4.3,
    reviewsCount: 982,
    price: 16999,
    originalPrice: 21999,
    discount: '23% OFF',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    description: 'Flagship Sony IMX890 OIS camera, Dimensity 7050 5G chipset, 67W SUPERVOOC charging.'
  },
  {
    id: 'jbl-flip-6',
    title: 'JBL Flip 6',
    subtitle: 'Portable Bluetooth Speaker',
    rating: 4.6,
    reviewsCount: 1102,
    price: 7999,
    originalPrice: 12999,
    discount: '38% OFF',
    category: 'Bluetooth Speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    description: 'Louder, more powerful sound. IP67 waterproof and dustproof, 12 hours of playtime.'
  },
  {
    id: 'fireboltt-ninja-3',
    title: 'Fire-Boltt Ninja 3',
    subtitle: 'Smart Watch',
    rating: 4.4,
    reviewsCount: 763,
    price: 1299,
    originalPrice: 3499,
    discount: '63% OFF',
    category: 'Smart Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    badge: '63% OFF',
    description: '1.69" HD full touch display, 60+ sports modes, SpO2 & 24/7 heart rate tracking.'
  },
  {
    id: 'mi-33w-charger',
    title: 'Mi 33W Fast Charger',
    subtitle: '(Type C)',
    rating: 4.2,
    reviewsCount: 512,
    price: 499,
    originalPrice: 999,
    discount: '50% OFF',
    category: 'Chargers',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    badge: 'Essential',
    description: 'Qualcomm Quick Charge 3.0 compatible, 33W power output, multi-layer surge protection.'
  }
];

export const ALL_PRODUCTS = [
  ...FEATURED_DEALS,
  {
    id: 'netflix-prem',
    title: 'Netflix Premium 4K UHD',
    subtitle: '1 Month Subscription',
    rating: 4.9,
    reviewsCount: 3420,
    price: 199,
    originalPrice: 649,
    discount: '70% OFF',
    category: 'OTT Platforms',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    badge: 'Top OTT Deal',
    description: '4K Ultra HD streaming on 4 devices simultaneously with multi-audio support.'
  },
  {
    id: 'hotstar-super',
    title: 'Disney+ Hotstar Super',
    subtitle: '1 Year Subscription',
    rating: 4.8,
    reviewsCount: 2890,
    price: 499,
    originalPrice: 899,
    discount: '45% OFF',
    category: 'OTT Platforms',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    badge: 'Live Cricket',
    description: 'Watch all Live Sports, Movies, and Hotstar Specials in Full HD.'
  },
  {
    id: 'fiber-100mbps',
    title: 'High-Speed Fiber 100Mbps',
    subtitle: 'Unlimited Data + Voice',
    rating: 4.7,
    reviewsCount: 1840,
    price: 499,
    originalPrice: 799,
    discount: '38% OFF',
    category: 'Fiber Internet',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    badge: 'Free Router',
    description: 'Symmetric upload and download speeds with 99.9% uptime guaranteed.'
  },
  {
    id: 'combo-ott-fiber',
    title: 'OTT + 200 Mbps Fiber Combo',
    subtitle: 'All-in-One Entertainment Pack',
    rating: 4.9,
    reviewsCount: 4120,
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    category: 'Fiber Internet',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Value Pack',
    description: 'Includes 12 OTT apps (Netflix, Prime, Hotstar, ZEE5) + 200 Mbps Fiber.'
  },
  {
    id: 'earbuds-oneplus',
    title: 'OnePlus Nord Buds 2',
    subtitle: 'True Wireless Earbuds',
    rating: 4.5,
    reviewsCount: 890,
    price: 2199,
    originalPrice: 3299,
    discount: '33% OFF',
    category: 'Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    badge: '25dB ANC',
    description: 'Active Noise Cancellation, 12.4mm drivers, 36 hours total listening time.'
  },
  {
    id: 'powerbank-anker',
    title: 'Anker 10000mAh Power Bank',
    subtitle: 'Slim 20W Fast Charging',
    rating: 4.6,
    reviewsCount: 670,
    price: 1299,
    originalPrice: 2499,
    discount: '48% OFF',
    category: 'Power Banks',
    image: 'https://images.unsplash.com/photo-1609592424089-98048f07a049?w=600&auto=format&fit=crop&q=80',
    badge: 'Fast Charge',
    description: 'Charge iPhone 15 up to 50% in 30 mins. Ultra compact aircraft aluminum shell.'
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
    name: 'Fiber Internet',
    actionText: 'View Plans →',
    iconName: 'Wifi',
    color: 'from-blue-500/10 to-cyan-500/10 border-blue-200'
  },
  {
    id: 'mobiles',
    name: 'Mobiles & Smartphones',
    actionText: 'Shop Now →',
    iconName: 'Smartphone',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200'
  },
  {
    id: 'gadgets',
    name: 'Mobile Gadgets',
    actionText: 'Shop Now →',
    iconName: 'Headphones',
    color: 'from-purple-500/10 to-pink-500/10 border-purple-200'
  },
  {
    id: 'electronics',
    name: 'Electronics Devices',
    actionText: 'Shop Now →',
    iconName: 'Laptop',
    color: 'from-amber-500/10 to-yellow-500/10 border-amber-200'
  },
  {
    id: 'offers',
    name: "Today's Offers",
    actionText: 'View Deals →',
    iconName: 'Flame',
    color: 'from-rose-500/10 to-red-500/10 border-rose-200'
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
  { name: 'Laptops', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80' },
  { name: 'Accessories', icon: 'Tag', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80' }
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

export const OTT_PROVIDERS = [
  { name: 'Netflix', color: 'bg-red-600 text-white', textColor: 'text-red-500' },
  { name: 'Prime Video', color: 'bg-sky-600 text-white', textColor: 'text-sky-400' },
  { name: 'Disney+ Hotstar', color: 'bg-blue-800 text-white', textColor: 'text-blue-400' },
  { name: 'ZEE5', color: 'bg-purple-700 text-white', textColor: 'text-purple-400' },
  { name: 'Sony LIV', color: 'bg-amber-600 text-white', textColor: 'text-amber-500' },
  { name: 'Voot', color: 'bg-indigo-600 text-white', textColor: 'text-indigo-400' }
];
