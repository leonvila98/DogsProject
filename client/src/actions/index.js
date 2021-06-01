const axios = require('axios').default;
const URL = 'http://localhost:3001/dogs/';
const URL_TEMPER = 'http://localhost:3001/temperament/'

export function getDogs(){
    return function(dispatch) {
        return fetch(URL)
            .then(dogs => dogs.json())
            .then(json => {
                dispatch({ type: "GET_DOGS", payload: json });
            })
            .catch((err)=>{console.log(err)});
    };
}

export function searchDog(requirements){
    const {weightOrName,order,temperament,name} = requirements
    return function(dispatch) {
        return fetch(`${URL}?name=${name}&weightOrName=${weightOrName}&order=${order}&temperament=${temperament}`)
        .then(response => response.json())
        .then(json => {
            dispatch({ type: "GET_SEARCH_DOG", payload: json });
        })
        .catch((err)=>{console.log(err)});
    };
}

export function getDetail(id){
    return function(dispatch) {
        return fetch(URL+id)
            .then(dogs => dogs.json())
            .then(json => {
                dispatch({ type: "GET_DOG_DETAIL", payload: json });
            })
            .catch((err)=>{console.log(err)});
    };
}

export function getTemperaments(){
    return function(dispatch) {
        return fetch(URL_TEMPER)
            .then(temperaments => temperaments.json())
            .then(json => {
                dispatch({ type: "GET_TEMPERAMENTS", payload: json });
            })
            .catch((err)=>{console.log(err)});
    };
}

export function postDog(body){
    return async function (dispatch){
        return axios.post(URL,body)
        .then(json => {
            alert('DOG SUCCESSFULLY ADDED');
            dispatch({ type: "ADD_DOG", payload: json });
        })
        .catch((err)=>{alert('ERROR CHECK THE FIELDS')});
    }
}
