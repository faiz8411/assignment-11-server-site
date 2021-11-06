const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ObjectId = require("mongodb").ObjectId
require('dotenv').config()
const cors = require('cors')
port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wusl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
    const collections = client.db("currier_service")
    const serviceCollection = collections.collection('services')
    const orderCollection = collections.collection("order");
    console.log('connect database')


    // post-----------api
    app.post("/addServices", async (req, res) => {
        const result = await serviceCollection.insertOne(req.body);
        res.send(result);
    });

    // get all
    app.get("/allServices", async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
        console.log(result);
    });

    // get single product
    app.get("/details/:id", async (req, res) => {
        const result = await serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray();
        res.send(result[0]);
    });

    // confirm order
    app.post("/myOrders", async (req, res) => {
        const result = await orderCollection.insertOne(req.body);
        console.log(result)
        res.send(result);
    });

    // my confirmOrder

    app.get("/myOrders", async (req, res) => {
        let query = {}
        const email = req.query.email
        if (email) {
            query = { email: email }
        }

        const cursor = orderCollection.find(query)
        const orders = await cursor.toArray();


        res.send(orders);
    });

    /// delete order

    app.delete("/deleteOrder/:id", async (req, res) => {
        const result = await orderCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });






    // client.close();
});
app.get('/', (req, res) => {
    res.send('we fastest curriar for you')

})

app.listen(process.env.PORT || port);
