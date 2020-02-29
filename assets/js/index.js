let hostname = window.location.hostname;
let protocol = window.location.protocol;
let useSSL = hostname == "localhost" || protocol == "file:" ? false : true;

// Create a client instance
client = new Paho.MQTT.Client(
  "broker.hivemq.com",
  Number(8000),
  `client-id-${parseInt(Math.random() * 1000)}`
);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect, useSSL: useSSL });
$("#led").bootstrapToggle("disable");

// called when the client connects
function onConnect() {
  isSensorActive();
  console.log("onConnect");
  $("#led").bootstrapToggle("enable");
  client.subscribe("/fakhri19/esp32/#");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  console.log(responseObject);
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  let topic = message.destinationName;
  let value = message.payloadString;
  topic = topic.split("/");
  if (topic[3] == "temperature") {
    $("#temperature").html(value);
    $("#temperature")
      .parent()
      .addClass("blink");
    setTimeout(function() {
      $("#temperature")
        .parent()
        .removeClass("blink");
    }, 500);
  } else if (topic[3] == "humidity") {
    $("#time").addClass("blink");
    $("#humidity").html(value);
    $("#humidity")
      .parent()
      .addClass("blink");
    setTimeout(function() {
      $("#time").removeClass("blink");
      $("#humidity")
        .parent()
        .removeClass("blink");
    }, 500);
  } else if (topic[3] == "ledStatus") {
    if (value == "ON") {
      $("#led").bootstrapToggle("on", true);
    } else if (value == "OFF") {
      $("#led").bootstrapToggle("off", true);
    }
  }
  firstMessage = true;
  var currentdate = new Date();
  var datetime = `${currentdate.getDate()}/${currentdate.getMonth() +
    1}/${currentdate.getFullYear()}, ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
  console.log(datetime);
  $("#time").html(datetime);
  console.log(`${topic[3]} : ${value}`);
}

$("#led").change(function() {
  message = new Paho.MQTT.Message(checkLEDStatus() ? "1" : "0");
  message.destinationName = "/fakhri19/esp32/led";
  client.send(message);
});

function checkLEDStatus() {
  return document.getElementById("led").checked;
}

let firstMessage = false;

function isSensorActive() {
  setTimeout(function() {
    if (!firstMessage) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: "The sensor is currently offline"
      });
      console.log("kosong");
    }
  }, 2500);
}
