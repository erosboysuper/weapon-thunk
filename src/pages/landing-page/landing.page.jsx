import React from 'react';
import './landing.style.scss';
import FormButton from '../../components/form-button/form-button.component';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { MDBRow, MDBCol } from 'mdbreact';
import { Helmet } from 'react-helmet';
import originBackImage from '../../assets/land.jpg';
import { getCurrentBackground } from '../../redux/colors/colors.action';
import { getImageFromS3 } from '../../utils/services/s3';
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import ReactPlayer from 'react-player'
import { MDBIcon } from 'mdbreact';
import PlayBtn from '../../assets/video_play_btn.png';

const LandingPage = ({getCurrentBackground, setLoadAlerts, currentFontColors}) => {

    const history = useHistory();
    const [currentBackImg, setCurrentBackImg] = useState(null);

    //for video
    const [isPause, setIsPause] = useState(true);
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [hasVideLink, setHasVideoLink] = useState(null);

    useEffect(() => {
        async function loadLandingImg () {
            setLoadAlerts(true);
            const result = await getCurrentBackground('landingpage');            
            if (result && result.image_url) {
                const imgUrl = getImageFromS3(result.image_url);                
                setCurrentBackImg(imgUrl);
            }
            else
                setCurrentBackImg(originBackImage);
            setLoadAlerts(false);
        }
        loadLandingImg();        
    }, []);

    useEffect(() => {
        currentFontColors?.post_video_link?.trim() !== '' && setHasVideoLink(currentFontColors?.post_video_link?.trim())
    }, [currentFontColors]);

    return (
        <div className="landing-page" style={{backgroundImage:`url(${currentBackImg})`}}>
            <Helmet>
                {/* <!-- HTML Meta Tags --> */}
                <title>Mata's Tactical Supply</title>
                <link rel="canonical" href={window.location.href} />
                <meta
                    name="description"
                    content="Mata's Tactical is an eCommerce site that sells firearms and firearm accessory webinars. Users must make an account to make a purchase in a webinar. Webinars have a limited number of seats, users purchase a ticket for a 'seat' in the webinar. At the end of the webinar, one of the tickets will be selected as the winner, and will win a prize."
                />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemprop="name" content="Mata's Tactical Supply" />
                <meta
                itemprop="description"
                content="Mata's Tactical is an eCommerce site that sells firearms and firearm accessory webinars. Users must make an account to make a purchase in a webinar. Webinars have a limited number of seats, users purchase a ticket for a 'seat' in the webinar. At the end of the webinar, one of the tickets will be selected as the winner, and will win a prize."
                />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Mata's Tactical Supply" />
                <meta
                property="og:description"
                content="Mata's Tactical is an eCommerce site that sells firearms and firearm accessory webinars. Users must make an account to make a purchase in a webinar. Webinars have a limited number of seats, users purchase a ticket for a 'seat' in the webinar. At the end of the webinar, one of the tickets will be selected as the winner, and will win a prize."
                />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:title" content="Mata's Tactical Supply" />
                <meta
                name="twitter:description"
                content="Mata's Tactical is an eCommerce site that sells firearms and firearm accessory webinars. Users must make an account to make a purchase in a webinar. Webinars have a limited number of seats, users purchase a ticket for a 'seat' in the webinar. At the end of the webinar, one of the tickets will be selected as the winner, and will win a prize."
                />          
            </Helmet>
            {/* <div className="logoBackImg"></div> */}
            {
                isShowVideo && <div className="video_wrapper">
                    <div className="wrapper">
                        <ReactPlayer                    
                            className='react-player'
                            // light='https://www.icodglobal.com/wp-content/uploads/2020/08/video-1-1.png'
                            url={hasVideLink}
                            width='100%'
                            height='100%'
                            controls={true}
                            playing={!isPause}            
                        />
                        <button><MDBIcon icon="times" onClick={() => {
                            setIsPause(true);
                            setIsShowVideo(false);
                        }}/></button>
                    </div>
                </div>
            }
            <MDBRow center className="content">
                <MDBCol size="12" sm="10" md="8" lg="6" xl="7"/>                
                <MDBCol size="12" sm="10" md="10" lg="10" xl="5" className="tempWrapper">
                    {
                        hasVideLink ? 
                        <div className='tempVideoWrapper'>
                            {                           
                                <img src={PlayBtn} alt="playButton" onClick={() => {
                                    setIsPause(false);
                                    setIsShowVideo(true);
                                }}/>
                            }                        
                        </div>
                        :
                        <div className='emptyWrapper'>
                        </div>
                    }                                     
                                    
                    <div className='btns'>      
                        <FormButton onClickFunc={() => history.push("/product", {prodType: "webinar"})}>FIREARM WEBINARS</FormButton>
                    </div>
                </MDBCol>
            </MDBRow>
        </div>
    )
}

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getCurrentBackground: getCurrentBackground(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect(MapStateToProps, MapDispatchToProps)(LandingPage);