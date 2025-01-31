const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42yqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // TUTORS RELATED API's
const tutorsCollection = client.db('Shuvolingo').collection('tutors');
const bookedTutorsCollection = client.db('Shuvolingo').collection('bookedTutors');

app.get('/tutors', async(req, res) => {
  const email = req.query.email;
  const language = req.query.language;
  let query = {};
  if(email){
    query.email = email
  }
  if(language){
    query.language = language;
  }
    const cursor = tutorsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/tutors/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await tutorsCollection.findOne(query);
  res.send(result);
})

app.post('/tutors', async(req, res) => {
  const newTutor = req.body;
  const result = await tutorsCollection.insertOne(newTutor);
  res.send(result);
})

app.post('/bookedtutors', async (req, res) => {
  try {
    const { tutorId, image, language, price, tutorEmail, email } = req.body;
    const bookedTutor = {
      tutorId: new ObjectId(tutorId),
      image,
      language,
      price,
      tutorEmail,
      email,
    };
    const result = await bookedTutorsCollection.insertOne(bookedTutor);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Error booking tutor', error });
  }
});


app.get('/bookedtutors', async(req, res) => {
  const email = req.query.email;
  const query = {email: email};
  const result = await bookedTutorsCollection.find(query).toArray();
  res.send(result);
})

app.put('/tutors/review/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const update = {$inc: {review: 1}};
  const options = {returnOriginal: false};
  const result = await tutorsCollection.findOneAndUpdate(filter, update, options);
  res.send(result)
})


app.put("/tutors/:id", async (req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true};
  const updatedTutorial = req.body;
  const tutorial = {
    $set: {
      name: updatedTutorial.name,
      email: updatedTutorial.email,
      image: updatedTutorial.image,
      language: updatedTutorial.language,
      price: updatedTutorial.price,
      review: updatedTutorial.review,
      description: updatedTutorial.description,
    }
  }
  const result = await tutorsCollection.updateOne(filter, tutorial, options)
  res.send(result);
});

app.delete('/tutors/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await tutorsCollection.deleteOne(query);
  res.send(result);
})






  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your Language is getting Easy')
})

app.listen(port, () => {
    console.log(`Languages are waiting at: ${port}`)
})