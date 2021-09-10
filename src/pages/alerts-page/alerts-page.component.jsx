import React from 'react';
import './alerts-page.style.scss';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeReadItem, readNotifications, setLoadAlerts } from '../../redux/alerts/alerts.action';
import ReactTimeAgo from 'react-time-ago'
import { useState, useEffect } from 'react';
import NewProductAlertItem from './newProdAlertItem/newProdAlertItem.component';

const AlertsPage = ({ alertItems, removeReadItem, readNotifications, setLoadAlerts, currentFontColors }) => {

    const historyURL = useHistory();

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white",
        paragraph: "#a3a3a3"
    });

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color && currentFontColors.paragraph_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColors({
                header1: `rgba(${h1Color.r}, ${h1Color.g}, ${h1Color.b}, ${h1Color.a})`,
                header2: `rgba(${h2Color.r}, ${h2Color.g}, ${h2Color.b}, ${h2Color.a})`,
                paragraph: `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${pColor.a})`,
            })
        }
    }, [currentFontColors]);

    const handleChange = async (id, url) => {
        setLoadAlerts(true);
        const isSuccess = await readNotifications(id);
        if (isSuccess === "success") {
            removeReadItem(id);
            setLoadAlerts(false);
            if (url)
                historyURL.push(url);
        }
        else {
            setLoadAlerts(false);
            return;
        }
    };

    return (
        <MDBContainer>
            <div className="alerts-page">
                <p className="title" style={{ color: fontColors.header1 }}>Sold Out Webinar Products Alerts</p>
                <div className="alerts-container">
                    <MDBContainer>
                        <p className="font-weight-bolder" style={{ color: fontColors.header2 }}>Alerts</p>
                        {
                            alertItems.length > 0 ?
                                alertItems.map(alertItem => 
                                    alertItem.service_type === "webinar_start" ?
                                    
                                    <a href={alertItem.webinar_link} target="_blank">
                                    <NewProductAlertItem 
                                                key={alertItem.id} 
                                                label="has been started"
                                                alertItem={alertItem} 
                                                clickFunc1={() => handleChange(alertItem.id)} 
                                                clickFunc2={() => handleChange(alertItem.id)}
                                                fontColors={fontColors}/>
                                    </a>                      
                                    :
    
                                    alertItem.service_type === "new_product" ?

                                    <NewProductAlertItem 
                                    key={alertItem.id} 
                                    label="is newly added"
                                    alertItem={alertItem} 
                                    clickFunc1={() => handleChange(alertItem.id, `/products/${alertItem.product_type}/${alertItem.product_id}`)} 
                                    clickFunc2={() => handleChange(alertItem.id)}
                                    fontColors={fontColors}/>
                                    
                                    :

                                    <NewProductAlertItem 
                                    key={alertItem.id} 
                                    label="You are selected as the winner" 
                                    alertItem={alertItem} 
                                    clickFunc1={() => handleChange(alertItem.id)} 
                                    clickFunc2={() => handleChange(alertItem.id)}
                                    fontColors={fontColors}/>   
                                )
                                :
                                <h3 className="text-center font-weight-bolder" style={{ color: fontColors.header2 }}>No new notifications</h3>
                        }
                    </MDBContainer>
                </div>
            </div>
        </MDBContainer>
    )
};

const MapStateToProps = ({ alerts, colors: { currentFontColors } }) => ({
    alertItems: alerts.alertItems,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    removeReadItem: (id) => dispatch(removeReadItem(id)),
    readNotifications: readNotifications(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))
})


export default connect(MapStateToProps, MapDispatchToProps)(AlertsPage);