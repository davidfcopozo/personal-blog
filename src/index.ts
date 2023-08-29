import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connect";
import routes from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
//import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_DB: string = process.env.MONGO_DB as string;

const app = express();

//Middlewares
app.use(express.json()); //transforms req.body into json
app.use(express.urlencoded({ limit: "5mb", extended: true })); //transforms req.body into urlencoded
app.use(cookieParser(process.env.JWT_SECRET)); //parses cookies
app.use(morgan("dev")); //logs requests
app.use(bodyParser.json({ limit: "5mb" })); //parses json
app.use(cors()); //allows cross origin requests
app.use(helmet()); //sets various http headers for security
app.use(hpp()); //prevents http parameter pollution
app.use(mongoSanitize()); //prevents nosql injections

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter); //limits requests

app.use("/", routes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await connectDB(MONGO_DB);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}!!`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
