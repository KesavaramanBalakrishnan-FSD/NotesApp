const mongoose = require("mongoose");

//it remove some of the warning that we get in the terminal
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const dbconnect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Database connected at HOST:${dbconnect.connection.host} 
      & Database name is ${dbconnect.connection.name}.`
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
