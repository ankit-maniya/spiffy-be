import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { config } from "../config";
import route from "./routes";
import { connectDB } from "./models";
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// get uploaded files
app.get("/file/:imgname", (req, res, next) => {
  const path = config.FILE_STORE_PATH;
  return fs.readFileSync(path + "/" + req.params.imgname);
});

// route
app.use("/", route);

// connect db
connectDB().then(() => {
  console.log("Mongoose connected");
});

// server start
app.listen(config.PORT, () => {
  console.log(`Server Start at ${config.PORT_URL}`);
});
