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


var BrightnessSliderItem = GObject.registerClass(class Brightness_SliderItem extends LabeldSliderItem.LabeldSliderItem {  
    _init(bus, name, current, max, params) {
        super._init("", params);

        this.connect('destroy', () => {this._onDestroy()});

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
                        text: this.name
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

    _onDestroy(){
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        };
    }

});

