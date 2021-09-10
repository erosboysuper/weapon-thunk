import React, { Fragment, useState, useEffect } from 'react';
import logo from '../../assets/gun-logo.png';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './header.style.scss';
import { Auth } from 'aws-amplify';

import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from "mdbreact";

import { alertsShow, hideAlerts, getNotifications } from '../../redux/alerts/alerts.action';
import { delCurrentUser, setIsStartCountDown, setHideRefreshedTimer } from '../../redux/user/user.action';
import { getBannerTemporary } from '../../redux/colors/colors.action';
import { cancelReservation } from '../../redux/purchase-seats/purchase-seats.action';
import NotificationAlerts from '../alerts/alerts.component';

const Header = ({ isShow, alertItems, alertsToggle, hideAlerts, getNotifications, delCurrentUser, currentFontColors, getBannerTemporary, cancelReservation, setIsStartCountDown, setHideRefreshedTimer }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));

    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState({ webinar: false, product: false, myaccount: false, faqs: false, cart: false });
    const urlHistory = useHistory();
    const [flag, setFlag] = useState(-1);    // for 2 minutes setInterval

    useEffect(() => {

        if (urlHistory.location.pathname.indexOf("/faqs") > -1)
            setActiveItem({ webinar: false, product: false, myaccount: false, faqs: true, cart: false });
        else if (urlHistory.location.pathname.indexOf("/myaccount") > -1)
            setActiveItem({ webinar: false, product: false, myaccount: true, faqs: false, cart: false });
        else if (urlHistory.location.pathname.indexOf("/shopping_cart") > -1)
            setActiveItem({ webinar: false, product: false, myaccount: false, faqs: false, cart: true });
        else{
            if( urlHistory.location.state && urlHistory.location.state.prodType === "webinar")
                setActiveItem({ webinar: true, product: false, myaccount: false, faqs: false, cart: false });
            else if( urlHistory.location.state && urlHistory.location.state.prodType === "physical")
                setActiveItem({ webinar: false, product: true, myaccount: false, faqs: false, cart: false });
            else
                setActiveItem({ webinar: false, product: false, myaccount: false, faqs: false, cart: false });
        }
            
    }, [urlHistory.location]);

    const [hideAlert, setHideAlert] = useState({
        isShow: false,
        connect: "We’re sorry but there is a temporary issue with the website. We will be back soon!"
    });

    useEffect(() => {
        async function load() {
            const bannerSetting = await getBannerTemporary();
            bannerSetting?.banner_option && setHideAlert({
                isShow: bannerSetting.banner_option, 
                connect: bannerSetting?.banner_text ? bannerSetting?.banner_text : hideAlert.content})
        }
        load();

        if (userData) {   
            // for get notification every 2 minutes
            if (flag < 0) {
                setFlag(setInterval(async () => {
                    if (JSON.parse(localStorage.getItem("userData"))) {
                        await getNotifications(userData.id);
                    }                                                  
                }, 120*1000));
            }
        }
    }, []);

    const [menuFontColor, setMenuFontColor] = useState("#3F729B");
    const [menuBackColor, setMenuBackColor] = useState("#FFFFFF");

    useEffect(() => {
        if (currentFontColors && currentFontColors.menu_color){          
            const color = JSON.parse(currentFontColors.menu_color);           
            setMenuFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);           
        }
        if (currentFontColors && currentFontColors.header_background_color){           
            const backColor = JSON.parse(currentFontColors.header_background_color);
            setMenuBackColor(`rgba(${backColor.r }, ${backColor.g }, ${backColor.b }, ${backColor.a })`);
        }
            
    }, [currentFontColors]);

    const cancelReservedItems = () => {
        let cancelItems = [];
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems && cartItems.length > 0) {
            cartItems.map(
                item => item.type === 'webinar' && cancelItems.push(item.id) 
            )
            if (cancelItems.length > 0)
                cancelReservation(cancelItems);
        }
        localStorage.removeItem('cartItems');
    }

    return (
        <Fragment>
            {hideAlert.isShow && <div className='webSiteDownAlert' onClick= {(e) => setHideAlert({...hideAlert, isShow: false})}>
                <p>{hideAlert.connect}</p>
            </div>}
            <MDBNavbar className='customNav sticky-top' style={{backgroundColor: menuBackColor}} light expand="md">
                <MDBNavbarBrand href="/" onClick={hideAlerts}>
                    <img src={logo} alt="Mata's Tactical Supply" />
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={() => setIsOpen(!isOpen)} />
                <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
                    <MDBNavbarNav right>
                        {
                            JSON.parse(localStorage.getItem("userData")) ?
                                <MDBNavItem className="alerts-nav">
                                    <MDBNavLink to='#' className='notification-div' onClick={()=>{                                        
                                        !isShow && urlHistory?.location?.state && localStorage.setItem('prodType', JSON.stringify(urlHistory?.location?.state))
                                        alertsToggle();
                                    }}>
                                        <MDBIcon className='notification-bell' far icon="bell" style={{color: menuFontColor}} />
                                        {
                                            alertItems.length > 0 && <button className='notification-button'>{alertItems.length}</button>
                                        }
                                    </MDBNavLink>
                                    {
                                        isShow && <div className="alerts-container">
                                            <NotificationAlerts alertItems={alertItems} toggleMenu={() => window.innerWidth < 600 && setIsOpen(!isOpen)}/>
                                        </div>
                                    }
                                </MDBNavItem>
                                :
                                null
                        }
                        <MDBNavItem onClick={()=> {
                            window.innerWidth < 600 && setIsOpen(!isOpen)                            
                            urlHistory.push("/product", {prodType: "webinar"});
                        }}>
                            <MDBNavLink to="#" className={`${activeItem.webinar && 'actived'} menu-item`}  onClick={()=> {
                                hideAlerts();                                
                            }}><span style={{color: menuFontColor}}>Webinars</span></MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem onClick={()=> {
                            window.innerWidth < 600 && setIsOpen(!isOpen);
                            urlHistory.push("/product", {prodType: "physical"});
                        }}>
                            <MDBNavLink to="#" className={`${activeItem.product && 'actived'} menu-item`}  onClick={()=> {
                                hideAlerts();                                
                            }}><span style={{color: menuFontColor}}>Products</span></MDBNavLink>
                        </MDBNavItem>
                        {
                            JSON.parse(localStorage.getItem("userData")) &&  <MDBNavItem onClick={()=>{
                                window.innerWidth < 600 && setIsOpen(!isOpen);
                                urlHistory.push("/shopping_cart");
                            }}>
                                <MDBNavLink to="#" className={`${activeItem.cart && 'actived'} menu-item`}  onClick={()=> {
                                    hideAlerts();                                
                                }}><span style={{color: menuFontColor}}>Cart</span></MDBNavLink>
                            </MDBNavItem>
                        }
                        <MDBNavItem>
                            <MDBDropdown >
                                <MDBDropdownToggle nav className={`${activeItem.myaccount && 'actived'} menu-item`} onClick={()=> !userData && urlHistory.push("/myaccount/my_profile")}>
                                    <span style={{color: menuFontColor}}>My Account</span>
                                </MDBDropdownToggle>
                                {
                                    userData && <MDBDropdownMenu >
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            window.innerWidth < 600 && setIsOpen(!isOpen);
                                            urlHistory.push("/myaccount/purchase_history");
                                        }}>
                                            <MDBIcon icon="cart-arrow-down" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>Purchase history</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            window.innerWidth < 600 && setIsOpen(!isOpen);
                                            urlHistory.push("/myaccount/my_profile");
                                        }}>
                                            <MDBIcon icon="user" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>My profile</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            window.innerWidth < 600 && setIsOpen(!isOpen);
                                            hideAlerts();
                                            urlHistory.push("/myaccount/my_comments");
                                        }}>
                                            <MDBIcon far icon="comments" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>My comments</span>
                                        </MDBDropdownItem>
                                        <MDBDropdownItem className="menu-subitem" onClick={() => {
                                            hideAlerts();
                                            setIsOpen(!isOpen);
                                            setIsStartCountDown(false);
                                            setHideRefreshedTimer();
                                            cancelReservedItems();
                                            Auth.signOut();
                                            localStorage.removeItem('userData');
                                            delCurrentUser();
                                            urlHistory.push("/");
                                        }}>
                                            <MDBIcon icon="sign-in-alt" style={{color: menuFontColor}}/>
                                            <span style={{color: menuFontColor}}>Log out</span>
                                        </MDBDropdownItem>
                                    </MDBDropdownMenu>
                                }
                            </MDBDropdown>
                        </MDBNavItem>

                        <MDBNavItem onClick={()=>{
                            window.innerWidth < 600 && setIsOpen(!isOpen)                            
                            urlHistory.push("/faqs");
                        }}>
                            <MDBNavLink to="#" className={`${activeItem.faqs && 'actived'} menu-item`} onClick={hideAlerts}><span style={{color: menuFontColor}}>FAQs</span></MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        </Fragment>
    )
};

const MapStateToProps = ({ alerts, colors: {currentFontColors} }) => ({
    isShow: alerts.isShow,
    alertItems: alerts.alertItems,
    currentFontColors
});

const MapDispatchToProps = dispatch => ({
    alertsToggle: () => dispatch(alertsShow()),
    hideAlerts: () => dispatch(hideAlerts()),
    getNotifications: getNotifications(dispatch),
    delCurrentUser: () => dispatch(delCurrentUser()),
    getBannerTemporary: getBannerTemporary(dispatch),
    cancelReservation: cancelReservation(dispatch),
    setIsStartCountDown: flag => dispatch(setIsStartCountDown(flag)),
    setHideRefreshedTimer: () => dispatch(setHideRefreshedTimer())
})

export default connect(MapStateToProps, MapDispatchToProps)(Header);