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
    const productsCollection = database.collection(process.env.PRODUCTS_COLLECTION)
    const deliveryCollection = database.collection(process.env.DELIVERY_COLLECTION);
    const expiryCollection = database.collection(process.env.EXPIRY_COLLECTION);


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
    //poast new product
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
    //post new Expriy
    app.post("/postNewExpriry", async (req, res) => {
      try {
        const data = req.body;
        const upload = await expiryCollection.insertOne(data);
        res.send(upload.acknowledged);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
      }
    });
    //post new delivery
    app.post("/postNewDelivery", async (req, res) => {
      try {
        const data = req.body;
        const upload = await deliveryCollection.insertOne(data);
        res.send(upload.acknowledged);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
      }
    });

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
