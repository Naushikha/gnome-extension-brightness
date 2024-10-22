import St from 'gi://St';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Log from '../services/log.js';
import * as MyShell from '../services/shell.js';
import * as DDC from '../services/ddc.js';
import * as Timer from '../services/timer.js';
import BrightnessSliderItem from './slider/BrightnessSliderItem.js';
import MainBrightnessSliderItem from './slider/MainBrightnessSliderItem.js';
import LogDialogBox from './dialog/LogDialogBox.js';
import InstallDDCUtilDialogBox from './dialog/InstallDDCUtilDialogBox.js';

export default class ScreenBrightnessPanelMenu extends PanelMenu.Button {
    _init() {
        super._init(Clutter.ActorAlign.FILL);
        this.sliders = [];
        this.mainSlider = null;
        this.displays = null;
        this.reloadButton = null;
        this.logButton = null;
        this.logDialog = null;
        this.installDDCUtilDialog = null;

        this.connect('destroy', () => {
            this._onDestroy();
        });
        this.extensionObject = Extension.lookupByURL(import.meta.url);
        var gicon = Gio.icon_new_for_string(
            this.extensionObject.path +
            '/ui/extension-display-brightness-symbolic.svg',
        );
        var icon = new St.Icon({gicon, style_class: 'system-status-icon'});
        this.add_child(icon);

        var iconLabel = new St.Label({
            style_class: 'helloworld-label', // add CSS label
            text: 'br',
        });
        this.add_child(iconLabel);
        this.populateMenu();

        Log.Log.log(`ScreenBrightnessPanelMenu init finished.`);
    }

    populateMenu() {
        this.menu.removeAll();
        this.sliders = [];
        this.mainSlider = null;

        try {
            this.displays = DDC.getDisplays();

            this.installDDCUtilButton = new PopupMenu.PopupMenuItem(
                'ddcutil is not installed',
            );
            if (this.displays) {
                this.addDisplaySliders();
            } else {
                Log.Log.log(
                    `ScreenBrightnessPanelMenu - ddcutil not installed.`,
                );
                this.installDDCUtilButton.connect('activate', (item) => {
                    this.installDDCUtilDialog = new InstallDDCUtilDialogBox();
                    this.installDDCUtilDialog.connect('destroy', () => {
                        this.installDDCUtilDialog = null;
                    });
                    this.installDDCUtilDialog.open(
                        global.get_current_time(),
                        true,
                    );
                });
                this.menu.addMenuItem(this.installDDCUtilButton);
            }
        } catch (error) {
            Log.Log.log(error.stack);
            this.displays = null;
        }

        this.logButton = new PopupMenu.PopupMenuItem('Show logging');
        this.logButton.connect('activate', (item) => {
            this.logDialog = new LogDialogBox();
            this.logDialog.connect('destroy', () => {
                this.logDialog = null;
            });
            this.logDialog.setText(Log.Log.toStringLastN(10));
            this.logDialog.open(global.get_current_time(), true);
        });

        this.reloadButton = new PopupMenu.PopupMenuItem('Reload displays');
        this.reloadButton.connect('activate', (item) => {
            this.populateMenu();
        });

        this.menu.addMenuItem(this.logButton);
        this.menu.addMenuItem(this.reloadButton);
    }

    addDisplaySliders() {
        if (Array.isArray(this.displays) && 0 < this.displays.length) {
            if (this.displays.length > 1) {
                var mainSliderValue =
                    this.displays[0].current / this.displays[0].max;

                if (this.mainSlider == null) {
                    this.mainSlider = new MainBrightnessSliderItem(
                        mainSliderValue,
                        this.sliders,
                        {},
                    );
                }

                this.menu.addMenuItem(this.mainSlider);
                this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            }

            for (var display of this.displays) {
                var slider = new BrightnessSliderItem(
                    display.bus,
                    display.name,
                    display.current,
                    display.max,
                    {},
                );
                this.sliders.push(slider);
                this.menu.addMenuItem(slider);
            }
        } else {
            this.menu.addMenuItem(
                new PopupMenu.PopupMenuItem('No monitors detected.', {
                    reactive: false,
                }),
            );
        }

        if (this.mainSlider != null) {
            this.connect('scroll-event', this.scrollEvent.bind(this));
        }
    }

    scrollEvent(actor, event) {
        let direction;
        switch (event.get_scroll_direction()) {
            case Clutter.ScrollDirection.UP:
                direction = 0.05;
                break;
            case Clutter.ScrollDirection.LEFT:
                direction = -0.05;
                break;
            case Clutter.ScrollDirection.DOWN:
                direction = -0.05;
                break;
            case Clutter.ScrollDirection.RIGHT:
                direction = 0.05;
                break;
            default:
                return Clutter.EVENT_STOP;
        }

        this.mainSlider.slider.value += direction;

        return Clutter.EVENT_STOP;
    }

    _onDestroy() {
        if (this.logDialog) {
            this.logDialog.destroy();
            this.logDialog = null;
        }
        if (this.installDDCUtilDialog) {
            this.installDDCUtilDialog.destroy();
            this.installDDCUtilDialog = null;
        }
    }
}

GObject.registerClass(ScreenBrightnessPanelMenu);
