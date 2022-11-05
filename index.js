const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USer}:${process.env.DB_PASS}@cluster0.hlyc9ph.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceConnection = client.db('giniusCar').collection('services')
        const orderConnection = client.db('giniusCar').collection('order')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceConnection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/checkout/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceConnection.findOne(query)
            res.send(service)
        })


        // order

        app.post('/order', async (req, res) => {
            const order = req.body
            console.log(order);
            const result = await orderConnection.insertOne(order)
            res.send(result)
        })


        app.get('/order', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderConnection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id
            const status = req.body.status
            console.log(status)
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderConnection.updateOne(query, updateDoc)
            res.send(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: ObjectId(id) }
            const result = await orderConnection.deleteOne(query)
            res.send(result)
        })

    } finally {

    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})