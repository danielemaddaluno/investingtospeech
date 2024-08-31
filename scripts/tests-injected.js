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

// injected-script.js
// import { doStuff } from './my-other-script.js';
alert("Hello world");

window.getNextMinute = function() {
  // Get the current date and time
  const now = new Date();

  // Add one minute to the current time
  now.setMinutes(now.getMinutes() + 2);

  // Get the hours and minutes from the updated time
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  // Format the time as "hh:mm"
  return `${hours}:${minutes}`;
}
