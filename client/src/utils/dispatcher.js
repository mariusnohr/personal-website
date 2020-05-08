/**
 * Super simple dispatcher
 */

let listeners = [];

/**
 * Get a list of all current subscribers
 * with a specific name
 */
function getListeners(name) {
  return listeners.filter((listener) => {
    return listener.name === name;
  });
}

/**
 * Subscribe to an event handler with
 * a name and a function
 */
export function subscribe(name, func) {
  listeners.push({
    name,
    func,
  });
}

/**
 * Unsubscribe from an event handler
 * with a specific name and function
 */
export function unsubscribe(name, func) {
  listeners = listeners.filter((listener) => {
    return func !== listener.func;
  });
}

/**
 * Trigger an event handler
 */
export function trigger(name, ...params) {
  const list = getListeners(name);

  list.forEach((listener) => {
    const func = listener.func;
    func(...params);
  });
}
