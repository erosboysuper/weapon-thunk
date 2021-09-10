import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setFilterString } from '../../../../redux/purchased-items/purchased-items.action';
import './filter-input.style.scss';
import { MDBIcon } from 'mdbreact';

const TableFilterInput = ({setFilterString, str, currentFontColors}) => {

    const [formFontColor, setFormFontColor] = useState("#a3a3a3");
    useEffect(() => {
        if (currentFontColors && currentFontColors.form_color) {
            const formColor = JSON.parse(currentFontColors.form_color);
            setFormFontColor(`rgba(${formColor.r }, ${formColor.g }, ${formColor.b }, ${formColor.a })`);
        }
    }, [currentFontColors]);

    const [filterStr, setFilterStr] = useState( str || "" );
    
    return (
        <div className="table-filter-input">
            <input type="text" placeholder="Search by name" value={filterStr} style={{color: formFontColor}} onChange={(e)=>setFilterStr(e.target.value)}/>
            <button onClick={()=>setFilterString(filterStr)}><span className="searchSpan">SEARCH</span><MDBIcon icon="search" className="searchBtn"/></button>
        </div>
    )
}
const MapStateToProps = ({ colors: {currentFontColors}}) => ({
    currentFontColors
})
const MapDispatchToProps = dispatch => ({
    setFilterString: filterStr => dispatch(setFilterString(filterStr))
})

export default connect(MapStateToProps, MapDispatchToProps)(TableFilterInput);