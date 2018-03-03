// ==UserScript==
// @name         Alert Toast
// @namespace    https://feildmaster.com/
// @description  Alerts suck, toasts don't
// @version      1.8
// @author       feildmaster
// @include      *
// @require      https://raw.githubusercontent.com/feildmaster/SimpleToast/1.0/simpletoast.js
// @require      https://raw.githubusercontent.com/feildmaster/tinycon/82accb1523cd96781cd943124a9698f6f072f342/tinycon.min.js
// @grant        none
// ==/UserScript==

if (window !== window.top) {
  window.alert = window.top.alert;
  return;
}

const config = {
  title: false,
  timeout: null,
  favicon: true,
};

let pending = 0;

window.alert = (text) => {
  const options = {
    text,
    timeout: config.timeout,
  };
  if (config.title) {
    options.title = `${location.host} says:`;
  }
  SimpleToast(options);

  if (config.favicon && document.visibilityState !== 'visible') {
    pending += 1;
    Tinycon.setBubble(pending);
    Tinycon.setBubble(pending); // Because it's a canvas, we have to run again to force an update
  }
};

Tinycon.setOptions({
  fallback: false, // Don't do anything if we can't edit the favicon
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  pending = 0;
  Tinycon.reset();
});

if (!['Tampermonkey', 'Violentmonkey'].includes(GM_info.scriptHandler)) {
  SimpleToast({
    title: `${GM_info.scriptHandler} may not be supported`,
    text: 'Alert Toast may not be able to convert alerts with this script handler.',
    css: {
      background: '#c8354e',
      textShadow: '#e74c3c 1px 2px 1px',
    }
  });
}
