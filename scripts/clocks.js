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


// =================== Find Next Clock Strike Event ===================
function getClockStrikeEvents() {
  return (!settings || !settings.clockStrike) ? [] : [getClockStrikeEvent(settings.clockStrike)];
}

function getClockStrikeEvent(clockStrike) {
  return {
      type: "ClockStrikeEvent",
      dateTime: getNextRoundDate(clockStrike)
  };
}

function getNextRoundDate(clockStrike){
  let now = new Date();
  const currentMinutes = now.getMinutes();
  
  // Calculate how many minutes need to be added to make it divisible by clockStrike
  const minutesToAdd = clockStrike - (currentMinutes % clockStrike);
  
  // Create a new Date object for the next occurrence
  const SECOND_MILLIS = 60000;
  now.setMinutes(currentMinutes, 0, 0); // puts seconds and milliseconds to zero 
  const nextDate = new Date(now.getTime() + minutesToAdd * SECOND_MILLIS);
  
  return nextDate;
}
// ====================================================================
