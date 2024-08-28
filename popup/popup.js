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

document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get(['alertMinutes', 'clockStrike'], function(result) {
      if (result.alertMinutes) {
          result.alertMinutes.forEach(value => {
              document.querySelector(`input[name="alertMinute"][value="${value}"]`).checked = true;
          });
      }
      if (result.clockStrike) {
          document.querySelector(`input[name="clockStrike"][value="${result.clockStrike}"]`).checked = true;
      } else {
          document.querySelector('input[name="clockStrike"][value="null"]').checked = true;
      }
  });

  // Save settings
  document.getElementById('save').addEventListener('click', function() {
      const alertMinutes = Array.from(document.querySelectorAll('input[name="alertMinute"]:checked'))
          .map(input => parseInt(input.value));

      const clockStrike = document.querySelector('input[name="clockStrike"]:checked').value;

      chrome.storage.sync.set({
          alertMinutes: alertMinutes,
          clockStrike: clockStrike === 'null' ? null : parseInt(clockStrike)
      }, function() {
          console.log('Settings saved');
          // Optionally, show a "Saved" message to the user
      });
  });
});