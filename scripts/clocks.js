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
const SECOND_MILLIS = 60000;
// const settings = {clockStrike: 15};
// console.log(getClockStrikeEvents());

function getClockStrikeEvents() {
  return (!settings || !settings.clockStrike) ? [] : [getClockStrikeEvent(settings.clockStrike, -1), getClockStrikeEvent(settings.clockStrike, 0), getClockStrikeEvent(settings.clockStrike, 1)];
}

function getClockStrikeEvent(clockStrike, shift = 0) {
  return {
      type: "ClockStrikeEvent",
      dateTime: getNextRoundDate(clockStrike, shift)
  };
}

function getNextRoundDate(clockStrike, shift = 0){
  let now = new Date();
  const currentMinutes = now.getMinutes();
  now.setMinutes(currentMinutes, 0, 0); // remove seconds and milliseconds
  
  // Calculate how many minutes need to be added to make it divisible by clockStrike
  const minutesToAdd = clockStrike - (currentMinutes % clockStrike);
  const nextDate = new Date(now.getTime() + minutesToAdd * SECOND_MILLIS + shift * clockStrike * SECOND_MILLIS);
  
  return nextDate;
}
// =============================================================
