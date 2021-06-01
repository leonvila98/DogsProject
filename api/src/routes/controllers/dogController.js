const axios = require('axios');
const { Op } = require("sequelize");
const{ Dog , Temperament} = require('../../db.js');
const fetch = require('node-fetch');  
const { v4: uuidv4 } = require('uuid');
const { API_KEY } = process.env;
const URL = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`
let flag = false;

async function getDogs(req,res,next){
    if(!flag){ 
        console.log('CREO LOS DOGS');
        await fetch(URL)//CREO Y DEVUELVO LOS DOGS POR PRIMERA VEZ
            .then(dogs => dogs.json())
            .then(async dogs => {
                for(let dog of dogs){
                    const {name,height,weight,life_span,image} = dog;

                    let weightSplitted = [];//ASIGNO EL PESO MIN Y MAX COMO ARRAY
                    var regEx = /\s*-\s*/;
                    weightSplitted = weight.metric.split(regEx)
                    weightSplitted = weightSplitted.map(function(number) {
                        let num = parseInt(number, 10);
                        if(num)return num
                        else return 0
                    });

                    let heightSplitted = [];//ASIGNO ALTURA MIN Y MAX COMO ARRAY
                    var regEx = /\s*-\s*/;
                    heightSplitted = height.metric.split(regEx)
                    heightSplitted = heightSplitted.map(function(number) {
                        let num = parseInt(number, 10);
                        if(num)return num
                        else return 0
                    });

                    if(dog.temperament){//BUSCO LOS TEMPERAMENTOS EN LA DB PARA VINCULARLOS A SUS RESPECTIVOS DOGS
                        const regEx = /,\s*/;
                        var temperamentsSplitted = dog.temperament.split(regEx);
                        var arrayOfTempers = [];
                        for(let i=0;i<temperamentsSplitted.length;i++){
                            const temper = await Temperament.findOne({
                                where:{
                                    name:{
                                        [Op.iLike]:`%${temperamentsSplitted[i]}%`
                                    }
                                },
                                atributes:['id','name']
                            });
                            arrayOfTempers.push(temper);
                        }  
                    }
                    
                    const id = uuidv4();
                    const createdDog=await Dog.create({//CREO LOS DOGS
                        id,
                        name,
                        height:heightSplitted,
                        weight:weightSplitted,
                        life_span,
                        image:image.url
                    })
                    for(let t of arrayOfTempers){
                        createdDog.setTemperaments(t);//VINCULO TEMPERAMENTO
                    }
                }
                flag = true;
            })
            .then(async () =>  await Dog.findAll({
                include: [{
                    model: Temperament
                }]
            }))
            .then(dogs => res.send(dogs))
            .catch(err=>res.send(err))
    } else {
        if(req.query.temperament){
            console.log('GET DOGS');
                const {weightOrName,order,temperament} = req.query
                const temper = await Temperament.findByPk(temperament);
                console.log('TEMPERAMENT:'+temperament);
                await temper.getDogs({
                    order:[[weightOrName||'name',order||'ASC']],
                    include: [{
                        model: Temperament
                    }],
                })
                .then((dogs)=>res.send(dogs))
                .catch((err)=>res.send(err,'No se encontraron los perros'))
        } else {
            if(!req.query.name){//TRAIGO TODOS LOS DOGS CON O SIN FILTRO
                console.log('GET DOGS');
                const {weightOrName,order,temperament} = req.query
                console.log('TEMPERAMENT:'+temperament);
                await Dog.findAll({
                    order:[[weightOrName||'name',order||'ASC']],
                    include: [{
                        model: Temperament
                    }],
                })
                .then((dogs)=>res.send(dogs))
                .catch((err)=>res.send(err,'No se encontraron los perros'))
            } else {//BUSCO POR NOMBRE
                console.log('entro busqueda por nombre')
                const {weightOrName,order,temperament} = req.query
                console.log('WEIGHT OR NAME POR NOMBRE:'+weightOrName);
                const dogs = await Dog.findAll({
                    order:[[weightOrName||'name',order||'ASC']],
                    include: [{
                        model: Temperament
                    }],
                })
                const dogsFound = dogs.filter(d=>d.name.toLowerCase().startsWith(req.query.name.toLowerCase()));
                dogsFound?res.status(200).json(dogsFound):res.status(400).send('No dogs found')
            }
        }
    }
}

async function getDogDetail(req,res){
    const dog = await Dog.findByPk(req.params.idDog,{include:Temperament});
    dog?res.status(200).json(dog):res.status(400).send('No se encontro el perro')
}

async function postDog(req,res){
    try{
        const {name,height,weight,life_span,image,temperaments} = req.body;
        if(name && height && weight){
            console.log(temperaments);
            if(temperaments){//BUSCO LOS TEMPERAMENTOS EN LA DB PARA VINCULARLOS A SUS RESPECTIVOS DOGS
                var arrayOfTempers = [];
                for(let i=0;i<temperaments.length;i++){
                    const temper = await Temperament.findOne({
                        where:{
                            name:{
                                [Op.iLike]:`%${temperaments[i]}%`
                            }
                        },
                        atributes:['id','name']
                    });
                    arrayOfTempers.push(temper);
                }  
            }
    
            const id = uuidv4();
            const dog = await Dog.create({
                id,
                name,
                height,
                weight,
                life_span,
                image,
                createdByMe:true
            })
            for(let t of arrayOfTempers){
                console.log(t.name);
                dog.setTemperaments(t);
            }
            res.send(dog);
        } else {
            res.sendStatus(400);
        }
    }
    catch(err){
        res.status(400).send(err);
    }
}

module.exports = {
    getDogs,
    getDogDetail,
    postDog,
}
