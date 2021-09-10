import React, {useEffect,useState} from 'react';
import './product-page.style.scss';
import { MDBRow, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { getProducts, addMoreProducts, setOffset } from '../../redux/products/products.action';
import ProductGalleryItem from '../../components/product-gallery-item/product-gallery-item.component';
import { withRouter } from 'react-router';
import InfiniteScroll from "react-infinite-scroll-component";
import { Helmet } from 'react-helmet';
import { useAlert, positions } from 'react-alert';

const ProductPage = withRouter(({location, isLoadingAlerts, getProducts, addMoreProducts, items, limit, offset, setOffset, setLoadAlerts}) => {

    const alert = useAlert();
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [isIconSpin, setIsIconSpin] = useState(false);

    const loadMoreData = async () => {
        if(items.count < (offset + limit))
            return;

        setIsIconSpin(true);    
        
        if (location?.state?.prodType)
            await addMoreProducts(limit,offset+limit,location.state.prodType);                   
        else {
            if (JSON.parse(localStorage.getItem('prodType')))
            await addMoreProducts(limit,offset+limit,JSON.parse(localStorage.getItem('prodType')).prodType);    
        }     
        setOffset(offset+limit);        
        setIsIconSpin(false);
    }

    useEffect(() => {
        async function loadData ( type = 'webinar') {          
            setLoadAlerts(true);
            setOffset(0);
            await getProducts(limit,0,type);
            setLoadAlerts(false);             
        }
        if (location?.state?.prodType)
            loadData(location.state.prodType);
        else if(JSON.parse(localStorage.getItem('prodType')))
            loadData(JSON.parse(localStorage.getItem('prodType')));
        else
            loadData();    
    }, [location]);

    // useEffect(() => {
    //     items?.count === 0 && alert.info(" Due to supply shortages in the USA - there are no active webinars right now. Please check back soon - we are working on getting more inventory.", {
    //         timeout: 7000,
    //         position: positions.TOP_CENTER
    //     });
    // }, [items]);

    return (
        <div className="product-page">
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Products</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                name="description"
                content="Products of Mata's Tactical Supply"
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Products" />
                <meta
                itemprop="description"
                content="Products of Mata's Tactical Supply"
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Products" />
                <meta
                property="og:description"
                content="Products of Mata's Tactical Supply"
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Products" />
                <meta
                name="twitter:description"
                content="Products of Mata's Tactical Supply"
                />          
            </Helmet>
            {
                userData && location && location.state && location.state.firstName &&
                    <div className="welcome-msg">Welcome,&nbsp;{userData.first_name}!</div>
                   
            }
            {
                items?.count === 0 ?
                <p className="noProducts">Due to supply shortages in the USA - there are no active webinars right now. Please check back soon - we are working on getting more inventory.</p>
                :
                items?.data &&
                <InfiniteScroll
                    className = "own-infinite mt-3"
                    dataLength={items.data.length}
                    scrollThreshold = {Math.min(0.8*window.devicePixelRatio/1.875, 0.8)} // move threshhold based on scale but not exceeding 0.8
                    next={loadMoreData}
                    hasMore={items.count > (offset + limit)}
                    loader={ isIconSpin && <div className="load-icon-wrapper">
                        <MDBIcon className={`load-more load-icon ${isIconSpin && 'spin'} `} icon="sync-alt" />
                    </div>}
                >      
                    <MDBRow>        
                    {
                        !isLoadingAlerts && items && items.data && items.data.map( (item,i) => (
                            <ProductGalleryItem key={item.id} i={i} item = {item} />
                        ))                        
                    }
                    </MDBRow>     
                </InfiniteScroll> 
            }

            {/* {
                !isLoadingAlerts && items && items.data.length > 0 && items.count > (offset + limit) && <div>
                <div style = {{"cursor": "pointer"}} onClick={() => loadMoreData()}>
                    <div className="load-icon-wrapper">
                        <MDBIcon className={`load-more load-icon ${isIconSpin && 'spin'} `} icon="sync-alt" />
                    </div>
                    <p className="text-center load-more"><span className={`${items.count < (offset + limit) && 'no-need'}`}>LOAD MORE</span></p>
                </div>
                </div>
            } */}
        </div>        
    )
});

const MapStateToProps = ({products: {items, limit, offset}, alerts: { isLoadingAlerts }}) => ({
    items,
    limit,
    offset,
    isLoadingAlerts
})

const MapDispatchToProps = dispatch => ({
    getProducts: getProducts(dispatch),
    addMoreProducts: addMoreProducts(dispatch),
    setOffset: offset => dispatch(setOffset(offset)),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect(MapStateToProps, MapDispatchToProps)(ProductPage);

