const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get the username and room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join the chat room
socket.emit("joinRoom", { username, room });

// Get room and user info
socket.on("userAndRoomInfo", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Everytime we get the message, we want to automatically scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  // preventDefault(): cancels the event if it is cancelable, meaning that
  // the default action that belongs to the event will not occur.
  e.preventDefault();

  // Get the message from the chat form, msg is the id
  const msg = e.target.elements.msg.value;

  //   console.log(msg);

  // Emit the message to the server
  socket.emit("chatMessage", msg);

  // Clear the input box after submit a message
  e.target.elements.msg.value = "";

  // After submit the message, it still focus on that input box
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
      ${message.textMessage}
  </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// Add user to DOM
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
