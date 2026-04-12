import mongoose from "mongoose"; 

const mongoConnection = async()=>{
    try {
        const mongo_url = process.env.mongoUrl || "mongodb://localhost:27017/socialconnect";
        await mongoose.connect(mongo_url);
        console.log("Database connected!");
    } catch (error) {
        console.log("error in connection");
        console.log(error)
    }
}

export default mongoConnection;
