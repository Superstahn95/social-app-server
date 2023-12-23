const express = require("express");
const http = require("http"); //newly added for my socket sake
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { fileURLToPath } = require("url"); //will allow us to set the path when we configure directories later on..when using modules
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDb = require("./config/db");
const globalErrorHandler = require("./controllers/errorController");
const webSocket = require("socket.io");

// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });
// io.on("connection", (socket) => {
//   console.log("a user connected");
//   console.log(socket);
// });

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const io = webSocket(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const PORT = process.env.PORT || 3001;
// configurations
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)  if i decide to use modules instead of common js

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/post", require("./routes/postRoute"));
app.use("/api/v1/comment", require("./routes/commentRoute"));
app.use("/api/v1/conversation", require("./routes/conversationRoute"));
app.use("/api/v1/message", require("./routes/messageRoute"));
//global error handler
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Something went wrong";
//   res.status(statusCode).json({
//     status: "failed",
//     message,
//     err,
//   });
// });
app.use(globalErrorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
  connectDb();
});
let users = [];
console.log(users);
const addUser = (userId, socketId) => {
  return (
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
  );
};
const getUser = (id) => {
  return users.find((user) => user.userId === id);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.on("addUser", (userId) => {
    console.log(`The socket id is....${socket.id}`);
    //push user and scoket.id object to users array if it does not already exist
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    console.log(users);
  });
  socket.on("sendMessage", (data) => {
    //get prospective receiver from the users array
    const { text, senderId, receiverId } = data;
    console.log(text);
    const messageReceiver = getUser(receiverId);
    console.log(messageReceiver);
    io.to(messageReceiver.socketId).emit("getMessage", {
      text,
      senderId,
    });
  });
});

// text: newMessage,
// senderId: userId,
// receiverId,

// senderId
// senderId,
// {text: "Hey fake guy", senderId: "65786ea5baa4a1e1f0d28cb4", receiverId: "6580988e8f640bb1d7063da9"}
