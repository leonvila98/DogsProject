const axios = require('axios');
const{ Temperament } = require('../../db.js');
const fetch = require('node-fetch');  
const { v4: uuidv4 } = require('uuid');
const { API_KEY } = process.env;
const URL = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`
let flag = false;

async function getTemperaments (req,res){
    if(!flag){
        var dogs = await fetch(URL)
        dogs = await dogs.json()
        const temperaments = unirTemperamentos(dogs);
        for(let temper of temperaments){
            const id = uuidv4();
            await Temperament.create({
                id,
                name:temper
            })
        }
        flag = true;
        const tFound = await Temperament.findAll()
        res.send(tFound);
    } else {
        const tFound = await Temperament.findAll()
        res.send(tFound);
    }
}

function unirTemperamentos(dogs){//CONVIERTO LOS TEMPERAMENTOS YA EXISTENTES EN OBJETOS PARA LA DB
    let temperamentsNotConcat = [];
    let temperamentsNotFinished = [];
    let temperamentsFinished = [];
    var regEx = /,\s*/;
    for(let dog of dogs){
        const {temperament} = dog;
        if(temperament){
            temperamentsNotConcat = temperament.split(regEx);
            temperamentsNotFinished = temperamentsNotFinished.concat(temperamentsNotConcat);
        }
    }
    temperamentsFinished = [...new Set(temperamentsNotFinished)];
    return temperamentsFinished;
}

module.exports = {
    getTemperaments
}
