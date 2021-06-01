import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from "redux";
import * as actionCreators from '../../actions/index.js';
import './form.css'

function Form (props) {
    const [name,setName]=useState('');
    const [life_span,setLife_span]=useState('');
    const [heightMin,setHeightMin]=useState('');
    const [heightMax,setHeightMax]=useState('');
    const [weightMin,setWeightMin]=useState('');
    const [weightMax,setWeightMax]=useState('');
    const [image,setImage]=useState('');

    const [temperamentsSelected,setTemperamentsSelected]=useState([]);
    const [temperamentsList,setTemperamentsList]=useState(props.temperaments);

    useEffect(()=>{
        props.getTemperaments();
    },[])

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleHeightMinChange = (event) => {
        setHeightMin(event.target.value);
    }
    const handleHeightMaxChange = (event) => {
        setHeightMax(event.target.value);
    }
    const handleWeightMinChange = (event) => {
        setWeightMin(event.target.value);
    }
    const handleWeightMaxChange = (event) => {
        setWeightMax(event.target.value);
    }
    const handleLifeSpanChange = (event) => {
        setLife_span(event.target.value);
    }
    const handleImageChange = (event) => {
        setImage(event.target.value);
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();
        props.postDog({
            name,
            height:[heightMin,heightMax],
            weight:[weightMin,weightMax],
            life_span,
            image,
            temperaments:temperamentsSelected
        });
        console.log(temperamentsSelected);
    }

    const displayTemperamentsSelected = temperamentsSelected
    .map(temper=>{
        return(
            <li>
                {temper}
            </li>
        )
    })

    const displayTemperaments = temperamentsList
    .map(temper=>{
        return(
            <option value={temper.name}>
                {temper.name}
            </option>
        )
    })

    const handleSelectTemperament= (event) => {
        const option = event.target.value;
        console.log(option)
        if (option) {
            setTemperamentsSelected(temperamentsSelected.concat(option));
            setTemperamentsList(temperamentsList.filter((temper)=>temper.name!==option));
        }         
    }

    return (
        <div className='allForm'>
            <div className='navBar'>    
                <NavLink className='buttonBack' to={`/`}>BACK</NavLink>
                <NavLink className='allDogsButton' to={`/home`}>ALL DOGS</NavLink>
            </div>
            <form className='form' onSubmit={(e) => handleSubmit(e)}>
                <div className='inputs'>
                    <div>
                        <label htmlFor="name">Name of breed: </label>
                        <input
                            type="text"
                            className="classicInput"
                            autoComplete="off"
                            //placeholder="Name of breed"
                            value={name}
                            onChange={(e) => handleNameChange(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="height">Height: </label>
                        <input
                            type="number"
                            id="heightMin"
                            autoComplete="off"
                            placeholder="Min"
                            value={heightMin}
                            onChange={(e) => handleHeightMinChange(e)}
                        />
                        <input
                            type="number"
                            id="heightMax"
                            autoComplete="off"
                            placeholder="Max"
                            value={heightMax}
                            onChange={(e) => handleHeightMaxChange(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="weight">Weight: </label>
                        <input
                            type="number"
                            id="weightMin"
                            autoComplete="off"
                            placeholder="Min"
                            value={weightMin}
                            onChange={(e) => handleWeightMinChange(e)}
                        />
                        <input
                            type="number"
                            id="weightMax"
                            autoComplete="off"
                            placeholder="Max"
                            value={weightMax}
                            onChange={(e) => handleWeightMaxChange(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="life_span">Life span: </label>
                        <input
                            type="number"
                            className="classicInput"
                            autoComplete="off"
                            //placeholder="Life span"
                            value={life_span}
                            onChange={(e) => handleLifeSpanChange(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Image URL: </label>
                        <input
                            type="text"
                            className="classicInput"
                            autoComplete="off"
                            //placeholder="Url"
                            value={image}
                            onChange={(e) => handleImageChange(e)}
                        />
                    </div>
                    <button className='addButton' type="submit">ADD BREED</button>
                </div>
                <div className='lists'>
                    <select multiple className='temperamentsList' value={temperamentsList} onChange={(e)=>handleSelectTemperament(e)}>
                        {displayTemperaments}
                    </select>
                    <div className='temperamentsSelectedConteiner'>
                        <ul className='temperamentsSelected'>
                            {displayTemperamentsSelected}
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
}

function mapStateToProps(state) {
    return{
        allDogs: state.allDogs,
        dogsFound: state.dogsFound,
        dogDetail: state.dogDetail,
        temperaments: state.temperaments,
        dogCreated: state.dogsCreated
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators,dispatch);
}
  
export default connect(mapStateToProps,mapDispatchToProps)(Form);