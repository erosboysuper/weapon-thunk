import React, { useState, useEffect, useCallback } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Storage } from 'aws-amplify';
import originBackImage from './assets/background.jpg';
import './App.scss';

import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import SignUpPage from './pages/sign-up-page/sign-up-page.component';
import ContactUs from './pages/contactus/contactus.component';
import SignInPage from './pages/sign-in-page/sign-in-page.component';
import ForgotPassword from './pages/forgot-password/forgot-password.component';
import TermsAndConditionPage from './pages/term-condition-page/term-condition.component';
import { MDBIcon } from 'mdbreact';
import ResetPasswordPage from './pages/reset-password/reset-password.component';
import { getNotifications } from './redux/alerts/alerts.action';
import { getCurrentFontColors, getCurrentBackground } from './redux/colors/colors.action';
import { setLoadAlerts } from './redux/alerts/alerts.action';
import OldEnoughPage from './pages/old-enough-page/old-enough-page.component';
import LayOut from './Layout';
import { setIsOldEnough, setIsStartCountDown, setIsReloadCartItems, changeCheckOutStatus, changeTimerAction } from "./redux/user/user.action";
import { getReservedStatus, cancelReservation } from './redux/purchase-seats/purchase-seats.action';
import PrivacyPolicyPage from './pages/privacy-policy/privacy-policy.component';
import { getImageFromS3 } from './utils/services/s3';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useAlert } from 'react-alert';
import { logOutFunc } from './redux/api-config';

