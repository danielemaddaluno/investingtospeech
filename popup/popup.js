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
  chrome.storage.sync.get(['economicAlerts', 'clockStrikeAlert'], function(result) {
      if (result.economicAlerts) {
          result.economicAlerts.forEach(value => {
              document.querySelector(`input[name="economic"][value="${value}"]`).checked = true;
          });
      }
      if (result.clockStrikeAlert) {
          document.querySelector(`input[name="clock"][value="${result.clockStrikeAlert}"]`).checked = true;
      } else {
          document.querySelector('input[name="clock"][value="null"]').checked = true;
      }
  });

  // Save settings
  document.getElementById('save').addEventListener('click', function() {
      const economicAlerts = Array.from(document.querySelectorAll('input[name="economic"]:checked'))
          .map(input => parseInt(input.value));

      const clockStrikeAlert = document.querySelector('input[name="clock"]:checked').value;

      chrome.storage.sync.set({
          economicAlerts: economicAlerts,
          clockStrikeAlert: clockStrikeAlert === 'null' ? null : parseInt(clockStrikeAlert)
      }, function() {
          console.log('Settings saved');
          // Optionally, show a "Saved" message to the user
      });
  });
});