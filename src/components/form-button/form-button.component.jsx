import React, {Fragment} from 'react';
import './form-button.style.scss';
import {MDBIcon} from 'mdbreact';

const FormButton = ({children, greyCol, lightGreyCol, isLoading, onClickFunc, isDisabled, ...otherProps}) => {
    return(
        <Fragment>
            <button className={`${greyCol ? 'greyColor' : ''} ${lightGreyCol ? 'lightGreyCol' : ''} form-button font-weight-bold`} {...otherProps} disabled={isDisabled} onClick = {onClickFunc}>                
                {
                    isLoading&&<MDBIcon className="loadSubIcon" icon="sync-alt" />
                }
                {children}
            </button>
        </Fragment>
    )
};

export default FormButton;