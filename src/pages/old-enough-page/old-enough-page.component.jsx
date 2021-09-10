import React, { useState, useEffect } from 'react';
import './old-enough-page.style.scss';
import { connect } from 'react-redux';
import { setIsOldEnough } from "../../redux/user/user.action";

const OldEnoughPage = ({isOldEnough, setIsOldEnough, currentFontColors}) => {

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white"
    });

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`
            })
        }

    }, [currentFontColors]);

    return (
        <div className="old-enough-page">
            <p className="text-center" style={{color: fontColors.header1}}>I CERTIFY I AM 18 YEARS OR OLDER</p>
            <button onClick={()=>{
                localStorage.setItem("isOldEnough", JSON.stringify(true));
                setIsOldEnough(true);
            }}>CONFIRM</button>
        </div>
    )
}

const MapStateToProps = ({user: {isOldEnough}, colors: { currentFontColors }}) => ({
    isOldEnough,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    setIsOldEnough: flag => dispatch(setIsOldEnough(flag))
})

export default connect(MapStateToProps, MapDispatchToProps)(OldEnoughPage);