var appointment = require('./../models/Appointment');
var mongoose = require('mongoose');
var AppointmentFactory = require('./../factories/AppointmentFactory');
var nodemail = require('nodemailer');

const Appo = mongoose.model('Appointment', appointment); // esse é o model que sera criado.

class AppointmentService{

    //Criação de Appoint
    async Create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (error) {
            console.log('err');
            return false;
        }
        
    }

    async GetAll(showFinished){
        if (showFinished){
            return await Appo.find();
        }else{
            var appos = await Appo.find({'finished': false});
            var appointements = [];
            appos.forEach(app =>{
                if (app.date != undefined){

                    appointements.push(AppointmentFactory.Build(app));
                }
                
            });
            return appointements;
        }
    }
    
    async GetById(id){

        try {
            var event = await Appo.findOne({'_id': id});
            return event;
        } catch (error) {
            //console.log(err); // o bom é retorno um json.
            return false;
        }
        
    }

    async Finish(id){
        try {
            var event = await Appo.findByIdAndUpdate(id,{
                finished:true
            })
            return true;
        } catch (error) {
            return false;
        }
       
    }
    //Essa busca pode ser um email ou cpf
    async Search(query){
        try {
            var event = await Appo.find().or([{email:query},{cpf:query}]);
            return event;
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }

    async SendNotification(){
        var appos = await this.GetAll(false);

          //Prepara para enviar o e-mail.
          var transporter = nodemail.createTransport({
            host: 'smtp.mailtrap.io',
            port: '25',
            auth:{
                user:"d91f98641e358f",
                pass: 'a1f835878ee8a0'
            }
        }); 

        appos.forEach(async app =>{
            var date = app.start.getTime(); //pega a data em minisegundos.
            var hour = 1000 * 60 * 60; //quantidade de minisegundos em uma hora. se quiser por 2 horas é so acrescentar apois o ultimo 60 a multiplicação da hora que deseja; Ex: 1000 * 60 * 60 * 2

            var gap = date - Date.now(); //Subtração das datas em minisegundos.
            if (gap <= hour){

                if (!app.notified){

                    await Appo.findByIdAndUpdate(app.id, {notified:true});

                    transporter.sendMail({
                        from: 'Junior Campaneli <junior.campaneli@teste.com.br>',
                        to: app.email,
                        subject: "Sua consulta será em breve",
                        text: app.name + ' sua consulta será em menos de 1 hora.'
                    }).then(()=>{

                    }).catch(err =>{

                    });

                }
            }
        })
    }
}

module.exports = new AppointmentService();