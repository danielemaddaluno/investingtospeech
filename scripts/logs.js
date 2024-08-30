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

// Simplified Logs
// const logs = true;
// function log(...data){
//   if(logs){
//     console.log(data);
//   }
// }
// export { log };


// Configuration for logging level
const LOG_ID    = 'ITS';
const LOG_LEVEL = 'info';  // Set the log level ('none', 'error', 'warn', 'info')

// Logging utility object
const log = {
  logLevel: LOG_LEVEL,
  
  // Internal method to check if a message should be logged
  shouldLog(level) {
    const levels = ['none', 'error', 'warn', 'info'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  },

  info(...args) {
    if (this.shouldLog('info')) {
      console.info(LOG_ID, ...args);
    }
  },

  warn(...args) {
    if (this.shouldLog('warn')) {
      console.warn(LOG_ID, ...args);
    }
  },

  error(...args) {
    if (this.shouldLog('error')) {
      console.error(LOG_ID, ...args);
    }
  }
};
