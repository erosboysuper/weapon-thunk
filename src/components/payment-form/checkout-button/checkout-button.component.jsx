import React,{ Fragment} from 'react';
import './checkout-button.style.scss';
import { MDBIcon } from 'mdbreact';

const CheckoutPayButton = ({payType, active, onClickFunc}) => (
    <Fragment>
        {
            payType === "card" ? 
                <button type="button" className={`${active ? 'active' : ''} payTypeBtn`} onClick={onClickFunc}><MDBIcon className="pay-icon" far icon="credit-card" /><span>Credit Card</span></button>
                :
                <button type="button" className={`${active ? 'active' : ''} payTypeBtn`} onClick={onClickFunc}><MDBIcon className="pay-icon" icon="exchange-alt" /><span>Bank Transfer</span></button>
        }
    </Fragment>
)

export default CheckoutPayButton;