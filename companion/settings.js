import { settingsStorage } from "settings";
import * as mediator from "../common/mediator";

export function init() {
  console.log("settings init")

  let toAvoidPropagation=[];
  settingsStorage.addEventListener("change", (evt) => {
     if (evt.key[0] == '_') {
      toAvoidPropagation.push(evt.key);
      console.warn("<<<<<<<< accrocchio "+evt.key+" >>>>>>>>");
      evt.key = evt.key.substring(1);
       evt.oldValue = null;
       evt.newValue = settingsStorage.getItem(evt.key);

     }
    if (toAvoidPropagation.indexOf(evt.key)==-1) notify(evt);
  });
}

export function set(key,value){
  settingsStorage.setItem(key,value);
}
export function get(key,defvalue){
  return JSON.parse(settingsStorage.getItem(key,defvalue));
}

export function subscribe(key, callback) {
  mediator.subscribe("setting_"+key, (data) => {
    callback(data.value);
  });
  let value=get(key,null);
  if (value!=null) callback(value);
}

function notify(evt) {
  const data = {
    key: evt.key,
    oldValue: JSON.parse(evt.oldValue),
    value: JSON.parse(evt.newValue)
  };
  let topic="setting_"+evt.key;
  mediator.localPublish(topic, data);
 if (!mediator.remotePublish("setting", data)) console.warn("cant publish on remote endopoint "+topic);
}

