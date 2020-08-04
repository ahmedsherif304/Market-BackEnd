const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }]
});


const Favourite = mongoose.model('Favourite',favouriteSchema);

exports.Favourite = Favourite;