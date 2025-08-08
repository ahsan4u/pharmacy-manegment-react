const mongoose = require('mongoose');

const Bills = mongoose.model('bills', mongoose.Schema({
    username:   {type: String, default: 'unknown'},
    totalPrice: {type: Number},
    pending:    {type: Number},
    profit:     {type: Number},
    products:   {type: Array},
    date:       {type: Date, default: Date.now}
}));

const Medicines = mongoose.model('medicines', mongoose.Schema({
    name:    {type: String, required: true},
    company: {type: String},
    type:    {type: String},
    tabletsPerSheet:  {type: Number},
    shell:   {type: String},
    cost:    {type: Number, required: true},
    mrp:     {type: Number, required: true},
    mfg:     {type: Date},
    exp:     {type: Date, required: true},
    quantity: {type: Number, required: true},
    salt: {type: Array},
    addedDate:   {type: Date, default: Date.now}
}));

module.exports = {Medicines, Bills};