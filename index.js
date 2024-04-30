const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TRIP_USER}:${process.env.TRIP_PASS}@cluster0.zkk0rbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristSpotCollection = client
      .db("touristSpotDB")
      .collection("touristSpot");

    const countryCollection = client.db("touristSpotDB").collection("country");
    const subCountryCollection = client.db("touristSpotDB").collection("subCountry");

    app.get("/touristspot", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/mylist/:email", async (req, res) => {
      const result = await touristSpotCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/touristspot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.put("/touristspot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateTouristSpot = req.body;
      const updateSpot = {
        $set: {
          image: updateTouristSpot.image,
          touristsSpotName: updateTouristSpot.touristsSpotName,
          countryName: updateTouristSpot.countryName,
          location: updateTouristSpot.location,
          description: updateTouristSpot.description,
          averageCost: updateTouristSpot.averageCost,
          seasonality: updateTouristSpot.seasonality,
          traveltime: updateTouristSpot.traveltime,
          totalVisitorsPerYear: updateTouristSpot.totalVisitorsPerYear,
        },
      };
      const result = await touristSpotCollection.updateOne(filter, updateSpot);
      res.send(result);
    });

    app.post("/touristspot", async (req, res) => {
      const touristSpot = req.body;
      const result = await touristSpotCollection.insertOne(touristSpot);
      res.send(result);
    });

    app.delete("/mylist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/country", async (req, res) => {
      const result = await countryCollection.find().toArray();
      res.send(result)
    });

    app.get("/subCountry/:name", async (req, res) => {
      const name = req.params.name;
      const query = {country_Name: name}
      const result = await subCountryCollection.find(query).toArray();
      res.send(result)
    });
    app.get("/country/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await subCountryCollection.findOne(query)
      res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism Management website server running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
