const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema ({
    tokenId:Number,
    maker:String,
    taker:String,
    qty:Number,
    strikePrice:Number,
    baseToken: String,
    quoteToken: String,
    expiry:Number,
    premium: Number
})

mongoose.model('orderSchema',OrderSchema); 