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


const LOG_ID = 'ITS';
const log = { // <-- Logging utility object
  logLevel: "info", // <-- Set the log level ('none', 'error', 'warn', 'info')
  
  // Internal method to check if a message should be logged
  shouldLog(level) {
    const levels = ['none', 'error', 'warn', 'info'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  },

  coloredLog(color, ...args) {
    if (this.shouldLog('info')) {
      const text = args[0].join(' ');
      console.info(`${color}${LOG_ID} ${text}${colors.reset}`);
    }
  },

  success(...args) {
    this.coloredLog(colors.green, args);
  },

  empty(...args) {
    this.coloredLog(colors.blue, args);
  },

  update(...args) {
    this.coloredLog(colors.magenta, args);
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


const colors = {
  reset: '\x1B[0m',

  // Text color (basic)
  black: '\x1B[30m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',

  // Background color
  blackBg: '\x1B[40m',
  redBg: '\x1B[41m',
  greenBg: '\x1B[42m',
  yellowBg: '\x1B[43m',
  blueBg: '\x1B[44m',
  magentaBg: '\x1B[45m',
  cyanBg: '\x1B[46m',
  whiteBg: '\x1B[47m'
}
