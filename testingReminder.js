function main() {
  // "advent calendar"
  var TARGET_BOARDS = ["Yakult Salefie", "TimeWork", "Yakult Lady", "Trình - Duyệt [Yakult]", "Jaccs", "ChamCong"];
  var TARGET_LIST = ["TESTING"];
  
  const trelloMembers = {
    "5aaf1ed5c82bdc9214835a5c": {
      id: "5aaf1ed5c82bdc9214835a5c",
      name: "Nguyễn Quang Bình",
      mentionId: 3045376,
      mentionName: "[ESD.HCM]_Nguyen Quang Binh"
    },
    "5e32450276d53b3a9d2a603b": {
      id: "5e32450276d53b3a9d2a603b",
      name: "Nguyễn Thành Tín",
      mentionId: 4499166,
      mentionName: "[ESD.HCM]_Nguyễn Thành Tín"
    },
    "5ce9249a86e4b64759b5ef37": {
      id: "5ce9249a86e4b64759b5ef37",
      name: "Trương Hữu Tài",
      mentionId: 3844509,
      mentionName: "[ESD.HCM]_Trương Hữu Tài"
    },
    "5cecbae160477f713b9521e2": {
      id: "5cecbae160477f713b9521e2",
      name: "Huỳnh Thị Hồng Phúc",
      mentionId: 3844503,
      mentionName: "[ESD.HCM]_Huỳnh Thị Hồng Phúc"
    },
    // "5c4589d44ec1553a127514e9": {
    //   id: "5c4589d44ec1553a127514e9",
    //   name: "Phạm Minh Tài",
    //   mentionId: 3634300,
    //   mentionName: "[ESD.HCM]_PhamMinhTai"
    // },
    "5d83440fed2edb53a9174498": {
      id: "5d83440fed2edb53a9174498",
      name: "Lê Hoàng Long",
      mentionId: 3758952,
      mentionName: "[ESD.HCM]_Le Hoang Long"
    },
    "5f439852332f5c4540a77057": {
      id: "5f439852332f5c4540a77057",
      name: "Đinh Thị Anh Vy",
      mentionId: 5127322,
      mentionName: "[ESD.HCM].DinhThiAnhVy"
    }
  }
  
  var isSendMessages = false;
  var message = '';
  var count = 0;

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
          message += "--------------- TRELLO TESTING REMINDER ---------------\n\n";
          isSendMessages = true;
        }
        
        var showedBoardName = false;
        
        for(var i=0; i<cards.length; i++) {
          if (checkNewCard(cards[i].dateLastActivity) && cards[i].idMembers.length) {
            const cardIdMembers = (cards[i].idMembers + '').split(',');
            for (var indMem=0; indMem<cardIdMembers.length; indMem++) {
              const memberId = cardIdMembers[indMem];
              const member = trelloMembers[memberId];
              if (member) {
                if (!showedBoardName) {
                  message += "[" + listBoard[j].name + "] " + lists[z].name + ":\n";
                  showedBoardName = true;
                }
                
                message += "[To:" + member.mentionId + "]" + member.mentionName + "\n";
              }
            }
            
            message += "[info]";
            message += cards[i].name + "\n";
            message += cards[i].shortUrl + "\n";
            message += "[/info]\n";
            
            count++;
          }
        }
        
        if (showedBoardName) {
          message += "\n";
        }
      }
    }
  }
  
  if (isSendMessages && count) {
    message += "------------ END TRELLO TESTING REMINDER -------------";
    postToChatwork(message)
  } else {
    message = '';
  }
}

function checkNewCard(time) {
  var cardCreatedAt = (new Date(time)).getTime();
  var diff = (new Date()).getTime() - cardCreatedAt;
  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  
  return hh<1 && mm<5;
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
    "headers" : {"X-ChatWorkToken" : "3e413a2e7374adffffff6e4871f3bcac"},
    "payload" : {"body" : message}
  }

  var url = "https://api.chatwork.com/v2/rooms/" + "161675432" + "/messages"
  UrlFetchApp.fetch(url, options)
}