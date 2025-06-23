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
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/connect";
import routes from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import path from "path";
import { NotificationService } from "./utils/notificationService";

dotenv.config();

const PORT = process.env.PORT || 4000;
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
app.use(express.static(path.join(__dirname, "../public"))); //serves static files

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

    const httpServer = createServer(app);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      let userId: string | null = null;

      socket.on("join", (joinUserId) => {
        userId = joinUserId;
        if (userId) {
          socket.join(userId);
          console.log(
            `✅ User ${userId} joined their room with socket ${socket.id}`
          );
        }

        // Send a confirmation back to the user
        socket.emit("joinConfirmation", { userId, socketId: socket.id });
      });

      socket.on("test-notification", (data) => {
        // Send a test notification back to the user's room
        const testNotification = {
          id: `test-${Date.now()}`,
          type: "comment",
          message: "This is a test notification",
          sender: {
            firstName: "Test",
            lastName: "User",
            username: "testuser",
            avatar: null,
          },
          relatedPost: null,
          relatedComment: null,
          isRead: false,
          createdAt: new Date(),
        };

        io.to(data.userId).emit("notification", testNotification);
      });

      // Handle notification synchronization events
      socket.on("markNotificationAsRead", (data) => {
        if (userId) {
          io.to(userId).emit("notificationRead", data);
        }
      });

      socket.on("deleteNotification", (data) => {
        if (userId) {
          io.to(userId).emit("notificationDeleted", data);
        }
      });

      socket.on("markAllNotificationsAsRead", () => {
        if (userId) {
          io.to(userId).emit("allNotificationsRead");
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Make io accessible throughout the app
    app.set("io", io);

    const notificationService = new NotificationService(io);
    app.set("notificationService", notificationService);

    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}!!`);
      console.log(`Socket.IO server ready`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

export default app;
