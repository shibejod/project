// Required libraries and setup
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://atharvashibe2005:Atharvashibe%407@cluster0.nddck.mongodb.net/e-commerce")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ errors: "Invalid token" });
    }
};

// User Schema
const Users = mongoose.model('Users', {
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now },
});

// Product Schema
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
    description: { type: String, required: true },
});

// Payment Schema
const paymentSchema = mongoose.Schema({
    amount: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// API Routes

// Home route
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// User registration
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    let check = await Users.findOne({ email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({ name: username, email, password, cartData: cart });
    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await Users.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, errors: "Wrong email id" });
    }

    const passCompare = password === user.password;
    if (passCompare) {
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token, id: user.id });
    } else {
        res.status(400).json({ success: false, errors: "Wrong Password" });
    }
});

// Fetch user details
app.get('/fetchUser', fetchUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Product management routes
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({ id, ...req.body });
    await product.save();
    res.json({ success: true, name: req.body.name });
});

// Upload product images
app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ success: 1, image_url: `http://localhost:${port}/images/${req.file.filename}` });
});

// Static file serving for images
app.use('/images', express.static('upload/images'));

// Fetch all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    res.json(products);
});

// Fetch new collections
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(-8); // Get the last 8 products
    res.json(newCollection);
});

// Fetch popular products in women category
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popularInWomen = products.slice(0, 4);
    res.json(popularInWomen);
});

// Count products
app.get('/productcount', async (req, res) => {
    let productCount = await Product.countDocuments({});
    res.json({ count: productCount });
});

// Count users
app.get('/usercount', async (req, res) => {
    try {
        let userCount = await Users.countDocuments({});
        res.json({ count: userCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user count" });
    }
});

// Adding products to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    const { itemId } = req.body;
    let userData = await Users.findById(req.user.id);
    if (userData) {
        userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
        await userData.save();
        res.json({ message: "Product added to cart" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// Removing products from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    const { itemId } = req.body;
    let userData = await Users.findById(req.user.id);
    if (userData && userData.cartData[itemId] > 0) {
        userData.cartData[itemId] -= 1;
        await userData.save();
        res.json({ message: "Product removed" });
    } else {
        res.status(400).json({ message: "Product not found in cart" });
    }
});

// Getting cart data
app.post('/getcart', fetchUser, async (req, res) => {
    let userData = await Users.findById(req.user.id);
    res.json(userData ? userData.cartData : {});
});

// Confirming payment
app.post('/confirm', async (req, res) => {
    const { amount, userId } = req.body;

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const payment = new Payment({
            amount,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
        });

        await payment.save();
        res.json({ success: true, amount, userName: user.name, userEmail: user.email });
    } catch (error) {
        console.error("Failed to save payment:", error);
        res.status(500).json({ success: false, message: 'Failed to save payment', error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
