const mongoose = require("mongoose")

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL || "your url")
.then(()=> console.log("Mongo sb connencted"))
.catch((e)=> console.log(e));