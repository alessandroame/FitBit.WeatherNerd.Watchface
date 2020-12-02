import { me as appbit } from "appbit";
import document from "document";
import { goals } from "user-activity";
import * as settings from "./settings";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { display } from "display";
import * as settings from "./settings"

display.addEventListener("change", () => {
  if (display.on) {
      setSensor(sensorIndex);
  } else {
      stopHRM();
      stopInterval();
  }
});


let widget = document.getElementById("fitWidget");
let icon = widget.getElementById("icon");
let value = widget.getElementById("value");
let units = widget.getElementById("units");
let goal = widget.getElementById("goal");
let goalRail = widget.getElementById("goalRail");

let sensorIndex = -1;

let sensorUnits = ["BPM", "Steps", "Floors", "Cal"];
let sensorIcons = ["hr", "stp", "ele", "cal"];

let hrm = new HeartRateSensor();

setSensor(0);
display.addEventListener("change", () => {
    if (display.on) {
        setSensor(sensorIndex);
    } else {
        stopHRM();
        stopInterval();
    }
});

settings.subscribe("fitDataColor",(value)=>{
    if (!value) value="gray";
    widget.style.fill=value;
});
settings.subscribe("fitWidgetBackgroundColor",(value)=>{
    if (!value) value="gray";
    widget.getElementById("background").style.fill=value;
});

export function next() {
    setSensor(sensorIndex + 1);
}
export function prev() {
    setSensor(sensorIndex - 1);
}

function setSensor(index) {
    if (sensorIndex != -1) {
        switch (sensorIndex) {
            case 0:
                stopHRM();
                break;
            default:
                stopInterval();
                break;
        }
    }
    if (index < 0) index = sensorUnits.length - 1;
    else if (index > sensorUnits.length - 1) index = 0;
    sensorIndex = index;
    units.textContent = sensorUnits[sensorIndex];
    switch (sensorIndex) {
        case 0:
            startHRM();
            break;
        default:
            try {
                startInterval();
            } catch (e) {
                console.error(e);
            }
            break;
    }
}

let readIntervalId;
function startInterval() {
    readIntervalId = setInterval(() => {
        doRead();
    }, 1000);
    doRead();
}

function doRead() {
    //console.log("READING")
    let v;
    if (sensorIndex == 1) v = today.local.steps;
    else if (sensorIndex == 2) v = today.local.elevationGain
    else if (sensorIndex == 3) v = today.local.calories
    else return;
    updateValue(v);
}

function stopInterval() {
    if (readIntervalId) {
        clearInterval(readIntervalId);
        readIntervalId = null;
    }
}


let toggle = false;
let oldValue=null;
function updateValue(v) {
    try {
        if(sensorIndex==0 || oldValue && oldValue!=v){
            toggle = !toggle;
        }
        oldValue=v;
        value.textContent = v??"--";
        widget.getElementById("valueShadow").textContent = value.textContent;
        icon.href = `icons/${sensorIcons[sensorIndex]}_${toggle ? '1' : '0'}.png`;

        let goalPerc = null;
        switch (sensorIndex) {
            case 0:
                goalPerc =today.adjusted.activeZoneMinutes.total/ goals.activeZoneMinutes.total;
                //console.log(goals.activeZoneMinutes.total,today.adjusted.activeZoneMinutes.total,goalPerc);
                break;
            case 1:
                    goalPerc = today.adjusted.steps / goals.steps;
                    //console.log(goals.steps,today.adjusted.steps,goalPerc);
                    break;
            case 2:
                if (goals.elevationGain !== null) {
                    goalPerc = today.adjusted.elevationGain / goals.elevationGain;
                    //console.log(goals.elevationGain,today.adjusted.elevationGain,goalPerc);
                }
                break;
            case 3:
                    goalPerc = today.adjusted.calories / goals.calories;
                    //console.log(goals.steps,calories.adjusted.calories,goalPerc);
                break;
        }
        if (!goal) {
            goal.sweepAngle = 0;
            stopInterval();
            return;
        }
        goal.sweepAngle = -120 * (goalPerc > 1 ? 1 : goalPerc);
    } catch (e) {
        console.error(e);
        console.trace();
    }
}

hrm.onerror = function () {
    updateValue("---");
}
hrm.onreading = function () {
    updateValue(hrm.heartRate);
};

function startHRM() {
    hrm.start();
    updateValue(hrm.heartRate);
}
function stopHRM() {
    hrm.stop();
}