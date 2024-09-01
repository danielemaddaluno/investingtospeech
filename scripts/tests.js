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

const TESTS_JS = "tests.js";

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


function testEvents(){
  const events = getEconomicEvents();
  log.info(TESTS_JS, "economic events:", events);

  const clocks = getClockStrikeEvents();
  log.info(TESTS_JS, "clock strike events:", clocks);
}

function testAfterMins(index=0, minutes){
  const next = getRoundDateTime(1, minutes);
  changeEventHms(index, next);
}

function testSecs(index=0){
  const next = getRoundDateTime(1, 0);
  changeEventHms(index, next);
}

function test1Min(index=0){
  testAfterMins(index, 1);
}

function test5Min(index=0){
  testAfterMins(index, 5);
}

function test10Min(index=0){
  testAfterMins(index, 10);
}

function test15Min(index=0){
  testAfterMins(index, 15);
}

function changeEventHms(index=0, dateTime=new Date()) {
  const h = dateTime.getHours();
  const m = dateTime.getMinutes();
  const s = dateTime.getSeconds();
  changeEventHms(index, h, m, s);
}

function changeEventHms(index=0, h=0, m=0, s = 0) {
  const table = document.querySelector("table#economicCalendarData");
    
  if (!table) {
    console.error("Table not found");
    return;
  }

  // Create a new Date object for today with the specified time
  const newDateTime = new Date();
  newDateTime.setHours(h, m, s, 0);

  // Find all event rows
  const rows = table.querySelectorAll("tbody tr.js-event-item");

  if (index < 0 || index >= rows.length) {
    console.error("Invalid index");
    return;
  }

  const targetRow = rows[index];
  // Update the data-event-datetime attribute
  targetRow.setAttribute('data-event-datetime', formatDate(newDateTime));
  // Update the time in the td.time element
  const timeCell = targetRow.querySelector('td.time');
  if (timeCell) {
    timeCell.textContent = newDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Find and update the preceding 'theDay' row
  let currentRow = targetRow.previousElementSibling;
  while (currentRow) {
    if (currentRow.firstElementChild?.classList.contains('theDay')) {
      const dayCell = currentRow.querySelector('td');
      if (dayCell) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dayCell.textContent = newDateTime.toLocaleDateString('en-US', options);
      }
      break;
    }
    currentRow = currentRow.previousElementSibling;
  }

  log.update(TESTS_JS, `Row ${index} updated: ${newDateTime}`);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}