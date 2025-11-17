const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();
const routes = require("./routes/userrouter.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.CLIENT_URL || "*", 
  credentials: true,
}));

app.use(fileUpload({
  useTempFiles: true,       
  tempFileDir: "/tmp/",    
}));


app.use("/api/user", routes);

app.get("/", (req, res) => res.send("Server is running"));


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, 
    });
    console.log("Database connected");
  } catch (err) {
    console.log("Database NOT connected:", err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000); 
  }
};

connectDB();

module.exports = app;
