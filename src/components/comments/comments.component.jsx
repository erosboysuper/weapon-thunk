import React, { useState, useEffect, Fragment, useRef } from 'react';
import './comments.style.scss';
import { useHistory } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import { MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../redux/user/user.action';
// for waiting load
import { setLoadAlerts } from '../../redux/alerts/alerts.action';
import { addCommentsFunc, getCurrentComments, setCommentPin, setCommentDel, setCommentUserBan, updateCommentFunc } from '../../redux/product-detail/product-detail.action';
import { useAlert } from 'react-alert';
import { getImageFromS3 } from '../../utils/services/s3';

const CommentsComponent = ({prodID, comment, i, prodComment, setLoadAlerts, addCommentsFunc, getCurrentComments, setCommentPin, setCommentDel, setCommentUserBan, updateCommentFunc, getCurrentUser, currentFontColors }) => {

    const alert = useAlert();

    const userData = JSON.parse(localStorage.getItem("userData"));
    
    const historyURL = useHistory();

    const [fontColors, setFontColors] = useState({paragraph: "#a3a3a3", header2: "white", special: "#dc2f46"});
    useEffect(() => {
        if (currentFontColors && currentFontColors.paragraph_color && currentFontColors.header2_color && currentFontColors.special_color) {
            const pColor = JSON.parse(currentFontColors.paragraph_color);
            const h2Color = JSON.parse(currentFontColors.header2_color);
            const specialColor = JSON.parse(currentFontColors.special_color);
            setFontColors({
                paragraph: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`,
                header2: `rgba(${h2Color.r }, ${h2Color.g }, ${h2Color.b }, ${h2Color.a })`,
                special: `rgba(${specialColor.r }, ${specialColor.g }, ${specialColor.b }, ${specialColor.a })`
            })
        }
    }, [currentFontColors]);

    const [uniqueChilds, setUniqueChilds] = useState([]);
    const [imgUrls, setImgUrls] = useState([]);
    const [truncatedImgUrls, setTruncatedImgUrls] = useState([]);
    const [noImgAvatars, setNoImgAvatars] = useState([]);
    const [truncatedNoImgAvatars, setTruncatedNoImgAvatars] = useState([]);
    const [customTimes, setCustomTimes] = useState([]);
    const [repliedUserNames, setRepliedUserNames] = useState("");
    const [leftMarginStr, setLeftMarginStr] = useState("");
    const [myAvatar, setMyAvatar] = useState({avatarImg: null, noAvatarImg: null});
    const [editRepliedComment, setEditRepliedComment] = useState({index: null, isEdit: false, content: ''});
    const [editOwnComment, setEditOwnComment] = useState({isEdit: false, content: ''});

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
    }, [editRepliedComment.content, editOwnComment.content]);

    useEffect(() => {
        // for replied user names
        let repliedNames = "";
        let leftMargin = 0;
        const uniqueComments = [];
        const map = new Map();
        for (const item of comment.childs) {
            if(!map.has(item.user_id)){
                map.set(item.user_id, true);    // set any value to Map
                uniqueComments.push(item);
            }
        }

        setUniqueChilds(uniqueComments);

        uniqueComments.map(
            child => {
                repliedNames += child.username.split(" ")[0] + ", ";
                leftMargin += 25;
            })
        leftMargin += 25;
        leftMargin = leftMargin.toString()+"px";
        setLeftMarginStr(leftMargin);
        repliedNames = repliedNames.slice(0, repliedNames.length-2);
        setRepliedUserNames(repliedNames);

        // for load photos
        async function loadUrl(comment) {
            let imgs = [], truncImgs=[], noImgs = [], truncNoImgs=[], times = [];
            
            function getCustomDateTime(dt, editFlag)
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
            
                const commentMinutes = createdTime.getMinutes() < 10 ? '0'+createdTime.getMinutes() : createdTime.getMinutes();
                
                const commentHour = createdTime.getHours()%12;

                const isAmPm = createdTime.getHours() > 11 ? 'pm' : 'am';
                
                const editedLabel = editFlag === 1 ? "Edited at " : "";
                return editedLabel + commentMonth + " " + commentDate + " " +  commentYear + ", " + commentHour + ":" + commentMinutes + " " + isAmPm;
            }
            
            // get my avatar and noAvatar
            const myImg = getImageFromS3("thumbnail-" + userData.profile_picture);
            const tempSplit = userData.username.split(" ");            
            const myNoImg = tempSplit.length > 1 ? tempSplit[0].slice(0,1) + tempSplit[1].slice(0,1) : tempSplit[0].slice(0,1)
            setMyAvatar({
                avatarImg: myImg,
                noAvatarImg: myNoImg
            });

            times.push(getCustomDateTime(comment.message.createdAt, comment.message.is_edited));
            imgs.push(getImageFromS3("thumbnail-" + comment.message.profile_picture));   //for loading avatar imgs
            noImgs.push(
                comment.message.username.split(" ").length > 1 ? 
                comment.message.username.split(" ")[0].slice(0,1) + comment.message.username.split(" ")[1].slice(0,1)
                :
                comment.message.username.split(" ")[0].slice(0,1)
            );     //for getting first letter of names of user without avatar
            for(let i = 0; i < comment.childs.length; i++) {
                noImgs.push(
                    comment.childs[i].username.split(" ").length > 1 ?
                    comment.childs[i].username.split(" ")[0].slice(0,1) + comment.childs[i].username.split(" ")[1].slice(0,1)
                    :
                    comment.childs[i].username.split(" ")[0].slice(0,1)
                );     //for getting first letter of names of user without avatar
                imgs.push(getImageFromS3("thumbnail-" + comment.childs[i].profile_picture));
                times.push(getCustomDateTime(comment.childs[i].createdAt, comment.childs[i].is_edited));
            }

            // for unique childs avatar imgs
            for(let i = 0; i < uniqueComments.length; i++) {
                truncImgs.push(getImageFromS3("thumbnail-" + uniqueComments[i].profile_picture));
                truncNoImgs.push(
                    uniqueComments[i].username.split(" ").length > 1 ?
                    uniqueComments[i].username.split(" ")[0].slice(0,1) + uniqueComments[i].username.split(" ")[1].slice(0,1)
                    :
                    uniqueComments[i].username.split(" ")[0].slice(0,1)
                );
            }
            setImgUrls(imgs);
            setTruncatedImgUrls(truncImgs);
            setNoImgAvatars(noImgs);
            setTruncatedNoImgAvatars(truncNoImgs);
            setCustomTimes(times);
            return imgs;
        }
        loadUrl(comment);
    }, [comment]);

    const [isTruncated, setIsTruncated] = useState(true);
    const [isReply, setIsReply] = useState(false);
    const [replyContent, setReplyContent] = useState();
    
    const replyCommentFunc = async () => {
        if(!replyContent || (replyContent.trim() === "")){
            return;
        }
    
        if(userData){          
            setLoadAlerts(true);
            const user_comment = await getCurrentUser({email: userData.email},"fromDB");
            if(user_comment.comment_banned){
                setLoadAlerts(false);
                setReplyContent("");
                alert.error("You have been banned from commenting.");
                return;
            }
            else {
                const obj = {
                    user_id: userData.id,
                    product_id: comment.message.product_id,
                    parent_id: comment.message.id,
                    comment_content: replyContent,
                    product_type: comment.message.product_type
                }
            
                const result = await addCommentsFunc(obj);
                if (result.message)
                    alert.error(result.message);
                else{
                    await getCurrentComments(comment.message.product_id);
                    setReplyContent("");
                }  
                setLoadAlerts(false);    
            }     
        }       
    }

    const updateRepliedComment = async (commentID) => {
        if( (editRepliedComment.content === '') || (editRepliedComment.content.trim() === "")){
            return;
        }
        if(userData){          
            setLoadAlerts(true);
            const user_comment = await getCurrentUser({email: userData.email},"fromDB");
            if(user_comment.comment_banned){
                setLoadAlerts(false);
                await getCurrentComments(comment.message.product_id);
                setEditRepliedComment({index: null, isEdit: false, content: ''});
                alert.error("You have been banned from commenting.");
                return;
            }
            else {
                const obj = {
                    user_id: userData.id,
                    comment_id: commentID,
                    comment_content: editRepliedComment.content 
                }
                
                const result = await updateCommentFunc(obj);
                console.log(result);
                if (result === "success") {
                    await getCurrentComments(comment.message.product_id);
                    setEditRepliedComment({index: null, isEdit: false, content: ''});
                }
                else
                    alert.error(result);
                setLoadAlerts(false);   
            }      
        }  
    }

    const updateOwnComment = async (commentID) => {
        if( (editOwnComment.content === '') || (editOwnComment.content.trim() === "")){
            return;
        }
        if(userData){          
            setLoadAlerts(true);
            const user_comment = await getCurrentUser({email: userData.email},"fromDB");
            if(user_comment.comment_banned){
                setLoadAlerts(false);
                await getCurrentComments(comment.message.product_id);
                setEditOwnComment({isEdit: false, content: ''});
                alert.error("You have been banned from commenting.");
                return;
            }
            else { 
                const obj = {
                    user_id: userData.id,
                    comment_id: commentID,
                    comment_content: editOwnComment.content 
                }
            
                const result = await updateCommentFunc(obj);
                if (result === "success") {
                    await getCurrentComments(comment.message.product_id);
                    setEditOwnComment({isEdit: false, content: ''});
                }
                else
                    alert.error(result);
                setLoadAlerts(false); 
            }        
        }  
    }

    const pinCommentFunc = async (isPinned, commentId) => {
        setLoadAlerts(true);
        
        const obj = {
            is_pinned: isPinned,
            comment_id: commentId
        }

        const result = await setCommentPin(obj);
        if(result === "success"){                    
            await getCurrentComments(comment.message.product_id);         
            setLoadAlerts(false);
        }
        else{
            setLoadAlerts(false);
            return;
        }            
    }

    const delCommentFunc = async (commentId) => {
        setLoadAlerts(true);
        
        const obj = {
            comment_id: commentId
        }

        const result = await setCommentDel(obj);
        if(result === "success"){                    
            await getCurrentComments(comment.message.product_id);         
            setLoadAlerts(false);
        }
        else{
            setLoadAlerts(false);
            return;
        }            
    }

    const banUserFunc = async (isBanned, userID) => {
        setLoadAlerts(true);
        
        const obj = {
            user_id: userID,
            comment_banned: isBanned
        }

        const result = await setCommentUserBan(obj);
        if(result === "success"){                    
            await getCurrentComments(comment.message.product_id);         
            setLoadAlerts(false);
        }
        else{
            setLoadAlerts(false);
            return;
        }            
    }

    return (<div key={comment.message.id} className={`comment-wrapper ${comment.message.is_pinned ? 'pinned' : ''}`}>
        <div className="avatar-div">
            {
                comment.message.profile_picture ? <img src={imgUrls[0]} alt={comment.message.username} />
                :
                <div>{noImgAvatars[0]}</div>
            }
        </div>
        <div className="section-div">
            <MDBRow between={true} className="mb-2">
                <MDBCol size="12" sm="12" md="6" lg="4" className="max325">
                    <MDBRow>
                        <MDBCol size="8">
                            <p className="name-p">{comment.message.username}</p>
                            <p className="date-p">{customTimes[0]}</p>
                        </MDBCol>
                        {
                            comment.message.is_pinned === 1 && <MDBCol  size="4">
                                <span className="float-left panned-span">PINNED</span>
                            </MDBCol>
                        }
                    </MDBRow>
                </MDBCol>
                {
                    userData && prodID && userData.user_role === "admin" ? <Fragment>
                        {
                            editOwnComment.isEdit?
                            <MDBCol size="12" sm="12" md="6" lg="4" className="admin-only">
                                <button className="consumer-edit update" onClick={() => updateOwnComment(comment.message.id)}>YES <MDBIcon icon="check" /></button>
                                <button className="consumer-edit cancel" onClick={() => setEditOwnComment({isEdit:false, conent: ''})}>NO <MDBIcon icon="times" /></button>
                            </MDBCol>
                            :
                            <MDBCol size="12" sm="12" md="6" lg="6" xl="4" className="admin-only">
                            <button className="ban" onClick={() => banUserFunc(!comment.message.comment_banned, comment.message.user_id)}>{
                                comment.message.comment_banned ? "UNBAN" : "BAN"
                            } <MDBIcon icon="ban" /></button>
                            <button className="del" onClick={() => delCommentFunc(comment.message.id)}>DEL <MDBIcon icon="trash-alt" /></button>
                            <button className="pin" onClick={() => pinCommentFunc(!comment.message.is_pinned, comment.message.id)}>{
                                comment.message.is_pinned ? "UNPIN" : "PIN"
                            } <MDBIcon icon="thumbtack" /></button>
                            <button className="edit" onClick={() => setEditOwnComment({isEdit:true, content: comment.message.comment_content})}>EDIT <MDBIcon icon="pencil-alt" /></button>
                        </MDBCol>
                        }
                    </Fragment> 
                    :
                    userData && prodID && userData.user_role === "consumer" ? comment.message.user_id === userData.id && comment.message.comment_banned !== 1 && comment.message.is_pinned !== 1 && <Fragment>
                        {
                            editOwnComment.isEdit?
                            <MDBCol size="12" sm="12" md="6" lg="4" className="admin-only">
                                <button className="consumer-edit update" onClick={() => updateOwnComment(comment.message.id)}>YES <MDBIcon icon="check" /></button>
                                <button className="consumer-edit cancel" onClick={() => setEditOwnComment({isEdit:false, conent: ''})}>NO <MDBIcon icon="times" /></button>
                            </MDBCol>
                            :
                            <MDBCol size="12" sm="12" md="6" lg="4" className="admin-only">
                                <button className="consumer-edit" onClick={() => setEditOwnComment({isEdit:true, content: comment.message.comment_content})}>EDIT <MDBIcon icon="pencil-alt" /></button>
                            </MDBCol>
                        }
                    </Fragment>
                    :
                    null
                }
                <MDBCol className="reply-col" size="12" sm="12" md="6" lg="2" xl="4">
                    {
                        comment.product_status ? comment.product_status === "active" && <button className="go-to-thread float-right text-white" onClick={() => historyURL.push(`/products/${comment.message.product_type}/${comment.message.product_id}`)}><MDBIcon icon="share" /> Go to thread</button>
                        :
                        prodComment && !editOwnComment.isEdit && <span className="float-right reply-span" onClick={() => {
                            setIsTruncated(false);
                            setIsReply(true);
                        }} style={{color: fontColors.special}}><MDBIcon icon="share" /> Reply</span>
                    }
                </MDBCol>
            </MDBRow>
            {
                isTruncated ? prodID && editOwnComment.isEdit ?
                        <textarea ref={textareaRef} className="edit own" value={editOwnComment.content} autoFocus={editOwnComment.isEdit} onChange={(e)=>setEditOwnComment({...editOwnComment, content:e.target.value})} rows="1" required/> 
                        :
                        <div className="two-spans">
                            <p style={{color: fontColors.paragraph}}>{comment.message.comment_content}</p>
                            <p className="bg-span text-right" style={{color: fontColors.header2}} onClick={() => setIsTruncated(false)}>Read Full<span className="hidden"> Comment</span></p>
                        </div>
                    : prodID && editOwnComment.isEdit ?
                        <textarea ref={textareaRef} className="edit own" value={editOwnComment.content} autoFocus={editOwnComment.isEdit} onChange={(e)=>setEditOwnComment({...editOwnComment, content:e.target.value})} rows="1" required /> 
                        :
                        <p className="less-p" style={{color: fontColors.paragraph}}>{comment.message.comment_content}<span className="wholeSpan" style={{color: fontColors.header2}} onClick={() => {
                            setIsTruncated(true);
                            setIsReply(false);
                        }}>Read Less<span className="hidden"> Comment</span></span></p>
            }

            <hr />
            {
                isTruncated ? <div className="truncated-comments">
                        {
                            uniqueChilds && uniqueChilds.length > 0 && uniqueChilds.map(
                                (child, i) => child.profile_picture ? <img key={child.id} src={truncatedImgUrls[i]} className={`avatar img${i + 1}`} alt={child.username} /> 
                                :
                                <div className={`avatar no-img img${i + 1}`}>{truncatedNoImgAvatars[i]}</div>
                            )                        
                        }
                        <label style={{left: leftMarginStr}}><span className="text-white">
                            {repliedUserNames}
                        </span>{`${!repliedUserNames ? 'No reply' : ' reply'}`}</label>

                    </div>
                    :
                    <div>
                        {
                            comment.childs.length > 0 ? comment.childs.map(
                                (child, i) =>
                                    <MDBRow>
                                        <MDBCol size="12" md="8" lg="9">
                                            <div className="untruncated-comments" key={child.id}>
                                                <div>
                                                    {
                                                        child.profile_picture ? <img src={imgUrls[i+1]} alt={child.username} />
                                                        :
                                                        <div>{noImgAvatars[i+1]}</div>
                                                    }
                                                </div>
                                                <div>
                                                    <p>
                                                        {child.username}
                                                        {
                                                            child.is_pinned === 1 && <span className="panned-span">PINNED</span>                                                           
                                                        }
                                                    </p>
                                                    {
                                                        i === editRepliedComment.index && prodID && editRepliedComment.isEdit?
                                                        <textarea ref={textareaRef} className="edit" value={editRepliedComment.content} autoFocus={editRepliedComment.isEdit} onChange={(e)=>setEditRepliedComment({...editRepliedComment, content:e.target.value})} rows="1" required/> 
                                                        :
                                                        <label className="sub-comments" style={{color: fontColors
                                                        .paragraph}}>{child.comment_content}</label>
                                                    }
                                                    <p>{customTimes[i+1]}</p>
                                                </div>
                                            </div>
                                        </MDBCol>
                                        {
                                            userData && prodID && userData.user_role === "admin" && <Fragment>
                                                {
                                                    i === editRepliedComment.index && editRepliedComment.isEdit?
                                                    <MDBCol size="12" md="4" lg="3" className="admin-only center">
                                                        <button className="consumer-edit update" onClick={() => updateRepliedComment(child.id)}>YES <MDBIcon icon="check" /></button>
                                                        <button className="consumer-edit cancel" onClick={() => setEditRepliedComment({index:null, isEdit:false, conent: ''})}>NO <MDBIcon icon="times" /></button>
                                                    </MDBCol>
                                                    :
                                                    <MDBCol size="12" md="4" lg="3" className="admin-only center">
                                                        <button className="ban" onClick={() => banUserFunc(!child.comment_banned, child.user_id)}>{
                                                                child.comment_banned ? "UN" : ""
                                                        } <MDBIcon icon="ban" /></button>
                                                        <button className="del" onClick={() => delCommentFunc(child.id)}><MDBIcon icon="trash-alt" /></button>
                                                        <button className="pin" onClick={() => pinCommentFunc(!child.is_pinned, child.id)}>{child.is_pinned ? 'UN ' : ''}<MDBIcon icon="thumbtack" /></button>
                                                        <button className="edit" onClick={() => setEditRepliedComment({index:i, isEdit:true, content: child.comment_content})}><MDBIcon icon="pencil-alt" /></button>
                                                    </MDBCol>
                                                }
                                            </Fragment>
                                        }
                                        {
                                            userData && prodID && userData.user_role === "consumer" && child.user_id === userData.id && child.comment_banned !== 1 && child.is_pinned !== 1 &&  
                                            <MDBCol size="12" md="4" lg="3" className="admin-only center">
                                                {
                                                    i === editRepliedComment.index && editRepliedComment.isEdit ?
                                                    <div>
                                                        <button className="consumer-edit update" onClick={() => updateRepliedComment(child.id)}><MDBIcon icon="check" /></button>
                                                        <button className="consumer-edit cancel" onClick={() => setEditRepliedComment({index:null, isEdit:false, conent: ''})}><MDBIcon icon="times" /></button>
                                                    </div>
                                                    :
                                                    <button className="consumer-edit" onClick={() => setEditRepliedComment({index:i, isEdit:true, content: child.comment_content})}><MDBIcon icon="pencil-alt" /></button>
                                                }                                                
                                            </MDBCol>                        
                                        }
                                    </MDBRow>
                            )
                            :
                            <div className="untruncated-comments">
                                <div>
                                    <p className="sub-comments">No reply</p>
                                </div>
                            </div>
                        }
                        {
                            isReply && <div className="untruncated-comments">
                                <div>
                                    {
                                        userData.profile_picture ? <img src={myAvatar.avatarImg} alt={userData.username} />
                                        :
                                        <div>{myAvatar.noAvatarImg}</div>
                                    }
                                </div>
                                <div>
                                    <input type="text" value={replyContent} placeholder="Reply..." autoFocus={isReply} onChange={(e)=> setReplyContent(e.target.value)}/>
                                    <button onClick={()=>replyCommentFunc()}><MDBIcon icon="share" /></button>
                                </div>
                            </div>
                        }                        
                    </div>
            }

        </div>
    </div>
    )
}

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})

const MapDispatchToProps = dispatch => ({
    addCommentsFunc: addCommentsFunc(dispatch),
    getCurrentComments: getCurrentComments(dispatch),
    setCommentPin: setCommentPin(dispatch),
    setCommentDel: setCommentDel(dispatch),
    setCommentUserBan: setCommentUserBan(dispatch),
    updateCommentFunc: updateCommentFunc(dispatch),
    getCurrentUser: getCurrentUser(dispatch),
    setLoadAlerts: flag => dispatch(setLoadAlerts(flag))    // for waiting load
})
export default connect(MapStateToProps, MapDispatchToProps)(CommentsComponent);