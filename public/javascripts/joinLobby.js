//get all the lobby messages
fetch("/lobby/getMessages").then(response => {
  //jsonify the response
  response = response.json().then(response => {
    for (let i = 0; i < response.length; i++) {
      $("#messages").append($("<li>").text(response[i]["message_text"]));
    }
  });
});

fetch("/lobby/getRooms").then(response => {
  //jsonify the response
  response = response.json().then(response => {
    for (let i = 0; i < response.length; i++) {
      $("#roomList").append(
        " <li> Room: <a href = games/" +
          response[i]["room_id"] +
          "> " +
          response[i]["room_name"]
      );
    }
  });
});

//get all the lobby rooms
