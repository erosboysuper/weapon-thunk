import React, {useState, useEffect} from 'react';
import './faq-item.style.scss';
import { MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
 
const FaqItemComponent = ({question, answer, currentFontColors}) => {

    const [fontColors, setFontColors] = useState({
        header: "white",
        content: "#a3a3a3"
    });
    useEffect(() => {
        if (currentFontColors && currentFontColors.header2_color && currentFontColors.paragraph_color) {
            const hColor = JSON.parse(currentFontColors.header2_color);
            const pColor = JSON.parse(currentFontColors.paragraph_color);

            setFontColors({
                header: `rgba(${hColor.r }, ${hColor.g }, ${hColor.b }, ${hColor.a })`,
                content: `rgba(${pColor.r }, ${pColor.g }, ${pColor.b }, ${pColor.a })`
            })
        }
    }, [currentFontColors]);
    
    const [answerShow, setAnswerShow] = useState(false);
    
    return (
        <div className="faq-item">
            <div className="question">
                <p style={{color: fontColors.header}}>{question}</p>
                <button onClick={()=>setAnswerShow(!answerShow)} style={{borderColor: fontColors.header}}>{ answerShow ? <i class="fa fa-minus" aria-hidden="true" style={{color: fontColors.header}}></i> : <i class="fa fa-plus" aria-hidden="true" style={{color: fontColors.header}}></i>}</button>
            </div>
            {
                answerShow && <div className="answer">
                    <p style={{color: fontColors.content}}>{answer}</p>
                </div>
            }
        </div>
    )
}

const MapStateToProps = ({ colors: { currentFontColors }}) => ({
    currentFontColors
})

export default connect(MapStateToProps)(FaqItemComponent);