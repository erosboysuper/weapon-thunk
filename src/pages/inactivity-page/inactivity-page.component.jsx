import React, {Fragment, useState, useEffect} from 'react';
import './inactivity-page.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import { MDBIcon, MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';

const InactivityPage = ({ handleClose, handleLogout, currentFontColors}) => {

    const [fontColors, setFontColors] = useState({
        header: "white",
        content: "#a3a3a3"
    });

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.paragraph_color) {
            const hColor = JSON.parse(currentFontColors.header1_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColors({
                header: `rgba(${hColor.r }, ${hColor.g }, ${hColor.b }, ${hColor.a })`,
                content: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })
        }
    }, [currentFontColors]);

    return (

        <Fragment>
            <div className="inactivity-page">
                <div className="inactivity-form">
                    <div className="icon-div">
                        <MDBIcon className="text-white" far icon="clock" />
                    </div>
                    <h2 className="text-center font-weight-bold mb-4" style={{color: fontColors.header}}>You have been logged out due to inactivity</h2>
                    <p className="text-center" style={{color: fontColors.content}}>You've been inactive for a while. For your security, we'll autometically sign out in approximately 1 minute. Choose "Stay Signed In" to continue or "Sign Out" if you are done. </p>
                    <MDBRow>
                        <MDBCol size="12" sm="6" md = "6">
                            <FormButton greyCol={true} onClickFunc={handleLogout}>SIGN OUT</FormButton>
                        </MDBCol>
                        <MDBCol size="12" sm="6" md = "6">
                            <FormButton onClickFunc={handleClose}>STAY SIGNED IN</FormButton>
                        </MDBCol>
                    </MDBRow>
                    
                    
                </div>
            </div>
        </Fragment>
        
    )
}

const MapStateToProps = ({colors: { currentFontColors }}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(InactivityPage);