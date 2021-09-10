import React, {Fragment, useState, useEffect} from 'react';
import './table-purchase-history.style.scss';
import {MDBRow, MDBCol, MDBIcon} from 'mdbreact';
import { connect } from 'react-redux';
import { getImageFromS3 } from '../../../utils/services/s3';

const PurchaseHistoryTable = ({item, i, customDate, isWebinar, isMobile, currentFontColors}) => {

    const [statusVal, setStatusVal] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        async function load() {
            item?.webinar?.main_image?.image_url && setImageUrl(getImageFromS3(item.webinar.main_image.image_url))
        }
        load();
        if (item) {
            if (item.webinar_status === 'inactive' || item.webinar_status === 'active' || item.webinar_status === 'hold')
                setStatusVal('Being sold');
            if (item.webinar_status === 'progress' || item.webinar_status === 'done')
                setStatusVal('Reviewed ');
            if (item.webinar_status === 'soldout')
                setStatusVal('Waiting for review');
        }   
    }, [item]);

    const [fontColor, setFontColor] = useState({ content: "white", mobile: "a3a3a3"});
    useEffect(() => {
        if (currentFontColors && currentFontColors.table_content_color && currentFontColors.table_header_color) {
            const color = JSON.parse(currentFontColors.table_content_color);
            const color2 = JSON.parse(currentFontColors.table_header_color);
            setFontColor({
                content: `rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`,
                mobile: `rgba(${color2.r }, ${color2.g }, ${color2.b }, ${color2.a })`
            })
        }
    }, [currentFontColors]);

    const [isOpenTable, setIsOpenTable] = useState(false);
    return (
        <Fragment>
            {
                isWebinar ? isMobile ? <Fragment>
                        <MDBRow className="product-item webinar" key={i}>
                            <MDBCol size="3" middle className="text-left"><img src={imageUrl} className="item-img" alt={item.name} /></MDBCol>
                            <MDBCol size="7" middle className="text-left" style={{color: fontColor.content}}>{item.name}</MDBCol>
                            <MDBCol size="2" middle >
                                <button className="openBtn" onClick={()=>setIsOpenTable(true)} style={{borderColor: fontColor.content}}><MDBIcon icon="plus" style={{color: fontColor.content}}/></button>
                            </MDBCol>  
                        </MDBRow>
                        {
                            isOpenTable && <Fragment>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>IMAGE</MDBCol> 
                                    <MDBCol size="7" middle className="text-left"><img src={imageUrl} className="item-img" alt={item.name} /></MDBCol>
                                    <MDBCol size="2" middle >
                                        <button className="openBtn" onClick={()=>setIsOpenTable(false)} style={{borderColor: fontColor.content}}><MDBIcon icon="minus" style={{color: fontColor.content}}/></button>
                                    </MDBCol>                    
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>NAME</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.name}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>SEAT NUMBER</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.seatsNo + 1}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>TICKET PRICE</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{` $${item.price_per_seats}`}</MDBCol>               
                                </MDBRow>
                            </Fragment>
                        }
                    </Fragment>
                    :
                    <MDBRow className="product-item webinar" key={i}>
                        <MDBCol middle className="text-left" style={{color: fontColor.content}}><img src={imageUrl} className="item-img" alt={item.name} /></MDBCol>
                        <MDBCol middle className="text-center" style={{color: fontColor.content}}>{item.name}</MDBCol>
                        <MDBCol middle className="text-center" style={{color: fontColor.content}}>{item.seatsNo+1}</MDBCol>
                        <MDBCol middle className="text-right" style={{color: fontColor.content}}>{` $${item.price_per_seats}`}</MDBCol>
                    </MDBRow>           
                : isMobile ? <Fragment>
                        <MDBRow className="product-item" key={i}>                    
                            <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>{item.product_type}</MDBCol> 
                            <MDBCol size="7" middle className="text-left" style={{color: fontColor.content}}>{ item.product_name.length > 20 ? item.product_name.slice(0,20) + "..." : item.product_name}</MDBCol>
                            <MDBCol size="2" middle >
                                <button className="openBtn" onClick={()=>setIsOpenTable(true)} style={{borderColor: fontColor.content}}><MDBIcon icon="plus" style={{color: fontColor.content}}/></button>
                            </MDBCol>                    
                        </MDBRow>
                        {
                            isOpenTable && <Fragment>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>TYPE</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.product_type}</MDBCol>
                                    <MDBCol size="2" middle >
                                        <button className="openBtn" onClick={()=>setIsOpenTable(false)} style={{borderColor: fontColor.content}}><MDBIcon icon="minus" style={{ color: fontColor.content}}/></button>
                                    </MDBCol>                    
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>NAME</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.product_name.length > 20 ? item.product_name.slice(0,20) + "..." : item.product_name}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>WEBINAR</MDBCol> 
                                    <MDBCol size="7" middle className="text-left">
                                    {   item.product_type === "webinar" && 
                                        <button 
                                            className="linkBtn" 
                                            disabled={item.webinar_link ? false : true} 
                                            style={{color: fontColor.mobile}}>
                                        {
                                            item?.webinar_link?.length > 0 ? 
                                            <a 
                                                href={item.webinar_link} 
                                                style={{color: fontColor.mobile}} 
                                                target="_blank"
                                            >Watch now</a> 
                                            : "Not available"
                                        }
                                        </button>
                                    }
                                    </MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>STATUS</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.product_type === "webinar" && statusVal}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>DATE</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{customDate[i]}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>SEAT NUMBER</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{item.product_type === "webinar" && (Number(item.seat_number) + 1).toString()}</MDBCol>               
                                </MDBRow>
                                <MDBRow className="openedTable">                    
                                    <MDBCol size="3" middle className="text-left" style={{color: fontColor.content}}>PRICE</MDBCol> 
                                    <MDBCol size="7" middle className="text-left" style={{color: fontColor.mobile}}>{` $${item.price}`}</MDBCol>               
                                </MDBRow>
                            </Fragment>
                        }
                    </Fragment>
                :
                <MDBRow className="product-item" key={i}>
                    <MDBCol middle className="text-left" style={{color: fontColor.content}}>{ item.product_name.length > 20 ? item.product_name.slice(0,20) + "..." : item.product_name}</MDBCol>
                    <MDBCol middle className="text-center">
                    {item.product_type === "webinar" && <button className="linkBtn" disabled={item.webinar_link ? false : true} style={{color: fontColor.content}}>{ item.webinar_link ? <a href={item.webinar_link} style={{color: fontColor.content}} target="_blank">Watch now</a> : "Not available"}</button>}
                    </MDBCol>    
                    <MDBCol middle className="text-center" style={{color: fontColor.content}}>{item.product_type}</MDBCol>                  
                    {
                        customDate.length > 0 && <MDBCol middle className="text-center" style={{color: fontColor.content}}>{customDate[i]}</MDBCol>
                    }
                    <MDBCol middle className="text-center" style={{color: fontColor.content}}>{item.product_type === "webinar" && statusVal}</MDBCol>
                    <MDBCol middle className="text-center" style={{color: fontColor.content}}>{item.product_type === "webinar" && (Number(item.seat_number) + 1).toString()}</MDBCol>
                    <MDBCol middle className="text-right" style={{color: fontColor.content}}>{` $${item.price}`}</MDBCol>
                </MDBRow>                
            } 
        </Fragment>
    )
}

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(PurchaseHistoryTable);