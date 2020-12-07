import document from "document";
import * as settings from "./settings"

export function update(meteo) {
    let index = Math.floor(new Date().getHours());
    if (index > 11) index -= 12;
    let currentWeather = meteo.forecasts[index];
    //    console.error(JSON.stringify(currentWeather));
    let container = document.getElementById("currentWeather");
    let icon = container.getElementById("icon");
    icon.href = "icons/meteo/" + currentWeather.icon + ".png";
    let temp = container.getElementById("temp");
    temp.textContent = " " + parseTemp(currentWeather.temp) + currentWeather.tempUnits;
    container.getElementById("tempShadow").textContent = temp.textContent;
}
function parseTemp(v) {
    if (v < 0 && v > -1) v = 0;
    return v.toFixed();
}
settings.subscribe("weatherWidgetColor", (color) => {
    document.getElementById("currentWeather").getElementById("temp").style.fill = color;
}, "white");
settings.subscribe("weatherBackgroundColor", (color) => {
    document.getElementById("currentWeather").getElementById("background").style.fill = color;
}, "gray");
