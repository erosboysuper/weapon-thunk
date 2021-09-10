import React from 'react';
import './privacy-policy.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicyPage = ({currentFontColors}) => {

    const [fontColor, setFontColor] = useState({
        header1: "white",
        paragraph: "#a3a3a3"
    });

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.paragraph_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColor({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })
        }
    }, [currentFontColors]);

    return(
        <div className="privacy-policy-page">
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Policies</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Policies of Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Policies" />
                <meta
                itemprop="description"
                content="Policies of Mata's Tactical Supply"
                />
                {/* <meta
                itemprop="image"
                content=
                /> */}

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Policies" />
                <meta
                property="og:description"
                content="Policies of Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Policies" />
                <meta
                name="twitter:description"
                content="Policies of Mata's Tactical Supply"
                />
            </Helmet>
            <MDBRow className="title">
                <MDBCol bottom>
                    <p className="size33 text-center" style={{color: fontColor.header1}}>Policies</p>
                </MDBCol>
            </MDBRow>
            <div className="section-div">
                <h3 style={{color: fontColor.header1}}>Privacy Policy</h3>
                <div className="terms-div" style={{color: fontColor.paragraph}}>
                    We respect and are committed to protecting your privacy. We may collect personally identifiable information when you visit our site. We also automatically receive and record information on our server logs from your browser including your IP address, cookie information, and the page(s) you visited. We will not sell your personally identifiable information to anyone.
                </div>
            </div>
            <div className="section-div">
                <h3 style={{color: fontColor.header1}}>Refund Policy</h3>
                <div className="terms-div" style={{color: fontColor.paragraph}}>
                All payments are final and no refunds will be processed.
                </div>
            </div>
            <div className="section-div">
                <h3 style={{color: fontColor.header1}}>FFL disclaimer</h3>
                <div className="terms-div" style={{color: fontColor.paragraph}}>
                Mata’s Tactical Supply only ships firearms to FFL holders.
                </div>
            </div>      
        </div>
    )
};

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(PrivacyPolicyPage);