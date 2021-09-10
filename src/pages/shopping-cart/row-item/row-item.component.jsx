import React, { Fragment, useState, useEffect } from 'react';
import './row-item.style.scss';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import ProductQuantity from '../../../components/product-quantity/product-quantity.component';
import { useHistory } from 'react-router-dom';
import { cancelReservation } from '../../../redux/purchase-seats/purchase-seats.action';
import { setLoadAlerts } from '../../../redux/alerts/alerts.action';
import { setHideRefreshedTimer, setIsStartCountDown, changeTimerAction } from '../../../redux/user/user.action';

const CartRowItem = ({ item, isMobile, cutLetters, currentFontColors, setTotalVal, cancelReservation, setLoadAlerts, setHideRefreshedTimer, setIsStartCountDown, changeTimerAction }) => {

    const historyUrl = useHistory();

    const [fontColor, setFontColor] = useState({ content: "white", header: "a3a3a3" });
    useEffect(() => {
        if (currentFontColors && currentFontColors.table_content_color && currentFontColors.table_header_color) {
            const color = JSON.parse(currentFontColors.table_content_color);
            const color2 = JSON.parse(currentFontColors.table_header_color);
            setFontColor({
                content: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                header: `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${color2.a})`
            })
        }
    }, [currentFontColors]);

    const [isOpenTable, setIsOpenTable] = useState(false);

    const changeCountFunc = count => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        if (cartItems && cartItems.length > 0) {
            const newCartItems = cartItems.map(cartItem => {
                if (cartItem.id === item.id)
                    cartItem.quantity = count;
                return cartItem;
            });
            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        }
        setTotalVal();
    }

    const deleteCartItemFunc = async () => {
        if (item.type === "webinar") {
            setLoadAlerts(true);
            await cancelReservation([item.id]);
            setLoadAlerts(false);
        }
        const cartItems = JSON.parse(localStorage.getItem('cartItems'));
        const newCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
        if (newCartItems.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        }            
        else
            localStorage.setItem('cartItems', JSON.stringify(null));
        // setHideRefreshedTimer();    
        setIsStartCountDown(false);
        changeTimerAction(item.id);
        setTotalVal();       
    }

    const editWebinarSeats = () => {
        historyUrl.push(`/purchase_seats/${item.id}`, {
            price: item.price,
            name: item.prodName,
            seatsArray: item.seatNums,
            image: item.img
        });
    }

    return (
        <Fragment>
            {
                isMobile ? 
                <MDBRow className="mobileCartRow pt-4 pb-4">
                    <MDBCol size="12">
                    <MDBRow>
                        <MDBCol size="4">
                            <img src={item.img} alt={item.prodName}/>
                        </MDBCol>
                        <MDBCol size="8">
                            <MDBRow style={{ fontSize:'20px', color: fontColor.content }}>
                                {item.prodName}
                            </MDBRow>                            
                            <MDBRow className="mt-1" style={{color: '#e41c39', fontWeight: '600'}}>
                                Price: ${item.price.toFixed(2)}
                            </MDBRow>
                            <MDBRow style={{ textTransform: 'uppercase', fontSize: '14px', color: fontColor.header }}>
                                {item.type}
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-4">
                        <MDBCol size="6" middle className="text-center quantity-wrapper" style={{ color: fontColor.header }}>
                        {
                            item.type === "physical" ? <ProductQuantity
                                count={item.quantity}
                                minus={() => changeCountFunc(item.quantity === 1 ? item.quantity : item.quantity - 1)}
                                plus={() => changeCountFunc(item.quantity === item.maxQuantity ? item.quantity : item.quantity + 1)}
                                radius={false}
                            />
                                :
                                <Fragment>
                                    <p className="mb-0 pb-0">{item.quantity} <span style={{ color: fontColor.header, fontSize: '14px' }}>
                                        ( Seat Number - {item.seatNums.map(
                                        (seatNum, i) => <span key={i}>{i !== 0 && ', '}{seatNum + 1}</span>
                                    )} )
                                </span>
                                    </p>
                                    <button className="editSeatsBtn" onClick={() => editWebinarSeats()}>Edit</button>
                                </Fragment>
                        }
                        </MDBCol>
                        <MDBCol size="6" middle className="text-center quantity-wrapper">
                            <button className="delCartBtn" onClick={() => deleteCartItemFunc()}>Delete <MDBIcon icon="trash-alt" /></button>
                        </MDBCol>
                    </MDBRow>
                    </MDBCol>
                </MDBRow>
                //</Fragment>
                //     <MDBRow className="cartRow">
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content , fontSize: '17px'}}>{item.prodName.length > 20 ? item.prodName.slice(0, 20) + "..." : item.prodName}</MDBCol>
                //         <MDBCol size="7" middle className="text-center" style={{ color: fontColor.content , fontSize: '17px'}}>
                //             {item.quantity}
                //         </MDBCol>
                //         {/* <MDBCol size="2" middle >
                //             <button className="openBtn" onClick={()=>setIsOpenTable(true)} style={{borderColor: fontColor.content}}><MDBIcon icon="plus" style={{color: fontColor.content}}/></button>
                //         </MDBCol>                     */}
                //     </MDBRow>

                //     <MDBRow className="mobile-row" style={{ borderTop: '1px solid white' }}>
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Product Type</MDBCol>
                //         <MDBCol size="7" middle className="text-center" style={{ color: fontColor.header }}>{item.type === "physical" ? "Physical" : "Webinar"}</MDBCol>
                //         {/* <MDBCol size="2" middle >
                //             <button className="openBtn" onClick={()=>setIsOpenTable(false)} style={{borderColor: fontColor.content}}><MDBIcon icon="minus" style={{ color: fontColor.content}}/></button>
                //         </MDBCol>                     */}
                //     </MDBRow>
                //     <MDBRow className="mobile-row">
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Product Name</MDBCol>
                //         <MDBCol size="7" middle className="text-center cursorDiv" onClick={() => historyUrl.push(`/products/${item.type}/${item.id}`)} style={{ color: fontColor.header }}>{item.prodName.length > 20 ? item.prodName.slice(0, 20) + "..." : item.prodName}</MDBCol>
                //     </MDBRow>
                //     <MDBRow className="mobile-row">
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Quantity</MDBCol>
                //         <MDBCol size="7" middle className="text-center quantity-wrapper" style={{ color: fontColor.header }}>
                //             {
                //                 item.type === "physical" ? <ProductQuantity
                //                     count={item.quantity}
                //                     minus={() => changeCountFunc(item.quantity === 1 ? item.quantity : item.quantity - 1)}
                //                     plus={() => changeCountFunc(item.quantity === item.maxQuantity ? item.quantity : item.quantity + 1)}
                //                     radius={false}
                //                 />
                //                     :
                //                     <Fragment>
                //                         <p className="mb-0 pb-0">{item.quantity} <span style={{ color: fontColor.header, fontSize: '14px' }}>
                //                             ( Seat Number - {item.seatNums.map(
                //                             (seatNum, i) => <span key={i}>{i !== 0 && ', '}{seatNum + 1}</span>
                //                         )} )
                //                     </span>
                //                         </p>
                //                         <button className="editSeatsBtn" onClick={() => editWebinarSeats()}>Edit</button>
                //                     </Fragment>
                //             }
                //         </MDBCol>
                //     </MDBRow>
                //     <MDBRow className="mobile-row">
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Price Per Item/Seat</MDBCol>
                //         <MDBCol size="7" middle className="text-center" style={{ color: fontColor.header }}>${item.price}</MDBCol>
                //     </MDBRow>
                //     <MDBRow className="mobile-row">
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Total</MDBCol>
                //         <MDBCol size="7" middle className="text-center" style={{ color: fontColor.header }}>${item.price * item.quantity}</MDBCol>
                //     </MDBRow>
                //     <MDBRow className="mobile-row" style={{ borderBottom: '1px solid white' }}>
                //         <MDBCol size="5" middle className="text-center" style={{ color: fontColor.content }}>Remove</MDBCol>
                //         <MDBCol size="7" middle className="text-center" style={{ color: fontColor.header }}>
                //             <button className="row-btn" onClick={() => deleteCartItemFunc()}><MDBIcon icon="trash-alt" /></button>
                //         </MDBCol>
                //     </MDBRow>

                // </Fragment>
                    :
                    <MDBRow className="cartRow">
                        <MDBCol middle className="text-left cursorDiv" size="3" onClick={() => historyUrl.push(`/products/${item.type}/${item.id}`)}>
                            <p style={{ color: fontColor.content }} className="mb-1 pb-0">
                                {cutLetters ? item.prodName.length > 25 ? item.prodName.slice(0, 25) + "..." : item.prodName
                                    :
                                    item.prodName.length > 35 ? item.prodName.slice(0, 35) + "..." : item.prodName
                                }
                            </p>
                            <p style={{ color: fontColor.header, fontSize: '14px' }} className="mb-0 pb-0">{item.type === "physical" ? "Physical Product" : "Webinar"}</p>
                        </MDBCol>
                        <MDBCol middle className="text-center quantity-wrapper" size="3" style={{ color: fontColor.content }}>
                            {
                                item.type === "physical" ? <ProductQuantity
                                    count={item.quantity}
                                    minus={() => changeCountFunc(item.quantity === 1 ? item.quantity : item.quantity - 1)}
                                    plus={() => changeCountFunc(item.quantity === item.maxQuantity ? item.quantity : item.quantity + 1)}
                                    radius={false}
                                />
                                    :
                                    <Fragment>
                                        <p className="mb-0 pb-0">{item.quantity} <span style={{ color: fontColor.header, fontSize: '14px' }}>
                                            ( Seat Number - {item.seatNums.map(
                                            (seatNum, i) => <span key={i}>{i !== 0 && ', '}{seatNum + 1}</span>
                                        )} )
                                    </span>
                                        </p>
                                        <button className="editSeatsBtn" onClick={() => editWebinarSeats()}>Edit</button>
                                    </Fragment>
                            }
                        </MDBCol>

                        <MDBCol middle className="text-center" size="2" style={{ color: fontColor.content }}>${item.price.toFixed(2)}</MDBCol>
                        <MDBCol middle className="text-center" size="2" style={{ color: fontColor.content }}>${(item.price * item.quantity).toFixed(2)}</MDBCol>
                        <MDBCol middle className="text-right" size="2" style={{ color: fontColor.content }}>
                            <button className="row-btn" onClick={() => deleteCartItemFunc()}><MDBIcon icon="trash-alt" /></button>
                        </MDBCol>
                    </MDBRow>
            }
        </Fragment>
    )
}

const MapStateToProps = ({ colors: { currentFontColors } }) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag)),
    cancelReservation: cancelReservation(dispatch),
    setHideRefreshedTimer: () => dispatch(setHideRefreshedTimer()),
    setIsStartCountDown: flag => dispatch(setIsStartCountDown(flag)),
    changeTimerAction: id => dispatch(changeTimerAction(id))
})

export default connect(MapStateToProps, MapDispatchToProps)(CartRowItem);