const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { render } = require('ejs');
const appointmentService = require('./services/AppointmentService');
const AppointmentService = require('./services/AppointmentService');

//Uso de arquivos estaticos
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/agendamento',{
    useNewUrlParser:true,
    useUnifiedTopology:true 
})
mongoose.set('useFindAndModify', false);



app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/cadastro', (req, res)=>{
    res.render('create');
})

app.post('/create', async(req, res)=>{
    var status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
        )

    if(status){
        res.redirect('/');
    }else{
        res.send('Ocorreu uma falha.');
    }
});

app.get('/getcalendar', async(req, res)=>{
    
    var consults = await AppointmentService.GetAll(false);

    res.json(consults);

});

app.get('/event/:id', async(req, res)=>{
    var result = await AppointmentService.GetById(req.params.id);

    if (result){
        //res.json(result);
        res.render('eventos', {appo: result});
    }else{
        res.redirect('/');
    }
    
})

app.post('/finish', async(req, res)=>{
    var id=req.body.id;
    //res.json('id:'+id);
    var result = await AppointmentService.Finish(id);
    res.redirect('/');
})

app.get('/list', async(req, res)=>{//todas as consultas.
    
    var result = await AppointmentService.GetAll(true);
    res.render('list',{result});
    //res.json(result);
})

app.get('/searchresult', async(req, res)=>{
    //quando se usa metodo get sem parametros é preciso usar o QUERY.
    var result = await AppointmentService.Search(req.query.search);
    res.render('list',{result});
})



//A cada 2 minutos executa essa função. Ex: 2 * 60000(1 minutos)
var polltime = 5 * 60000;
setInterval(async ()=>{
    await AppointmentService.SendNotification();
},polltime)

app.listen(8080, () =>{});
