const categoryRoute = require('./categoryRoutes');
const subCategoryRoute = require("./subCategoryRoutes");
const brandRoute = require("./brandRoutes");
const productRoute = require("./productRoutes");
const userRoute = require("./userRoutes.js");
const authRoute = require("./authRoutes.js");
const reviewRoute = require("./reviewRoutes.js");
const wishlistRoute = require("./wishlistRoutes.js");
const addressRoute = require("./addressRoutes.js");
const couponRoute = require("./couponRoutes.js");
const cartRoute = require("./cartRoutes.js");
const orderRoute = require("./orderRoutes.js");

const mountRoutes = (app) => {
app.use("/api/v1/categories/", categoryRoute);
app.use("/api/v1/subcategories/", subCategoryRoute);   
app.use("/api/v1/brands/", brandRoute);
app.use("/api/v1/products/", productRoute);   
app.use("/api/v1/users/", userRoute);   
app.use("/api/v1/auth/", authRoute); 
app.use("/api/v1/reviews/", reviewRoute);    
app.use("/api/v1/wishlist/", wishlistRoute);    
app.use("/api/v1/addresses/", addressRoute);  
app.use("/api/v1/coupons/", couponRoute);  
app.use("/api/v1/carts/", cartRoute);  
app.use("/api/v1/orders/", orderRoute);  
}
module.exports = mountRoutes;