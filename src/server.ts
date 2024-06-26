import app from "./app";
import config from "./app/config";
import mongoose from "mongoose";

async function main() {
    try{
        await mongoose.connect(config.databaseURL as string);
    }
    catch(err){
        console.log(err);
    }
    
}

app.listen(config.port, () => {
    console.log(`data management system is running on port ${config.port}`)
  })

main()