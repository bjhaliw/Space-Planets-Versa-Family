import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { display } from "display";
import { BodyPresenceSensor } from "body-presence";

// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the <text> element
const clockLabel = document.getElementById("clockLabel");
const clockLabel2 = document.getElementById("clockLabel2");
const dateLabel = document.getElementById("dateLabel");
const dateLabel2 = document.getElementById("dateLabel2");
const stepsLabel = document.getElementById("stepsLabel")
const stepsLabel2 = document.getElementById("stepsLabel2")
const caloriesLabel = document.getElementById("caloriesLabel")
const caloriesLabel2 = document.getElementById("caloriesLabel2")
const heartLabel = document.getElementById("heartLabel")
const heartLabel2 = document.getElementById("heartLabel2")
const zoneLabel = document.getElementById("zoneLabel")
const zoneLabel2 = document.getElementById("zoneLabel2")

let bps = undefined
let hrm = undefined

if (BodyPresenceSensor) {
  bps = new BodyPresenceSensor();
  bps.start()
}

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  hrm = new HeartRateSensor();
  
  hrm.addEventListener("reading", () => {
    heartLabel.text = `${hrm.heartRate}`;
    heartLabel2.text = `${hrm.heartRate}`;
  });
} else {
  heartLabel.text = "--";
  heartLabel2.text = "--";
}

function stopHRM()  {
  if (typeof(hrm) !== "undefined") {
      hrm.stop()
        heartLabel.text = `--`;
        heartLabel2.text = `--`;
  }
}

function startHRM () {
  console.log("in hrm")
  if (typeof(hrm) !== "undefined") {
      hrm.start()
    console.log("starting")
  }
}

function getAllStats() {
    if (appbit.permissions.granted("access_activity")) {
      stepsLabel.text = `${today.adjusted.steps}`;
      caloriesLabel.text = `${today.adjusted.calories}`
      stepsLabel2.text = `${today.adjusted.steps}`;
      caloriesLabel2.text = `${today.adjusted.calories}`
      zoneLabel.text = `${today.adjusted.activeZoneMinutes.total}`
      zoneLabel2.text = `${today.adjusted.activeZoneMinutes.total}`
      
    } else {
      stepsLabel.text = "--";
      caloriesLabel.text = "--";
      stepsLabel2.text = "--";
      caloriesLabel2.text = "--";
      zoneLabel.text = "--";
      zoneLabel2.text = "--";
    }
}
   
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours()
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
      hours = util.zeroPad(hours);
  }

  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
   
  clockLabel.text = `${hours}:${mins}`
  clockLabel2.text = `${hours}:${mins}`
  
  if (typeof(bps) !== undefined) {
    console.log("in the true")
    if(bps.present && display.on) {
      startHRM()
    } else {
      stopHRM()
    }
  }
  
  dateLabel.text = `${evt.date.toString().substring(0, 10)}`
  dateLabel2.text = `${evt.date.toString().substring(0, 10)}`
  
  getAllStats()
}