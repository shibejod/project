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
    res.json({success:true,token,id:user.id});
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
    size:{
        type:String,
        
    }

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
    size:req.body.size,
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
    productId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the Product model
        ref: 'Product',
        required: true,
    }
});
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;
  
  
  //Creating api for saving information
//   app.post('/confirm', async (req, res) => {
//     const { amount, userId } = req.body;
  
//     try {
//       // Find the user by ID
//       const user = await Users.findById(userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
  
//       // Create a new payment with user details
//       const payment = new Payment({
//         amount,
//         userId: user._id,
//         userName: user.name,   // Store the user's name in payment
//         userEmail: user.email, // Store the user's email in payment
//         paymentDate: new Date(),
//       });
  
//       await payment.save();
//       console.log("Payment confirmed and saved to database");
  
//       res.json({
//         success: true,
//         amount,
//         userName: user.name,
//         userEmail: user.email,
//       });
//     } catch (error) {
//       console.error("Failed to save payment:", error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to save payment.',
//         error: error.message,
//       });
//     }
//   });
app.post('/confirm', async (req, res) => {
    const { amount, userId, product_id } = req.body;
    console.log("product_id", product_id);
    const productobjectid = product_id.map(id => {
        console.log("productObjectId", id);
        return id;
    })
    // console.log("productobjectid", productobjectid);
    try {
        // Find the user by ID
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Find the product by ID
        const product = await Product.findById(productobjectid);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }


        // Create a new payment with user details
        const payment = new Payment({
            amount,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            paymentDate: new Date(),
            productId: product._id,  // Store the ObjectId of the product
        });
        console.log("Jatin logging payment", payment);
        await payment.save();
        console.log("Payment confirmed and saved to database");

        res.json({
            success: true,
            amount,
            userName: user.name,
            userEmail: user.email,
            product,
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

/////apparel
// app.get('/popularinapparel', async (req, res) => {
//     const { apparel } = req.query;  // Get the apparel type from the query parameters

//     try {
//         // Find products based on the apparel type
//         let products = await Product.find({ apparel: apparel });
//         // Get the top 4 popular products
//         let popular_in_apparel = products.slice(0, 4);

//         console.log(`Popular in ${apparel} apparel fetched`);
//         res.send(popular_in_apparel);
//     } catch (error) {
//         console.error("Error fetching popular products:", error);
//         res.status(500).send("An error occurred while fetching popular products.");
//     }
// });

//both
// app.get('/popularinapparel', async (req, res) => {
//     console.log('Route /popularinapparel hit');
//     const { apparel, category } = req.query;

//     try {
//         // Find products based on the apparel type and category
//         let products = await Product.find({ apparel: apparel, category: category });
//         let popular_in_apparel = products.slice(0, 4);

//         console.log(`Popular ${apparel} products in ${category} category fetched`);
//         res.send(popular_in_apparel);
//     } catch (error) {
//         console.error("Error fetching popular products:", error);
//         res.status(500).send("An error occurred while fetching popular products.");
//     }
// });
app.get('/total-payments-by-date', async (req, res) => {
    try {
        let payments = await Payment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } }, // Group by date only
                    totalAmount: { $sum: "$amount" },  // Sum the payment amounts
                }
            },
            {
                $sort: { _id: 1 } // Sort by date (ascending)
            }
        ]);

        res.json(payments);  // Send the result as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching total payments by date");
    }
});
//////////////////////////////////////////////////
//////////////////////////////
////////////////////////////////
//////////////////////////////////
app.get('/payments-by-product-category', async (req, res) => {
    try {
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: "products", // The name of the Product collection (must match the actual collection name in MongoDB)
                    localField: "productId", // Field from Payment collection
                    foreignField: "_id", // Field from Product collection
                    as: "productDetails" // Name of the array to store the joined documents
                }
            },
            {
                $unwind: "$productDetails" // Deconstruct the array to output a document for each element
            },
            {
                $group: {
                    _id: "$productDetails.category", // Group by the product category
                    totalAmount: { $sum: "$amount" } // Sum the amounts
                }
            },
            {
                $sort: { totalAmount: -1 } // Sort by total amount (descending)
            }
        ]);
        res.json(payments); // Send the result as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching payments by product category");
    }
});
///////////////////////////////
app.get('/api/payments-by-product-apparel-type', async (req, res) => {
    try {
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: "products", // The name of the Product collection
                    localField: "productId", // Field from Payment collection
                    foreignField: "_id", // Field from Product collection
                    as: "productDetails" // Name of the array to store the joined documents
                }
            },
            {
                $unwind: {
                    path: "$productDetails", // Deconstruct the array to output a document for each element
                    preserveNullAndEmptyArrays: true // Keep payments even if there's no matching product
                }
            },
            {
                $match: {
                    "productDetails.apparel": { $ne: null } // Filter out payments without an apparel type
                }
            },
            {
                $group: {
                    _id: "$productDetails.apparel", // Group by the apparel type
                    totalAmount: { $sum: "$amount" } // Sum the payment amounts
                }
            },
            {
                $sort: { totalAmount: -1 } // Sort by total amount (descending)
            }
        ]);
        res.json(payments); // Send the result as JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching payments by product apparel type");
    }
});




