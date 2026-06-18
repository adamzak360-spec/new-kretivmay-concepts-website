export const SHOP_CATEGORIES = [
  { id: 1, name: "Groceries", slug: "groceries", icon: "🛒", description: "Daily essentials and pantry staples." },
  { id: 2, name: "Fresh Produce", slug: "fresh-produce", icon: "🍎", description: "Fresh fruits and vegetables from local farms." },
  { id: 3, name: "Beverages", slug: "beverages", icon: "🥤", description: "Soft drinks, juices, and bottled water." },
  { id: 4, name: "Household Essentials", slug: "household", icon: "🧹", description: "Cleaning supplies and home care products." },
  { id: 5, name: "Electronics", slug: "electronics", icon: "📱", description: "Gadgets, appliances, and accessories." },
  { id: 6, name: "Fashion", slug: "fashion", icon: "👕", description: "Trendy apparel and accessories for all." },
  { id: 7, name: "Beauty & Personal Care", slug: "beauty", icon: "💄", description: "Skincare, hair care, and cosmetics." },
  { id: 8, name: "Baby Products", slug: "baby", icon: "👶", description: "Everything for your little ones." },
  { id: 9, name: "Stationery", slug: "stationery", icon: "✏️", description: "Office and school supplies." },
  { id: 10, name: "Snacks", slug: "snacks", icon: "🍿", description: "Quick bites and delicious treats." },
  { id: 11, name: "Frozen Foods", slug: "frozen", icon: "❄️", description: "Ready-to-cook and frozen meals." },
  { id: 12, name: "Kitchen Essentials", slug: "kitchen", icon: "🍳", description: "Cookware and kitchen gadgets." }
];

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    slug: "premium-rice-5kg",
    title: "Premium Long Grain Rice (5kg)",
    description: "High-quality long grain rice, perfect for all your meals.",
    fullDescription: "Our premium long grain rice is carefully selected for its superior quality and taste. It's easy to cook and perfect for jollof, fried rice, or plain white rice. Packaged in a 5kg bag for your convenience.",
    price: "GH₵ 120.00",
    category: "groceries",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Weight: 5kg", "Type: Long Grain", "Origin: Local"]
  },
  {
    id: 2,
    slug: "cooking-oil-3l",
    title: "Refined Cooking Oil (3L)",
    description: "Pure and healthy vegetable oil for all your cooking needs.",
    fullDescription: "This refined vegetable oil is cholesterol-free and perfect for frying, baking, and cooking. It comes in a 3L bottle, providing great value for your kitchen.",
    price: "GH₵ 85.00",
    category: "groceries",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacabc8805?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Volume: 3L", "Type: Vegetable Oil", "Cholesterol Free"]
  },
  {
    id: 3,
    slug: "soft-drinks-pack",
    title: "Assorted Soft Drinks (Pack of 6)",
    description: "Refreshing pack of your favorite soft drinks.",
    fullDescription: "A convenient pack of 6 assorted soft drinks. Perfect for parties, gatherings, or just keeping your fridge stocked with refreshing beverages.",
    price: "GH₵ 45.00",
    category: "beverages",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Quantity: 6 cans", "Size: 330ml each", "Assorted Flavors"]
  },
  {
    id: 4,
    slug: "bottled-water-case",
    title: "Pure Bottled Water (Case of 12)",
    description: "Clean and refreshing bottled water for daily hydration.",
    fullDescription: "Stay hydrated with our pure bottled water. This case contains 12 bottles of 500ml each, perfect for on-the-go or home use.",
    price: "GH₵ 30.00",
    category: "beverages",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Quantity: 12 bottles", "Size: 500ml each", "Mineral Water"]
  },
  {
    id: 5,
    slug: "fresh-milk-1l",
    title: "Full Cream Fresh Milk (1L)",
    description: "Nutritious and delicious full cream milk.",
    fullDescription: "Enjoy the rich taste of our full cream fresh milk. Packed with essential nutrients, it's perfect for cereal, coffee, or drinking straight.",
    price: "GH₵ 15.00",
    category: "groceries",
    imageUrl: "https://images.unsplash.com/photo-1550583724-125581fe2f8a?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Volume: 1L", "Type: Full Cream", "Pasteurized"]
  },
  {
    id: 6,
    slug: "whole-wheat-bread",
    title: "Whole Wheat Sliced Bread",
    description: "Freshly baked healthy whole wheat bread.",
    fullDescription: "Our whole wheat bread is baked fresh daily. It's high in fiber and perfect for sandwiches or toast.",
    price: "GH₵ 12.00",
    category: "groceries",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Type: Whole Wheat", "Weight: 600g", "Sliced"]
  },
  {
    id: 7,
    slug: "laundry-detergent-2kg",
    title: "Powerful Laundry Detergent (2kg)",
    description: "Tough on stains, gentle on fabrics.",
    fullDescription: "This 2kg pack of laundry detergent is designed to remove even the toughest stains while keeping your clothes looking new and smelling fresh.",
    price: "GH₵ 55.00",
    category: "household",
    imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Weight: 2kg", "Type: Powder", "High Efficiency"]
  },
  {
    id: 8,
    slug: "smart-television-43",
    title: "43-inch Smart LED TV",
    description: "Crystal clear display with smart features.",
    fullDescription: "Upgrade your entertainment with this 43-inch Smart LED TV. Features 4K resolution, built-in apps, and multiple HDMI ports.",
    price: "GH₵ 2,800.00",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    stockStatus: "Limited Stock",
    specifications: ["Size: 43-inch", "Resolution: 4K UHD", "Smart TV: Yes"]
  },
  {
    id: 9,
    slug: "electric-blender",
    title: "High-Speed Electric Blender",
    description: "Perfect for smoothies, soups, and more.",
    fullDescription: "This powerful blender features stainless steel blades and multiple speed settings, making it easy to blend even the toughest ingredients.",
    price: "GH₵ 350.00",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1585238341267-1cfec2046a55?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Power: 1000W", "Capacity: 1.5L", "Blades: Stainless Steel"]
  },
  {
    id: 10,
    slug: "usb-c-charging-cable",
    title: "Durable USB-C Charging Cable",
    description: "Fast charging and data sync cable.",
    fullDescription: "A high-quality, braided USB-C cable that supports fast charging and high-speed data transfer. Built to last.",
    price: "GH₵ 45.00",
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Length: 2m", "Type: USB-C to USB-A", "Material: Braided Nylon"]
  },
  {
    id: 11,
    slug: "classic-white-tshirt",
    title: "Classic Cotton White T-Shirt",
    description: "Comfortable and stylish 100% cotton tee.",
    fullDescription: "A wardrobe essential, this white t-shirt is made from soft, breathable cotton. Perfect for layering or wearing on its own.",
    price: "GH₵ 65.00",
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Material: 100% Cotton", "Size: S, M, L, XL", "Color: White"]
  },
  {
    id: 12,
    slug: "casual-sneakers",
    title: "Men's Casual Sneakers",
    description: "Versatile and comfortable sneakers for everyday wear.",
    fullDescription: "These stylish sneakers feature a cushioned sole and breathable upper, making them perfect for all-day comfort and style.",
    price: "GH₵ 250.00",
    category: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    stockStatus: "In Stock",
    specifications: ["Size: 40-45", "Material: Synthetic/Mesh", "Color: Red/White"]
  }
];

