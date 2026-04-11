import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL);

    console.log("DB CONNECTED");
  } catch (err) {
    console.log(err, "DB NOT CONNECTED");
  }
};

export default connectDB;
