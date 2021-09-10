import React from 'react';
import './form-input.style.scss';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const FormInput = ({ handleChange, label, currentFontColors, ...otherProps}) => {

    const [fontColor, setFontColor] = useState("#a3a3a3");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color) {
            const color = JSON.parse(currentFontColors.form_color);
            setFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]);

    return (
        <div className = 'group'>
            <input className = {`${otherProps.changeEmail ? "red-outline" : ""} ${otherProps.isDisabled ? "disabled" : ""} form-input`} style={{color: fontColor}} onChange = {handleChange} {...otherProps} autoFocus = {otherProps.changeEmail} />
            {
            label?
                (
                    <label className = {`${ otherProps.value.length ? 'shrink' : '' } ${otherProps.changeEmail ? "red-label" : ""} form-input-label`}>
                        {label}
                    </label>
                )
                : null
            }
        </div>
    )
}

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(FormInput);