const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

/* middlewere start */
app.use(cors());
app.use(express.json());
/* middlewere end */


/* MongoDB Setup Start */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.it06kqz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toyCollection = client.db("ToysCarsDB").collection("Toys");
        app.get('/toyscars', async (req, res)=>{
            const result = await toyCollection.find().toArray();
            res.send(result)
        })
        app.post('/toyscars', async (req, res) => {
            const newToysCars = req.body;
            const result = await toyCollection.insertOne(newToysCars);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
/* MongoDB Setup end */


app.get('/', (req, res) => {
    res.send('The Toy Cars Is Running')
});
app.listen(port, () => {
    console.log(`The Running PORT: ${port}`)
})