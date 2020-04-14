const users = [];

// Join user to the chat
function joinUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get the current user
function getCurrentUser(id) {
  return users.find((user) => user.id == id);
}

// User leave the chat
function userLeave(id) {
  // remove the user from the array based on ID
  const index = users.findIndex((user) => user.id === id); // if the user id is not found, it will return -1

  // If we find the user that wanna leave the chat,
  // we want to return the array without that user
  if (index != -1) return users.splice(index, 1)[0];
}

// Get the user's room

function getUsersInRoom(room) {
    return users.filter(user => user.room === room)
}
module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getUsersInRoom
};
