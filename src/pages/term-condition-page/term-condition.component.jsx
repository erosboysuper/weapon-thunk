import React from 'react';
import './term-condition.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { getTermsAndConditions } from '../../redux/others/others.action';
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { Helmet } from 'react-helmet';

const TermsAndConditionPage = ({currentFontColors, getTermsAndConditions, setLoadAlerts}) => {

    const [fontColor, setFontColor] = useState({
        header1: "white",
        header2: "white",
        paragraph: "#a3a3a3"
    });

    const [termsConditionsInfo, setTermsConditionsInfo] = useState({
        content: "",
        date: ""
    });

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color && currentFontColors.paragraph_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColor({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })
        }
        async function loadTerms() {
            setLoadAlerts(true);
            const result = await getTermsAndConditions();
            setLoadAlerts(false);
            if (result) {
                const customDate = new Date(result.updatedAt);
                Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const termsDate =  Date.shortMonths[customDate.getMonth()] + " " + customDate.getDate() + ", " + customDate.getFullYear();
                
                setTermsConditionsInfo({
                    content: result.terms,
                    date: termsDate
                })
            }                
        }
        loadTerms();
    }, [currentFontColors]);

    return(
        <div className="term-condition-page">
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Terms and Conditions</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Terms and Conditions of Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Terms and Conditions" />
                <meta
                itemprop="description"
                content="Terms and Conditions of Mata's Tactical Supply"
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Terms and Conditions" />
                <meta
                property="og:description"
                content="Terms and Conditions of Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Terms and Conditions" />
                <meta
                name="twitter:description"
                content="Terms and Conditions of Mata's Tactical Supply"
                />          
            </Helmet>
            <MDBRow className="title">
                <MDBCol bottom size="12" sm="12" md="6" lg="6">
                    <p className="size33" style={{color: fontColor.header1}}>Terms &#38; Conditions</p>
                </MDBCol>
                <MDBCol bottom size="12" sm="12" md="6" lg="6">
                    <p className="font-weight-bold text-right" style={{color: fontColor.header2}}>Last Revised: <span style={{color: fontColor.paragraph}}>{termsConditionsInfo.date}</span></p>
                </MDBCol>
            </MDBRow>
            <div className="section-div">
                <div className="terms-div" style={{color: fontColor.paragraph}}>
                    {termsConditionsInfo.content}
                </div>
            </div>            
        </div>
    )
};

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getTermsAndConditions: getTermsAndConditions(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))

})

export default connect(MapStateToProps, MapDispatchToProps)(TermsAndConditionPage);