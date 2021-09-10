import React from 'react';
import { MDBIcon } from 'mdbreact';
import './product-quantity.style.scss';

const ProductQuantity = ({count, minus, plus, radius}) => {

    return (
        <div className={`${radius && 'radius'} prod-quantity`}>
            <div className="text-center text-white" onClick={minus}>
            <MDBIcon icon="minus" />
            </div>
            <div className="text-center text-white">
            {count}
            </div>
            <div className="text-center text-white" onClick={plus}>
            <MDBIcon icon="plus" />
            </div>
        </div>
    )
}

export default ProductQuantity;