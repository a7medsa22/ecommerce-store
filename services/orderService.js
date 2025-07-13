const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Order = require("../models/OrderModels");
const Cart = require("../models/cartModels");
const User = require("../models/userModels");

exports.createOrderCash = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) {
        return next(new ApiError('User not found', 404));
    }
    if (!user.addresses || user.addresses.length === 0) {
        return next(new ApiError('User has no addresses', 400));
    }

    const { cartId } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) {
        return next(new ApiError(`There is no cart for this id: ${cartId}`, 404));
    }

    let cartPrice = cart.totalCartPrice;
    if (cart.totalPriceAfterDiscount) {
        cartPrice = cart.totalPriceAfterDiscount;
    }

    const totalOrderPrice = cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);
    const addresses = user.addresses[0];

    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalOrderPrice,
        paymentMethod: "cash",
        address: addresses.details,
        phone: addresses.phone,
    });

    // Clear cart after creating order
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({ status: 'success', data: order });
});
