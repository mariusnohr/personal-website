/**
 * Dispatcher
 */

type Listener = (...params: unknown[]) => void;

const listeners: Record<string, Listener> = {};

/**
 * Subscribe with an ID and a function
 * Works the same way as global event dispatcher
 *
 * @param name ID of subscriber
 * @param func Function to call
 */
export function subscribe(name: string, func: Listener): void {
  listeners[name] = func;
}

/**
 * Trigger a function in the subscribed list
 * of elements
 *
 * @param name Name of the subscribed function
 * @param params Parameters to pass
 */
export function trigger(name: string, ...params: unknown[]): void {
  const func = listeners[name];

  if (func) {
    func(...params);
  }
}
