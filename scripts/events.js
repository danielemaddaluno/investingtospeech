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


// Function to get the time zone from the page
function getTimeZone() {
  const timeZoneEl = document.querySelector("span#timeZoneGmtOffsetFormatted");
  const timeZoneParenthesis = timeZoneEl ? timeZoneEl.textContent.trim() : null;
  return timeZoneParenthesis ? timeZoneParenthesis.replace("(", "").replace(")", "") : null;
}

// Function to get the economic events from the table economicCalendarData
function getEconomicEvents() {
  const table = document.querySelector("table#economicCalendarData");
  const rows = table.querySelectorAll("tbody tr");
  const events = [];
  let day = "";
  const timeZone = getTimeZone();

  rows.forEach(row => {
      // Find the first <td> inside of <tr>
      const firstTd = row.querySelector('td');

      // Controlla se il primo <td> ha la classe "theDay"
      if (firstTd && firstTd.classList.contains('theDay')) {
        // Logic for the day row
        //console.log('The row contains the "theDay" class. with date ' + day);
        day = parseDateRow(row);
      } else if (row.id.startsWith("eventRowId_")) {
        // Logic for economic event
        // console.log('The row ID starts with "eventRowId_".');
        const event = parseEventRow(row, day, timeZone);
        events.push(event);
      } else {
        //console.log('The row does not match any conditions.');
      }
  });

  return events;
}

// =================== Function to extract the date from the date row ===================
function parseDateRow(dateRow) {
  return dateRow.textContent.trim();
}
// ======================================================================================


// =================== Economic Event Parsing ===================
function parseEventRow(eventRow, day, timeZone) {
  const time = extractTime(eventRow);
  const dateTime = new Date(`${day} ${time} ${timeZone}`);
  const currency = extractCurrency(eventRow);
  const country = extractCountry(eventRow);
  const sentiment = extractSentiment(eventRow);
  const title = extractTitle(eventRow);
  
  return {
    type: "EconomicEvent",
    timeZone: timeZone,
    date: day,
    time: time,
    dateTime: dateTime,
    currency: currency,
    country: country,
    sentiment: sentiment,
    title: title
  };
}

function extractTime(eventRow) {
  if (test) return nextMin;
  const dateTime = eventRow.getAttribute("data-event-datetime");
  return dateTime ? dateTime.split(" ")[1] : "All Day";
}

function extractCurrency(eventRow) {
  const currencyElement = eventRow.querySelector(".flagCur");
  return currencyElement ? currencyElement.textContent.trim() : null;
}

function extractCountry(eventRow) {
  const countryElement = eventRow.querySelector(".flagCur span");
  return countryElement ? countryElement.getAttribute("title") : null;
}

function extractSentiment(eventRow) {
  const sentimentCell = eventRow.querySelector(".sentiment");
  if (!sentimentCell) return null;
  const starIcons = sentimentCell.querySelectorAll("i.grayFullBullishIcon");
  return starIcons.length > 0 ? starIcons.length : null;
}

function extractTitle(eventRow) {
  const titleElement = eventRow.querySelector(".event");
  return titleElement ? titleElement.textContent.trim() : null;
}
// ==============================================================