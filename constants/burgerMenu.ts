import { MenuItem } from '@/hooks/types';

export const BURGER_MENU_ITEMS: MenuItem[] = [
  // ================= 1. COMBO MEALS =================
  {
    id: 'combo-1',
    name: 'Mega Pizza Feast Combo',
    desc: '1 Large Fries + 2 Delicious Pizzas + 2 Chilled Fruit Beers. Perfect celebration meal for two or three!',
    category: 'Combo Meals',
    price: '499',
    badge: 'Best Value',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'combo-2',
    name: 'Burger & Brews Combo',
    desc: '1 Crispy Fries + 2 The Burger Bro Burgers + 2 Chilled Fruit Beers.',
    category: 'Combo Meals',
    price: '399',
    badge: 'Popular Combo',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'combo-3',
    name: 'Sandwich Delight Combo',
    desc: '1 Crispy Fries + 1 Grilled Cheese Sandwich + 2 Refreshing Cold Drinks.',
    category: 'Combo Meals',
    price: '249',
    badge: 'Quick Bites',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80'
  },

  // ================= 2. BURGERS =================
  {
    id: 'burger-1',
    name: 'Aloo Tikki Burger',
    desc: 'Golden crisp spiced potato patty with sliced onions, crunchy cabbage, and signature house burger relish.',
    category: 'Burgers',
    price: '40',
    badge: 'Classic',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '40' },
      { label: 'With Cheese', price: '50' }
    ]
  },
  {
    id: 'burger-2',
    name: 'Oregano Burger',
    desc: 'Crispy herb-infused patty seasoned with fragrant Mediterranean oregano, cream mayo, and crispy lettuce.',
    category: 'Burgers',
    price: '50',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '50' },
      { label: 'With Cheese', price: '60' }
    ]
  },
  {
    id: 'burger-3',
    name: 'Special Paneer Burger',
    desc: 'Fresh marinated spiced paneer patty grilled golden, layered with creamy sauce and crisp veggies.',
    category: 'Burgers',
    price: '60',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '60' },
      { label: 'With Cheese', price: '70' }
    ]
  },
  {
    id: 'burger-4',
    name: 'The Burger Bro Spl. Burger',
    desc: 'Our signature house secret recipe patty loaded with extra house sauces, pickled relish, and premium toasted bun.',
    category: 'Burgers',
    price: '70',
    badge: "Chef's Spl",
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '70' },
      { label: 'With Cheese', price: '80' }
    ]
  },
  {
    id: 'burger-5',
    name: 'Jumbo Double Tikki Burger',
    desc: 'Double stacked golden crispy vegetable patties, double layers of onions, tomatoes, and generous burger dressing.',
    category: 'Burgers',
    price: '90',
    badge: 'Double Stacked',
    image: '/jumbo_double_tikki.jpg',
    variantOptions: [
      { label: 'Regular', price: '90' },
      { label: 'With Cheese', price: '100' }
    ]
  },

  // ================= 3. PIZZAS =================
  {
    id: 'pizza-1',
    name: 'Cheese Margherita Pizza',
    desc: 'Classic Italian tomato herb sauce topped with a generous melt of 100% pure mozzarella cheese.',
    category: 'Pizzas',
    price: '120',
    badge: 'Classic',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '120' },
      { label: 'Family', price: '200' }
    ]
  },
  {
    id: 'pizza-2',
    name: 'Onion Tomato Pizza',
    desc: 'Crisp red onions and juicy farm tomatoes baked over rich tomato sauce and bubbling melted mozzarella.',
    category: 'Pizzas',
    price: '140',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '140' },
      { label: 'Family', price: '240' }
    ]
  },
  {
    id: 'pizza-3',
    name: 'Golden Corn Pizza',
    desc: 'Sweet American golden corn kernels layered with velvety mozzarella cheese and herb sprinkle.',
    category: 'Pizzas',
    price: '150',
    badge: 'Kids Fav',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '150' },
      { label: 'Family', price: '250' }
    ]
  },
  {
    id: 'pizza-4',
    name: 'Cheese Tomato Pizza',
    desc: 'Tangy ripe tomatoes baked with extra creamy cheese on our freshly stretched pizza base.',
    category: 'Pizzas',
    price: '160',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '160' },
      { label: 'Family', price: '280' }
    ]
  },
  {
    id: 'pizza-5',
    name: 'Onion Mushroom Pizza',
    desc: 'Sautéed tender button mushrooms and crisp red onions covered in melted Italian cheese.',
    category: 'Pizzas',
    price: '160',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '160' },
      { label: 'Family', price: '280' }
    ]
  },
  {
    id: 'pizza-6',
    name: 'Pineapple Pizza',
    desc: 'Sweet golden pineapple cuts paired with savory cheese sauce for the classic sweet & savory experience.',
    category: 'Pizzas',
    price: '160',
    image: '/pineapple_pizza.jpg',
    variantOptions: [
      { label: 'Regular', price: '160' },
      { label: 'Family', price: '280' }
    ]
  },
  {
    id: 'pizza-7',
    name: 'Mix Vegetable Pizza',
    desc: 'Loaded with farm bell peppers, onions, tomatoes, sweet corn, and generous mozzarella cheese.',
    category: 'Pizzas',
    price: '180',
    badge: 'Loaded Veg',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '180' },
      { label: 'Family', price: '320' }
    ]
  },
  {
    id: 'pizza-8',
    name: 'Peppy Paneer Pizza',
    desc: 'Spiced paneer cubes, crisp capsicum, and red paprika on a hot bubbling cheese crust.',
    category: 'Pizzas',
    price: '180',
    badge: 'Spicy',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '180' },
      { label: 'Family', price: '300' }
    ]
  },
  {
    id: 'pizza-9',
    name: 'The Burger Bro Spl. Pizza',
    desc: 'Chef specialty gourmet pizza with assorted exotic toppings, extra cheese blend, and signature herb seasonings.',
    category: 'Pizzas',
    price: '200',
    badge: 'Special',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '200' },
      { label: 'Family', price: '350' }
    ]
  },
  {
    id: 'pizza-10',
    name: 'Paneer Tikka Pizza',
    desc: 'Tandoori-spiced tender paneer chunks, onion slices, green bell peppers, and creamy melted mozzarella.',
    category: 'Pizzas',
    price: '210',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '210' },
      { label: 'Family', price: '360' }
    ]
  },

  // ================= 4. GRILLED SANDWICH =================
  {
    id: 'gsandwich-1',
    name: 'Plain Cheese Grilled Sandwich',
    desc: 'Crisp butter-toasted sandwich bread melted with rich blend of creamy cheese.',
    category: 'Grilled Sandwiches',
    price: '100',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'gsandwich-2',
    name: 'Vegetable Grilled Sandwich',
    desc: 'Toasted bread packed with fresh cucumber, tomato, capsicum, onions, and spicy green chutney.',
    category: 'Grilled Sandwiches',
    price: '120',
    image: '/veg_grilled_sandwich.jpg'
  },
  {
    id: 'gsandwich-3',
    name: 'Tandoori Paneer Grilled Sandwich',
    desc: 'Smoky tandoori paneer slices grilled in crusty bread with spiced herb sauces and melted cheese.',
    category: 'Grilled Sandwiches',
    price: '140',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'gsandwich-4',
    name: 'The Burger Bro Spl. Grilled Sandwich',
    desc: 'Chef triple-decker special grilled sandwich loaded with paneer, double cheese, corn, and house sauces.',
    category: 'Grilled Sandwiches',
    price: '150',
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80'
  },

  // ================= 5. COLD & FRESH SANDWICH =================
  {
    id: 'csandwich-1',
    name: 'Fresh Sandwich',
    desc: 'Soft bread sandwich layered with crunchy fresh garden vegetables and light seasoning.',
    category: 'Sandwiches',
    price: '20',
    image: '/fresh_sandwich.jpg'
  },
  {
    id: 'csandwich-2',
    name: 'Sweet Corn Sandwich',
    desc: 'Plump golden sweet corn mixed with creamy spread between soft fresh bread slices.',
    category: 'Sandwiches',
    price: '25',
    image: '/sweet_corn_sandwich.jpg'
  },
  {
    id: 'csandwich-3',
    name: 'Paneer Tikka Sandwich',
    desc: 'Fresh bread filled with spiced paneer tikka filling and zesty mint dressing.',
    category: 'Sandwiches',
    price: '40',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'csandwich-4',
    name: 'Veggie Cream Sandwich',
    desc: 'Rich creamy vegetable coleslaw filling served in soft crustless sandwich bread.',
    category: 'Sandwiches',
    price: '40',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=500&auto=format&fit=crop&q=80'
  },

  // ================= 6. CHINESE (NOODLES) =================
  {
    id: 'chinese-1',
    name: 'Wok Street Veg Noodles',
    desc: 'Classic street style stir-fried Hakka noodles tossed with cabbage, capsicum, carrots, and savory sauces.',
    category: 'Chinese & Noodles',
    price: '50',
    badge: 'Desi Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Half', price: '50' },
      { label: 'Full', price: '90' }
    ]
  },

  // ================= 7. PATTIES =================
  {
    id: 'patty-1',
    name: 'Aloo Patty',
    desc: 'Flaky baked golden puff pastry stuffed with spiced potato filling.',
    category: 'Patties',
    price: '15',
    image: '/aloo_patty.jpg'
  },
  {
    id: 'patty-2',
    name: 'Paneer Patty',
    desc: 'Flaky crust pastry puff filled with soft spiced paneer cubes and herbs.',
    category: 'Patties',
    price: '40',
    badge: 'Hot Pick',
    image: '/paneer_patty.jpg'
  },
  {
    id: 'patty-3',
    name: 'Mushroom Patty',
    desc: 'Crispy layered puff pastry stuffed with seasoned mushrooms and spices.',
    category: 'Patties',
    price: '40',
    image: '/mushroom_patty.jpg'
  },

  // ================= 8. SNACKS & FRIES =================
  {
    id: 'snack-1',
    name: 'Masala Fries',
    desc: 'Golden crispy potato French fries tossed in our zesty chatpata masala mix.',
    category: 'Snacks',
    price: '90',
    image: '/masala_fries.jpg'
  },
  {
    id: 'snack-2',
    name: 'Peri Peri Fries',
    desc: 'Hot crispy potato fries dusted with fiery peri peri seasoning for a spicy kick.',
    category: 'Snacks',
    price: '100',
    badge: 'Spicy',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'snack-3',
    name: 'Potato Smiley',
    desc: 'Fun, crispy, golden fried potato smileys loved by kids and adults alike.',
    category: 'Snacks',
    price: '100',
    image: '/potato_smiley.jpg'
  },
  {
    id: 'snack-4',
    name: 'Cheese Garlic Shots',
    desc: 'Crispy bite-sized potato garlic poppers oozing with hot melted cheese filling.',
    category: 'Snacks',
    price: '120',
    badge: 'Cheesy',
    image: '/cheese_garlic_shots.jpg'
  },

  // ================= 9. MARINE SPECIALS =================
  {
    id: 'marine-1',
    name: 'Veggie Marine',
    desc: 'Special marine submarine roll loaded with garden fresh veggies and signature sauces.',
    category: 'Marine Specials',
    price: '70',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '70' },
      { label: 'With Cheese', price: '80' }
    ]
  },
  {
    id: 'marine-2',
    name: 'Aloo Tikki Marine',
    desc: 'Crunchy potato tikki stuffed inside a soft marine roll with creamy dressings and onions.',
    category: 'Marine Specials',
    price: '80',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    variantOptions: [
      { label: 'Regular', price: '80' },
      { label: 'With Cheese', price: '90' }
    ]
  },
  {
    id: 'marine-3',
    name: 'Cheese Stuffed Marine',
    desc: 'Extra cheesy marine roll packed with melting cheese blend and herb spices.',
    category: 'Marine Specials',
    price: '90',
    badge: 'Super Cheesy',
    image: '/cheese_marine.jpg',
    variantOptions: [
      { label: 'Regular', price: '90' },
      { label: 'With Extra Cheese', price: '100' }
    ]
  },

  // ================= 10. BEVERAGES =================
  {
    id: 'bev-1',
    name: 'Masala Lemonade',
    desc: 'Tangy Indian spiced freshly squeezed lemonade with rock salt and mint.',
    category: 'Beverages',
    price: '40',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'bev-2',
    name: 'Fruit Beer (Non-Alcoholic)',
    desc: 'Chilled bubbly apple fruit beer soda with rich foam and refreshing sweetness.',
    category: 'Beverages',
    price: '40',
    badge: 'Popular',
    image: '/fruit_beer.jpg'
  },
  {
    id: 'bev-3',
    name: 'Diet Coke / Pepsi',
    desc: 'Chilled can/bottle of refreshing cold drink.',
    category: 'Beverages',
    price: 'MRP',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'bev-4',
    name: 'Red Bull Energy Drink',
    desc: 'Chilled iconic can of energizing vitalizer drink.',
    category: 'Beverages',
    price: 'MRP',
    image: '/red_bull.jpg'
  },

  // ================= 11. FRUIT FRAPPES & SHAKES =================
  {
    id: 'frappe-1',
    name: 'Pineapple Frappe',
    desc: 'Chilled tropical blended yellow pineapple frappe with creamy milk and ice froth.',
    category: 'Fruit Frappes',
    price: '50',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-2',
    name: 'Strawberry Frappe',
    desc: 'Luscious blended pink strawberry shake with rich sweet fruit aroma.',
    category: 'Fruit Frappes',
    price: '50',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-3',
    name: 'Butter Scotch Frappe',
    desc: 'Creamy golden caramel butterscotch shake loaded with crunchy praline bits.',
    category: 'Fruit Frappes',
    price: '60',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-4',
    name: 'Mango Frappe',
    desc: 'Rich thick mango shake crafted from sweet Alphonso mango puree.',
    category: 'Fruit Frappes',
    price: '60',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-5',
    name: 'Oreo Cookies Shake',
    desc: 'Crushed chocolate Oreo cookies blended thick with vanilla cream and chocolate syrup.',
    category: 'Fruit Frappes',
    price: '70',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-6',
    name: 'Black Currant Frappe',
    desc: 'Exotic tangy-sweet wild black currant berries blended into a rich violet cooler.',
    category: 'Fruit Frappes',
    price: '70',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-7',
    name: 'Cold Chocolate Frappe',
    desc: 'Thick, creamy chilled dark chocolate shake topped with chocolate drizzle.',
    category: 'Fruit Frappes',
    price: '70',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'frappe-8',
    name: 'Cold Coffee',
    desc: 'Classic cafe style rich whipped iced espresso blended with chilled milk and ice cream.',
    category: 'Fruit Frappes',
    price: '80',
    badge: 'Cafe Special',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80'
  },

  // ================= 12. DESSERT =================
  {
    id: 'dessert-1',
    name: 'Fresh Muffins',
    desc: 'Soft and spongy sweet baked muffins in assorted chocolate and vanilla flavors.',
    category: 'Desserts',
    price: '20',
    image: '/fresh_muffins.jpg',
    variantOptions: [
      { label: 'Small Muffin', price: '20' },
      { label: 'Large Muffin', price: '40' }
    ]
  },
  {
    id: 'dessert-2',
    name: 'Chocolava Cake',
    desc: 'Warm mini chocolate cake with a molten center of rich liquid chocolate ganache.',
    category: 'Desserts',
    price: '30',
    badge: 'Hot Molten',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'dessert-3',
    name: 'Walnut Brownie',
    desc: 'Fudgy baked chocolate brownie packed with toasted crunchy walnut pieces.',
    category: 'Desserts',
    price: '30',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'dessert-4',
    name: 'Chocolate Brownies',
    desc: 'Decadent double chocolate dense fudge brownie square.',
    category: 'Desserts',
    price: '60',
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'dessert-5',
    name: 'Pastries',
    desc: 'Daily fresh pastries in Black Forest, Pineapple, Truffle and Red Velvet slices.',
    category: 'Desserts',
    price: 'As Per Flavour',
    image: '/pastries_assorted.jpg'
  },

  // ================= 13. ICE CREAM CUP & BRICKS =================
  {
    id: 'icecream-1',
    name: 'Vanilla Ice Cream Cup',
    desc: 'Creamy classic vanilla bean ice cream cup.',
    category: 'Ice Cream',
    price: '40',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'icecream-2',
    name: 'Strawberry Ice Cream Cup',
    desc: 'Sweet, fruity strawberry cream churned ice cream cup.',
    category: 'Ice Cream',
    price: '40',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'icecream-3',
    name: 'Butter Scotch Ice Cream Cup',
    desc: 'Rich caramel ice cream studded with golden crunchy praline bits.',
    category: 'Ice Cream',
    price: '40',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'icecream-4',
    name: 'Ice Cream Party Bricks',
    desc: 'Large party family bricks available in assorted rich flavors.',
    category: 'Ice Cream',
    price: 'Available On Order',
    badge: 'Party Pack',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80'
  }
];
