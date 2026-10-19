'use strict';

const bookingForm = document.querySelector('#booking-form');
const serviceSelect = document.querySelector('#service-select');
const designSelect = document.querySelector('#hair-design');
const barberSelect = document.querySelector('#barber-select');
const dateInput = document.querySelector('#visit-date');
const timeSelect = document.querySelector('#visit-time');
const peopleInput = document.querySelector('#people-count');

const summaryService = document.querySelector('#summary-service');
const summaryBarber = document.querySelector('#summary-barber');
const summaryTime = document.querySelector('#summary-time');
const bookingTotal = document.querySelector('#booking-total');

const NOT_CHOSEN = 'not chosen yet';
const TUESDAY = 2;
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 5;

function getChosenOption(select) {
    if (select.value === '') {
        return null;
    }
    return select.options[select.selectedIndex];
}

function parseVisitDate(value) {
    if (value === '') {
        return null;
    }
    const parts = value.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function isStudentDay(date) {
    return date !== null && date.getDay() === TUESDAY;
}

function getServicePrice(serviceOption, level, date) {
    const tuesdayPrice = serviceOption.dataset['priceTuesday' + capitalize(level)];
    if (isStudentDay(date) && tuesdayPrice !== undefined) {
        return Number(tuesdayPrice);
    }
    const price = serviceOption.dataset['price' + capitalize(level)];
    if (price === undefined || price === '') {
        return null;
    }
    return Number(price);
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getDesignName(designOption) {
    return designOption.textContent.split(',')[0];
}

function describeService(serviceOption, designOption) {
    if (serviceOption === null) {
        return NOT_CHOSEN;
    }
    if (designOption.value === 'none') {
        return serviceOption.textContent;
    }
    return serviceOption.textContent + ' + ' + getDesignName(designOption) + ' design';
}

function describeBarber(barberOption) {
    if (barberOption === null) {
        return NOT_CHOSEN;
    }
    const level = barberOption.dataset.level;
    if (barberOption.value === 'any-' + level) {
        return barberOption.textContent;
    }
    return barberOption.textContent + ' (' + level + ' barber)';
}

function describeTime(date, time) {
    if (date === null && time === '') {
        return NOT_CHOSEN;
    }
    const dayText = date === null
        ? 'date not chosen'
        : date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeText = time === '' ? 'time not chosen' : time;
    return dayText + ', ' + timeText;
}

function describeTotal(serviceOption, designOption, barberOption, date, peopleValue) {
    if (serviceOption === null || barberOption === null) {
        return { text: 'choose a service and a barber', isError: false };
    }

    const people = Number(peopleValue);
    if (!Number.isInteger(people) || people < MIN_PEOPLE || people > MAX_PEOPLE) {
        return { text: 'the number of people must be from 1 to 5', isError: true };
    }

    const level = barberOption.dataset.level;
    const servicePrice = getServicePrice(serviceOption, level, date);
    if (servicePrice === null) {
        return {
            text: capitalize(level) + ' barbers do not do this service, please choose a top or senior barber',
            isError: true
        };
    }

    const onePerson = servicePrice + Number(designOption.dataset.price);
    const total = onePerson * people;

    let text = total + ' tg';
    if (people > 1) {
        text = onePerson + ' tg × ' + people + ' people = ' + text;
    }
    if (isStudentDay(date) && serviceOption.dataset.priceTuesdayLead !== undefined) {
        text += ' (Student Day price)';
    }
    return { text: text, isError: false };
}

function updateSummary() {
    const serviceOption = getChosenOption(serviceSelect);
    const designOption = designSelect.options[designSelect.selectedIndex];
    const barberOption = getChosenOption(barberSelect);
    const date = parseVisitDate(dateInput.value);

    summaryService.textContent = describeService(serviceOption, designOption);
    summaryBarber.textContent = describeBarber(barberOption);
    summaryTime.textContent = describeTime(date, timeSelect.value);

    const total = describeTotal(serviceOption, designOption, barberOption, date, peopleInput.value);
    bookingTotal.textContent = total.text;
    bookingTotal.classList.toggle('is-error', total.isError);
}

function selectFromAddress(select, paramName) {
    const value = new URLSearchParams(window.location.search).get(paramName);
    if (value === null) {
        return;
    }
    const exists = Array.from(select.options).some(function (option) {
        return option.value === value && value !== '';
    });
    if (exists) {
        select.value = value;
    }
}

selectFromAddress(serviceSelect, 'service');
selectFromAddress(designSelect, 'design');
selectFromAddress(barberSelect, 'barber');
updateSummary();

bookingForm.addEventListener('change', updateSummary);
bookingForm.addEventListener('input', updateSummary);
bookingForm.addEventListener('reset', function () {
    setTimeout(updateSummary, 0);
});
