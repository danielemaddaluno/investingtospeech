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
const ITS_CONTENT_JS = "content.js";

// Function to handle notifications
function notifyEvents(events) {
  if (chrome.runtime?.id) {
    events.forEach(event => {
      chrome.runtime.sendMessage({action: "notifyEvent", event: event});
    });
  } else {
    log.warn(ITS_CONTENT_JS, "Chrome.runtime is null");
  }
}

// TODO find a more efficient way than polling
// Set the interval for checking for new upcoming news
const checkSeconds = 10;

function performCheck() {
  if(!settings || !settings.alertTriggers || settings.alertTriggers.length === 0) return;

  const now = new Date();
  const seconds = now.getSeconds();

  if (seconds % checkSeconds === 0) {
    const economicEvents = getEconomicEvents();
    const clockEvents = getClockStrikeEvents();
    const events = economicEvents.concat(clockEvents);

    const validEvents = events
      .filter(event => event.dateTime) // Exclude events without dateTime
      .filter(event => {
        event.secondsLeft = null; 
        
        return settings.alertTriggers.some(alertTrigger => {
          const secondsLeft = (event.dateTime - now) / 1000;
          const alertSecondsLeft = secondsLeft - alertTrigger;
          if (alertSecondsLeft <= 0 && alertSecondsLeft >= -checkSeconds) {
            event.secondsLeft = alertTrigger;
            return true;
          }
          return false;
        });
      });

    const loggedJson = {
      economicEvents: economicEvents,
      clockEvents: clockEvents,
      events: events,
      validEvents: validEvents
    };

    const performingCheckAt = `- Performing check at ${now.toLocaleTimeString()} -`;
    const validEventsSize = loggedJson.validEvents.length;
    validEventsSize > 0 ? 
      log.success(ITS_CONTENT_JS, performingCheckAt, `${validEventsSize} Valid Event${validEventsSize > 1 ? 's' : ''}`) : 
      log.empty(ITS_CONTENT_JS, performingCheckAt, `No Valid Events`);
    log.info(ITS_CONTENT_JS, loggedJson);

    notifyEvents(validEvents);
  }
}

// Optional: Function to stop checking if needed --> clearInterval(checkingInterval);
const checkingInterval = setInterval(performCheck, 1000);
