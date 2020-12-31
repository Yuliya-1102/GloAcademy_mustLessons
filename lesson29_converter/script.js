'use strict';


const addConverter = () => {

    const inputData = document.querySelector('.input-data');
    const inputTotal = document.querySelector('.input-total');
    const inputBtn = document.querySelector('.input-btn');
    const inputBtnRub = document.querySelector('.input-btn-rub');
    const inputDataRub = document.querySelector('.input-data-rub');
    const inputResult = document.querySelector('.input-result');
    
    let dataUsd = 0;
    let dataEur = 0;

    const getData = (url, outputData) => {
        const request = new XMLHttpRequest(); //создаем запрос
        request.open('GET', url); //получаем данные по url, при GET-запросе заголовки не обязательны
        request.addEventListener('readystatechange', () => { //отлавливпем событтие
            if (request.readyState !== 4){
                return;
            }
            if (request.status === 200){
                const response = JSON.parse(request.responseText); //здесь храниться JSON файл, после того как мы request.open('GET', url)
                outputData(response);
            } else {
                console.error(request.statusText);
            }
        });
        request.send(); //вызываем метод для запроса, открывает соединение и отправляет запрос
    };
    
    const courseUsd = (data) => {
        dataUsd = data.rates.RUB;
    };
    const courseEur = (data) => {
        dataEur = data.rates.RUB;
    };
    
    const urlUsd = 'https://api.exchangeratesapi.io/latest?base=USD';
    const urlEur = 'https://api.exchangeratesapi.io/latest';
    getData(urlUsd, courseUsd); //передаем ссылку и ф-цию callback, обычно анонимную 
    getData(urlEur, courseEur); //передаем ссылку и ф-цию callback, обычно анонимную 

    //рассчет доллара и евро в руб.
    const converter = (event) => {
        event.preventDefault();
        const inputRadio = document.querySelectorAll('input.form-input-currency[type=radio]'); 
        [...inputRadio].forEach(elem => {
            if(elem.checked){
                if(elem.value === 'USD'){
                    inputTotal.value = (inputData.value * dataUsd).toFixed(2);
                } else{
                    inputTotal.value = (inputData.value * dataEur).toFixed(2);
                }
            }
        });
    };
    inputBtn.addEventListener('click', converter);

    //рассчет руб доллара и евро.
    const converterRub = (event) => {
        event.preventDefault();
        const inputRadio = document.querySelectorAll('input.input-currency[type=radio]'); 
        [...inputRadio].forEach(elem => {
            if(elem.checked){
                if(elem.value === 'USD'){
                    inputResult.value = (inputDataRub.value / dataUsd).toFixed(2);
                } else{
                    inputResult.value = (inputDataRub.value / dataEur).toFixed(2);
                }
            }
        });
    };
    inputBtnRub.addEventListener('click', converterRub);
};

addConverter();










