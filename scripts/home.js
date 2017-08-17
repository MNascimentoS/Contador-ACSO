/*
    Author: Mateus Nascimento
    Email: mateus.nnascimento.s@gmail.com
*/

/*Firebase Values*/
var config = {
    apiKey: "AIzaSyBW27GDGcsKiadK5sFMHrW6uJLEC1RhpVI",
    authDomain: "contador-do-acso.firebaseapp.com",
    databaseURL: "https://contador-do-acso.firebaseio.com",
    projectId: "contador-do-acso",
    storageBucket: "contador-do-acso.appspot.com",
    messagingSenderId: "597706440559"
};

/*Principal Variables*/
var timers = [];
timers["main"] = {
    main: "",
    date: "",
    name:  "",
    picture:  "",
    timer_val: "",
    abbreviation: ""
};
timers["secondary"] = {
    main: "",
    date: "",
    name:  "",
    picture:  "",
    timer_val: "",
    abbreviation: ""
};
var currentdate, interval;
var storageRef;

function setup() {
    noCanvas();
    firebase.initializeApp(config);
    updateCurrentDate();
    firebase.database().ref().child('/competicoes').on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val().main   == true) {
                timers["main"].main         = childSnapshot.val().main;
                timers["main"].timer_val    = select('#timer_princ');
                timers["main"].name         = childSnapshot.val().name;
                timers["main"].abbreviation = childSnapshot.val().abbreviation;
                timers["main"].picture      = childSnapshot.val().picture;
                timers["main"].date         = new Date();;
                timers["main"].date.setDate(childSnapshot.val().day);
                timers["main"].date.setMonth(childSnapshot.val().month);
                timers["main"].date.setYear(childSnapshot.val().year);
                timers["main"].date.setSeconds(60);
                timers["main"].date.setMinutes(60);
                timers["main"].date.setHours(24);
            } else {
                timers["secondary"].main         = childSnapshot.val().main;
                timers["secondary"].timer_val    = select('#timer_secund');
                timers["secondary"].name         = childSnapshot.val().name;
                timers["secondary"].abbreviation = childSnapshot.val().abbreviation;
                timers["secondary"].picture      = childSnapshot.val().picture;
                timers["secondary"].date         = new Date();;
                timers["secondary"].date.setDate(childSnapshot.val().day);
                timers["secondary"].date.setMonth(childSnapshot.val().month);
                timers["secondary"].date.setYear(childSnapshot.val().year);
                timers["secondary"].date.setSeconds(60);
                timers["secondary"].date.setMinutes(60);
                timers["secondary"].date.setHours(24);
            }
        });
        retieveImage(timers["main"].picture, "banner1");
        retieveImage(timers["secondary"].picture, "banner2");
        interval = setInterval(timeIt, 1000);
    });
    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 15,
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
}

function retieveImage(imageUri, imageEl){
    storageRef = firebase.storage().ref();
    firebase.storage().ref().child(imageUri).getMetadata().then(function(metadata) {
        document.getElementById(imageEl).style.background = "url('" + metadata.downloadURLs[0] + "') no-repeat";
        document.getElementById(imageEl).style.display = "block";
        document.getElementById(imageEl).style.backgroundPosition = "right";
        document.getElementById(imageEl).style.backgroundSize = "cover";
      console.log("URL is "+metadata.downloadURLs[0]);
    }).catch(function(error){
      console.log("error downloading "+error);
    });
}

function updateCurrentDate() {
    currentdate = new Date();
    currentdate.setMonth(currentdate.getMonth()+1);
}

function timeIt() {
    var update1, update2;
    update1 = getDifferenceDate(timers["main"]);
    update2 = getDifferenceDate(timers["secondary"]);
    if (!update1 && !update2) {
        clearInterval(interval);
    }
    updateCurrentDate();
}

function getDifferenceDate(timer) {
    var day = Math.round((timer.date - currentdate) / (24*60*60*1000));
    if (day <= 0) {
        if (timer.main == true) document.getElementById('principal').style.display = 'none';
        else document.getElementById('secundario').style.display = 'none';
        return false;
    }
    var totalSeconds = Math.round((timer.date-currentdate)/1000);
    var hours   = convertHours(totalSeconds);
    var minutes = convertMinutes(totalSeconds);
    var seconds = convertSeconds(totalSeconds);
    if (timer.main == true) timer.timer_val.html(day + " dias" + "</br>" + nf(hours, 2) + ":" +  nf(minutes, 2) + ":" +  nf(seconds, 2));
    else                    timer.timer_val.html(day + " dias");
    return true;
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