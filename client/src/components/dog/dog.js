import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from '../../actions/index.js';
import './dog.css';

function Dog(props){
    const dogId = props.match.params.id

    useEffect(()=>{
        props.getDetail(dogId);
        const card=document.getElementById('card')
        if(card){
            card.style.display='inherit';
        }
    },[dogId]);

    const {name,height,weight,life_span,image,temperaments} = props.dog;

    const handleCloseClick = () => {
        const card=document.getElementById('card')
        card.style.display='none';
    }

    if(height!==undefined){
        return(
            <div id='card'>
                <div className='cardContent'>
                    <button className='closeButton' onClick={()=>handleCloseClick()}>X</button>
                    <div className='image'>
                        <img src={image}></img>
                    </div>
                    <div className='secondRow'>
                        <div className='data'>
                            <h2>{name}</h2> 
                            <p>Height: Min {height[0]}cm, Max {height[1]}cm</p>
                            <p>Weight: Min {weight[0]}kg, Max {weight[1]}kg</p>
                            <p>Life span: {life_span}</p>
                        </div>
                        <div className='temperamentsConteiner'>
                            <p>Temperaments:</p>
                            <ul className='temperaments'>
                                {
                                    temperaments && temperaments.map((temper)=>{
                                        return(
                                            <li>
                                                <span className='span'>{temper.name}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
    
                    </div>
                </div>
            </div>
        )
    } else {
        return(
            <div>
                
            </div>
        )
    }
}

function mapStateToProps(state) {
    return{
        dog: state.dogDetail,
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators,dispatch);
}
  
export default connect(mapStateToProps,mapDispatchToProps)(Dog);