// To create GET APIs for each of the graphs based on your **Payment** schema, we can create several API endpoints using Express and MongoDB aggregation. Each endpoint will return the data needed for the respective graph. I'll list out each API with the associated MongoDB aggregation pipeline.

// ### 1. **Payments Over Time (Total Payments by Date)**
// **Endpoint:** `/api/payments-over-time`
// ```js
// app.get('/api/payments-over-time', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } }, // Group by date
//                     totalAmount: { $sum: "$amount" }, // Sum the amounts
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by date
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments over time");
//     }
// });
// ```

// ### 2. **Payments by Product**
// **Endpoint:** `/api/payments-by-product`
// ```js
// app.get('/api/payments-by-product', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: "$productId", // Group by productId
//                     totalAmount: { $sum: "$amount" }, // Sum the amounts
//                 }
//             },
//             { $sort: { totalAmount: -1 } } // Sort by total amount (descending)
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments by product");
//     }
// });
// ```

// ### 3. **Number of Payments by User**
// **Endpoint:** `/api/payments-count-by-user`
// ```js
// app.get('/api/payments-count-by-user', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: "$userId", // Group by userId
//                     paymentCount: { $sum: 1 } // Count the number of payments
//                 }
//             },
//             { $sort: { paymentCount: -1 } } // Sort by payment count (descending)
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payment count by user");
//     }
// });
// ```

// ### 4. **Total Payments by User**
// **Endpoint:** `/api/total-payments-by-user`
// ```js
// app.get('/api/total-payments-by-user', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { userId: "$userId", userName: "$userName" }, // Group by userId and userName
//                     totalAmount: { $sum: "$amount" }, // Sum the amounts
//                 }
//             },
//             { $sort: { totalAmount: -1 } } // Sort by total amount (descending)
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching total payments by user");
//     }
// });
// ```

// ### 5. **Average Payment Amount Over Time**
// **Endpoint:** `/api/average-payments-over-time`
// ```js
// app.get('/api/average-payments-over-time', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } }, // Group by date
//                     averageAmount: { $avg: "$amount" } // Calculate average payment amount
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by date
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching average payments over time");
//     }
// });
// ```

// ### 6. **Payments by User Email Domain**
// **Endpoint:** `/api/payments-by-email-domain`
// ```js
// app.get('/api/payments-by-email-domain', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { $arrayElemAt: [ { $split: [ "$userEmail", "@" ] }, 1 ] }, // Extract email domain
//                     totalAmount: { $sum: "$amount" } // Sum the amounts
//                 }
//             },
//             { $sort: { totalAmount: -1 } } // Sort by total amount (descending)
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments by email domain");
//     }
// });
// ```

