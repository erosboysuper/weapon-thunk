import React, {Fragment} from 'react';
import './form-checkbox.style.scss';
import { MDBIcon } from 'mdbreact';

const FormCheckbox = ({Notif, handleChange, disabled}) => (
    <Fragment>
        <div className = {`${Notif&&'checked'} ${disabled&&'disabled'} checkbox-div`} onClick={handleChange}>
            {
                Notif&&<MDBIcon icon="check" className='checked-icon'/>
            }            
        </div>
    </Fragment>
);

export default FormCheckbox;