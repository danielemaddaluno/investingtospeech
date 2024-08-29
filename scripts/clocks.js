// Copyright 2024 Daniele Maddaluno
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// =================== ⏱️ Find Strike Events ===================
const SECONDS = 60;
const MILLIS = 1000;
// const settings = {clockStrike: 2, alertTriggers: [60, 300]};
// console.log(getClockStrikeEvents());

function getClockStrikeEvents() {
  if(!settings || !settings.clockStrike) return [];
  if(!settings || !settings.alertTriggers || settings.alertTriggers.length === 0) return [];

  let i = 0;
  let vector = [];
  const maxAlertTrigger = Math.max(...settings.alertTriggers);

  let now = new Date();
  let end = new Date(now.getTime() + secondsToMillis(maxAlertTrigger));
  let cse;

  do{
    cse = getClockStrikeEvent(settings.clockStrike, i++);
    vector.push(cse);
  } while(cse.dateTime.getTime() <= end.getTime())
  
  return vector;
}

function getClockStrikeEvent(clockStrike, shift = 0) {
  return {
      type: "ClockStrikeEvent",
      dateTime: getRoundDateTime(clockStrike, shift)
  };
}

function getRoundDateTime(clockStrike, shift = 0){
  let now = new Date();
  const currentMinutes = now.getMinutes();
  now.setMinutes(currentMinutes, 0, 0); // remove seconds and milliseconds
  
  // Calculate how many minutes need to be added to make it divisible by clockStrike
  const minutesToAdd = clockStrike - (currentMinutes % clockStrike);
  const nextDate = new Date(now.getTime() + minutesToMillis(minutesToAdd) + shift * minutesToMillis(clockStrike));
  
  return nextDate;
}

function secondsToMillis(seconds){
  return seconds * MILLIS;
}

function minutesToMillis(minutes){
  return minutes * SECONDS * MILLIS;
}
// =============================================================
