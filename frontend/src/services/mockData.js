// Realistic mock database for Produce Marketplace Landing Page

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Fresh Vegetables', icon: '🥦', count: 142, slug: 'vegetables', description: 'Crisp, handpicked organic greens & root vegetables' },
  { id: 'cat-2', name: 'Organic Fruits', icon: '🍎', count: 98, slug: 'fruits', description: 'Sun-ripened berries, apples, citrus & seasonal fruits' },
  { id: 'cat-3', name: 'Farm Fresh Eggs & Dairy', icon: '🥚', count: 34, slug: 'dairy', description: 'Pasture-raised eggs, artisanal butter & raw milk' },
  { id: 'cat-4', name: 'Artisanal Honey & Oils', icon: '🍯', count: 26, slug: 'honey', description: 'Raw wildflower honey & cold-pressed virgin oils' },
  { id: 'cat-5', name: 'Fresh Herbs & Microgreens', icon: '🌿', count: 52, slug: 'herbs', description: 'Aromatic culinary herbs & nutrient-packed microgreens' },
  { id: 'cat-6', name: 'Root Vegetables', icon: '🥕', count: 45, slug: 'roots', description: 'Organic carrots, potatoes, radishes & heirloom beets' }
];

export const MOCK_PRODUCE = [
  {
    id: 'prod-1',
    title: 'Heirloom Organic Honeycrisp Apples',
    category: 'fruits',
    price: 4.99,
    unit: 'lb',
    farm: 'SunValley Orchards',
    farmLocation: 'Sonoma, CA',
    rating: 4.9,
    reviewsCount: 128,
    isOrganic: true,
    isLocal: true,
    badge: 'Best Seller',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-2',
    title: 'Farm Fresh Organic Baby Spinach',
    category: 'vegetables',
    price: 3.49,
    unit: 'bunch',
    farm: 'Green Acre Organics',
    farmLocation: 'Petaluma, CA',
    rating: 4.8,
    reviewsCount: 94,
    isOrganic: true,
    isLocal: true,
    badge: 'Harvested Today',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-3',
    title: 'Wildflower Pure Raw Honey',
    category: 'honey',
    price: 12.99,
    unit: '16 oz jar',
    farm: 'Golden Bee Apiaries',
    farmLocation: 'Napa Valley, CA',
    rating: 5.0,
    reviewsCount: 210,
    isOrganic: true,
    isLocal: true,
    badge: 'Artisanal',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-4',
    title: 'Pasture-Raised Organic Brown Eggs',
    category: 'dairy',
    price: 6.75,
    unit: 'dozen',
    farm: 'Willow Creek Farm',
    farmLocation: 'Santa Rosa, CA',
    rating: 4.9,
    reviewsCount: 312,
    isOrganic: true,
    isLocal: true,
    badge: 'Non-GMO',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-5',
    title: 'Rainbow heirloom Organic Carrots',
    category: 'roots',
    price: 3.99,
    unit: 'bunch',
    farm: 'Terra Verde Micro-Farm',
    farmLocation: 'Sebastopol, CA',
    rating: 4.7,
    reviewsCount: 76,
    isOrganic: true,
    isLocal: true,
    badge: 'Fresh Crop',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1598170845058-12ef4a45753b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-6',
    title: 'Organic Sweet Italian Basil',
    category: 'herbs',
    price: 2.99,
    unit: '4 oz pack',
    farm: 'Verdant Harvest Hydroponics',
    farmLocation: 'Oakland, CA',
    rating: 4.8,
    reviewsCount: 54,
    isOrganic: true,
    isLocal: true,
    badge: 'Aromatic',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_FARMERS = [
  {
    id: 'farmer-1',
    name: 'Elena & Marcus Vance',
    farmName: 'SunValley Organics',
    location: 'Sonoma County, CA',
    specialty: 'Heirloom Fruits & Berries',
    experience: '18 Years Regenerative Farming',
    rating: 4.95,
    salesCount: '12.4k+ Orders',
    avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    badge: 'Certified Organic Master'
  },
  {
    id: 'farmer-2',
    name: 'David Thorne',
    farmName: 'Thorne Family Apiaries',
    location: 'Napa Valley, CA',
    specialty: 'Raw Honey & Bee Products',
    experience: '3rd Generation Beekeeper',
    rating: 4.98,
    salesCount: '8.9k+ Orders',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    badge: 'Artisanal Bee Master'
  },
  {
    id: 'farmer-3',
    name: 'Sarah & Tom Lin',
    farmName: 'Green Acre Micro-Farm',
    location: 'Petaluma, CA',
    specialty: 'Microgreens & Hydroponic Herbs',
    experience: '10 Years Zero-Pesticide Growth',
    rating: 4.91,
    salesCount: '15.1k+ Orders',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
    badge: 'Zero Carbon Footprint'
  }
];

export const MOCK_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Chef Jacqueline Laurent',
    role: 'Executive Chef, Le Jardin',
    comment: 'The produce quality from AgriHarvest is unmatched. Tomatoes and herbs picked at 6 AM arrive in our kitchen by noon. Our restaurant patrons taste the direct farm difference!',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Robert Sterling',
    role: 'Conscious Consumer',
    comment: 'Knowing exactly which local farmer grew my apples and brown eggs gives my family peace of mind. Transparent, zero hassle, and ultra-fresh delivery every single week.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Maria Santos',
    role: 'Nutritionist & Mother',
    comment: 'I recommend AgriHarvest to all my clients. Organic microgreens, raw honey, and pasture eggs delivered straight from local growers with full farm traceability.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5
  }
];

export const MOCK_STATS = [
  { label: 'Local Independent Farmers', value: '450+' },
  { label: '100% Traceable Harvests', value: '25,000+' },
  { label: 'Pounds of Organic Produce', value: '1.2M' },
  { label: 'Customer Satisfaction Rate', value: '99.4%' }
];

export const MOCK_WHY_CHOOSE = [
  {
    title: 'Same-Day Field Picked',
    description: 'Harvested at dawn by local growers and delivered directly to your doorstep in eco-friendly climate-controlled transport.',
    icon: '🚜'
  },
  {
    title: '100% Farm Traceable',
    description: 'Every apple, honey jar, and egg container includes farmer profiles, harvest dates, and pesticide-free certification.',
    icon: '🔍'
  },
  {
    title: 'Fair Pricing for Farmers',
    description: 'By cutting out supermarket middlemen, 85% of every dollar goes directly back into empowering local agricultural families.',
    icon: '💚'
  },
  {
    title: 'Zero Plastic Packaging',
    description: 'We pack all produce in 100% biodegradable, compostable sugarcane totes and recycled paper cartons.',
    icon: '🌱'
  }
];
