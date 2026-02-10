import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log(err, "DB NOT CONNECTED");
  }
};

export default connectDB;
