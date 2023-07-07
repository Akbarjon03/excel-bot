var token = " ";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = " ";

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function sendMessage(id, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var ssId = " ";
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName(" ");

  if (contents.callback_query) {
    var id = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    if (data == "Byudjet") {
    var Byudjet = sheet.getDataRange().getCell(1, 2).getValue();
    return sendMessage(id, Byudjet);
  } else if (data == "Xarajatlar") {
    var Xarajatlar = sheet.getDataRange().getCell(2, 2).getValue();
    return sendMessage(id, Xarajatlar);
  } else if (data == "Qoldiq") {
    var Qoldiq = sheet.getDataRange().getCell(3, 2).getValue();
    return sendMessage(id, Qoldiq);
  } 

  } else if (contents.message) {
    var id = contents.message.from.id;
    var text = contents.message.text;
    if (text.indexOf("-") !== -1){
      var dateNow = new Date
      var reformmatedDate = dateNow.getMonth() + 1 + "/" + dateNow.getDate();
      var item = text.split("-");
      sheet.appendRow([reformmatedDate, item[0], item[1]]);
      return sendMessage(id, "Xarajatlaringizga qo'shildi!");
    } else {
      var keyBoard = {
        "inline_keyboard": [
        [{
          "text" : "Byudjet",
          "callback_data" : "Byudjet"
        }],
        [{
          "text" : "Xarajatlar",
          "callback_data" : "Xarajatlar"
        }],
        [{
          "text" : "Qoldiq",
          "callback_data" : "Qoldiq"
        }]
        ]
      };
      return sendMessage(id, "Malumotlarni shu ko'rinishda yozing: Element - Narx", keyBoard);
    }
  }
}
