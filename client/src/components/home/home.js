import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink,Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import * as actionCreators from '../../actions/index.js';
import Dog from "../dog/dog.js";
import './home.css';

function Home (props){
    const [name,setName]=useState('');
    const [flagSearching,setFlagSearching]=useState(false);
    const [temperament,setTemperament]=useState('');
    const [order,setOrder]=useState('');
    const [weightOrName,setWeightOrName]=useState('');
    const [currentPage,setCurrentPage]=useState(1);
    const [isLoading,setIsLoading]=useState(true);
    const [pageElement,setPageElement]=useState(document.getElementById(currentPage));
    const dogsPerPage = 8;
    const [flag,setFlag]=useState(false);

    const[flagCreatedByMe,setFlagCreatedByMe]=useState(false);
    
    useEffect(()=>{
        props.getTemperaments();
        props.getDogs();
        setIsLoading(false);
    },[])
    
    let dogsToShow = [];

    if(flagCreatedByMe){
        dogsToShow = props.allDogs.filter(dog=>dog.createdByMe === true);
    } else {
        if(!flagSearching){
            //setDogsToShow(props.allDogs)
            dogsToShow = props.allDogs;
        } else {
            //setDogsToShow(props.dogsFound)
            dogsToShow = props.dogsFound;
        }
    }


    const displayTemperaments = props.temperaments
    .map(temper=>{
        return(
            <option className='optionTemperament' value={temper.id}>{temper.name}</option>
        )
    })

    const indexOfLastDog = currentPage * dogsPerPage;
    const indexOfFirstDog = indexOfLastDog - dogsPerPage;

    const displayDogs = dogsToShow
        .slice(indexOfFirstDog, indexOfLastDog)
        .map((dog)=>{
            return(
                <div className='dogsDisplay' key={dog.id}>
                    <div className='flip-card-inner'>
                        <div className="flip-card-front">
                            <img src={dog.image} alt="Avatar"/>
                        </div>
                        <div className='flip-card-back'>
                            <label id='cardName'>{dog.name}</label> 
                            <label id='weight'>Weight: Min {dog.weight[0]}kg, Max {dog.weight[1]}kg</label>
                            <NavLink to={`/home/${dog.id}`}>
                                <button id='details'>DETAILS</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            )
        })

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(dogsToShow.length / dogsPerPage); i++) {
        pageNumbers.push(i);
    }
    const handlePageClick = (event) => {
        event.target.style.background='#CB997E'
        setPageElement(event.target);
        setCurrentPage(Number(event.target.id));
        if(flag){
            pageElement.style.background='#FFE8D6'
        }
        setFlag(true);
    }
    const displayPageNumbers = pageNumbers.map(number => {
        return (
            <li key={number} className='paginationNumbers' id={number} onClick={handlePageClick}>
                {number}
            </li>
        );
    });

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleTemperamentChange = (event) => {
        setTemperament(event.target.value);
    }
    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    }
    const handleWeightOrNameChange = (event) => {
        setWeightOrName(event.target.value);
    }

    const handleFilterClick = () => {
        //const {weightOrName,order,temperament,name}
        props.searchDog({
            weightOrName:weightOrName,
            temperament:temperament,
            order:order,
            name:name
        })
        setFlagSearching(true);
        setCurrentPage(1);
    }
    const handleResetFiltersClick = () => {
        setTemperament('');
        setWeightOrName('');
        setOrder('');
        setName('');
        setFlagSearching(false);
        // console.log(props.allDogs[0].id);
        // props.getDetail(props.allDogs[0].id);
    }
    const handleCreatedByMeClick = (event) => {
        if(flagCreatedByMe){
            event.target.style.background='#FFE8D6'
        } else {
            event.target.style.background='#CB997E'
        }
        setFlagCreatedByMe(flagCreatedByMe?false:true);
    }
    const handleSubmit = (event) => {
        props.getDogs();
        event.preventDefault();
        props.searchDog({
            weightOrName:weightOrName,
            temperament:temperament,
            order:order,
            name:name
        })
        setFlagSearching(name?true:false);
        setCurrentPage(1);
    }
    if(isLoading){
        return(
            <div className='loader'></div>
        )
    } else {
        return(
            <div className='navBarAndFilters'>
                <div className='navBar'>
                    <NavLink className='backButton' to={`/`}>BACK</NavLink>
                    <NavLink className='addBreedButton' to={`/form`}>ADD BREED</NavLink>
                </div>
                <div className='filters'>
                    <div className='filtersFirstRow'>
                        <div className='selectOption'>
                            <select value={temperament} onChange={(e) => handleTemperamentChange(e)}>
                                <option value="" disabled selected hidden>Temperaments</option>
                                {displayTemperaments}
                            </select>
                        </div>
                        <div className='selectOption'>
                            <select value={order} onChange={(e) => handleOrderChange(e)}>
                                <option value="" disabled selected hidden>Order direction</option>
                                <option value="ASC">Ascendent</option>
                                <option value="DESC">Descendent</option>
                            </select>
                        </div>
                        <div className='selectOption'>
                            <select defaultValue="name" value={weightOrName} onChange={(e) => handleWeightOrNameChange(e)}>
                                <option value="" disabled selected hidden>Order by</option>
                                <option value="name">Name</option>
                                <option value="weight">Weight</option>
                            </select>
                        </div>
                    </div>
                    <div className='filtersSecondRow'>
                        <div className='filterButtonsConteiner'>
                            <button id='buttonFilter' onClick={()=>handleFilterClick()}>Filter</button>
                            <button id='buttonResetFilters' onClick={()=>handleResetFiltersClick()}>Reset filters</button>
                        </div>
                        <form id='dogSearch' onSubmit={(e) => handleSubmit(e)}>
                            <input
                                type="text"
                                id="name" 
                                autoComplete="off"
                                placeholder="Dog name"
                                value={name}
                                onChange={(e) => handleNameChange(e)}
                                />
                            <button id='searchButton' type="submit" >SEARCH</button>
                        </form>
                        <div>
                            <button id='createdByMeButton' onClick={(e)=>handleCreatedByMeClick(e)}>SEE MY DOGS</button>
                        </div>
                    </div>
                </div>
                <div className='pagination'>
                    <div className='dogsConteiner'>
                        {displayDogs}
                    </div>
                    <div className='pageNumbers'>
                        <div className='pageNumbersConteiner'>
                            {displayPageNumbers}
                        </div>
                    </div>
                </div>
                <div className='dogDetails'>
                    <Route path ="/home/:id" component={Dog} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return{
        allDogs: state.allDogs,
        dogsFound: state.dogsFound,
        dogDetail: state.dogDetail,
        temperaments: state.temperaments
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators,dispatch);
}
  
export default connect(mapStateToProps,mapDispatchToProps)(Home);