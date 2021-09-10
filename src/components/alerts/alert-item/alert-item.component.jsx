import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { MDBIcon } from 'mdbreact';
import './alert-item.style.scss';
import { getImageFromS3 } from '../../../utils/services/s3';

const EachAlertItem = ({ alertItem, clickFunc, label }) => {

    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        async function load() {
            alertItem.product_image && setImageUrl(getImageFromS3("thumbnail-" + alertItem.product_image))
        }
        load();
    }, [alertItem.product_image]);
    return (
        <div className="notification-item" onClick={clickFunc}>
            {
                imageUrl ? <img className="item-img" src={imageUrl} alt={alertItem.product_name}/>
                :
                <div className="non-img">
                    <MDBIcon far icon="file-image" />
                </div>
            }
            <div className="desc-div">
                <div className="font-weight-bold">{alertItem.product_name}</div>
                <div className="font-weight-bolder">{label}</div>
            </div>
        </div>
    )
};

export default EachAlertItem;