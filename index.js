import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
// import UserModel from "./models/UserModel.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
  // await UserModel.sync(); => jika table sudah ada di database, maka tidak perlu dijalankan lagi
} catch (error) {
  console.log(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(router);

app.listen(6666, () => console.log("Server Running at Port 6666"));
