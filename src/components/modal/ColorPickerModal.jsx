import { ChromePicker } from 'react-color';
import React, { useState } from 'react';

const ColorPickerModal = React.memo(({ color, handleColorChange, handleChangeFor, handleColorPaletModalVisiblity }) => {
    const [selectedColor, setSelectedColor] = useState(color);

    const handlePickerChange = (color_) => {
        setSelectedColor(color_.rgb);
    };

    const handleSave = () => {
        handleColorChange(handleChangeFor, selectedColor);
        handleColorPaletModalVisiblity();
    };

    return (
        <>
            <h2>Pick Color</h2>
            <div className='sketch-picker-div'>
                <ChromePicker
                    color={selectedColor}
                    onChange={handlePickerChange}
                    disableAlpha
                />
            </div>
            <button
                className='color-picker-save-button'
                onClick={handleSave}
            >
                Save
            </button>
        </>
    );
});

export default ColorPickerModal;
