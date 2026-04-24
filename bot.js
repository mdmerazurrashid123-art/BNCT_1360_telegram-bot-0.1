const http = require("http");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// 🌐 Keep alive server
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is alive");
}).listen(process.env.PORT || 3000);

// 🔐 Secure token
const token = 8564760775:AAFo9ppjEKJRnhqxggTPOhEzG2vpt4BhaAE;

// 🔵 Groups
const MAIN_GROUP_ID = -1003978339511;
const LOG_GROUP_ID = -1003921095881;

const bot = new TelegramBot(token, { polling: true });

// 📸 PHOTO HANDLER
bot.on("photo", async (msg) => {
  const chatId = Number(msg.chat.id);

  // শুধু main group
  if (chatId !== Number(MAIN_GROUP_ID)) return;

  // photo check
  if (!msg.photo || msg.photo.length === 0) return;

  const user = msg.from;
  const username = user.username ? "@" + user.username : "No Username";
  const userId = user.id;

  const photo = msg.photo[msg.photo.length - 1].file_id;

  const caption = `
📩 New Photo Received

👤 Username: ${username}
🆔 User ID: ${userId}
`;

  try {
    // 📤 send to log group
    await bot.sendPhoto(LOG_GROUP_ID, photo, { caption });

    // ⏳ delete + reply after 7 sec
    setTimeout(() => {
      bot.deleteMessage(chatId, msg.message_id)
        .catch(err => console.log("❌ Delete error:", err.message));

      bot.sendMessage(
        chatId,
        `আসসালামুয়ালাইকুম।

BNCT_1360 টিম আপনার ছবি গ্রহণ করেছে।
আপনার কাজ চেক করা হচ্ছে ইনশাআল্লাহ।

ধন্যবাদ। আল্লাহ হাফেজ।`
      ).catch(err => console.log("❌ Send error:", err.message));

    }, 7000);

  } catch (error) {
    console.log("❌ Photo handler error:", error.message);
  }
});

// ▶️ START COMMAND
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `
আসসালামুয়ালাইকুম।
BNCT_1360 বটে আপনাকে স্বাগতম।

এই বট আপনার homework গ্রহণ করে এবং admin এর কাছে পাঠায়।

ধন্যবাদ।
`);
});