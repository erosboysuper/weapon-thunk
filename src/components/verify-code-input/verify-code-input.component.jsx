import React, {useState, useEffect} from 'react';
import './verify-code-input.style.scss';

import { MDBIcon } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { connect } from 'react-redux';

const VerifyCodeInput = ({
        handleConfirmSubmit, 
        email_or_phone, 
        phone, 
        credential,
        setCredential,
        resendCode,
        isResend, 
        isLoading,
        isShowResend,
        currentFontColors}) => {

        const [fontColor, setFontColor] = useState({header1: "white", header2: "white", paragraph: "#a3a3a3"});
        useEffect(() => {
            if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color && currentFontColors.paragraph_color) {
                const h1Color = JSON.parse(currentFontColors.header1_color);                
                const h2Color = JSON.parse(currentFontColors.header2_color);
                const pColor = JSON.parse(currentFontColors.paragraph_color);
                setFontColor({
                    header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                    header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                    paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                })
            }
        }, [currentFontColors]);

        const refs = {0: React.createRef(),
                      1: React.createRef(), 
                      2: React.createRef(), 
                      3: React.createRef(), 
                      4: React.createRef(), 
                      5: React.createRef(), 
                  }

        const [codeInput, setCodeInput] = useState({0:'', 
                                                    1:'', 
                                                    2:'', 
                                                    3:'', 
                                                    4:'', 
                                                    5:''});
     useEffect(() => {
      setCredential({...credential, confirmcode: Object.values(codeInput).join("")});    
     }, [codeInput])

    const handleTextChange = e=> {
        const {id} = e.target.dataset;

        setCodeInput({...codeInput, [id]:e.target.value.replace(/\D/g, "").replace(codeInput[id], "")[0]});

        if (e.target.value.length === 0) return;
        if (id === "5") return;

        refs[Number(id) + 1].current.focus();
        }

     const handleDelete = e => {
        if (e.keyCode === 8){
                const {id} = e.target.dataset;
                setCodeInput({...codeInput, [id]: ""});

                if (id === "0"){
                    return;
                }
                else{
                    refs[Number(id) - 1].current.focus();
                }
        }
        
    }

    const handlePaste = (e) => {
    e.preventDefault(); // pastes one char at a time by default
    let data = e.clipboardData.getData("text");
    let pasted = {};
    data.replace(/\D/g, "").split("").map((chr, i) => {
      if (i < 6){
        codeInput[i] = chr;
        refs[i].current.focus();
      }
      else {
        return;
      }
    });
     setCodeInput({...codeInput, ...pasted,});
  }

       
        return (
            <form onSubmit={handleConfirmSubmit} onPaste={handlePaste}>
                <h2 className='text-center font-weight-bold' style={{color: fontColor.header1}}>Verify your {email_or_phone}</h2>
                <p className="text-center my-p-color font-weight-bolder" style={{color: fontColor.paragraph}}>
                                                Please enter the 6 digit code sent to <span className="red-span">{
                    email_or_phone === "Phone" ? phone : credential.email
                }</span></p>
                <div className="code-input-group">
                    <input autoFocus={true} 
                           value={codeInput[0]} ref={refs[0]}
                           maxlength="1" 
                           data-id="0" id={`${email_or_phone}1`} 
                           type="tel" 
                           className="code-input" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange}  
                           autoComplete="off"/>

                    <input value={codeInput[1]} 
                           ref={refs[1]}
                           maxlength="1"  
                           data-id="1" 
                           id={`${email_or_phone}2`} 
                           type="tel" 
                           className="code-input" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange} 
                           autoComplete="off"/>

                    <input value={codeInput[2]} 
                           id={`${email_or_phone}3`} 
                           type="tel"
                           maxlength="1"  
                           className="code-input" 
                           ref={refs[2]} 
                           data-id="2" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange}  
                           autoComplete="off"/>

                    <input value={codeInput[3]} 
                           id={`${email_or_phone}4`} 
                           type="tel"
                           maxlength="1"  
                           className="code-input" 
                           ref={refs[3]} 
                           data-id="3" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange}  
                           autoComplete="off"/>

                    <input value={codeInput[4]} 
                           id={`${email_or_phone}5`} 
                           type="tel"
                           maxlength="1"  
                           className="code-input" 
                           ref={refs[4]}
                           data-id="4" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange} 
                           autoComplete="off"/>

                    <input value={codeInput[5]} 
                           id={`${email_or_phone}6`} 
                           type="tel"
                           maxlength="1"  
                           className="code-input" 
                           ref={refs[5]} 
                           data-id="5" 
                           onKeyDown={handleDelete}
                           onChange={handleTextChange} 
                           autoComplete="off"/>                    
                </div>
                {
                    isShowResend ?
                        <p className="text-center resend-param" style={{color: fontColor.header2}}><span onClick={resendCode}><strong>
                            RESEND CODE
                            {
                                isResend&&<MDBIcon className="load-sub-icon" icon="sync-alt" />
                            }
                        </strong></span></p>
                        :
                        <div className="pt-4 pb-4"></div>
                }
                <FormButton type="submit" isLoading={isLoading}>CONFIRM</FormButton>
            </form>
        )
};
const MapStateToProps = ({colors: {currentFontColors}}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(VerifyCodeInput);