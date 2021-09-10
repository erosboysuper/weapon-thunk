import React, {Fragment} from 'react';
import './notification-select.style.scss';
import { connect } from 'react-redux'; 
import { MDBIcon } from 'mdbreact';
import { useState, useEffect } from 'react';

const NotificationSelect = ({title, isSMS, notif, handleChange, emailNotif, emailNotifChange, phoneNotif, phoneNotifChange, currentFontColors}) => {

    const [fontColor, setFontColor] = useState("#a3a3a3");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color) {
            const color = JSON.parse(currentFontColors.form_color);
            setFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]); 

    return (
        <div className="notification-select mb-4">
            <div className = "select-div" onClick={handleChange}>
                <span style={{color: fontColor}}>{title}</span>
                <MDBIcon icon="check" className={`${(emailNotif || phoneNotif) &&'checked'} checked-icon`}/>                          
            </div>
            {
                notif&&<Fragment>
                    <div className="border-1"></div>
                    <div className = "select-div sub" onClick={emailNotifChange}>
                        <span style={{color: fontColor}}>Get on email</span>
                        <MDBIcon icon="check" className={`${emailNotif&&'checked'} checked-icon`}/>                          
                    </div>
                    {
                        isSMS && <div>
                            <div className="border-2"></div>
                                <div className = "select-div sub" onClick={phoneNotifChange}>
                                    <span style={{color: fontColor}}>Get on phone</span>
                                    <MDBIcon icon="check" className={`${phoneNotif&&'checked'} checked-icon`}/>                          
                                </div>
                        </div>
                    }
                </Fragment>
            }

        </div>
    )
};

const MapStateToProps = ({colors: {currentFontColors}}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(NotificationSelect);

