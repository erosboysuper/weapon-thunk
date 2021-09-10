import React, { useState, useEffect, useMemo } from 'react';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBRow, MDBCol } from 'mdbreact';
import { updateCurrentUser } from '../../redux/user/user.action';
import { connect } from 'react-redux';
import FormSelect from '../form-select/form-select.component';
import FormButton from '../form-button/form-button.component';
import { useAlert } from 'react-alert';
import CreditCardNumberInput from '../payment-form/ccNum-input/ccNum-input.component';
import './saveCCInfo.style.scss';

const { REACT_APP_ACCEPT_CLIENT_KEY, REACT_APP_ACCEPT_API_LOGIN_ID } = process.env;

const SavedCCInfo = ({ updateCurrentUser, setCCNum, profileInfo, fontColors, isSaved }) => {

    const alert = useAlert();

    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fields, setFields] = useState({
        card: "",
        month: "month",
        year: "year",
        cvc: "",
    });

    useEffect(() => {
        console.log(fields);
    }, [fields]);

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

    const handlerCard = ({ target }) => {
        const value = target.value ? target.value.replace(/[\sa-zA-z]/g, "").trim() : "";
        const card = value
          ? value
              .match(/.{1,4}/g)
              .join(" ")
              .substr(0, 19)
          : "";
        console.log(card);
        setFields({ ...fields, card });
      };

      const cvcNumberFormat = (e) => {
        const re = /^[0-9\b]+$/;
        // if value is not blank, then test the regex
    
        if (e.target.value === "" || re.test(e.target.value)) {
          setFields({ ...fields, cvc: e.target.value });
        }
      };

    const sendPaymentDataToAnet = () => {
        const authData = {};
        authData.clientKey = REACT_APP_ACCEPT_CLIENT_KEY;
        authData.apiLoginID = REACT_APP_ACCEPT_API_LOGIN_ID;
    
        const cardData = {};
        cardData.cardNumber = fields.card.replace(/\s/g, "");
        cardData.month = fields.month;
        cardData.year = fields.year;
        cardData.cardCode = fields.cvc;
    
        const secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;
    
        return new Promise((resolve, reject) => {
          window.Accept.dispatchData(secureData, (res) => {
            if (res.messages.resultCode === "Error") return reject(res);
            resolve(res);
          });
        });
      };

    const changeCCFunc = async () => {
        setIsLoading(true);
        
        sendPaymentDataToAnet()
        .then(async (res) => {
            const { opaqueData } = res;
            const body = profileInfo;
            body.opaqueData = opaqueData;
            const result = await updateCurrentUser(body);
            setIsLoading(false);
            if ( result === 'success') {
                alert.success("Updated successfully");
                setModalShow(false);
                setCCNum();
            }
            else
                alert.success("Failed");
        })
        .catch((err) => {          
            var i = 0;
            while (i < err.messages.message.length) {
                // only show the user the first error message
                if (i == 0) {
                    let error = err.messages.message[i].text;
                    alert.error(error);
                }	
                i = i + 1;
            }
            setIsLoading(false);                    
        });        
    }

    const submitDisabled = useMemo(
        () => {          
            return (
              fields.card.length < 18 ||
              fields.month === "month" ||
              ((Number(fields.year) === new Date().getFullYear() - 2000) && (Number(fields.month) < new Date().getMonth() + 1)) ||
              !fields.month ||
              fields.year === "year" ||
              !fields.year ||
              fields.cvc.length < 3
            )
        }
        ,
        [fields]
      );

    return(
        <div className="cc-wrapper">
            <span style={{color: isSaved ? 'white' : 'grey'}}>{ isSaved ? isSaved : 'Save Credit Card...'}</span>
            <div className="changeBtn" onClick={()=>setModalShow(!modalShow)}>{ isSaved ? 'Change' : 'Add'}</div>
            <MDBModal isOpen={modalShow} toggle={() => setModalShow(!modalShow)} centered>            
                <MDBModalBody>
                    <p className="label">Card Number</p>
                    <CreditCardNumberInput
                        value={fields.card}
                        onChange={handlerCard}
                        forCC={true}
                        style={{ color: fontColors.form }}
                        placeHolder="Card Number"                       
                        autoComplete="cc-number"
                    />                   
                    <MDBRow className="mb-4 mt-4">
                        <MDBCol size="6">
                            <p className="label">Expiration</p>
                            <FormSelect
                            forPayment={true}
                            options={selectOptions1}
                            showSelectBox={() => setOptionShow1(!optionShow1)}
                            selectOption={(event) => {
                                setOptionShow1(false);
                                setPlaceholder1(event.target.id);
                                setFields({
                                ...fields,
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
                            />                           
                        </MDBCol>
                        <MDBCol size="6">
                            <p className="label">&nbsp;</p>
                            <FormSelect
                            forPayment={true}
                            options={selectOptions2}
                            showSelectBox={() => setOptionShow2(!optionShow2)}
                            selectOption={(event) => {
                                setOptionShow2(false);
                                setPlaceholder2(event.target.id);
                                setFields({
                                ...fields,
                                year: event.target.id.slice(2),
                                });
                            }}
                            optionShow={optionShow2}
                            placeholder={placeholder2}                            
                            />                           
                        </MDBCol>
                        <MDBCol size="12">
                            <p className="label mt-2">CVC</p>

                            <input
                            className="cvc-input"
                            style={{ color: fontColors.form }}
                            type="text"
                            placeholder="CVC"
                            value={fields.cvc}
                            onChange={(event) => cvcNumberFormat(event)}
                            maxLength="4"
                            autoComplete="cc-csc"
                            />                            
                        </MDBCol>
                    </MDBRow>      
                </MDBModalBody>
                <MDBModalFooter>
                    <div className="btns">
                        <FormButton type='button' onClickFunc={changeCCFunc} isDisabled={submitDisabled || isLoading} isLoading={isLoading}>
                            SAVE
                        </FormButton>
                        <FormButton type='button' onClickFunc={() => setModalShow(!modalShow)}>
                            CANCEL
                        </FormButton>  
                    </div>                                                                   
                </MDBModalFooter>
            </MDBModal>
        </div>
    )
}

const MapDispatchToProps = dispatch => ({
    updateCurrentUser: updateCurrentUser(dispatch)
})
export default connect(null, MapDispatchToProps)(SavedCCInfo);