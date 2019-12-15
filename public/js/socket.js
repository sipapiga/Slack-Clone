const socket = io.connect("http://localhost:3000");

socket.on("message", (msg, user) => {
  addMessage(msg, user);
});


$(() => {
  let channelId;
  $("#send").click(() => {
    channelId = $("#channelId").val();
    sendMessage(channelId, $("#messageText").val());
  });
});

function addMessage(message, user) {
  let day = message.createdAt.split("-");
  let year = day[0];
  let month = day[1];
  day = message.createdAt.split("T");
  day = day[0].split("-");
  day = day[2];
  let time = message.createdAt.split(":");
  let minutes = time[1];
  time = message.createdAt.split("T");
  time = time[1].split(":");
  time = time[0];

  const scrollBottom = $("#append").scrollTop() + $("#append").height();

  $("#append").append(` 
  <div class="mb-3">
  <div class="row justify-content-between my-0">
    <p class="lead font-weight-bold">
      ${user}
    </p>
    <p class="lead font-size-sm">
     ${day}-${month}-${year} ${time}:${minutes}
    </p>
  </div>
  <div class="row">
    <p class="lead">
      ${message.text}
    </p>
  </div>
</div>`);
  $("#messageText").val("");
}

function sendMessage(channelId, msg) {
  $.post("http://localhost:3000/messages", { msg, channelId });
}
