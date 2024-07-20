import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import * as Log from '../../services/log.js';

export default class LogDialogBox extends ModalDialog.ModalDialog {
    _init() {
        super._init({styleClass: 'extension-dialog'});

        this.setButtons([
            {
                label: 'OK',
                action: () => {
                    this._onClose();
                },
                key: Clutter.KEY_Escape,
            },
            {
                label: 'Copy to clipboard',
                action: () => {
                    this._copyToClipBoard();
                },
                key: Clutter.KEY_Tab,
            },
        ]);

        var box = new St.BoxLayout({vertical: true});

        var gicon = new Gio.FileIcon({
            file: Gio.file_new_for_path('./icons/icon.png'),
        });
        var icon = new St.Icon({gicon: gicon});
        box.add_child(icon);

        this.label = new St.Label({
            text: '',
            x_align: Clutter.ActorAlign.CENTER,
            style_class: 'title-label',
        });

        box.add_child(this.label);

        this.contentLayout.add_child(box);
    }

    setText(text) {
        this.label.text = text;
    }

    _onClose() {
        this.close(global.get_current_time());
    }

    _copyToClipBoard() {
        St.Clipboard.get_default().set_text(
            St.ClipboardType.CLIPBOARD,
            Log.Log.toString(),
        );
        this.close(global.get_current_time());
    }
}

GObject.registerClass(LogDialogBox);
