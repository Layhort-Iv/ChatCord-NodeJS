const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages_format");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set the public folder as a static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);
    socket.join(user.room);

    // Welcome to the current user
    socket.emit("message", formatMessage(botName, "Welcome to Chatcord"));

    // Broadcast when a user connects to a specific room
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info, we will print all the username on the side bar
    io.to(user.room).emit("userAndRoomInfo", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  // Listen to the chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    // Emit to everyone
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Run when client disconnect, let everyone know a user has left the chat
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // We will remove the user name from the side bar when a particular user leave
      io.to(user.room).emit("userAndRoomInfo", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
