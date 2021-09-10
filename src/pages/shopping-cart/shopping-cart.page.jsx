import React, {useState, useEffect} from 'react';
import './shopping-cart.style.scss';
import { connect } from 'react-redux';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import CartRowItem from './row-item/row-item.component';
import FormButton from '../../components/form-button/form-button.component';
import { useHistory } from 'react-router-dom';
import { setIsReloadCartItems } from '../../redux/user/user.action';
import { getReservedStatus } from '../../redux/purchase-seats/purchase-seats.action';
import { setLoadAlerts } from '../../redux/alerts/alerts.action';

const ShoppingCartPage = ({currentFontColors, isReloadCartItems, setIsReloadCartItems, getReservedStatus, setLoadAlerts}) => {

    const historyUrl = useHistory();
    const [rowData, setRowData] = useState();
    console.log(rowData);

    const [totalPrice, setTotalPrice] = useState(0);

    const [isMobileSize, setIsMobileSize] = useState(false);
    const [cutLetters, setCutLetters] = useState(false);

    const setTotalValFunc = () => {
        const data = JSON.parse(localStorage.getItem('cartItems')); 
        if (data && data.length > 0) {
            let val = 0;
            data.map( cartItem => val += cartItem.price * cartItem.quantity );
            setTotalPrice(val);
        }
        else
            setTotalPrice(0);
        setRowData(data);
    }

    useEffect(() => {
        if (isReloadCartItems) {
            setTotalValFunc();
            setIsReloadCartItems(false);
        }
    }, [isReloadCartItems]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 1025)
                setCutLetters(true);
            else
                setCutLetters(false);

            if (window.innerWidth < 500)
                setIsMobileSize(true);
            else
                setIsMobileSize(false);
        }
        handleResize();
        window.addEventListener('resize', handleResize);

        async function load() {
            const cartWebinars = JSON.parse(localStorage.getItem('cartItems'))?.filter( item => item?.type === "webinar");
            if (cartWebinars) {
                setLoadAlerts(true);
                const isHasWebinars = await getReservedStatus(cartWebinars[0]?.id);
                if ( !isHasWebinars || !isHasWebinars.is_reserved)
                    localStorage.setItem('cartItems', JSON.stringify(JSON.parse(localStorage.getItem('cartItems')).filter( item => item?.type !== "webinar")));
                setTotalValFunc();
                setLoadAlerts(false);
            }            
        }        
        load();
    }, []);

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

    return (
        <div className="shopping-cart-page">
            <h1 className="text-center font-weight-bold mb-4" style={{color: fontColors.header1}}>My Cart</h1>
            {
                !isMobileSize && 
                <MDBRow className="headerRow mb-3">
                    <MDBCol className="text-left" size="3" style={{color: fontColors.tableHeader}}>PRODUCT NAME</MDBCol>
                    <MDBCol className="text-center" size="3" style={{color: fontColors.tableHeader}}>Quantity</MDBCol>               
                    <MDBCol className="text-center" size="2" style={{color: fontColors.tableHeader}}>Price Per Item/Seat</MDBCol>
                    <MDBCol className="text-center" size="2" style={{color: fontColors.tableHeader}}>Total</MDBCol>
                    <MDBCol className="text-right" size="2" style={{color: fontColors.tableHeader}}>Remove</MDBCol>
                </MDBRow>
            }
            {
                rowData && rowData.length > 0 ? rowData.map( (item,i) => 
                    <CartRowItem item={item} key={i} isMobile={isMobileSize} cutLetters={cutLetters} setTotalVal={()=>setTotalValFunc()}/>
                )
                :
                <p className="text-center no-result" style={{color: fontColors.tableContent}}>No Items</p>
            }
            <br/>
            <MDBRow center className="mt-4 mb-4">
                <MDBCol className="mt-2 mb-2" size="10" sm="4" md="4" lg="4" xl="3">
                    <FormButton onClickFunc={()=>historyUrl.push("/product", { prodType: "webinar" })}>CONTINUE SHOPPING</FormButton>
                </MDBCol>
                <MDBCol className="mt-2 mb-2" size="12" sm="5" md="5" lg="4" xl="3">
                    <div className="total-price">
                        <label>Total Price</label>
                        <label>${totalPrice.toFixed(2)}</label>
                    </div>
                </MDBCol>
                {
                    rowData && rowData.length > 0 && <MDBCol className="mt-2 mb-2" size="10" sm="3" md="3" lg="3" xl="2">
                        <FormButton onClickFunc={()=>historyUrl.push("/checkout")}>CHECKOUT</FormButton>
                    </MDBCol>
                }
            </MDBRow>
        </div>
    )
}

const MapStateToProps = ({colors: {currentFontColors}, user: {isReloadCartItems}}) => ({
    currentFontColors,
    isReloadCartItems
})

const MapDispatchToProps = dispatch => ({
    setIsReloadCartItems: flag => dispatch(setIsReloadCartItems(flag)),
    getReservedStatus: getReservedStatus(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))
})

export default connect(MapStateToProps, MapDispatchToProps)(ShoppingCartPage);