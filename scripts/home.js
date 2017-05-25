/*
    Author: Mateus Nascimento
    Email: mateus.nnascimento.s@gmail.com
*/

var timer = {
    timer1: "",
    timer2: ""
};
var currentdate;
var interdate;
var finalDate = {
    setedPrinc: false,
    principal:  "",
    setedSecun: false,
    secundario: ""
};
var count;
var interval;
const principal  = 0;
const secundario = 1;

function setup() {
    noCanvas();
    count = 0;
    timer.timer1   = select('#time_val_1');
    timer.timer2   = select('#time_val_2');
    var setedParams = setupParams();
    setupCurrentDate();
    if (setedParams) interval = setInterval(timeIt, 1000);
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15,    // Creates a dropdown of 15 years to control year
        labelMonthNext: 'Próximo mês',
        labelMonthPrev: 'Mês Anterior',
        labelMonthSelect: 'Selecione um mês',
        labelYearSelect: 'Selecione um ano',
        monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
        monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
        weekdaysFull: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado' ],
        weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
        weekdaysLetter: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
        today: 'Hoje',
        clear: 'Limpar',
        close: 'Fechar'
    });
    document.getElementById('date').style.display = 'none';
    document.getElementById('file').style.display = 'none';
    document.getElementById('secundario').style.display = 'none';
    $('#imgFile').change(function(){
        var radio = getRadioValue('group2');
        if (radio.num == principal) {
            readURL(this, 'banner1');
        } else {
            readURL(this, 'banner2');
        }
    });
}

function setupParams() {
    var params = getURLParams();
    if ( params.day   &&
         params.month &&
         params.year     ) 
    {
        finalDate.principal = new Date();
        finalDate.principal.setDate(params.day-1);
        finalDate.principal.setMonth(params.month);
        finalDate.principal.setYear(params.year);
        finalDate.principal.setSeconds(60);
        finalDate.principal.setMinutes(60);
        finalDate.principal.setHours(24);
        return true;
    }
    return false;
}

function setupCurrentDate() {
    currentdate = new Date();
    currentdate.setMonth(currentdate.getMonth()+1);
    interdate   = new Date();
    interdate.setMonth(interdate.getMonth()+1);
    interdate.setSeconds(60);
    interdate.setMinutes(60);
    interdate.setHours(24);
}

function updateCurrentDate() {
    currentdate = new Date();
    currentdate.setMonth(currentdate.getMonth()+1);
}

function updateInterDate() {
    interdate = new Date();
    interdate.setMonth(interdate.getMonth()+1);
    interdate.setSeconds(60);
    interdate.setMinutes(60);
    interdate.setHours(24);
}

function timeIt() {
    if (finalDate.setedPrinc) getDifferenceDate(principal);
    if (finalDate.setedSecun) getDifferenceDate(secundario);
    updateCurrentDate();
}

function getDifferenceDate(troca) {
    var day;
    if (troca == principal) day = Math.round((finalDate.principal  - currentdate)/(24*60*60*1000)) - count;
    else                    day = Math.round((finalDate.secundario - currentdate)/(24*60*60*1000)) - count;
    //Interative
    var totalSeconds = Math.round((interdate-currentdate)/1000);
    var hours   = convertHours(totalSeconds);
    var minutes = convertMinutes(totalSeconds);
    var seconds = convertSeconds(totalSeconds);
    var stop;
    if (parseInt(day) === 0) {
        stop = true;
    }
    
    if (parseInt(hours)   <= 0 &&
        parseInt(minutes) <= 0 &&
        parseInt(seconds) <= 0    ) 
    {
        if (stop) {
            if (troca == principal) {
                finalDate.setedPrinc(false);
                timer.timer1.html(0 + " dias" + "</br>" + nf(0, 2) + ":" +  nf(0, 2) + ":" +  nf(0, 2));
            } else {
                finalDate.setedSecun(false);
                timer.timer2.html(0 + " dias");
            }
            stop = false;
        }
        count++;
        updateCurrentDate();
        updateInterDate();
    }
    
    if (troca == principal) timer.timer1.html(day + " dias" + "</br>" + nf(hours, 2) + ":" +  nf(minutes, 2) + ":" +  nf(seconds, 2));
    else                    timer.timer2.html(day + " dias");
}

function convertSeconds(seconds) {
    return floor((((seconds)%60)));
}

function convertMinutes(seconds) {
    return floor(((seconds)/60)%60);
}

function convertHours(seconds) {
    return floor((((seconds)/60)/60)%24);
}

function showCard(el) {
    var display = document.getElementById(el).style.display;
    if(display === "none") 
        document.getElementById(el).style.display = 'block';
    else
        document.getElementById(el).style.display = 'none';
}

function updateDate() {
    var radio = getRadioValue('group1');
    var date  = getDateValue();
    if (date == false) {
        Materialize.toast('Data Inválida!', 2000);
        return;
    }
    if (radio.num == principal) {
        finalDate.principal = date;
        finalDate.setedPrinc = true;
    } else {
        finalDate.secundario = date;
        finalDate.setedSecun = true;
    }
    interval = setInterval(timeIt, 1000);
    Materialize.toast('Data atualizada com sucesso!', 2000);
    showCard('date');
}

function getRadioValue(group) {
    var radios = document.getElementsByName(group);
    var radio = {
        checked:"radio",
        num:"0"
    };
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            radio.checked = radios[i];
            radio.num = i;
            break;
        }
    }
    return radio;
}

function getDateValue() {
    var date  = new Date();
    var day   = $('.datepicker').pickadate('picker').get('highlight', 'dd');
    var month = $('.datepicker').pickadate('picker').get('highlight', 'mm');
    var year  = $('.datepicker').pickadate('picker').get('highlight', 'yyyy');
    date.setDate(day - 1);
    date.setMonth(month);
    date.setYear(year);
    date.setSeconds(60);
    date.setMinutes(60);
    date.setHours(24);
    if (date > currentdate) return date;
    else return false;
}

function readURL(input, banner) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById(banner).style.background = "url(" + e.target.result + ") no-repeat right";
            document.getElementById(banner).style.backgroundSize = "cover";
        }
        reader.readAsDataURL(input.files[0]);
    }
}