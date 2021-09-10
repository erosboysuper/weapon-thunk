import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { hideAlerts } from '../../redux/alerts/alerts.action';
import { getSocialLinks } from '../../redux/others/others.action';
import './footer.style.scss';
import { MDBIcon, MDBRow, MDBCol } from 'mdbreact';
import { useState } from 'react';
import creative813 from './../../assets/creative813.png';

const Footer = ({hideAlerts, getSocialLinks, social_links, currentFontColors}) => {

    useEffect(() => {
       async function load() {
           await getSocialLinks();
       }
       load();
    }, []);

    const [footerColor, setFooterColor] = useState("#9e9e9e");
    const [footerBackColor, setFooterBackColor] = useState("#FFFFFF");

    useEffect(() => {
        if (currentFontColors && currentFontColors.footer_background_color){                      
            const backColor = JSON.parse(currentFontColors.footer_background_color);
            setFooterBackColor(`rgba(${backColor.r }, ${backColor.g }, ${backColor.b }, ${backColor.a })`);
        }
        if (currentFontColors && currentFontColors.footer_color){
            const color = JSON.parse(currentFontColors.footer_color);          
            setFooterColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);   
        }
    }, [currentFontColors]);

    return (
        <div className='footer-div' style={{backgroundColor: footerBackColor}}>
            <MDBRow between>
                <MDBCol middle size="12" md="6" xl="2" className="col text-center">
                <Link to='/' onClick={hideAlerts} style={{color: footerColor}}>&copy;<span className="hidden">Copyright</span>{new Date().getFullYear()}matas</Link>
                </MDBCol>
                <MDBCol middle size="12" md="6" xl="3" className="col text-center">
                <Link to='#' onClick={hideAlerts} style={{color: footerColor}}>MATA'S TACTICAL SUPPLY</Link>
                </MDBCol>
                {
                    social_links && <MDBCol middle size="12" xl="2" className="col text-center">
                        <a href={social_links.facebook_link} target="_blank"><MDBIcon fab icon="facebook-f" className="facebook-icon" style={{color: footerColor, borderColor: footerColor}}/></a>
                        <a href={social_links.instagram_link} target="_blank"><MDBIcon fab icon="instagram" className="instagram-icon" style={{color: footerColor, borderColor: footerColor}}/></a>
                    </MDBCol>
                }
                <MDBCol middle size="12" xl="3" className="col text-center">
                    <Link to='/privacy_policy' style={{color: footerColor}} onClick={hideAlerts}>Policies</Link>
                    <span className="dist-span" style={{color: footerColor}}>&nbsp;|&nbsp;</span>
                    <Link to='/term_condition_page' style={{color: footerColor}} onClick={hideAlerts}>Terms {'&'} Conditions</Link>
                    <span className="dist-span" style={{color: footerColor}}>&nbsp;|&nbsp;</span>
                    <Link to='/contactus' style={{color: footerColor}} onClick={hideAlerts}>Contact<span className="hidden"> Us</span></Link>        
                </MDBCol>
                <MDBCol middle size="12" xl="2" className="col text-center">
                    <a className="creativeLogo" href={`https://www.creative813.com/?utm_source=Mata's&utm_medium=Ref&utm_campaign=Matas%20Ref`} target="_blank"><span>Designed By</span><img src={creative813} /></a>
                </MDBCol>
            </MDBRow>
        </div>          
    )
};

const MapStateToProps = ({others: {social_links}, colors: {currentFontColors}}) => ({
    social_links,
    currentFontColors
})
const MapDispatchToProps = dispatch => ({
    hideAlerts: () => dispatch(hideAlerts()),
    getSocialLinks: getSocialLinks(dispatch)
})
export default connect(MapStateToProps, MapDispatchToProps)(Footer);