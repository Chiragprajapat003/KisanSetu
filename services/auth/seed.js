const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phno: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: Number, required: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
        address: { type: String, default: '' }
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    rating: { type: Number, default: 4.8 },
    totalOrders: { type: Number, default: 15 }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    currentQuantity: { type: Number, required: true, default: 0 },
    allocatedQuantity: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    ownerName: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 12 },
    profit: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const seedDatabase = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/agridirect';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing old sample products...');
    await Product.deleteMany({});

    // Hash password for sample farmers
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Upsert Farmers
    const farmersData = [
        {
            name: 'Ramesh Patel',
            email: 'ramesh.farmer@agridirect.com',
            password: hashedPassword,
            phno: '9876543211',
            state: 'Gujarat',
            city: 'Ahmedabad',
            pin: 380001,
            location: { type: 'Point', coordinates: [72.5714, 23.0225], address: 'Sanand Farm, Ahmedabad, Gujarat' },
            rating: 4.9,
            totalOrders: 42
        },
        {
            name: 'Suresh Kumar',
            email: 'suresh.farmer@agridirect.com',
            password: hashedPassword,
            phno: '9876543212',
            state: 'Maharashtra',
            city: 'Pune',
            pin: 411001,
            location: { type: 'Point', coordinates: [73.8567, 18.5204], address: 'Baramati Green Farm, Pune, Maharashtra' },
            rating: 4.8,
            totalOrders: 38
        },
        {
            name: 'Priya Sharma',
            email: 'priya.farmer@agridirect.com',
            password: hashedPassword,
            phno: '9876543213',
            state: 'Punjab',
            city: 'Ludhiana',
            pin: 141001,
            location: { type: 'Point', coordinates: [75.8573, 30.9010], address: 'Golden Harvest Farm, Ludhiana, Punjab' },
            rating: 5.0,
            totalOrders: 65
        }
    ];

    const farmers = [];
    for (const f of farmersData) {
        let farmer = await Farmer.findOne({ email: f.email });
        if (!farmer) {
            farmer = await Farmer.create(f);
            console.log(`Created farmer: ${farmer.name}`);
        } else {
            console.log(`Farmer already exists: ${farmer.name}`);
        }
        farmers.push(farmer);
    }

    const [farmer1, farmer2, farmer3] = farmers;

    const productsData = [
        // Vegetables
        {
            productName: 'Organic Red Tomatoes',
            description: 'Naturally ripened, pesticide-free juicy organic tomatoes directly harvested this morning.',
            price: 40,
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop',
            currentQuantity: 150,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 4.8,
            totalReviews: 24
        },
        {
            productName: 'Farm Fresh Potatoes',
            description: 'Freshly dug earthy potatoes, perfect for curries, baking, and crispy roasts.',
            price: 25,
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop',
            currentQuantity: 300,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 4.6,
            totalReviews: 19
        },
        {
            productName: 'Crisp Green Bell Peppers',
            description: 'Vibrant and crunchy farm-fresh capsicum rich in vitamin C and natural antioxidants.',
            price: 60,
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop',
            currentQuantity: 80,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.7,
            totalReviews: 15
        },
        {
            productName: 'Fresh Farm Palak (Spinach)',
            description: 'Tender, nutrient-dense organic baby spinach leaves, cleaned and bundle-packed.',
            price: 30,
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop',
            currentQuantity: 60,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 4.9,
            totalReviews: 31
        },
        {
            productName: 'Organic Red Onions',
            description: 'Pungent, high-grade sun-cured red onions from Maharashtra farms.',
            price: 35,
            category: 'Vegetables',
            image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop',
            currentQuantity: 250,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.7,
            totalReviews: 28
        },

        // Fruits
        {
            productName: 'Shimla Royal Delicious Apples',
            description: 'Crisp, sweet, and aromatic mountain-grown red apples from Himachal orchards.',
            price: 140,
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop',
            currentQuantity: 120,
            allocatedQuantity: 0,
            owner: farmer3._id,
            ownerName: farmer3.name,
            state: farmer3.state,
            city: farmer3.city,
            pin: farmer3.pin,
            rating: 5.0,
            totalReviews: 45
        },
        {
            productName: 'Ratnagiri Alphonso Mangoes',
            description: 'GI-tagged authentic Hapus mangoes known for their intoxicating aroma and rich golden pulp.',
            price: 350,
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop',
            currentQuantity: 70,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.9,
            totalReviews: 52
        },
        {
            productName: 'Nagpur Sweet Oranges',
            description: 'Juicy, sunshine-filled oranges packed with authentic citrus sweetness and vitamin C.',
            price: 70,
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop',
            currentQuantity: 140,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.8,
            totalReviews: 22
        },
        {
            productName: 'Farm Fresh Cavendish Bananas',
            description: 'Naturally ripened, potassium-rich fresh bananas harvested at peak sweetness.',
            price: 45,
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop',
            currentQuantity: 180,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 4.6,
            totalReviews: 18
        },

        // Grains
        {
            productName: 'Traditional Aged Basmati Rice',
            description: 'Extra-long grain authentic aromatic basmati rice, aged 2 years for royal fluffiness.',
            price: 120,
            category: 'Grains',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop',
            currentQuantity: 300,
            allocatedQuantity: 0,
            owner: farmer3._id,
            ownerName: farmer3.name,
            state: farmer3.state,
            city: farmer3.city,
            pin: farmer3.pin,
            rating: 4.9,
            totalReviews: 39
        },
        {
            productName: 'Sharbati Whole Wheat Grain',
            description: 'The golden grain of Sehore — softest, naturally sweet rotis with high dietary fiber.',
            price: 48,
            category: 'Grains',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop',
            currentQuantity: 450,
            allocatedQuantity: 0,
            owner: farmer3._id,
            ownerName: farmer3.name,
            state: farmer3.state,
            city: farmer3.city,
            pin: farmer3.pin,
            rating: 4.7,
            totalReviews: 26
        },

        // Dairy
        {
            productName: 'Pure A2 Desi Cow Milk',
            description: 'Raw, unpasteurized morning-fresh A2 milk from grass-fed Gir cows.',
            price: 70,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop',
            currentQuantity: 90,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 4.9,
            totalReviews: 60
        },
        {
            productName: 'Bilona Desi Cow Ghee',
            description: 'Vedic traditional bilona method churned golden ghee with divine aroma and Ayurvedic purity.',
            price: 750,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop',
            currentQuantity: 40,
            allocatedQuantity: 0,
            owner: farmer1._id,
            ownerName: farmer1.name,
            state: farmer1.state,
            city: farmer1.city,
            pin: farmer1.pin,
            rating: 5.0,
            totalReviews: 48
        },

        // Organic
        {
            productName: 'Wild Forest Raw Honey',
            description: '100% pure unprocessed wildflower honey gathered by indigenous tribal beekeepers.',
            price: 480,
            category: 'Organic',
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop',
            currentQuantity: 55,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.9,
            totalReviews: 33
        },
        {
            productName: 'Organic Sun-dried Turmeric (Haldi)',
            description: 'High-curcumin heirloom Salem turmeric rhizomes, dried under natural sunlight.',
            price: 90,
            category: 'Organic',
            image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop',
            currentQuantity: 85,
            allocatedQuantity: 0,
            owner: farmer2._id,
            ownerName: farmer2.name,
            state: farmer2.state,
            city: farmer2.city,
            pin: farmer2.pin,
            rating: 4.8,
            totalReviews: 17
        }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ Successfully seeded ${createdProducts.length} fresh farm products!`);

    // Assign products to farmers
    for (const p of createdProducts) {
        await Farmer.findByIdAndUpdate(p.owner, { $addToSet: { products: p._id } });
    }
    console.log('✅ Farmers updated with their product references.');

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
};

seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
