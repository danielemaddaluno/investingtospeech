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

let saveTimeout;
const SAVE_DELAY = 1500; // millis of delay, adjust as needed

document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['alertTriggers', 'clockStrike'], function(result) {
    if (result.alertTriggers) {
      result.alertTriggers.forEach(value => {
        document.querySelector(`input[name="alertTrigger"][value="${value}"]`).checked = true;
      });
    }
    if (result.clockStrike) {
      document.querySelector(`input[name="clockStrike"][value="${result.clockStrike}"]`).checked = true;
    } else {
      document.querySelector('input[name="clockStrike"][value="null"]').checked = true;
    }
  });

  // Add event listeners for debounced auto-save
  document.querySelectorAll('input[name="alertTrigger"], input[name="clockStrike"]').forEach(input => {
    input.addEventListener('change', debounceSaveSettings);
  });
});

function debounceSaveSettings() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveSettings, SAVE_DELAY);
}

function saveSettings() {
  const alertTriggers = Array.from(document.querySelectorAll('input[name="alertTrigger"]:checked'))
    .map(input => parseInt(input.value));

  const clockStrike = document.querySelector('input[name="clockStrike"]:checked').value;

  chrome.storage.sync.set({
    alertTriggers: alertTriggers,
    clockStrike: clockStrike === 'null' ? null : parseInt(clockStrike)
  }, function() {
    console.log('Settings saved');
    showSaveMessage();
  });
}

function showSaveMessage() {
  const saveMessage = document.getElementById('saveMessage');
  saveMessage.style.display = 'flex';
  setTimeout(() => {
    saveMessage.style.display = 'none';
  }, 2000);
}