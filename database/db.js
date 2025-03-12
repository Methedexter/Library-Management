const mongoose = require("mongoose")

require('dotenv').config();

url = process.env.MONGO_URL || "Your mongodb url"

mongoose.connect(url)
.then(()=> console.log("Mongo sb connencted"))
.catch((e)=> console.log(e));