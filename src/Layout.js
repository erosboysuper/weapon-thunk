import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import { Auth } from 'aws-amplify';
// import IdleTimer from 'react-idle-timer';
import { withRouter } from 'react-router';
// import InactivityPage from './pages/inactivity-page/inactivity-page.component';
import ProdcutDetailPage from './pages/product-detail/product-detail.component';
import PurchaseSeatsPage from './pages/purchase_seats/purchase_seats.component';
import BuyPhysicalProductPage from './pages/buy-physical-product/buy-physical.component';
import AlertsPage from './pages/alerts-page/alerts-page.component';
import MyaccountPage from './pages/myaccount-page/myaccount-page.component';
import FaqPage from './pages/faq-page/faq-page.component';
import PurchaseHistoryPage from './pages/purchase-history/purchase-history.component';
import MyCommentsPage from './pages/mycomments-page/mycomments-page.component';
import NoPageFound from './pages/404page/nopage.component';
// import { connect } from 'react-redux';
// import { delCurrentUser } from './redux/user/user.action';
import ProductPage from './pages/product-page/product-page.component';
import LandingPage from './pages/landing-page/landing.page';
import CheckOutSummaryPage from './pages/checkout-summary/checkout-summary.component';
import ShoppingCartPage from './pages/shopping-cart/shopping-cart.page';
import CheckOutForm from './components/payment-form/check-out-form/check-out-form.component';
import UnsubscribePage from './pages/unsubscribe/unsubscribe-page.component';

class LayOut extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            // timeout: 1000 * 60 * 15,
            // showModal: false,
            // userLoggedIn: false,
            // isTimedOut: false,
            userData: JSON.parse(localStorage.getItem("userData"))
        }

        // this.idleTimer = null;
        // this.onAction = this._onAction.bind(this);
        // this.onActive = this._onActive.bind(this);
        // this.onIdle = this._onIdle.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        // this.handleLogout = this.handleLogout.bind(this);
    }

    // _onAction(e) {
    //   this.setState({isTimedOut: false});
    // }
   
    // _onActive(e) {
    //   this.setState({isTimedOut: false});
    // }
   
    // async _onIdle(e) {
    //   const isTimedOut = this.state.isTimedOut;
    //   if (isTimedOut) {
    //     Auth.signOut();
    //     localStorage.removeItem('userData');
    //     this.props.delCurrentUser();     
    //     this.props.history.push('/signin');
    //   } else {
    //     if (JSON.parse(localStorage.getItem("userData"))){         
    //       this.setState({showModal: true});
    //       this.setState({timeout: 1000*55}, this.idleTimer.reset);
    //       this.setState({isTimedOut: true});  
    //     }
    //   }
      
    // }

    // handleClose() {
    //   this.setState({showModal: false});
    // }

    // async handleLogout() {
    //   this.setState({showModal: false});
    //   Auth.signOut();
    //   localStorage.removeItem('userData');
    //   this.props.delCurrentUser();      
    //   this.props.history.push('/signin');
    // }

    render(){
      const { match } = this.props;

      return(
        <>
          {/* <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} /> */}

            <div>
                <Switch>
                    <Route exact path = {`${match.path}`} render = {() => <LandingPage />} />
                    <Route exact path = {`${match.path}product`} render = {() => <ProductPage />} />     
                    <Route exact path = {`${match.path}unsubscribe/:userID`} render = {() => <UnsubscribePage />} />
                    <Route exact path = {`${match.path}shopping_cart`} render = {() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <ShoppingCartPage />} />               
                    <Route exact path = {`${match.path}products/:prodType/:id`} render = {() => <ProdcutDetailPage /> } />
                    <Route exact path = {`${match.path}purchase_seats/:id`} render = {() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <PurchaseSeatsPage />} />
                    <Route exact path = {`${match.path}buy_physical/:id`} render = {() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <BuyPhysicalProductPage />} />
                    <Route exact path = {`${match.path}checkout`} render = {() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <CheckOutForm/>} />
                    <Route exact path = {`${match.path}myaccount/my_profile`} render = { () => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <MyaccountPage/>} />
                    <Route exact path = {`${match.path}myaccount/purchase_history`} render = { () => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <PurchaseHistoryPage/>} />
                    <Route exact path = {`${match.path}myaccount/my_comments`} render = { () => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> :  <MyCommentsPage/> } />
                    <Route exact path = {`${match.path}faqs`} render ={() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <FaqPage/> } />
                    <Route exact path = {`${match.path}checkout_summary`} render ={() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <CheckOutSummaryPage/> } />                    
                    <Route exact path = {`${match.path}alerts_page`} render ={() => !JSON.parse(localStorage.getItem("userData")) ? <Redirect to="/signin" /> : <AlertsPage/> }/>
                    <Route component = {NoPageFound} />
                </Switch>                
               {/* {
                  this.state.showModal && <InactivityPage handleClose={this.handleClose} handleLogout={this.handleLogout}/>
               } */}
            </div>
        </>
      )
   }

 }

//  const MapDispatchToProps = dispatch => ({
//     delCurrentUser: () => dispatch(delCurrentUser()),
//  })
export default withRouter(LayOut);