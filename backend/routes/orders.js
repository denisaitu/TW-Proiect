const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const crypto = require('crypto'); 

router.get('/', (req,res)=>{
database.table('orders_detailes as od')
.join([
    {
        table: 'orders as o',
        on: 'o.id = od.order_id'
    },
    {
        table : 'products as p',
        on: 'p.id = od.product_id'
    },
    {
        table: 'users as u',
        on: 'u.id= o.user_id'
    }
])
.withFields(['o.id','p.title as name','p.description', 'p.price', 'u.username'])
.sort({id : 1})
.getAll()
.then(orders => {
    if(orders.length >0){
        res.status(200).json(orders);
    }else{
        res.json({message: 'No order'});
       }
    }).catch(err => console.log(err));
});

router.get('/:id', (req,res)=>{
    const orderId = req.params.id;
    database.table('orders_detailes as od')
    .join([
        {
            table: 'orders as o',
            on: 'o.id = od.order_id'
        },
        {
            table : 'products as p',
            on: 'p.id = od.product_id'
        },
        {
            table: 'users as u',
            on: 'u.id= o.user_id'
        }
    ])
    .withFields(['o.id','p.title as name','p.description', 'p.price', 'u.username'])
    .filter({'o.id' :orderId})
    .getAll()
    .then(orders => {
        if(orders.length >0){
            res.status(200).json(orders);
        }else{
            res.json({message: `No order found with id ${orderId}`});
           }
        }).catch(err => console.log(err));



});

/*Place a new order*/

router.post('/new', async (req, res) => {
    // let userId = req.body.userId;
    // let data = JSON.parse(req.body);
    let {userId, products} = req.body;
    console.log(userId);
    console.log(products);

     if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                id_user: userId
            }).then((newOrderId) => {

            if (newOrderId > 0) {
                products.forEach(async (p) => {

                        let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();



                    let inCart = parseInt(p.incart);

                    // Deduct the number of pieces ordered from the quantity in database

                    if (data.quantity > 0) {
                        data.quantity = data.quantity - inCart;

                        if (data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    // Insert order details w.r.t the newly created order Id
                    database.table('orders_details')
                        .insert({
                            order_id: newOrderId,
                            product_id: p.id,
                            quantity: inCart
                        }).then(newId => {
                        database.table('products')
                            .filter({id: p.id})
                            .update({
                                quantity: data.quantity
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                });

            } else {
                res.json({message: 'New order failed while adding order details', success: false});
            }
            res.json({
                message: `Order successfully placed with order id ${newOrderId}`,
                success: true,
                order_id: newOrderId,
                products: products
            })
        }).catch(err => res.json(err));
    }

    else {
        res.json({message: 'New order failed', success: false});
    }

});




module.exports = router;