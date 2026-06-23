import { MenuItem } from '@/hooks/types';

export const BURGER_MENU_ITEMS: MenuItem[] = [
  {
    id: 'burger-1',
    name: 'Tandoori Paneer Grill Burger',
    desc: 'Marinated paneer steak grilled to perfection, topped with smoky tandoori mayo, crisp lettuce, red onions, and double cheddar cheese.',
    category: 'Burgers',
    price: '₹189',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Single Cheese', price: '₹189' },
      { label: 'Double Cheese Extra Patty', price: '₹249' }
    ]
  },
  {
    id: 'burger-2',
    name: 'The Classic Veg Bro Burger',
    desc: 'Crispy seasoned potato and green peas patty, signature house burger sauce, onions, tomatoes, and melting cheddar cheese on a toasted bun.',
    category: 'Burgers',
    price: '₹129',
    badge: 'Classic',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Standard', price: '₹129' },
      { label: 'Double Cheese', price: '₹159' }
    ]
  },
  {
    id: 'burger-3',
    name: 'Spicy Jalapeno Crunch Burger',
    desc: 'Crispy sweet corn and cheese patty, loaded with spicy sliced jalapenos, fiery pepper relish, and liquid cheese sauce.',
    category: 'Burgers',
    price: '₹159',
    badge: 'Spicy',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Spicy Standard', price: '₹159' },
      { label: 'Extra Jalapeno Cheese', price: '₹189' }
    ]
  },
  {
    id: 'pizza-1',
    name: 'Paneer Tikka Butter Feast Pizza',
    desc: 'Hand-stretched thin crust pizza topped with clay-oven paneer tikka chunks, capsicum, red onions, mozzarella cheese, and coriander drizzle.',
    category: 'Pizzas',
    price: '₹329',
    badge: 'Chef Choice',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Personal (7")', price: '₹329' },
      { label: 'Medium (10")', price: '₹489' },
      { label: 'Large (12")', price: '₹629' }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Gourmet Garden Harvest Pizza',
    desc: 'Loaded with farm-fresh bell peppers, mushrooms, golden sweet corn, black olives, onions, and premium basil pesto drizzle over gooey mozzarella.',
    category: 'Pizzas',
    price: '₹289',
    badge: 'Fresh',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Personal (7")', price: '₹289' },
      { label: 'Medium (10")', price: '₹439' },
      { label: 'Large (12")', price: '₹579' }
    ]
  },
  {
    id: 'pizza-3',
    name: 'Double Cheesy Margherita Pizza',
    desc: 'Classic Italian style Neapolitan tomato sauce base, loaded with double portion of fresh mozzarella cheese, tomatoes, and extra virgin olive oil.',
    category: 'Pizzas',
    price: '₹249',
    badge: 'Cheese Burst',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Personal (7")', price: '₹249' },
      { label: 'Medium (10")', price: '₹399' },
      { label: 'Large (12")', price: '₹499' }
    ]
  },
  {
    id: 'sandwich-1',
    name: 'Classic Club Sandwich Deluxe',
    desc: 'Triple-decker bread stuffed with fresh shredded cabbage-carrot salad, sliced potatoes, tomatoes, cucumbers, premium mint mayo, and grilled cheese.',
    category: 'Sandwiches',
    price: '₹149',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Standard Grilled', price: '₹149' },
      { label: 'Extra Cheese Club', price: '₹179' }
    ]
  },
  {
    id: 'sandwich-2',
    name: 'Grilled Spinach & Mushroom Melt',
    desc: 'Garlicky buttered sautéed spinach and wild mushrooms pressed in sourdough bread with melted Gouda cheese.',
    category: 'Sandwiches',
    price: '₹169',
    badge: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1567234669013-216f4cf481de?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Grilled Sourdough', price: '₹169' },
      { label: 'Double Melt', price: '₹199' }
    ]
  },
  {
    id: 'noodle-1',
    name: 'Szechuan Street Style Noodles',
    desc: 'Wok-tossed fiery thin noodles combined with carrots, cabbage, capsicum, scallions, and home-brewed hot Szechuan red chili paste.',
    category: 'Noodles',
    price: '₹139',
    badge: 'Extra Spicy',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Single Serving', price: '₹139' },
      { label: 'Double Sharing Platter', price: '₹229' }
    ]
  },
  {
    id: 'noodle-2',
    name: 'Hakka Noodle Bowl',
    desc: 'Mild, flavorful traditional wok-tossed noodles with soy sauce, roasted garlic, sesame oil, and crunchy julienned garden vegetables.',
    category: 'Noodles',
    price: '₹129',
    badge: 'Kid Friendly',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Single Serving', price: '₹129' },
      { label: 'Double Sharing Platter', price: '₹209' }
    ]
  },
  {
    id: 'drink-1',
    name: 'Ocean Blue Lagoon Mocktail',
    desc: 'A gorgeous cooling mocktail featuring blue curacao syrup, sparkling club soda, fresh lime juice, sugar syrup, and crushed mint leaves.',
    category: 'Marine Drinks',
    price: '₹99',
    badge: 'Refreshing',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Glass (300ml)', price: '₹99' },
      { label: 'Pitcher (1 Litre)', price: '₹279' }
    ]
  },
  {
    id: 'drink-2',
    name: 'Sparkling Mint Mojito',
    desc: 'Classic thirst quencher of muddled fresh mint leaves, lime wedges, simple cane syrup, topped with ice cold soda and sparkling water.',
    category: 'Marine Drinks',
    price: '₹89',
    badge: 'Citrus Fresh',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Glass (300ml)', price: '₹89' },
      { label: 'Pitcher (1 Litre)', price: '₹249' }
    ]
  },
  {
    id: 'side-1',
    name: 'Loaded Cheesy Peri-Peri Fries',
    desc: 'Thick cut golden French fries tossed in spicy peri-peri spice blend, loaded with melting hot cheese sauce and chopped spring onions.',
    category: 'Marine Drinks',
    price: '₹119',
    badge: 'Crispy Side',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular Portion', price: '₹119' },
      { label: 'Monster Tub Sharing', price: '₹199' }
    ]
  }
];
