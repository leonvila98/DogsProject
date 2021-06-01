import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from "redux";
import * as actionCreators from '../../actions/index.js';
import './landingPage.css';


function LandingPage (props) {

    useEffect(()=>{
        props.getTemperaments();
        props.getDogs();
    },[])

    return (
        <div className='allPage'>
            <h1 className='title'>HENRY DOGS</h1>
            <div className='buttons'>
                <NavLink id='buttonDogs' to='/home'>ALL DOGS</NavLink>
                <NavLink id='buttonTemperament' to='/form'>ADD BREED</NavLink>
            </div>
        </div>
    );
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators,dispatch);
}
  
export default connect(null,mapDispatchToProps)(LandingPage);