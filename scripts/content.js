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
function notifyEvents(events) {
  events.forEach(event => {
    chrome.runtime.sendMessage({action: "notifyEvent", event: event});
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

      const economicEvents = getEconomicEvents();
      const clockEvents = getClockStrikeEvents();
      const events = economicEvents.concat(clockEvents);

      const validEvents = events
      .filter(event => event.dateTime) // Exclude events without dateTime
      .filter(event => {
        event.minutesLeft = null; 
        
        return settings.alertMinutes.some(alertMinute => {
          const secondsLeft = (event.dateTime - now) / 1000;
          const alertSecondsLeft = secondsLeft - alertMinute * 60;
          if (alertSecondsLeft <= 0 && alertSecondsLeft >= -checkSeconds) {
            event.minutesLeft = alertMinute;
            return true;
          }
          return false;
        });
      });
      notifyEvents(validEvents);
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
