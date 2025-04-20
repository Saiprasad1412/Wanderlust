const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MongoUrl = "mongodb://localhost:27017/Airbnb";
main().then(()=>{
    console.log("conected to database");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MongoUrl);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67d5dacaf441fa3d74fa9027"}));
    await Listing.insertMany(initData.data);
    console.log("DATA WAS SAVED");
};
initDB();