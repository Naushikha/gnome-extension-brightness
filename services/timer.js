/**
 * Taken from: https://github.com/optimisme/gjs-examples/blob/master/assets/timers.js
 */

import GLib from 'gi://GLib';

export function setTimeout(func, millis, ...args) {
    let id = GLib.timeout_add(
        GLib.PRIORITY_DEFAULT,
        millis,
        () => {
            func(...args);
            return false; // Stop repeating
        }
    );

    return id;
}

export function clearTimeout(id) {
    GLib.source_remove(id);
}
