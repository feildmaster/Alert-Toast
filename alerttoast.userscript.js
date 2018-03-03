// ==UserScript==
// @name         Alert Toast
// @namespace    https://feildmaster.com/
// @description  Alerts suck, toasts don't
// @version      1.7
// @author       feildmaster
// @include      *
// @run-at       document-start
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

/*!
 * Tinycon - A small library for manipulating the Favicon
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2015 Tom Moor
 * @license MIT Licensed
 */
!function(){var a={},b=null,c=null,d=null,e=null,f={},g=Math.ceil(window.devicePixelRatio)||1,h=16*g,i={width:7,height:9,font:10*g+"px arial",color:"#ffffff",background:"#F03D25",fallback:!0,crossOrigin:!0,abbreviate:!0},j=function(){var a=navigator.userAgent.toLowerCase();return function(b){return a.indexOf(b)!==-1}}(),k={ie:j("trident"),chrome:j("chrome"),webkit:j("chrome")||j("safari"),safari:j("safari")&&!j("chrome"),mozilla:j("mozilla")&&!j("chrome")&&!j("safari")},l=function(){for(var a=document.getElementsByTagName("link"),b=0,c=a.length;b<c;b++)if((a[b].getAttribute("rel")||"").match(/\bicon\b/i))return a[b];return!1},m=function(){for(var a=document.getElementsByTagName("link"),b=0,c=a.length;b<c;b++){void 0!==a[b]&&(a[b].getAttribute("rel")||"").match(/\bicon\b/i)&&a[b].parentNode.removeChild(a[b])}},n=function(){if(!c||!b){var a=l();b=a?a.getAttribute("href"):"/favicon.ico",c||(c=b)}return b},o=function(){return e||(e=document.createElement("canvas"),e.width=h,e.height=h),e},p=function(a){if(a){m();var b=document.createElement("link");b.type="image/x-icon",b.rel="icon",b.href=a,document.getElementsByTagName("head")[0].appendChild(b)}},q=function(a,b){if(!o().getContext||k.ie||k.safari||"force"===f.fallback)return r(a);var c=o().getContext("2d"),b=b||"#000000",e=n();d=document.createElement("img"),d.onload=function(){c.clearRect(0,0,h,h),c.drawImage(d,0,0,d.width,d.height,0,0,h,h),(a+"").length>0&&s(c,a,b),t()},!e.match(/^data/)&&f.crossOrigin&&(d.crossOrigin="anonymous"),d.src=e},r=function(a){if(f.fallback){var b=document.title;"("===b[0]&&(b=b.slice(b.indexOf(" "))),(a+"").length>0?document.title="("+a+") "+b:document.title=b}},s=function(a,b,c){"number"==typeof b&&b>99&&f.abbreviate&&(b=u(b));var d=(b+"").length-1,e=f.width*g+6*g*d,i=f.height*g,j=h-i,l=h-e-g,m=16*g,n=16*g,o=2*g;a.font=(k.webkit?"bold ":"")+f.font,a.fillStyle=f.background,a.strokeStyle=f.background,a.lineWidth=g,a.beginPath(),a.moveTo(l+o,j),a.quadraticCurveTo(l,j,l,j+o),a.lineTo(l,m-o),a.quadraticCurveTo(l,m,l+o,m),a.lineTo(n-o,m),a.quadraticCurveTo(n,m,n,m-o),a.lineTo(n,j+o),a.quadraticCurveTo(n,j,n-o,j),a.closePath(),a.fill(),a.beginPath(),a.strokeStyle="rgba(0,0,0,0.3)",a.moveTo(l+o/2,m),a.lineTo(n-o/2,m),a.stroke(),a.fillStyle=f.color,a.textAlign="right",a.textBaseline="top",a.fillText(b,2===g?29:15,k.mozilla?7*g:6*g)},t=function(){o().getContext&&p(o().toDataURL())},u=function(a){for(var b=[["G",1e9],["M",1e6],["k",1e3]],c=0;c<b.length;++c)if(a>=b[c][1]){a=v(a/b[c][1])+b[c][0];break}return a},v=function(a,b){return new Number(a).toFixed(b)};a.setOptions=function(a){f={},a.colour&&(a.color=a.colour);for(var b in i)f[b]=a.hasOwnProperty(b)?a[b]:i[b];return this},a.setImage=function(a){return b=a,t(),this},a.setBubble=function(a,b){return a=a||"",q(a,b),this},a.reset=function(){b=c,p(c)},a.setOptions(i),"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module?module.exports=a:window.Tinycon=a}();

const toast = (() => {
  const style = {
    root: {
      display: 'flex',
      'flex-direction': 'column-reverse',
      'align-items': 'flex-end',
      position: 'fixed',
      bottom: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      display: 'block',
      fontSize: '15px',
      'font-style': 'italic',
      //width: '100%',
    },
    shared: {
      display: 'inline-block',
      maxWidth: '320px',
      padding: '5px 8px',
      borderRadius: '3px',
      fontFamily: 'cursive, sans-serif',
      fontSize: '13px',
      cursor: 'pointer',
      color: '#fafeff',
      margin: '4px',
      'white-space': 'pre-line',
    },
    toast: {
      textShadow: '#3498db 1px 2px 1px',
      background: '#2980b9',
    },
    button: {
      textShadow: '#173646 0px 0px 3px',
      background: '#2c9fea',
    },
  };

  function applyCSS(element, css = {}) {
    Object.keys(css).forEach((key) => {
      element.style[key] = css[key];
    });
  }

  const toasts = new Map();
  const root = (() => {
    function create() {
      const el = document.createElement('div');
      el.setAttribute('id', 'AlertToast');
      applyCSS(el, style.root);

      const body = document.getElementsByTagName('body')[0];
      if (body) { // Depending on when the script is loaded... this might be null
        body.appendChild(el);
      } else {
        window.addEventListener('load', () => {
          if (document.getElementById(el.id)) return; // Another script may have created it already
          document.getElementsByTagName('body')[0].appendChild(el);
        });
      }
      return el;
    }

    setInterval(() => { // TODO: don't always run a timer
      const now = Date.now();
      toasts.forEach((toast) => {
        if (!toast.timeout || now < toast.timeout) return;
        // Close toast
        toast.close();
      });
    }, 1000);
    return document.getElementById('AlertToast') || create();
  })();
  let count = 0;

  function Toast({title, text, css, buttons, timeout}) {
    if (typeof arguments[0] === 'string') {
      text = arguments[0];
    }
    if (!text) return;
    const id = count++;
    const el = document.createElement('div');
    el.setAttribute('id', `AlertToast-${id}`);
    applyCSS(el, style.shared);
    applyCSS(el, style.toast);
    applyCSS(el, css);

    // Add title, body
    if (title) {
      const tel = document.createElement('span');
      applyCSS(tel, style.title);
      applyCSS(tel, title.css);
      tel.textContent = title.text || title;
      el.appendChild(tel);
    }
    const body = document.createElement('span');
    body.textContent = text;
    el.appendChild(body);
    const toast = {
      close: () => {
        root.removeChild(el);
        toasts.delete(id);
      },
    };
    if (timeout) {
      toast.timeout = Date.now() + timeout;
    }

    if (buttons) {
      // TODO: Add buttons
    }
    
    el.addEventListener('click', toast.close);

    root.appendChild(el);
    toasts.set(id, toast);
    return toast;
  }
  return Toast;
})();

let pending = 0;

window.alert = (text) => {
  const options = {
    text,
    timeout: config.timeout,
  };
  if (config.title) {
    options.title = `${location.host} says:`;
  }
  toast(options);

  console.log('Favicon:',config.favicon, document.visibilityState)
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
})

if (!['Tampermonkey', 'Violentmonkey'].includes(GM_info.scriptHandler)) {
  toast({
    title: `${GM_info.scriptHandler} may not be supported`,
    text: 'Alert Toast may not be able to convert alerts with this script handler.',
    css: {
      background: '#c8354e',
      textShadow: '#e74c3c 1px 2px 1px',
    }
  });
}
