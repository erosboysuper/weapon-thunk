import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setProductPageNum, setWonListPageNum } from '../../../../redux/purchased-items/purchased-items.action';
import './page-buttons.style.scss';

const PageButtons = ({type, count, currentIndex, setProductPageNum, setWonListPageNum, currentFontColors}) => {

    const [fontColor, setFontColor] = useState("#a3a3a3");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color) {
            const color = JSON.parse(currentFontColors.form_color);
            setFontColor(`rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`);
        }
    }, [currentFontColors]);
   
    const [countArray, setCountArray] = useState([]);

    useEffect(() => {
        let arrayVal = [];
        if (count === 0)
            setCountArray([]);
        else{
            if (currentIndex === 1){
                for(let i=1; i <=3; i++){
                    if ( i <= count)
                        arrayVal.push(i);
                }
            }
            else if (currentIndex === count){
                for(let i=currentIndex-2; i <=currentIndex; i++){
                    if ( 0 < i && i <= count)
                        arrayVal.push(i);
                }
            }
            else{
                for(let i=currentIndex-1; i <=currentIndex+1; i++){
                    if ( i <= count)
                        arrayVal.push(i);
                }
            }        
            setCountArray(arrayVal);
        }
    }, [currentIndex, count]);
   
    return (
        <div className="page-buttons">
            <div style={{color: fontColor}} onClick={()=>{
                type === "prodList" ?
                    currentIndex - 1 > 0 &&  setProductPageNum(currentIndex - 1)
                    :
                    currentIndex - 1 > 0 &&  setWonListPageNum(currentIndex - 1)
            }}>{"< "}<span className="hiddenSpan">Previous</span></div>            
            {
                countArray&&countArray.map(
                    item => <div 
                                key={item} 
                                className={`${item === currentIndex ? 'current ' : ''}pageNum`} 
                                onClick={()=>{
                                    type === "prodList" ? setProductPageNum(item) : setWonListPageNum(item)
                                }}>
                                {item}
                            </div>
                )
            }           
            <div style={{color: fontColor}} onClick={()=>{
                type === "prodList" ?
                    currentIndex + 1 <= count &&  setProductPageNum(currentIndex + 1)
                    :
                    currentIndex + 1 <= count &&  setWonListPageNum(currentIndex + 1)
            }}><span className="hiddenSpan">Next</span>{" >"}</div>
        </div>
    )
}

const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
}) 

const MapDispatchToProps = dispatch => ({
    setProductPageNum: index => dispatch(setProductPageNum(index)),
    setWonListPageNum: index => dispatch(setWonListPageNum(index))
})

export default connect(MapStateToProps, MapDispatchToProps)(PageButtons);