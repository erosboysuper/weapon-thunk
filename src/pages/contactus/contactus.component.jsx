import React from 'react';
import './contactus.style.scss';
import { MDBRow, MDBCol } from 'mdbreact';
import FormInput from '../../components/form-input/form-input.component';
import { useState, useEffect } from 'react';
import FormButton from '../../components/form-button/form-button.component';
import Input from 'react-phone-number-input/input';
import { connect } from 'react-redux';
import { getContactDesc, sendContact } from '../../redux/others/others.action';
import { useAlert } from 'react-alert';
import { Helmet } from 'react-helmet';

const ContactUs = ({getContactDesc, contact_us_desc, sendContact, currentFontColors}) => {

    const [fontColors, setFontColors] = useState({
        header: "white",
        content: "#a3a3a3",
        form: "#a3a3a3"
    })
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.paragraph_color && currentFontColors.form_color) {
            const headerColor = JSON.parse(currentFontColors.header1_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);
            const formColor = JSON.parse(currentFontColors.form_color);

            setFontColors({
                header: `rgba(${headerColor.r }, ${headerColor.g }, ${headerColor.b }, ${headerColor.a })`,
                content: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                form: `rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`,
            })
        }
    }, [currentFontColors]);
    
    const alert = useAlert();
    const userData = JSON.parse(localStorage.getItem("userData"));

    //For Phone number regex
    const [phone, setPhone] = useState();

    const [contactInfo, setContactInfo] = useState({firstName:'', lastName: '', email: '', message:''});
    const [isSending, setIsSending] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        async function loadDesc(){
            await getContactDesc();
        }

        loadDesc();

       if (userData){
        setContactInfo({firstName: userData.first_name, lastName: userData.last_name, email: userData.email, message: ''});
        setPhone(userData.phone_number);
       }
        
    }, []);

    const validateEmail = (email) => {
        var emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return emailPattern.test(email); 
    }

    const validatePhoneNumber = (num) => {
        var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneNumberPattern.test(num);
    }

    const sendContactMessage = async (event) => {

        if (isSending) 
            return;
        setIsEmailValid(false);
        setIsPhoneValid(false);
        setIsSending(true);
        event.preventDefault();

        if(!validateEmail(contactInfo.email)) {
            setIsEmailValid(true);
            setIsSending(false);
            return;
        }

        if(!validatePhoneNumber(phone.slice(2))) {
            setIsPhoneValid(true);
            setIsSending(false);
            return;
        }

        const obj = {
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            email: contactInfo.email,
            phone: phone,
            message: contactInfo.message
        }

        const result = await sendContact(obj);
        if (result === "Success")
        {
            setIsSending(false);
            alert.success("Message sent successfully.");
        }
    }

    return (
        <div className="contact-us-page">      
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Contact Us</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Contact to Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Contact Us" />
                <meta
                itemprop="description"
                content="Contact to Mata's Tactical Supply"
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Contact Us" />
                <meta
                property="og:description"
                content="Contact to Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Contact Us" />
                <meta
                name="twitter:description"
                content="Contact to Mata's Tactical Supply"
                />          
            </Helmet> 
            <form className="contact-us-form" onSubmit={sendContactMessage}>
                <h2 className="text-center font-weight-bold mb-4" style={{color: fontColors.header}}>Contact Us</h2>
                {
                    contact_us_desc && <p className="text-center" style={{color: fontColors.content}}>{contact_us_desc}</p>
                    // :
                    // <p className="text-center">We'd like to hear from you, please drop us a line if you've any query related to our products and services.</p>
                }                
                <MDBRow>
                    <MDBCol size="12" sm="12" md="6" lg="6">
                        <FormInput 
                            type="text" 
                            label = "First Name" 
                            value = {contactInfo.firstName} 
                            handleChange = {(event) => setContactInfo({ ...contactInfo, firstName: event.target.value})} 
                            required/>
                    </MDBCol>
                    <MDBCol size="12" sm="12" md="6" lg="6">
                        <FormInput 
                            type="text"
                            label = "Last Name" 
                            value = {contactInfo.lastName} 
                            handleChange = {(event) => setContactInfo({ ...contactInfo, lastName: event.target.value})} 
                            required/>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol size="12" sm="12" md="6" lg="6">
                        <FormInput 
                            type="email" 
                            label = "Email Address" 
                            value = {contactInfo.email} 
                            handleChange = {(event) => setContactInfo({ ...contactInfo, email: event.target.value})} 
                            changeEmail={isEmailValid}
                            required/>
                        {
                            isEmailValid && <p className="text-danger changeP">Invalid email address</p>
                        }
                    </MDBCol>
                    <MDBCol size="12" sm="12" md="6" lg="6">
                        <div className = 'phone-group'>
                            <Input
                                className ={`${isPhoneValid ? 'red-outline' : ''} phone-input`}
                                country = "US"
                                value={phone}
                                onChange={setPhone}
                                style={{color: fontColors.form}}
                                required/>                 
                            <label className = {`${phone ? 'shrink' : ''}  ${isPhoneValid ? 'red-label' : ''} phone-input-label`}>Phone</label>
                            {
                                isPhoneValid && <p className="text-danger changeP">Invalid phone number</p>
                            }
                        </div>
                    </MDBCol>
                </MDBRow>
                <MDBRow className="mb-4">
                    <textarea placeholder="Message" value={contactInfo.message} style={{color: fontColors.form}} onChange={(e) => setContactInfo({ ...contactInfo, message:e.target.value})} required />
                </MDBRow>
                <MDBRow center>
                    <MDBCol size="8">
                        <FormButton type="submit" isLoading={isSending}>SUBMIT NOW</FormButton>
                    </MDBCol>
                </MDBRow>
            </form>
        </div>
    )
};

const MapStateToProps = ({others: {contact_us_desc}, colors: {currentFontColors}}) => ({
    contact_us_desc,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getContactDesc: getContactDesc(dispatch),
    sendContact: sendContact(dispatch)
})

export default connect(MapStateToProps, MapDispatchToProps)(ContactUs);