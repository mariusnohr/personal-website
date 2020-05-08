/**
 * Dispatcher
 */

const listeners = {};

/**
 * Subscribe with an ID and a function
 * Works the same way as global event dispatcher
 *
 * @param {String} name ID of subscriber
 * @param {Function} func Function to call
 */
export function subscribe(name, func) {
  listeners[name] = func;
}

/**
 * Trigger a function in the subscribed list
 * of elements
 *
 * @param {String} name Name of the subscribed function
 * @param  {...any} params Parameters to pass
 */
export function trigger(name, ...params) {
  const func = listeners[name];
  func(...params);
}
