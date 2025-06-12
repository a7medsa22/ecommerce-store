import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

dotenv.config({path:"config.env"})

//connect with DB
mongoose.connect(process.env.DB_URL)
    .then((conn) => {
    console.log(`DataBase Connected ${conn.connection.host}`);
    })
    .catch((err) => {
    console.error(`DataBase Error ${err}`)
        process.exit(1);
})

//express app 
const app = express();



//middleware
app.use(express.json())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);
 }

 //step 1 create schema  
const CategorySchema = new mongoose.Schema({
    name: String,
})

//step 2 create modle
const Categorymoudle = mongoose.model("category", CategorySchema)



//Route
app.post("/", (req, res) => {
    const name = req.body.name
    console.log(req.body);

    const newCategory = new Categorymoudle({ name })
    newCategory.
        save()
        .then((doc) => {
          res.json(doc)
        })
        .catch((err) => {
        res.json(err);
    })
}) 


app.get("/", (req, res) => {
    res.send("hello Ahmed Sotohy")
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} ...`)
})
// after this you should use (speparation of concerns) go to folders