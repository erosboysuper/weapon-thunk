import React, {useState, useEffect, useRef} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { setCurrentUser, setVerifiedUser } from '../../redux/user/user.action';
import './sign-up-page.style.scss';
import FormInput from '../../components/form-input/form-input.component';
import FormButton from '../../components/form-button/form-button.component';
import FormSelect from '../../components/form-select/form-select.component';
import Input from 'react-phone-number-input/input';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import PasswordPolicy from '../../components/password-policy/password-policy.component';
import { MDBIcon } from 'mdbreact';
import NotificationSelect from '../../components/notification-select/notification-select.component';
import VerifyCodeInput from '../../components/verify-code-input/verify-code-input.component';
import Autocomplete from 'react-google-autocomplete';
import { useAlert } from 'react-alert';
import { Helmet } from 'react-helmet';

const SignUpPage = ({ setCurrentUser, setVerifiedUser, currentFontColors }) => {

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

    const alert = useAlert();

    const [credential, setCredential] = useState({ email:'', firstname:'', lastname:'', address:'', street_address: '', city: '', state: '', zipcode: '', password:'', confirmpassword:'', confirmcode:''});
    const [newUser, setNewUser] = useState(null);
    const [userVerified, setUserVerified] = useState(false);

    //For selecting verification methods 
    const [isSelectedVerify, setIsSelectedVerify] = useState(false);
    const selectOptions = ["Email","Phone"];
    const [optionShow, setOptionShow] = useState(false);
    const [placeholder, setPlaceholder] = useState("Email");

    //For Phone number regex
    const [phone, setPhone] = useState();

    //For resend code
    const [isResend, setIsResend] = useState(false);

    const [notification, setNotification] = useState({product: false, webinar: false, terms: false});
    const [prodNot,setProdNot] = useState({phone: false, email: false});
    const [webinarNot,setWebinarNot] = useState({phone: false, email: false});
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [wrongPassPolicy, setWrongPassPolicy] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [backPage, setBackPage] = useState(null);

    const historyURL = useHistory();

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

    const handleClose = () => {
        setWrongPassPolicy(false)
    }

    const validatePhoneNumber = (num) => {
        var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneNumberPattern.test(num);
    }

    const validateEmail = (email) => {
        var emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return emailPattern.test(email); 
    }

    const handleSubmit = async event => {

        console.log(webinarNot);

        setBackPage(null); // go the the next page in order

        if (isLoading) 
            return;
        
        event.preventDefault();
        setWrongPassPolicy(false);
        setIsPhoneValid(false);
        setIsEmailValid(false);

        if(!validateEmail(credential.email)) {
            setIsEmailValid(true);
            return;
        }

        if(!validatePhoneNumber(phone.slice(2))) {
            setIsPhoneValid(true);
            return;
        }       

        if(schema.validate(credential.password)){   
            if( credential.password === credential.confirmpassword ){
                if( notification.terms === false )
                    setIsTermsChecked(true);
                else{
                    setIsLoading(true);
                    try {
                        await Auth.confirmSignUp( credential.email, '000000');                        
                    } catch (error) {
                        if (error.code === "UserNotFoundException") {
                            setIsSelectedVerify(true);
                        }
                        else
                            alert.error("An account with the given email already exists.");
                    }                    
                    setIsLoading(false);
                }
                   
            }
            else{
                alert.error("Password mismatch!");
            }
        }
        else {
            setWrongPassPolicy(true);
        }
    }

    const newUserAttrs = useRef({});
    const saveToDB = async (userId) => {
        try {
            // Store user info into Database
            let notify_product_val = "";
            let notify_webinar_val = "";
            
            if(notification.product){
                if(prodNot.phone&&prodNot.email)
                    notify_product_val = "email and phone";
                else if(prodNot.phone&&!prodNot.email)
                    notify_product_val = "phone";
                else if(!prodNot.phone&&prodNot.email)
                    notify_product_val = "email";
                else
                    notify_product_val = "none";
            }                
            else
                notify_product_val = "none";

            if(notification.webinar){
                if(webinarNot.phone&&webinarNot.email)
                    notify_webinar_val = "email and phone";
                else if(webinarNot.phone&&!webinarNot.email)
                    notify_webinar_val = "phone";
                else if(!webinarNot.phone&&webinarNot.email)
                    notify_webinar_val = "email";
                else 
                    notify_webinar_val = "none";
            }                
            else
                notify_webinar_val = "none";

            let userInfo = {
                id: userId,
                email: credential.email,
                username: credential.firstname + " " + credential.lastname,
                first_name: credential.firstname,
                last_name: credential.lastname,
                address: credential.street_address + ', ' + credential.city + ', ' + credential.state + " " + credential.zipcode + ", USA",
                street_address: credential.street_address,
                city: credential.city,
                state: credential.state,
                zipcode: credential.zipcode,
                phone_number: phone,
                notify_products: notify_product_val,
                notify_webinar: notify_webinar_val,
                verified_method: "phone",
                is_verified: false,
                is_email_verified: true,
                is_phone_verified: true,
                user_role: "consumer"
            };
            newUserAttrs.current.attributes.phone_number ? 
                userInfo.verified_method = "phone"
                :
                userInfo.verified_method = "email"
            const storeResult = await setCurrentUser(userInfo);
                return storeResult;
        } catch (e) {
            alert.error(e.message);
            setIsLoading(false);
        }
    }

    const handleSelectVerifySumbit = async event => {
        event.preventDefault();
        if(isLoading)
            return;
        setIsLoading(true);        
        placeholder === "Email" ?
               newUserAttrs.current = {
                    username: credential.email,
                    password: credential.password,
                    attributes : {
                        email: credential.email
                    }
                }
            :
                newUserAttrs.current = {
                    username: credential.email,
                    password: credential.password,
                    attributes : {
                        email: credential.email,
                        phone_number: phone
                    }
                }

        try {
            const newUser = await Auth.signUp(newUserAttrs.current);
   
            const storeResult = await saveToDB(newUser.userSub);
            setIsLoading(false);
            if(storeResult === "success")                
                setNewUser(newUser);
            else
                alert.error("Database error!");
                   
        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }

    }

    const resendCode = async () => {
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

    const handleConfirmSubmit = async event => {
        event.preventDefault();
        if(isLoading)
            return;
        setIsLoading(true);
        console.log(credential.confirmcode);
        try {
            await Auth.confirmSignUp(credential.email, credential.confirmcode);
            const result = await setVerifiedUser(credential.email);
            if (result)                
                setUserVerified(true);
            else
                alert.error("Database error");
            setIsLoading(false);
                
        } catch (error) {
            alert.error(error.message);
            setIsLoading(false);
        }
    }

    const handleVerifiedSubmit = async event => {
        event.preventDefault();        
        setUserVerified(false);
        historyURL.push("/signin");
    }

    const getAddressFunc = place => {
        console.log(place);
        const newArray = place.formatted_address.split(", ");
        console.log(newArray);
        let tempStreet = "";
        let tempCity = "";
        let tempState = "";
        let tempZip = "";
        if (newArray.length === 4) {
            tempStreet =  newArray[newArray.length - 4];
            tempCity = newArray[newArray.length - 3];
            tempState = newArray[newArray.length - 2].split(" ")[0];
            tempZip = newArray[newArray.length - 2].split(" ")[1] ? newArray[newArray.length - 2].split(" ")[1] : "";
           
        }
        else {
            tempStreet =  newArray[0];

        }
        setCredential({
            ...credential, 
            street_address: tempStreet,
            city: tempCity,
            state: tempState,
            zipcode: tempZip
        });
    }

    const backBtnStyle = {
        "position": "relative",
        "margin-top":"20px",
        "border-radius": "50px",
        "width": "auto",
        "padding-left": "20px",
        "padding-right": "20px",
        "text-align": "center",
        "height": "47px",
        "width": "100%",
        "background-color": "#a0a0a0",
        "border": "none",
        "outline": "none",
    }

    const renderForm = () => (
        <div className='sign-up-form'>
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Register</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Register to Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Register" />
                <meta
                itemprop="description"
                content="Register to Mata's Tactical Supply"
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Register" />
                <meta
                property="og:description"
                content="Register to Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Register" />
                <meta
                name="twitter:description"
                content="Register to Mata's Tactical Supply"
                />          
            </Helmet>
            <form onSubmit={handleSubmit}>
                <h2 className='text-center font-weight-bold sign-up-title' style={{color: fontColors.header1}}>Create your account</h2>
                <FormInput type="email" name = 'email' label = 'E-mail*' value = {credential.email} handleChange = {(event) => setCredential({ ...credential, email: event.target.value.toLowerCase()})} changeEmail={isEmailValid} required autocomplete="email"/>
                {
                    isEmailValid && <p className="text-danger changeP">Invalid email address</p>
                }
                <FormInput type="text" name = 'firstname' label = 'First Name*' value = {credential.firstname} handleChange = {(event) => setCredential({...credential, firstname: event.target.value})} autocomplete="given-name" required/>
                <FormInput type="text" name = 'lastname' label = 'Last Name*' value = {credential.lastname} handleChange = {(event) => setCredential({ ...credential, lastname: event.target.value})} autocomplete="family-name" required/>
                <div className="phone-group">
                    <Autocomplete
                        className="phone-input"
                        placeholder=""
                        value = {credential.street_address}
                        onChange = {(e)=> setCredential({...credential, street_address: e.target.value})}
                        onPlaceSelected={ place => getAddressFunc(place)}
                        types={['address']}
                        componentRestrictions={{country: "us"}}
                        style={{color: fontColors.form}}
                        required
                    />
                     <label className = {`${credential.street_address ? 'shrink' : ''} phone-input-label`}>Street Address*</label>
                </div>
                <FormInput type="text" name='city' label='City*' value={credential.city} handleChange={(event) => setCredential({ ...credential, city: event.target.value })} required />
                <FormInput type="text" name='state' label='State*' value={credential.state} handleChange={(event) => setCredential({ ...credential, state: event.target.value })} required />
                <FormInput type="text" name='zip' label='Zipcode*' value={credential.zipcode} handleChange={(event) => setCredential({ ...credential, zipcode: event.target.value })} required />
               
                
                {/* <FormInput type="text" name = 'address' label = 'Address*' value = {credential.address} handleChange = {(event) => setCredential({...credential, address: event.target.value})} required/> */}
                <div className = 'phone-group'>
                    <Input
                        className = {`${isPhoneValid ? 'red-outline' : ''} phone-input`}
                        country = "US"
                        value={phone}
                        onChange={setPhone}
                        autocomplete="tel"
                        style={{color: fontColors.form}}
                        required/>                 
                    <label className = {`${phone ? 'shrink' : ''} ${isPhoneValid ? 'red-label' : ''} phone-input-label`}>Phone Number*</label>
                    {
                        isPhoneValid && <p className="text-danger changeP">Invalid phone number</p>
                    }
                </div>
                <FormInput type="password" name = 'password' label = 'Password*' value = {credential.password} handleChange = {(event) => setCredential({...credential, password: event.target.value})} required/>
                {
                    wrongPassPolicy&&<div className="passPolicyContainer">
                            <PasswordPolicy handleClose={handleClose}/>
                        </div>
                }
                <FormInput type="password" name = 'confirmpassword' label = 'Confirm Password*' value = {credential.confirmpassword} handleChange = {(event) => setCredential({...credential, confirmpassword: event.target.value})} required/>
                
                <NotificationSelect title="Notifications for new products" notif = {notification.product} handleChange = {() => {
                    setNotification({...notification, product: !notification.product});
                    setProdNot({phone: false, email: false});
                    }} emailNotif = {prodNot.email} emailNotifChange = {()=>setProdNot({...prodNot, email: !prodNot.email})} phoneNotif = {prodNot.phone} phoneNotifChange = {()=>setProdNot({...prodNot, phone: !prodNot.phone})}/>
                <NotificationSelect title="Get notified when your purchased video webinar goes live" isSMS={true} notif = {notification.webinar} handleChange = {() => {
                    setNotification({...notification, webinar: !notification.webinar});
                    setWebinarNot({phone: false, email: false});
                    }} emailNotif = {webinarNot.email} emailNotifChange = {()=>setWebinarNot({phone: webinarNot.email, email: !webinarNot.email})} phoneNotif = {webinarNot.phone} phoneNotifChange = {()=>setWebinarNot({email: webinarNot.phone, phone: !webinarNot.phone})}/>
                <div className = 'checkbox-container'>
                    <FormCheckbox Notif = {notification.terms} handleChange = {()=> 
                        setNotification({...notification, terms: !notification.terms})}/>
                    <span className="ft-500" style={{color: fontColors.paragraph}}>I understand and accept all the&nbsp;<Link to='/term_condition_page' className='underline' style={{color: fontColors.header2}}>Terms and Conditions</Link>&nbsp;of this site</span>
                </div>
                {
                    isTermsChecked&&<div className="alert alert-danger text-center" role="alert">
                                        You should accept Terms&amp;Conditions!
                                    </div>
                }        
                <br/>
                <FormButton type="submit" isLoading={isLoading}>CREATE YOUR ACCOUNT</FormButton>
                <p className='text-center ft-500 mt-4' style={{color: fontColors.paragraph}}>Already have an account?&nbsp;<Link to='/signin' className='underline' style={{color: fontColors.header2}}>Log in</Link></p>
            </form>
        </div>
    )

    const renderSelectVerifyForm = () => (  
        
        <div className="sign-up-form select-verify-form">
            <form onSubmit={handleSelectVerifySumbit}>
                <h2 className="text-center font-weight-bold sign-up-title" style={{color: fontColors.header1}}>Verify your account</h2>
                <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>Select your email address or phone number to verify your account.</p>
                <FormSelect options={selectOptions} label={`Verify your ${placeholder}`} showSelectBox={()=>setOptionShow(!optionShow)} selectOption={(event)=>{
                    setOptionShow(false);
                    setPlaceholder(event.target.id);
                }} optionShow={optionShow} placeholder={placeholder}/>
                <h3 className="text-center" style={{color: fontColors.header2}}>Verify {placeholder}</h3>
                <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>Use the link below to verify your {placeholder} and start enjoying Mata's Tactical Supply.</p>
                <FormButton type="submit" isLoading={isLoading}>VERIFY {placeholder.toUpperCase()}</FormButton>
            </form>
        </div>
        
    )

    const renderConfirmForm = () => (
        <>
        <div className='sign-up-form code-confirm-form'>
            <VerifyCodeInput 
                handleConfirmSubmit={handleConfirmSubmit} 
                email_or_phone={placeholder} 
                phone={phone} 
                credential={credential} 
                setCredential={setCredential} 
                resendCode={resendCode} 
                isResend={isResend}
                isShowResend={true}
                isLoading={isLoading}/>
        </div>
        </>
    )

    const renderVerifiedForm = () => (
        <div className='sign-up-form verified-form'>
            <form onSubmit={handleVerifiedSubmit}>
                <div>
                    <MDBIcon far icon="check-circle" className="verified-icon"/>
                </div>
                <h1 className='font-weight-bold text-center' style={{color: fontColors.header1}}>Verified!</h1>
                <p className="text-center font-weight-bolder" style={{color: fontColors.paragraph}}>Congratulations! You have successfully verified the account.</p>
                <FormButton type="submit">GO TO LOGIN</FormButton>
            </form>
        </div>
    )


    return(
        <>
        <div className = 'sign-up-page'>

            {   
                 userVerified === true ? 
                    renderVerifiedForm() :
                        newUser ? 
                            renderConfirmForm() : 
                            isSelectedVerify === false ? 
                                renderForm() : renderSelectVerifyForm() 
            }
        </div>
        
        </>
    );
}

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    setCurrentUser: setCurrentUser(dispatch),
    setVerifiedUser: setVerifiedUser(dispatch)
})
export default connect(MapStateToProps,MapDispatchToProps)(SignUpPage);