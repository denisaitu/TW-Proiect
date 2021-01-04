const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

router.get('/', function(req, res) {
  let page = (req.query.page != undefined & req.query.page != 0) ? req.query.page :1;
  const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit :10;

  let startValue;
  let endValue;

  if(page > 0){
    startValue= (page *limit) -limit;
    endValue= page*limit;
  }else{
    startValue = 0;
    endValue = 10;
  }
 database.table ('products as p') 
  .join([{
    table : 'categories as c',
    on : 'c.id = p.id_cat'
  }])
  .withFields(['c.title as category',
'p.title as name',
'p.price',
'p.quantity',
'p.image',
'p.id'])
.slice(startValue, endValue)
.sort({id: .1})
.getAll()
.then(prods => {
  if(prods.length > 0){
    res.status(200).json({
      count : prods.length,
      products : prods
    });
  }else{
    res.json({message : 'No products found'})
  }
}).catch (err => console.log(err))
});
 

/*get single product */
router.get('/:prodId',(req, res) =>{
let productId= req.params.prodId;
//console.log(productId);

  database.table ('products as p') 
  .join([{
    table : 'categories as c',
    on : 'c.id = p.id_cat'
  }])
  .withFields(['c.title as category',
'p.title as name',
'p.price',
'p.quantity',
'p.image',
'p.id'])
.filter({'p.id' : productId})
.get()
.then(prod => {
  if(prod){
    res.status(200).json(prod);
  }else{
    res.json({message : `No product found with product id ${productId}`})
  }
}).catch (err => console.log(err))
});

/*get products of category*/ 
router.get('/category/:catId',(req,res)=>{
  
  let page = (req.query.page != undefined & req.query.page != 0) ? req.query.page :1;
  const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit :10;

  let startValue;
  let endValue;

  if(page > 0){
    startValue= (page *limit) -limit;
    endValue= page*limit;
  }else{
    startValue = 0;
    endValue = 10;
  }

  const cat_id = req.params.catId;

  database.table ('products as p') 
  .join([{
    table : 'categories as c',
    on : `c.id = p.id_cat WHERE c.id LIKE '%${cat_id}%' `
  }])
  .withFields(['c.id as category',
'p.title as name',
'p.price',
'p.quantity',
'p.id'])
.slice(startValue, endValue)
.sort({id: .1})
.getAll()
.then(prods => {
  if(prods.length > 0){
    res.status(200).json({
      count : prods.length,
      products : prods
    });
  }else{
    res.json({message : `No products of category ${cat_id} found`});
  }
}).catch (err => console.log(err))
});

module.exports = router;
