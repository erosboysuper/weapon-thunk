import React, { useEffect, useState } from 'react';
import './unsubscribe-page.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import { MDBRow, MDBCol } from 'mdbreact';
import { withRouter } from 'react-router-dom';
import { unsubscribeEmail } from '../../redux/user/user.action';

const UnsubscribePage = withRouter(({ currentFontColors, match, unsubscribeEmail }) => {

    const userID = match.params.userID;
    const alert = useAlert();

    const [fontColor, setFontColor] = useState("white");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color) {
            const hColor = JSON.parse(currentFontColors.header1_color);
            setFontColor(`rgba(${hColor.r}, ${hColor.g}, ${hColor.b}, ${hColor.a})`);
        }
    }, [currentFontColors]);

    const unsubcribeFunc = async event => {
        event.preventDefault();
        setIsLoading(true);
        const result = await unsubscribeEmail(userID);
        setIsLoading(false);
        if (result && result.message && result.message === 'success')
            alert.success("Unsubscribed successfully");
        else
            alert.error("Failed unsubscribing");
    }

    return (
  
            <MDBRow className="unsubscribe-page" center>
                <MDBCol middle size="11" sm="8" md="6" lg="4">
                    <form className="unsubscribe-form" onSubmit={unsubcribeFunc}>
                        <h3 className="text-center font-weight-bold mb-4" style={{ color: fontColor }}>You will no longer receive any emails from the website.</h3>
                        <br />
                        <FormButton type="submit" isLoading={isLoading}>UNSUBSCRIBE</FormButton>
                    </form>
                </MDBCol>
            </MDBRow>
 
    )
})

const MapStateToProps = ({ colors: { currentFontColors } }) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    unsubscribeEmail: unsubscribeEmail(dispatch)
})

export default connect(MapStateToProps, MapDispatchToProps)(UnsubscribePage);