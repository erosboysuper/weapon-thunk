import React, {Fragment} from 'react';
import './purchase_seats.style.scss';
import { connect } from 'react-redux';
import { MDBIcon, MDBRow, MDBCol } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { useState, useEffect } from 'react';
import CheckOutForm from '../../components/payment-form/check-out-form/check-out-form.component';
import { getReservedStatus, 
        getPurchaseSeatsArray, 
        setSeatsReserved, 
        cancelReservation } from '../../redux/purchase-seats/purchase-seats.action';

// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { setIsReloadCartItems, setIsStartCountDown } from '../../redux/user/user.action';
import { withRouter, useHistory } from 'react-router';
import { useAlert } from 'react-alert';

const PurchaseSeatsPage = withRouter(({
    match, 
    location,
    seatsArray, 
    getReservedStatus,
    getPurchaseSeatsArray,
    setSeatsReserved,
    cancelReservation,
    setLoadAlerts,
    currentFontColors,
    setIsReloadCartItems,
    setIsStartCountDown,
    isLoadingAlerts
    }) => {

    const alert = useAlert();
    const webinarID = match.params.id;
    const userData = JSON.parse(localStorage.getItem("userData"));
    const historyUrl = useHistory();  

    const [selectedIndex, setSelectedIndex] = useState([]);
    const [seatSelected, setSeatSelected] = useState(false);

    const [loadButton, setLoadButton] = useState(false);
    const [loadCartButton, setCartLoadButton] = useState(false);

    const [fontColors, setFontColors] = useState({header1: "white", header2: "white"});

    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color){
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);

            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`
            })
        }
    }, [currentFontColors]);
    
    useEffect(() => {
        async function load() {
            setLoadAlerts(true);
            if (location && location.state && location.state.seatsArray) {
                await getPurchaseSeatsArray(webinarID, location.state.seatsArray);
                setSelectedIndex([...location.state.seatsArray]);
                setLoadAlerts(false); 
            }
            else {
                const reservedSataus = await getReservedStatus(webinarID);
                console.log(reservedSataus);   
                if ( reservedSataus?.is_reserved){
                    const newItem = {
                        prodName: location.state.name,
                        type: 'webinar',
                        quantity: reservedSataus.seatNo.length,
                        seatNums: reservedSataus.seatNo,
                        price: location.state.price,
                        img: location.state.image,
                        id: webinarID
                    };                    
                    addSeatsToCart(newItem);
                    setSeatSelected(true);
                    setLoadAlerts(false);
                    
                    //calculate waiting time from difference between reserved time and current time
                    // const waitingTime = (new Date(new Date(reservedSataus.reserved_date).toString()).getTime() - new Date().getTime()) + 300000;    // + 5 min 2 sec
                    // const timerID = setTimeout(async () => {
                    //     // remove webinar seats from shopping cart
                    //     const cartItems = JSON.parse(localStorage.getItem('cartItems'));
                    //     if (cartItems && cartItems.length > 0) {
                    //         const newCartItems = cartItems.filter( cartItem => cartItem.id !== webinarID );
                    //         if (newCartItems.length > 0)
                    //             localStorage.setItem('cartItems', JSON.stringify(newCartItems));
                    //         else
                    //             localStorage.setItem('cartItems', JSON.stringify(null));
                    //         setIsReloadCartItems(true);
                    //     }
                
                    //     await cancelReservation([webinarID]);  
                    //     const storedTimerID_map = JSON.parse(localStorage.getItem('timerId_map')); 
                    //     const tempIDs = storedTimerID_map?.filter( timerID => timerID.id !== webinarID );
                    //     localStorage.setItem('timerId_map', JSON.stringify(tempIDs));
                    //     // setSeatSelected({...seatSelected, seat: false});
                    //     // await getPurchaseSeatsArray(webinarID);
                    // }, waitingTime);

                    // const storedTimerID_map = JSON.parse(localStorage.getItem('timerId_map'));
                    // const newTimerID = {
                    //     id: webinarID,
                    //     timer: timerID
                    // };
                    // if (storedTimerID_map && storedTimerID_map.length > 0) {
                    //     const tempIDs = storedTimerID_map.filter( timerID => timerID.id !== webinarID );
                    //     tempIDs.push(newTimerID);
                    //     localStorage.setItem('timerId_map', JSON.stringify(tempIDs));                     
                    // }
                    // else {
                    //     let tempArray = [];
                    //     tempArray.push(newTimerID);
                    //     localStorage.setItem('timerId_map', JSON.stringify(tempArray));
                    // }

                }                
                else{
                    await getPurchaseSeatsArray(webinarID);
                    setLoadAlerts(false);
                }
            }
        }
        if (userData)
            load();
    }, []);

    const manageSelectedIndex = (i) => {
        
        if (selectedIndex.includes(i)) {
            let array = selectedIndex; // make a separate copy of the array
            const index = array.indexOf(i);
            array.splice(index, 1);
            setSelectedIndex([...array]);
        }
        else
            setSelectedIndex([...selectedIndex, i]);
    }

    const addSeatsToCart = (newItem) => {       
        
        if (JSON.parse(localStorage.getItem('cartItems'))) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems'));
            const existingItem = cartItems.filter( item => item.id === newItem.id );
            if (existingItem) {
                const newCartItems = cartItems.filter( item => item.id !== newItem.id);
                newCartItems.push(newItem);
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));

            }
            else {
                cartItems.push(newItem);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        }
        else {
            let cartItems = [];
            cartItems.push(newItem)
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }

    const goToCheckOut = async () => {

        if (loadButton)
            return;     
        
        setLoadButton(true);
        if(selectedIndex.length > 0) {
            if (location.state.seatsArray)
                await cancelReservation([webinarID]);
                
            const result = await setSeatsReserved(userData.id, webinarID, selectedIndex);
            if (result?.status) {
                if(result.status === "success") {
                    setIsStartCountDown(true);
                    const newItem = {
                        prodName: location.state.name,
                        type: 'webinar',
                        quantity: selectedIndex.length,
                        seatNums: selectedIndex,
                        price: location.state.price,
                        img: location.state.image,
                        id: webinarID
                    };
                    addSeatsToCart(newItem);
                    setSeatSelected(true);
                }
                else{
                    alert.error("You selected some reserved seats.");
                    const reservedArray = result.data.reserved_seats;
                    const currentSelectedArray = selectedIndex;
                    const newArray = currentSelectedArray.filter(val => !reservedArray.includes(val));
                    await getPurchaseSeatsArray(webinarID);
                    setSelectedIndex([...newArray]);                
                }
            }
            else {
                result.message && alert.error(result.message);
            }
            setLoadButton(false);   
        }
        else{
            alert.info("Please select the seat.");
            setLoadButton(false);
        }
            
    }

    const goToCartFunc = async () => {
        if (loadCartButton)
            return;

        setCartLoadButton(true);
        
        if(selectedIndex.length > 0) {
            if (location.state.seatsArray)
                await cancelReservation([webinarID]);

            const result = await setSeatsReserved(userData.id, webinarID, selectedIndex);
            if ( result.status ) {
                if(result.status === "success") {
                    setIsStartCountDown(true);
                    const newItem = {
                        prodName: location.state.name,
                        type: 'webinar',
                        quantity: selectedIndex.length,
                        seatNums: selectedIndex,
                        price: location.state.price,
                        img: location.state.image,
                        id: webinarID
                    };
                    addSeatsToCart(newItem);
                    // setSeatSelected(true);
                    historyUrl.push('/shopping_cart');
                }                
                else{
                    alert.error("You selected some reserved seats.");
                    const reservedArray = result.data.reserved_seats;
                    const currentSelectedArray = selectedIndex;
                    const newArray = currentSelectedArray.filter(val => !reservedArray.includes(val));
                    await getPurchaseSeatsArray(webinarID);
                    setSelectedIndex([...newArray]);                
                }
            }
            else
                result.message && alert.error(result.message);
            setCartLoadButton(false);   
        }
        else{
            alert.info("Please select the seat.");
            setCartLoadButton(false);
            return;
        }   
    }

    const renderSeats = () => !isLoadingAlerts && (
        <div className="purchase-seats-page">
            <div className="headers">
            <h2 className="text-center" style={{color: fontColors.header1}}>Purchase Seats </h2>
            <h2 className="product-title text-center"> {location.state?.name}</h2> 
            </div>
            <div className="seats-container">
            {
                // location && location.state && location.state.seatsArray ?
                // seatsArray && seatsArray.length > 0 && seatsArray.map(
                //     (seat, i) => 
                //         <div key={i} className={`each-seat ${ selectedIndex.includes(i) ? "available" : seat} ${ selectedIndex.includes(i) ? 'selected' : ''}`} onClick={()=> ( selectedIndex.includes(i) || seat === "available") && manageSelectedIndex(i)}>{i+1}</div>                     
                // )
                // :
                seatsArray && seatsArray.length > 0 && seatsArray.map(
                    (seat, i) => 
                        <div key={i} className={`each-seat ${seat} ${ selectedIndex.includes(i) ? 'selected' : ''}`} onClick={()=> seat === "available" && manageSelectedIndex(i)}>{i+1}</div>                     
                )
            }
            </div>
            <div className="content-center">
                <img className="stadium-img" src={`${process.env.PUBLIC_URL}/purchase_stadium.png`} alt="stadium"/>
            </div>
            <div className="content-center wth-400">
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_available.png`} alt="stadium"/>Available</p>
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_reserved.png`} alt="stadium"/>Purchase in Progress</p>
                <p style={{color: fontColors.header2}}><img src={`${process.env.PUBLIC_URL}/purchase_taken.png`} alt="stadium"/>Taken</p>
            </div>
            <MDBRow center style={{width: '100%'}}>
                <MDBCol size="5" sm="5" md="4" lg="3" className="mb-2">
                <FormButton isLoading={loadButton} onClickFunc = {()=> goToCheckOut()}>NEXT</FormButton>
                </MDBCol>
                <MDBCol size="7" sm="6" md="5" lg="4">
                <FormButton isLoading={loadCartButton} onClickFunc = {()=> goToCartFunc()}><MDBIcon icon="shopping-basket" className="mr-2"/>ADD TO CART</FormButton>
                </MDBCol>
            </MDBRow>
        </div>
    );

    const renderCheckOut = () => {
        const data = JSON.parse(localStorage.getItem('cartItems'));
        if (data && data.length > 0)
            historyUrl.push("/checkout");
        else{
            historyUrl.push('/product', {prodType: "webinar"});
            alert.error('Your reserved seats are not purchased yet');
        }                  
    };

    return (        
        <Fragment>
            {
                seatSelected ? renderCheckOut() : renderSeats() 
            }
        </Fragment>        
    )
});

const MapStateToProps = ({purchaseSeats, colors: {currentFontColors}, alerts: {isLoadingAlerts}}) => ({
    seatsArray: purchaseSeats.seatsArray,
    currentFontColors,
    isLoadingAlerts
})

const MapDispatchToProps = dispatch => ({
    getReservedStatus: getReservedStatus(dispatch),
    getPurchaseSeatsArray: getPurchaseSeatsArray(dispatch),
    setSeatsReserved: setSeatsReserved(dispatch),
    cancelReservation: cancelReservation(dispatch),
    setIsReloadCartItems: flag => dispatch(setIsReloadCartItems(flag)), 
    setIsStartCountDown: flag => dispatch(setIsStartCountDown(flag)),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect (MapStateToProps, MapDispatchToProps)(PurchaseSeatsPage);