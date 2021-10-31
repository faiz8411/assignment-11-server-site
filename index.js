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
    const serviceCollection = client.db("currier_service").collection("service");
    const orderCollection = client.db("currier_service").collection("order");
    console.log('connect database')


    // post-----------api
    app.post("/addServices", (req, res) => {
        console.log(req.body);
        serviceCollection.insertOne(req.body).then((result) => {
            res.send(result.insertedId)
            // res.send(documents.insertedId);

        });
    });

    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find({}).toArray()
        res.send(result)
    })

    // service  details
    app.get('/details/:id', (req, res) => {
        const id = req.params.id
        serviceCollection.findOne({ _id: ObjectId(id) })
            .then(result => {
                res.send(result)
                console.log(result)
            })
    })

    // add order
    app.post("/addServices", (req, res) => {
        console.log(req.body);
        orderCollection.insertOne(req.body).then((result) => {
            res.send(result)
            // res.send(documents.insertedId);

        });
    });


    // client.close();
});
app.get('/', (req, res) => {
    res.send('we fastest curriar for you')

})

app.listen(process.env.PORT || port);