const App = ({ currentUser,
  isOldEnough,
  isStartCountDown,
  setIsStartCountDown,
  setIsReloadCartItems,
  isLoadingAlerts,
  isTableLoad,
  getNotifications,
  getCurrentFontColors,
  getCurrentBackground,
  setLoadAlerts,
  cancelReservation,
  getReservedStatus,
  isHideRefreshedTimer,
  changeTimer,
  changeCheckOutStatus,
  changeTimerAction
}) => {

  // just turn off age confirm page now

  // JSON.parse(localStorage.getItem("isOldEnough")) && setIsOldEnough(true);
  // setIsOldEnough(true);

  const alert = useAlert();

  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")) || null);

  const [currentBackImg, setCurrentBackImg] = useState(null);
  const [showTimerAgain, setShowTimerAgain] = useState({period: 300, isShow: false});

  useEffect(() => {
    async function loadColors() {
      setLoadAlerts(true);
      await getCurrentFontColors();
      const result = await getCurrentBackground();
      if (result && result.image_url) {
        const imgUrl = getImageFromS3(result.image_url);
        setCurrentBackImg(imgUrl);
      }

      // for showing timercountdown again when refresh the page

      const cartWebinars = JSON.parse(localStorage.getItem('cartItems'))?.filter( item => item?.type === "webinar");
      if (cartWebinars) {           
          const isHasWebinars = await getReservedStatus(cartWebinars[0]?.id);
          if ( isHasWebinars && isHasWebinars.is_reserved) {
            setShowTimerAgain({
              isShow: true,
              period: ((new Date(new Date(isHasWebinars.reserved_date).toString()).getTime() - new Date().getTime()) + 300000)/1000
            });
          }
      }    

      setLoadAlerts(false);
    }
    loadColors();
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_ACCEPT_JS_URL;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }

  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser === "noInfo")
        localStorage.setItem("userData", JSON.stringify(null));
      else
        localStorage.setItem("userData", JSON.stringify(currentUser));

      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, [currentUser]);

  useEffect(() => {
    async function loadData() {
      await getNotifications(JSON.parse(localStorage.getItem("userData")).id);
    }
    if (JSON.parse(localStorage.getItem("userData"))?.id)
      loadData();
  }, [userData]);

  useEffect(() => {
    !isHideRefreshedTimer && setShowTimerAgain({
      period: 300,
      isShow: false
    })
  }, [isHideRefreshedTimer]);

  useEffect(() => {
    async function load() {
      const cartWebinars = JSON.parse(localStorage.getItem('cartItems'))?.filter( item => item?.type === "webinar");

      if (cartWebinars && cartWebinars.length > 0) {           
          const isHasWebinars = await getReservedStatus(cartWebinars[0]?.id);
          if ( isHasWebinars && isHasWebinars.is_reserved) {
            setShowTimerAgain({
              isShow: true,
              period: ((new Date(new Date(isHasWebinars.reserved_date).toString()).getTime() - new Date().getTime()) + 300000)/1000
            });
          }
          changeTimerAction(null);
      }
      else{
        setShowTimerAgain({
          period: 300,
          isShow: false
        });
        changeTimerAction(null)
      }        
    }
    if (changeTimer) {
      load();
    }
  }, [changeTimer]);

  // for expiration timer countdown

  const renderTime = ({ remainingTime }) => {

    if (remainingTime === 3) 
      changeCheckOutStatus(true);

    if (remainingTime === 0) {
      setIsStartCountDown(false);
      setShowTimerAgain({period: 300, isShow: false});  
      let cancelItems = [];
      const cartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (cartItems && cartItems.length > 0) {
        cartItems.map(
          item => item.type === 'webinar' && cancelItems.push(item.id) 
        )
        if (cancelItems.length > 0) {   
          
          cancelReservation(cancelItems);
          
          alert.error("Your reserved seats are expired.");
          // const storedTimerID_map = JSON.parse(localStorage.getItem('timerId_map'));       
          // storedTimerID_map.map ( timer => {
          //     console.log("Timer ID:", timer.timer);
          //     clearTimeout(timer.timer);
          // });
          localStorage.setItem('cartItems', JSON.stringify(null));
          // localStorage.setItem('timerId_map', JSON.stringify(null));

          setIsReloadCartItems(true);

          
          
        }        
      }      
    }
  
    return (
      <div className="timer">
        <div className="value">{Math.floor(remainingTime / 60)}:{remainingTime % 60}</div>
       </div>
    );
  };

  return (
    <div className='App'>
      <div className="timer-wrapper">
        {
          (isStartCountDown || showTimerAgain.isShow) && <CountdownCircleTimer
          isPlaying
          size={60}
          strokeWidth={8}
          duration={showTimerAgain.period}
          colors={[["#0055cc", 0.7], ["#ddaa00", 0.2], ["#ee0000", 0.1]]}
          onComplete={() => [true, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
        }
      </div>
      <Header />      
      <div className="main-section" style={{backgroundImage:`url(${currentBackImg ? currentBackImg : originBackImage})`}}>
        {/* <div className="logo-background"> */}
          <Switch>
            <Route exact path='/signup' render={() => <SignUpPage />} />
            <Route exact path='/signin' render={() => <SignInPage />} />
            <Route exact path='/forgot-password' render={() => userData ? <Redirect to="/" /> : <ForgotPassword />} />
            <Route exact path='/resetpassword/:code/:userID' component={ResetPasswordPage} />
            <Route exact path='/contactus' render={() => isOldEnough ? <ContactUs /> : <OldEnoughPage />} />
            <Route exact path='/privacy_policy' render={() => isOldEnough ? <PrivacyPolicyPage /> : <OldEnoughPage />} />
            <Route exact path='/term_condition_page' render={() => isOldEnough ? <TermsAndConditionPage /> : <OldEnoughPage />} />
            {/* <Route exact path='/old-enough' component={OldEnoughPage} /> */}
            <Route path='/' render={() => isOldEnough ? <LayOut /> : <OldEnoughPage />} />
          </Switch>
        {/* </div> */}
      </div>
      <Footer />
      {
        (isLoadingAlerts || isTableLoad) && <div className="wait-loading">
          <MDBIcon className="loadIcon" icon="sync-alt" />
        </div>
      }
    </div>
  )
}

const MapStateToProps = ({ user: { currentUser, isOldEnough, isStartCountDown, isHideRefreshedTimer, changeTimer }, alerts: { isLoadingAlerts }, purchasedItems: { isTableLoad } }) => ({
  currentUser,
  isOldEnough,
  isStartCountDown,
  isLoadingAlerts,
  isTableLoad,
  isHideRefreshedTimer,
  changeTimer
})

const MapDispatchToProps = dispatch => ({
  getNotifications: getNotifications(dispatch),
  getCurrentFontColors: getCurrentFontColors(dispatch),
  getCurrentBackground: getCurrentBackground(dispatch),
  setLoadAlerts: flag => dispatch(setLoadAlerts(flag)),
  // setIsOldEnough: flag => dispatch(setIsOldEnough(flag)),
  setIsStartCountDown: flag => dispatch(setIsStartCountDown(flag)),
  setIsReloadCartItems: flag => dispatch(setIsReloadCartItems(flag)),
  cancelReservation: cancelReservation(dispatch),
  getReservedStatus: getReservedStatus(dispatch),
  changeCheckOutStatus: state => dispatch(changeCheckOutStatus(state)),
  changeTimerAction: id => dispatch(changeTimerAction(id))
})


export default connect(MapStateToProps, MapDispatchToProps)(App);

