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

const TARGET_URL = 'https://www.investing.com/economic-calendar/';

function checkCurrentTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0] && tabs[0].url.startsWith(TARGET_URL)) {
      showContent();
    } else {
      showRedirectMessage();
    }
  });
}

function showContent() {
  // document.getElementById('content').style.visibility = 'visible';
  document.getElementById('redirectMessage').style.display = 'none';
}

function showRedirectMessage() {
  // document.getElementById('content').style.visibility = 'hidden';
  document.getElementById('redirectMessage').style.display = 'flex';
}

function setupRedirectListener() {
  document.getElementById('redirectMessageContent').addEventListener('click', function() {
    chrome.tabs.create({ url: TARGET_URL });
  });
}

export { checkCurrentTab, setupRedirectListener };