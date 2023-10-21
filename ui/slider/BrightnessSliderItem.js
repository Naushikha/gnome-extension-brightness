import St from 'gi://St';
import GObject from 'gi://GObject';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';
import * as DDC from '../../services/ddc.js';
import * as Log from '../../services/log.js';
import * as Timer from '../../services/timer.js';
import LabeldSliderItem from './LabeldSliderItem.js';

export default class BrightnessSliderItem extends LabeldSliderItem {
    _init(bus, name, current, max, params) {
        super._init('', params);

        this.connect('destroy', () => {
            this._onDestroy();
        });

        this.bus = bus;
        this.name = name;
        this.current = current;
        this.max = max;
        this.timeout = null;

        this.setValue(current / max);

        this.slider.connect('notify::value', (item) => {
            this._setBrightness(item._value);
        });

        this.display_label = new St.Label({
            style_class: 'helloworld-label', // add CSS label
            text: this.name,
        });
        this.add_child(this.display_label);
    }

    _ratioToBrightness(ratio) {
        return parseInt(ratio * this.max);
    }

    _setBrightness(sliderValue) {
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        }
        this.timeout = Timer.setTimeout(() => {
            var brightness = this._ratioToBrightness(sliderValue);
            DDC.setDisplayBrightness(this.bus, brightness);
        }, 500);
    }

    _onDestroy() {
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        }
    }
}

GObject.registerClass(BrightnessSliderItem);
