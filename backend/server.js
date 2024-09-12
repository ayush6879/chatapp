const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const router = require("./routes/chatRoutes");
const path = require("path");
const cors = require('cors'); 

dotenv.config();

connectDB();
const app = express();
app.use(cors());


app.use(express.json()); //to accept json data

// app.get("/", (req, res) => {
//   res.send("APi is running great");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment 

const __dirname1 = __dirname;

if (process.env.NODE_ENV === "production") {
  // Serve static files from the 'frontend/build' directory
  app.use(express.static(path.join(__dirname1, "..", "frontend", "build")));

  // Catch-all route to serve 'index.html'
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, "..", "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running Successfully");
  });
}

// Deployment 

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`server started on port ${PORT}`.yellow)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,

  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("char users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
