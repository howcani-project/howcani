import 'phantomjs-polyfill';
import './shim';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';

import {
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';
import {
  setBaseTestProviders,
  addProviders,
  inject, injectAsync,
  async, tick
} from '@angular/core/testing';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

Object.assign(global, {
  addProviders,
  inject, async: async
});

Error.stackTraceLimit = Infinity;

const testContext = require.context('./app', true, /\.spec\.js/);
testContext.keys().forEach(testContext);
