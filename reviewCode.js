function main() {
  // "advent calendar"
  var TARGET_BOARDS = ["Yakult Salefie", "TimeWork", "Yakult Lady", "Trình - Duyệt [Yakult]", "Jaccs", "ChamCong"];
  var TARGET_LIST = ["REVIEW (MERGE CODE)"]
  
  var isSendMessages = false;
  var message = '';

  // "advent calendar"
  var listBoard = getItemId("members","5aaf1ed5c82bdc9214835a5c","boards",TARGET_BOARDS)

  for (var j=0; j<listBoard.length; j++) {
    const curBoardId = listBoard[j].id;

    // "todo"
    var lists = getItemId("boards", curBoardId, "lists", TARGET_LIST)
    
    for (var z=0; z<lists.length; z++) {
      const id = lists[z].id;

      // リスト中のカードを取得
      var url = buildTrelloUrl("lists",id,"cards")
      var cards = JSON.parse(UrlFetchApp.fetch(url).getContentText())["cards"];
      
      if (cards.length) {
        if (!isSendMessages) {
          message += "------------ TRELLO REMINDER -------------\n\n";
          isSendMessages = true;
        }
        
        message += "[" + listBoard[j].name + "] " + lists[z].name + ":\n"
        for(var i=0; i<cards.length; i++) {
          message += "[info]";
          message += cards[i].name + "\n";
          message += cards[i].shortUrl + "\n";
          message += "[/info]\n";
          
          // Use for debug card
          //var keyCards = Object.keys(cards[i]);
          //message += "[info]";
          //for (var ind=0; ind<keyCards.length; ind++) {
          //  message += keyCards[ind] + "\n";
          //}
          //message += cards[i].checkItemStates + "\n";
          //message += "[/info]";
        }
        message += "\n";
      }
    }
  }
  
  if (isSendMessages) {
    message += "---------- END TRELLO REMINDER ----------";
    postToChatwork(message)
  }
}

function getItemId(api, id, item, targetName){
  var url = buildTrelloUrl(api, id, item)
  var list = JSON.parse(UrlFetchApp.fetch(url).getContentText())[item];

  var listItemId = [];
  for(var i=0; i<list.length; i++){
    if(targetName.includes(list[i]["name"])){
      listItemId.push({ id: list[i]["id"], name: list[i]["name"] });
    }
  }
  
  return listItemId;
}

function buildTrelloUrl(api, id, item){
  return "https://api.trello.com/1/" + api + "/" + id + "?key=" + "ddd28356d2b62f55b74e1801c37c7be2" + "&token=" + "2e6b580fdd286ad20cbaa4c9956a49e0b4844ef34b4145bc6457bed123b74f61" + "&" + item + "=open"
}

function postToChatwork(message){
  var options = {
    "method" : "post",
    "headers" : {"X-ChatWorkToken" : "1171884c7dc94d0e8d42585d3225df22"},
    "payload" : {"body" : message}
  }

  var url = "https://api.chatwork.com/v2/rooms/" + "196059770" + "/messages"
  UrlFetchApp.fetch(url, options)
}