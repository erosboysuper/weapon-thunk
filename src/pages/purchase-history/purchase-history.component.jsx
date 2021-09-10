import React, { useState, useEffect } from 'react';
import './purchase-history.style.scss';
import { connect } from 'react-redux';
import { getProductItems, getWebinarItems, setProductPageNum, setWonListPageNum, setIsTableLoad } from '../../redux/purchased-items/purchased-items.action';
import { setLimitPerPage } from '../../redux/purchased-items/purchased-items.action';
import { MDBRow, MDBCol } from 'mdbreact';
import CountPerPage from '../../components/table/pagination/count-per-page/count-per-page.component';
import TableFilterInput from '../../components/table/pagination/filter-input/filter-input.component';
import PageButtons from '../../components/table/pagination/page-buttons/page-buttons.component';
import PurchaseHistoryTable from '../../components/table/table-purchase-history/table-purchase-history.component';

const PurchaseHistoryPage = ({product_items, webinar_items, setLimitPerPage, limitPerPage, pageNum,getProductItems, 
    getWebinarItems, setProductPageNum,setWonListPageNum, filterStr, setIsTableLoad, currentFontColors}) => {

    const [fontColors, setFontColors] = useState({
        header1: "white",
        tableHeader: "#a3a3a3",
        tableContent: "white"
    })
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.table_header_color && currentFontColors.table_content_color) {
            const h1Color = JSON.parse(currentFontColors.header1_color);
            const tableHeaderColor = JSON.parse(currentFontColors.table_header_color);
            const tableContentColor = JSON.parse(currentFontColors.table_content_color);

            setFontColors({
                header1: `rgba(${h1Color.r }, ${h1Color.g }, ${h1Color.b }, ${h1Color.a })`,
                tableHeader: `rgba(${tableHeaderColor.r }, ${tableHeaderColor.g }, ${tableHeaderColor.b }, ${tableHeaderColor.a })`,
                tableContent: `rgba(${tableContentColor.r }, ${tableContentColor.g }, ${tableContentColor.b }, ${tableContentColor.a })`
            })
        }
    }, [currentFontColors]);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [isMobileSize, setIsMobileSize] = useState(false);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 500)
                setIsMobileSize(true);
            else
                setIsMobileSize(false);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
    }, []);

    // for loading data
    useEffect(() => {
        async function loadTable() {
            setIsTableLoad(true);
            await getProductItems(userData.id, filterStr, limitPerPage.product, pageNum.product);
            await getWebinarItems(userData.id, filterStr, limitPerPage.wonList, pageNum.wonList);
            setIsTableLoad(false);
        }
        if (userData) {
            loadTable();
        }
    }, [pageNum]);
    
    useEffect(() => {
       
        if (userData) {
            setProductPageNum(1);
            setWonListPageNum(1);
        }
    }, [limitPerPage, filterStr]);

    // for custom date
    const [customDate, setCustomDate] = useState([]);

    useEffect(() => {
      
        if(product_items.data.length > 0){
            let dateArray = [];
            for( let i = 0; i < product_items.data.length; i++ )
            {
                function getCustomDateTime(dt)
                {
                    let createdTime = new Date(dt).toString();
                    createdTime = new Date(createdTime);
                
                    const commentYear = createdTime.getFullYear(); // get year

                    // get custom month
                    Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    function short_months(dt) {
                        return Date.shortMonths[dt.getMonth()];
                    }
                    const commentMonth = short_months(createdTime); 

                    // get custom date
                    function ordinal_suffix_of(i) {
                        var j = i % 10,
                            k = i % 100;
                        if (j === 1 && k !== 11) {
                            return i + "st";
                        }
                        if (j === 2 && k !== 12) {
                            return i + "nd";
                        }
                        if (j === 3 && k !== 13) {
                            return i + "rd";
                        }
                        return i + "th";
                    }
                    const commentDate = ordinal_suffix_of(createdTime.getDate());
                    
                    return commentMonth + " " + commentDate + " " + commentYear;
                }
                dateArray.push(getCustomDateTime(product_items.data[i].created_date));
            }
            setCustomDate(dateArray);
        }        
    }, [product_items]);
    
    // for row counts per page
    const selectOptions = [5,10,20];
    const [optionShow, setOptionShow] = useState({ product: false, wonList: false});
    const [placeholder, setPlaceholder] = useState({ product: 5, wonList: 5});

    useEffect(() => {
        setLimitPerPage(placeholder);
    }, [placeholder]);

    return (
    <div className="purchase-history-page">
        
        <div className="item-group">
            <MDBRow>
                <MDBCol>
                    <div className="float-right">
                        <TableFilterInput str={filterStr}/>
                    </div>                   
                </MDBCol>                
            </MDBRow>
            <h2 className="text-center mt-4" style={{color: fontColors.header1}}>Purchase history</h2>
            
            <MDBRow>
                <MDBCol size="7">                 
                    <div className="count-select">
                    <CountPerPage 
                        options={selectOptions} 
                        showSelectBox={()=>setOptionShow({...optionShow, product:!optionShow.product})} 
                        selectOption={(event)=>{
                            setOptionShow({...optionShow, product: false});
                            setPlaceholder({...placeholder, product: Number(event.target.id) });
                        }} 
                        optionShow={optionShow.product} 
                        placeholder={placeholder.product}
                    />
                    <span className="count-span">Per Page</span> 
                    </div>                         
                </MDBCol>
                    
                <MDBCol size="5">
                    <div className="float-right">
                        <PageButtons type={"prodList"} count={Math.ceil(product_items.count/limitPerPage.product)} currentIndex = {pageNum.product}/>  
                    </div>
                </MDBCol>
            </MDBRow>   
            {
                isMobileSize ? 
                <MDBRow className="mobileHeader">                    
                    <MDBCol size="3" className="text-left headerP" style={{color: fontColors.tableHeader}}>TYPE</MDBCol>  
                    <MDBCol size="7" className="text-left headerP" style={{color: fontColors.tableHeader}}>NAME</MDBCol>             
                </MDBRow>
                :
                <MDBRow>
                    <MDBCol className="text-left headerP" style={{color: fontColors.tableHeader}}>PRODUCT NAME</MDBCol>
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>WEBINAR</MDBCol> 
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>PRODUCT TYPE</MDBCol>  
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>PURCHASED DATE</MDBCol>             
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>STATUS</MDBCol>
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>SEAT NUMBER</MDBCol>
                    <MDBCol className="text-right headerP" style={{color: fontColors.tableHeader}}>PRODUCT PRICE</MDBCol>
                </MDBRow>
            }
            {
                product_items.data.length > 0 ? product_items.data.map( (item,i) => 
                    <PurchaseHistoryTable key={i} item={item} i={i} customDate={customDate} isWebinar={false} isMobile={isMobileSize}/>
                )
                :
                    <p className="text-center no-result" style={{color: fontColors.tableContent}}>No results</p>
            }
        </div>

        <div className="item-group">
            <h2 className="text-center" style={{color: fontColors.header1}}>Items Won</h2>

            <MDBRow>
                <MDBCol size="7">                 
                    <div className="count-select">
                    <CountPerPage 
                        options={selectOptions} 
                        showSelectBox={()=>setOptionShow({...optionShow, wonList:!optionShow.wonList})} 
                        selectOption={(event)=>{
                            setOptionShow({...optionShow, wonList: false});
                            setPlaceholder({...placeholder, wonList:Number(event.target.id)});
                        }} 
                        optionShow={optionShow.wonList} 
                        placeholder={placeholder.wonList}
                    />
                    <span className="count-span">Per Page</span> 
                    </div>                         
                </MDBCol>
                    
                <MDBCol size="5">
                    <div className="float-right">
                        <PageButtons type={"wonList"} count={Math.ceil(webinar_items.count/limitPerPage.wonList)} currentIndex={pageNum.wonList}/>  
                    </div>
                </MDBCol>
            </MDBRow>   
            {
                isMobileSize ? <MDBRow className="mobileHeader">
                    <MDBCol size="3" className="text-left headerP" style={{color: fontColors.tableHeader}}>IMAGE</MDBCol>
                    <MDBCol size="7" className="text-left headerP" style={{color: fontColors.tableHeader}}>NAME</MDBCol>
                </MDBRow>
                :
                <MDBRow>
                    <MDBCol className="text-left headerP" style={{color: fontColors.tableHeader}}>IMAGE</MDBCol>
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>PRODUCT NAME</MDBCol>
                    <MDBCol className="text-center headerP" style={{color: fontColors.tableHeader}}>SEAT NUMBER</MDBCol>
                    <MDBCol className="text-right headerP" style={{color: fontColors.tableHeader}}>TICKET PRICE</MDBCol>
                </MDBRow>
            }
            
            {
                webinar_items.data.length > 0 ? webinar_items.data.map( (item,i) => 
                    <PurchaseHistoryTable item={item} i={i} customDate={customDate} isWebinar={true} isMobile={isMobileSize}/>
                )
                :
                <p className="text-center no-result" style={{color: fontColors.tableContent}}>No results</p>
            }
        </div>
    
    </div>
)}

const MapStateToProps = ({ purchasedItems: { product_items, webinar_items, limitPerPage, pageNum, filterStr }, colors: {currentFontColors}}) => ({
    product_items,
    webinar_items,
    limitPerPage,
    pageNum,
    filterStr,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    setLimitPerPage: limit => dispatch(setLimitPerPage(limit)),
    setProductPageNum: index => dispatch(setProductPageNum(index)),
    setWonListPageNum: index => dispatch(setWonListPageNum(index)),
    setIsTableLoad: flag => dispatch(setIsTableLoad(flag)),
    getProductItems: getProductItems(dispatch),
    getWebinarItems: getWebinarItems(dispatch),
})
export default connect(MapStateToProps,MapDispatchToProps)(PurchaseHistoryPage);