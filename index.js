const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = "ARTD7HoGPHNthebv";

const uri = "mongodb+srv://organicUser:ARTD7HoGPHNthebv@cluster0.m6kot.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    
    // add item to database
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            // console.log("product added");
            res.redirect('/');
        })
    })

    // update product
    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity }
        })
        .then(result => {
            if(result){
                res.send(result.modifiedCount > 0)
            }
        })
    })

    // load single product
    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })
    
    // delete item from database
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            // console.log(result);   
            res.send(result.deletedCount > 0) 
        })
    })
    
});

app.listen(3000);