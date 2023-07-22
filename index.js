const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const db = process.env.DB;
const deliveryCollection = process.env.DELIVERY_COLLECTION;

// db connection
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.7yyq5li.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const database = client.db(db);
    const outletCollection = database.collection(process.env.OUTLETS_COLLECTION);
    const productsCollection = database.collection(process.env.PRODUCTS_COLLECTION);
    const expiryCollection =database.collection( process.env.EXPIRY_COLLECTION);


    // Post Outlet API function
    app.post("/postOutlet", async (req, res) => {
      try {
        const data = req.body;
        const upload = await outletCollection.insertOne(data);
        res.send(upload.acknowledged);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
      }
    });

    app.post("/postNewProduct", async (req, res) => {
      try {
        const data = req.body;
        const upload = await productsCollection.insertOne(data);
        console.log(req.body,upload)
        res.send(upload.acknowledged)
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
      }
    });
    app.post('/newExpiry',async function (req, res) {
      const expiry = req.data
      const upload = await expiryCollection.insertOne(data)
      res.send(upload.acknowledged)

    })

    //////get APIs/////////////////

    //get all outlets//
    app.get('/getAllOutlets',async (req,res)=>{
      const getOutlets = await outletCollection.find({}).toArray()
      res.send(getOutlets)
    })
    // get all products///
    app.get('/getAllProducts',async (req,res)=>{
      const getProducts = await productsCollection.find({}).toArray()
      res.send(getProducts)
    })
    const PORT = process.env.PORT || 4040;
    app.listen(PORT, () => {
      console.log("app is alive N connected to db ;) on port =>", PORT);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the application by calling run()
run().catch(console.dir);
