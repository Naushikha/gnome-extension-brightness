import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import ScreenBrightnessPanelMenu from './ui/ScreenBrightnessPanelMenu.js';
import * as Log from './services/log.js';

var screenBrightnessPanelMenu;

export default class BrightnessExtension extends Extension {
    init() {
        Log.Log.log(`initializing,  version ${import.meta.version}`);
    }

    enable() {
        screenBrightnessPanelMenu = new ScreenBrightnessPanelMenu();
        Main.panel.addToStatusArea(
            'adjust_display_brightness',
            screenBrightnessPanelMenu,
        );
    }

    disable() {
        if (screenBrightnessPanelMenu) {
            screenBrightnessPanelMenu.destroy();
            screenBrightnessPanelMenu = null;
        }

        Log.Log.empty();
    }
}
