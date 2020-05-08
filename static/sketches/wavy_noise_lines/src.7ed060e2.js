// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

EventEmitter.defaultMaxListeners = 10; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.

EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;
  if (!this._events) this._events = {}; // If there is no 'error' event listener then throw.

  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
      er = arguments[1];

      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];
  if (isUndefined(handler)) return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;

      case 2:
        handler.call(this, arguments[1]);
        break;

      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower

      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;

    for (i = 0; i < len; i++) listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;
  if (!isFunction(listener)) throw TypeError('listener must be a function');
  if (!this._events) this._events = {}; // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".

  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
  if (!this._events[type]) // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type])) // If we've already got an array, just append.
    this._events[type].push(listener);else // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener]; // Check for listener leak

  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);

      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');
  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);
  return this;
}; // emits a 'removeListener' event iff the listener was removed


EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;
  if (!isFunction(listener)) throw TypeError('listener must be a function');
  if (!this._events || !this._events[type]) return this;
  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;
  if (!this._events) return this; // not listening for removeListener, no need to emit

  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
  }

  delete this._events[type];
  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];
    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }

  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}
},{}],"../node_modules/touches/index.js":[function(require,module,exports) {
var Emitter = require('events/')

var allEvents = [
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'mousedown', 'mousemove', 'mouseup'
]

var ROOT = { left: 0, top: 0 }

module.exports = function handler (element, opt) {
  opt = opt || {}
  element = element || window

  var emitter = new Emitter()
  emitter.target = opt.target || element

  var touch = null
  var filtered = opt.filtered

  var events = allEvents

  // only a subset of events
  if (typeof opt.type === 'string') {
    events = allEvents.filter(function (type) {
      return type.indexOf(opt.type) === 0
    })
  }

  // grab the event functions
  var funcs = events.map(function (type) {
    var name = normalize(type)
    var fn = function (ev) {
      var client = ev
      if (/^touch/.test(type)) {
        if (/^touchend$/.test(type) && opt.preventSimulated !== false) {
          ev.preventDefault()
        }
        
        if (filtered) {
          client = getFilteredTouch(ev, type)
        } else {
          client = getTargetTouch(ev.changedTouches, emitter.target)
        }
      }

      if (!client) {
        return
      }

      // get 2D position
      var pos = offset(client, emitter.target)

      // dispatch the normalized event to our emitter
      emitter.emit(name, ev, pos)
    }
    return { type: type, listener: fn }
  })

  emitter.enable = function enable () {
    funcs.forEach(listeners(element, true))

    return emitter
  }

  emitter.disable = function dispose () {
    touch = null
    funcs.forEach(listeners(element, false))

    return emitter
  }

  // initially enabled
  emitter.enable()
  return emitter

  function getFilteredTouch (ev, type) {
    var client

    // clear touch if it was lifted or canceled
    if (touch && /^touch(end|cancel)/.test(type)) {
      // allow end event to trigger on tracked touch
      client = getTouch(ev.changedTouches, touch.identifier || 0)
      if (client) {
        touch = null
      }
    } else if (!touch && /^touchstart/.test(type)) {
      // not yet tracking any touches, pick one from target
      touch = client = getTargetTouch(ev.changedTouches, emitter.target)
    } else if (touch) {
    // get the tracked touch
      client = getTouch(ev.changedTouches, touch.identifier || 0)
    }

    return client
  }
}

// get 2D client position of touch/mouse event
function offset (ev, target) {
  var cx = ev.clientX || 0
  var cy = ev.clientY || 0
  var rect = bounds(target)
  return [ cx - rect.left, cy - rect.top ]
}

// since we are adding events to a parent we can't rely on targetTouches
function getTargetTouch (touches, target) {
  return Array.prototype.slice.call(touches).filter(function (t) {
    return t.target === target
  })[0] || touches[0]
}

function getTouch (touches, id) {
  for (var i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) {
      return touches[i]
    }
  }
  return null
}

function listeners (e, enabled) {
  return function (data) {
    if (enabled) e.addEventListener(data.type, data.listener, { passive: false })
    else e.removeEventListener(data.type, data.listener, { passive: false })
  }
}

// normalize touchstart/mousedown to "start" etc
function normalize (event) {
  return event.replace(/^(touch|mouse)/, '')
    .replace(/up$/, 'end')
    .replace(/down$/, 'start')
}

function bounds (element) {
  if (element === window ||
      element === document ||
      element === document.body) {
    return ROOT
  } else {
    return element.getBoundingClientRect()
  }
}

},{"events/":"../node_modules/events/events.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/tweakpane/dist/tweakpane.js":[function(require,module,exports) {
var define;
var process = require("process");
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if (typeof exports === 'object') exports["tweakpane"] = factory();else root["Tweakpane"] = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/

      /******/
      // The require function

      /******/

      function __webpack_require__(moduleId) {
        /******/

        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId]) {
          /******/
          return installedModules[moduleId].exports;
          /******/
        }
        /******/
        // Create a new module (and put it into the cache)

        /******/


        var module = installedModules[moduleId] = {
          /******/
          i: moduleId,

          /******/
          l: false,

          /******/
          exports: {}
          /******/

        };
        /******/

        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/

        /******/
        // Flag the module as loaded

        /******/

        module.l = true;
        /******/

        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/

      /******/

      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __webpack_require__.m = modules;
      /******/

      /******/
      // expose the module cache

      /******/

      __webpack_require__.c = installedModules;
      /******/

      /******/
      // define getter function for harmony exports

      /******/

      __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
          /******/
          Object.defineProperty(exports, name, {
            enumerable: true,
            get: getter
          });
          /******/
        }
        /******/

      };
      /******/

      /******/
      // define __esModule on exports

      /******/


      __webpack_require__.r = function (exports) {
        /******/
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
          /******/
          Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
          });
          /******/
        }
        /******/


        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        /******/
      };
      /******/

      /******/
      // create a fake namespace object

      /******/
      // mode & 1: value is a module id, require it

      /******/
      // mode & 2: merge all properties of value into the ns

      /******/
      // mode & 4: return value when already ns object

      /******/
      // mode & 8|1: behave like require

      /******/


      __webpack_require__.t = function (value, mode) {
        /******/
        if (mode & 1) value = __webpack_require__(value);
        /******/

        if (mode & 8) return value;
        /******/

        if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
        /******/

        var ns = Object.create(null);
        /******/

        __webpack_require__.r(ns);
        /******/


        Object.defineProperty(ns, 'default', {
          enumerable: true,
          value: value
        });
        /******/

        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
        /******/

        return ns;
        /******/
      };
      /******/

      /******/
      // getDefaultExport function for compatibility with non-harmony modules

      /******/


      __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
        /******/

        __webpack_require__.d(getter, 'a', getter);
        /******/


        return getter;
        /******/
      };
      /******/

      /******/
      // Object.prototype.hasOwnProperty.call

      /******/


      __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/

      /******/
      // __webpack_public_path__

      /******/


      __webpack_require__.p = "";
      /******/

      /******/

      /******/
      // Load entry module and return exports

      /******/

      return __webpack_require__(__webpack_require__.s = "./src/main/js/index.ts");
      /******/
    }(
    /************************************************************************/

    /******/
    {
      /***/
      "./node_modules/css-loader/lib/css-base.js":
      /*!*************************************************!*\
        !*** ./node_modules/css-loader/lib/css-base.js ***!
        \*************************************************/

      /*! no static exports found */

      /***/
      function (module, exports) {
        /*
        	MIT License http://www.opensource.org/licenses/mit-license.php
        	Author Tobias Koppers @sokra
        */
        // css base code, injected by the css-loader
        module.exports = function (useSourceMap) {
          var list = []; // return the list of modules as css string

          list.toString = function toString() {
            return this.map(function (item) {
              var content = cssWithMappingToString(item, useSourceMap);

              if (item[2]) {
                return "@media " + item[2] + "{" + content + "}";
              } else {
                return content;
              }
            }).join("");
          }; // import a list of modules into the list


          list.i = function (modules, mediaQuery) {
            if (typeof modules === "string") modules = [[null, modules, ""]];
            var alreadyImportedModules = {};

            for (var i = 0; i < this.length; i++) {
              var id = this[i][0];
              if (typeof id === "number") alreadyImportedModules[id] = true;
            }

            for (i = 0; i < modules.length; i++) {
              var item = modules[i]; // skip already imported module
              // this implementation is not 100% perfect for weird media query combinations
              //  when a module is imported multiple times with different media queries.
              //  I hope this will never occur (Hey this way we have smaller bundles)

              if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                if (mediaQuery && !item[2]) {
                  item[2] = mediaQuery;
                } else if (mediaQuery) {
                  item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                }

                list.push(item);
              }
            }
          };

          return list;
        };

        function cssWithMappingToString(item, useSourceMap) {
          var content = item[1] || '';
          var cssMapping = item[3];

          if (!cssMapping) {
            return content;
          }

          if (useSourceMap && typeof btoa === 'function') {
            var sourceMapping = toComment(cssMapping);
            var sourceURLs = cssMapping.sources.map(function (source) {
              return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
            });
            return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
          }

          return [content].join('\n');
        } // Adapted from convert-source-map (MIT)


        function toComment(sourceMap) {
          // eslint-disable-next-line no-undef
          var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
          var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
          return '/*# ' + data + ' */';
        }
        /***/

      },

      /***/
      "./node_modules/process/browser.js":
      /*!*****************************************!*\
        !*** ./node_modules/process/browser.js ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports) {
        // shim for using process in browser
        var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
          throw new Error('setTimeout has not been defined');
        }

        function defaultClearTimeout() {
          throw new Error('clearTimeout has not been defined');
        }

        (function () {
          try {
            if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }

          try {
            if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();

        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
          } // if setTimeout wasn't available but was latter defined


          if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }

          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }

        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
          } // if clearTimeout wasn't available but was latter defined


          if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }

          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
            }
          }
        }

        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }

          draining = false;

          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }

          if (queue.length) {
            drainQueue();
          }
        }

        function drainQueue() {
          if (draining) {
            return;
          }

          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;

          while (len) {
            currentQueue = queue;
            queue = [];

            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }

            queueIndex = -1;
            len = queue.length;
          }

          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1);

          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }

          queue.push(new Item(fun, args));

          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        }; // v8 likes predictible objects


        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }

        Item.prototype.run = function () {
          this.fun.apply(null, this.array);
        };

        process.title = 'browser';
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues

        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
          return [];
        };

        process.binding = function (name) {
          throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
          return '/';
        };

        process.chdir = function (dir) {
          throw new Error('process.chdir is not supported');
        };

        process.umask = function () {
          return 0;
        };
        /***/

      },

      /***/
      "./src/main/js/api/button.ts":
      /*!***********************************!*\
        !*** ./src/main/js/api/button.ts ***!
        \***********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var ButtonApi =
        /** @class */
        function () {
          /**
           * @hidden
           */
          function ButtonApi(buttonController) {
            this.controller = buttonController;
          }

          ButtonApi.prototype.dispose = function () {
            this.controller.dispose();
          };

          ButtonApi.prototype.on = function (eventName, handler) {
            var emitter = this.controller.button.emitter;
            emitter.on(eventName, handler);
            return this;
          };

          return ButtonApi;
        }();

        exports.ButtonApi = ButtonApi;
        /***/
      },

      /***/
      "./src/main/js/api/folder.ts":
      /*!***********************************!*\
        !*** ./src/main/js/api/folder.ts ***!
        \***********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var InputBindingControllerCreators = __webpack_require__(
        /*! ../controller/binding-creators/input */
        "./src/main/js/controller/binding-creators/input.ts");

        var MonitorBindingControllerCreators = __webpack_require__(
        /*! ../controller/binding-creators/monitor */
        "./src/main/js/controller/binding-creators/monitor.ts");

        var button_1 = __webpack_require__(
        /*! ../controller/button */
        "./src/main/js/controller/button.ts");

        var separator_1 = __webpack_require__(
        /*! ../controller/separator */
        "./src/main/js/controller/separator.ts");

        var target_1 = __webpack_require__(
        /*! ../model/target */
        "./src/main/js/model/target.ts");

        var button_2 = __webpack_require__(
        /*! ./button */
        "./src/main/js/api/button.ts");

        var input_binding_1 = __webpack_require__(
        /*! ./input-binding */
        "./src/main/js/api/input-binding.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ./monitor-binding */
        "./src/main/js/api/monitor-binding.ts");

        var TO_INTERNAL_EVENT_NAME_MAP = {
          change: 'inputchange',
          fold: 'fold',
          update: 'monitorupdate'
        };

        var FolderApi =
        /** @class */
        function () {
          /**
           * @hidden
           */
          function FolderApi(folderController) {
            this.controller = folderController;
          }

          Object.defineProperty(FolderApi.prototype, "expanded", {
            get: function () {
              return this.controller.folder.expanded;
            },
            set: function (expanded) {
              this.controller.folder.expanded = expanded;
            },
            enumerable: true,
            configurable: true
          });

          FolderApi.prototype.dispose = function () {
            this.controller.dispose();
          };

          FolderApi.prototype.addInput = function (object, key, opt_params) {
            var params = opt_params || {};
            var uc = InputBindingControllerCreators.create(this.controller.document, new target_1.Target(object, key, params.presetKey), params);
            this.controller.uiControllerList.append(uc);
            return new input_binding_1.InputBindingApi(uc);
          };

          FolderApi.prototype.addMonitor = function (object, key, opt_params) {
            var params = opt_params || {};
            var uc = MonitorBindingControllerCreators.create(this.controller.document, new target_1.Target(object, key), params);
            this.controller.uiControllerList.append(uc);
            return new monitor_binding_1.MonitorBindingApi(uc);
          };

          FolderApi.prototype.addButton = function (params) {
            var uc = new button_1.ButtonController(this.controller.document, params);
            this.controller.uiControllerList.append(uc);
            return new button_2.ButtonApi(uc);
          };

          FolderApi.prototype.addSeparator = function () {
            var uc = new separator_1.SeparatorController(this.controller.document);
            this.controller.uiControllerList.append(uc);
          };

          FolderApi.prototype.on = function (eventName, handler) {
            var internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];

            if (internalEventName) {
              var emitter = this.controller.emitter;
              emitter.on(internalEventName, handler);
            }

            return this;
          };

          return FolderApi;
        }();

        exports.FolderApi = FolderApi;
        /***/
      },

      /***/
      "./src/main/js/api/input-binding.ts":
      /*!******************************************!*\
        !*** ./src/main/js/api/input-binding.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * The API for the input binding between the parameter and the pane.
         * @param In The type inner Tweakpane.
         * @param Out The type outer Tweakpane (= parameter object).
         */

        var InputBindingApi =
        /** @class */
        function () {
          /**
           * @hidden
           */
          function InputBindingApi(bindingController) {
            this.controller = bindingController;
          }

          InputBindingApi.prototype.dispose = function () {
            this.controller.dispose();
          };

          InputBindingApi.prototype.on = function (eventName, handler) {
            var emitter = this.controller.binding.value.emitter;
            emitter.on(eventName, handler);
            return this;
          };

          InputBindingApi.prototype.refresh = function () {
            this.controller.binding.read();
          };

          return InputBindingApi;
        }();

        exports.InputBindingApi = InputBindingApi;
        /***/
      },

      /***/
      "./src/main/js/api/monitor-binding.ts":
      /*!********************************************!*\
        !*** ./src/main/js/api/monitor-binding.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * The API for the monitor binding between the parameter and the pane.
         */

        var MonitorBindingApi =
        /** @class */
        function () {
          /**
           * @hidden
           */
          function MonitorBindingApi(bindingController) {
            this.controller = bindingController;
          }

          MonitorBindingApi.prototype.dispose = function () {
            this.controller.dispose();
          };

          MonitorBindingApi.prototype.on = function (eventName, handler) {
            var emitter = this.controller.binding.value.emitter;
            emitter.on(eventName, handler);
            return this;
          };

          MonitorBindingApi.prototype.refresh = function () {
            this.controller.binding.read();
          };

          return MonitorBindingApi;
        }();

        exports.MonitorBindingApi = MonitorBindingApi;
        /***/
      },

      /***/
      "./src/main/js/api/preset.ts":
      /*!***********************************!*\
        !*** ./src/main/js/api/preset.ts ***!
        \***********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        function exportJson(targets) {
          return targets.reduce(function (result, target) {
            var _a;

            return Object.assign(result, (_a = {}, _a[target.presetKey] = target.read(), _a));
          }, {});
        }

        exports.exportJson = exportJson;
        /**
         * @hidden
         */

        function importJson(targets, preset) {
          targets.forEach(function (target) {
            var value = preset[target.presetKey];

            if (value !== undefined) {
              target.write(value);
            }
          });
        }

        exports.importJson = importJson;
        /***/
      },

      /***/
      "./src/main/js/api/root.ts":
      /*!*********************************!*\
        !*** ./src/main/js/api/root.ts ***!
        \*********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var InputBindingControllerCreators = __webpack_require__(
        /*! ../controller/binding-creators/input */
        "./src/main/js/controller/binding-creators/input.ts");

        var MonitorBindingControllerCreators = __webpack_require__(
        /*! ../controller/binding-creators/monitor */
        "./src/main/js/controller/binding-creators/monitor.ts");

        var button_1 = __webpack_require__(
        /*! ../controller/button */
        "./src/main/js/controller/button.ts");

        var folder_1 = __webpack_require__(
        /*! ../controller/folder */
        "./src/main/js/controller/folder.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../controller/input-binding */
        "./src/main/js/controller/input-binding.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ../controller/monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");

        var separator_1 = __webpack_require__(
        /*! ../controller/separator */
        "./src/main/js/controller/separator.ts");

        var UiUtil = __webpack_require__(
        /*! ../controller/ui-util */
        "./src/main/js/controller/ui-util.ts");

        var target_1 = __webpack_require__(
        /*! ../model/target */
        "./src/main/js/model/target.ts");

        var button_2 = __webpack_require__(
        /*! ./button */
        "./src/main/js/api/button.ts");

        var folder_2 = __webpack_require__(
        /*! ./folder */
        "./src/main/js/api/folder.ts");

        var input_binding_2 = __webpack_require__(
        /*! ./input-binding */
        "./src/main/js/api/input-binding.ts");

        var monitor_binding_2 = __webpack_require__(
        /*! ./monitor-binding */
        "./src/main/js/api/monitor-binding.ts");

        var Preset = __webpack_require__(
        /*! ./preset */
        "./src/main/js/api/preset.ts");

        var TO_INTERNAL_EVENT_NAME_MAP = {
          change: 'inputchange',
          fold: 'fold',
          update: 'monitorupdate'
        };
        /**
         * The Tweakpane interface.
         *
         * ```
         * new Tweakpane(options: TweakpaneConfig): RootApi
         * ```
         *
         * See [[TweakpaneConfig]] interface for available options.
         */

        var RootApi =
        /** @class */
        function () {
          /**
           * @hidden
           */
          function RootApi(rootController) {
            this.controller = rootController;
          }

          Object.defineProperty(RootApi.prototype, "element", {
            get: function () {
              return this.controller.view.element;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(RootApi.prototype, "expanded", {
            get: function () {
              var folder = this.controller.folder;
              return folder ? folder.expanded : true;
            },
            set: function (expanded) {
              var folder = this.controller.folder;

              if (folder) {
                folder.expanded = expanded;
              }
            },
            enumerable: true,
            configurable: true
          });

          RootApi.prototype.dispose = function () {
            this.controller.dispose();
          };

          RootApi.prototype.addInput = function (object, key, opt_params) {
            var params = opt_params || {};
            var uc = InputBindingControllerCreators.create(this.controller.document, new target_1.Target(object, key, params.presetKey), params);
            this.controller.uiControllerList.append(uc);
            return new input_binding_2.InputBindingApi(uc);
          };

          RootApi.prototype.addMonitor = function (object, key, opt_params) {
            var params = opt_params || {};
            var uc = MonitorBindingControllerCreators.create(this.controller.document, new target_1.Target(object, key), params);
            this.controller.uiControllerList.append(uc);
            return new monitor_binding_2.MonitorBindingApi(uc);
          };

          RootApi.prototype.addButton = function (params) {
            var uc = new button_1.ButtonController(this.controller.document, params);
            this.controller.uiControllerList.append(uc);
            return new button_2.ButtonApi(uc);
          };

          RootApi.prototype.addFolder = function (params) {
            var uc = new folder_1.FolderController(this.controller.document, params);
            this.controller.uiControllerList.append(uc);
            return new folder_2.FolderApi(uc);
          };

          RootApi.prototype.addSeparator = function () {
            var uc = new separator_1.SeparatorController(this.controller.document);
            this.controller.uiControllerList.append(uc);
          };
          /**
           * Import a preset of all inputs.
           * @param preset The preset object to import.
           */


          RootApi.prototype.importPreset = function (preset) {
            var targets = UiUtil.findControllers(this.controller.uiControllerList.items, input_binding_1.InputBindingController).map(function (ibc) {
              return ibc.binding.target;
            });
            Preset.importJson(targets, preset);
            this.refresh();
          };
          /**
           * Export a preset of all inputs.
           * @return The exported preset object.
           */


          RootApi.prototype.exportPreset = function () {
            var targets = UiUtil.findControllers(this.controller.uiControllerList.items, input_binding_1.InputBindingController).map(function (ibc) {
              return ibc.binding.target;
            });
            return Preset.exportJson(targets);
          };
          /**
           * Adds a global event listener. It handles all events of child inputs/monitors.
           * @param eventName The event name to listen.
           * @return The API object itself.
           */


          RootApi.prototype.on = function (eventName, handler) {
            var internalEventName = TO_INTERNAL_EVENT_NAME_MAP[eventName];

            if (internalEventName) {
              var emitter = this.controller.emitter;
              emitter.on(internalEventName, handler);
            }

            return this;
          };
          /**
           * Refreshes all bindings of the pane.
           */


          RootApi.prototype.refresh = function () {
            // Force-read all input bindings
            UiUtil.findControllers(this.controller.uiControllerList.items, input_binding_1.InputBindingController).forEach(function (ibc) {
              ibc.binding.read();
            }); // Force-read all monitor bindings

            UiUtil.findControllers(this.controller.uiControllerList.items, monitor_binding_1.MonitorBindingController).forEach(function (mbc) {
              mbc.binding.read();
            });
          };

          return RootApi;
        }();

        exports.RootApi = RootApi;
        /***/
      },

      /***/
      "./src/main/js/binding/input.ts":
      /*!**************************************!*\
        !*** ./src/main/js/binding/input.ts ***!
        \**************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var InputBinding =
        /** @class */
        function () {
          function InputBinding(config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.reader_ = config.reader;
            this.writer_ = config.writer;
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.target = config.target;
            this.read();
          }

          InputBinding.prototype.read = function () {
            var targetValue = this.target.read();

            if (targetValue !== undefined) {
              this.value.rawValue = this.reader_(targetValue);
            }
          };

          InputBinding.prototype.write_ = function (rawValue) {
            var value = this.writer_(rawValue);
            this.target.write(value);
          };

          InputBinding.prototype.onValueChange_ = function (rawValue) {
            this.write_(rawValue);
          };

          return InputBinding;
        }();

        exports.InputBinding = InputBinding;
        /***/
      },

      /***/
      "./src/main/js/binding/monitor.ts":
      /*!****************************************!*\
        !*** ./src/main/js/binding/monitor.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var MonitorBinding =
        /** @class */
        function () {
          function MonitorBinding(config) {
            this.onTick_ = this.onTick_.bind(this);
            this.reader_ = config.reader;
            this.target = config.target;
            this.value = config.value;
            this.ticker = config.ticker;
            this.ticker.emitter.on('tick', this.onTick_);
            this.read();
          }

          MonitorBinding.prototype.dispose = function () {
            this.ticker.dispose();
          };

          MonitorBinding.prototype.read = function () {
            var targetValue = this.target.read();

            if (targetValue !== undefined) {
              this.value.append(this.reader_(targetValue));
            }
          };

          MonitorBinding.prototype.onTick_ = function () {
            this.read();
          };

          return MonitorBinding;
        }();

        exports.MonitorBinding = MonitorBinding;
        /***/
      },

      /***/
      "./src/main/js/constraint/composite.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/constraint/composite.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var CompositeConstraint =
        /** @class */
        function () {
          function CompositeConstraint(config) {
            this.constraints_ = config.constraints;
          }

          Object.defineProperty(CompositeConstraint.prototype, "constraints", {
            get: function () {
              return this.constraints_;
            },
            enumerable: true,
            configurable: true
          });

          CompositeConstraint.prototype.constrain = function (value) {
            return this.constraints_.reduce(function (result, c) {
              return c.constrain(result);
            }, value);
          };

          return CompositeConstraint;
        }();

        exports.CompositeConstraint = CompositeConstraint;
        /***/
      },

      /***/
      "./src/main/js/constraint/list.ts":
      /*!****************************************!*\
        !*** ./src/main/js/constraint/list.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var ListConstraint =
        /** @class */
        function () {
          function ListConstraint(config) {
            this.opts_ = config.options;
          }

          Object.defineProperty(ListConstraint.prototype, "options", {
            get: function () {
              return this.opts_;
            },
            enumerable: true,
            configurable: true
          });

          ListConstraint.prototype.constrain = function (value) {
            var opts = this.opts_;

            if (opts.length === 0) {
              return value;
            }

            var matched = opts.filter(function (item) {
              return item.value === value;
            }).length > 0;
            return matched ? value : opts[0].value;
          };

          return ListConstraint;
        }();

        exports.ListConstraint = ListConstraint;
        /***/
      },

      /***/
      "./src/main/js/constraint/point-2d.ts":
      /*!********************************************!*\
        !*** ./src/main/js/constraint/point-2d.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var point_2d_1 = __webpack_require__(
        /*! ../model/point-2d */
        "./src/main/js/model/point-2d.ts");
        /**
         * @hidden
         */


        var Point2dConstraint =
        /** @class */
        function () {
          function Point2dConstraint(config) {
            this.xConstraint = config.x;
            this.yConstraint = config.y;
          }

          Point2dConstraint.prototype.constrain = function (value) {
            return new point_2d_1.Point2d(this.xConstraint ? this.xConstraint.constrain(value.x) : value.x, this.yConstraint ? this.yConstraint.constrain(value.y) : value.y);
          };

          return Point2dConstraint;
        }();

        exports.Point2dConstraint = Point2dConstraint;
        /***/
      },

      /***/
      "./src/main/js/constraint/range.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/constraint/range.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");
        /**
         * @hidden
         */


        var RangeConstraint =
        /** @class */
        function () {
          function RangeConstraint(config) {
            this.maxValue = config.max;
            this.minValue = config.min;
          }

          RangeConstraint.prototype.constrain = function (value) {
            var result = value;

            if (!type_util_1.TypeUtil.isEmpty(this.minValue)) {
              result = Math.max(result, this.minValue);
            }

            if (!type_util_1.TypeUtil.isEmpty(this.maxValue)) {
              result = Math.min(result, this.maxValue);
            }

            return result;
          };

          return RangeConstraint;
        }();

        exports.RangeConstraint = RangeConstraint;
        /***/
      },

      /***/
      "./src/main/js/constraint/step.ts":
      /*!****************************************!*\
        !*** ./src/main/js/constraint/step.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var StepConstraint =
        /** @class */
        function () {
          function StepConstraint(config) {
            this.step = config.step;
          }

          StepConstraint.prototype.constrain = function (value) {
            var r = value < 0 ? -Math.round(-value / this.step) : Math.round(value / this.step);
            return r * this.step;
          };

          return StepConstraint;
        }();

        exports.StepConstraint = StepConstraint;
        /***/
      },

      /***/
      "./src/main/js/constraint/util.ts":
      /*!****************************************!*\
        !*** ./src/main/js/constraint/util.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var composite_1 = __webpack_require__(
        /*! ./composite */
        "./src/main/js/constraint/composite.ts");
        /**
         * @hidden
         */


        exports.ConstraintUtil = {
          findConstraint: function (c, constraintClass) {
            if (c instanceof constraintClass) {
              return c;
            }

            if (c instanceof composite_1.CompositeConstraint) {
              var result = c.constraints.reduce(function (tmpResult, sc) {
                if (tmpResult) {
                  return tmpResult;
                }

                return sc instanceof constraintClass ? sc : null;
              }, null);

              if (result) {
                return result;
              }
            }

            return null;
          }
        };
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/boolean-input.ts":
      /*!******************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/boolean-input.ts ***!
        \******************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var input_1 = __webpack_require__(
        /*! ../../binding/input */
        "./src/main/js/binding/input.ts");

        var composite_1 = __webpack_require__(
        /*! ../../constraint/composite */
        "./src/main/js/constraint/composite.ts");

        var list_1 = __webpack_require__(
        /*! ../../constraint/list */
        "./src/main/js/constraint/list.ts");

        var util_1 = __webpack_require__(
        /*! ../../constraint/util */
        "./src/main/js/constraint/util.ts");

        var BooleanConverter = __webpack_require__(
        /*! ../../converter/boolean */
        "./src/main/js/converter/boolean.ts");

        var input_value_1 = __webpack_require__(
        /*! ../../model/input-value */
        "./src/main/js/model/input-value.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../input-binding */
        "./src/main/js/controller/input-binding.ts");

        var checkbox_1 = __webpack_require__(
        /*! ../input/checkbox */
        "./src/main/js/controller/input/checkbox.ts");

        var list_2 = __webpack_require__(
        /*! ../input/list */
        "./src/main/js/controller/input/list.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        function createConstraint(params) {
          var constraints = [];

          if (params.options) {
            constraints.push(new list_1.ListConstraint({
              options: UiUtil.normalizeInputParamsOptions(params.options, BooleanConverter.fromMixed)
            }));
          }

          return new composite_1.CompositeConstraint({
            constraints: constraints
          });
        }

        function createController(document, value) {
          var c = value.constraint;

          if (c && util_1.ConstraintUtil.findConstraint(c, list_1.ListConstraint)) {
            return new list_2.ListInputController(document, {
              stringifyValue: BooleanConverter.toString,
              value: value
            });
          }

          return new checkbox_1.CheckboxInputController(document, {
            value: value
          });
        }
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'boolean') {
            return null;
          }

          var value = new input_value_1.InputValue(false, createConstraint(params));
          var binding = new input_1.InputBinding({
            reader: BooleanConverter.fromMixed,
            target: target,
            value: value,
            writer: function (v) {
              return v;
            }
          });
          return new input_binding_1.InputBindingController(document, {
            binding: binding,
            controller: createController(document, value),
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/boolean-monitor.ts":
      /*!********************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/boolean-monitor.ts ***!
        \********************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var monitor_1 = __webpack_require__(
        /*! ../../binding/monitor */
        "./src/main/js/binding/monitor.ts");

        var BooleanConverter = __webpack_require__(
        /*! ../../converter/boolean */
        "./src/main/js/converter/boolean.ts");

        var boolean_1 = __webpack_require__(
        /*! ../../formatter/boolean */
        "./src/main/js/formatter/boolean.ts");

        var constants_1 = __webpack_require__(
        /*! ../../misc/constants */
        "./src/main/js/misc/constants.ts");

        var interval_1 = __webpack_require__(
        /*! ../../misc/ticker/interval */
        "./src/main/js/misc/ticker/interval.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var monitor_value_1 = __webpack_require__(
        /*! ../../model/monitor-value */
        "./src/main/js/model/monitor-value.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ../monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");

        var multi_log_1 = __webpack_require__(
        /*! ../monitor/multi-log */
        "./src/main/js/controller/monitor/multi-log.ts");

        var single_log_1 = __webpack_require__(
        /*! ../monitor/single-log */
        "./src/main/js/controller/monitor/single-log.ts");
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'boolean') {
            return null;
          }

          var value = new monitor_value_1.MonitorValue(type_util_1.TypeUtil.getOrDefault(params.count, 1));
          var controller = value.totalCount === 1 ? new single_log_1.SingleLogMonitorController(document, {
            formatter: new boolean_1.BooleanFormatter(),
            value: value
          }) : new multi_log_1.MultiLogMonitorController(document, {
            formatter: new boolean_1.BooleanFormatter(),
            value: value
          });
          var ticker = new interval_1.IntervalTicker(document, type_util_1.TypeUtil.getOrDefault(params.interval, constants_1.Constants.monitorDefaultInterval));
          return new monitor_binding_1.MonitorBindingController(document, {
            binding: new monitor_1.MonitorBinding({
              reader: BooleanConverter.fromMixed,
              target: target,
              ticker: ticker,
              value: value
            }),
            controller: controller,
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/color-input.ts":
      /*!****************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/color-input.ts ***!
        \****************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var input_1 = __webpack_require__(
        /*! ../../binding/input */
        "./src/main/js/binding/input.ts");

        var ColorConverter = __webpack_require__(
        /*! ../../converter/color */
        "./src/main/js/converter/color.ts");

        var color_1 = __webpack_require__(
        /*! ../../formatter/color */
        "./src/main/js/formatter/color.ts");

        var color_2 = __webpack_require__(
        /*! ../../model/color */
        "./src/main/js/model/color.ts");

        var input_value_1 = __webpack_require__(
        /*! ../../model/input-value */
        "./src/main/js/model/input-value.ts");

        var number_color_1 = __webpack_require__(
        /*! ../../parser/number-color */
        "./src/main/js/parser/number-color.ts");

        var StringColorParser = __webpack_require__(
        /*! ../../parser/string-color */
        "./src/main/js/parser/string-color.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../input-binding */
        "./src/main/js/controller/input-binding.ts");

        var color_swatch_text_1 = __webpack_require__(
        /*! ../input/color-swatch-text */
        "./src/main/js/controller/input/color-swatch-text.ts");
        /**
         * @hidden
         */


        function createWithString(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'string') {
            return null;
          }

          var notation = StringColorParser.getNotation(initialValue);

          if (!notation) {
            return null;
          }

          var converter = ColorConverter.fromMixed;
          var color = converter(initialValue);
          var value = new input_value_1.InputValue(color);
          var writer = ColorConverter.getStringifier(notation);
          return new input_binding_1.InputBindingController(document, {
            binding: new input_1.InputBinding({
              reader: converter,
              target: target,
              value: value,
              writer: writer
            }),
            controller: new color_swatch_text_1.ColorSwatchTextInputController(document, {
              formatter: new color_1.ColorFormatter(writer),
              parser: StringColorParser.CompositeParser,
              value: value
            }),
            label: params.label || target.key
          });
        }

        exports.createWithString = createWithString;
        /**
         * @hidden
         */

        function createWithNumber(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'number') {
            return null;
          }

          if (!('input' in params)) {
            return null;
          }

          if (params.input !== 'color' && params.input !== 'color.rgb') {
            return null;
          }

          var color = number_color_1.NumberColorParser(initialValue);

          if (!color) {
            return null;
          }

          var value = new input_value_1.InputValue(color);
          return new input_binding_1.InputBindingController(document, {
            binding: new input_1.InputBinding({
              reader: ColorConverter.fromMixed,
              target: target,
              value: value,
              writer: ColorConverter.toNumber
            }),
            controller: new color_swatch_text_1.ColorSwatchTextInputController(document, {
              formatter: new color_1.ColorFormatter(ColorConverter.toHexRgbString),
              parser: StringColorParser.CompositeParser,
              value: value
            }),
            label: params.label || target.key
          });
        }

        exports.createWithNumber = createWithNumber;
        /**
         * @hidden
         */

        function createWithObject(document, target, params) {
          var initialValue = target.read();

          if (!color_2.Color.isRgbColorObject(initialValue)) {
            return null;
          }

          var color = color_2.Color.fromRgbObject(initialValue);
          var value = new input_value_1.InputValue(color);
          return new input_binding_1.InputBindingController(document, {
            binding: new input_1.InputBinding({
              reader: ColorConverter.fromMixed,
              target: target,
              value: value,
              writer: color_2.Color.toRgbObject
            }),
            controller: new color_swatch_text_1.ColorSwatchTextInputController(document, {
              formatter: new color_1.ColorFormatter(ColorConverter.toHexRgbString),
              parser: StringColorParser.CompositeParser,
              value: value
            }),
            label: params.label || target.key
          });
        }

        exports.createWithObject = createWithObject;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/input.ts":
      /*!**********************************************************!*\
        !*** ./src/main/js/controller/binding-creators/input.ts ***!
        \**********************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var BooleanInputBindingControllerCreators = __webpack_require__(
        /*! ./boolean-input */
        "./src/main/js/controller/binding-creators/boolean-input.ts");

        var ColorInputBindingControllerCreators = __webpack_require__(
        /*! ./color-input */
        "./src/main/js/controller/binding-creators/color-input.ts");

        var NumberInputBindingControllerCreators = __webpack_require__(
        /*! ./number-input */
        "./src/main/js/controller/binding-creators/number-input.ts");

        var Point2dInputBindingControllerCreators = __webpack_require__(
        /*! ./point-2d-input */
        "./src/main/js/controller/binding-creators/point-2d-input.ts");

        var StringInputBindingControllerCreators = __webpack_require__(
        /*! ./string-input */
        "./src/main/js/controller/binding-creators/string-input.ts");
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (type_util_1.TypeUtil.isEmpty(initialValue)) {
            throw new pane_error_1.PaneError({
              context: {
                key: target.key
              },
              type: 'emptyvalue'
            });
          }

          var bc = [BooleanInputBindingControllerCreators.create, ColorInputBindingControllerCreators.createWithNumber, ColorInputBindingControllerCreators.createWithObject, ColorInputBindingControllerCreators.createWithString, NumberInputBindingControllerCreators.create, StringInputBindingControllerCreators.create, Point2dInputBindingControllerCreators.create].reduce(function (result, createBindingController) {
            return result || createBindingController(document, target, params);
          }, null);

          if (bc) {
            return bc;
          }

          throw new pane_error_1.PaneError({
            context: {
              key: target.key
            },
            type: 'nomatchingcontroller'
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/monitor.ts":
      /*!************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/monitor.ts ***!
        \************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var BooleanMonitorBindingControllerCreators = __webpack_require__(
        /*! ./boolean-monitor */
        "./src/main/js/controller/binding-creators/boolean-monitor.ts");

        var NumberMonitorBindingControllerCreators = __webpack_require__(
        /*! ./number-monitor */
        "./src/main/js/controller/binding-creators/number-monitor.ts");

        var StringMonitorBindingControllerCreators = __webpack_require__(
        /*! ./string-monitor */
        "./src/main/js/controller/binding-creators/string-monitor.ts");
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (type_util_1.TypeUtil.isEmpty(initialValue)) {
            throw new pane_error_1.PaneError({
              context: {
                key: target.key
              },
              type: 'emptyvalue'
            });
          }

          var bc = [NumberMonitorBindingControllerCreators.create, StringMonitorBindingControllerCreators.create, BooleanMonitorBindingControllerCreators.create].reduce(function (result, createBindingController) {
            return result || createBindingController(document, target, params);
          }, null);

          if (bc) {
            return bc;
          }

          throw new pane_error_1.PaneError({
            context: {
              key: target.key
            },
            type: 'nomatchingcontroller'
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/number-input.ts":
      /*!*****************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/number-input.ts ***!
        \*****************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var input_1 = __webpack_require__(
        /*! ../../binding/input */
        "./src/main/js/binding/input.ts");

        var composite_1 = __webpack_require__(
        /*! ../../constraint/composite */
        "./src/main/js/constraint/composite.ts");

        var list_1 = __webpack_require__(
        /*! ../../constraint/list */
        "./src/main/js/constraint/list.ts");

        var range_1 = __webpack_require__(
        /*! ../../constraint/range */
        "./src/main/js/constraint/range.ts");

        var step_1 = __webpack_require__(
        /*! ../../constraint/step */
        "./src/main/js/constraint/step.ts");

        var util_1 = __webpack_require__(
        /*! ../../constraint/util */
        "./src/main/js/constraint/util.ts");

        var NumberConverter = __webpack_require__(
        /*! ../../converter/number */
        "./src/main/js/converter/number.ts");

        var number_1 = __webpack_require__(
        /*! ../../formatter/number */
        "./src/main/js/formatter/number.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var input_value_1 = __webpack_require__(
        /*! ../../model/input-value */
        "./src/main/js/model/input-value.ts");

        var string_number_1 = __webpack_require__(
        /*! ../../parser/string-number */
        "./src/main/js/parser/string-number.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../input-binding */
        "./src/main/js/controller/input-binding.ts");

        var list_2 = __webpack_require__(
        /*! ../input/list */
        "./src/main/js/controller/input/list.ts");

        var number_text_1 = __webpack_require__(
        /*! ../input/number-text */
        "./src/main/js/controller/input/number-text.ts");

        var slider_text_1 = __webpack_require__(
        /*! ../input/slider-text */
        "./src/main/js/controller/input/slider-text.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        function createConstraint(params) {
          var constraints = [];

          if ('step' in params && !type_util_1.TypeUtil.isEmpty(params.step)) {
            constraints.push(new step_1.StepConstraint({
              step: params.step
            }));
          }

          if ('max' in params && !type_util_1.TypeUtil.isEmpty(params.max) || 'min' in params && !type_util_1.TypeUtil.isEmpty(params.min)) {
            constraints.push(new range_1.RangeConstraint({
              max: params.max,
              min: params.min
            }));
          }

          if (params.options) {
            constraints.push(new list_1.ListConstraint({
              options: UiUtil.normalizeInputParamsOptions(params.options, NumberConverter.fromMixed)
            }));
          }

          return new composite_1.CompositeConstraint({
            constraints: constraints
          });
        }

        function createController(document, value) {
          var c = value.constraint;

          if (c && util_1.ConstraintUtil.findConstraint(c, list_1.ListConstraint)) {
            return new list_2.ListInputController(document, {
              stringifyValue: NumberConverter.toString,
              value: value
            });
          }

          if (c && util_1.ConstraintUtil.findConstraint(c, range_1.RangeConstraint)) {
            return new slider_text_1.SliderTextInputController(document, {
              formatter: new number_1.NumberFormatter(UiUtil.getSuitableDecimalDigits(value.constraint, value.rawValue)),
              parser: string_number_1.StringNumberParser,
              value: value
            });
          }

          return new number_text_1.NumberTextInputController(document, {
            formatter: new number_1.NumberFormatter(UiUtil.getSuitableDecimalDigits(value.constraint, value.rawValue)),
            parser: string_number_1.StringNumberParser,
            value: value
          });
        }
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'number') {
            return null;
          }

          var value = new input_value_1.InputValue(0, createConstraint(params));
          var binding = new input_1.InputBinding({
            reader: NumberConverter.fromMixed,
            target: target,
            value: value,
            writer: function (v) {
              return v;
            }
          });
          return new input_binding_1.InputBindingController(document, {
            binding: binding,
            controller: createController(document, value),
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/number-monitor.ts":
      /*!*******************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/number-monitor.ts ***!
        \*******************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var monitor_1 = __webpack_require__(
        /*! ../../binding/monitor */
        "./src/main/js/binding/monitor.ts");

        var NumberConverter = __webpack_require__(
        /*! ../../converter/number */
        "./src/main/js/converter/number.ts");

        var number_1 = __webpack_require__(
        /*! ../../formatter/number */
        "./src/main/js/formatter/number.ts");

        var constants_1 = __webpack_require__(
        /*! ../../misc/constants */
        "./src/main/js/misc/constants.ts");

        var interval_1 = __webpack_require__(
        /*! ../../misc/ticker/interval */
        "./src/main/js/misc/ticker/interval.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var monitor_value_1 = __webpack_require__(
        /*! ../../model/monitor-value */
        "./src/main/js/model/monitor-value.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ../monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");

        var graph_1 = __webpack_require__(
        /*! ../monitor/graph */
        "./src/main/js/controller/monitor/graph.ts");

        var multi_log_1 = __webpack_require__(
        /*! ../monitor/multi-log */
        "./src/main/js/controller/monitor/multi-log.ts");

        var single_log_1 = __webpack_require__(
        /*! ../monitor/single-log */
        "./src/main/js/controller/monitor/single-log.ts");

        function createFormatter() {
          // TODO: formatter precision
          return new number_1.NumberFormatter(2);
        }

        function createTextMonitor(document, target, params) {
          var value = new monitor_value_1.MonitorValue(type_util_1.TypeUtil.getOrDefault(params.count, 1));
          var controller = value.totalCount === 1 ? new single_log_1.SingleLogMonitorController(document, {
            formatter: createFormatter(),
            value: value
          }) : new multi_log_1.MultiLogMonitorController(document, {
            formatter: createFormatter(),
            value: value
          });
          var ticker = new interval_1.IntervalTicker(document, type_util_1.TypeUtil.getOrDefault(params.interval, constants_1.Constants.monitorDefaultInterval));
          return new monitor_binding_1.MonitorBindingController(document, {
            binding: new monitor_1.MonitorBinding({
              reader: NumberConverter.fromMixed,
              target: target,
              ticker: ticker,
              value: value
            }),
            controller: controller,
            label: params.label || target.key
          });
        }

        function createGraphMonitor(document, target, params) {
          var value = new monitor_value_1.MonitorValue(type_util_1.TypeUtil.getOrDefault(params.count, 64));
          var ticker = new interval_1.IntervalTicker(document, type_util_1.TypeUtil.getOrDefault(params.interval, constants_1.Constants.monitorDefaultInterval));
          return new monitor_binding_1.MonitorBindingController(document, {
            binding: new monitor_1.MonitorBinding({
              reader: NumberConverter.fromMixed,
              target: target,
              ticker: ticker,
              value: value
            }),
            controller: new graph_1.GraphMonitorController(document, {
              formatter: createFormatter(),
              maxValue: type_util_1.TypeUtil.getOrDefault('max' in params ? params.max : null, 100),
              minValue: type_util_1.TypeUtil.getOrDefault('min' in params ? params.min : null, 0),
              value: value
            }),
            label: params.label || target.key
          });
        }

        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'number') {
            return null;
          }

          if ('view' in params && params.view === 'graph') {
            return createGraphMonitor(document, target, params);
          }

          return createTextMonitor(document, target, params);
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/point-2d-input.ts":
      /*!*******************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/point-2d-input.ts ***!
        \*******************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var input_1 = __webpack_require__(
        /*! ../../binding/input */
        "./src/main/js/binding/input.ts");

        var composite_1 = __webpack_require__(
        /*! ../../constraint/composite */
        "./src/main/js/constraint/composite.ts");

        var point_2d_1 = __webpack_require__(
        /*! ../../constraint/point-2d */
        "./src/main/js/constraint/point-2d.ts");

        var range_1 = __webpack_require__(
        /*! ../../constraint/range */
        "./src/main/js/constraint/range.ts");

        var step_1 = __webpack_require__(
        /*! ../../constraint/step */
        "./src/main/js/constraint/step.ts");

        var Point2dConverter = __webpack_require__(
        /*! ../../converter/point-2d */
        "./src/main/js/converter/point-2d.ts");

        var number_1 = __webpack_require__(
        /*! ../../formatter/number */
        "./src/main/js/formatter/number.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var input_value_1 = __webpack_require__(
        /*! ../../model/input-value */
        "./src/main/js/model/input-value.ts");

        var any_point_2d_1 = __webpack_require__(
        /*! ../../parser/any-point-2d */
        "./src/main/js/parser/any-point-2d.ts");

        var string_number_1 = __webpack_require__(
        /*! ../../parser/string-number */
        "./src/main/js/parser/string-number.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../input-binding */
        "./src/main/js/controller/input-binding.ts");

        var point_2d_pad_text_1 = __webpack_require__(
        /*! ../input/point-2d-pad-text */
        "./src/main/js/controller/input/point-2d-pad-text.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        function createDimensionConstraint(params) {
          if (!params) {
            return undefined;
          }

          var constraints = [];

          if (!type_util_1.TypeUtil.isEmpty(params.step)) {
            constraints.push(new step_1.StepConstraint({
              step: params.step
            }));
          }

          if (!type_util_1.TypeUtil.isEmpty(params.max) || !type_util_1.TypeUtil.isEmpty(params.min)) {
            constraints.push(new range_1.RangeConstraint({
              max: params.max,
              min: params.min
            }));
          }

          return new composite_1.CompositeConstraint({
            constraints: constraints
          });
        }

        function createConstraint(params) {
          return new point_2d_1.Point2dConstraint({
            x: createDimensionConstraint('x' in params ? params.x : undefined),
            y: createDimensionConstraint('y' in params ? params.y : undefined)
          });
        }

        function createController(document, value) {
          var c = value.constraint;

          if (!(c instanceof point_2d_1.Point2dConstraint)) {
            throw pane_error_1.PaneError.shouldNeverHappen();
          }

          return new point_2d_pad_text_1.Point2dPadTextInputController(document, {
            parser: string_number_1.StringNumberParser,
            value: value,
            xFormatter: new number_1.NumberFormatter(UiUtil.getSuitableDecimalDigits(c.xConstraint, value.rawValue.x)),
            yFormatter: new number_1.NumberFormatter(UiUtil.getSuitableDecimalDigits(c.yConstraint, value.rawValue.y))
          });
        }
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();
          var p = any_point_2d_1.AnyPoint2dParser(initialValue);

          if (!p) {
            return null;
          }

          var value = new input_value_1.InputValue(p, createConstraint(params));
          var binding = new input_1.InputBinding({
            reader: Point2dConverter.fromMixed,
            target: target,
            value: value,
            writer: function (v) {
              return v.toObject();
            }
          });
          return new input_binding_1.InputBindingController(document, {
            binding: binding,
            controller: createController(document, value),
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/string-input.ts":
      /*!*****************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/string-input.ts ***!
        \*****************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var input_1 = __webpack_require__(
        /*! ../../binding/input */
        "./src/main/js/binding/input.ts");

        var composite_1 = __webpack_require__(
        /*! ../../constraint/composite */
        "./src/main/js/constraint/composite.ts");

        var list_1 = __webpack_require__(
        /*! ../../constraint/list */
        "./src/main/js/constraint/list.ts");

        var util_1 = __webpack_require__(
        /*! ../../constraint/util */
        "./src/main/js/constraint/util.ts");

        var StringConverter = __webpack_require__(
        /*! ../../converter/string */
        "./src/main/js/converter/string.ts");

        var string_1 = __webpack_require__(
        /*! ../../formatter/string */
        "./src/main/js/formatter/string.ts");

        var input_value_1 = __webpack_require__(
        /*! ../../model/input-value */
        "./src/main/js/model/input-value.ts");

        var input_binding_1 = __webpack_require__(
        /*! ../input-binding */
        "./src/main/js/controller/input-binding.ts");

        var list_2 = __webpack_require__(
        /*! ../input/list */
        "./src/main/js/controller/input/list.ts");

        var text_1 = __webpack_require__(
        /*! ../input/text */
        "./src/main/js/controller/input/text.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        function createConstraint(params) {
          var constraints = [];

          if (params.options) {
            constraints.push(new list_1.ListConstraint({
              options: UiUtil.normalizeInputParamsOptions(params.options, StringConverter.fromMixed)
            }));
          }

          return new composite_1.CompositeConstraint({
            constraints: constraints
          });
        }

        function createController(document, value) {
          var c = value.constraint;

          if (c && util_1.ConstraintUtil.findConstraint(c, list_1.ListConstraint)) {
            return new list_2.ListInputController(document, {
              stringifyValue: StringConverter.toString,
              value: value
            });
          }

          return new text_1.TextInputController(document, {
            formatter: new string_1.StringFormatter(),
            parser: StringConverter.toString,
            value: value
          });
        }
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'string') {
            return null;
          }

          var value = new input_value_1.InputValue('', createConstraint(params));
          var binding = new input_1.InputBinding({
            reader: StringConverter.fromMixed,
            target: target,
            value: value,
            writer: function (v) {
              return v;
            }
          });
          return new input_binding_1.InputBindingController(document, {
            binding: binding,
            controller: createController(document, value),
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/binding-creators/string-monitor.ts":
      /*!*******************************************************************!*\
        !*** ./src/main/js/controller/binding-creators/string-monitor.ts ***!
        \*******************************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var monitor_1 = __webpack_require__(
        /*! ../../binding/monitor */
        "./src/main/js/binding/monitor.ts");

        var StringConverter = __webpack_require__(
        /*! ../../converter/string */
        "./src/main/js/converter/string.ts");

        var string_1 = __webpack_require__(
        /*! ../../formatter/string */
        "./src/main/js/formatter/string.ts");

        var constants_1 = __webpack_require__(
        /*! ../../misc/constants */
        "./src/main/js/misc/constants.ts");

        var interval_1 = __webpack_require__(
        /*! ../../misc/ticker/interval */
        "./src/main/js/misc/ticker/interval.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var monitor_value_1 = __webpack_require__(
        /*! ../../model/monitor-value */
        "./src/main/js/model/monitor-value.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ../monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");

        var multi_log_1 = __webpack_require__(
        /*! ../monitor/multi-log */
        "./src/main/js/controller/monitor/multi-log.ts");

        var single_log_1 = __webpack_require__(
        /*! ../monitor/single-log */
        "./src/main/js/controller/monitor/single-log.ts");
        /**
         * @hidden
         */


        function create(document, target, params) {
          var initialValue = target.read();

          if (typeof initialValue !== 'string') {
            return null;
          }

          var value = new monitor_value_1.MonitorValue(type_util_1.TypeUtil.getOrDefault(params.count, 1));
          var multiline = value.totalCount > 1 || 'multiline' in params && params.multiline;
          var controller = multiline ? new multi_log_1.MultiLogMonitorController(document, {
            formatter: new string_1.StringFormatter(),
            value: value
          }) : new single_log_1.SingleLogMonitorController(document, {
            formatter: new string_1.StringFormatter(),
            value: value
          });
          var ticker = new interval_1.IntervalTicker(document, type_util_1.TypeUtil.getOrDefault(params.interval, constants_1.Constants.monitorDefaultInterval));
          return new monitor_binding_1.MonitorBindingController(document, {
            binding: new monitor_1.MonitorBinding({
              reader: StringConverter.fromMixed,
              target: target,
              ticker: ticker,
              value: value
            }),
            controller: controller,
            label: params.label || target.key
          });
        }

        exports.create = create;
        /***/
      },

      /***/
      "./src/main/js/controller/button.ts":
      /*!******************************************!*\
        !*** ./src/main/js/controller/button.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var button_1 = __webpack_require__(
        /*! ../model/button */
        "./src/main/js/model/button.ts");

        var button_2 = __webpack_require__(
        /*! ../view/button */
        "./src/main/js/view/button.ts");
        /**
         * @hidden
         */


        var ButtonController =
        /** @class */
        function () {
          function ButtonController(document, config) {
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.button = new button_1.Button(config.title);
            this.view = new button_2.ButtonView(document, {
              button: this.button
            });
            this.view.buttonElement.addEventListener('click', this.onButtonClick_);
          }

          ButtonController.prototype.dispose = function () {
            this.view.dispose();
          };

          ButtonController.prototype.onButtonClick_ = function () {
            this.button.click();
          };

          return ButtonController;
        }();

        exports.ButtonController = ButtonController;
        /***/
      },

      /***/
      "./src/main/js/controller/folder.ts":
      /*!******************************************!*\
        !*** ./src/main/js/controller/folder.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var DomUtil = __webpack_require__(
        /*! ../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var folder_1 = __webpack_require__(
        /*! ../model/folder */
        "./src/main/js/model/folder.ts");

        var list_1 = __webpack_require__(
        /*! ../model/list */
        "./src/main/js/model/list.ts");

        var folder_2 = __webpack_require__(
        /*! ../view/folder */
        "./src/main/js/view/folder.ts");

        var input_binding_1 = __webpack_require__(
        /*! ./input-binding */
        "./src/main/js/controller/input-binding.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ./monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");
        /**
         * @hidden
         */


        var FolderController =
        /** @class */
        function () {
          function FolderController(document, config) {
            this.onFolderChange_ = this.onFolderChange_.bind(this);
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);
            this.onTitleClick_ = this.onTitleClick_.bind(this);
            this.onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);
            this.emitter = new emitter_1.Emitter();
            this.folder = new folder_1.Folder(config.title, type_util_1.TypeUtil.getOrDefault(config.expanded, true));
            this.folder.emitter.on('change', this.onFolderChange_);
            this.ucList_ = new list_1.List();
            this.ucList_.emitter.on('append', this.onUiControllerListAppend_);
            this.doc_ = document;
            this.view = new folder_2.FolderView(this.doc_, {
              folder: this.folder
            });
            this.view.titleElement.addEventListener('click', this.onTitleClick_);
          }

          Object.defineProperty(FolderController.prototype, "document", {
            get: function () {
              return this.doc_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(FolderController.prototype, "uiControllerList", {
            get: function () {
              return this.ucList_;
            },
            enumerable: true,
            configurable: true
          });

          FolderController.prototype.dispose = function () {
            this.view.dispose();
          };

          FolderController.prototype.computeExpandedHeight_ = function () {
            var _this = this;

            var elem = this.view.containerElement;
            var height = 0;
            DomUtil.disableTransitionTemporarily(elem, function () {
              // Expand folder
              var expanded = _this.folder.expanded;
              _this.folder.expandedHeight = null;
              _this.folder.expanded = true;
              DomUtil.forceReflow(elem); // Compute height

              height = elem.clientHeight; // Restore expanded

              _this.folder.expanded = expanded;
              DomUtil.forceReflow(elem);
            });
            return height;
          };

          FolderController.prototype.onTitleClick_ = function () {
            this.folder.expanded = !this.folder.expanded;
          };

          FolderController.prototype.onUiControllerListAppend_ = function (uc) {
            if (uc instanceof input_binding_1.InputBindingController) {
              var emitter = uc.binding.value.emitter;
              emitter.on('change', this.onInputChange_);
            } else if (uc instanceof monitor_binding_1.MonitorBindingController) {
              var emitter = uc.binding.value.emitter;
              emitter.on('update', this.onMonitorUpdate_);
            }

            this.view.containerElement.appendChild(uc.view.element);
            this.folder.expandedHeight = this.computeExpandedHeight_();
          };

          FolderController.prototype.onInputChange_ = function (value) {
            this.emitter.emit('inputchange', [value]);
          };

          FolderController.prototype.onMonitorUpdate_ = function (value) {
            this.emitter.emit('monitorupdate', [value]);
          };

          FolderController.prototype.onFolderChange_ = function () {
            this.emitter.emit('fold');
          };

          return FolderController;
        }();

        exports.FolderController = FolderController;
        /***/
      },

      /***/
      "./src/main/js/controller/input-binding.ts":
      /*!*************************************************!*\
        !*** ./src/main/js/controller/input-binding.ts ***!
        \*************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var labeled_1 = __webpack_require__(
        /*! ../view/labeled */
        "./src/main/js/view/labeled.ts");
        /**
         * @hidden
         */


        var InputBindingController =
        /** @class */
        function () {
          function InputBindingController(document, config) {
            this.binding = config.binding;
            this.controller = config.controller;
            this.view = new labeled_1.LabeledView(document, {
              label: config.label,
              view: this.controller.view
            });
          }

          InputBindingController.prototype.dispose = function () {
            this.controller.dispose();
            this.view.dispose();
          };

          return InputBindingController;
        }();

        exports.InputBindingController = InputBindingController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/checkbox.ts":
      /*!**************************************************!*\
        !*** ./src/main/js/controller/input/checkbox.ts ***!
        \**************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var checkbox_1 = __webpack_require__(
        /*! ../../view/input/checkbox */
        "./src/main/js/view/input/checkbox.ts");
        /**
         * @hidden
         */


        var CheckboxInputController =
        /** @class */
        function () {
          function CheckboxInputController(document, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.value = config.value;
            this.view = new checkbox_1.CheckboxInputView(document, {
              value: this.value
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
          }

          CheckboxInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          CheckboxInputController.prototype.onInputChange_ = function (e) {
            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            this.value.rawValue = inputElem.checked;
            this.view.update();
          };

          return CheckboxInputController;
        }();

        exports.CheckboxInputController = CheckboxInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/color-picker.ts":
      /*!******************************************************!*\
        !*** ./src/main/js/controller/input/color-picker.ts ***!
        \******************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_1 = __webpack_require__(
        /*! ../../formatter/number */
        "./src/main/js/formatter/number.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var foldable_1 = __webpack_require__(
        /*! ../../model/foldable */
        "./src/main/js/model/foldable.ts");

        var string_number_1 = __webpack_require__(
        /*! ../../parser/string-number */
        "./src/main/js/parser/string-number.ts");

        var color_picker_1 = __webpack_require__(
        /*! ../../view/input/color-picker */
        "./src/main/js/view/input/color-picker.ts");

        var h_palette_1 = __webpack_require__(
        /*! ./h-palette */
        "./src/main/js/controller/input/h-palette.ts");

        var rgb_text_1 = __webpack_require__(
        /*! ./rgb-text */
        "./src/main/js/controller/input/rgb-text.ts");

        var sv_palette_1 = __webpack_require__(
        /*! ./sv-palette */
        "./src/main/js/controller/input/sv-palette.ts");
        /**
         * @hidden
         */


        var ColorPickerInputController =
        /** @class */
        function () {
          function ColorPickerInputController(document, config) {
            var _this = this;

            this.onInputBlur_ = this.onInputBlur_.bind(this);
            this.value = config.value;
            this.foldable = new foldable_1.Foldable();
            this.hPaletteIc_ = new h_palette_1.HPaletteInputController(document, {
              value: this.value
            });
            this.svPaletteIc_ = new sv_palette_1.SvPaletteInputController(document, {
              value: this.value
            });
            this.rgbTextIc_ = new rgb_text_1.RgbTextInputController(document, {
              formatter: new number_1.NumberFormatter(0),
              parser: string_number_1.StringNumberParser,
              value: this.value
            });
            this.view = new color_picker_1.ColorPickerInputView(document, {
              foldable: this.foldable,
              hPaletteInputView: this.hPaletteIc_.view,
              rgbTextView: this.rgbTextIc_.view,
              svPaletteInputView: this.svPaletteIc_.view,
              value: this.value
            });
            this.view.allFocusableElements.forEach(function (elem) {
              elem.addEventListener('blur', _this.onInputBlur_);
            });
          }

          ColorPickerInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          ColorPickerInputController.prototype.onInputBlur_ = function (e) {
            var elem = this.view.element;
            var nextTarget = type_util_1.TypeUtil.forceCast(e.relatedTarget);

            if (!nextTarget || !elem.contains(nextTarget)) {
              this.foldable.expanded = false;
            }
          };

          return ColorPickerInputController;
        }();

        exports.ColorPickerInputController = ColorPickerInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/color-swatch-text.ts":
      /*!***********************************************************!*\
        !*** ./src/main/js/controller/input/color-swatch-text.ts ***!
        \***********************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var color_swatch_text_1 = __webpack_require__(
        /*! ../../view/input/color-swatch-text */
        "./src/main/js/view/input/color-swatch-text.ts");

        var color_swatch_1 = __webpack_require__(
        /*! ../input/color-swatch */
        "./src/main/js/controller/input/color-swatch.ts");

        var text_1 = __webpack_require__(
        /*! ./text */
        "./src/main/js/controller/input/text.ts");
        /**
         * @hidden
         */


        var ColorSwatchTextInputController =
        /** @class */
        function () {
          function ColorSwatchTextInputController(document, config) {
            this.value = config.value;
            this.swatchIc_ = new color_swatch_1.ColorSwatchInputController(document, {
              value: this.value
            });
            this.textIc_ = new text_1.TextInputController(document, {
              formatter: config.formatter,
              parser: config.parser,
              value: this.value
            });
            this.view = new color_swatch_text_1.ColorSwatchTextInputView(document, {
              swatchInputView: this.swatchIc_.view,
              textInputView: this.textIc_.view
            });
          }

          ColorSwatchTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          return ColorSwatchTextInputController;
        }();

        exports.ColorSwatchTextInputController = ColorSwatchTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/color-swatch.ts":
      /*!******************************************************!*\
        !*** ./src/main/js/controller/input/color-swatch.ts ***!
        \******************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var color_swatch_1 = __webpack_require__(
        /*! ../../view/input/color-swatch */
        "./src/main/js/view/input/color-swatch.ts");

        var color_picker_1 = __webpack_require__(
        /*! ./color-picker */
        "./src/main/js/controller/input/color-picker.ts");
        /**
         * @hidden
         */


        var ColorSwatchInputController =
        /** @class */
        function () {
          function ColorSwatchInputController(document, config) {
            this.onButtonBlur_ = this.onButtonBlur_.bind(this);
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.value = config.value;
            this.pickerIc_ = new color_picker_1.ColorPickerInputController(document, {
              value: this.value
            });
            this.view = new color_swatch_1.ColorSwatchInputView(document, {
              pickerInputView: this.pickerIc_.view,
              value: this.value
            });
            this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
            this.view.buttonElement.addEventListener('click', this.onButtonClick_);
          }

          ColorSwatchInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          ColorSwatchInputController.prototype.onButtonBlur_ = function (e) {
            var elem = this.view.element;
            var nextTarget = type_util_1.TypeUtil.forceCast(e.relatedTarget);

            if (!nextTarget || !elem.contains(nextTarget)) {
              this.pickerIc_.foldable.expanded = false;
            }
          };

          ColorSwatchInputController.prototype.onButtonClick_ = function () {
            this.pickerIc_.foldable.expanded = !this.pickerIc_.foldable.expanded;
          };

          return ColorSwatchInputController;
        }();

        exports.ColorSwatchInputController = ColorSwatchInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/h-palette.ts":
      /*!***************************************************!*\
        !*** ./src/main/js/controller/input/h-palette.ts ***!
        \***************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pointer_handler_1 = __webpack_require__(
        /*! ../../misc/pointer-handler */
        "./src/main/js/misc/pointer-handler.ts");

        var color_1 = __webpack_require__(
        /*! ../../model/color */
        "./src/main/js/model/color.ts");

        var h_palette_1 = __webpack_require__(
        /*! ../../view/input/h-palette */
        "./src/main/js/view/input/h-palette.ts");
        /**
         * @hidden
         */


        var HPaletteInputController =
        /** @class */
        function () {
          function HPaletteInputController(document, config) {
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.view = new h_palette_1.HPaletteInputView(document, {
              value: this.value
            });
            this.ptHandler_ = new pointer_handler_1.PointerHandler(document, this.view.canvasElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
          }

          HPaletteInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          HPaletteInputController.prototype.handlePointerEvent_ = function (d) {
            var hue = number_util_1.NumberUtil.map(d.py, 0, 1, 0, 360);
            var c = this.value.rawValue;

            var _a = c.getComponents('hsv'),
                s = _a[1],
                v = _a[2];

            this.value.rawValue = new color_1.Color([hue, s, v], 'hsv');
            this.view.update();
          };

          HPaletteInputController.prototype.onPointerDown_ = function (d) {
            this.handlePointerEvent_(d);
          };

          HPaletteInputController.prototype.onPointerMove_ = function (d) {
            this.handlePointerEvent_(d);
          };

          HPaletteInputController.prototype.onPointerUp_ = function (d) {
            this.handlePointerEvent_(d);
          };

          return HPaletteInputController;
        }();

        exports.HPaletteInputController = HPaletteInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/list.ts":
      /*!**********************************************!*\
        !*** ./src/main/js/controller/input/list.ts ***!
        \**********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var list_1 = __webpack_require__(
        /*! ../../constraint/list */
        "./src/main/js/constraint/list.ts");

        var util_1 = __webpack_require__(
        /*! ../../constraint/util */
        "./src/main/js/constraint/util.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var list_2 = __webpack_require__(
        /*! ../../view/input/list */
        "./src/main/js/view/input/list.ts");

        function findListItems(value) {
          var c = value.constraint ? util_1.ConstraintUtil.findConstraint(value.constraint, list_1.ListConstraint) : null;

          if (!c) {
            return null;
          }

          return c.options;
        }
        /**
         * @hidden
         */


        var ListInputController =
        /** @class */
        function () {
          function ListInputController(document, config) {
            this.onSelectChange_ = this.onSelectChange_.bind(this);
            this.value_ = config.value;
            this.listItems_ = findListItems(this.value_) || [];
            this.view_ = new list_2.ListInputView(document, {
              options: this.listItems_,
              stringifyValue: config.stringifyValue,
              value: this.value_
            });
            this.view_.selectElement.addEventListener('change', this.onSelectChange_);
          }

          Object.defineProperty(ListInputController.prototype, "value", {
            get: function () {
              return this.value_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(ListInputController.prototype, "view", {
            get: function () {
              return this.view_;
            },
            enumerable: true,
            configurable: true
          });

          ListInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          ListInputController.prototype.onSelectChange_ = function (e) {
            var selectElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var optElem = selectElem.selectedOptions.item(0);

            if (!optElem) {
              return;
            }

            var itemIndex = Number(optElem.dataset.index);
            this.value_.rawValue = this.listItems_[itemIndex].value;
            this.view_.update();
          };

          return ListInputController;
        }();

        exports.ListInputController = ListInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/number-text.ts":
      /*!*****************************************************!*\
        !*** ./src/main/js/controller/input/number-text.ts ***!
        \*****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        var text_1 = __webpack_require__(
        /*! ./text */
        "./src/main/js/controller/input/text.ts");
        /**
         * @hidden
         */


        var NumberTextInputController =
        /** @class */
        function (_super) {
          __extends(NumberTextInputController, _super);

          function NumberTextInputController(document, config) {
            var _this = _super.call(this, document, config) || this;

            _this.onInputKeyDown_ = _this.onInputKeyDown_.bind(_this);
            _this.step_ = UiUtil.getStepForTextInput(_this.value.constraint);

            _this.view.inputElement.addEventListener('keydown', _this.onInputKeyDown_);

            return _this;
          }

          NumberTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          NumberTextInputController.prototype.onInputKeyDown_ = function (e) {
            var step = UiUtil.getStepForKey(this.step_, e);

            if (step !== 0) {
              this.value.rawValue += step;
              this.view.update();
            }
          };

          return NumberTextInputController;
        }(text_1.TextInputController);

        exports.NumberTextInputController = NumberTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/point-2d-pad-text.ts":
      /*!***********************************************************!*\
        !*** ./src/main/js/controller/input/point-2d-pad-text.ts ***!
        \***********************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var point_2d_pad_text_1 = __webpack_require__(
        /*! ../../view/input/point-2d-pad-text */
        "./src/main/js/view/input/point-2d-pad-text.ts");

        var point_2d_pad_1 = __webpack_require__(
        /*! ./point-2d-pad */
        "./src/main/js/controller/input/point-2d-pad.ts");

        var point_2d_text_1 = __webpack_require__(
        /*! ./point-2d-text */
        "./src/main/js/controller/input/point-2d-text.ts");
        /**
         * @hidden
         */


        var Point2dPadTextInputController =
        /** @class */
        function () {
          function Point2dPadTextInputController(document, config) {
            this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
            this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
            this.value = config.value;
            this.padIc_ = new point_2d_pad_1.Point2dPadInputController(document, {
              value: this.value
            });
            this.textIc_ = new point_2d_text_1.Point2dTextInputController(document, {
              parser: config.parser,
              value: this.value,
              xFormatter: config.xFormatter,
              yFormatter: config.yFormatter
            });
            this.view = new point_2d_pad_text_1.Point2dPadTextInputView(document, {
              padInputView: this.padIc_.view,
              textInputView: this.textIc_.view
            });
            this.view.padButtonElement.addEventListener('blur', this.onPadButtonBlur_);
            this.view.padButtonElement.addEventListener('click', this.onPadButtonClick_);
          }

          Point2dPadTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          Point2dPadTextInputController.prototype.onPadButtonBlur_ = function () {
            this.padIc_.foldable.expanded = false;
          };

          Point2dPadTextInputController.prototype.onPadButtonClick_ = function () {
            this.padIc_.foldable.expanded = !this.padIc_.foldable.expanded;
          };

          return Point2dPadTextInputController;
        }();

        exports.Point2dPadTextInputController = Point2dPadTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/point-2d-pad.ts":
      /*!******************************************************!*\
        !*** ./src/main/js/controller/input/point-2d-pad.ts ***!
        \******************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pointer_handler_1 = __webpack_require__(
        /*! ../../misc/pointer-handler */
        "./src/main/js/misc/pointer-handler.ts");

        var foldable_1 = __webpack_require__(
        /*! ../../model/foldable */
        "./src/main/js/model/foldable.ts");

        var point_2d_1 = __webpack_require__(
        /*! ../../model/point-2d */
        "./src/main/js/model/point-2d.ts");

        var point_2d_pad_1 = __webpack_require__(
        /*! ../../view/input/point-2d-pad */
        "./src/main/js/view/input/point-2d-pad.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");
        /**
         * @hidden
         */


        var Point2dPadInputController =
        /** @class */
        function () {
          function Point2dPadInputController(document, config) {
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.foldable = new foldable_1.Foldable();
            this.maxValue_ = UiUtil.getSuitableMaxValueForPoint2dPad(this.value.constraint, this.value.rawValue);
            this.view = new point_2d_pad_1.Point2dPadInputView(document, {
              foldable: this.foldable,
              maxValue: this.maxValue_,
              value: this.value
            });
            this.ptHandler_ = new pointer_handler_1.PointerHandler(document, this.view.padElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
          }

          Point2dPadInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          Point2dPadInputController.prototype.handlePointerEvent_ = function (d) {
            var max = this.maxValue_;
            this.value.rawValue = new point_2d_1.Point2d(number_util_1.NumberUtil.map(d.px, 0, 1, -max, +max), number_util_1.NumberUtil.map(d.py, 0, 1, -max, +max));
            this.view.update();
          };

          Point2dPadInputController.prototype.onPointerDown_ = function (d) {
            this.handlePointerEvent_(d);
          };

          Point2dPadInputController.prototype.onPointerMove_ = function (d) {
            this.handlePointerEvent_(d);
          };

          Point2dPadInputController.prototype.onPointerUp_ = function (d) {
            this.handlePointerEvent_(d);
          };

          return Point2dPadInputController;
        }();

        exports.Point2dPadInputController = Point2dPadInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/point-2d-text.ts":
      /*!*******************************************************!*\
        !*** ./src/main/js/controller/input/point-2d-text.ts ***!
        \*******************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var point_2d_1 = __webpack_require__(
        /*! ../../constraint/point-2d */
        "./src/main/js/constraint/point-2d.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var point_2d_2 = __webpack_require__(
        /*! ../../model/point-2d */
        "./src/main/js/model/point-2d.ts");

        var point_2d_text_1 = __webpack_require__(
        /*! ../../view/input/point-2d-text */
        "./src/main/js/view/input/point-2d-text.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");
        /**
         * @hidden
         */


        var Point2dTextInputController =
        /** @class */
        function () {
          function Point2dTextInputController(document, config) {
            var _this = this;

            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
            this.parser_ = config.parser;
            this.value = config.value;
            var c = this.value.constraint;
            this.xStep_ = UiUtil.getStepForTextInput(c instanceof point_2d_1.Point2dConstraint ? c.xConstraint : undefined);
            this.yStep_ = UiUtil.getStepForTextInput(c instanceof point_2d_1.Point2dConstraint ? c.yConstraint : undefined);
            this.view = new point_2d_text_1.Point2dTextInputView(document, {
              value: this.value,
              xFormatter: config.xFormatter,
              yFormatter: config.yFormatter
            });
            this.view.inputElements.forEach(function (inputElem) {
              inputElem.addEventListener('change', _this.onInputChange_);
              inputElem.addEventListener('keydown', _this.onInputKeyDown_);
            });
          }

          Point2dTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          Point2dTextInputController.prototype.findIndexOfInputElem_ = function (inputElem) {
            var inputElems = this.view.inputElements;

            for (var i = 0; i < inputElems.length; i++) {
              if (inputElems[i] === inputElem) {
                return i;
              }
            }

            return null;
          };

          Point2dTextInputController.prototype.updateComponent_ = function (index, newValue) {
            var comps = this.value.rawValue.getComponents();
            var newComps = comps.map(function (comp, i) {
              return i === index ? newValue : comp;
            });
            this.value.rawValue = new point_2d_2.Point2d(newComps[0], newComps[1]);
            this.view.update();
          };

          Point2dTextInputController.prototype.onInputChange_ = function (e) {
            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var parsedValue = this.parser_(inputElem.value);

            if (type_util_1.TypeUtil.isEmpty(parsedValue)) {
              return;
            }

            var compIndex = this.findIndexOfInputElem_(inputElem);

            if (type_util_1.TypeUtil.isEmpty(compIndex)) {
              return;
            }

            this.updateComponent_(compIndex, parsedValue);
          };

          Point2dTextInputController.prototype.onInputKeyDown_ = function (e) {
            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var parsedValue = this.parser_(inputElem.value);

            if (type_util_1.TypeUtil.isEmpty(parsedValue)) {
              return;
            }

            var compIndex = this.findIndexOfInputElem_(inputElem);

            if (type_util_1.TypeUtil.isEmpty(compIndex)) {
              return;
            }

            var step = UiUtil.getStepForKey(compIndex === 0 ? this.xStep_ : this.yStep_, e);

            if (step === 0) {
              return;
            }

            this.updateComponent_(compIndex, parsedValue + step);
          };

          return Point2dTextInputController;
        }();

        exports.Point2dTextInputController = Point2dTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/rgb-text.ts":
      /*!**************************************************!*\
        !*** ./src/main/js/controller/input/rgb-text.ts ***!
        \**************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var color_1 = __webpack_require__(
        /*! ../../model/color */
        "./src/main/js/model/color.ts");

        var rgb_text_1 = __webpack_require__(
        /*! ../../view/input/rgb-text */
        "./src/main/js/view/input/rgb-text.ts");

        var UiUtil = __webpack_require__(
        /*! ../ui-util */
        "./src/main/js/controller/ui-util.ts");

        var STEP = 1;
        /**
         * @hidden
         */

        var RgbTextInputController =
        /** @class */
        function () {
          function RgbTextInputController(document, config) {
            var _this = this;

            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
            this.parser_ = config.parser;
            this.value = config.value;
            this.view = new rgb_text_1.RgbTextInputView(document, {
              formatter: config.formatter,
              value: this.value
            });
            this.view.inputElements.forEach(function (inputElem) {
              inputElem.addEventListener('change', _this.onInputChange_);
              inputElem.addEventListener('keydown', _this.onInputKeyDown_);
            });
          }

          RgbTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          RgbTextInputController.prototype.findIndexOfInputElem_ = function (inputElem) {
            var inputElems = this.view.inputElements;

            for (var i = 0; i < inputElems.length; i++) {
              if (inputElems[i] === inputElem) {
                return i;
              }
            }

            return null;
          };

          RgbTextInputController.prototype.updateComponent_ = function (index, newValue) {
            var comps = this.value.rawValue.getComponents('rgb');
            var newComps = comps.map(function (comp, i) {
              return i === index ? newValue : comp;
            });
            this.value.rawValue = new color_1.Color([newComps[0], newComps[1], newComps[2]], 'rgb');
            this.view.update();
          };

          RgbTextInputController.prototype.onInputChange_ = function (e) {
            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var parsedValue = this.parser_(inputElem.value);

            if (type_util_1.TypeUtil.isEmpty(parsedValue)) {
              return;
            }

            var compIndex = this.findIndexOfInputElem_(inputElem);

            if (type_util_1.TypeUtil.isEmpty(compIndex)) {
              return;
            }

            this.updateComponent_(compIndex, parsedValue);
          };

          RgbTextInputController.prototype.onInputKeyDown_ = function (e) {
            var step = UiUtil.getStepForKey(STEP, e);

            if (step === 0) {
              return;
            }

            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var parsedValue = this.parser_(inputElem.value);

            if (type_util_1.TypeUtil.isEmpty(parsedValue)) {
              return;
            }

            var compIndex = this.findIndexOfInputElem_(inputElem);

            if (type_util_1.TypeUtil.isEmpty(compIndex)) {
              return;
            }

            this.updateComponent_(compIndex, parsedValue + step);
          };

          return RgbTextInputController;
        }();

        exports.RgbTextInputController = RgbTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/slider-text.ts":
      /*!*****************************************************!*\
        !*** ./src/main/js/controller/input/slider-text.ts ***!
        \*****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var slider_text_1 = __webpack_require__(
        /*! ../../view/input/slider-text */
        "./src/main/js/view/input/slider-text.ts");

        var number_text_1 = __webpack_require__(
        /*! ./number-text */
        "./src/main/js/controller/input/number-text.ts");

        var slider_1 = __webpack_require__(
        /*! ./slider */
        "./src/main/js/controller/input/slider.ts");
        /**
         * @hidden
         */


        var SliderTextInputController =
        /** @class */
        function () {
          function SliderTextInputController(document, config) {
            this.value_ = config.value;
            this.sliderIc_ = new slider_1.SliderInputController(document, {
              value: config.value
            });
            this.textIc_ = new number_text_1.NumberTextInputController(document, {
              formatter: config.formatter,
              parser: config.parser,
              value: config.value
            });
            this.view_ = new slider_text_1.SliderTextInputView(document, {
              sliderInputView: this.sliderIc_.view,
              textInputView: this.textIc_.view
            });
          }

          Object.defineProperty(SliderTextInputController.prototype, "value", {
            get: function () {
              return this.value_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(SliderTextInputController.prototype, "view", {
            get: function () {
              return this.view_;
            },
            enumerable: true,
            configurable: true
          });

          SliderTextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          return SliderTextInputController;
        }();

        exports.SliderTextInputController = SliderTextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/slider.ts":
      /*!************************************************!*\
        !*** ./src/main/js/controller/input/slider.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var range_1 = __webpack_require__(
        /*! ../../constraint/range */
        "./src/main/js/constraint/range.ts");

        var util_1 = __webpack_require__(
        /*! ../../constraint/util */
        "./src/main/js/constraint/util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pointer_handler_1 = __webpack_require__(
        /*! ../../misc/pointer-handler */
        "./src/main/js/misc/pointer-handler.ts");

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var slider_1 = __webpack_require__(
        /*! ../../view/input/slider */
        "./src/main/js/view/input/slider.ts");

        function findRange(value) {
          var c = value.constraint ? util_1.ConstraintUtil.findConstraint(value.constraint, range_1.RangeConstraint) : null;

          if (!c) {
            return [undefined, undefined];
          }

          return [c.minValue, c.maxValue];
        }

        function estimateSuitableRange(value) {
          var _a = findRange(value),
              min = _a[0],
              max = _a[1];

          return [type_util_1.TypeUtil.getOrDefault(min, 0), type_util_1.TypeUtil.getOrDefault(max, 100)];
        }
        /**
         * @hidden
         */


        var SliderInputController =
        /** @class */
        function () {
          function SliderInputController(document, config) {
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;

            var _a = estimateSuitableRange(this.value),
                min = _a[0],
                max = _a[1];

            this.minValue_ = min;
            this.maxValue_ = max;
            this.view = new slider_1.SliderInputView(document, {
              maxValue: this.maxValue_,
              minValue: this.minValue_,
              value: this.value
            });
            this.ptHandler_ = new pointer_handler_1.PointerHandler(document, this.view.outerElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
          }

          SliderInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          SliderInputController.prototype.onPointerDown_ = function (d) {
            this.value.rawValue = number_util_1.NumberUtil.map(d.px, 0, 1, this.minValue_, this.maxValue_);
            this.view.update();
          };

          SliderInputController.prototype.onPointerMove_ = function (d) {
            this.value.rawValue = number_util_1.NumberUtil.map(d.px, 0, 1, this.minValue_, this.maxValue_);
            this.view.update();
          };

          SliderInputController.prototype.onPointerUp_ = function (d) {
            this.value.rawValue = number_util_1.NumberUtil.map(d.px, 0, 1, this.minValue_, this.maxValue_);
            this.view.update();
          };

          return SliderInputController;
        }();

        exports.SliderInputController = SliderInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/sv-palette.ts":
      /*!****************************************************!*\
        !*** ./src/main/js/controller/input/sv-palette.ts ***!
        \****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pointer_handler_1 = __webpack_require__(
        /*! ../../misc/pointer-handler */
        "./src/main/js/misc/pointer-handler.ts");

        var color_1 = __webpack_require__(
        /*! ../../model/color */
        "./src/main/js/model/color.ts");

        var sv_palette_1 = __webpack_require__(
        /*! ../../view/input/sv-palette */
        "./src/main/js/view/input/sv-palette.ts");
        /**
         * @hidden
         */


        var SvPaletteInputController =
        /** @class */
        function () {
          function SvPaletteInputController(document, config) {
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.view = new sv_palette_1.SvPaletteInputView(document, {
              value: this.value
            });
            this.ptHandler_ = new pointer_handler_1.PointerHandler(document, this.view.canvasElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
          }

          SvPaletteInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          SvPaletteInputController.prototype.handlePointerEvent_ = function (d) {
            var saturation = number_util_1.NumberUtil.map(d.px, 0, 1, 0, 100);
            var value = number_util_1.NumberUtil.map(d.py, 0, 1, 100, 0);
            var h = this.value.rawValue.getComponents('hsv')[0];
            this.value.rawValue = new color_1.Color([h, saturation, value], 'hsv');
            this.view.update();
          };

          SvPaletteInputController.prototype.onPointerDown_ = function (d) {
            this.handlePointerEvent_(d);
          };

          SvPaletteInputController.prototype.onPointerMove_ = function (d) {
            this.handlePointerEvent_(d);
          };

          SvPaletteInputController.prototype.onPointerUp_ = function (d) {
            this.handlePointerEvent_(d);
          };

          return SvPaletteInputController;
        }();

        exports.SvPaletteInputController = SvPaletteInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/input/text.ts":
      /*!**********************************************!*\
        !*** ./src/main/js/controller/input/text.ts ***!
        \**********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var text_1 = __webpack_require__(
        /*! ../../view/input/text */
        "./src/main/js/view/input/text.ts");
        /**
         * @hidden
         */


        var TextInputController =
        /** @class */
        function () {
          function TextInputController(document, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.parser_ = config.parser;
            this.value = config.value;
            this.view = new text_1.TextInputView(document, {
              formatter: config.formatter,
              value: this.value
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
          }

          TextInputController.prototype.dispose = function () {
            this.view.dispose();
          };

          TextInputController.prototype.onInputChange_ = function (e) {
            var inputElem = type_util_1.TypeUtil.forceCast(e.currentTarget);
            var value = inputElem.value;
            var parsedValue = this.parser_(value);

            if (!type_util_1.TypeUtil.isEmpty(parsedValue)) {
              this.value.rawValue = parsedValue;
            }

            this.view.update();
          };

          return TextInputController;
        }();

        exports.TextInputController = TextInputController;
        /***/
      },

      /***/
      "./src/main/js/controller/monitor-binding.ts":
      /*!***************************************************!*\
        !*** ./src/main/js/controller/monitor-binding.ts ***!
        \***************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var labeled_1 = __webpack_require__(
        /*! ../view/labeled */
        "./src/main/js/view/labeled.ts");
        /**
         * @hidden
         */


        var MonitorBindingController =
        /** @class */
        function () {
          function MonitorBindingController(document, config) {
            this.binding = config.binding;
            this.controller = config.controller;
            this.view = new labeled_1.LabeledView(document, {
              label: config.label,
              view: this.controller.view
            });
          }

          MonitorBindingController.prototype.dispose = function () {
            this.binding.dispose();
            this.controller.dispose();
            this.view.dispose();
          };

          return MonitorBindingController;
        }();

        exports.MonitorBindingController = MonitorBindingController;
        /***/
      },

      /***/
      "./src/main/js/controller/monitor/graph.ts":
      /*!*************************************************!*\
        !*** ./src/main/js/controller/monitor/graph.ts ***!
        \*************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var graph_cursor_1 = __webpack_require__(
        /*! ../../model/graph-cursor */
        "./src/main/js/model/graph-cursor.ts");

        var graph_1 = __webpack_require__(
        /*! ../../view/monitor/graph */
        "./src/main/js/view/monitor/graph.ts");
        /**
         * @hidden
         */


        var GraphMonitorController =
        /** @class */
        function () {
          function GraphMonitorController(document, config) {
            this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
            this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
            this.value = config.value;
            this.cursor_ = new graph_cursor_1.GraphCursor();
            this.view = new graph_1.GraphMonitorView(document, {
              cursor: this.cursor_,
              formatter: config.formatter,
              maxValue: config.maxValue,
              minValue: config.minValue,
              value: this.value
            });
            this.view.graphElement.addEventListener('mouseleave', this.onGraphMouseLeave_);
            this.view.graphElement.addEventListener('mousemove', this.onGraphMouseMove_);
          }

          GraphMonitorController.prototype.dispose = function () {
            this.view.dispose();
          };

          GraphMonitorController.prototype.onGraphMouseLeave_ = function () {
            this.cursor_.index = -1;
          };

          GraphMonitorController.prototype.onGraphMouseMove_ = function (e) {
            var bounds = this.view.graphElement.getBoundingClientRect();
            var x = e.offsetX;
            this.cursor_.index = Math.floor(number_util_1.NumberUtil.map(x, 0, bounds.width, 0, this.value.totalCount));
          };

          return GraphMonitorController;
        }();

        exports.GraphMonitorController = GraphMonitorController;
        /***/
      },

      /***/
      "./src/main/js/controller/monitor/multi-log.ts":
      /*!*****************************************************!*\
        !*** ./src/main/js/controller/monitor/multi-log.ts ***!
        \*****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var multi_log_1 = __webpack_require__(
        /*! ../../view/monitor/multi-log */
        "./src/main/js/view/monitor/multi-log.ts");
        /**
         * @hidden
         */


        var MultiLogMonitorController =
        /** @class */
        function () {
          function MultiLogMonitorController(document, config) {
            this.value = config.value;
            this.view = new multi_log_1.MultiLogMonitorView(document, {
              formatter: config.formatter,
              value: this.value
            });
          }

          MultiLogMonitorController.prototype.dispose = function () {
            this.view.dispose();
          };

          return MultiLogMonitorController;
        }();

        exports.MultiLogMonitorController = MultiLogMonitorController;
        /***/
      },

      /***/
      "./src/main/js/controller/monitor/single-log.ts":
      /*!******************************************************!*\
        !*** ./src/main/js/controller/monitor/single-log.ts ***!
        \******************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var single_log_1 = __webpack_require__(
        /*! ../../view/monitor/single-log */
        "./src/main/js/view/monitor/single-log.ts");
        /**
         * @hidden
         */


        var SingleLogMonitorController =
        /** @class */
        function () {
          function SingleLogMonitorController(document, config) {
            this.value = config.value;
            this.view = new single_log_1.SingleLogMonitorView(document, {
              formatter: config.formatter,
              value: this.value
            });
          }

          SingleLogMonitorController.prototype.dispose = function () {
            this.view.dispose();
          };

          return SingleLogMonitorController;
        }();

        exports.SingleLogMonitorController = SingleLogMonitorController;
        /***/
      },

      /***/
      "./src/main/js/controller/root.ts":
      /*!****************************************!*\
        !*** ./src/main/js/controller/root.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var folder_1 = __webpack_require__(
        /*! ../model/folder */
        "./src/main/js/model/folder.ts");

        var list_1 = __webpack_require__(
        /*! ../model/list */
        "./src/main/js/model/list.ts");

        var root_1 = __webpack_require__(
        /*! ../view/root */
        "./src/main/js/view/root.ts");

        var folder_2 = __webpack_require__(
        /*! ./folder */
        "./src/main/js/controller/folder.ts");

        var input_binding_1 = __webpack_require__(
        /*! ./input-binding */
        "./src/main/js/controller/input-binding.ts");

        var monitor_binding_1 = __webpack_require__(
        /*! ./monitor-binding */
        "./src/main/js/controller/monitor-binding.ts");

        function createFolder(config) {
          if (!config.title) {
            return null;
          }

          return new folder_1.Folder(config.title, type_util_1.TypeUtil.getOrDefault(config.expanded, true));
        }
        /**
         * @hidden
         */


        var RootController =
        /** @class */
        function () {
          function RootController(document, config) {
            this.onFolderChange_ = this.onFolderChange_.bind(this);
            this.onRootFolderChange_ = this.onRootFolderChange_.bind(this);
            this.onTitleClick_ = this.onTitleClick_.bind(this);
            this.onUiControllerListAppend_ = this.onUiControllerListAppend_.bind(this);
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onMonitorUpdate_ = this.onMonitorUpdate_.bind(this);
            this.emitter = new emitter_1.Emitter();
            this.folder = createFolder(config);
            this.ucList_ = new list_1.List();
            this.ucList_.emitter.on('append', this.onUiControllerListAppend_);
            this.doc_ = document;
            this.view = new root_1.RootView(this.doc_, {
              folder: this.folder
            });

            if (this.view.titleElement) {
              this.view.titleElement.addEventListener('click', this.onTitleClick_);
            }

            if (this.folder) {
              this.folder.emitter.on('change', this.onRootFolderChange_);
            }
          }

          Object.defineProperty(RootController.prototype, "document", {
            get: function () {
              return this.doc_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(RootController.prototype, "uiControllerList", {
            get: function () {
              return this.ucList_;
            },
            enumerable: true,
            configurable: true
          });

          RootController.prototype.dispose = function () {
            this.view.dispose();
          };

          RootController.prototype.onUiControllerListAppend_ = function (uc) {
            if (uc instanceof input_binding_1.InputBindingController) {
              var emitter = uc.binding.value.emitter;
              emitter.on('change', this.onInputChange_);
            } else if (uc instanceof monitor_binding_1.MonitorBindingController) {
              var emitter = uc.binding.value.emitter;
              emitter.on('update', this.onMonitorUpdate_);
            } else if (uc instanceof folder_2.FolderController) {
              var emitter = uc.emitter;
              emitter.on('fold', this.onFolderChange_);
              emitter.on('inputchange', this.onInputChange_);
              emitter.on('monitorupdate', this.onMonitorUpdate_);
            }

            this.view.containerElement.appendChild(uc.view.element);
          };

          RootController.prototype.onTitleClick_ = function () {
            if (this.folder) {
              this.folder.expanded = !this.folder.expanded;
            }
          };

          RootController.prototype.onInputChange_ = function (value) {
            this.emitter.emit('inputchange', [value]);
          };

          RootController.prototype.onMonitorUpdate_ = function (value) {
            this.emitter.emit('monitorupdate', [value]);
          };

          RootController.prototype.onFolderChange_ = function () {
            this.emitter.emit('fold');
          };

          RootController.prototype.onRootFolderChange_ = function () {
            this.emitter.emit('fold');
          };

          return RootController;
        }();

        exports.RootController = RootController;
        /***/
      },

      /***/
      "./src/main/js/controller/separator.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/controller/separator.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var separator_1 = __webpack_require__(
        /*! ../view/separator */
        "./src/main/js/view/separator.ts");
        /**
         * @hidden
         */


        var SeparatorController =
        /** @class */
        function () {
          function SeparatorController(document) {
            this.view = new separator_1.SeparatorView(document);
          }

          SeparatorController.prototype.dispose = function () {
            this.view.dispose();
          };

          return SeparatorController;
        }();

        exports.SeparatorController = SeparatorController;
        /***/
      },

      /***/
      "./src/main/js/controller/ui-util.ts":
      /*!*******************************************!*\
        !*** ./src/main/js/controller/ui-util.ts ***!
        \*******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var point_2d_1 = __webpack_require__(
        /*! ../constraint/point-2d */
        "./src/main/js/constraint/point-2d.ts");

        var range_1 = __webpack_require__(
        /*! ../constraint/range */
        "./src/main/js/constraint/range.ts");

        var step_1 = __webpack_require__(
        /*! ../constraint/step */
        "./src/main/js/constraint/step.ts");

        var util_1 = __webpack_require__(
        /*! ../constraint/util */
        "./src/main/js/constraint/util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var folder_1 = __webpack_require__(
        /*! ./folder */
        "./src/main/js/controller/folder.ts");
        /**
         * @hidden
         */


        function normalizeInputParamsOptions(options, convert) {
          if (Array.isArray(options)) {
            return options.map(function (item) {
              return {
                text: item.text,
                value: convert(item.value)
              };
            });
          }

          var textToValueMap = options;
          var texts = Object.keys(textToValueMap);
          return texts.reduce(function (result, text) {
            return result.concat({
              text: text,
              value: convert(textToValueMap[text])
            });
          }, []);
        }

        exports.normalizeInputParamsOptions = normalizeInputParamsOptions;
        /**
         * @hidden
         */

        function findControllers(uiControllers, controllerClass) {
          return uiControllers.reduce(function (results, uc) {
            if (uc instanceof folder_1.FolderController) {
              // eslint-disable-next-line no-use-before-define
              results.push.apply(results, findControllers(uc.uiControllerList.items, controllerClass));
            }

            if (uc instanceof controllerClass) {
              results.push(uc);
            }

            return results;
          }, []);
        }

        exports.findControllers = findControllers;

        function findStep(constraint) {
          var c = constraint ? util_1.ConstraintUtil.findConstraint(constraint, step_1.StepConstraint) : null;

          if (!c) {
            return null;
          }

          return c.step;
        }
        /**
         * @hidden
         */


        function getStepForTextInput(constraint) {
          var step = findStep(constraint);
          return type_util_1.TypeUtil.getOrDefault(step, 1);
        }

        exports.getStepForTextInput = getStepForTextInput;
        /**
         * @hidden
         */

        function getStepForKey(baseStep, keys) {
          var step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);

          if (keys.keyCode === 38) {
            return +step;
          } else if (keys.keyCode === 40) {
            return -step;
          }

          return 0;
        }

        exports.getStepForKey = getStepForKey;
        /**
         * @hidden
         */

        function getSuitableDecimalDigits(constraint, rawValue) {
          var sc = constraint && util_1.ConstraintUtil.findConstraint(constraint, step_1.StepConstraint);

          if (sc) {
            return number_util_1.NumberUtil.getDecimalDigits(sc.step);
          }

          return Math.max(number_util_1.NumberUtil.getDecimalDigits(rawValue), 2);
        }

        exports.getSuitableDecimalDigits = getSuitableDecimalDigits;
        /**
         * @hidden
         */

        function getSuitableMaxDimensionValue(constraint, rawValue) {
          var rc = constraint && util_1.ConstraintUtil.findConstraint(constraint, range_1.RangeConstraint);

          if (rc) {
            return Math.max(Math.abs(rc.minValue || 0), Math.abs(rc.maxValue || 0));
          }

          var step = getStepForTextInput(constraint);
          return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
        }
        /**
         * @hidden
         */


        function getSuitableMaxValueForPoint2dPad(constraint, rawValue) {
          var xc = constraint instanceof point_2d_1.Point2dConstraint ? constraint.xConstraint : undefined;
          var yc = constraint instanceof point_2d_1.Point2dConstraint ? constraint.yConstraint : undefined;
          var xr = getSuitableMaxDimensionValue(xc, rawValue.x);
          var yr = getSuitableMaxDimensionValue(yc, rawValue.y);
          return Math.max(xr, yr);
        }

        exports.getSuitableMaxValueForPoint2dPad = getSuitableMaxValueForPoint2dPad;
        /***/
      },

      /***/
      "./src/main/js/converter/boolean.ts":
      /*!******************************************!*\
        !*** ./src/main/js/converter/boolean.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        function fromMixed(value) {
          if (value === 'false') {
            return false;
          }

          return !!value;
        }

        exports.fromMixed = fromMixed;
        /**
         * @hidden
         */

        function toString(value) {
          return String(value);
        }

        exports.toString = toString;
        /***/
      },

      /***/
      "./src/main/js/converter/color.ts":
      /*!****************************************!*\
        !*** ./src/main/js/converter/color.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_1 = __webpack_require__(
        /*! ../formatter/number */
        "./src/main/js/formatter/number.ts");

        var number_util_1 = __webpack_require__(
        /*! ../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var color_1 = __webpack_require__(
        /*! ../model/color */
        "./src/main/js/model/color.ts");

        var number_color_1 = __webpack_require__(
        /*! ../parser/number-color */
        "./src/main/js/parser/number-color.ts");

        var StringColorParser = __webpack_require__(
        /*! ../parser/string-color */
        "./src/main/js/parser/string-color.ts");
        /**
         * @hidden
         */


        function fromMixed(value) {
          if (typeof value === 'string') {
            var cv = StringColorParser.CompositeParser(value);

            if (cv) {
              return cv;
            }
          }

          if (typeof value === 'number') {
            var cv = number_color_1.NumberColorParser(value);

            if (cv) {
              return cv;
            }
          }

          if (color_1.Color.isRgbColorObject(value)) {
            return color_1.Color.fromRgbObject(value);
          }

          return new color_1.Color([0, 0, 0], 'rgb');
        }

        exports.fromMixed = fromMixed;
        /**
         * @hidden
         */

        function toHexRgbString(value) {
          var hexes = value.getComponents('rgb').map(function (comp) {
            var hex = number_util_1.NumberUtil.constrain(Math.floor(comp), 0, 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          }).join('');
          return "#" + hexes;
        }

        exports.toHexRgbString = toHexRgbString;
        /**
         * @hidden
         */

        function toFunctionalRgbString(value) {
          var formatter = new number_1.NumberFormatter(0);
          var comps = value.getComponents('rgb').map(function (comp) {
            return formatter.format(comp);
          });
          return "rgb(" + comps.join(', ') + ")";
        }

        exports.toFunctionalRgbString = toFunctionalRgbString;
        var NOTATION_TO_STRINGIFIER_MAP = {
          'func.rgb': toFunctionalRgbString,
          'hex.rgb': toHexRgbString
        };

        function getStringifier(notation) {
          return NOTATION_TO_STRINGIFIER_MAP[notation];
        }

        exports.getStringifier = getStringifier;
        /**
         * @hidden
         */

        function toNumber(value) {
          return value.getComponents('rgb').reduce(function (result, comp) {
            return result << 8 | Math.floor(comp) & 0xff;
          }, 0);
        }

        exports.toNumber = toNumber;
        /***/
      },

      /***/
      "./src/main/js/converter/number.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/converter/number.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var string_number_1 = __webpack_require__(
        /*! ../parser/string-number */
        "./src/main/js/parser/string-number.ts");
        /**
         * @hidden
         */


        function fromMixed(value) {
          if (typeof value === 'number') {
            return value;
          }

          if (typeof value === 'string') {
            var pv = string_number_1.StringNumberParser(value);

            if (!type_util_1.TypeUtil.isEmpty(pv)) {
              return pv;
            }
          }

          return 0;
        }

        exports.fromMixed = fromMixed;
        /**
         * @hidden
         */

        function toString(value) {
          return String(value);
        }

        exports.toString = toString;
        /***/
      },

      /***/
      "./src/main/js/converter/point-2d.ts":
      /*!*******************************************!*\
        !*** ./src/main/js/converter/point-2d.ts ***!
        \*******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var point_2d_1 = __webpack_require__(
        /*! ../model/point-2d */
        "./src/main/js/model/point-2d.ts");

        var any_point_2d_1 = __webpack_require__(
        /*! ../parser/any-point-2d */
        "./src/main/js/parser/any-point-2d.ts");
        /**
         * @hidden
         */


        function fromMixed(value) {
          return any_point_2d_1.AnyPoint2dParser(value) || new point_2d_1.Point2d();
        }

        exports.fromMixed = fromMixed;
        /***/
      },

      /***/
      "./src/main/js/converter/string.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/converter/string.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        function fromMixed(value) {
          return String(value);
        }

        exports.fromMixed = fromMixed;
        /**
         * @hidden
         */

        function toString(value) {
          return value;
        }

        exports.toString = toString;
        /***/
      },

      /***/
      "./src/main/js/formatter/boolean.ts":
      /*!******************************************!*\
        !*** ./src/main/js/formatter/boolean.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var BooleanConverter = __webpack_require__(
        /*! ../converter/boolean */
        "./src/main/js/converter/boolean.ts");
        /**
         * @hidden
         */


        var BooleanFormatter =
        /** @class */
        function () {
          function BooleanFormatter() {}

          BooleanFormatter.prototype.format = function (value) {
            return BooleanConverter.toString(value);
          };

          return BooleanFormatter;
        }();

        exports.BooleanFormatter = BooleanFormatter;
        /***/
      },

      /***/
      "./src/main/js/formatter/color.ts":
      /*!****************************************!*\
        !*** ./src/main/js/formatter/color.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ../misc/number-util */
        "./src/main/js/misc/number-util.ts");
        /**
         * @hidden
         */


        var ColorFormatter =
        /** @class */
        function () {
          function ColorFormatter(stringifier) {
            this.stringifier_ = stringifier;
          }

          ColorFormatter.rgb = function (r, g, b) {
            var compsText = [number_util_1.NumberUtil.constrain(Math.floor(r), 0, 255), number_util_1.NumberUtil.constrain(Math.floor(g), 0, 255), number_util_1.NumberUtil.constrain(Math.floor(b), 0, 255)].join(', ');
            return "rgb(" + compsText + ")";
          };

          ColorFormatter.hsl = function (h, s, l) {
            var compsText = [(Math.floor(h) % 360 + 360) % 360, number_util_1.NumberUtil.constrain(Math.floor(s), 0, 100) + "%", number_util_1.NumberUtil.constrain(Math.floor(l), 0, 100) + "%"].join(', ');
            return "hsl(" + compsText + ")";
          };

          ColorFormatter.prototype.format = function (value) {
            return this.stringifier_(value);
          };

          return ColorFormatter;
        }();

        exports.ColorFormatter = ColorFormatter;
        /***/
      },

      /***/
      "./src/main/js/formatter/number.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/formatter/number.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var NumberFormatter =
        /** @class */
        function () {
          function NumberFormatter(digits) {
            this.digits_ = digits;
          }

          Object.defineProperty(NumberFormatter.prototype, "digits", {
            get: function () {
              return this.digits_;
            },
            enumerable: true,
            configurable: true
          });

          NumberFormatter.prototype.format = function (value) {
            return value.toFixed(Math.max(Math.min(this.digits_, 20), 0));
          };

          return NumberFormatter;
        }();

        exports.NumberFormatter = NumberFormatter;
        /***/
      },

      /***/
      "./src/main/js/formatter/string.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/formatter/string.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var StringFormatter =
        /** @class */
        function () {
          function StringFormatter() {}

          StringFormatter.prototype.format = function (value) {
            return value;
          };

          return StringFormatter;
        }();

        exports.StringFormatter = StringFormatter;
        /***/
      },

      /***/
      "./src/main/js/index.ts":
      /*!******************************!*\
        !*** ./src/main/js/index.ts ***!
        \******************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var Style = __webpack_require__(
        /*! ../sass/bundle.scss */
        "./src/main/sass/bundle.scss");

        var tweakpane_without_style_1 = __webpack_require__(
        /*! ./tweakpane-without-style */
        "./src/main/js/tweakpane-without-style.ts");

        function embedDefaultStyleIfNeeded(document) {
          var MARKER = 'tweakpane';

          if (document.querySelector("style[data-for=" + MARKER + "]")) {
            return;
          }

          var styleElem = document.createElement('style');
          styleElem.dataset.for = MARKER;
          styleElem.textContent = Style.toString();

          if (document.head) {
            document.head.appendChild(styleElem);
          }
        } // tslint:disable-next-line: no-default-export


        var Tweakpane =
        /** @class */
        function (_super) {
          __extends(Tweakpane, _super);

          function Tweakpane(opt_config) {
            var _this = _super.call(this, opt_config) || this;

            embedDefaultStyleIfNeeded(_this.document);
            return _this;
          }

          return Tweakpane;
        }(tweakpane_without_style_1.TweakpaneWithoutStyle);

        exports.default = Tweakpane;
        /***/
      },

      /***/
      "./src/main/js/misc/class-name.ts":
      /*!****************************************!*\
        !*** ./src/main/js/misc/class-name.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        var PREFIX = 'tp';
        var TYPE_TO_POSTFIX_MAP = {
          '': 'v',
          input: 'iv',
          monitor: 'mv'
        };

        function ClassName(viewName, opt_viewType) {
          var viewType = opt_viewType || '';
          var postfix = TYPE_TO_POSTFIX_MAP[viewType];
          return function (opt_elementName, opt_modifier) {
            return [PREFIX, '-', viewName, postfix, opt_elementName ? "_" + opt_elementName : '', opt_modifier ? "-" + opt_modifier : ''].join('');
          };
        }

        exports.ClassName = ClassName;
        /***/
      },

      /***/
      "./src/main/js/misc/color-model.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/misc/color-model.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var number_util_1 = __webpack_require__(
        /*! ./number-util */
        "./src/main/js/misc/number-util.ts");

        function rgbToHsl(r, g, b) {
          var rp = number_util_1.NumberUtil.constrain(r / 255, 0, 1);
          var gp = number_util_1.NumberUtil.constrain(g / 255, 0, 1);
          var bp = number_util_1.NumberUtil.constrain(b / 255, 0, 1);
          var cmax = Math.max(rp, gp, bp);
          var cmin = Math.min(rp, gp, bp);
          var c = cmax - cmin;
          var h = 0;
          var s = 0;
          var l = (cmin + cmax) / 2;

          if (c !== 0) {
            s = l > 0.5 ? c / (2 - cmin - cmax) : c / (cmax + cmin);

            if (rp === cmax) {
              h = (gp - bp) / c;
            } else if (gp === cmax) {
              h = 2 + (bp - rp) / c;
            } else {
              h = 4 + (rp - gp) / c;
            }

            h = h / 6 + (h < 0 ? 1 : 0);
          }

          return [h * 360, s * 100, l * 100];
        }

        exports.rgbToHsl = rgbToHsl;

        function hslToRgb(h, s, l) {
          var _a, _b, _c, _d, _e, _f;

          var hp = (h % 360 + 360) % 360;
          var sp = number_util_1.NumberUtil.constrain(s / 100, 0, 1);
          var lp = number_util_1.NumberUtil.constrain(l / 100, 0, 1);
          var c = (1 - Math.abs(2 * lp - 1)) * sp;
          var x = c * (1 - Math.abs(hp / 60 % 2 - 1));
          var m = lp - c / 2;
          var rp, gp, bp;

          if (hp >= 0 && hp < 60) {
            _a = [c, x, 0], rp = _a[0], gp = _a[1], bp = _a[2];
          } else if (hp >= 60 && hp < 120) {
            _b = [x, c, 0], rp = _b[0], gp = _b[1], bp = _b[2];
          } else if (hp >= 120 && hp < 180) {
            _c = [0, c, x], rp = _c[0], gp = _c[1], bp = _c[2];
          } else if (hp >= 180 && hp < 240) {
            _d = [0, x, c], rp = _d[0], gp = _d[1], bp = _d[2];
          } else if (hp >= 240 && hp < 300) {
            _e = [x, 0, c], rp = _e[0], gp = _e[1], bp = _e[2];
          } else {
            _f = [c, 0, x], rp = _f[0], gp = _f[1], bp = _f[2];
          }

          return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
        }

        exports.hslToRgb = hslToRgb;

        function rgbToHsv(r, g, b) {
          var rp = number_util_1.NumberUtil.constrain(r / 255, 0, 1);
          var gp = number_util_1.NumberUtil.constrain(g / 255, 0, 1);
          var bp = number_util_1.NumberUtil.constrain(b / 255, 0, 1);
          var cmax = Math.max(rp, gp, bp);
          var cmin = Math.min(rp, gp, bp);
          var d = cmax - cmin;
          var h;

          if (d === 0) {
            h = 0;
          } else if (cmax === rp) {
            h = 60 * (((gp - bp) / d % 6 + 6) % 6);
          } else if (cmax === gp) {
            h = 60 * ((bp - rp) / d + 2);
          } else {
            h = 60 * ((rp - gp) / d + 4);
          }

          var s = cmax === 0 ? 0 : d / cmax;
          var v = cmax;
          return [h, s * 100, v * 100];
        }

        exports.rgbToHsv = rgbToHsv;

        function hsvToRgb(h, s, v) {
          var _a, _b, _c, _d, _e, _f;

          var hp = number_util_1.NumberUtil.loop(h, 360);
          var sp = number_util_1.NumberUtil.constrain(s / 100, 0, 1);
          var vp = number_util_1.NumberUtil.constrain(v / 100, 0, 1);
          var c = vp * sp;
          var x = c * (1 - Math.abs(hp / 60 % 2 - 1));
          var m = vp - c;
          var rp, gp, bp;

          if (hp >= 0 && hp < 60) {
            _a = [c, x, 0], rp = _a[0], gp = _a[1], bp = _a[2];
          } else if (hp >= 60 && hp < 120) {
            _b = [x, c, 0], rp = _b[0], gp = _b[1], bp = _b[2];
          } else if (hp >= 120 && hp < 180) {
            _c = [0, c, x], rp = _c[0], gp = _c[1], bp = _c[2];
          } else if (hp >= 180 && hp < 240) {
            _d = [0, x, c], rp = _d[0], gp = _d[1], bp = _d[2];
          } else if (hp >= 240 && hp < 300) {
            _e = [x, 0, c], rp = _e[0], gp = _e[1], bp = _e[2];
          } else {
            _f = [c, 0, x], rp = _f[0], gp = _f[1], bp = _f[2];
          }

          return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
        }

        exports.hsvToRgb = hsvToRgb;
        /***/
      },

      /***/
      "./src/main/js/misc/constants.ts":
      /*!***************************************!*\
        !*** ./src/main/js/misc/constants.ts ***!
        \***************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.Constants = {
          monitorDefaultInterval: 200
        };
        /***/
      },

      /***/
      "./src/main/js/misc/disposing-util.ts":
      /*!********************************************!*\
        !*** ./src/main/js/misc/disposing-util.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        function disposeElement(elem) {
          if (elem && elem.parentElement) {
            elem.parentElement.removeChild(elem);
          }

          return null;
        }

        exports.disposeElement = disposeElement;
        /***/
      },

      /***/
      "./src/main/js/misc/dom-util.ts":
      /*!**************************************!*\
        !*** ./src/main/js/misc/dom-util.ts ***!
        \**************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";
        /* WEBPACK VAR INJECTION */

        (function (process) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });

          var type_util_1 = __webpack_require__(
          /*! ./type-util */
          "./src/main/js/misc/type-util.ts");

          exports.SVG_NS = 'http://www.w3.org/2000/svg';

          function forceReflow(element) {
            // tslint:disable-next-line:no-unused-expression
            element.offsetHeight;
          }

          exports.forceReflow = forceReflow;

          function disableTransitionTemporarily(element, callback) {
            var t = element.style.transition;
            element.style.transition = 'none';
            callback();
            element.style.transition = t;
          }

          exports.disableTransitionTemporarily = disableTransitionTemporarily;

          function supportsTouch(document) {
            return document.ontouchstart !== undefined;
          }

          exports.supportsTouch = supportsTouch;

          function getWindowDocument() {
            // tslint:disable-next-line:function-constructor
            var globalObj = type_util_1.TypeUtil.forceCast(new Function('return this')());
            return globalObj.document;
          }

          exports.getWindowDocument = getWindowDocument;

          function isBrowser() {
            // Webpack defines process.browser = true;
            // https://github.com/webpack/node-libs-browser
            // https://github.com/defunctzombie/node-process
            return !!true;
          }

          function getCanvasContext(canvasElement) {
            // HTMLCanvasElement.prototype.getContext is not defined on testing environment
            return isBrowser() ? canvasElement.getContext('2d') : null;
          }

          exports.getCanvasContext = getCanvasContext; // tslint:disable: max-line-length

          var ICON_ID_TO_INNER_HTML_MAP = {
            p2dpad: '<path d="M8 2V14" stroke="currentColor" stroke-width="1.5"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/>'
          };

          function createSvgIconElement(document, iconId) {
            var elem = document.createElementNS(exports.SVG_NS, 'svg');
            elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
            return elem;
          }

          exports.createSvgIconElement = createSvgIconElement;
          /* WEBPACK VAR INJECTION */
        }).call(this, __webpack_require__(
        /*! ./../../../../node_modules/process/browser.js */
        "./node_modules/process/browser.js"));
        /***/
      },

      /***/
      "./src/main/js/misc/emitter.ts":
      /*!*************************************!*\
        !*** ./src/main/js/misc/emitter.ts ***!
        \*************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        var Emitter =
        /** @class */
        function () {
          function Emitter() {
            this.observers_ = {};
          }

          Emitter.prototype.on = function (eventName, handler) {
            var observers = this.observers_[eventName];

            if (!observers) {
              observers = this.observers_[eventName] = [];
            }

            observers.push({
              handler: handler
            });
            return this;
          };

          Emitter.prototype.off = function (eventName, handler) {
            var observers = this.observers_[eventName];

            if (observers) {
              this.observers_[eventName] = observers.filter(function (observer) {
                return observer.handler !== handler;
              });
            }

            return this;
          };

          Emitter.prototype.emit = function (eventName, opt_args) {
            var observers = this.observers_[eventName];

            if (!observers) {
              return;
            }

            observers.forEach(function (observer) {
              var handlerArgs = opt_args || [];
              observer.handler.apply(observer, handlerArgs);
            });
          };

          return Emitter;
        }();

        exports.Emitter = Emitter;
        /***/
      },

      /***/
      "./src/main/js/misc/number-util.ts":
      /*!*****************************************!*\
        !*** ./src/main/js/misc/number-util.ts ***!
        \*****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.NumberUtil = {
          map: function (value, start1, end1, start2, end2) {
            var p = (value - start1) / (end1 - start1);
            return start2 + p * (end2 - start2);
          },
          getDecimalDigits: function (value) {
            var text = String(value.toFixed(10));
            var frac = text.split('.')[1];
            return frac.replace(/0+$/, '').length;
          },
          constrain: function (value, min, max) {
            return Math.min(Math.max(value, min), max);
          },
          loop: function (value, max) {
            return (value % max + max) % max;
          }
        };
        /***/
      },

      /***/
      "./src/main/js/misc/pane-error.ts":
      /*!****************************************!*\
        !*** ./src/main/js/misc/pane-error.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        function createMessage(config) {
          if (config.type === 'alreadydisposed') {
            return 'View has been already disposed';
          }

          if (config.type === 'emptyvalue') {
            return "Value is empty for " + config.context.key;
          }

          if (config.type === 'invalidparams') {
            return "Invalid parameters for " + config.context.name;
          }

          if (config.type === 'nomatchingcontroller') {
            return "No matching controller for " + config.context.key;
          }

          if (config.type === 'shouldneverhappen') {
            return 'This error should never happen';
          }

          return 'Unexpected error';
        }

        var PaneError =
        /** @class */
        function () {
          function PaneError(config) {
            this.message = createMessage(config);
            this.name = this.constructor.name;
            this.stack = new Error(this.message).stack;
            this.type = config.type;
          }

          PaneError.alreadyDisposed = function () {
            return new PaneError({
              type: 'alreadydisposed'
            });
          };

          PaneError.shouldNeverHappen = function () {
            return new PaneError({
              type: 'shouldneverhappen'
            });
          };

          return PaneError;
        }();

        exports.PaneError = PaneError;
        PaneError.prototype = Object.create(Error.prototype);
        PaneError.prototype.constructor = PaneError;
        /***/
      },

      /***/
      "./src/main/js/misc/pointer-handler.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/misc/pointer-handler.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var DomUtil = __webpack_require__(
        /*! ./dom-util */
        "./src/main/js/misc/dom-util.ts");

        var emitter_1 = __webpack_require__(
        /*! ./emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * A utility class to handle both mouse and touch events.
         * @hidden
         */


        var PointerHandler =
        /** @class */
        function () {
          function PointerHandler(document, element) {
            this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
            this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
            this.onMouseDown_ = this.onMouseDown_.bind(this);
            this.onTouchMove_ = this.onTouchMove_.bind(this);
            this.onTouchStart_ = this.onTouchStart_.bind(this);
            this.document = document;
            this.element = element;
            this.emitter = new emitter_1.Emitter();
            this.pressed_ = false;

            if (DomUtil.supportsTouch(this.document)) {
              element.addEventListener('touchstart', this.onTouchStart_);
              element.addEventListener('touchmove', this.onTouchMove_);
            } else {
              element.addEventListener('mousedown', this.onMouseDown_);
              this.document.addEventListener('mousemove', this.onDocumentMouseMove_);
              this.document.addEventListener('mouseup', this.onDocumentMouseUp_);
            }
          }

          PointerHandler.prototype.computePosition_ = function (offsetX, offsetY) {
            var rect = this.element.getBoundingClientRect();
            return {
              px: offsetX / rect.width,
              py: offsetY / rect.height
            };
          };

          PointerHandler.prototype.onMouseDown_ = function (e) {
            // Prevent native text selection
            e.preventDefault();
            this.pressed_ = true;
            this.emitter.emit('down', [this.computePosition_(e.offsetX, e.offsetY)]);
          };

          PointerHandler.prototype.onDocumentMouseMove_ = function (e) {
            if (!this.pressed_) {
              return;
            }

            var win = this.document.defaultView;
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('move', [this.computePosition_(e.pageX - ((win && win.scrollX || 0) + rect.left), e.pageY - ((win && win.scrollY || 0) + rect.top))]);
          };

          PointerHandler.prototype.onDocumentMouseUp_ = function (e) {
            if (!this.pressed_) {
              return;
            }

            this.pressed_ = false;
            var win = this.document.defaultView;
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('up', [this.computePosition_(e.pageX - ((win && win.scrollX || 0) + rect.left), e.pageY - ((win && win.scrollY || 0) + rect.top))]);
          };

          PointerHandler.prototype.onTouchStart_ = function (e) {
            // Prevent native page scroll
            e.preventDefault();
            var touch = e.targetTouches[0];
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('down', [this.computePosition_(touch.clientX - rect.left, touch.clientY - rect.top)]);
          };

          PointerHandler.prototype.onTouchMove_ = function (e) {
            var touch = e.targetTouches[0];
            var rect = this.element.getBoundingClientRect();
            this.emitter.emit('move', [this.computePosition_(touch.clientX - rect.left, touch.clientY - rect.top)]);
          };

          return PointerHandler;
        }();

        exports.PointerHandler = PointerHandler;
        /***/
      },

      /***/
      "./src/main/js/misc/ticker/interval.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/misc/ticker/interval.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var IntervalTicker =
        /** @class */
        function () {
          function IntervalTicker(document, interval) {
            var _this = this;

            this.onTick_ = this.onTick_.bind(this);
            this.onWindowBlur_ = this.onWindowBlur_.bind(this);
            this.onWindowFocus_ = this.onWindowFocus_.bind(this);
            this.active_ = true;
            this.doc_ = document;
            this.emitter = new emitter_1.Emitter();

            if (interval <= 0) {
              this.id_ = null;
            } else {
              var win = this.doc_.defaultView;

              if (win) {
                this.id_ = win.setInterval(function () {
                  if (!_this.active_) {
                    return;
                  }

                  _this.onTick_();
                }, interval);
              }
            } // TODO: Stop on blur?
            // const win = document.defaultView;
            // if (win) {
            //   win.addEventListener('blur', this.onWindowBlur_);
            //   win.addEventListener('focus', this.onWindowFocus_);
            // }

          }

          IntervalTicker.prototype.dispose = function () {
            if (this.id_ !== null) {
              var win = this.doc_.defaultView;

              if (win) {
                win.clearInterval(this.id_);
              }
            }

            this.id_ = null;
          };

          IntervalTicker.prototype.onTick_ = function () {
            this.emitter.emit('tick');
          };

          IntervalTicker.prototype.onWindowBlur_ = function () {
            this.active_ = false;
          };

          IntervalTicker.prototype.onWindowFocus_ = function () {
            this.active_ = true;
          };

          return IntervalTicker;
        }();

        exports.IntervalTicker = IntervalTicker;
        /***/
      },

      /***/
      "./src/main/js/misc/type-util.ts":
      /*!***************************************!*\
        !*** ./src/main/js/misc/type-util.ts ***!
        \***************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.TypeUtil = {
          forceCast: function (v) {
            return v;
          },
          isEmpty: function (value) {
            return value === null || value === undefined;
          },
          getOrDefault: function (value, defaultValue) {
            return !exports.TypeUtil.isEmpty(value) ? value : defaultValue;
          }
        };
        /***/
      },

      /***/
      "./src/main/js/model/button.ts":
      /*!*************************************!*\
        !*** ./src/main/js/model/button.ts ***!
        \*************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var Button =
        /** @class */
        function () {
          function Button(title) {
            this.emitter = new emitter_1.Emitter();
            this.title = title;
          }

          Button.prototype.click = function () {
            this.emitter.emit('click');
          };

          return Button;
        }();

        exports.Button = Button;
        /***/
      },

      /***/
      "./src/main/js/model/color.ts":
      /*!************************************!*\
        !*** ./src/main/js/model/color.ts ***!
        \************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var ColorModel = __webpack_require__(
        /*! ../misc/color-model */
        "./src/main/js/misc/color-model.ts");

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");

        var number_util_1 = __webpack_require__(
        /*! ../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var CONSTRAINT_MAP = {
          hsv: function (comps) {
            return [number_util_1.NumberUtil.loop(comps[0], 360), number_util_1.NumberUtil.constrain(comps[1], 0, 100), number_util_1.NumberUtil.constrain(comps[2], 0, 100)];
          },
          rgb: function (comps) {
            return [number_util_1.NumberUtil.constrain(comps[0], 0, 255), number_util_1.NumberUtil.constrain(comps[1], 0, 255), number_util_1.NumberUtil.constrain(comps[2], 0, 255)];
          }
        };

        function isRgbColorComponent(obj, key) {
          if (typeof obj !== 'object' || type_util_1.TypeUtil.isEmpty(obj)) {
            return false;
          }

          return key in obj && typeof obj[key] === 'number';
        }
        /**
         * @hidden
         */


        var Color =
        /** @class */
        function () {
          function Color(comps, mode) {
            this.emitter = new emitter_1.Emitter();
            this.mode_ = mode;
            this.comps_ = CONSTRAINT_MAP[mode](comps);
          }

          Color.fromRgbObject = function (obj) {
            return new Color([obj.r, obj.g, obj.b], 'rgb');
          };

          Color.toRgbObject = function (color) {
            return color.toRgbObject();
          };

          Color.isRgbColorObject = function (obj) {
            return isRgbColorComponent(obj, 'r') && isRgbColorComponent(obj, 'g') && isRgbColorComponent(obj, 'b');
          };

          Object.defineProperty(Color.prototype, "mode", {
            get: function () {
              return this.mode_;
            },
            enumerable: true,
            configurable: true
          });

          Color.prototype.getComponents = function (mode) {
            if (this.mode_ === 'hsv' && mode === 'rgb') {
              return ColorModel.hsvToRgb.apply(ColorModel, this.comps_);
            }

            if (this.mode_ === 'rgb' && mode === 'hsv') {
              return ColorModel.rgbToHsv.apply(ColorModel, this.comps_);
            }

            return this.comps_;
          };

          Color.prototype.toRgbObject = function () {
            var rgbComps = this.getComponents('rgb'); // tslint:disable:object-literal-sort-keys

            return {
              r: rgbComps[0],
              g: rgbComps[1],
              b: rgbComps[2]
            }; // tslint:enable:object-literal-sort-keys
          };

          return Color;
        }();

        exports.Color = Color;
        /***/
      },

      /***/
      "./src/main/js/model/foldable.ts":
      /*!***************************************!*\
        !*** ./src/main/js/model/foldable.ts ***!
        \***************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var Foldable =
        /** @class */
        function () {
          function Foldable() {
            this.emitter = new emitter_1.Emitter();
            this.expanded_ = false;
          }

          Object.defineProperty(Foldable.prototype, "expanded", {
            get: function () {
              return this.expanded_;
            },
            set: function (expanded) {
              var changed = this.expanded_ !== expanded;

              if (changed) {
                this.expanded_ = expanded;
                this.emitter.emit('change');
              }
            },
            enumerable: true,
            configurable: true
          });
          return Foldable;
        }();

        exports.Foldable = Foldable;
        /***/
      },

      /***/
      "./src/main/js/model/folder.ts":
      /*!*************************************!*\
        !*** ./src/main/js/model/folder.ts ***!
        \*************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var Folder =
        /** @class */
        function () {
          function Folder(title, expanded) {
            this.emitter = new emitter_1.Emitter();
            this.expanded_ = expanded;
            this.expandedHeight_ = null;
            this.title = title;
          }

          Object.defineProperty(Folder.prototype, "expanded", {
            get: function () {
              return this.expanded_;
            },
            set: function (expanded) {
              var changed = this.expanded_ !== expanded;

              if (changed) {
                this.expanded_ = expanded;
                this.emitter.emit('change');
              }
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Folder.prototype, "expandedHeight", {
            get: function () {
              return this.expandedHeight_;
            },
            set: function (expandedHeight) {
              var changed = this.expandedHeight_ !== expandedHeight;

              if (changed) {
                this.expandedHeight_ = expandedHeight;
                this.emitter.emit('change');
              }
            },
            enumerable: true,
            configurable: true
          });
          return Folder;
        }();

        exports.Folder = Folder;
        /***/
      },

      /***/
      "./src/main/js/model/graph-cursor.ts":
      /*!*******************************************!*\
        !*** ./src/main/js/model/graph-cursor.ts ***!
        \*******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var GraphCursor =
        /** @class */
        function () {
          function GraphCursor() {
            this.emitter = new emitter_1.Emitter();
            this.index_ = -1;
          }

          Object.defineProperty(GraphCursor.prototype, "index", {
            get: function () {
              return this.index_;
            },
            set: function (index) {
              var changed = this.index_ !== index;

              if (changed) {
                this.index_ = index;
                this.emitter.emit('change', [index]);
              }
            },
            enumerable: true,
            configurable: true
          });
          return GraphCursor;
        }();

        exports.GraphCursor = GraphCursor;
        /***/
      },

      /***/
      "./src/main/js/model/input-value.ts":
      /*!******************************************!*\
        !*** ./src/main/js/model/input-value.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var InputValue =
        /** @class */
        function () {
          function InputValue(initialValue, constraint) {
            this.constraint_ = constraint;
            this.emitter = new emitter_1.Emitter();
            this.rawValue_ = initialValue;
          }

          InputValue.equalsValue = function (v1, v2) {
            return v1 === v2;
          };

          Object.defineProperty(InputValue.prototype, "constraint", {
            get: function () {
              return this.constraint_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(InputValue.prototype, "rawValue", {
            get: function () {
              return this.rawValue_;
            },
            set: function (rawValue) {
              var constrainedValue = this.constraint_ ? this.constraint_.constrain(rawValue) : rawValue;
              var changed = !InputValue.equalsValue(this.rawValue_, constrainedValue);

              if (changed) {
                this.rawValue_ = constrainedValue;
                this.emitter.emit('change', [constrainedValue]);
              }
            },
            enumerable: true,
            configurable: true
          });
          return InputValue;
        }();

        exports.InputValue = InputValue;
        /***/
      },

      /***/
      "./src/main/js/model/list.ts":
      /*!***********************************!*\
        !*** ./src/main/js/model/list.ts ***!
        \***********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var List =
        /** @class */
        function () {
          function List() {
            this.emitter = new emitter_1.Emitter();
            this.items_ = [];
          }

          Object.defineProperty(List.prototype, "items", {
            get: function () {
              return this.items_;
            },
            enumerable: true,
            configurable: true
          });

          List.prototype.append = function (item) {
            this.items_.push(item);
            this.emitter.emit('append', [item]);
          };

          return List;
        }();

        exports.List = List;
        /***/
      },

      /***/
      "./src/main/js/model/monitor-value.ts":
      /*!********************************************!*\
        !*** ./src/main/js/model/monitor-value.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var emitter_1 = __webpack_require__(
        /*! ../misc/emitter */
        "./src/main/js/misc/emitter.ts");
        /**
         * @hidden
         */


        var MonitorValue =
        /** @class */
        function () {
          function MonitorValue(totalCount) {
            this.emitter = new emitter_1.Emitter();
            this.rawValues_ = [];
            this.totalCount_ = totalCount;
          }

          Object.defineProperty(MonitorValue.prototype, "rawValues", {
            get: function () {
              return this.rawValues_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(MonitorValue.prototype, "totalCount", {
            get: function () {
              return this.totalCount_;
            },
            enumerable: true,
            configurable: true
          });

          MonitorValue.prototype.append = function (rawValue) {
            this.rawValues_.push(rawValue);

            if (this.rawValues_.length > this.totalCount_) {
              this.rawValues_.splice(0, this.rawValues_.length - this.totalCount_);
            }

            this.emitter.emit('update', [rawValue]);
          };

          return MonitorValue;
        }();

        exports.MonitorValue = MonitorValue;
        /***/
      },

      /***/
      "./src/main/js/model/point-2d.ts":
      /*!***************************************!*\
        !*** ./src/main/js/model/point-2d.ts ***!
        \***************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var Point2d =
        /** @class */
        function () {
          function Point2d(x, y) {
            if (x === void 0) {
              x = 0;
            }

            if (y === void 0) {
              y = 0;
            }

            this.x = x;
            this.y = y;
          }

          Point2d.prototype.getComponents = function () {
            return [this.x, this.y];
          };

          Point2d.prototype.toObject = function () {
            return {
              x: this.x,
              y: this.y
            };
          };

          return Point2d;
        }();

        exports.Point2d = Point2d;
        /***/
      },

      /***/
      "./src/main/js/model/target.ts":
      /*!*************************************!*\
        !*** ./src/main/js/model/target.ts ***!
        \*************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");
        /**
         * @hidden
         */


        var Target =
        /** @class */
        function () {
          function Target(object, key, opt_id) {
            this.obj_ = object;
            this.key_ = key;
            this.presetKey_ = type_util_1.TypeUtil.getOrDefault(opt_id, key);
          }

          Object.defineProperty(Target.prototype, "key", {
            get: function () {
              return this.key_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Target.prototype, "presetKey", {
            get: function () {
              return this.presetKey_;
            },
            enumerable: true,
            configurable: true
          });

          Target.prototype.read = function () {
            return this.obj_[this.key_];
          };

          Target.prototype.write = function (value) {
            this.obj_[this.key_] = value;
          };

          return Target;
        }();

        exports.Target = Target;
        /***/
      },

      /***/
      "./src/main/js/parser/any-point-2d.ts":
      /*!********************************************!*\
        !*** ./src/main/js/parser/any-point-2d.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var point_2d_1 = __webpack_require__(
        /*! ../model/point-2d */
        "./src/main/js/model/point-2d.ts");
        /**
         * @hidden
         */


        exports.AnyPoint2dParser = function (obj) {
          if (type_util_1.TypeUtil.isEmpty(obj)) {
            return null;
          }

          var x = obj.x;
          var y = obj.y;

          if (typeof x !== 'number' || typeof y !== 'number') {
            return null;
          }

          return new point_2d_1.Point2d(x, y);
        };
        /***/

      },

      /***/
      "./src/main/js/parser/number-color.ts":
      /*!********************************************!*\
        !*** ./src/main/js/parser/number-color.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var color_1 = __webpack_require__(
        /*! ../model/color */
        "./src/main/js/model/color.ts");
        /**
         * @hidden
         */


        exports.NumberColorParser = function (num) {
          return new color_1.Color([num >> 16 & 0xff, num >> 8 & 0xff, num & 0xff], 'rgb');
        };
        /***/

      },

      /***/
      "./src/main/js/parser/string-color.ts":
      /*!********************************************!*\
        !*** ./src/main/js/parser/string-color.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var color_1 = __webpack_require__(
        /*! ../model/color */
        "./src/main/js/model/color.ts");

        function parseCssNumberOrPercentage(text, maxValue) {
          var m = text.match(/^(.+)%$/);

          if (!m) {
            return Math.min(parseFloat(text), maxValue);
          }

          return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
        }

        var NOTATION_TO_PARSER_MAP = {
          'func.rgb': function (text) {
            var m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);

            if (!m) {
              return null;
            }

            var comps = [parseCssNumberOrPercentage(m[1], 255), parseCssNumberOrPercentage(m[2], 255), parseCssNumberOrPercentage(m[3], 255)];

            if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
              return null;
            }

            return new color_1.Color(comps, 'rgb');
          },
          'hex.rgb': function (text) {
            var mRrggbb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);

            if (mRrggbb) {
              return new color_1.Color([parseInt(mRrggbb[1] + mRrggbb[1], 16), parseInt(mRrggbb[2] + mRrggbb[2], 16), parseInt(mRrggbb[3] + mRrggbb[3], 16)], 'rgb');
            }

            var mRgb = text.match(/^#?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);

            if (mRgb) {
              return new color_1.Color([parseInt(mRgb[1], 16), parseInt(mRgb[2], 16), parseInt(mRgb[3], 16)], 'rgb');
            }

            return null;
          }
        };
        /**
         * @hidden
         */

        exports.CompositeParser = function (text) {
          var notations = Object.keys(NOTATION_TO_PARSER_MAP);
          return notations.reduce(function (result, notation) {
            var subparser = NOTATION_TO_PARSER_MAP[notation];
            return result ? result : subparser(text);
          }, null);
        };

        function getNotation(text) {
          var notations = Object.keys(NOTATION_TO_PARSER_MAP);
          return notations.reduce(function (result, notation) {
            if (result) {
              return result;
            }

            var subparser = NOTATION_TO_PARSER_MAP[notation];
            return subparser(text) ? notation : null;
          }, null);
        }

        exports.getNotation = getNotation;
        /***/
      },

      /***/
      "./src/main/js/parser/string-number.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/parser/string-number.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        /**
         * @hidden
         */

        exports.StringNumberParser = function (text) {
          var num = parseFloat(text);

          if (isNaN(num)) {
            return null;
          }

          return num;
        };
        /***/

      },

      /***/
      "./src/main/js/tweakpane-without-style.ts":
      /*!************************************************!*\
        !*** ./src/main/js/tweakpane-without-style.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var root_1 = __webpack_require__(
        /*! ./api/root */
        "./src/main/js/api/root.ts");

        var root_2 = __webpack_require__(
        /*! ./controller/root */
        "./src/main/js/controller/root.ts");

        var class_name_1 = __webpack_require__(
        /*! ./misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DomUtil = __webpack_require__(
        /*! ./misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ./misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var type_util_1 = __webpack_require__(
        /*! ./misc/type-util */
        "./src/main/js/misc/type-util.ts");

        function createDefaultWrapperElement(document) {
          var elem = document.createElement('div');
          elem.classList.add(class_name_1.ClassName('dfw')());

          if (document.body) {
            document.body.appendChild(elem);
          }

          return elem;
        }

        var TweakpaneWithoutStyle =
        /** @class */
        function (_super) {
          __extends(TweakpaneWithoutStyle, _super);

          function TweakpaneWithoutStyle(opt_config) {
            var _this = this;

            var config = opt_config || {};
            var document = type_util_1.TypeUtil.getOrDefault(config.document, DomUtil.getWindowDocument());
            var rootController = new root_2.RootController(document, {
              title: config.title
            });
            _this = _super.call(this, rootController) || this;
            _this.containerElem_ = config.container || createDefaultWrapperElement(document);

            _this.containerElem_.appendChild(_this.element);

            _this.doc_ = document;
            _this.usesDefaultWrapper_ = !config.container;
            return _this;
          }

          TweakpaneWithoutStyle.prototype.dispose = function () {
            var containerElem = this.containerElem_;

            if (!containerElem) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            if (this.usesDefaultWrapper_) {
              var parentElem = containerElem.parentElement;

              if (parentElem) {
                parentElem.removeChild(containerElem);
              }
            }

            this.containerElem_ = null;
            this.doc_ = null;

            _super.prototype.dispose.call(this);
          };

          Object.defineProperty(TweakpaneWithoutStyle.prototype, "document", {
            get: function () {
              if (!this.doc_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.doc_;
            },
            enumerable: true,
            configurable: true
          });
          return TweakpaneWithoutStyle;
        }(root_1.RootApi);

        exports.TweakpaneWithoutStyle = TweakpaneWithoutStyle;
        /***/
      },

      /***/
      "./src/main/js/view/button.ts":
      /*!************************************!*\
        !*** ./src/main/js/view/button.ts ***!
        \************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ./view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('btn');
        /**
         * @hidden
         */

        var ButtonView =
        /** @class */
        function (_super) {
          __extends(ButtonView, _super);

          function ButtonView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.button = config.button;

            _this.element.classList.add(className());

            var buttonElem = document.createElement('button');
            buttonElem.classList.add(className('b'));
            buttonElem.textContent = _this.button.title;

            _this.element.appendChild(buttonElem);

            _this.buttonElem_ = buttonElem;
            return _this;
          }

          Object.defineProperty(ButtonView.prototype, "buttonElement", {
            get: function () {
              if (!this.buttonElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.buttonElem_;
            },
            enumerable: true,
            configurable: true
          });

          ButtonView.prototype.dispose = function () {
            this.buttonElem_ = DisposingUtil.disposeElement(this.buttonElem_);

            _super.prototype.dispose.call(this);
          };

          return ButtonView;
        }(view_1.View);

        exports.ButtonView = ButtonView;
        /***/
      },

      /***/
      "./src/main/js/view/folder.ts":
      /*!************************************!*\
        !*** ./src/main/js/view/folder.ts ***!
        \************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var type_util_1 = __webpack_require__(
        /*! ../misc/type-util */
        "./src/main/js/misc/type-util.ts");

        var view_1 = __webpack_require__(
        /*! ./view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('fld');
        /**
         * @hidden
         */

        var FolderView =
        /** @class */
        function (_super) {
          __extends(FolderView, _super);

          function FolderView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onFolderChange_ = _this.onFolderChange_.bind(_this);
            _this.folder_ = config.folder;

            _this.folder_.emitter.on('change', _this.onFolderChange_);

            _this.element.classList.add(className());

            var titleElem = document.createElement('button');
            titleElem.classList.add(className('t'));
            titleElem.textContent = _this.folder_.title;

            _this.element.appendChild(titleElem);

            _this.titleElem_ = titleElem;
            var markElem = document.createElement('div');
            markElem.classList.add(className('m'));

            _this.titleElem_.appendChild(markElem);

            var containerElem = document.createElement('div');
            containerElem.classList.add(className('c'));

            _this.element.appendChild(containerElem);

            _this.containerElem_ = containerElem;

            _this.applyModel_();

            return _this;
          }

          Object.defineProperty(FolderView.prototype, "titleElement", {
            get: function () {
              if (!this.titleElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.titleElem_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(FolderView.prototype, "containerElement", {
            get: function () {
              if (!this.containerElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.containerElem_;
            },
            enumerable: true,
            configurable: true
          });

          FolderView.prototype.dispose = function () {
            this.containerElem_ = DisposingUtil.disposeElement(this.containerElem_);
            this.titleElem_ = DisposingUtil.disposeElement(this.titleElem_);

            _super.prototype.dispose.call(this);
          };

          FolderView.prototype.applyModel_ = function () {
            var containerElem = this.containerElem_;

            if (!containerElem) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var expanded = this.folder_.expanded;
            var expandedClass = className(undefined, 'expanded');

            if (expanded) {
              this.element.classList.add(expandedClass);
            } else {
              this.element.classList.remove(expandedClass);
            }

            var expandedHeight = this.folder_.expandedHeight;

            if (!type_util_1.TypeUtil.isEmpty(expandedHeight)) {
              var containerHeight = expanded ? expandedHeight : 0;
              containerElem.style.height = containerHeight + "px";
            } else {
              containerElem.style.height = expanded ? 'auto' : '0px';
            }
          };

          FolderView.prototype.onFolderChange_ = function () {
            this.applyModel_();
          };

          return FolderView;
        }(view_1.View);

        exports.FolderView = FolderView;
        /***/
      },

      /***/
      "./src/main/js/view/input/checkbox.ts":
      /*!********************************************!*\
        !*** ./src/main/js/view/input/checkbox.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('ckb', 'input');
        /**
         * @hidden
         */

        var CheckboxInputView =
        /** @class */
        function (_super) {
          __extends(CheckboxInputView, _super);

          function CheckboxInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);

            _this.element.classList.add(className());

            var labelElem = document.createElement('label');
            labelElem.classList.add(className('l'));

            _this.element.appendChild(labelElem);

            var inputElem = document.createElement('input');
            inputElem.classList.add(className('i'));
            inputElem.type = 'checkbox';
            labelElem.appendChild(inputElem);
            _this.inputElem_ = inputElem;
            var markElem = document.createElement('div');
            markElem.classList.add(className('m'));
            labelElem.appendChild(markElem);
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Object.defineProperty(CheckboxInputView.prototype, "inputElement", {
            get: function () {
              if (!this.inputElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.inputElem_;
            },
            enumerable: true,
            configurable: true
          });

          CheckboxInputView.prototype.dispose = function () {
            this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);

            _super.prototype.dispose.call(this);
          };

          CheckboxInputView.prototype.update = function () {
            if (!this.inputElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            this.inputElem_.checked = this.value.rawValue;
          };

          CheckboxInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return CheckboxInputView;
        }(view_1.View);

        exports.CheckboxInputView = CheckboxInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/color-picker.ts":
      /*!************************************************!*\
        !*** ./src/main/js/view/input/color-picker.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('clp', 'input');
        /**
         * @hidden
         */

        var ColorPickerInputView =
        /** @class */
        function (_super) {
          __extends(ColorPickerInputView, _super);

          function ColorPickerInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onFoldableChange_ = _this.onFoldableChange_.bind(_this);
            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.value = config.value;

            _this.value.emitter.on('change', _this.onValueChange_);

            _this.foldable = config.foldable;

            _this.foldable.emitter.on('change', _this.onFoldableChange_);

            _this.element.classList.add(className());

            var hsvElem = document.createElement('div');
            hsvElem.classList.add(className('hsv'));
            var svElem = document.createElement('div');
            svElem.classList.add(className('sv'));
            _this.svPaletteView_ = config.svPaletteInputView;
            svElem.appendChild(_this.svPaletteView_.element);
            hsvElem.appendChild(svElem);
            var hElem = document.createElement('div');
            hElem.classList.add(className('h'));
            _this.hPaletteView_ = config.hPaletteInputView;
            hElem.appendChild(_this.hPaletteView_.element);
            hsvElem.appendChild(hElem);

            _this.element.appendChild(hsvElem);

            var rgbElem = document.createElement('div');
            rgbElem.classList.add(className('rgb'));
            _this.rgbTextView_ = config.rgbTextView;
            rgbElem.appendChild(_this.rgbTextView_.element);

            _this.element.appendChild(rgbElem);

            _this.update();

            return _this;
          }

          Object.defineProperty(ColorPickerInputView.prototype, "allFocusableElements", {
            get: function () {
              return [].concat(this.hPaletteView_.canvasElement, this.rgbTextView_.inputElements, this.svPaletteView_.canvasElement);
            },
            enumerable: true,
            configurable: true
          });

          ColorPickerInputView.prototype.dispose = function () {
            this.hPaletteView_.dispose();
            this.rgbTextView_.dispose();
            this.svPaletteView_.dispose();

            _super.prototype.dispose.call(this);
          };

          ColorPickerInputView.prototype.update = function () {
            if (this.foldable.expanded) {
              this.element.classList.add(className(undefined, 'expanded'));
            } else {
              this.element.classList.remove(className(undefined, 'expanded'));
            }
          };

          ColorPickerInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          ColorPickerInputView.prototype.onFoldableChange_ = function () {
            this.update();
          };

          return ColorPickerInputView;
        }(view_1.View);

        exports.ColorPickerInputView = ColorPickerInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/color-swatch-text.ts":
      /*!*****************************************************!*\
        !*** ./src/main/js/view/input/color-swatch-text.ts ***!
        \*****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('cswtxt', 'input');
        /**
         * @hidden
         */

        var ColorSwatchTextInputView =
        /** @class */
        function (_super) {
          __extends(ColorSwatchTextInputView, _super);

          function ColorSwatchTextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.element.classList.add(className());

            var swatchElem = document.createElement('div');
            swatchElem.classList.add(className('s'));
            _this.swatchInputView_ = config.swatchInputView;
            swatchElem.appendChild(_this.swatchInputView_.element);

            _this.element.appendChild(swatchElem);

            var textElem = document.createElement('div');
            textElem.classList.add(className('t'));
            _this.textInputView = config.textInputView;
            textElem.appendChild(_this.textInputView.element);

            _this.element.appendChild(textElem);

            return _this;
          }

          Object.defineProperty(ColorSwatchTextInputView.prototype, "value", {
            get: function () {
              return this.textInputView.value;
            },
            enumerable: true,
            configurable: true
          });

          ColorSwatchTextInputView.prototype.dispose = function () {
            this.swatchInputView_.dispose();
            this.textInputView.dispose();

            _super.prototype.dispose.call(this);
          };

          ColorSwatchTextInputView.prototype.update = function () {
            this.swatchInputView_.update();
            this.textInputView.update();
          };

          return ColorSwatchTextInputView;
        }(view_1.View);

        exports.ColorSwatchTextInputView = ColorSwatchTextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/color-swatch.ts":
      /*!************************************************!*\
        !*** ./src/main/js/view/input/color-swatch.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var ColorConverter = __webpack_require__(
        /*! ../../converter/color */
        "./src/main/js/converter/color.ts");

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('csw', 'input');
        var a = '';
        a.substr(1, 2);
        /**
         * @hidden
         */

        var ColorSwatchInputView =
        /** @class */
        function (_super) {
          __extends(ColorSwatchInputView, _super);

          function ColorSwatchInputView(document, config) {
            var _this = _super.call(this, document) || this;

            if (_this.element === null) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.element.classList.add(className());

            var swatchElem = document.createElement('div');
            swatchElem.classList.add(className('sw'));

            _this.element.appendChild(swatchElem);

            _this.swatchElem_ = swatchElem;
            var buttonElem = document.createElement('button');
            buttonElem.classList.add(className('b'));

            _this.element.appendChild(buttonElem);

            _this.buttonElem_ = buttonElem;
            var pickerElem = document.createElement('div');
            pickerElem.classList.add(className('p'));
            _this.pickerView_ = config.pickerInputView;
            pickerElem.appendChild(_this.pickerView_.element);

            _this.element.appendChild(pickerElem);

            _this.update();

            return _this;
          }

          Object.defineProperty(ColorSwatchInputView.prototype, "buttonElement", {
            get: function () {
              if (this.buttonElem_ === null) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.buttonElem_;
            },
            enumerable: true,
            configurable: true
          });

          ColorSwatchInputView.prototype.dispose = function () {
            this.pickerView_.dispose();
            this.buttonElem_ = DisposingUtil.disposeElement(this.buttonElem_);
            this.swatchElem_ = DisposingUtil.disposeElement(this.swatchElem_);

            _super.prototype.dispose.call(this);
          };

          ColorSwatchInputView.prototype.update = function () {
            if (!this.swatchElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var value = this.value.rawValue;
            this.swatchElem_.style.backgroundColor = ColorConverter.toHexRgbString(value);
          };

          ColorSwatchInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return ColorSwatchInputView;
        }(view_1.View);

        exports.ColorSwatchInputView = ColorSwatchInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/h-palette.ts":
      /*!*********************************************!*\
        !*** ./src/main/js/view/input/h-palette.ts ***!
        \*********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var color_1 = __webpack_require__(
        /*! ../../formatter/color */
        "./src/main/js/formatter/color.ts");

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var ColorModel = __webpack_require__(
        /*! ../../misc/color-model */
        "./src/main/js/misc/color-model.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var DomUtil = __webpack_require__(
        /*! ../../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('hpl', 'input');
        /**
         * @hidden
         */

        var HPaletteInputView =
        /** @class */
        function (_super) {
          __extends(HPaletteInputView, _super);

          function HPaletteInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.value = config.value;

            _this.value.emitter.on('change', _this.onValueChange_);

            _this.element.classList.add(className());

            var canvasElem = document.createElement('canvas');
            canvasElem.classList.add(className('c'));
            canvasElem.tabIndex = -1;

            _this.element.appendChild(canvasElem);

            _this.canvasElem_ = canvasElem;
            var markerElem = document.createElement('div');
            markerElem.classList.add(className('m'));

            _this.element.appendChild(markerElem);

            _this.markerElem_ = markerElem;

            _this.update();

            return _this;
          }

          Object.defineProperty(HPaletteInputView.prototype, "canvasElement", {
            get: function () {
              if (!this.canvasElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.canvasElem_;
            },
            enumerable: true,
            configurable: true
          });

          HPaletteInputView.prototype.dispose = function () {
            this.canvasElem_ = DisposingUtil.disposeElement(this.canvasElem_);
            this.markerElem_ = DisposingUtil.disposeElement(this.markerElem_);

            _super.prototype.dispose.call(this);
          };

          HPaletteInputView.prototype.update = function () {
            if (!this.markerElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var ctx = DomUtil.getCanvasContext(this.canvasElement);

            if (!ctx) {
              return;
            }

            var width = this.canvasElement.width;
            var height = this.canvasElement.height;
            var cellCount = 64;
            var ch = Math.ceil(height / cellCount);

            for (var iy = 0; iy < cellCount; iy++) {
              var hue = number_util_1.NumberUtil.map(iy, 0, cellCount - 1, 0, 360);
              var rgbComps = ColorModel.hsvToRgb(hue, 100, 100);
              ctx.fillStyle = color_1.ColorFormatter.rgb.apply(color_1.ColorFormatter, rgbComps);
              var y = Math.floor(number_util_1.NumberUtil.map(iy, 0, cellCount - 1, 0, height - ch));
              ctx.fillRect(0, y, width, ch);
            }

            var c = this.value.rawValue;
            var hsvComps = c.getComponents('hsv');
            var top = number_util_1.NumberUtil.map(hsvComps[0], 0, 360, 0, 100);
            this.markerElem_.style.top = top + "%";
          };

          HPaletteInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return HPaletteInputView;
        }(view_1.View);

        exports.HPaletteInputView = HPaletteInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/list.ts":
      /*!****************************************!*\
        !*** ./src/main/js/view/input/list.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('lst', 'input');
        /**
         * @hidden
         */

        var ListInputView =
        /** @class */
        function (_super) {
          __extends(ListInputView, _super);

          function ListInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);

            _this.element.classList.add(className());

            _this.stringifyValue_ = config.stringifyValue;
            var selectElem = document.createElement('select');
            selectElem.classList.add(className('s'));
            config.options.forEach(function (item, index) {
              var optionElem = document.createElement('option');
              optionElem.dataset.index = String(index);
              optionElem.textContent = item.text;
              optionElem.value = _this.stringifyValue_(item.value);
              selectElem.appendChild(optionElem);
            });

            _this.element.appendChild(selectElem);

            _this.selectElem_ = selectElem;
            var markElem = document.createElement('div');
            markElem.classList.add(className('m'));

            _this.element.appendChild(markElem);

            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Object.defineProperty(ListInputView.prototype, "selectElement", {
            get: function () {
              if (!this.selectElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.selectElem_;
            },
            enumerable: true,
            configurable: true
          });

          ListInputView.prototype.dispose = function () {
            this.selectElem_ = DisposingUtil.disposeElement(this.selectElem_);

            _super.prototype.dispose.call(this);
          };

          ListInputView.prototype.update = function () {
            if (!this.selectElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            this.selectElem_.value = this.stringifyValue_(this.value.rawValue);
          };

          ListInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return ListInputView;
        }(view_1.View);

        exports.ListInputView = ListInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/point-2d-pad-text.ts":
      /*!*****************************************************!*\
        !*** ./src/main/js/view/input/point-2d-pad-text.ts ***!
        \*****************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DomUtil = __webpack_require__(
        /*! ../../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('p2dpadtxt', 'input');
        /**
         * @hidden
         */

        var Point2dPadTextInputView =
        /** @class */
        function (_super) {
          __extends(Point2dPadTextInputView, _super);

          function Point2dPadTextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.element.classList.add(className());

            var padWrapperElem = document.createElement('div');
            padWrapperElem.classList.add(className('w'));

            _this.element.appendChild(padWrapperElem);

            var buttonElem = document.createElement('button');
            buttonElem.classList.add(className('b'));
            buttonElem.appendChild(DomUtil.createSvgIconElement(document, 'p2dpad'));
            padWrapperElem.appendChild(buttonElem);
            _this.padButtonElem_ = buttonElem;
            var padElem = document.createElement('div');
            padElem.classList.add(className('p'));
            padWrapperElem.appendChild(padElem);
            _this.padInputView_ = config.padInputView;
            padElem.appendChild(_this.padInputView_.element);
            var textElem = document.createElement('div');
            textElem.classList.add(className('t'));
            _this.textInputView_ = config.textInputView;
            textElem.appendChild(_this.textInputView_.element);

            _this.element.appendChild(textElem);

            return _this;
          }

          Object.defineProperty(Point2dPadTextInputView.prototype, "value", {
            get: function () {
              return this.textInputView_.value;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(Point2dPadTextInputView.prototype, "padButtonElement", {
            get: function () {
              return this.padButtonElem_;
            },
            enumerable: true,
            configurable: true
          });

          Point2dPadTextInputView.prototype.dispose = function () {
            this.padInputView_.dispose();
            this.textInputView_.dispose();

            _super.prototype.dispose.call(this);
          };

          Point2dPadTextInputView.prototype.update = function () {
            this.padInputView_.update();
            this.textInputView_.update();
          };

          return Point2dPadTextInputView;
        }(view_1.View);

        exports.Point2dPadTextInputView = Point2dPadTextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/point-2d-pad.ts":
      /*!************************************************!*\
        !*** ./src/main/js/view/input/point-2d-pad.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var DomUtil = __webpack_require__(
        /*! ../../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var SVG_NS = DomUtil.SVG_NS;
        var className = class_name_1.ClassName('p2dpad', 'input');
        /**
         * @hidden
         */

        var Point2dPadInputView =
        /** @class */
        function (_super) {
          __extends(Point2dPadInputView, _super);

          function Point2dPadInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onFoldableChange_ = _this.onFoldableChange_.bind(_this);
            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.foldable = config.foldable;

            _this.foldable.emitter.on('change', _this.onFoldableChange_);

            _this.maxValue_ = config.maxValue;

            _this.element.classList.add(className());

            var padElem = document.createElement('div');
            padElem.classList.add(className('p'));

            _this.element.appendChild(padElem);

            _this.padElem_ = padElem;
            var svgElem = document.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className('g'));

            _this.padElem_.appendChild(svgElem);

            _this.svgElem_ = svgElem;
            var xAxisElem = document.createElementNS(SVG_NS, 'line');
            xAxisElem.classList.add(className('ax'));
            xAxisElem.setAttributeNS(null, 'x1', '0');
            xAxisElem.setAttributeNS(null, 'y1', '50%');
            xAxisElem.setAttributeNS(null, 'x2', '100%');
            xAxisElem.setAttributeNS(null, 'y2', '50%');

            _this.svgElem_.appendChild(xAxisElem);

            var yAxisElem = document.createElementNS(SVG_NS, 'line');
            yAxisElem.classList.add(className('ax'));
            yAxisElem.setAttributeNS(null, 'x1', '50%');
            yAxisElem.setAttributeNS(null, 'y1', '0');
            yAxisElem.setAttributeNS(null, 'x2', '50%');
            yAxisElem.setAttributeNS(null, 'y2', '100%');

            _this.svgElem_.appendChild(yAxisElem);

            var lineElem = document.createElementNS(SVG_NS, 'line');
            lineElem.classList.add(className('l'));
            lineElem.setAttributeNS(null, 'x1', '50%');
            lineElem.setAttributeNS(null, 'y1', '50%');

            _this.svgElem_.appendChild(lineElem);

            _this.lineElem_ = lineElem;
            var markerElem = document.createElementNS(SVG_NS, 'circle');
            markerElem.classList.add(className('m'));
            markerElem.setAttributeNS(null, 'r', '2px');

            _this.svgElem_.appendChild(markerElem);

            _this.markerElem_ = markerElem;
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Point2dPadInputView.prototype.dispose = function () {
            this.padElem_ = DisposingUtil.disposeElement(this.padElem_);

            _super.prototype.dispose.call(this);
          };

          Object.defineProperty(Point2dPadInputView.prototype, "padElement", {
            get: function () {
              if (!this.padElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.padElem_;
            },
            enumerable: true,
            configurable: true
          });

          Point2dPadInputView.prototype.update = function () {
            if (this.foldable.expanded) {
              this.element.classList.add(className(undefined, 'expanded'));
            } else {
              this.element.classList.remove(className(undefined, 'expanded'));
            }

            var lineElem = this.lineElem_;
            var markerElem = this.markerElem_;

            if (!lineElem || !markerElem) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var _a = this.value.rawValue.getComponents(),
                x = _a[0],
                y = _a[1];

            var max = this.maxValue_;
            var px = number_util_1.NumberUtil.map(x, -max, +max, 0, 100);
            var py = number_util_1.NumberUtil.map(y, -max, +max, 0, 100);
            lineElem.setAttributeNS(null, 'x2', px + "%");
            lineElem.setAttributeNS(null, 'y2', py + "%");
            markerElem.setAttributeNS(null, 'cx', px + "%");
            markerElem.setAttributeNS(null, 'cy', py + "%");
          };

          Point2dPadInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          Point2dPadInputView.prototype.onFoldableChange_ = function () {
            this.update();
          };

          return Point2dPadInputView;
        }(view_1.View);

        exports.Point2dPadInputView = Point2dPadInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/point-2d-text.ts":
      /*!*************************************************!*\
        !*** ./src/main/js/view/input/point-2d-text.ts ***!
        \*************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var COMPONENT_LABELS = ['X', 'Y'];
        var className = class_name_1.ClassName('p2dtxt', 'input');
        /**
         * @hidden
         */

        var Point2dTextInputView =
        /** @class */
        function (_super) {
          __extends(Point2dTextInputView, _super);

          function Point2dTextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.formatters_ = [config.xFormatter, config.yFormatter];

            _this.element.classList.add(className());

            var inputElems = COMPONENT_LABELS.map(function () {
              var inputElem = document.createElement('input');
              inputElem.classList.add(className('i'));
              inputElem.type = 'text';
              return inputElem;
            });
            COMPONENT_LABELS.forEach(function (_, index) {
              var elem = document.createElement('div');
              elem.classList.add(className('w'));
              elem.appendChild(inputElems[index]);

              _this.element.appendChild(elem);
            });
            _this.inputElems_ = [inputElems[0], inputElems[1]];
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Point2dTextInputView.prototype.dispose = function () {
            if (this.inputElems_) {
              this.inputElems_.forEach(function (elem) {
                DisposingUtil.disposeElement(elem);
              });
              this.inputElems_ = null;
            }

            _super.prototype.dispose.call(this);
          };

          Object.defineProperty(Point2dTextInputView.prototype, "inputElements", {
            get: function () {
              if (!this.inputElems_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.inputElems_;
            },
            enumerable: true,
            configurable: true
          });

          Point2dTextInputView.prototype.update = function () {
            var _this = this;

            var inputElems = this.inputElems_;

            if (!inputElems) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var xyComps = this.value.rawValue.getComponents();
            xyComps.forEach(function (comp, index) {
              var inputElem = inputElems[index];
              inputElem.value = _this.formatters_[index].format(comp);
            });
          };

          Point2dTextInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return Point2dTextInputView;
        }(view_1.View);

        exports.Point2dTextInputView = Point2dTextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/rgb-text.ts":
      /*!********************************************!*\
        !*** ./src/main/js/view/input/rgb-text.ts ***!
        \********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('rgbtxt', 'input');
        /**
         * @hidden
         */

        var RgbTextInputView =
        /** @class */
        function (_super) {
          __extends(RgbTextInputView, _super);

          function RgbTextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.formatter_ = config.formatter;

            _this.element.classList.add(className());

            var labelElem = document.createElement('div');
            labelElem.classList.add(className('l'));
            labelElem.textContent = 'RGB';

            _this.element.appendChild(labelElem);

            var wrapperElem = document.createElement('div');
            wrapperElem.classList.add(className('w'));

            _this.element.appendChild(wrapperElem);

            var inputElems = [0, 1, 2].map(function () {
              var inputElem = document.createElement('input');
              inputElem.classList.add(className('i'));
              inputElem.type = 'text';
              return inputElem;
            });
            inputElems.forEach(function (elem) {
              wrapperElem.appendChild(elem);
            });
            _this.inputElems_ = [inputElems[0], inputElems[1], inputElems[2]];
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          RgbTextInputView.prototype.dispose = function () {
            if (this.inputElems_) {
              this.inputElems_.forEach(function (elem) {
                DisposingUtil.disposeElement(elem);
              });
              this.inputElems_ = null;
            }

            _super.prototype.dispose.call(this);
          };

          Object.defineProperty(RgbTextInputView.prototype, "inputElements", {
            get: function () {
              if (!this.inputElems_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.inputElems_;
            },
            enumerable: true,
            configurable: true
          });

          RgbTextInputView.prototype.update = function () {
            var _this = this;

            var inputElems = this.inputElems_;

            if (!inputElems) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var rgbComps = this.value.rawValue.getComponents('rgb');
            rgbComps.forEach(function (comp, index) {
              var inputElem = inputElems[index];
              inputElem.value = _this.formatter_.format(comp);
            });
          };

          RgbTextInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return RgbTextInputView;
        }(view_1.View);

        exports.RgbTextInputView = RgbTextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/slider-text.ts":
      /*!***********************************************!*\
        !*** ./src/main/js/view/input/slider-text.ts ***!
        \***********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('sldtxt', 'input');
        /**
         * @hidden
         */

        var SliderTextInputView =
        /** @class */
        function (_super) {
          __extends(SliderTextInputView, _super);

          function SliderTextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.element.classList.add(className());

            var sliderElem = document.createElement('div');
            sliderElem.classList.add(className('s'));
            _this.sliderInputView_ = config.sliderInputView;
            sliderElem.appendChild(_this.sliderInputView_.element);

            _this.element.appendChild(sliderElem);

            var textElem = document.createElement('div');
            textElem.classList.add(className('t'));
            _this.textInputView_ = config.textInputView;
            textElem.appendChild(_this.textInputView_.element);

            _this.element.appendChild(textElem);

            return _this;
          }

          Object.defineProperty(SliderTextInputView.prototype, "value", {
            get: function () {
              return this.sliderInputView_.value;
            },
            enumerable: true,
            configurable: true
          });

          SliderTextInputView.prototype.dispose = function () {
            this.sliderInputView_.dispose();
            this.textInputView_.dispose();

            _super.prototype.dispose.call(this);
          };

          SliderTextInputView.prototype.update = function () {
            this.sliderInputView_.update();
            this.textInputView_.update();
          };

          return SliderTextInputView;
        }(view_1.View);

        exports.SliderTextInputView = SliderTextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/slider.ts":
      /*!******************************************!*\
        !*** ./src/main/js/view/input/slider.ts ***!
        \******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('sld', 'input');
        /**
         * @hidden
         */

        var SliderInputView =
        /** @class */
        function (_super) {
          __extends(SliderInputView, _super);

          function SliderInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.minValue_ = config.minValue;
            _this.maxValue_ = config.maxValue;

            _this.element.classList.add(className());

            var outerElem = document.createElement('div');
            outerElem.classList.add(className('o'));

            _this.element.appendChild(outerElem);

            _this.outerElem_ = outerElem;
            var innerElem = document.createElement('div');
            innerElem.classList.add(className('i'));

            _this.outerElem_.appendChild(innerElem);

            _this.innerElem_ = innerElem;
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Object.defineProperty(SliderInputView.prototype, "outerElement", {
            get: function () {
              if (!this.outerElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.outerElem_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(SliderInputView.prototype, "innerElement", {
            get: function () {
              if (!this.innerElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.innerElem_;
            },
            enumerable: true,
            configurable: true
          });

          SliderInputView.prototype.dispose = function () {
            this.innerElem_ = DisposingUtil.disposeElement(this.innerElem_);
            this.outerElem_ = DisposingUtil.disposeElement(this.outerElem_);

            _super.prototype.dispose.call(this);
          };

          SliderInputView.prototype.update = function () {
            if (!this.innerElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var p = number_util_1.NumberUtil.map(this.value.rawValue, this.minValue_, this.maxValue_, 0, 100);
            this.innerElem_.style.width = p + "%";
          };

          SliderInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return SliderInputView;
        }(view_1.View);

        exports.SliderInputView = SliderInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/sv-palette.ts":
      /*!**********************************************!*\
        !*** ./src/main/js/view/input/sv-palette.ts ***!
        \**********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var color_1 = __webpack_require__(
        /*! ../../formatter/color */
        "./src/main/js/formatter/color.ts");

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var ColorModel = __webpack_require__(
        /*! ../../misc/color-model */
        "./src/main/js/misc/color-model.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var DomUtil = __webpack_require__(
        /*! ../../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('svp', 'input');
        /**
         * @hidden
         */

        var SvPaletteInputView =
        /** @class */
        function (_super) {
          __extends(SvPaletteInputView, _super);

          function SvPaletteInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.value = config.value;

            _this.value.emitter.on('change', _this.onValueChange_);

            _this.element.classList.add(className());

            var canvasElem = document.createElement('canvas');
            canvasElem.classList.add(className('c'));
            canvasElem.tabIndex = -1;

            _this.element.appendChild(canvasElem);

            _this.canvasElem_ = canvasElem;
            var markerElem = document.createElement('div');
            markerElem.classList.add(className('m'));

            _this.element.appendChild(markerElem);

            _this.markerElem_ = markerElem;

            _this.update();

            return _this;
          }

          Object.defineProperty(SvPaletteInputView.prototype, "canvasElement", {
            get: function () {
              if (!this.canvasElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.canvasElem_;
            },
            enumerable: true,
            configurable: true
          });

          SvPaletteInputView.prototype.dispose = function () {
            this.canvasElem_ = DisposingUtil.disposeElement(this.canvasElem_);
            this.markerElem_ = DisposingUtil.disposeElement(this.markerElem_);

            _super.prototype.dispose.call(this);
          };

          SvPaletteInputView.prototype.update = function () {
            if (!this.markerElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var ctx = DomUtil.getCanvasContext(this.canvasElement);

            if (!ctx) {
              return;
            }

            var c = this.value.rawValue;
            var hsvComps = c.getComponents('hsv');
            var width = this.canvasElement.width;
            var height = this.canvasElement.height;
            var cellCount = 64;
            var cw = Math.ceil(width / cellCount);
            var ch = Math.ceil(height / cellCount);

            for (var iy = 0; iy < cellCount; iy++) {
              for (var ix = 0; ix < cellCount; ix++) {
                var s = number_util_1.NumberUtil.map(ix, 0, cellCount - 1, 0, 100);
                var v = number_util_1.NumberUtil.map(iy, 0, cellCount - 1, 100, 0);
                var rgbComps = ColorModel.hsvToRgb(hsvComps[0], s, v);
                ctx.fillStyle = color_1.ColorFormatter.rgb.apply(color_1.ColorFormatter, rgbComps);
                var x = Math.floor(number_util_1.NumberUtil.map(ix, 0, cellCount - 1, 0, width - cw));
                var y = Math.floor(number_util_1.NumberUtil.map(iy, 0, cellCount - 1, 0, height - ch));
                ctx.fillRect(x, y, cw, ch);
              }
            }

            var left = number_util_1.NumberUtil.map(hsvComps[1], 0, 100, 0, 100);
            this.markerElem_.style.left = left + "%";
            var top = number_util_1.NumberUtil.map(hsvComps[2], 0, 100, 100, 0);
            this.markerElem_.style.top = top + "%";
          };

          SvPaletteInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return SvPaletteInputView;
        }(view_1.View);

        exports.SvPaletteInputView = SvPaletteInputView;
        /***/
      },

      /***/
      "./src/main/js/view/input/text.ts":
      /*!****************************************!*\
        !*** ./src/main/js/view/input/text.ts ***!
        \****************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('txt', 'input');
        /**
         * @hidden
         */

        var TextInputView =
        /** @class */
        function (_super) {
          __extends(TextInputView, _super);

          function TextInputView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueChange_ = _this.onValueChange_.bind(_this);
            _this.formatter_ = config.formatter;

            _this.element.classList.add(className());

            var inputElem = document.createElement('input');
            inputElem.classList.add(className('i'));
            inputElem.type = 'text';

            _this.element.appendChild(inputElem);

            _this.inputElem_ = inputElem;
            config.value.emitter.on('change', _this.onValueChange_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Object.defineProperty(TextInputView.prototype, "inputElement", {
            get: function () {
              if (!this.inputElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.inputElem_;
            },
            enumerable: true,
            configurable: true
          });

          TextInputView.prototype.dispose = function () {
            this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);

            _super.prototype.dispose.call(this);
          };

          TextInputView.prototype.update = function () {
            if (!this.inputElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            this.inputElem_.value = this.formatter_.format(this.value.rawValue);
          };

          TextInputView.prototype.onValueChange_ = function () {
            this.update();
          };

          return TextInputView;
        }(view_1.View);

        exports.TextInputView = TextInputView;
        /***/
      },

      /***/
      "./src/main/js/view/labeled.ts":
      /*!*************************************!*\
        !*** ./src/main/js/view/labeled.ts ***!
        \*************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var view_1 = __webpack_require__(
        /*! ./view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('lbl');
        /**
         * @hidden
         */

        var LabeledView =
        /** @class */
        function (_super) {
          __extends(LabeledView, _super);

          function LabeledView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.label = config.label;

            _this.element.classList.add(className());

            var labelElem = document.createElement('div');
            labelElem.classList.add(className('l'));
            labelElem.textContent = _this.label;

            _this.element.appendChild(labelElem);

            var viewElem = document.createElement('div');
            viewElem.classList.add(className('v'));
            viewElem.appendChild(config.view.element);

            _this.element.appendChild(viewElem);

            return _this;
          }

          return LabeledView;
        }(view_1.View);

        exports.LabeledView = LabeledView;
        /***/
      },

      /***/
      "./src/main/js/view/monitor/graph.ts":
      /*!*******************************************!*\
        !*** ./src/main/js/view/monitor/graph.ts ***!
        \*******************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var DomUtil = __webpack_require__(
        /*! ../../misc/dom-util */
        "./src/main/js/misc/dom-util.ts");

        var number_util_1 = __webpack_require__(
        /*! ../../misc/number-util */
        "./src/main/js/misc/number-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var SVG_NS = DomUtil.SVG_NS;
        var className = class_name_1.ClassName('grp', 'monitor');
        /**
         * @hidden
         */

        var GraphMonitorView =
        /** @class */
        function (_super) {
          __extends(GraphMonitorView, _super);

          function GraphMonitorView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onCursorChange_ = _this.onCursorChange_.bind(_this);
            _this.onValueUpdate_ = _this.onValueUpdate_.bind(_this);

            _this.element.classList.add(className());

            _this.formatter_ = config.formatter;
            _this.minValue_ = config.minValue;
            _this.maxValue_ = config.maxValue;
            _this.cursor_ = config.cursor;

            _this.cursor_.emitter.on('change', _this.onCursorChange_);

            var svgElem = document.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className('g'));

            _this.element.appendChild(svgElem);

            _this.svgElem_ = svgElem;
            var lineElem = document.createElementNS(SVG_NS, 'polyline');

            _this.svgElem_.appendChild(lineElem);

            _this.lineElem_ = lineElem;
            var tooltipElem = document.createElement('div');
            tooltipElem.classList.add(className('t'));

            _this.element.appendChild(tooltipElem);

            _this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('update', _this.onValueUpdate_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          Object.defineProperty(GraphMonitorView.prototype, "graphElement", {
            get: function () {
              if (!this.svgElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.svgElem_;
            },
            enumerable: true,
            configurable: true
          });

          GraphMonitorView.prototype.dispose = function () {
            this.lineElem_ = DisposingUtil.disposeElement(this.lineElem_);
            this.svgElem_ = DisposingUtil.disposeElement(this.svgElem_);
            this.tooltipElem_ = DisposingUtil.disposeElement(this.tooltipElem_);

            _super.prototype.dispose.call(this);
          };

          GraphMonitorView.prototype.update = function () {
            var tooltipElem = this.tooltipElem_;

            if (!this.lineElem_ || !this.svgElem_ || !tooltipElem) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var bounds = this.svgElem_.getBoundingClientRect(); // Graph

            var maxIndex = this.value.totalCount - 1;
            var min = this.minValue_;
            var max = this.maxValue_;
            this.lineElem_.setAttributeNS(null, 'points', this.value.rawValues.map(function (v, index) {
              var x = number_util_1.NumberUtil.map(index, 0, maxIndex, 0, bounds.width);
              var y = number_util_1.NumberUtil.map(v, min, max, bounds.height, 0);
              return [x, y].join(',');
            }).join(' ')); // Cursor

            var value = this.value.rawValues[this.cursor_.index];

            if (value === undefined) {
              tooltipElem.classList.remove(className('t', 'valid'));
              return;
            }

            tooltipElem.classList.add(className('t', 'valid'));
            var tx = number_util_1.NumberUtil.map(this.cursor_.index, 0, maxIndex, 0, bounds.width);
            var ty = number_util_1.NumberUtil.map(value, min, max, bounds.height, 0);
            tooltipElem.style.left = tx + "px";
            tooltipElem.style.top = ty + "px";
            tooltipElem.textContent = "" + this.formatter_.format(value);
          };

          GraphMonitorView.prototype.onValueUpdate_ = function () {
            this.update();
          };

          GraphMonitorView.prototype.onCursorChange_ = function () {
            this.update();
          };

          return GraphMonitorView;
        }(view_1.View);

        exports.GraphMonitorView = GraphMonitorView;
        /***/
      },

      /***/
      "./src/main/js/view/monitor/multi-log.ts":
      /*!***********************************************!*\
        !*** ./src/main/js/view/monitor/multi-log.ts ***!
        \***********************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('mll', 'monitor');
        /**
         * @hidden
         */

        var MultiLogMonitorView =
        /** @class */
        function (_super) {
          __extends(MultiLogMonitorView, _super);

          function MultiLogMonitorView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueUpdate_ = _this.onValueUpdate_.bind(_this);
            _this.formatter_ = config.formatter;

            _this.element.classList.add(className());

            var textareaElem = document.createElement('textarea');
            textareaElem.classList.add(className('i'));
            textareaElem.readOnly = true;

            _this.element.appendChild(textareaElem);

            _this.textareaElem_ = textareaElem;
            config.value.emitter.on('update', _this.onValueUpdate_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          MultiLogMonitorView.prototype.dispose = function () {
            this.textareaElem_ = DisposingUtil.disposeElement(this.textareaElem_);

            _super.prototype.dispose.call(this);
          };

          MultiLogMonitorView.prototype.update = function () {
            var _this = this;

            var elem = this.textareaElem_;

            if (!elem) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
            elem.textContent = this.value.rawValues.map(function (value) {
              return _this.formatter_.format(value);
            }).join('\n');

            if (shouldScroll) {
              elem.scrollTop = elem.scrollHeight;
            }
          };

          MultiLogMonitorView.prototype.onValueUpdate_ = function () {
            this.update();
          };

          return MultiLogMonitorView;
        }(view_1.View);

        exports.MultiLogMonitorView = MultiLogMonitorView;
        /***/
      },

      /***/
      "./src/main/js/view/monitor/single-log.ts":
      /*!************************************************!*\
        !*** ./src/main/js/view/monitor/single-log.ts ***!
        \************************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ../view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('sgl', 'monitor');
        /**
         * @hidden
         */

        var SingleLogMonitorView =
        /** @class */
        function (_super) {
          __extends(SingleLogMonitorView, _super);

          function SingleLogMonitorView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onValueUpdate_ = _this.onValueUpdate_.bind(_this);
            _this.formatter_ = config.formatter;

            _this.element.classList.add(className());

            var inputElem = document.createElement('input');
            inputElem.classList.add(className('i'));
            inputElem.readOnly = true;
            inputElem.type = 'text';

            _this.element.appendChild(inputElem);

            _this.inputElem_ = inputElem;
            config.value.emitter.on('update', _this.onValueUpdate_);
            _this.value = config.value;

            _this.update();

            return _this;
          }

          SingleLogMonitorView.prototype.dispose = function () {
            this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);

            _super.prototype.dispose.call(this);
          };

          SingleLogMonitorView.prototype.update = function () {
            if (!this.inputElem_) {
              throw pane_error_1.PaneError.alreadyDisposed();
            }

            var values = this.value.rawValues;
            this.inputElem_.value = values.length > 0 ? this.formatter_.format(values[values.length - 1]) : '';
          };

          SingleLogMonitorView.prototype.onValueUpdate_ = function () {
            this.update();
          };

          return SingleLogMonitorView;
        }(view_1.View);

        exports.SingleLogMonitorView = SingleLogMonitorView;
        /***/
      },

      /***/
      "./src/main/js/view/root.ts":
      /*!**********************************!*\
        !*** ./src/main/js/view/root.ts ***!
        \**********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var DisposingUtil = __webpack_require__(
        /*! ../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");

        var view_1 = __webpack_require__(
        /*! ./view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('rot');
        /**
         * @hidden
         */

        var RootView =
        /** @class */
        function (_super) {
          __extends(RootView, _super);

          function RootView(document, config) {
            var _this = _super.call(this, document) || this;

            _this.onFolderChange_ = _this.onFolderChange_.bind(_this);
            _this.folder_ = config.folder;

            if (_this.folder_) {
              _this.folder_.emitter.on('change', _this.onFolderChange_);
            }

            _this.element.classList.add(className());

            var folder = _this.folder_;

            if (folder) {
              var titleElem = document.createElement('button');
              titleElem.classList.add(className('t'));
              titleElem.textContent = folder.title;

              _this.element.appendChild(titleElem);

              var markElem = document.createElement('div');
              markElem.classList.add(className('m'));
              titleElem.appendChild(markElem);
              _this.titleElem_ = titleElem;
            }

            var containerElem = document.createElement('div');
            containerElem.classList.add(className('c'));

            _this.element.appendChild(containerElem);

            _this.containerElem_ = containerElem;

            _this.applyModel_();

            return _this;
          }

          Object.defineProperty(RootView.prototype, "titleElement", {
            get: function () {
              return this.titleElem_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(RootView.prototype, "containerElement", {
            get: function () {
              if (!this.containerElem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.containerElem_;
            },
            enumerable: true,
            configurable: true
          });

          RootView.prototype.dispose = function () {
            this.containerElem_ = DisposingUtil.disposeElement(this.containerElem_);
            this.folder_ = null;
            this.titleElem_ = DisposingUtil.disposeElement(this.titleElem_);

            _super.prototype.dispose.call(this);
          };

          RootView.prototype.applyModel_ = function () {
            var expanded = this.folder_ ? this.folder_.expanded : true;
            var expandedClass = className(undefined, 'expanded');

            if (expanded) {
              this.element.classList.add(expandedClass);
            } else {
              this.element.classList.remove(expandedClass);
            } // TODO: Animate

          };

          RootView.prototype.onFolderChange_ = function () {
            this.applyModel_();
          };

          return RootView;
        }(view_1.View);

        exports.RootView = RootView;
        /***/
      },

      /***/
      "./src/main/js/view/separator.ts":
      /*!***************************************!*\
        !*** ./src/main/js/view/separator.ts ***!
        \***************************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        var __extends = this && this.__extends || function () {
          var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf || {
              __proto__: []
            } instanceof Array && function (d, b) {
              d.__proto__ = b;
            } || function (d, b) {
              for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };

            return extendStatics(d, b);
          };

          return function (d, b) {
            extendStatics(d, b);

            function __() {
              this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
        }();

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var class_name_1 = __webpack_require__(
        /*! ../misc/class-name */
        "./src/main/js/misc/class-name.ts");

        var view_1 = __webpack_require__(
        /*! ./view */
        "./src/main/js/view/view.ts");

        var className = class_name_1.ClassName('spt');
        /**
         * @hidden
         */

        var SeparatorView =
        /** @class */
        function (_super) {
          __extends(SeparatorView, _super);

          function SeparatorView(document) {
            var _this = _super.call(this, document) || this;

            _this.element.classList.add(className());

            var hrElem = document.createElement('hr');
            hrElem.classList.add(className('r'));

            _this.element.appendChild(hrElem);

            return _this;
          }

          return SeparatorView;
        }(view_1.View);

        exports.SeparatorView = SeparatorView;
        /***/
      },

      /***/
      "./src/main/js/view/view.ts":
      /*!**********************************!*\
        !*** ./src/main/js/view/view.ts ***!
        \**********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var DisposingUtil = __webpack_require__(
        /*! ../misc/disposing-util */
        "./src/main/js/misc/disposing-util.ts");

        var pane_error_1 = __webpack_require__(
        /*! ../misc/pane-error */
        "./src/main/js/misc/pane-error.ts");
        /**
         * @hidden
         */


        var View =
        /** @class */
        function () {
          function View(document) {
            this.disposed_ = false;
            this.doc_ = document;
            this.elem_ = this.doc_.createElement('div');
          }

          Object.defineProperty(View.prototype, "disposed", {
            get: function () {
              return this.disposed_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(View.prototype, "document", {
            get: function () {
              if (!this.doc_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.doc_;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(View.prototype, "element", {
            get: function () {
              if (!this.elem_) {
                throw pane_error_1.PaneError.alreadyDisposed();
              }

              return this.elem_;
            },
            enumerable: true,
            configurable: true
          });

          View.prototype.dispose = function () {
            this.doc_ = null;
            this.elem_ = DisposingUtil.disposeElement(this.elem_);
            this.disposed_ = true;
          };

          return View;
        }();

        exports.View = View;
        /***/
      },

      /***/
      "./src/main/sass/bundle.scss":
      /*!***********************************!*\
        !*** ./src/main/sass/bundle.scss ***!
        \***********************************/

      /*! no static exports found */

      /***/
      function (module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(
        /*! ../../../node_modules/css-loader/lib/css-base.js */
        "./node_modules/css-loader/lib/css-base.js")(false); // imports
        // module

        exports.push([module.i, ".tp-fldv_t,.tp-rotv_t{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--folder-background-color);color:var(--folder-foreground-color);cursor:pointer;display:block;height:24px;line-height:24px;overflow:hidden;padding-left:30px;position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%}.tp-fldv_t:hover,.tp-rotv_t:hover{background-color:var(--folder-background-color-hover)}.tp-fldv_t:focus,.tp-rotv_t:focus{background-color:var(--folder-background-color-focus)}.tp-fldv_t:active,.tp-rotv_t:active{background-color:var(--folder-background-color-active)}.tp-fldv_m,.tp-rotv_m{background:linear-gradient(to left, var(--folder-foreground-color), var(--folder-foreground-color) 2px, transparent 2px, transparent 4px, var(--folder-foreground-color) 4px);border-radius:2px;bottom:0;content:'';display:block;height:6px;left:12px;margin:auto;position:absolute;top:0;-webkit-transform:rotate(90deg);transform:rotate(90deg);-webkit-transition:-webkit-transform 0.2s ease-in-out;transition:-webkit-transform 0.2s ease-in-out;transition:transform 0.2s ease-in-out;transition:transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;width:6px}.tp-fldv.tp-fldv-expanded .tp-fldv_m,.tp-rotv.tp-rotv-expanded .tp-rotv_m{-webkit-transform:none;transform:none}.tp-fldv_c>.tp-fldv:first-child,.tp-rotv_c>.tp-fldv:first-child{margin-top:-4px}.tp-fldv_c>.tp-fldv:last-child,.tp-rotv_c>.tp-fldv:last-child{margin-bottom:-4px}.tp-fldv_c>*+*,.tp-rotv_c>*+*{margin-top:4px}.tp-fldv_c>.tp-fldv+.tp-fldv,.tp-rotv_c>.tp-fldv+.tp-fldv{margin-top:0}.tp-fldv_c>.tp-sptv+.tp-sptv,.tp-rotv_c>.tp-sptv+.tp-sptv{margin-top:0}.tp-btnv{padding:0 4px}.tp-btnv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--button-background-color);border-radius:2px;color:var(--button-foreground-color);cursor:pointer;display:block;font-weight:bold;height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.tp-btnv_b:hover{background-color:var(--button-background-color-hover)}.tp-btnv_b:focus{background-color:var(--button-background-color-focus)}.tp-btnv_b:active{background-color:var(--button-background-color-active)}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv_t{-webkit-transition:border-radius 0.2s ease-in-out 0.2s;transition:border-radius 0.2s ease-in-out 0.2s}.tp-fldv.tp-fldv-expanded .tp-fldv_t{-webkit-transition:border-radius 0s;transition:border-radius 0s}.tp-fldv_c{border-left:var(--folder-background-color) solid 4px;box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;-webkit-transition:height 0.2s ease-in-out, opacity 0.2s linear, padding 0.2s ease-in-out;transition:height 0.2s ease-in-out, opacity 0.2s linear, padding 0.2s ease-in-out}.tp-fldv_t:hover+.tp-fldv_c{border-left-color:var(--folder-background-color-hover)}.tp-fldv_t:focus+.tp-fldv_c{border-left-color:var(--folder-background-color-focus)}.tp-fldv_t:active+.tp-fldv_c{border-left-color:var(--folder-background-color-active)}.tp-fldv.tp-fldv-expanded .tp-fldv_c{opacity:1;overflow:visible;padding-bottom:4px;padding-top:4px;-webkit-transform:none;transform:none;-webkit-transition:height 0.2s ease-in-out, opacity 0.2s linear 0.2s, padding 0.2s ease-in-out;transition:height 0.2s ease-in-out, opacity 0.2s linear 0.2s, padding 0.2s ease-in-out}.tp-ckbiv_l{display:block;position:relative}.tp-ckbiv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background:red;left:0;opacity:0;position:absolute;top:0}.tp-ckbiv_m{background-color:var(--input-background-color);border-radius:2px;cursor:pointer;display:block;height:20px;position:relative;width:20px}.tp-ckbiv_m::before{background-color:var(--input-foreground-color);border-radius:2px;bottom:4px;content:'';display:block;left:4px;opacity:0;position:absolute;right:4px;top:4px}.tp-ckbiv_i:hover+.tp-ckbiv_m{background-color:var(--input-background-color-hover)}.tp-ckbiv_i:focus+.tp-ckbiv_m{background-color:var(--input-background-color-focus)}.tp-ckbiv_i:active+.tp-ckbiv_m{background-color:var(--input-background-color-active)}.tp-ckbiv_i:checked+.tp-ckbiv_m::before{opacity:1}.tp-clpiv{background-color:var(--base-background-color);border-radius:6px;box-shadow:0 2px 4px var(--base-shadow-color);display:none;padding:4px;position:relative;visibility:hidden;z-index:1000}.tp-clpiv.tp-clpiv-expanded{display:block;visibility:visible}.tp-clpiv_hsv{display:-webkit-box;display:flex}.tp-clpiv_h{margin-left:4px}.tp-clpiv_rgb{display:-webkit-box;display:flex;margin-top:4px}.tp-hpliv{border-radius:2px;overflow:hidden;position:relative}.tp-hpliv_c{cursor:crosshair;display:block;height:80px;width:20px}.tp-hpliv_m{border-radius:100%;border:rgba(255,255,255,0.75) solid 1px;box-shadow:0 1px 2px rgba(0,0,0,0.1);height:4px;left:50%;margin-left:-3px;margin-top:-3px;pointer-events:none;position:absolute;width:4px}.tp-svpiv{border-radius:2px;overflow:hidden;position:relative}.tp-svpiv_c{cursor:crosshair;display:block;height:80px;width:100%}.tp-svpiv_m{border-radius:100%;border:rgba(255,255,255,0.75) solid 1px;box-shadow:0 1px 2px rgba(0,0,0,0.1);height:4px;margin-left:-3px;margin-top:-3px;pointer-events:none;position:absolute;width:4px}.tp-lstiv{display:block;padding:0;position:relative}.tp-lstiv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--button-background-color);border-radius:2px;color:var(--button-foreground-color);cursor:pointer;display:block;height:20px;line-height:20px;padding:0 4px;width:100%}.tp-lstiv_s:hover{background-color:var(--button-background-color-hover)}.tp-lstiv_s:focus{background-color:var(--button-background-color-focus)}.tp-lstiv_s:active{background-color:var(--button-background-color-active)}.tp-lstiv_m{border-color:var(--button-foreground-color) transparent transparent;border-style:solid;border-width:3px;bottom:0;box-sizing:border-box;height:6px;margin:auto;pointer-events:none;position:absolute;right:6px;top:3px;width:6px}.tp-rgbtxtiv{display:-webkit-box;display:flex}.tp-rgbtxtiv_l{color:var(--label-foreground-color);display:inline;line-height:20px;margin-right:8px}.tp-rgbtxtiv_w{display:-webkit-box;display:flex}.tp-rgbtxtiv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:20px;line-height:20px;width:100%;-webkit-box-flex:1;flex:1;padding:0 4px;width:100%}.tp-rgbtxtiv_i:hover{background-color:var(--input-background-color-hover)}.tp-rgbtxtiv_i:focus{background-color:var(--input-background-color-focus)}.tp-rgbtxtiv_i:active{background-color:var(--input-background-color-active)}.tp-rgbtxtiv_i:nth-child(1){border-bottom-right-radius:0;border-top-right-radius:0}.tp-rgbtxtiv_i:nth-child(2){border-radius:0}.tp-rgbtxtiv_i:nth-child(3){border-bottom-left-radius:0;border-top-left-radius:0}.tp-rgbtxtiv_i+.tp-rgbtxtiv_i{margin-left:1px}.tp-p2dpadiv{background-color:var(--base-background-color);border-radius:6px;box-shadow:0 2px 4px var(--base-shadow-color);display:none;padding:4px 4px 4px 28px;position:relative;visibility:hidden;z-index:1000}.tp-p2dpadiv.tp-p2dpadiv-expanded{display:block;visibility:visible}.tp-p2dpadiv_p{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:20px;line-height:20px;width:100%;cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpadiv_p:hover{background-color:var(--input-background-color-hover)}.tp-p2dpadiv_p:focus{background-color:var(--input-background-color-focus)}.tp-p2dpadiv_p:active{background-color:var(--input-background-color-active)}.tp-p2dpadiv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpadiv_ax{stroke:var(--input-guide-color)}.tp-p2dpadiv_l{stroke:var(--input-foreground-color);stroke-linecap:round;stroke-dasharray:1px 3px}.tp-p2dpadiv_m{fill:var(--input-foreground-color)}.tp-p2dpadtxtiv{display:-webkit-box;display:flex;position:relative}.tp-p2dpadtxtiv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--button-background-color);border-radius:2px;color:var(--button-foreground-color);cursor:pointer;display:block;font-weight:bold;height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:20px;position:relative;width:20px}.tp-p2dpadtxtiv_b:hover{background-color:var(--button-background-color-hover)}.tp-p2dpadtxtiv_b:focus{background-color:var(--button-background-color-focus)}.tp-p2dpadtxtiv_b:active{background-color:var(--button-background-color-active)}.tp-p2dpadtxtiv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dpadtxtiv_p{left:-4px;position:absolute;right:-4px;top:20px}.tp-p2dpadtxtiv_t{margin-left:4px}.tp-p2dtxtiv{display:-webkit-box;display:flex}.tp-p2dtxtiv_w{-webkit-box-align:center;align-items:center;display:-webkit-box;display:flex}.tp-p2dtxtiv_w:nth-child(1){margin-right:1px}.tp-p2dtxtiv_w:nth-child(2){margin-left:1px}.tp-p2dtxtiv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:20px;line-height:20px;width:100%;padding:0 4px;width:100%}.tp-p2dtxtiv_i:hover{background-color:var(--input-background-color-hover)}.tp-p2dtxtiv_i:focus{background-color:var(--input-background-color-focus)}.tp-p2dtxtiv_i:active{background-color:var(--input-background-color-active)}.tp-p2dtxtiv_w:nth-child(1) .tp-p2dtxtiv_i{border-top-right-radius:0;border-bottom-right-radius:0}.tp-p2dtxtiv_w:nth-child(2) .tp-p2dtxtiv_i{border-top-left-radius:0;border-bottom-left-radius:0}.tp-sldiv{display:block;padding:0}.tp-sldiv_o{box-sizing:border-box;cursor:pointer;height:20px;margin:0 6px;position:relative}.tp-sldiv_o::before{background-color:var(--input-background-color);border-radius:1px;bottom:0;content:'';display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldiv_i{height:100%;left:0;position:absolute;top:0}.tp-sldiv_i::before{background-color:var(--button-background-color);border-radius:2px;bottom:0;content:'';display:block;height:12px;margin:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldiv_o:hover .tp-sldiv_i::before{background-color:var(--button-background-color-hover)}.tp-sldiv_o:focus .tp-sldiv_i::before{background-color:var(--button-background-color-focus)}.tp-sldiv_o:active .tp-sldiv_i::before{background-color:var(--button-background-color-active)}.tp-txtiv{display:block;padding:0}.tp-txtiv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:20px;line-height:20px;width:100%;padding:0 4px}.tp-txtiv_i:hover{background-color:var(--input-background-color-hover)}.tp-txtiv_i:focus{background-color:var(--input-background-color-focus)}.tp-txtiv_i:active{background-color:var(--input-background-color-active)}.tp-cswiv_sw{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--input-background-color);border-radius:2px;box-sizing:border-box;color:var(--input-foreground-color);font-family:inherit;height:20px;line-height:20px;width:100%}.tp-cswiv_sw:hover{background-color:var(--input-background-color-hover)}.tp-cswiv_sw:focus{background-color:var(--input-background-color-focus)}.tp-cswiv_sw:active{background-color:var(--input-background-color-active)}.tp-cswiv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;cursor:pointer;display:block;height:20px;left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:20px}.tp-cswiv_b:focus::after{border:rgba(255,255,255,0.75) solid 2px;border-radius:2px;bottom:0;content:'';display:block;left:0;position:absolute;right:0;top:0}.tp-cswiv_p{left:-4px;position:absolute;right:-4px;top:20px}.tp-cswtxtiv{display:-webkit-box;display:flex;position:relative}.tp-cswtxtiv_s{-webkit-box-flex:0;flex-grow:0;flex-shrink:0;width:20px}.tp-cswtxtiv_t{-webkit-box-flex:1;flex:1;margin-left:4px}.tp-sldtxtiv{display:-webkit-box;display:flex}.tp-sldtxtiv_s{-webkit-box-flex:2;flex:2}.tp-sldtxtiv_t{-webkit-box-flex:1;flex:1;margin-left:4px}.tp-lblv{-webkit-box-align:center;align-items:center;display:-webkit-box;display:flex;padding-left:4px;padding-right:4px}.tp-lblv_l{color:var(--label-foreground-color);-webkit-box-flex:1;flex:1;-webkit-hyphens:auto;-ms-hyphens:auto;hyphens:auto;padding-left:4px;padding-right:16px}.tp-lblv_v{-webkit-box-flex:0;flex-grow:0;flex-shrink:0;width:160px}.tp-grpmv{display:block;padding:0;position:relative}.tp-grpmv_g{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--monitor-background-color);border-radius:2px;box-sizing:border-box;color:var(--monitor-foreground-color);height:20px;width:100%;display:block;height:60px}.tp-grpmv_g polyline{fill:none;stroke:var(--monitor-foreground-color);stroke-linejoin:round}.tp-grpmv_t{color:var(--monitor-foreground-color);font-size:0.9em;left:0;pointer-events:none;position:absolute;text-indent:4px;top:0;visibility:hidden}.tp-grpmv_t.tp-grpmv_t-valid{visibility:visible}.tp-grpmv_t::before{background-color:var(--monitor-foreground-color);border-radius:100%;content:'';display:block;height:4px;left:-2px;position:absolute;top:-2px;width:4px}.tp-sglmv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--monitor-background-color);border-radius:2px;box-sizing:border-box;color:var(--monitor-foreground-color);height:20px;width:100%;padding:0 4px}.tp-mllmv_i{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--monitor-background-color);border-radius:2px;box-sizing:border-box;color:var(--monitor-foreground-color);height:20px;width:100%;display:block;height:60px;line-height:20px;padding:0 4px;resize:none;white-space:pre}.tp-cswmv_sw{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0;background-color:var(--monitor-background-color);border-radius:2px;box-sizing:border-box;color:var(--monitor-foreground-color);height:20px;width:100%}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono,Source Code Pro,Menlo,Courier,monospace);--base-background-color: var(--tp-base-background-color, #2f3137);--base-shadow-color: var(--tp-base-shadow-color, rgba(0,0,0,0.2));--button-background-color: var(--tp-button-background-color, #adafb8);--button-background-color-active: var(--tp-button-background-color-active, #d6d7db);--button-background-color-focus: var(--tp-button-background-color-focus, #c8cad0);--button-background-color-hover: var(--tp-button-background-color-hover, #bbbcc4);--button-foreground-color: var(--tp-button-foreground-color, #2f3137);--folder-background-color: var(--tp-folder-background-color, rgba(200,202,208,0.1));--folder-background-color-active: var(--tp-folder-background-color-active, rgba(200,202,208,0.25));--folder-background-color-focus: var(--tp-folder-background-color-focus, rgba(200,202,208,0.2));--folder-background-color-hover: var(--tp-folder-background-color-hover, rgba(200,202,208,0.15));--folder-foreground-color: var(--tp-folder-foreground-color, #c8cad0);--input-background-color: var(--tp-input-background-color, rgba(200,202,208,0.15));--input-background-color-active: var(--tp-input-background-color-active, rgba(200,202,208,0.35));--input-background-color-focus: var(--tp-input-background-color-focus, rgba(200,202,208,0.25));--input-background-color-hover: var(--tp-input-background-color-hover, rgba(200,202,208,0.15));--input-foreground-color: var(--tp-input-foreground-color, #c8cad0);--input-guide-color: var(--tp-input-guide-color, rgba(47,49,55,0.5));--label-foreground-color: var(--tp-label-foreground-color, rgba(200,202,208,0.8));--monitor-background-color: var(--tp-monitor-background-color, rgba(24,24,27,0.5));--monitor-foreground-color: var(--tp-monitor-foreground-color, rgba(200,202,208,0.7));--separator-color: var(--tp-separator-color, rgba(24,24,27,0.3));background-color:var(--base-background-color);border-radius:6px;box-shadow:0 2px 4px var(--base-shadow-color);font-family:var(--font-family);font-size:11px;font-weight:500;text-align:left}.tp-rotv_t{border-bottom-left-radius:6px;border-bottom-right-radius:6px;border-top-left-radius:6px;border-top-right-radius:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_t{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv_m{-webkit-transition:none;transition:none}.tp-rotv_c{box-sizing:border-box;height:0;overflow:hidden;padding-bottom:0;padding-top:0}.tp-rotv_c>.tp-fldv:last-child .tp-fldv_c{border-bottom-left-radius:6px;border-bottom-right-radius:6px}.tp-rotv_c>.tp-fldv:last-child:not(.tp-fldv-expanded) .tp-fldv_t{border-bottom-left-radius:6px;border-bottom-right-radius:6px}.tp-rotv_c>.tp-fldv:first-child .tp-fldv_t{border-top-left-radius:6px;border-top-right-radius:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_c{height:auto;overflow:visible;padding-bottom:4px;padding-top:4px}.tp-sptv_r{background-color:var(--separator-color);border-width:0;display:block;height:4px;margin:0;width:100%}\n", ""]); // exports

        /***/
      }
      /******/

    })["default"]
  );
});
},{"process":"../node_modules/process/browser.js"}],"../src/utils/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scaleCanvas = scaleCanvas;
exports.getNDC = getNDC;
exports.isTouch = isTouch;

// scale canvas
function scaleCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1; // Get the size of the canvas in CSS pixels.

  var rect = canvas.getBoundingClientRect(); // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d'); // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.

  ctx.scale(dpr, dpr);
  return ctx;
} // normalized device coordinates from -1 to +1


function getNDC(pos) {
  var x = pos[0] / window.innerWidth * 2 - 1;
  var y = pos[1] / window.innerHeight * 2 - 1;
  return [x, y];
} // get touch device


function isTouch() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

  var mq = function mq(query) {
    return window.matchMedia(query).matches;
  };

  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  } // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH


  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}
},{}],"../src/base/Canvas2D.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _touches = _interopRequireDefault(require("touches"));

var _tweakpane = _interopRequireDefault(require("tweakpane"));

var _utils = require("../utils/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Canvas2D = /*#__PURE__*/function () {
  function Canvas2D(options) {
    var _this = this;

    _classCallCheck(this, Canvas2D);

    _defineProperty(this, "onMouseDown", function (evt, pos) {
      _this.mouse.pos = pos;
      _this.mouseNormalized.pos = (0, _utils.getNDC)(pos);
      _this.mouseDown = true;
      if (_this.onMousePress) _this.onMousePress();
    });

    _defineProperty(this, "onMouseMove", function (evt, pos) {
      _this.mouse.pos = pos;
      _this.mouseNormalized.pos = (0, _utils.getNDC)(pos);
    });

    _defineProperty(this, "onMouseUp", function (evt) {
      _this.mouseDown = false;
      if (_this.onMouseRelease) _this.onMouseRelease();
    });

    _defineProperty(this, "animate", function () {
      if (_this.isAnimating) {
        _this.animationFrame = requestAnimationFrame(_this.animate);
      } // get delta time


      var currentTime = Date.now();
      var dt = (currentTime - _this.lastTime) / 1000; // update time

      _this.lastTime = currentTime;
      _this.time += dt; // update mouse easing

      _this.mouse.eased[0] += (_this.mouse.pos[0] - _this.mouse.eased[0]) / _this.easeFactor;
      _this.mouse.eased[1] += (_this.mouse.pos[1] - _this.mouse.eased[1]) / _this.easeFactor;
      _this.mouseNormalized.eased[0] += (_this.mouseNormalized.pos[0] - _this.mouseNormalized.eased[0]) / _this.easeFactor;
      _this.mouseNormalized.eased[1] += (_this.mouseNormalized.pos[1] - _this.mouseNormalized.eased[1]) / _this.easeFactor;

      _this.update();

      _this.render(dt, _this.time);
    });

    _defineProperty(this, "onResize", function () {
      var rect = _this.canvas.getBoundingClientRect();

      _this.ctx = (0, _utils.scaleCanvas)(_this.canvas);
      _this.width = rect.width;
      _this.height = rect.height;
      _this.centerX = _this.width * 0.5;
      _this.centerY = _this.height * 0.5;
    });

    this.canvas = options.canvas;
    this.ctx = (0, _utils.scaleCanvas)(canvas);
    this.emitter = (0, _touches.default)(window, {
      target: this.canvas
    }).on('start', this.onMouseDown).on('move', this.onMouseMove).on('end', this.onMouseUp);
    this.time = 0;
    this.lastTime = Date.now();
    this.isAnimating = false;
    this.mouseDown = false;
    this.animationFrame = null;
    this.easeFactor = options.easeFactor || 10; // get canvas width

    var _rect = this.canvas.getBoundingClientRect();

    this.width = _rect.width;
    this.height = _rect.height;
    this.centerX = this.width * 0.5;
    this.centerY = this.height * 0.5;
    this.mouse = {
      pos: [this.width * 0.5, this.height * 0.5],
      eased: [this.width * 0.5, this.height * 0.5]
    };
    this.mouseNormalized = {
      pos: [0, 0],
      eased: [0, 0]
    };
    this.pane = new _tweakpane.default();
    this.pane.element.style.display = 'none';
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', function (evt) {
      var key = evt.keyCode;

      if ((key === 100 || key === 68) && evt.shiftKey) {
        var visible = _this.pane.element.style.display !== 'none';

        if (!visible) {
          _this.pane.element.style.display = 'block';
        } else {
          _this.pane.element.style.display = 'none';
        }
      }
    });
  }

  _createClass(Canvas2D, [{
    key: "start",
    value: function start() {
      this.isAnimating = true;
      this.lastTime = Date.now();
      this.animate();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isAnimating = false;
      cancelAnimationFrame(this.animationFrame);
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "render",
    value: function render(delta, time) {}
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.isAnimating = false;
      this.emitter.disable();
      this.pane.dispose();
      window.removeEventListener('resize', this.onResize);
    }
  }]);

  return Canvas2D;
}();

exports.default = Canvas2D;
},{"touches":"../node_modules/touches/index.js","tweakpane":"../node_modules/tweakpane/dist/tweakpane.js","../utils/utils":"../src/utils/utils.js"}],"../node_modules/seed-random/index.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);

},{}],"../node_modules/simplex-noise/simplex-noise.js":[function(require,module,exports) {
var define;
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.


 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
(function() {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;
    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    }
    else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }

  }
  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
      -1, 1, 0,
      1, -1, 0,

      -1, -1, 0,
      1, 0, 1,
      -1, 0, 1,

      1, 0, -1,
      -1, 0, -1,
      0, 1, 1,

      0, -1, 1,
      0, 1, -1,
      0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
      0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
      1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
      -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
      1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
      -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
      1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
      -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function(xin, yin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0 = 0; // Noise contributions from the three corners
      var n1 = 0;
      var n2 = 0;
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin) * F2; // Hairy factor for 2D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space
      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin
      var y0 = yin - Y0;
      // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.
      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1.0 + 2.0 * G2;
      // Work out the hashed gradient indices of the three simplex corners
      var ii = i & 255;
      var jj = j & 255;
      // Calculate the contribution from the three corners
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        var gi0 = permMod12[ii + perm[jj]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
      }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
      }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].
      return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function(xin, yin, zin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0, n1, n2, n3; // Noise contributions from the four corners
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
      var Y0 = j - t;
      var Z0 = k - t;
      var x0 = xin - X0; // The x,y,z distances from the cell origin
      var y0 = yin - Y0;
      var z0 = zin - Z0;
      // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
      // Determine which simplex we are in.
      var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
      var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // X Y Z order
        else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // X Z Y order
        else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // Z X Y order
      }
      else { // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Y Z X order
        else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // Y X Z order
      }
      // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
      // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
      // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
      // c = 1/6.
      var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
      var y1 = y0 - j1 + G3;
      var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3;
      // Work out the hashed gradient indices of the four simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      // Calculate the contribution from the four corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]
      return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function(x, y, z, w) {
      var perm = this.perm;
      var grad4 = this.grad4;

      var n0, n1, n2, n3, n4; // Noise contributions from the five corners
      // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
      var s = (x + y + z + w) * F4; // Factor for 4D skewing
      var i = Math.floor(x + s);
      var j = Math.floor(y + s);
      var k = Math.floor(z + s);
      var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4; // Factor for 4D unskewing
      var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
      var Y0 = j - t;
      var Z0 = k - t;
      var W0 = l - t;
      var x0 = x - X0; // The x,y,z,w distances from the cell origin
      var y0 = y - Y0;
      var z0 = z - Z0;
      var w0 = w - W0;
      // For the 4D case, the simplex is a 4D shape I won't even try to describe.
      // To find out which of the 24 possible simplices we're in, we need to
      // determine the magnitude ordering of x0, y0, z0 and w0.
      // Six pair-wise comparisons are performed between each possible pair
      // of the four coordinates, and the results are used to rank the numbers.
      var rankx = 0;
      var ranky = 0;
      var rankz = 0;
      var rankw = 0;
      if (x0 > y0) rankx++;
      else ranky++;
      if (x0 > z0) rankx++;
      else rankz++;
      if (x0 > w0) rankx++;
      else rankw++;
      if (y0 > z0) ranky++;
      else rankz++;
      if (y0 > w0) ranky++;
      else rankw++;
      if (z0 > w0) rankz++;
      else rankw++;
      var i1, j1, k1, l1; // The integer offsets for the second simplex corner
      var i2, j2, k2, l2; // The integer offsets for the third simplex corner
      var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
      // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
      // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
      // impossible. Only the 24 indices which have non-zero entries make any sense.
      // We use a thresholding to set the coordinates in turn from the largest magnitude.
      // Rank 3 denotes the largest coordinate.
      i1 = rankx >= 3 ? 1 : 0;
      j1 = ranky >= 3 ? 1 : 0;
      k1 = rankz >= 3 ? 1 : 0;
      l1 = rankw >= 3 ? 1 : 0;
      // Rank 2 denotes the second largest coordinate.
      i2 = rankx >= 2 ? 1 : 0;
      j2 = ranky >= 2 ? 1 : 0;
      k2 = rankz >= 2 ? 1 : 0;
      l2 = rankw >= 2 ? 1 : 0;
      // Rank 1 denotes the second smallest coordinate.
      i3 = rankx >= 1 ? 1 : 0;
      j3 = ranky >= 1 ? 1 : 0;
      k3 = rankz >= 1 ? 1 : 0;
      l3 = rankw >= 1 ? 1 : 0;
      // The fifth corner has all coordinate offsets = 1, so no need to compute that.
      var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4;
      // Work out the hashed gradient indices of the five simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255;
      // Calculate the contribution from the five corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;
      else {
        var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      }
      // Sum up and scale the result to cover the range [-1,1]
      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    return p;
  }
  SimplexNoise._buildPermutationTable = buildPermutationTable;

  function alea() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    var mash = masher();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(arguments[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(arguments[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    return function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }
  function masher() {
    var n = 0xefc8249d;
    return function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  }

  // amd
  if (typeof define !== 'undefined' && define.amd) define(function() {return SimplexNoise;});
  // common js
  if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
  // browser
  else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
  // nodejs
  if (typeof module !== 'undefined') {
    module.exports = SimplexNoise;
  }

})();

},{}],"../node_modules/defined/index.js":[function(require,module,exports) {
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"../src/utils/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _createRandom;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var seedRandom = require('seed-random');

var SimplexNoise = require('simplex-noise');

var defined = require('defined');

function _createRandom(defaultSeed) {
  defaultSeed = defined(defaultSeed, null);
  var defaultRandom = Math.random;
  var currentSeed;
  var currentRandom;
  var noiseGenerator;
  var _nextGaussian = null;
  var _hasNextGaussian = false;
  setSeed(defaultSeed);
  return {
    value: value,
    createRandom: function createRandom(defaultSeed) {
      return _createRandom(defaultSeed);
    },
    setSeed: setSeed,
    getSeed: getSeed,
    getRandomSeed: getRandomSeed,
    valueNonZero: valueNonZero,
    permuteNoise: permuteNoise,
    noise1D: noise1D,
    noise2D: noise2D,
    noise3D: noise3D,
    noise4D: noise4D,
    sign: sign,
    boolean: boolean,
    chance: chance,
    range: range,
    rangeFloor: rangeFloor,
    pick: pick,
    shuffle: shuffle,
    onCircle: onCircle,
    insideCircle: insideCircle,
    onSphere: onSphere,
    insideSphere: insideSphere,
    quaternion: quaternion,
    weighted: weighted,
    weightedSet: weightedSet,
    weightedSetIndex: weightedSetIndex,
    gaussian: gaussian
  };

  function setSeed(seed, opt) {
    if (typeof seed === 'number' || typeof seed === 'string') {
      currentSeed = seed;
      currentRandom = seedRandom(currentSeed, opt);
    } else {
      currentSeed = undefined;
      currentRandom = defaultRandom;
    }

    noiseGenerator = createNoise();
    _nextGaussian = null;
    _hasNextGaussian = false;
  }

  function value() {
    return currentRandom();
  }

  function valueNonZero() {
    var u = 0;

    while (u === 0) {
      u = value();
    }

    return u;
  }

  function getSeed() {
    return currentSeed;
  }

  function getRandomSeed() {
    var seed = String(Math.floor(Math.random() * 1000000));
    return seed;
  }

  function createNoise() {
    return new SimplexNoise(currentRandom);
  }

  function permuteNoise() {
    noiseGenerator = createNoise();
  }

  function noise1D(x, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, 0);
  }

  function noise2D(x, y, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
  }

  function noise3D(x, y, z, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise3D(x * frequency, y * frequency, z * frequency);
  }

  function noise4D(x, y, z, w, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise4D(x * frequency, y * frequency, z * frequency, w * frequency);
  }

  function sign() {
    return boolean() ? 1 : -1;
  }

  function boolean() {
    return value() > 0.5;
  }

  function chance(n) {
    n = defined(n, 0.5);
    if (typeof n !== 'number') throw new TypeError('expected n to be a number');
    return value() < n;
  }

  function range(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return value() * (max - min) + min;
  }

  function rangeFloor(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(range(min, max));
  }

  function pick(array) {
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }

  function shuffle(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Expected Array, got ' + _typeof(arr));
    }

    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();

    while (len) {
      rand = Math.floor(value() * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }

    return ret;
  }

  function onCircle(radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var theta = value() * 2.0 * Math.PI;
    out[0] = radius * Math.cos(theta);
    out[1] = radius * Math.sin(theta);
    return out;
  }

  function insideCircle(radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    onCircle(1, out);
    var r = radius * Math.sqrt(value());
    out[0] *= r;
    out[1] *= r;
    return out;
  }

  function onSphere(radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var phi = u;
    var theta = Math.acos(v);
    out[0] = radius * Math.sin(theta) * Math.cos(phi);
    out[1] = radius * Math.sin(theta) * Math.sin(phi);
    out[2] = radius * Math.cos(theta);
    return out;
  }

  function insideSphere(radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var k = value();
    var phi = u;
    var theta = Math.acos(v);
    var r = radius * Math.cbrt(k);
    out[0] = r * Math.sin(theta) * Math.cos(phi);
    out[1] = r * Math.sin(theta) * Math.sin(phi);
    out[2] = r * Math.cos(theta);
    return out;
  }

  function quaternion(out) {
    out = out || [];
    var u1 = value();
    var u2 = value();
    var u3 = value();
    var sq1 = Math.sqrt(1 - u1);
    var sq2 = Math.sqrt(u1);
    var theta1 = Math.PI * 2 * u2;
    var theta2 = Math.PI * 2 * u3;
    var x = Math.sin(theta1) * sq1;
    var y = Math.cos(theta1) * sq1;
    var z = Math.sin(theta2) * sq2;
    var w = Math.cos(theta2) * sq2;
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  function weightedSet(set) {
    set = set || [];
    if (set.length === 0) return null;
    return set[weightedSetIndex(set)].value;
  }

  function weightedSetIndex(set) {
    set = set || [];
    if (set.length === 0) return -1;
    return weighted(set.map(function (s) {
      return s.weight;
    }));
  }

  function weighted(weights) {
    weights = weights || [];
    if (weights.length === 0) return -1;
    var totalWeight = 0;
    var i;

    for (i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    if (totalWeight <= 0) throw new Error('Weights must sum to > 0');
    var random = value() * totalWeight;

    for (i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }

      random -= weights[i];
    }

    return 0;
  }

  function gaussian(mean, standardDerivation) {
    mean = defined(mean, 0);
    standardDerivation = defined(standardDerivation, 1); // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496

    if (_hasNextGaussian) {
      _hasNextGaussian = false;
      var result = _nextGaussian;
      _nextGaussian = null;
      return mean + standardDerivation * result;
    } else {
      var v1 = 0;
      var v2 = 0;
      var s = 0;

      do {
        v1 = value() * 2 - 1; // between -1 and 1

        v2 = value() * 2 - 1; // between -1 and 1

        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);

      var multiplier = Math.sqrt(-2 * Math.log(s) / s);
      _nextGaussian = v2 * multiplier;
      _hasNextGaussian = true;
      return mean + standardDerivation * (v1 * multiplier);
    }
  }
}
},{"seed-random":"../node_modules/seed-random/index.js","simplex-noise":"../node_modules/simplex-noise/simplex-noise.js","defined":"../node_modules/defined/index.js"}],"../src/utils/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.clamp01 = clamp01;
exports.lerp = lerp;
exports.inverseLerp = inverseLerp;
exports.smoothstep = smoothstep;
exports.toFinite = toFinite;
exports.expandVector = expandVector;
exports.lerpArray = lerpArray;
exports.newArray = newArray;
exports.linspace = linspace;
exports.lerpFrames = lerpFrames;
exports.mod = mod;
exports.degToRad = degToRad;
exports.radToDeg = radToDeg;
exports.fract = fract;
exports.sign = sign;
exports.pingPong = pingPong;
exports.damp = damp;
exports.dampArray = dampArray;
exports.mapRange = mapRange;
exports.norm = norm;
exports.distance = distance;
exports.distanceXY = distanceXY;
exports.circleCollision = circleCollision;
exports.circlePointCollision = circlePointCollision;
exports.inRange = inRange;
exports.pointInRect = pointInRect;
exports.rangeIntersect = rangeIntersect;
exports.rectIntersect = rectIntersect;

