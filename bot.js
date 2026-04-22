const http = require("http");

http.createServer((req, res) => {
  res.write("Bot is alive");
  res.end();
}).listen(process.env.PORT || 3000);

const TelegramBot = require("node-telegram-bot-api");

const token = "8564760775:AAFo9ppjEKJRnhqxggTPOhEzG2vpt4BhaAE"; // 🔴 এখানে তোমার bot token বসাও

// 🔵 Main group (যেখানে ছবি পাঠাবে)
const MAIN_GROUP_ID = -1003753627175;

// 🟢 Personal/log group (যেখানে ছবি যাবে)
const LOG_GROUP_ID = -1003921095881;

const bot = new TelegramBot(token, { polling: true });

// 📸 Photo handler
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  // শুধু main group এ কাজ করবে
  if (chatId !== MAIN_GROUP_ID) return;

  const user = msg.from;
  const username = user.username ? "@" + user.username : "No Username";
  const userId = user.id;

  const caption = `
📩 New Photo Received

👤 Username: ${username}
🆔 User ID: ${userId}
`;

  // সবচেয়ে বড় ছবিটা নেওয়া
  const photo = msg.photo[msg.photo.length - 1].file_id;

  try {
    // 📤 Log group এ পাঠানো
    await bot.sendPhoto(LOG_GROUP_ID, photo, { caption });

    // ⏳ 7 সেকেন্ড পর delete
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, msg.message_id);

        // 📢 Message send করবে
        bot.sendMessage(chatId, `আসসালামুয়ালাইকুম। ভাই আপনাকে অসংখ্য ধন্যবাদ জানাই BNCT টিমের পক্ষ থেকে। আমরা আপনার Hom work এডমিন এর কাছে জমা দিয়েছি। তিনি ছবি দেখে আপনার নাম পেজেন্ট দিয়ে দেবেন ইনশাআল্লাহ।
ভালো থাকবেন মন দিয়ে কাজ করবে। ইনশাআল্লাহ অনেক দূর এগিয়ে যাবেন। আল্লাহ হাফেজ।`);
        
      } catch (err) {
        console.log("Delete error:", err.message);
      }
    }, 7000);

  } catch (error) {
    console.log(error);
  }
});
// ▶️ Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `আসসালামুয়ালাইকুম।
BNCT_1360 বটে সগতম।
এই বোট এর কাজ আপনাদের Homwork দেখা এবং নাম প্রেজেন্ট দিয়া।এই বোটটা শুধু BNCT_1360টিম ব্যবহার করতে পারবে।
আল্লাহ হাফেজ।`);
});
