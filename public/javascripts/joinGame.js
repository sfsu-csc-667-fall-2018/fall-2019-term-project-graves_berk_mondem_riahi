// fetch("/lobby/getMessages").then(response => {
//     //jsonify the response
//     response = response.json().then(response => {
//       for (let i = 0; i < response.length; i++) {
//         $("#messages").append($("<li>").text(response[i]["message_text"]));
//       }
//     });
//   });

//gets the username for the guest and host and renders them to the page

//this just gives the url of the current game room, we need this to find the rooms id
let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);

// console.log("trying to fetch games/" + roomId + "/getUsernames");
fetch("/games/" + roomId + "/getUsernames");
