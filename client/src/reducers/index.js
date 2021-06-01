const initialState = {
    allDogs: [],
    dogsFound: [],
    dogDetail: {},
    temperaments: [],
    dogsCreated: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "GET_DOGS":
            //action.payload.shift();
            return {
                ...state,
                allDogs: action.payload
            }
        case "GET_DOG_DETAIL":
            return {
                ...state,
                dogDetail: action.payload
            }
        case 'GET_SEARCH_DOG':
            return{
                ...state,
                dogsFound: action.payload
            }
        case "GET_TEMPERAMENTS":
            return{
                ...state,
                temperaments:action.payload
            }
        case "ADD_DOG":
            return{
                ...state,
                dogsCreated:action.payload
            }
        default:
            return state;
    }
}