require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const ogs = require("open-graph-scraper");
const firebase = require("firebase");

const token = "1289226114:AAFiRVhtG0YFFG6QTK0ukewSIGfLJIHA0MU";
const bot = new TelegramBot(token, { polling: true });

const intro = bot.once("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "mau nyimpen data  , pake aja perintah  /nambahin + link atau url yang pengen kamu simpan yaa  "
  );
});

const app = firebase.initializeApp({
  apiKey: "AIzaSyCkSp7m8d1BLtP29dtrvjQ8334490",
  authDomain: "annoyingbot-b45df.firebaseapp.com",
  databaseURL: "https://annoyingbot-b45df.firebaseio.com",
  projectId: "annoyingbot-b45df",
  storageBucket: "annoyingbot-b45df.appspot.com",
  messagingSenderId: "40628170270",
});

const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

let siteUrl;

bot.onText(/\/nambahin (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id, "Pilih Kategori nya dulu dong  😁️ 😁️ 😁️ ?", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Development",
            callback_data: "development",
          },
          {
            text: "Music",
            callback_data: "music",
          },
          {
            text: "Apa aja Boleh ",
            callback_data: "apa_aja",
          },
        ],
      ],
    },
  });
});

bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  ogs({ url: siteUrl }, function (error, results) {
    if (results.success) {
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data,
      });
      bot.sendMessage(
        message.chat.id,
        'Yeayyy Data Berhasil Ditambahkan  😊️😊️😊️😊️  "' +
          results.data.ogTitle +
          '" to category "' +
          callbackQuery.data +
          '"!'
      );
    } else {
      sitesRef.push().set({
        url: siteUrl,
      });
      bot.sendMessage(
        message.chat.id,
        "Yahhh 😒️😒️😒️ , Datanya gk bisa ditambahkan nihh  !"
      );
    }
  });
});