// ### 7. **Payments by Product Category**
// Assuming `productId` can be joined with a **Product** collection to get the `category`, this requires a lookup:
// **Endpoint:** `/api/payments-by-product-category`
// ```js
// app.get('/api/payments-by-product-category', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $lookup: {
//                     from: "products", // Name of the Product collection
//                     localField: "productId",
//                     foreignField: "_id",
//                     as: "productDetails"
//                 }
//             },
//             { $unwind: "$productDetails" }, // Unwind the product details array
//             {
//                 $group: {
//                     _id: "$productDetails.category", // Group by product category
//                     totalAmount: { $sum: "$amount" } // Sum the amounts
//                 }
//             },
//             { $sort: { totalAmount: -1 } } // Sort by total amount (descending)
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments by product category");
//     }
// });
// ```

// ### 8. **Payments by Time of Day**
// **Endpoint:** `/api/payments-by-time-of-day`
// ```js
// app.get('/api/payments-by-time-of-day', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { $hour: "$paymentDate" }, // Group by hour of payment
//                     totalAmount: { $sum: "$amount" } // Sum the amounts
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by hour
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments by time of day");
//     }
// });
// ```

// ### 9. **User Retention: Payments Over Time by User**
// **Endpoint:** `/api/payments-over-time-by-user`
// ```js
// app.get('/api/payments-over-time-by-user', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: { userId: "$userId", date: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } } }, // Group by user and date
//                     totalAmount: { $sum: "$amount" } // Sum the amounts
//                 }
//             },
//             { $sort: { "_id.date": 1 } } // Sort by date
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching payments over time by user");
//     }
// });
// ```

// ### 10. **Product Payment Comparison (Grouped Bar Chart)**
// **Endpoint:** `/api/product-payment-comparison`
// ```js
// app.get('/api/product-payment-comparison', async (req, res) => {
//     try {
//         const payments = await Payment.aggregate([
//             {
//                 $group: {
//                     _id: "$productId", // Group by product
//                     totalAmount: { $sum: "$amount" } // Sum the amounts
//                 }
//             },
//             { $sort: { totalAmount: -1 } } // Sort by total amount
//         ]);
//         res.json(payments);
//     } catch (error) {
//         res.status(500).send("Error fetching product payment comparison");
//     }
// });
// ```

// ### General Notes:
// - Replace `Payment` with your Mongoose model if it’s named differently.
// - If you're dealing with product data in another collection, use `$lookup` to join the data.
// - These APIs are structured for GET requests, and each one returns data that can be used to create charts or graphs.

// This should give you all the necessary endpoints to fetch the data required for the various charts you want to generate.
app.get('/total-payments', async (req, res) => {
    try {
        // Aggregate total payments by summing all 'amount' fields
        const totalPayments = await Payment.aggregate([
            {
                $group: {
                    _id: null,  // No grouping, we want to sum all payments
                    totalAmount: { $sum: "$amount" }  // Sum all payment amounts
                }
            }
        ]);

        // If there are no payments, return 0
        const totalAmount = totalPayments.length > 0 ? totalPayments[0].totalAmount : 0;

        // Send the total payment amount as JSON
        res.json({
            success: true,
            totalPayments: totalAmount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching total payments',
            error: error.message
        });
    }
});
//api for related products
//api for related products
app.get('/relatedproducts', async (req, res) => {
    const { apparel, category } = req.query;

    if (!apparel || !category) {
        return res.status(400).json({ error: 'Both apparel and category are required' });
    }

    try {
        let products;
        if (apparel === 'Formal' && category === 'men') {
            products = await Product.find({ apparel: 'Formal-related', category: category });
        } else if (apparel === 'Casual' && category === 'men') {
            products = await Product.find({ apparel: 'Casual-related', category: category });
        } else {
            products = await Product.find({ apparel: apparel, category: category });
        }
        
        let relatedProducts = products.slice(0, 4);

        res.json(relatedProducts);
    } catch (error) {
        console.error('Error fetching related products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})