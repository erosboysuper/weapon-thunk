import React, { useState, useEffect, Fragment } from "react";
import "./check-out-form.style.scss";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
// import CheckoutPayButton from '../checkout-button/checkout-button.component';
import CreditCardNumberInput from '../ccNum-input/ccNum-input.component';
import FormSelect from '../../form-select/form-select.component';
import FormCheckbox from '../../form-checkbox/form-checkbox.component';
import FormButton from '../../form-button/form-button.component';
import { connect } from 'react-redux';
import { purchaseProducts } from '../../../redux/purchase-seats/purchase-seats.action';
import { getCurrentUser } from '../../../redux/user/user.action';
import { 
  setIsReloadCartItems, 
  setIsStartCountDown, 
  setHideRefreshedTimer, 
  changeCheckOutStatus } from '../../../redux/user/user.action';
import { setLoadAlerts } from '../../../redux/alerts/alerts.action';
import { Link, useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

const { REACT_APP_ACCEPT_CLIENT_KEY, REACT_APP_ACCEPT_API_LOGIN_ID } = process.env;

const CheckOutForm = ({
    purchaseProducts, 
    currentFontColors,
    isReloadCartItems,
    setIsReloadCartItems,
    getCurrentUser,
    setIsStartCountDown,
    setHideRefreshedTimer,
    globalCheckState,
    changeCheckOutStatus,
    setLoadAlerts
    }) => {

    const alert = useAlert();
    const historyURL = useHistory();

    const [cartItems, setCartItems] = useState();
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);

    // for using saved card
    const [isUseSavedCard, setIsUseSavedCard] = useState(false);
    const [isSaveCard, setIsSaveCard] = useState(false);
    const [savedCC, setSavedCC] = useState(null);

    const setCartItemsFunction = () => {
      const data = JSON.parse(localStorage.getItem('cartItems')); 
      
      if (data && data.length > 0) {
        let subtotal  = 0;
        let tax = 0;
        let shipping = 0;
        data.map( cartItem => {
          subtotal += cartItem.price * cartItem.quantity;
          if (cartItem.tax)
            tax += cartItem.tax * cartItem.quantity;
          if (cartItem.shipping)
            shipping += cartItem.shipping;
        });

        setSubTotalPrice(subtotal);
        // tax = tax.toString();
        // if (tax.indexOf(".") > -1)
        //   tax = tax.slice(0, (tax.indexOf("."))+3);
        setTotalTax(tax);
        setTotalShipping(shipping);
        setCartItems(data);
      }
      else
      {
        historyURL.push('/product', {prodType: "webinar"});
      }      
    }

    useEffect(() => {
      setCartItemsFunction();
      changeCheckOutStatus(false);

      async function loadSavedCC() {
        const result = await getCurrentUser(null,"fromDB");
        if (result?.creditCardNumber) {
          setLoadAlerts(true);
          setSavedCC(result.creditCardNumber);
          setIsUseSavedCard(true);
          setLoadAlerts(false);
        }
      }

      loadSavedCC();
    }, []);

    useEffect(() => {
      if (isReloadCartItems) {
        setCartItemsFunction();
        setIsReloadCartItems(false);
      }
    }, [isReloadCartItems]);

    const [fontColors, setFontColors] = useState({header1: "white", paragraph: "#a3a3a3", form: "#13a3a3"});

    useEffect(() => {
        if (currentFontColors && currentFontColors.paragraph_color && currentFontColors.header1_color && currentFontColors.form_color) {
            const pColor = JSON.parse(currentFontColors.paragraph_color);
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const formColor = JSON.parse(currentFontColors.form_color);
          
            setFontColors({
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                form: `rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`      
            })
        }
    }, [currentFontColors]);

  const paymentConfig = {
    clientKey: REACT_APP_ACCEPT_CLIENT_KEY,
    apiLoginId: REACT_APP_ACCEPT_API_LOGIN_ID,
  };

  const [isCCBtnClicked, setIsCCBtnClicked] = useState(true);

  // for payment with Credit card
  const [creditInfo, setCreditInfo] = useState({
    cardNum: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [isCCInvalid, setIsCCInvalid] = useState(false);
  const [loadButton, setLoadButton] = useState(false);

  const selectOptions1 = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [optionShow1, setOptionShow1] = useState(false);
  const [placeholder1, setPlaceholder1] = useState("Month");

  const selectOptions2 = [
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
    2027,
    2028,
    2029,
  ];
  const [optionShow2, setOptionShow2] = useState(false);
  const [placeholder2, setPlaceholder2] = useState("Year");

  const [isCVCInvalid, setIsCVCInvalid] = useState(false);
  const [isMonthInvalid, setIsMonthInvalid] = useState(false);
  const [isYearInvalid, setIsYearInvalid] = useState(false);

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isTermsUnchecked, setIsTermsUnchecked] = useState(false);

  // for payment with bank transfer
  // const [bankInfo, setBankInfo] = useState({bankName: '', bankNumber: '', ABANumber: '', accountName: ''});

  // for bank account types
  // const selectOptions = ["Personal Checking","Personal Savings", "Business Checking"];
  // const [optionShow, setOptionShow] = useState(false);
  // const [currentType, setCurrentType] = useState("Personal Checking");

  const creditCardNumberFormat = (value) => {
    let v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];
    let len = match.length;
    for (let i = 0; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const cvcNumberFormat = (e) => {
    const re = /^[0-9\b]+$/;
    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      setCreditInfo({ ...creditInfo, cvc: e.target.value });
    }
  };

  const validateCVCNumber = (cvcNum) => {
    let cvcRegEx = /^[0-9]{3,4}$/;
    return cvcRegEx.test(cvcNum);
  };

  const validateCreditCardNumber = (ccNum) => {
    ccNum = ccNum.split(" ").join("");

    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    return (
      visaRegEx.test(ccNum) ||
      mastercardRegEx.test(ccNum) ||
      amexpRegEx.test(ccNum) ||
      discovRegEx.test(ccNum)
    );
  };

  const sendPaymentDataToAnet = () => {
    const authData = {};
    authData.clientKey = paymentConfig.clientKey;
    authData.apiLoginID = paymentConfig.apiLoginId;
    const cardData = {};
    cardData.cardNumber = creditInfo.cardNum.replace(/\s/g, "");
    cardData.month = creditInfo.month;
    cardData.year = creditInfo.year;
    cardData.cardCode = creditInfo.cvc;
    const secureData = {};
    secureData.authData = authData;
    secureData.cardData = cardData;
    return new Promise((resolve, reject) => {
      
      let lastResponse = null;

      window.Accept.dispatchData(secureData, (res) => {
        // just in case it still gets called twice, ignore the second call
        if (res == lastResponse) {
          console.log("skipping duplicated responseHandler() call because it's the same response as the previous response");
          return;
        }
        lastResponse = res;
        console.log("responseHandler function called");

        if (res.messages.resultCode === "Error") return reject(res);
        resolve(res);
      });
    });
  };

  const handleCreditCardCheckOut = async (event) => {
    event.preventDefault();    
    if (loadButton) return;
    if (!isTermsChecked) {
      setIsTermsUnchecked(true);
      return
    }

    setIsCCInvalid(false);
    setIsCVCInvalid(false);
    setIsTermsUnchecked(false);
    setIsMonthInvalid(false);
    setIsYearInvalid(false);

    const isValidCCNum = validateCreditCardNumber(creditInfo.cardNum);
    const isValidCVCNum = validateCVCNumber(creditInfo.cvc);

    if (
      (isValidCCNum &&
      isValidCVCNum &&
      placeholder1 !== "Month" &&
      placeholder2 !== "Year" && !isUseSavedCard) || isUseSavedCard
    ) {
      setLoadButton(true);
      const products = [];
      cartItems.map ( (item, i) => {
        item.type === "physical" ? products.push({ product_type: item.type, id: item.id, amount: item.quantity })
        :
        products.push({ product_type: item.type, id: item.id })
      });
      let body = {};

      try {
        if (isUseSavedCard)
          body = {
            products
          }
        else {
          const { opaqueData } = await sendPaymentDataToAnet();
          body = {
            opaqueData,
            products
          }
        } 

        body.using_saved_card = isUseSavedCard;
        body.is_saving_credit_card = isSaveCard;
    
        const result = await purchaseProducts(body); 
        
        if (result === "success") {
          setLoadButton(false);
          localStorage.setItem('successCartItems', localStorage.getItem('cartItems'));
          localStorage.removeItem('cartItems');

          // const storedTimerID_map = JSON.parse(localStorage.getItem('timerId_map'));
          // cartItems.map( item => {
          //   storedTimerID_map.map ( timer => {
          //     if ( timer.id === item.id) {
          //       clearTimeout(timer.timer);
          //     }
          //   })
          // })
          setIsStartCountDown(false);
          setHideRefreshedTimer();
          historyURL.push("/checkout_summary");
        }
        else {
          alert.error(result);              
          setTimeout( () => {
            setLoadButton(false);
          }, 5000)
        }
        
      } catch (err) {
        if (err.messages.message[0].code === "E_WC_05") {
          setIsCCInvalid(true);
          setLoadButton(false);
        }
        else {
          var i = 0;
          while (i < err.messages.message.length) {
            console.log(
                err.messages.message[i].code + ": " +
                err.messages.message[i].text
              );
              // only show the user the first error message
              if (i == 0) {
                  let error = err.messages.message[i].text;
                  alert.error(error);
              }	
              i = i + 1;
          }
          setTimeout( () => {
            setLoadButton(false);
          }, 5000)
        } 
      }
    } else {
      if (!isValidCCNum) setIsCCInvalid(true);
      if (!isValidCVCNum) setIsCVCInvalid(true);
      if (placeholder1 === "Month") setIsMonthInvalid(true);
      if (placeholder2 === "Year") setIsYearInvalid(true);
      return;
    }
  };

  // const handleBankTransfer = async event => {
  //     event.preventDefault();
  //     if (loadButton)
  //         return;

    return (
      <div className="check-out-page">
        <span className="back-span" style={{color: fontColors.header1}} onClick={() => historyURL.push('/shopping_cart') }><MDBIcon icon="chevron-left" /> Back to Cart</span>
        <h2 className="font-weight-bold text-center mb-4" style={{color: fontColors.header1}}>Checkout</h2>
        <MDBRow center className="pt-4">
          <MDBCol size="12" sm="10" md="10" lg="8" xl="6" className="mb-4">
            <div className="check-out-form">
              <p className="font-weight-bold mb-4" style={{color: fontColors.header1, fontSize: '18px'}}>ORDER SUMMARY</p>
              <MDBRow>
                <MDBCol size="5" className="text-left">
                  Product Name
                </MDBCol>
                <MDBCol size="5" className="text-center">
                  Price Per Item/Seat
                </MDBCol>
                <MDBCol size="2" className="text-right">
                  Total
                </MDBCol>
              </MDBRow>
              <hr/>
              {
                cartItems && cartItems.length > 0 ? cartItems.map( (item, i) => 
                <Fragment>
                  <MDBRow key={i} className="pt-1 pb-1">
                    <MDBCol middle className="text-left" size="6">
                        <p style={{color: fontColors.header1}} className="mb-1 pb-0">
                          { item.quantity } <MDBIcon icon="times" /> { item.prodName.length > 20 ? item.prodName.slice(0,20) + "..." : item.prodName }                         
                        </p>
                        {
                          item.type === "physical" ? <p style={{color: fontColors.paragraph, fontSize: '14px'}} className="mb-0 pb-0">Physical Product</p>
                          :
                          <p style={{color: fontColors.paragraph, fontSize: '14px'}} className="mb-0 pb-0">
                            Webinar (Seats no. - { item.seatNums.map(
                              (seatNum,i) => <span key={i}>{ i !== 0 && ', '}{seatNum+1}</span>
                              )} )
                          </p>
                        }
                    </MDBCol>
                    <MDBCol middle className="text-center" size="3" style={{color: fontColors.header1}}>
                      ${item.price.toFixed(2)}
                    </MDBCol>
                    <MDBCol middle className="text-right" size="3" style={{color: fontColors.header1}}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </MDBCol>                      
                  </MDBRow>
                  <hr/>
                </Fragment> )
                :
                <Fragment>
                  <p className="text-center font-weight-bold" style={{color: fontColors.paragraph}}>No Item</p>
                  <hr/>
                </Fragment>
              }
              <MDBRow className="pt-4">
                <MDBCol size="4" sm="6"/>
                <MDBCol size="8" sm="6">
                  <MDBRow className="mb-2" style={{color: fontColors.paragraph, fontSize: '14px'}}>
                    <MDBCol className="text-left" size="6">
                      Subtotal:
                    </MDBCol>
                    <MDBCol className="text-right" size="6">
                      ${subTotalPrice.toFixed(2)}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-2" style={{color: fontColors.paragraph, fontSize: '14px'}}>
                    <MDBCol className="text-left" size="6">
                      Taxes:
                    </MDBCol>
                    <MDBCol className="text-right" size="6">
                      ${totalTax.toFixed(2)}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-2" style={{color: fontColors.paragraph, fontSize: '14px'}}>
                    <MDBCol className="text-left" size="6">
                      Shipping:
                    </MDBCol>
                    <MDBCol className="text-right" size="6">
                      ${totalShipping.toFixed(2)}
                    </MDBCol>
                  </MDBRow>
                  <hr className="mt-3 mb-3"/>
                  <MDBRow className="mb-2 font-weight-bold" style={{color: fontColors.header1, fontSize: '17px'}}>
                    <MDBCol className="text-left" size="6">
                      TOTAL:
                    </MDBCol>
                    <MDBCol className="text-right" size="6">
                      ${(subTotalPrice + totalTax + totalShipping).toFixed(2)}
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </div>
          </MDBCol>
          <MDBCol size="12" sm="10" md="10" lg="8" xl="6" className="mb-4">
            <div className="check-out-form">
                <p className="font-weight-bold mb-4" style={{color: fontColors.header1, fontSize: '18px'}}>CARD DETAILS</p>
          
                {/* <MDBRow className="payBtnGroup">
                    <MDBCol>
                        <CheckoutPayButton payType="card" active={isCCBtnClicked} onClickFunc={()=>{
                            setIsTermsUnchecked(false);
                            setIsCCBtnClicked(true);
                            }}/>               
                    </MDBCol>
                    <MDBCol>
                        <CheckoutPayButton payType="bank" active={!isCCBtnClicked} onClickFunc={()=>{
                            setIsTermsUnchecked(false);
                            setIsCCBtnClicked(false);
                        }}/>
                    </MDBCol>
                </MDBRow> */}
                {/* {
                            isCCBtnClicked ?  */}
                <form onSubmit={handleCreditCardCheckOut}>
                  <MDBRow className="mt-4" between>
                    <MDBCol size="12" md="6" className="mb-2">
                      <div className="checkbox-container">
                        <FormCheckbox
                          Notif={isUseSavedCard}
                          disabled={!savedCC}
                          handleChange={() => {
                            if (savedCC) {
                              setIsUseSavedCard(!isUseSavedCard);
                              !isUseSavedCard && setIsSaveCard(false);
                            }
                            }
                          }
                        />
                        <p style={{ color: fontColors.paragraph }}>                       
                            Use saved card {savedCC ? `(${savedCC})` : '(No card)'}
                        </p>
                      </div>
                    </MDBCol>
                    <MDBCol size="12" md="6" className="mb-2">
                      <div className="checkbox-container">
                        <FormCheckbox
                          Notif={isSaveCard}
                          disabled={isUseSavedCard}
                          handleChange={() => !isUseSavedCard && setIsSaveCard(!isSaveCard)}
                        />
                        <p style={{ color: fontColors.paragraph }}>                       
                          Save card to profile
                        </p>
                      </div>
                    </MDBCol>
                  </MDBRow>
                  {
                    !isUseSavedCard && 
                    <Fragment>
                      <p className="label">Card Number</p>
                      <CreditCardNumberInput
                        value={creditInfo.cardNum}
                        disabled={isUseSavedCard}
                        handleChange={(event) =>
                          setCreditInfo({
                            ...creditInfo,
                            cardNum: creditCardNumberFormat(event.target.value),
                          })
                        }
                        forCC={true}
                        style={{ color: fontColors.form }}
                        placeHolder="Card Number"
                        isInvalidNum={isCCInvalid}
                        autoComplete="cc-number"
                      />
                      {isCCInvalid && (
                        <p className="text-danger invalidNum">Invalid CC Number</p>
                      )}
                      <MDBRow className="mb-4 mt-4">
                        <MDBCol size="6" sm="6" md="6" lg="4">
                          <p className="label">Expiration Date</p>
                          <FormSelect
                            forPayment={true}
                            options={selectOptions1}
                            disabled={isUseSavedCard}
                            showSelectBox={() => !isUseSavedCard && setOptionShow1(!optionShow1)}
                            selectOption={(event) => {
                              setOptionShow1(false);
                              setPlaceholder1(event.target.id);
                              setCreditInfo({
                                ...creditInfo,
                                month:
                                  selectOptions1.indexOf(event.target.id) + 1 < 10
                                    ? "0" +
                                      (
                                        selectOptions1.indexOf(event.target.id) + 1
                                      ).toString()
                                    : (
                                        selectOptions1.indexOf(event.target.id) + 1
                                      ).toString(),
                              });
                            }}
                            optionShow={optionShow1}
                            placeholder={placeholder1}
                            isInvalid={isMonthInvalid}
                          />
                          {isMonthInvalid && (
                            <p className="text-danger invalidNum">Invalid Month</p>
                          )}
                        </MDBCol>
                        <MDBCol size="6" sm="6" md="6" lg="4">
                          <p className="label">&nbsp;</p>
                          <FormSelect
                            forPayment={true}
                            options={selectOptions2}
                            disabled={isUseSavedCard}
                            showSelectBox={() => !isUseSavedCard && setOptionShow2(!optionShow2)}
                            selectOption={(event) => {
                              setOptionShow2(false);
                              setPlaceholder2(event.target.id);
                              setCreditInfo({
                                ...creditInfo,
                                year: event.target.id.slice(2),
                              });
                            }}
                            optionShow={optionShow2}
                            placeholder={placeholder2}
                            isInvalid={isYearInvalid}
                          />
                          {isYearInvalid && (
                            <p className="text-danger invalidNum">Invalid Year</p>
                          )}
                        </MDBCol>
                        <MDBCol size="12" sm="12" md="12" lg="4">
                          <p className="label">CVC</p>

                          <input
                            className={`${isCVCInvalid ? "red-outline" : ""} cvc-input`}
                            style={{ color: fontColors.form }}
                            type="text"
                            placeholder="CVC"
                            value={creditInfo.cvc}
                            onChange={(event) => cvcNumberFormat(event)}
                            maxLength="4"
                            autoComplete="cc-csc"
                            disabled={isUseSavedCard}
                          />
                          {isCVCInvalid && (
                            <p className="text-danger invalidNum">Invalid CVC Number</p>
                          )}
                        </MDBCol>
                      </MDBRow>
                    </Fragment>
                  }
                  <div className="checkbox-container  mb-4">
                    <FormCheckbox
                      Notif={isTermsChecked}
                      handleChange={() => setIsTermsChecked(!isTermsChecked)}
                    />
                    <p style={{ color: fontColors.paragraph }}>
                      I confirm that I have understood I am purchasing the products and
                      I have read the &nbsp;
                      <Link to="/term_condition_page" className="underline">
                        Terms and Conditions
                      </Link>
                    </p>
                  </div>
                  {isTermsUnchecked && (
                    <div className="alert alert-danger text-center" role="alert">
                      You should accept Terms&amp;Conditions!
                    </div>
                  )}
                  <FormButton isDisabled={ !cartItems || cartItems.length < 0 || globalCheckState} isLoading={loadButton} type="submit">
                    CHECKOUT
                  </FormButton>
                </form>
                {/* :
                    <form onSubmit={handleBankTransfer}>
                        <p className="label">Bank Name</p>
                        <CreditCardNumberInput value = {bankInfo.bankName} handleChange = {(event) => setBankInfo({ ...bankInfo, bankName: event.target.value})} forCC={false} placeHolder="bank name" required/>
                        
                        <p className="label mt-2">Bank Account Number</p>
                        <CreditCardNumberInput value = {bankInfo.bankNumber} handleChange = {(event) => setBankInfo({ ...bankInfo, bankNumber: event.target.value})} forCC={false} placeHolder="bank account number" required/>
                        
                        <p className="label mt-2">ABA Routing Number</p>
                        <CreditCardNumberInput value = {bankInfo.ABANumber} handleChange = {(event) => setBankInfo({ ...bankInfo, ABANumber: event.target.value})} forCC={false} placeHolder="ABA number" required/>
                        
                        <p className="label mt-2">Name On Account</p>
                        <CreditCardNumberInput value = {bankInfo.accountName} handleChange = {(event) => setBankInfo({ ...bankInfo, accountName: event.target.value})} forCC={false} placeHolder="account name" required/>
                        
                        <p className="label mt-2">Bank Account Type</p>
                        <FormSelect forPayment = {true} options={selectOptions} showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                            setOptionShow(false);
                            setCurrentType(event.target.id);
                        }} optionShow={optionShow} placeholder={currentType}/>
                        <div className = 'checkbox-container  mb-4 mt-4'>
                            <FormCheckbox Notif = {isTermsChecked} handleChange = {()=> 
                                setIsTermsChecked(!isTermsChecked)}/>
                            <p className="grey-text">I confirm that I have understood I am buying a webinar and I have read the &nbsp;<Link to='/term_condition_page' className='underline'>Terms and Conditions</Link></p>
                        </div>
                        {
                            isTermsUnchecked&&<div className="alert alert-danger text-center" role="alert">
                                            You should accept Terms&amp;Conditions!
                                        </div>
                        } 
                        <FormButton isLoading={loadButton} type="submit">CHECKOUT</FormButton>
                    </form>
                } */}
                <br/>
                <p style={{color: fontColors.header1, fontSize: '20px'}} className="text-right mt-4 pt-4">Your receipt will come from Mata’s Tactical Supply</p>
            </div>
          </MDBCol>
        </MDBRow>
      </div>
  );
};

const MapStateToProps = ({ colors: { currentFontColors }, user: {isReloadCartItems, globalCheckState} }) => ({
  currentFontColors,
  isReloadCartItems,
  globalCheckState
});

const MapDispatchToProps = (dispatch) => ({
  purchaseProducts: purchaseProducts(dispatch),
  setIsReloadCartItems: flag => dispatch(setIsReloadCartItems(flag)),
  getCurrentUser: getCurrentUser(dispatch),
  setIsStartCountDown: flag => dispatch(setIsStartCountDown(flag)),
  setHideRefreshedTimer: () => dispatch(setHideRefreshedTimer()),
  changeCheckOutStatus: state => dispatch(changeCheckOutStatus(state)),
  setLoadAlerts: flag => dispatch(setLoadAlerts(flag)) 
});

export default connect(MapStateToProps, MapDispatchToProps)(CheckOutForm);
