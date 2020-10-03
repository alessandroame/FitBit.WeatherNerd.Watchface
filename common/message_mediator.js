import * as messaging from "messaging";
import * as mediator from "./mediator";

let radix = "message_";

messaging.peerSocket.onerror = function (err) {
    console.error("MessageMediator error: " + err.code + " - " + err.message);
}

messaging.peerSocket.onmessage = function (evt) {
    var packet = evt.data;
    mediator.publish(radix + packet.topic, packet.data);
}

export function subscribe(topic, callback) {
    mediator.subscribe(radix + topic, callback);
}

export function publish(topic, data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
            topic: topic,
            data: data
        });
        return true;
    } else {
        console.warn("MessageMediator.publish: no peerSocket connection");
        return false;
    }
}