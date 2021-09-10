import React, {Fragment} from 'react';
import './buy-physical.style.scss';
import CheckOutForm from '../../components/payment-form/check-out-form/check-out-form.component';
import { withRouter } from 'react-router';

const BuyPhysicalProductPage = withRouter(({match, location}) => {
    const userID = JSON.parse(localStorage.getItem("userData")).id;
    const prodID = match.params.id;

    console.log(location.state.taxPrice);
    return (
        <Fragment>
            {
                location && location.state &&
                <CheckOutForm 
                    userID={userID} 
                    prodID={prodID} 
                    prodType="physical"
                    name={location.state.name}
                    count={location.state.count}
                    price={location.state.price ? location.state.price : 0} 
                    shippingPrice={location.state.shippingPrice ? location.state.shippingPrice : 0}
                    taxPrice={location.state.taxPrice ? location.state.taxPrice : 0}/>
            }
        </Fragment>        
    )
})

export default BuyPhysicalProductPage;