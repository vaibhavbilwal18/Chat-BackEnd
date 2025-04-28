const socket = require("socket.io");
const { Chat } = require("../models/chat");
const getSecretRoomId = require("./utils/getSecretRoomId");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust based on your frontend URL
    },
  });

  io.on("connection", (socket) => {

    // Event to handle a user joining the chat
    socket.on("joinChat", async ({ userId, targetUserId }) => {
      try {
        // Generate a unique room ID for the two users
        const roomId = getSecretRoomId(userId, targetUserId);

        // Join the room
        socket.join(roomId);
        
        // Check if the chat already exists between the two users
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        // If the chat doesn't exist, create a new chat document
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
          await chat.save();
        }

        // Emit the chat history to the user when they join
        socket.emit("chatHistory", chat.messages);
      } catch (err) {
        console.error("Error joining chat: ", err);
      }
    });

    // Event to handle sending a new message
    socket.on("sendMessage", async ({ senderId, targetUserId, text }) => {
      try {
        // Generate the room ID
        const roomId = getSecretRoomId(senderId, targetUserId);

        // Check if the chat exists between the two users
        let chat = await Chat.findOne({
          participants: { $all: [senderId, targetUserId] },
        });

        // If no chat exists, create a new one
        if (!chat) {
          chat = new Chat({
            participants: [senderId, targetUserId],
            messages: [],
          });
        }

        // Add the new message to the chat
        chat.messages.push({
          senderId,
          text,
        });

        // Save the updated chat to the database
        await chat.save();

        // Emit the new message to both users in the room
        io.to(roomId).emit("messageReceived", {
          senderId,
          text,
        });
      } catch (err) {
        console.error("Error sending message: ", err);
      }
    });

    // Handle user disconnection (optional)
    socket.on("disconnect", () => {
      // Handle disconnection logic if needed
    });
  });
};

module.exports = initializeSocket;
