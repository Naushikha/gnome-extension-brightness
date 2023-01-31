const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const GObject = imports.gi.GObject;

const Me = ExtensionUtils.getCurrentExtension();
const DDC = Me.imports.services.ddc;
const Log = Me.imports.services.log;
const Timer = Me.imports.services.timer;

var LabeldSliderItem = GObject.registerClass(class Labeld_SliderItem extends PopupMenu.PopupMenuItem {  
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
