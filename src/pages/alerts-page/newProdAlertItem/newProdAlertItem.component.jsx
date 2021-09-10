import React, { useState, useEffect } from 'react';
import { MDBRow, MDBIcon, MDBCol } from 'mdbreact';
import { getImageFromS3 } from '../../../utils/services/s3';
import ReactTimeAgo from 'react-time-ago';
import './newProdAlertItem.style.scss';

const NewProductAlertItem = ({ alertItem, label, clickFunc1, clickFunc2, fontColors }) => {

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        async function load() {
            alertItem.product_image && setImageUrl(getImageFromS3("thumbnail-" + alertItem.product_image))
        }
        load();
    }, [alertItem.product_image]);

    return (
        <div className="alert-item" key={alertItem.id}>
            <MDBRow between>
                <MDBCol middle size="10" sm="10" md="11" lg="11">
                    <div className="goToUrl" onClick={clickFunc1}>
                        <MDBRow>
                            <MDBCol middle size="3" sm="3" md="2" lg="1">
                                {imageUrl && <img className="item-img" src={imageUrl} alt={alertItem.product_name} />}
                            </MDBCol>
                            <MDBCol middle size="9" sm="9" md="10" lg="11">
                                <p className="font-weight-bolder" style={{ color: fontColors.paragraph }}><span className="font-weight-bold" style={{ color: fontColors.header2 }}>{alertItem.product_name} </span>{label}</p>
                                {/* <p className="time-p">{alertItem.createdAt}</p> */}
                                <div><ReactTimeAgo date={new Date(new Date(alertItem.createdAt).toString())} /></div>
                            </MDBCol>
                        </MDBRow>
                    </div>
                </MDBCol>

                <MDBCol className="text-center" middle size="2" sm="2" md="1" lg="1" >
                    <MDBIcon className="closeBtn" icon="times" onClick={clickFunc2} />
                </MDBCol>
            </MDBRow>
        </div>
    )
}

export default NewProductAlertItem;

