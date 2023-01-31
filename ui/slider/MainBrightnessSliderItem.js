const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const GObject = imports.gi.GObject;

const Me = ExtensionUtils.getCurrentExtension();
const DDC = Me.imports.services.ddc;
const Log = Me.imports.services.log;
const Timer = Me.imports.services.timer;
const LabeldSliderItem = Me.imports.ui.slider.LabeldSliderItem;


var MainBrightnessSliderItem = GObject.registerClass(class Main_BrightnessSliderItem extends LabeldSliderItem.LabeldSliderItem {  
    _init(value, sliders, params) {
        super._init(value, params);
        this.sliders = sliders;

        this.slider.connect('notify::value', (item) => {
              this._setAllValue(item._value)
        });
    }

    _setAllValue(value) {
        for (var s of this.sliders) {
           s.setValue(value);
        }
    }
});