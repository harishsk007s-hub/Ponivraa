import bcrypt from 'bcryptjs';

// Initial Seed Data - Strictly Mango, Honey, Guava (No Apple, No Orange)
const initialProducts = [
  {
    _id: '6720f1a10000000000000001',
    name: 'Alagarkovil Premium Alphonso Mango',
    category: 'Mango',
    price: 320,
    description: 'Directly harvested from our foothill orchards in Alagarkovil, Tamil Nadu. Naturally tree-ripened, intensely aromatic with rich saffron-gold pulp and zero chemicals.',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 45,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-01T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000002',
    name: 'South Farm Banganapalli Mango',
    category: 'Mango',
    price: 180,
    description: 'Renowned king of table mangoes from South Tamil Nadu soil. Thin skin, fiberless tender golden flesh, and natural sweet nectar balance. Freshly handpicked at daybreak.',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 30,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-02T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000003',
    name: 'Imam Pasand Royal Mango',
    category: 'Mango',
    price: 450,
    description: 'The prized aristocrat of mangoes. Large, intensely sweet, with distinct coconut-cardamom aftertones. Naturally matured without carbide or ripening agents.',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 20,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-03T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000004',
    name: 'Kallaamai / Kizhimooku Mango',
    category: 'Mango',
    price: 99,
    description: 'Crisp, tangy-sweet native Totapuri variety from Alagarkovil. Ideal for fresh slices, summer salads, and natural juice preparations.',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 50,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-04T10:00:00Z'),
  },
  // HONEY PRODUCTS WITH 4 WEIGHT VARIANTS
  {
    _id: '6720f1a10000000000000005',
    name: 'Pure Gulkand Honey',
    category: 'Honey',
    price: 240,
    description: 'Artisanal fusion of pure raw forest honey infused with sun-cooked organic Damask rose petals (Gulkand). Natural cooling elixir that promotes digestive wellness.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 65,
    variants: [
      { weight: '250 g', price: 240, stockQuantity: 20, inStock: true },
      { weight: '350 g', price: 320, stockQuantity: 15, inStock: true },
      { weight: '500 g', price: 450, stockQuantity: 20, inStock: true },
      { weight: '1 kg', price: 850, stockQuantity: 10, inStock: true },
    ],
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-05T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000006',
    name: 'Sun-Drenched Fig Honey',
    category: 'Honey',
    price: 260,
    description: 'Dried whole organic Anjeer (figs) steeped in raw wild mountain honey. Packed with iron, calcium, and natural dietary fiber for vitality and stamina.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 55,
    variants: [
      { weight: '250 g', price: 260, stockQuantity: 15, inStock: true },
      { weight: '350 g', price: 350, stockQuantity: 15, inStock: true },
      { weight: '500 g', price: 480, stockQuantity: 15, inStock: true },
      { weight: '1 kg', price: 920, stockQuantity: 10, inStock: true },
    ],
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-06T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000007',
    name: 'Nutritious Dry Fruits Honey',
    category: 'Honey',
    price: 290,
    description: 'Premium combination of raw unprocessed forest honey loaded with hand-roasted almonds, cashews, walnuts, pistachios, and raisins. A nutrient-dense superfood.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 45,
    variants: [
      { weight: '250 g', price: 290, stockQuantity: 10, inStock: true },
      { weight: '350 g', price: 390, stockQuantity: 15, inStock: true },
      { weight: '500 g', price: 540, stockQuantity: 12, inStock: true },
      { weight: '1 kg', price: 990, stockQuantity: 8, inStock: true },
    ],
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-07T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000008',
    name: 'Alagar Pristine Hill Honey',
    category: 'Honey',
    price: 220,
    description: '100% pure raw multi-floral honey ethically sourced from the wild hills of Alagarkovil. Unheated, unpasteurized, and rich in natural pollen and live enzymes.',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 60,
    variants: [
      { weight: '250 g', price: 220, stockQuantity: 20, inStock: true },
      { weight: '350 g', price: 290, stockQuantity: 15, inStock: true },
      { weight: '500 g', price: 410, stockQuantity: 15, inStock: true },
      { weight: '1 kg', price: 780, stockQuantity: 10, inStock: true },
    ],
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-08T10:00:00Z'),
  },
  // GUAVA PRODUCTS
  {
    _id: '6720f1a10000000000000009',
    name: 'Alagarkovil Country White Guava (Koyya)',
    category: 'Guava',
    price: 90,
    description: 'Traditional native variety grown in our Alagarkovil groves. Crisp pale green outer rind, crunchy mild-sweet interior, rich in natural dietary fiber and Vitamin C.',
    image: 'https://images.unsplash.com/photo-1536511135898-132b4b45ec82?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 55,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-09T10:00:00Z'),
  },
  {
    _id: '6720f1a10000000000000010',
    name: 'Organic Pink Taiwan Guava',
    category: 'Guava',
    price: 130,
    description: 'Vibrant rosy-pink interior with few soft seeds and creamy honey undertones. Cultivated with organic farm compost and zero synthetic chemicals.',
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 35,
    inStock: true,
    isVisible: true,
    createdAt: new Date('2026-10-10T10:00:00Z'),
  },
];

const initialOrders = [
  {
    _id: '6720f1a10000000000000020',
    orderId: '#ORD-1779165060577',
    customerName: 'Varsha test',
    phone: '9345468234',
    address: 'Tallakulam, Madurai',
    pincode: '625002',
    products: [
      {
        productId: '6720f1a10000000000000004',
        name: 'Kallaamai / Kizhimooku',
        category: 'Mango',
        selectedVariant: 'kg',
        price: 99,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      },
    ],
    totalAmount: 297,
    status: 'PENDING',
    notes: 'Please dispatch morning batch',
    createdAt: new Date('2026-10-28T09:30:00Z'),
  },
];

const initialEnquiries = [
  {
    _id: '6720f1a10000000000000030',
    name: 'Meenakshi Sundaram',
    phone: '9443210987',
    email: 'meenakshi.s@gmail.com',
    message: 'Hello Ponivraa team, do you provide bulk box deliveries for family celebrations in Madurai?',
    isRead: false,
    createdAt: new Date('2026-10-28T14:15:00Z'),
  },
];

export class MemoryStore {
  constructor() {
    this.products = [...initialProducts];
    this.orders = [...initialOrders];
    this.enquiries = [...initialEnquiries];
    this.admins = [];
    this.initAdmin();
  }

  async initAdmin() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    this.admins.push({
      _id: '6720f1a10000000000000040',
      email: 'admin@ponivraa.com',
      password: hashedPassword,
      name: 'Ponivraa Master Admin',
      createdAt: new Date(),
      async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      },
    });
  }

  generateId() {
    return Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

export const memoryStoreInstance = new MemoryStore();
