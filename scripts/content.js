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

// const events = getEconomicEvents();
// console.log("Economic Events:", events);

// Function to handle notifications
function notifyEvent(event, minutesLeft) {
    // Send a message to the background script
    chrome.runtime.sendMessage({action: "notifyEvent", event: event, minutesLeft: minutesLeft});
}

// TODO verify if a setTimeout could be more efficient
// Function to handle event queue
function scheduleNotifications(events) {
  const now = new Date();
  events.forEach(event => {
    const secondsLeft = (event.dateTime - now)/1000;
    if (secondsLeft <= 0 && secondsLeft >= -checkSeconds) {
      console.log(secondsLeft);
      notifyEvent(event,  +1);
    }
  });
}

// TODO find a more efficient way than polling
// Set the interval for checking for new upcoming news
const checkSeconds = 15;

function performCheck() {
  const now = new Date();
  const seconds = now.getSeconds();

  if (seconds % checkSeconds === 0) {
      console.log(`Performing check at ${now.toLocaleTimeString()}`);
      const events = getEconomicEvents();
      const validEvents = events.filter(event => event.dateTime); // Exclude events without dateTime
      scheduleNotifications(validEvents);
  }
}

// Optional: Function to stop checking if needed --> clearInterval(checkingInterval);
const checkingInterval = setInterval(performCheck, 1000);



// const article = document.querySelector('#leftColumn');

// // `document.querySelector` may return null if the selector doesn't match anything.
// if (article) {
//   const events = getEconomicEvents();
  
//   const text = article.textContent;
//   const wordMatchRegExp = /[^\s]+/g;
//   const words = text.matchAll(wordMatchRegExp);
//   // matchAll returns an iterator, convert to array to get word count
//   const wordCount = [...words].length;
//   const readingTime = Math.round(wordCount / 200);
//   const badge = document.createElement('p');
//   // Use the same styling as the publish information in an article's header
//   badge.classList.add('color-secondary-text', 'type--caption');
//   badge.textContent = `⏱️ ${readingTime} min read `;

//   // Support for API reference docs
//   const heading = article.querySelector('h1');
//   // Support for article docs with date
//   const date = article.querySelector('time')?.parentNode;

//   // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
//   (date ?? heading).insertAdjacentElement('afterend', badge);
// }


// console.log(new Date("Tuesday, August 27, 2024 11:51 GMT-0500").toUTCString())

// Utility function to parse the sentiment (stars) from the sentiment cell
function parseSentiment(sentimentCell) {
  const starIcons = sentimentCell.querySelectorAll("i.grayFullBullishIcon");
  return starIcons.length > 0 ? starIcons.length : null;
}

function safeQuerySelectorTextContent(element, selector) {
  const selectedElement = element.querySelector(selector);
  return selectedElement ? selectedElement.textContent.trim() : null;
}

// Function to extract economic events from the rows
function parseEventRow(eventRow, day, timeZone) {
  const dateTime = eventRow.getAttribute("data-event-datetime");
  const time = test ? nextMin : (dateTime ? dateTime.split(" ")[1] : "All Day");
  const currency = safeQuerySelectorTextContent(eventRow, ".flagCur") || null;
  const countryElement = eventRow.querySelector(".flagCur span");
  const country = countryElement ? countryElement.getAttribute("title") : null;
  const sentimentCell = eventRow.querySelector(".sentiment");
  const sentiment = sentimentCell ? parseSentiment(sentimentCell) : null;
  const title = safeQuerySelectorTextContent(eventRow, ".event") || null;
  
  const event =  {
      timeZone: timeZone,
      date: day,
      time: time,
      dateTime: new Date(day + " " + time + " " + timeZone),
      currency: currency,
      country: country,
      sentiment: sentiment,
      title: title
  };
  // console.log(event);
  
  return event;
}

function parseDateRow(dateRow) {
  return dateRow.textContent.trim();
}

// Function to get the economic events from the table
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

// Function to get the time zone from the page
function getTimeZone() {
  const timeZoneEl = document.querySelector("span#timeZoneGmtOffsetFormatted");
  const timeZoneParenthesis = timeZoneEl ? timeZoneEl.textContent.trim() : null;
  return timeZoneParenthesis ? timeZoneParenthesis.replace("(", "").replace(")", "") : null;
}


// For tests
var test = false;
var nextMin = getNextMinute();
function getNextMinute() {
  // Get the current date and time
  const now = new Date();

  // Add one minute to the current time
  now.setMinutes(now.getMinutes() + 1);

  // Get the hours and minutes from the updated time
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Format the time as "hh:mm"
  return `${hours}:${minutes}`;
}
