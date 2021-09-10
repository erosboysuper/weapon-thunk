import React, {Fragment} from 'react';
import './ccNum-input.style.scss';
import { MDBIcon } from 'mdbreact';

const CreditCardNumberInput = ({value, handleChange, forCC, placeHolder, isInvalidNum, disabled, ...otherProps}) => (
    <div className={`${isInvalidNum ? "red-outline" : ""} ${disabled ? "isDisabled" : ""} ccNum-container`}>
        <input className="ccNum-input" placeholder={`${placeHolder}`} value={value} disabled={disabled} onChange = {handleChange} type="text" {...otherProps}/>
        {
        forCC && <Fragment>
                <MDBIcon className="ccNum-icon" fab icon="cc-mastercard" />
                <MDBIcon className="ccNum-icon" fab icon="cc-visa" />
        </Fragment>
        }
    </div>
)

export default CreditCardNumberInput;