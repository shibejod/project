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

app.get("/",(req,res)=>{
    res.send("Express App is running");

})

//Image storage engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

//Schema for users
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        },
    password:{
        type:String
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }

})

//Creating endpoint for registering users
app.post('/signup',async(req,res)=>{
    let check= await  Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart={};
    for (let i = 0; i < 300 ;i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,

    }) 
    await user.save();
    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token});
})

//Creating endpoint for user login
app.post('/login',async(req,res)=>{
    let user= await  Users.findOne({email:req.body.email});
    if(user){
   const passCompare =req.body.password === user.password;
   if(passCompare){
    const data={
      user:{
           id:user.id,

      }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token,id});
   }
   else{
    res.json({success:false,errors:"Wrong Password"})
   }
    }
    else{
        res.json({success:false,errors:"Wrong email id"})
    }
})








const upload = multer({storage:storage})
//Creating upload endpoint for images
app.use('/images',express.static('upload/images'));   
// app.post("/upload",upload.single('product'),(req,res)=>{
//   res.json({
//     success:1,
//     image_url:`http://localhost:${port}/images/${req.file.filename}`
//   });
// });

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
  });
  

//Schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true,
    },
    description:{
        type:String,
        required:true,
    },
    apparel:{
        type:String,
        required:true,
    },

})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id=1;
    }
   const product =new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
    description:req.body.description,
    apparel:req.body.apparel,
   });
   console.log(product);
   await product.save();
   console.log("Saved");
   res.json({
    success:true,
    name:req.body.name,
   })
})
//creating api to save info in database


//Creating API for deleting products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
    })
//Creating api for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    res.json(products);
    })


//Creating endpoint for new collection data
app.get('/newcollections',async (req,res)=>{
    let products =await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    console.log("New collection Fetched")
    res.send(newcollection);
})

//Creating endpoint for popular in women
app.get('/popularinwomen',async (req,res)=>{

    let products =await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
})
//Creating endpoint for count
// Creating API for getting the count of all products
app.get('/productcount', async (req, res) => {
    let productCount = await Product.countDocuments({});
    res.json({ count: productCount });
});


// Assuming you have a User model/schema for the users collection
app.get('/usercount', async (req, res) => {
    try {
        let userCount = await Users.countDocuments({});
        res.json({ count: userCount });
    } catch (error) {
        res.status(500).send("Error fetching user count");
    }
});
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
 let userData =await  Users.findOne({_id:req.user.id});
 userData .cartData[req.body.itemId] +=1;
 await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
 res.send({message:"Product added to cart"});
})

//Creating endpoint for removing products in cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData =await  Users.findOne({_id:req.user.id});
    if(userData .cartData[req.body.itemId]>0)
    userData .cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send({message:"Product removed"});
   })
//Creating endpoint to create cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("Get cart");
    let userData =await  Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})




app.listen(port,(error)=>{
  if(!error){
    console.log("Server is running on port "+port);
  }
    else{
        console.log("Error in server");
    }
  }
)
//Count
// const collection = db.collection('products');
// const count = await collection.countDocuments({});
// console.log("Number of documents in products:", count);

const paymentSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Users model
         ref: 'Users',
        required: true,
      },
      userName: {
        type: String, // Store the user's name
        required: true,
      },
      userEmail: {
        type: String, // Store the user's email
        required: true,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
    });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;
  
  
  //Creating api for saving information
  app.post('/confirm', async (req, res) => {
    const { amount, userId } = req.body;
  
    try {
      // Find the user by ID
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Create a new payment with user details
      const payment = new Payment({
        amount,
        userId: user._id,
        userName: user.name,   // Store the user's name in payment
        userEmail: user.email, // Store the user's email in payment
        paymentDate: new Date(),
      });
  
      await payment.save();
      console.log("Payment confirmed and saved to database");
  
      res.json({
        success: true,
        amount,
        userName: user.name,
        userEmail: user.email,
      });
    } catch (error) {
      console.error("Failed to save payment:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to save payment.',
        error: error.message,
      });
    }
  });








// const upload = multer({ storage });

// API Routes

// Home route


// User registration


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
