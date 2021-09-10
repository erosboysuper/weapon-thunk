import React from 'react';
import './form-select.style.scss';
import { MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const FormSelect = ({options, label, showSelectBox, selectOption, optionShow, placeholder, forPayment, isInvalid, currentFontColors, disabled}) => {
    
    const [formFontColor, setFormFontColor] = useState("#a3a3a3");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color)
        {
            const formColor = JSON.parse(currentFontColors.form_color);
            setFormFontColor(`rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`)
        }
    }, [currentFontColors]);

    return(
    <div className={`form-select-container ${forPayment === true && 'forPayment'}`}>
        <div className={`form-select ${forPayment === true && 'forPayment'} ${disabled && 'disabled'} ${isInvalid === true && 'red-outline'}`} onClick={showSelectBox}>
            <span className="label-span" style={{color: formFontColor}}>{placeholder}</span>
            <MDBIcon icon="chevron-down" className="select-down-icon" style={{color: formFontColor}}/>
        </div>
        {
            optionShow&&<div className="option-div">
                {
                    options.map( option => <div className="option-item" style={{
                        color: formFontColor
                    }} id={option} key={option} onClick={selectOption}>{option}</div>)
                }
            </div>
        }
        {
           label?
            (
                <label className = {`${ placeholder === "" ? "" : 'shrink'} form-input-label`}>
                    {label}
                </label>
            )
            : null
        }
    </div>
    )
};

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(FormSelect);