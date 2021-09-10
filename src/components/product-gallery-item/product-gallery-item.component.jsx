import React from 'react';
import './product-gallery-item.style.scss';
import { useHistory } from 'react-router-dom';
import { MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { getImageFromS3 } from '../../utils/services/s3';

const ProductGalleryItem = ({item,i, currentFontColors}) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const historyUrl = useHistory();

    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        async function load() {
            item.main_image && setImageUrl(getImageFromS3(item.main_image.image_url))
        }
        load();        
    }, [item.main_image]);

    const [colors, setColors] = useState({header1: "white", header2: "white"});

    useEffect(() => {
        if( currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color){
            const header1color = JSON.parse(currentFontColors.header1_color);
            const header2color = JSON.parse(currentFontColors.header2_color);
            setColors({header1: `rgba(${header1color.r }, ${header1color.g }, ${header1color.b }, ${header1color.a })`,
                header2: `rgba(${header2color.r }, ${header2color.g }, ${header2color.b }, ${header2color.a })`});
        }
    }, [currentFontColors]);
    
    const clickFunc = () => {     
        historyUrl.push(`/products/${item.product_type}/${item.id}`);        
    }
    return (
        <MDBCol size="12" sm="6" md="6" lg="6" xl="3" className="list-item">
            <div className="img-wrapper" onClick={()=>clickFunc()}>  
                {
                    imageUrl ? <img src={imageUrl} alt={item.name}/>
                        :
                        <div className="non-img">
                            <MDBIcon far icon="file-image" />
                        </div>
                }
                <label>{item.product_type === "webinar" ? "WEBINAR" : "PRODUCT"}</label>
            </div>
            <p className="text-center mt-2" style={{color: colors.header1}}>{item.product_name}</p>
            <p className="text-center" style={{color: colors.header2}}><span style={{color: colors.header2}}>${item.product_price.toFixed(2)} </span>each | <span style={{color: colors.header2}}>{item.product_count} </span>{item.product_type === "webinar" ? "seats remaining" : "left in stock"}</p>
        </MDBCol>
    )
};

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})
export default connect(MapStateToProps)(ProductGalleryItem);