const express=require('express')
const app=express();
require('dotenv/config');
const bodyparser=require('body-parser')
const morgan=require('morgan')
const mongoose=require('mongoose')

const api=process.env.API_URL


//middle ware 
// installed using npm body-parser
app.use(bodyparser.json())
app.use(morgan('tiny'))


// Mongoose Schema

const productSchema=mongoose.Schema({
    name:String,
    Image:String,
    countInStock:{
        type:Number,
        require:true
    }
})

// Models

const Product=mongoose.model('Product',productSchema)

app.get(`${api}/products`,async(req,res)=>{
    const productList= await Product.find();
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})


app.post(`${api}/products`,(req,res)=>{
    const product=new Product({
        name:req.body.name,
        Image:req.body.Image,
        countInStock:req.body.countInStock
    })
    product.save()
    .then((createdProduct=>{
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
})

mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log("Connected to Database...")
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000,()=>{
    console.log("server listening to port http://localhost:3000")
    
})