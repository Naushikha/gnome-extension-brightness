const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const GObject = imports.gi.GObject;

const Me = ExtensionUtils.getCurrentExtension();
const DDC = Me.imports.services.ddc;
const Timer = Me.imports.services.timer;

const LabeldSliderItem = GObject.registerClass(class Labeld_SliderItem extends PopupMenu.PopupMenuItem {  
    _init(sliderValue, params) {
        super._init("", params);

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

    setValue(sliderValue){
        this.slider.value = sliderValue;
        this._updateSliderLabel(sliderValue);
    }
});

const BrightnessSliderItem = GObject.registerClass(class Brightness_SliderItem extends LabeldSliderItem {  
    _init(bus, name, current, max, params) {
        super._init("", params);

        this.connect('destroy', this._onDestroy.bind(this));

        this.bus = bus;
        this.name = name;
        this.current = current;
        this.max = max;
        this.timeout = null;

        this.setValue(current / max);

        this.slider.connect('drag-end', (item) => {
              this._broadcastBrightness(item._value);
        });

        this.display_label = new St.Label({
                        style_class: 'helloworld-label', // add CSS label
                        text: this.name
                        });
        this.add_child(this.display_label);

    }


    setBrightness(percent) {
        this.setValue(percent);
        this._broadcastBrightness(percent);
        this._updateSliderLabel(percent);
    }

    _ratioToBrightness(ratio) {
        return parseInt(ratio * this.max);
    }

    _broadcastBrightness(sliderValue) {
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        }
        this.timeout = Timer.setTimeout(() => {
            const brightness = this._ratioToBrightness(sliderValue);
            log(`Set brightness ${brightness} on bus ${this.bus}`);
            DDC.setDisplayBrightness(this.bus, brightness);
        }, 500);
    }

    _onDestroy(){
        if (this.timeout) {
            Timer.clearTimeout(this.timeout);
        };
    }

});

const MainBrightnessSliderItem = GObject.registerClass(class Main_BrightnessSliderItem extends LabeldSliderItem {  
    _init(value, sliders, params) {
        super._init(value, params);
        this.sliders = sliders;

        this.slider.connect('drag-end', (item) => {
              this._setAllBrightness(item._value)
        });

        this.slider.connect('notify::value', (item) => {
              this._setAllValue(item._value)
        });
    }

    _setAllBrightness(value) {
        for (const s of this.sliders) {
           s.setBrightness(value);
        }
    }

    _setAllValue(value) {
        for (const s of this.sliders) {
           s.setValue(value);
        }
    }
});