var _defined = _interopRequireDefault(require("defined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EPSILON = Number.EPSILON;

function clamp(value, min, max) {
  return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
}

function clamp01(v) {
  return clamp(v, 0, 1);
}

function lerp(min, max, t) {
  return min * (1 - t) + max * t;
}

function inverseLerp(min, max, t) {
  if (Math.abs(min - max) < EPSILON) return 0;else return (t - min) / (max - min);
}

function smoothstep(min, max, t) {
  var x = clamp(inverseLerp(min, max, t), 0, 1);
  return x * x * (3 - 2 * x);
}

function toFinite(n, defaultValue) {
  defaultValue = (0, _defined.default)(defaultValue, 0);
  return typeof n === 'number' && isFinite(n) ? n : defaultValue;
}

function expandVector(dims) {
  if (typeof dims !== 'number') throw new TypeError('Expected dims argument');
  return function (p, defaultValue) {
    defaultValue = (0, _defined.default)(defaultValue, 0);
    var scalar;

    if (p == null) {
      // No vector, create a default one
      scalar = defaultValue;
    } else if (typeof p === 'number' && isFinite(p)) {
      // Expand single channel to multiple vector
      scalar = p;
    }

    var out = [];
    var i;

    if (scalar == null) {
      for (i = 0; i < dims; i++) {
        out[i] = toFinite(p[i], defaultValue);
      }
    } else {
      for (i = 0; i < dims; i++) {
        out[i] = scalar;
      }
    }

    return out;
  };
}

function lerpArray(min, max, t, out) {
  out = out || [];

  if (min.length !== max.length) {
    throw new TypeError('min and max array are expected to have the same length');
  }

  for (var i = 0; i < min.length; i++) {
    out[i] = lerp(min[i], max[i], t);
  }

  return out;
}

function newArray(n, initialValue) {
  n = (0, _defined.default)(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  var out = [];

  for (var i = 0; i < n; i++) {
    out.push(initialValue);
  }

  return out;
}

function linspace(n, opts) {
  n = (0, _defined.default)(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  opts = opts || {};

  if (typeof opts === 'boolean') {
    opts = {
      endpoint: true
    };
  }

  var offset = (0, _defined.default)(opts.offset, 0);

  if (opts.endpoint) {
    return newArray(n).map(function (_, i) {
      return n <= 1 ? 0 : (i + offset) / (n - 1);
    });
  } else {
    return newArray(n).map(function (_, i) {
      return (i + offset) / n;
    });
  }
}

function lerpFrames(values, t, out) {
  t = clamp(t, 0, 1);
  var len = values.length - 1;
  var whole = t * len;
  var frame = Math.floor(whole);
  var fract = whole - frame;
  var nextFrame = Math.min(frame + 1, len);
  var a = values[frame % values.length];
  var b = values[nextFrame % values.length];

  if (typeof a === 'number' && typeof b === 'number') {
    return lerp(a, b, fract);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return lerpArray(a, b, fract, out);
  } else {
    throw new TypeError('Mismatch in value type of two array elements: ' + frame + ' and ' + nextFrame);
  }
}

function mod(a, b) {
  return (a % b + b) % b;
}

function degToRad(n) {
  return n * Math.PI / 180;
}

function radToDeg(n) {
  return n * 180 / Math.PI;
}

function fract(n) {
  return n - Math.floor(n);
}

function sign(n) {
  if (n > 0) return 1;else if (n < 0) return -1;else return 0;
}

function pingPong(t, length) {
  t = mod(t, length * 2);
  return length - Math.abs(t - length);
}

function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

function dampArray(a, b, lambda, dt, out) {
  out = out || [];

  for (var i = 0; i < a.length; i++) {
    out[i] = damp(a[i], b[i], lambda, dt);
  }

  return out;
}

function mapRange(value, inputMin, inputMax, outputMin, outputMax, clamp) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < EPSILON) {
    return outputMin;
  } else {
    var outVal = (value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;

    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;else if (outVal < outputMin) outVal = outputMin;
      }
    }

    return outVal;
  }
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function distance(p0, p1) {
  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function distanceXY(x0, y0, x1, y1) {
  var dx = x1 - x0;
  var dy = y1 - y0;
  return Math.sqrt(dx * dx + dy * dy);
}

function circleCollision(c0, c1) {
  return distance(c0, c1) <= c0.radius + c1.radius;
}

function circlePointCollision(x, y, circle) {
  return distanceXY(x, y, circle.x, circle.y) < circle.radius;
}

function inRange(value, min, max) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

function pointInRect(x, y, rect) {
  return inRange(x, rect.x, rect.x + rect.width) && inRange(y, rect.y, rect.y + rect.height);
}

function rangeIntersect(min0, max0, min1, max1) {
  return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
}

function rectIntersect(r0, r1) {
  return rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
}
},{"defined":"../node_modules/defined/index.js"}],"../src/sketches/NoiseLines2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Canvas2D2 = _interopRequireDefault(require("../base/Canvas2D"));

var _random = _interopRequireDefault(require("../utils/random"));

var _math = require("../utils/math");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// tweakable params
var PARAMS = {
  timeScale: 0.2,
  numLines: 30,
  lineSegments: 250,
  amplitude: 0.5,
  frequencyMax: 0.0035,
  frequencyMin: 0.0015,
  noiseOffset: 0.02
}; // uncomment to create a noise instance

var rand = (0, _random.default)();
var palette = ['#590212', '#D9415D', '#F2507B', '#0D0D0D'];

var NoiseLines2 = /*#__PURE__*/function (_Canvas2D) {
  _inherits(NoiseLines2, _Canvas2D);

  var _super = _createSuper(NoiseLines2);

  function NoiseLines2(options) {
    var _this;

    _classCallCheck(this, NoiseLines2);

    _this = _super.call(this, options);

    _this.pane.addInput(PARAMS, 'timeScale', {
      min: 0,
      max: 1
    });

    _this.pane.addInput(PARAMS, 'numLines', {
      min: 1,
      max: 50,
      step: 1
    });

    _this.pane.addInput(PARAMS, 'lineSegments', {
      min: 2,
      max: 500,
      step: 1
    });

    _this.pane.addInput(PARAMS, 'noiseOffset', {
      min: 0,
      max: 0.3
    });

    _this.pane.addInput(PARAMS, 'frequencyMax', {
      min: 0,
      max: 0.01
    });

    _this.pane.addInput(PARAMS, 'frequencyMin', {
      min: 0,
      max: 0.01
    });

    _this.pane.addInput(PARAMS, 'amplitude', {
      min: 0,
      max: 1
    });

    _this.pane.addButton({
      title: 'Generate'
    }).on('click', function () {
      _this.createLines();
    });

    _this.createLines();

    _this.start();

    return _this;
  }

  _createClass(NoiseLines2, [{
    key: "createLines",
    value: function createLines() {
      this.lines = [];

      for (var i = 0; i < PARAMS.numLines; i++) {
        this.lines.push(this.createLine());
      }
    }
  }, {
    key: "createLine",
    value: function createLine() {
      var dist = this.width / PARAMS.lineSegments + 1;
      var line = {
        points: [],
        color: rand.pick(palette),
        width: rand.range(0.1, 0.5)
      };

      for (var i = 0; i < PARAMS.lineSegments; i++) {
        line.points.push({
          x: i * dist,
          y: this.centerY
        });
      }

      return line;
    }
  }, {
    key: "onMousePress",
    value: function onMousePress() {}
  }, {
    key: "onMouseRelease",
    value: function onMouseRelease() {}
  }, {
    key: "drawLine",
    value: function drawLine(line, num, time) {
      this.ctx.lineWidth = line.width;
      this.ctx.beginPath();
      var points = line.points;

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var n = rand.noise2D(p.x * this.frequency, time * PARAMS.timeScale + num * PARAMS.noiseOffset);
        p.y = this.centerY + n * this.amplitude;

        if (i === 0) {
          this.ctx.moveTo(p.x, p.y);
        }

        this.ctx.lineTo(p.x, p.y);
      }

      this.ctx.stroke();
    }
  }, {
    key: "render",
    value: function render(dt, time) {
      this.clear();
      var mouseX = this.mouseNormalized.eased[0];
      var mouseY = this.mouseNormalized.eased[1];
      this.frequency = (0, _math.mapRange)(mouseX, -1, 1, PARAMS.frequencyMin, PARAMS.frequencyMax);
      this.amplitude = (0, _math.mapRange)(mouseY, -1, 1, 0.1 * this.height, PARAMS.amplitude * this.height);

      for (var i = 0; i < this.lines.length; i++) {
        var line = this.lines[i];
        this.ctx.strokeStyle = line.color;
        this.drawLine(line, i, time);
      }
    }
  }]);

  return NoiseLines2;
}(_Canvas2D2.default);

exports.default = NoiseLines2;
},{"../base/Canvas2D":"../src/base/Canvas2D.js","../utils/random":"../src/utils/random.js","../utils/math":"../src/utils/math.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

var _NoiseLines = _interopRequireDefault(require("./sketches/NoiseLines2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector('#canvas');
new _NoiseLines.default({
  canvas: canvas
});
},{"./sketches/NoiseLines2":"../src/sketches/NoiseLines2.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53751" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/index.js"], null)
//# sourceMappingURL=/src.7ed060e2.js.map