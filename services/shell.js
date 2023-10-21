import GLib from 'gi://GLib';

const Decoder = new TextDecoder("utf-8");

export function exec(cmd) {
    try {
        let [, out] = GLib.spawn_command_line_sync(cmd);
        const response = Decoder.decode(out);
        return response;
    } catch (err) {
        return null;
    }
}

export function execAsync(cmd) {
    try {
        let [, out] = GLib.spawn_command_line_async(cmd);
        const response = Decoder.decode(out);
        return response;
    } catch (err) {
        return null;
    }
}
