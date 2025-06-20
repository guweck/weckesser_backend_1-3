const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('carts', cartSchema);
