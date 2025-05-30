import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        product_name: { type: String, required: true, ref: 'product_name' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    status: { type: String, enum: ['Order Placed', 'In-Progress', 'Out-for-Delivery', 'Order Delivered', 'Cancelled'], required: true, default: 'Order Placed' },
    payment_status: { type: String, enum: ['Pending', 'Processing', 'Received', 'Failed'], required: true, default: 'Pending' },
    date: { type: Number, required: true },
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order