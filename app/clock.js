import { display } from "display";
import clock from "clock";
import * as datum from "./datum"
import document from "document";
import * as settings from "./settings"
import * as geom from './geom'

let clockContainer = document.getElementById("clock");
let hands = clockContainer.getElementById("hands");
let hourHand = hands.getElementById("hours");
let minHand = hands.getElementById("mins");
let secHand = hands.getElementById("secs");

let hourHandShadow = clockContainer.getElementById("hoursShadow");
let minHandShadow = clockContainer.getElementById("minsShadow");
let secHandShadow = clockContainer.getElementById("secsShadow");

settings.subscribe("clockBackgroundColor", (color) => {
//  document.getElementById("clockBackground").gradient.colors.c1 = color;
  document.getElementById("clockBackgroundGradient").style.fill = color;
}, "#333333");

settings.subscribe("clockDialHoursColor", (color) => {
  document.getElementById("clockDialHours").style.fill = color;
}, "#333333");

settings.subscribe("clockDialMinutesColor", (color) => {
  document.getElementById("clockDialMinutes").style.fill = color;
}, "#333333");

settings.subscribe("secondsHandColor", (value) => {
  console.log("seconds hand color: " + value);
  secHand.getElementById("hand").style.fill = value;
}, "red");

settings.subscribe("minutesHandColor", (value) => {
  console.log("minutes hand color: " + value);
  minHand.getElementById("hand").style.fill = value;
}, "white");

settings.subscribe("hoursHandColor", (value) => {
  console.log("hours hand color: " + value);
  hourHand.getElementById("hand").style.fill = value;
}, "white");

clock.granularity = "seconds";
clock.addEventListener("tick", updateClock);


export function init() {
  console.log("clock init");
  datum.init();
}

export function show() {
  clockContainer.style.display = "inline";
}
export function hide() {
  clockContainer.style.display = "none";
}
let oldMins, oldSecs;
function updateClock() {
  let now = new Date();
  let hours = now.getHours() % 12;
  let mins = now.getMinutes();
  let secs = now.getSeconds();

  if (oldMins != mins) {
    hourHand.groupTransform.rotate.angle = geom.hoursToAngle(hours, mins);
    hourHandShadow.groupTransform.rotate.angle = geom.hoursToAngle(hours, mins);

    minHand.groupTransform.rotate.angle = geom.minutesToAngle(mins);
    minHandShadow.groupTransform.rotate.angle = geom.minutesToAngle(mins);
    oldMins = mins;
  }

  if (oldSecs!= secs) {
    let secAng = geom.secondsToAngle(secs);
    secHand.groupTransform.rotate.angle = secAng;
    secHandShadow.groupTransform.rotate.angle = geom.secondsToAngle(secs);
    oldSecs = secs;
  }
}