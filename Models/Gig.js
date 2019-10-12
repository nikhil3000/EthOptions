const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Schema = new Schema ({
    gig:String,
    bounty:Number,
    verifier:String,
    owner:String,
    escrow:String,
    taskPerformer:String
})

mongoose.model('Gig',GigSchema);