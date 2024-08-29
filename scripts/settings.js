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

// Initialize the settings object accessible from other scripts
let settings = {
  alertTriggers: [60], // Default values
  clockStrike: 15      // Default value
};

// Function to update the settings
function updateSettings(changes) {
  for (let key in changes) {
    if (key === 'alertTriggers' || key === 'clockStrike') {
      settings[key] = changes[key].newValue;
      console.log(`Updated ${key}:`, settings[key]);
    }

    // Recompute clock strike events
    if(key === 'clockStrike'){
      updateClockStrikeEvents();
    }
  }
}

// Listen for changes in chrome.storage.sync
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    updateSettings(changes);
  }
});

// Initial load of settings
chrome.storage.sync.get(['alertTriggers', 'clockStrike'], (result) => {
  settings = result;
  console.log('Initial settings loaded:', settings);
});