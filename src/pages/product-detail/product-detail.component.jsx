import React, {useEffect, useRef, Fragment} from 'react';
import './product-detail.style.scss';
import { MDBRow, MDBCol, MDBIcon, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import FormButton from '../../components/form-button/form-button.component';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { getCurrentProdItem, getCurrentComments, addCommentsFunc } from '../../redux/product-detail/product-detail.action';
import { getCurrentUser } from '../../redux/user/user.action';
import CommentsComponent from '../../components/comments/comments.component';
import ProductQuantity from '../../components/product-quantity/product-quantity.component';
import { useState } from 'react';
import { withRouter } from 'react-router';
import { useAlert } from 'react-alert';
import { getImageFromS3 } from '../../utils/services/s3';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Helmet } from 'react-helmet'; 

const ProdcutDetailPage = withRouter(({ match, isLoadingAlerts, getCurrentProdItem, getCurrentComments, addCommentsFunc, prodItem, prodComments, setLoadAlerts, getCurrentUser, currentFontColors}) => {

    const alert = useAlert();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const historyUrl = useHistory();
    
    const prodID = match.params.id;
    const prodType = match.params.prodType;

    const [isNoAvailable, setIsNoAvailable] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoadAlerts(true);
            const result = await getCurrentProdItem(userData?.email, prodID, prodType);
            result ? setIsNoAvailable(false) : setIsNoAvailable(true)
            await getCurrentComments(prodID);
            setLoadAlerts(false);
        }
        loadData();
    }, [match.params.id]);

    
    const [prodQuantity, setProdQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);

    const [imageUrl, setImageUrl] = useState(null);
    const [imageCarausel, setImageCarausel] = useState([]);
    useEffect(() => {
        console.log(prodItem);
        if (prodItem?.pictures?.length > 0) {
            if (prodItem.pictures.length === 1) {
                setImageCarausel([]);
                setImageUrl(getImageFromS3(prodItem.pictures[0].image_url));
            }                
            else {
                setImageUrl(null);
                let tempArray = [];
                if (prodItem.main_image) {
                    tempArray.push(getImageFromS3(prodItem.main_image.image_url));
                    const newArray = prodItem.pictures.filter( picture => picture.id !== prodItem.main_image.id );
                    newArray.map( picture => {
                        tempArray.push(getImageFromS3(picture.image_url));
                    })
                }
                else {
                    prodItem.pictures.map( picture => {
                        tempArray.push(getImageFromS3(picture.image_url));
                    })
                }
                setImageCarausel([...tempArray]);
            }     
        }  
        prodItem && prodItem.amount && setMaxQuantity(prodItem.amount)  
    }, [prodItem]);

    const [ownComment, setOwnComment] = useState();
    const textareaRef = useRef(null);
    useEffect(() => {
        if (ownComment) {
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
    }, [ownComment]);

    const [fontColors, setFontColors] = useState({header1: "white", header2: "white", paragraph: "#a3a3a3", form: "#a3a3a3"});
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color && currentFontColors.paragraph_color && currentFontColors.form_color) {
            const header1color = JSON.parse(currentFontColors.header1_color);
            const header2color = JSON.parse(currentFontColors.header2_color);
            const paragraphcolor = JSON.parse(currentFontColors.paragraph_color);
            const formcolor = JSON.parse(currentFontColors.form_color);
            setFontColors({
                header1: `rgba(${header1color.r }, ${header1color.g }, ${header1color.b }, ${header1color.a })`,
                header2: `rgba(${header2color.r }, ${header2color.g }, ${header2color.b }, ${header2color.a })`,
                paragraph: `rgba(${paragraphcolor.r }, ${paragraphcolor.g }, ${paragraphcolor.b }, ${paragraphcolor.a })`,
                form: `rgba(${formcolor.r }, ${formcolor.g }, ${formcolor.b }, ${formcolor.a })`
            })

        }
    }, [currentFontColors]);
    
    const leaveCommentFunc = async () => {
        if (!JSON.parse(localStorage.getItem("userData"))?.id) {
            localStorage.setItem('resignProdType', prodType);
            historyUrl.push('/signin');
        }
        if(!ownComment || (ownComment.trim() === "")){
            return;
        }
        if(JSON.parse(localStorage.getItem("userData"))){
            setLoadAlerts(true);
            const user_comment = await getCurrentUser({email: JSON.parse(localStorage.getItem("userData")).email},"fromDB");
            if(user_comment.comment_banned){
                setLoadAlerts(false);
                setOwnComment("");
                alert.error("You have been banned from commenting.");
                return;
            }
            else {
                
                const obj = {
                    user_id: JSON.parse(localStorage.getItem("userData")).id,
                    product_id: prodID,
                    parent_id: "",
                    comment_content: ownComment,
                    product_type: prodType
                }
                
                const result = await addCommentsFunc(obj);
                if (result.message)
                    alert.error(result.message);
                else{
                    await getCurrentComments(prodID);
                    setOwnComment("");
                }                
                setLoadAlerts(false);
            }           
        }       
    }

    const addProductToBucket = () => {
        const newItem = {
            prodName: prodItem.productName,
            type: 'physical',
            quantity: prodQuantity,
            maxQuantity: prodItem.amount,
            price: prodItem.pricePerItem,
            id: prodItem.id,
            tax: prodItem.tax,
            shipping: prodItem.shipping_price,
            img: imageUrl ? imageUrl : imageCarausel[0]
        };
        
        if (JSON.parse(localStorage.getItem('cartItems'))) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems'));
            const existingItem = cartItems.filter( item => item.id === newItem.id );
            if (existingItem) {
                const newCartItems = cartItems.filter( item => item.id !== newItem.id);
                newCartItems.push(newItem);
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));

            }
            else {
                cartItems.push(newItem);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        }
        else {
            let cartItems = [];
            cartItems.push(newItem)
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }

    const goToWebinarSeats = () => {
        if (!JSON.parse(localStorage.getItem("userData"))?.id) {
            localStorage.setItem('resignProdType', prodType);
            historyUrl.push('/signin');
        }
        historyUrl.push(`/purchase_seats/${prodItem.id}`, {
            price: prodItem.price_per_seats,
            name: prodItem.name,
            image: imageUrl ? imageUrl : imageCarausel[0] 
        }) 
    }

    const goToCheckOut = () => {
        if (!JSON.parse(localStorage.getItem("userData"))?.id) {
            localStorage.setItem('resignProdType', prodType);
            historyUrl.push('/signin');
        }
        addProductToBucket();
        historyUrl.push('/checkout');
    }

    const goToCartFunc = () => {     
        if (!JSON.parse(localStorage.getItem("userData"))?.id) {
            localStorage.setItem('resignProdType', prodType);
            historyUrl.push('/signin');
        }   
        addProductToBucket();
        historyUrl.push('/shopping_cart');
    }

    const [activeItem, setActiveItem] = useState('1');
    const toggle = tab => e => {
        activeItem !== tab && setActiveItem(tab);
    }

    return (
        <div className="product-detail-page">
            {
                prodItem &&
                <Helmet>
                    {/* <!-- HTML Meta Tags --> */}
                    <title>{prodType === 'webinar' ? prodItem.name : prodItem.productName}</title>
                    <link rel="canonical" href={window.location.href} />
                    <meta
                    name="description"
                    content={prodItem.shortDescription}
                    />

                    {/* <!-- Google / Search Engine Tags --> */}
                    <meta itemprop="name" content={prodType === 'webinar' ? prodItem.name : prodItem.productName} />
                    <meta
                    itemprop="description"
                    content={prodItem.shortDescription}
                    />
                    <meta
                    itemprop="image"
                    content={imageUrl ? imageUrl : imageCarausel[0]}
                    />

                    {/* <!-- Facebook Meta Tags --> */}
                    <meta property="og:url" content={window.location.href} />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={prodType === 'webinar' ? prodItem.name : prodItem.productName} />
                    <meta
                    property="og:description"
                    content={prodItem.shortDescription}
                    />
                    <meta
                    property="og:image"
                    content={imageUrl ? imageUrl : imageCarausel[0]}
                    />

                    {/* <!-- Twitter Meta Tags --> */}
                    {/* <meta name="twitter:card" content="summary_large_image" /> */}
                    <meta name="twitter:title" content={prodType === 'webinar' ? prodItem.name : prodItem.productName} />
                    <meta
                    name="twitter:description"
                    content={prodItem.shortDescription}
                    />
                    <meta
                    name="twitter:image"
                    content={imageUrl ? imageUrl : imageCarausel[0]}
                    />
                </Helmet>
            }
            {
                isNoAvailable ?
                <h1 className="text-center text-white font-weight-bold mobileH1">This product is no longer available...</h1>
                :
                !isLoadingAlerts && prodItem && <Fragment>
                <MDBRow>
                    <MDBCol size="12" sm="12" md="6" lg="6">
                    {
                        imageUrl ? <img className="detail-img" src={imageUrl} alt={prodItem.name}/>
                        :
                        imageCarausel.length > 0 && <Carousel>
                            {
                                imageCarausel.map( (img,i) => <div key={i}>
                                    <img src={img} />
                                </div>)
                            }                            
                        </Carousel>
                    }
                    </MDBCol>
                    <MDBCol size="12" sm="12" md="6" lg="6" className="description-container">
                        <h1 className="mb-4" style={{color: fontColors.header1}}>{prodType === 'webinar' ? prodItem.name : prodItem.productName}</h1>
                        <p className="mb-4 mt-2" style={{color: fontColors.paragraph}}>
                            <span style={{color: fontColors.header2}}>Price: </span>
                            <span style={{color: fontColors.header2}}>{`$${prodType === "webinar" ? prodItem.price_per_seats?.toFixed(2) : prodItem.pricePerItem?.toFixed(2)} `}</span>
                            {`${prodType === "webinar" ? '/ Seat' : 'each'}`} | <span style={{color: fontColors.header2}}>{`${prodType === "webinar" ? prodItem.remainingSeats : prodItem.amount} `}</span>
                            {`${prodType === "webinar" ? 'seats remaining' : 'left in stock'}`}</p>
                        {
                            prodType === "physical" && <MDBRow className="mb-3">
                                <MDBCol middle size="5" sm="4" md="6" lg="6" xl="4">
                                    <ProductQuantity 
                                        count={prodQuantity} 
                                        minus={()=>setProdQuantity( prodQuantity === 1 ? prodQuantity : prodQuantity-1)}
                                        plus={()=>setProdQuantity( prodQuantity === maxQuantity ? prodQuantity : prodQuantity+1)}
                                        radius={true}
                                    />
                                </MDBCol>
                                <MDBCol middle size="6">
                                    <FormButton lightGreyCol onClickFunc={()=>goToCartFunc()}><MDBIcon icon="shopping-basket" className="mr-2"/>ADD TO CART</FormButton>
                                </MDBCol>
                            </MDBRow>
                        }
                        <MDBRow className="mb-4">
                            <MDBCol size="6" sm="6" md="7" lg="7" xl="5">
                            <FormButton lightGreyCol onClickFunc = {() => prodType === "webinar" ? 
                                goToWebinarSeats()
                                : 
                                goToCheckOut()}>
                                {prodType === "webinar" ? 'PURCHASE SEAT' : 'BUY NOW'}
                            </FormButton>
                            </MDBCol>
                        </MDBRow>                        
                    </MDBCol>
                </MDBRow>

                <MDBNav className="nav-tabs mt-5">
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={activeItem === "1"} onClick={toggle('1')} role="tab" >
                            Description
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink link to="#" active={activeItem === "2"} onClick={toggle("2")} role="tab" >
                            Reviews
                        </MDBNavLink>
                    </MDBNavItem>
                </MDBNav>
                <MDBTabContent activeItem={activeItem} >
                    <MDBTabPane className="pt-4" tabId="1" role="tabpanel">                  
                        <div>
                            <p className="mb-4 discription" style={{color: fontColors.paragraph}}>{prodItem.shortDescription && prodItem.shortDescription}</p>
                        </div> 
                    </MDBTabPane>
                    <MDBTabPane className="pt-4" tabId="2" role="tabpanel">
                        <MDBRow className="mb-4 t100">
                            <MDBCol size="12" sm="12" md="8" lg="6">
                                <h5 style={{color: fontColors.header1}}>READ {"&"} WRITE COMMENTS</h5>
                            </MDBCol>
                            <MDBCol middle size="12" sm="12" md="4" lg="6" className="text-right">
                                <p style={{color: fontColors.paragraph}}>{prodComments && prodComments.length} Comments</p>
                            </MDBCol>
                        </MDBRow>
                        <textarea 
                            ref={textareaRef} 
                            placeholder="Leave a Comment" 
                            className="mb-3" 
                            rows={1}
                            value={ownComment} 
                            onChange={(e) => setOwnComment(e.target.value)} 
                            required
                            style={{color: fontColors.form}}/>
                        <div className="post-btn">
                            <FormButton onClickFunc={leaveCommentFunc}>POST COMMENT</FormButton>
                        </div>

                        <hr className="split-hr"/>

                        {
                            prodComments ? prodComments.map(
                                (comment, i) => <CommentsComponent prodID = {prodID} key={i} comment={comment} i={i} prodComment={true}/>                    
                            )
                            :
                            <h4 className="text-center mb-4" style={{color: fontColors.header2}}>No comments</h4>
                        }   
                    </MDBTabPane>          
                </MDBTabContent>
            </Fragment> 
        }         
        </div>
    )
});

const MapStateToProps = ({product_detail: { prodItem, prodComments }, colors: {currentFontColors}, alerts: { isLoadingAlerts }}) => ({
    prodItem,
    prodComments,
    currentFontColors,
    isLoadingAlerts
})

const MapDispatchToProps = dispatch => ({
    getCurrentProdItem: getCurrentProdItem(dispatch),
    getCurrentComments: getCurrentComments(dispatch),
    addCommentsFunc: addCommentsFunc(dispatch),
    getCurrentUser: getCurrentUser(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})

export default connect(MapStateToProps, MapDispatchToProps)(ProdcutDetailPage);