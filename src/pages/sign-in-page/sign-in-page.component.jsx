import React, {useState, useRef, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { getCurrentUser, setVerifiedUser, getVerifiedStatus } from '../../redux/user/user.action';
import { updateCurrentUser } from '../../redux/user/user.action';
import './sign-in-page.style.scss';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import PasswordPolicy from '../../components/password-policy/password-policy.component';
import VerifyCodeInput from '../../components/verify-code-input/verify-code-input.component';
import FormSelect from '../../components/form-select/form-select.component';
import Input from 'react-phone-number-input/input';
import { MDBIcon } from 'mdbreact';
import { useAlert } from 'react-alert';
import { Helmet} from 'react-helmet';

const SignInPage = ({getCurrentUser, setVerifiedUser, getVerifiedStatus, updateCurrentUser,  currentFontColors}) => {

    const alert = useAlert();

    const [fontColors, setFontColors] = useState({
        header1: "white",
        header2: "white",
        paragraph: "#a3a3a3",
        form: "#a3a3a3"
    });
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color && currentFontColors.paragraph_color && currentFontColors.form_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);
            const formColor = JSON.parse(currentFontColors.form_color);
            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                form: `rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`                
            })
        }
    }, [currentFontColors]);

    const [credential, setCredential] = useState({ email:'', pass:'', confirmcode:''});
    const [wrongPassPolicy, setWrongPassPolicy] = useState(false);
    
    //For resend code
    const [resentCode, setResentCode] = useState(false);
    const [isResend, setIsResend] = useState(false);
    const [userVerified, setUserVerified] = useState(false);
    const [updateCodeSent, setUpdateCodeSent] = useState(false);

    // For reverify
    const [reverifyPhone, setReverifyPhone] = useState(false);
    const [changePhone, setChangePhone] = useState(false);
    const selectOptions = ["Reverify", "Change"];
    const [optionShow, setOptionShow] = useState(false);
    const [placeholder, setPlaceholder] = useState("Reverify");    
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    //For Phone number regex
    const [phone, setPhone] = useState('');

    let userData = useRef(null);
    let userToken = useRef(null);

    const passwordValidator = require('password-validator');
    const schema = new passwordValidator();

    schema
    .is()
    .min(6)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits();

    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        setWrongPassPolicy(false);
        event.preventDefault();
        if(schema.validate(credential.pass)){
            if(isLoading)
                return;
            setIsLoading(true);
            localStorage.removeItem('userData');

            try {
                const reuslt = await Auth.signIn(credential.email, credential.pass);
  
                const sessionResult = await Auth.userSession(reuslt);              
                
                userData.current = await getVerifiedStatus(credential.email);

                if(userData.current.is_verified){
                    const firstName = await getCurrentUser({email: credential.email});
                    if (firstName)
                        history.push("/product", {firstName: firstName,prodType: localStorage.getItem('resignProdType') ? localStorage.getItem('resignProdType') : "webinar"});
                    else
                        alert.error("Not registered user! Check and try again.");
                }
                else{       
                    setIsLoading(false);                                                   
                    if(!userData.current.is_phone_verified){
                        console.log(sessionResult);
                        userToken.current = sessionResult.idToken.jwtToken;
                        setReverifyPhone(true);                        
                    }            
                    
                }
                
            } catch (error) {
                console.log(error);
                if(error.code === "UserNotConfirmedException") {
                                    
                    userData.current = await getVerifiedStatus(credential.email);
                    
                    await Auth.resendSignUp(credential.email);
                    setResentCode(true);
                }                    
                else
                    alert.error("The username and/or password combination is incorrect.");
                setIsLoading(false);
            }
        }
        else
            setWrongPassPolicy(true);    
    }

    const handleClose = () => {
        setWrongPassPolicy(false)
    }

    const resendVerificationCode = async () => {
        if(isLoading)
            return;
        setIsResend(true);
        try {
            await Auth.resendSignUp(credential.email);
            setIsResend(false);
        } catch (error) {
            alert.error(error.message);
            setIsResend(false);
        }
    }

    const resendReverificationCode = async () => {
        if(isLoading)
            return;
        setIsResend(true);
        try {
            await Auth.verifyCurrentUserAttribute("phone_number")            
            setIsResend(false);
        } catch (error) {
            alert.error(error.message);
            setIsResend(false);
        }
    }

    const handleReverifiedPhoneSubmit = async (event) => {

        event.preventDefault();
        if(placeholder === "Reverify"){            
            setUpdateCodeSent(true);
            try {
                await Auth.verifyCurrentUserAttribute("phone_number");    
            } catch (error) {
                alert.error(error.message);
            } 
        }
        else{
            setChangePhone(true);
        }                    
    }

    const handlUpdateConfirmSubmit = async (event) => {
        event.preventDefault();

        if(isLoading)
            return;

        setIsLoading(true);

        try {      

            await Auth.verifyCurrentUserAttributeSubmit("phone_number", credential.confirmcode);
            await setVerifiedUser(credential.email, userData.current.is_email_verified, true);                       

            setIsLoading(false);
            setUpdateCodeSent(false);
            setUserVerified(true);

        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const handleConfirmSubmit = async event => {
        event.preventDefault();
        if(isLoading)
            return;
        setIsLoading(true);
        
        try {
            await Auth.confirmSignUp(credential.email, credential.confirmcode);
            await setVerifiedUser(credential.email);
            setIsLoading(false);
            setResentCode(false);
            setUserVerified(true);
        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const handleVerifiedSubmit = async event => {
        event.preventDefault();        
        setUserVerified(false);
        setReverifyPhone(false);
        setChangePhone(false);
        history.push("/signin");
    }

    const validatePhoneNumber = (num) => {
        var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneNumberPattern.test(num);
    }

    const changePhoneFunc = async (event) => {
        event.preventDefault(); 
        if (isLoading)
            return

        if( ( phone.trim() === "" ) || !validatePhoneNumber(phone.slice(2))) {
            setIsPhoneValid(true);
            return;
        }
        console.log(userData.current.is_verified, userData.current.is_phone_verified);
        userData.current.phone_number = phone;
        setIsLoading(true);

        const data = await getCurrentUser({email: credential.email}, "fromDB", userToken.current);

        userData.current.id = data.id;
     
        await updateCurrentUser(userData.current, userToken.current);

        const user = await Auth.currentAuthenticatedUser();          
        await Auth.updateUserAttributes(user, { phone_number: phone });
        setUpdateCodeSent(true);        
        setIsLoading(false);

    }

    return(        
        <div className = 'sign-in-page'>
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Sign in</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Sign into Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Sign in" />
                <meta
                itemprop="description"
                content="Sign into Mata's Tactical Supply"
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Sign in" />
                <meta
                property="og:description"
                content="Sign into Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Sign in" />
                <meta
                name="twitter:description"
                content="Sign into Mata's Tactical Supply"
                />          
            </Helmet>
            {
                userVerified ? 
                <div className='login-form verified-form'>
                    <form onSubmit={handleVerifiedSubmit}>
                        <div>
                            <MDBIcon far icon="check-circle" className="verified-icon"/>
                        </div>
                        <h1 className='text-center font-weight-bold' style={{color: fontColors.header1}}>Verified!</h1>
                        <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>Congratulations! You have successfully verified the account.</p>
                        <FormButton type="submit">GO TO LOGIN</FormButton>
                    </form>
                </div>
                :
                resentCode ? 
                <div className='login-form verify-form'>
                    <VerifyCodeInput 
                        handleConfirmSubmit={handleConfirmSubmit} 
                        email_or_phone={userData.current.verified_method === "phone" ? "Phone" : "Email"} 
                        phone={userData.current.phone_number} 
                        credential={credential} 
                        setCredential={setCredential} 
                        resendCode={resendVerificationCode} 
                        isResend={isResend}
                        isShowResend={true}
                        isLoading={isLoading}/>
                </div>
                :
                updateCodeSent ?
                <div className='login-form verify-form'>
                    <VerifyCodeInput
                        handleConfirmSubmit={handlUpdateConfirmSubmit}
                        email_or_phone={"Phone"}
                        phone={userData.current.phone_number} 
                        credential={credential}
                        setCredential={setCredential}
                        resendCode = { ()=> resendReverificationCode()}
                        isResend={isResend}
                        isShowResend={true}
                        isLoading={isLoading} />
                </div>
                :
                changePhone ?
                <div className='login-form unverified-form'>
                    <form onSubmit={ changePhoneFunc }>
                    <h2 className="text-center font-weight-bold" style={{color: fontColors.header1}}>Change your phone</h2>
                    <div className = 'phone-group'>
                        <Input
                            className = {`${isPhoneValid ? 'red-outline' : ''} phone-input`}
                            country = "US"
                            value={phone}
                            onChange={setPhone}
                            autocomplete="tel"
                            style={{color: fontColors.form}}
                        />                 
                        <label className = {`${phone ? 'shrink' : ''} ${isPhoneValid ? 'red-label' : ''} phone-input-label`}>Phone Number*</label>
                        {
                            isPhoneValid && <p className="text-danger text-left changeP">Invalid phone number</p>
                        }
                    </div>
                    <FormButton type="submit" isLoading={isLoading}>CHANGE</FormButton>
                    </form>
                </div>
                :
                reverifyPhone ?
                <div className='login-form unverified-form'>
                    <form onSubmit={ handleReverifiedPhoneSubmit }>
                        <div className="icon-div">
                            <MDBIcon far icon="times-circle" className="unverified-icon"/>
                        </div>
                        <h2 className='text-center font-weight-bold' style={{color: fontColors.header1}}>You are not verified!</h2>
                        <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>You should reverify or change your Phone <span>({userData.current.phone_number})</span> again.</p>
                        <FormSelect options={selectOptions} label={placeholder === "Reverify" ? "Reverify your phone" : "Change your phone" } showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                            setOptionShow(false);
                            setPlaceholder(event.target.id);
                        }} optionShow={optionShow} placeholder={placeholder}/>
                        <FormButton type="submit" isLoading={isLoading}>NEXT</FormButton>
                    </form>
                </div>
                :
                <div className='login-form'>
                    <form onSubmit={handleSubmit}>
                        <h2 className='login-title font-weight-bold' style={{color: fontColors.header1}}>Log into your account</h2>
                        <FormInput type="email" name = "email" label = "E-mail" value = {credential.email} handleChange = {(event) => setCredential({ ...credential, email: event.target.value.toLowerCase()})} required/>
                        <FormInput type="password" name = "pass" label = "Password" value = {credential.pass} handleChange = {(event) => setCredential({...credential, pass: event.target.value})} required/>
                        {
                            wrongPassPolicy&&<div className="passPolicyContainer">
                                    <PasswordPolicy handleClose={handleClose}/>
                                </div>
                        }
                        <FormButton type="submit" isLoading={isLoading}>LOG IN</FormButton>
                        <p className='mt-3'><Link to='/forgot-password' className='ft-400' style={{color: fontColors.header2}}>Forgot Password ?</Link></p>
                        <p className='ft-400' style={{color: fontColors.paragraph}}>Don't have an account?&nbsp;<Link to='/signup' className='underline' style={{color: fontColors.header2}}>Sign Up</Link></p>
                    </form>        
                </div>
            }            
        </div>
    );
};

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getCurrentUser: getCurrentUser(dispatch),
    setVerifiedUser: setVerifiedUser(dispatch),
    getVerifiedStatus: getVerifiedStatus(dispatch),
    updateCurrentUser: updateCurrentUser(dispatch)
})

export default connect(MapStateToProps, MapDispatchToProps)(SignInPage);