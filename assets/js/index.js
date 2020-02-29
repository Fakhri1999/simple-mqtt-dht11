// Create a client instance
client = new Paho.MQTT.Client(
  // "127.0.0.1",
  "broker.hivemq.com",
  Number(8000),
  "browser-client"
);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
  console.log("onConnect");
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
    $("#temperature").parent().addClass("blink")
    setTimeout(function(){
      $("#temperature").parent().removeClass("blink")
    }, 500)
  } else if (topic[3] == "humidity") {
    $("#humidity").html(value);
    $("#humidity").parent().addClass("blink")
    setTimeout(function(){
      $("#humidity").parent().removeClass("blink")
    }, 500)
  } else if (topic[3] == "ledStatus") {
    if(value == "ON"){
      $('#led').bootstrapToggle('on', true)
    } else if(value == "OFF"){
      $('#led').bootstrapToggle('off', true)
    }
  }
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

function tes() {
  console.log("Halo");
}
