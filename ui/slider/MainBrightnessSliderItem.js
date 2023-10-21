import St from 'gi://St';
import GObject from 'gi://GObject';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';
import * as DDC from '../../services/ddc.js';
import * as Log from '../../services/log.js';
import * as Timer from '../../services/timer.js';
import LabeldSliderItem from './LabeldSliderItem.js';

export default class MainBrightnessSliderItem extends LabeldSliderItem {
    _init(value, sliders, params) {
        super._init(value, params);
        this.sliders = sliders;

        this.slider.connect('notify::value', (item) => {
            this._setAllValue(item._value);
        });
    }

    _setAllValue(value) {
        for (var s of this.sliders) {
            s.setValue(value);
        }
    }
}

GObject.registerClass(MainBrightnessSliderItem);
