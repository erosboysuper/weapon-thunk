import React, {useEffect} from 'react';
import './mycomments-page.style.scss';
import { connect } from 'react-redux';
import { getMyComments} from '../../redux/my-comments/my-comments.action';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import CommentsComponent from '../../components/comments/comments.component';
import { useState } from 'react';

const MyCommentsPage = ({myCommentsData, getMyComments, setLoadAlerts, currentFontColors}) => { 

    const [fontColor, setFontColor] = useState({header1: "white", header2: "white"});
    useEffect(() => {
        if (currentFontColors && currentFontColors.header1_color && currentFontColors.header2_color) {
            const h1color = JSON.parse(currentFontColors.header1_color);
            const h2color = JSON.parse(currentFontColors.header2_color);
            setFontColor({
                header1: `rgba(${h1color.r }, ${h1color.g }, ${h1color.b }, ${h1color.a })`,
                header2: `rgba(${h2color.r }, ${h2color.g }, ${h2color.b }, ${h2color.a })`
            })
        }
    }, [currentFontColors]);

    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {    
        async function loadData() {      
            setLoadAlerts(true);
            await getMyComments(userData.id);  
            setLoadAlerts(false);   
        }
        if(userData){
          loadData();
        }      
      }, []);
    
    return (
        <div className="mycomments-page">
            <h2 className="text-center font-weight-bold mb-4" style={{color: fontColor.header1}}>All Comments {`${myCommentsData ? '(' + myCommentsData.length +')' : ''}`}</h2>   
            {
                myCommentsData && myCommentsData.length > 0 ? myCommentsData.map(
                    (comment, i) => <CommentsComponent key={i} comment={comment} i={i} />                    
                )
                :
                <h4 className="text-center mb-4" style={{color: fontColor.header2}}>No comments</h4>
            } 
        </div>
    )
}

const MapStateToProps = ({myComments: {myCommentsData}, colors: {currentFontColors}}) => ({
    myCommentsData,
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    getMyComments: getMyComments(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})

export default connect(MapStateToProps,MapDispatchToProps)(MyCommentsPage);