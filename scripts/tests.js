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

// To use tests.js from the console:
// - open the inspector
// - open console tab
// - change the dropdown value from "top" to "Investing To Speech"
// - then you should be able to call all the functions that are written here

const ITS_TESTS_JS = "tests.js";

function logLevel(level){
  log.logLevel = "info";
  log.update(ITS_TESTS_JS, `Updated log level: ${level}`);
  log.logLevel = level;
}

const test = false;
const nextMin = getNextMinute();
function getNextMinute() {
  // Get the current date and time
  const now = new Date();

  // Add one minute to the current time
  now.setMinutes(now.getMinutes() + 2);

  // Get the hours and minutes from the updated time
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Format the time as "hh:mm"
  return `${hours}:${minutes}`;
}

if(test){
  window.addEventListener('load', () => {
    //console.log(new Date("Tuesday, August 27, 2024 11:51 GMT-0500").toUTCString())

    const events = getEconomicEvents();
    log.info(ITS_TESTS_JS, "economic events:", events);

    const clocks = getClockStrikeEvents();
    log.info(ITS_TESTS_JS, "clock strike events:", clocks);
  });
}
