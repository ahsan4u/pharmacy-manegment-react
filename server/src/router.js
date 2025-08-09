const express = require('express');
const { Medicines, Bills } = require('./module');
const { priceAfterDiscount, limit } = require('../../client/src/fns');

const router = express.Router();


router.route('/analytics-data').get(async (req, res)=> {
    try {
        const profits = {};
        const date = new Date();
        profits.today   = await Bills.find({date: {$gte: date.setHours(0,0,0,0)}}).select({profit: 1, _id: 0});
        profits.monthly = await Bills.find({date: {$gte: date.setMonth(date.getMonth() - 1)}}).select({profit: 1, _id: 0});
        profits.yearly  = await Bills.find({date: {$gte: date.setFullYear(date.getFullYear() - 1)}}).select({profit: 1, _id: 0});
        profits.pending = await Bills.find({pending: {$gt: 0}}).select({pending: 1, _id: 0});

        const MedAlert = {};
        MedAlert.expiry = await Medicines.findOne().sort({exp: 1});
        MedAlert.lowQty = await Medicines.findOne().sort({quantity: 1});

        for(key in profits) profits[key] =  profits[key].reduce((sum, a)=>(a.profit || a.pending || 0) + sum, 0);

        res.status(200).send({profits, MedAlert});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.route('/search').get(async (req, res) => {
    const query = req.query;

    const data = await Medicines.find({ name: new RegExp(query.input, 'i') }).limit(5).lean();
    const medicines = data.map(item => ({ ...item, quantity: 1, discount: 10 }));

    res.status(200).send(medicines);
})

router.route('/add-bill').post(async (req, res) => {
    const { username, totalPrice, pending } = req.body;

    try {
        const products = req.body.items.map(item => {
            const { _id, mfg, exp, ...restItem } = item;
            return restItem;
        })

        const profit = req.body.items.reduce((sum, item)=>{
            const cp = item.cost;
            const sp = priceAfterDiscount(item.mrp, item.discount);
            return sum + (sp - cp);
        }, 0);
        
        await Bills.create({ username, products, totalPrice, pending, profit });
        res.status(200).send({ message: 'New Bill Added Successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
})

router.route('/add-medicine').post(async (req, res) => {
    const body = req.body;

    try {
        await Medicines.create(body);
        res.status(200).send({ message: req.body.name + ' Successfully Added' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: 'server Error: ' + error.message });
    }
})

router.route('/medicines').get(async (req, res) => {
    const { sort, searchType='name', search } = req.query;

    let sortObj = {};
    if (sort === 'name')       sortObj = { name: 1 };
    if (sort === 'expiry')     sortObj = { exp: 1 };
    if (sort === 'price-low')  sortObj = { mrp: 1 };
    if (sort === 'price-high') sortObj = { mrp: -1 };

    try {
        const medicines = await Medicines.find({[searchType]: new RegExp(search, 'i')}).sort(sortObj);
        res.status(200).send(medicines);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
})

router.route('/update-medicine').post(async (req, res) => {
    try {
        await Medicines.updateOne({ _id: req.body._id }, { $set: req.body });
        res.status(200).send({ message: 'Medicine Updated Successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

router.route('/delete-medicine').post(async (req, res)=> {
    try {
        await Medicines.deleteOne({ _id: req.body.id });
        res.status(200).send({ message: 'Medicine Successfully Deleted' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


router.route('/sells').get(async (req, res) => {
    const { page } = req.query;
    const { search, sort, pending } = JSON.parse(req.query.filter);
    const status = pending === 'pending' ? { pending: { $gt: 0 } } : pending == 'settled' ? { pending: 0 } : {};
    
    let sortQuery = { date: -1 };
    if (sort == 'name')     sortQuery = { username: 1 }
    if (sort == 'newest')   sortQuery = { date: -1 }
    if (sort == 'oldest')   sortQuery = { date: 1 }
    if (sort == 'price-high') sortQuery = { totalPrice: -1 }
    if (sort == 'price-low')  sortQuery = { totalPrice: 1 }
    
    const bills = await Bills.find({ ...status, username: new RegExp(search, 'i') }).sort(sortQuery).skip((page-1)*limit).limit(limit).select({username: 1, quantity: 1, totalPrice : 1, pending: 1, date: 1});
    res.status(200).send(bills);
})

router.route('/bill').get(async (req, res)=> {
    const {_id} = req.query;
    try {
        const bill = await Bills.findOne({_id});
        res.status(200).send(bill);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

router.route('/update-bill').post(async (req, res)=> {
    
    try {
        await Bills.updateOne({_id: req.body.id}, {$set: {pending: req.body.pending}})
        res.status(200).send({message: 'Pending amount Successfully Updated'})
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

module.exports = router;