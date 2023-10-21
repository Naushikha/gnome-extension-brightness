import St from 'gi://St';
import GObject from 'gi://GObject';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';
import * as DDC from '../../services/ddc.js';
import * as Log from '../../services/log.js';
import * as Timer from '../../services/timer.js';

export default class LabeldSliderItem extends PopupMenu.PopupMenuItem {
    _init(sliderValue, params) {
        super._init('', params);

        this.slider = new Slider.Slider(sliderValue);
        this._updateSliderLabel(sliderValue);
        this.slider.connect('notify::value', (item) => {
            this._updateSliderLabel(item._value);
        });

        this.add(this.slider);
    }

    _updateSliderLabel(sliderValue) {
        this.label.text = parseInt(sliderValue * 100).toString();
    }

    setValue(sliderValue) {
        this.slider.value = sliderValue;
        this._updateSliderLabel(sliderValue);
    }
}

GObject.registerClass(LabeldSliderItem);
