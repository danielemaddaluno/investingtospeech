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

const targetUrl = 'https://www.investing.com/economic-calendar/';

chrome.action.onClicked.addListener(tab => {
  // Check if the current tab is the target URL
  if (tab.url === targetUrl) {
    // // Create a popup dynamically
    // chrome.windows.create({
    //   url: chrome.runtime.getURL("./popup/popup.html"), // Popup HTML file
    //   type: "popup",                           // This creates a frameless, toolbar-less window
    //   width: 320,                              // Set width similar to a typical popup
    //   height: 400,                             // Set height similar to a typical popup
    //   top: 100,                                // Adjust to position near the extension icon
    //   left: 100                                // Adjust to position near the extension icon
    // });
    chrome.tabs.create({
      url: chrome.runtime.getURL("./popup/popup.html")
    });
  } else {
    // If not on the target URL, open the target URL in a new tab
    chrome.tabs.create({ url: targetUrl });
  }
});

function timeText(secondsLeft) {
  if(secondsLeft % 60 == 0){
    const minutesLeft = secondsLeft / 60;
    return `${minutesLeft} ${minutesLeft > 1 ? "minutes" : "minute"}`;
  } else {
    return `${secondsLeft} ${secondsLeft > 1 ? "seconds" : "second"}`;
  }
}

function starsText(stars) {
  return stars > 1 ? "stars" : "star";
}

function getTextToRead(event) {
  if (event.type === "EconomicEvent") {
    const timeToText = `${timeText(event.secondsLeft)} to the next ${event.country} event. `;
    const sentimentText = `${event.sentiment} ${starsText(event.sentiment)}. `;
    const titleText = `${event.title}. `;
    return timeToText + sentimentText + titleText;
  } else if (event.type === "ClockStrikeEvent") {
    const eventName = "Clock strike event: ";
    const formattedTime = new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const timeToText = `${timeText(event.secondsLeft)} to ${formattedTime}`;
    return eventName + timeToText;
  } else {
    return "Unknown event type.";
  }
}

// Queue to store pending TTS messages
const ttsQueue = [];
let isSpeaking = false;

function notifyEvent(event) {
  const text = getTextToRead(event);
  console.log("Queuing TTS: " + text);
  ttsQueue.push(text);
  processQueue();
}

function processQueue() {
  if (isSpeaking || ttsQueue.length === 0) return;

  isSpeaking = true;
  const text = ttsQueue.shift();

  chrome.tts.speak(text, {
    'lang': 'en-US',
    'rate': 1.0,
    'onEvent': function(event) {
      if (event.type === 'end' || event.type === 'error' || event.type === 'cancelled') {
        isSpeaking = false;
        processQueue(); // Process next item in the queue
      }
      if (event.type === 'error') {
        console.error('TTS Error:', event);
      }
    }
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "notifyEvent") {
    notifyEvent(message.event);
  }
});