import React, {useEffect} from 'react';
import './faq-page.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { getFaqItems } from '../../redux/faq-items/faq-items.action';
import FaqItemComponent from '../../components/faq-item/faq-item.component';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

const FaqPage = ({items, getFaqItems, setLoadAlerts, currentFontColors}) => {

    useEffect(() => {
        async function loadData() {
            setLoadAlerts(true);
            await getFaqItems();
            setLoadAlerts(false);
        }
        loadData();
    }, []);

    const [fontColor, setFontColor] = useState("white");
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color) {
            const color = JSON.parse(currentFontColors.header1_color);
            setFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]);

    return (
        <div className = 'faq-page'>
            <Helmet>
                <title>FAQ</title>
                <link rel="canonical" href={window.location.href} />
                <meta name="description" content="List of FAQ's" />
                <meta property="og:title" content="Mata's Tactical Supply" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:site_name" content="Mata's Tactical Supply" />
                <meta property="og:description" content="List of FAQ's" />
            </Helmet>
            <h2 className="text-center font-weight-bold" style={{color: fontColor}}>Frequently Asked Questions</h2>
            <MDBRow>
                <MDBCol size="12" sm="12" md="6" lg="6">
                    <MDBRow>
                    {
                        items && items.length > 0 && items.map( (item, i) => i%2 === 0 && <MDBCol size="12" key={item.id}>
                            <FaqItemComponent question={item.question} answer={item.answer}/>         
                        </MDBCol> )
                    }     
                    </MDBRow>
                </MDBCol>
                <MDBCol size="12" sm="12" md="6" lg="6">
                    <MDBRow>
                    {
                        items && items.length > 0 && items.map( (item, i) => i%2 === 1 && <MDBCol size="12" key={item.id}>
                            <FaqItemComponent question={item.question} answer={item.answer}/>         
                        </MDBCol> )
                    }     
                    </MDBRow>
                </MDBCol>                 
            </MDBRow>
        </div>
    )
};

const MapStateToProps = ({faq_items: {items}, colors: {currentFontColors}}) => ({
    items,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getFaqItems: getFaqItems(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})

export default connect(MapStateToProps, MapDispatchToProps)(FaqPage);