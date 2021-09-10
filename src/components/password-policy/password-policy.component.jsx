import React from 'react';
import './password-policy.style.scss';
import { MDBIcon } from 'mdbreact';

const PasswordPolicy = ({handleClose}) => (
    <div className="wrapper">
        <div className="triangleDiv"></div>
        <div className="passPolicyDiv">
            <div className="closeIconDiv">
                <p className="text-left font-weight-bold">Password Policy</p>
                <MDBIcon className="closeBtn" icon="times" onClick={handleClose} />
            </div>
            <p className="text-left font-weight-bolder">Password should contain:</p>
            <ul className="text-left mb-0 font-weight-bolder">
                <li>Minimum length of 6 characters</li>
                <li>Numerical characters(0-9)</li>
                <li>Uppercase characters</li>
                <li>Lowercase characters</li>
            </ul>
        </div>
    </div>
);

export default PasswordPolicy;