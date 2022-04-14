class AppointmentFactory{

    Build(simpleConsult){
        var month = simpleConsult.date.getMonth();//Captura o Mes
        var year = simpleConsult.date.getFullYear();//Captura o Ano
        var day = simpleConsult.date.getDate()+1;//Captura o dia ( precisa somar pq retorna um dia inferior por estar como 00:00:00)

        var hour = Number.parseInt(simpleConsult.time.split(':')[0]);//converte o valor para int e retorna como array com a hora
        var minutes = Number.parseInt(simpleConsult.time.split(':')[1]);//converte o valor para int e retorna como array com o minuto

        var startDate = new Date(year, month, day, hour, minutes, 0, 0);
        //startDate.setHours(startDate.getHours() - 3)//Corrigir o timezone da hora.

        var appo = {//FullCalendar precisa da informações estruturadas dessa forma para mostrar e precisa também da data e hora juntos.
            id: simpleConsult._id,
            title: `${simpleConsult.name} - ${simpleConsult.description}`,
            start: startDate,
            end: startDate,
            notified: simpleConsult.notified,
            email: simpleConsult.email
        }

        return appo;
    }
}

module.exports = new AppointmentFactory()