// Keep these for backward compatibility if needed, but they should be phased out
export const FALLBACK_SERVICES = FALLBACK_PRODUCTS.map(p => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  description: p.description,
  fullDescription: p.fullDescription,
  bannerImageUrl: p.imageUrl,
  bannerImageKey: `fallback-product-${p.id}`,
  icon: "",
  order: p.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  price: p.price,
  category: p.category
}));

export const FALLBACK_FEATURED_WORKS = SHOP_CATEGORIES.map(c => ({
  id: c.id,
  title: c.name,
  description: c.description,
  category: c.slug,
  imageUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80`, // Placeholder for categories
  imageKey: `category-${c.slug}`,
  featured: true,
  order: c.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  icon: c.icon
}));

export const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    clientName: "Amina Mensah",
    clientCompany: "Local Resident",
    content: "Blue Water Shopping Village is my go-to for all my groceries. The products are always fresh and the staff is so friendly!",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    imageKey: "fallback-testimonial-1",
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    clientName: "Kwame Appiah",
    clientCompany: "Restaurant Owner",
    content: "I buy all my kitchen essentials and bulk groceries here. The prices are competitive and the quality is top-notch.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    imageKey: "fallback-testimonial-2",
    featured: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    clientName: "Fatima Yusuf",
    clientCompany: "Fashion Enthusiast",
    content: "I was surprised to find such trendy fashion items at Blue Water. Their electronics section is also great!",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    imageKey: "fallback-testimonial-3",
    featured: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
