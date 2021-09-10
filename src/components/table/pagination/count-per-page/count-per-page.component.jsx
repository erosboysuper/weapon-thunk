import React from 'react';
import './count-per-page.style.scss';
import { MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

const CountPerPage = ({options, showSelectBox, selectOption, optionShow, placeholder, currentFontColors}) => {

    const [formColor, setFormColor] = useState("white");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color) {
            const formColor = JSON.parse(currentFontColors.form_color);
            setFormColor(`rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`)
        }
    }, [currentFontColors]);

    return(
    <div className="count-per-page">
        <div className="form-select" onClick={showSelectBox}>
            <span className="label-span" style={{color: formColor}}>{placeholder}</span>
            <MDBIcon icon="caret-down" style={{color: formColor}} />
        </div>
        {
            optionShow&&<div className="option-div">
            {
                options.map( option => <div className="option-item" style={{color: formColor}} id={option} key={option} onClick={selectOption}>{option}</div>)
            }
        </div>
        }
    </div>
    )
};

const MapStateToProps = ({colors: {currentFontColors}}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(CountPerPage);