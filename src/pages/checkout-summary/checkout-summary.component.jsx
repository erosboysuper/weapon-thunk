import React, { useState, useEffect, Fragment } from 'react';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { useHistory } from 'react-router-dom';
import './checkout-summary.style.scss';
import { connect } from 'react-redux';

const CheckOutSummaryPage = ({ currentFontColors }) => {

   const historyUrl = useHistory();

   const [fontColors, setFontColors] = useState({ header1: "white", paragraph: "#a3a3a3" });

   useEffect(() => {
      if (currentFontColors && currentFontColors.paragraph_color && currentFontColors.header1_color && currentFontColors.form_color) {
         const pColor = JSON.parse(currentFontColors.paragraph_color);
         const h1Color = JSON.parse(currentFontColors.header1_color);

         setFontColors({
            paragraph: `rgba(${pColor.r}, ${pColor.g}, ${pColor.b}, ${pColor.a})`,
            header1: `rgba(${h1Color.r}, ${h1Color.g}, ${h1Color.b}, ${h1Color.a})`
         })
      }
   }, [currentFontColors]);

   const cartItems = JSON.parse(localStorage.getItem('successCartItems'));
   let subTotalPrice = 0;
   let totalTax = 0;
   let totalShipping = 0;
   if (cartItems && cartItems.length > 0) {
      cartItems.map(cartItem => {
         subTotalPrice += cartItem.price * cartItem.quantity;
         if (cartItem.tax)
            totalTax += cartItem.tax * cartItem.quantity;
         if (cartItem.shipping)
            totalShipping += cartItem.shipping;
      });
   }

   return (
      <div className="checkout-summary">
         <MDBRow center className="mb-3">
            <MDBCol size="12" sm="10" md="10" lg="8" xl="7">
               <div className="summary-form">
                  <p className="text-center success-icon" style={{color: fontColors.header1}}><MDBIcon far icon="check-circle"/></p>
                  <h2 className="text-center font-weight-bold" style={{color: fontColors.header1}}>Payment Successful!</h2>
                  <p className="text-center" style={{color: fontColors.paragraph}}>Congratulations! Your payment was processed successfully.</p>
               </div>
            </MDBCol>
         </MDBRow>
         <MDBRow center className="mb-4">
            <MDBCol size="12" sm="10" md="10" lg="8" xl="7">
               <div className="summary-form">
                  <p className="font-weight-bold mb-4" style={{ color: fontColors.header1, fontSize: '18px' }}>ORDER SUMMARY</p>
                  <MDBRow>
                     <MDBCol size="6" className="text-left">
                        Product Name
                  </MDBCol>
                     <MDBCol size="3" className="text-center">
                        Price Per Item/Seat
                  </MDBCol>
                     <MDBCol size="3" className="text-right">
                        Total
                  </MDBCol>
                  </MDBRow>
                  <hr />
                  {
                     cartItems && cartItems.length > 0 ? cartItems.map((item, i) =>
                        <Fragment>
                           <MDBRow key={i} className="pt-1 pb-1">
                              <MDBCol middle className="text-left" size="6">
                                 <p style={{ color: fontColors.header1 }} className="mb-1 pb-0">
                                    {item.quantity} <MDBIcon icon="times" /> {item.prodName.length > 20 ? item.prodName.slice(0, 20) + "..." : item.prodName}
                                 </p>
                                 {
                                    item.type === "physical" ? <p style={{ color: fontColors.paragraph, fontSize: '14px' }} className="mb-0 pb-0">Physical Product</p>
                                       :
                                       <p style={{ color: fontColors.paragraph, fontSize: '14px' }} className="mb-0 pb-0">
                                          Webinar (Seats no. - {item.seatNums.map(
                                          (seatNum, i) => <span key={i}>{i !== 0 && ', '}{seatNum + 1}</span>
                                       )} )
                           </p>
                                 }
                              </MDBCol>
                              <MDBCol middle className="text-center" size="3" style={{ color: fontColors.header1 }}>
                                 ${item.price}
                              </MDBCol>
                              <MDBCol middle className="text-right" size="3" style={{ color: fontColors.header1 }}>
                                 ${item.price * item.quantity}
                              </MDBCol>
                           </MDBRow>
                           <hr />
                        </Fragment>)
                        :
                        <Fragment>
                           <p className="text-center font-weight-bold" style={{ color: fontColors.paragraph }}>No Item</p>
                           <hr />
                        </Fragment>
                  }
                  <MDBRow className="pt-4">
                     <MDBCol size="4" sm="6" />
                     <MDBCol size="8" sm="6">
                        <MDBRow className="mb-2" style={{ color: fontColors.paragraph, fontSize: '14px' }}>
                           <MDBCol className="text-left" size="6">
                              Subtotal:
                     </MDBCol>
                           <MDBCol className="text-right" size="6">
                              ${subTotalPrice}
                           </MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-2" style={{ color: fontColors.paragraph, fontSize: '14px' }}>
                           <MDBCol className="text-left" size="6">
                              Taxes:
                     </MDBCol>
                           <MDBCol className="text-right" size="6">
                              ${totalTax}
                           </MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-2" style={{ color: fontColors.paragraph, fontSize: '14px' }}>
                           <MDBCol className="text-left" size="6">
                              Shipping:
                     </MDBCol>
                           <MDBCol className="text-right" size="6">
                              ${totalShipping}
                           </MDBCol>
                        </MDBRow>
                        <hr className="mt-3 mb-3" />
                        <MDBRow className="mb-2 font-weight-bold" style={{ color: fontColors.header1, fontSize: '17px' }}>
                           <MDBCol className="text-left" size="6">
                              TOTAL:
                     </MDBCol>
                           <MDBCol className="text-right" size="6">
                              ${subTotalPrice + totalTax + totalShipping}
                           </MDBCol>
                        </MDBRow>
                     </MDBCol>
                  </MDBRow>
               </div>
            </MDBCol>
         </MDBRow>
         <MDBRow center className="pt-4 mb-4">
            <MDBCol size="10" sm="4" md="4" lg="3">
               <FormButton onClickFunc={()=>historyUrl.push("/")}>GO TO HOMEPAGE</FormButton>
            </MDBCol>
         </MDBRow>
      </div>
   )
}

const MapStateToProps = ({ colors: { currentFontColors } }) => ({
   currentFontColors
});

export default connect(MapStateToProps)(CheckOutSummaryPage);