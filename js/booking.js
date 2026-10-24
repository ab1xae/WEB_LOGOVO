'use strict';

const bookingForm = document.querySelector('#booking-form');
const serviceSelect = document.querySelector('#service-select');
const designSelect = document.querySelector('#hair-design');
const barberSelect = document.querySelector('#barber-select');
const dateInput = document.querySelector('#visit-date');
const timeSelect = document.querySelector('#visit-time');
const peopleInput = document.querySelector('#people-count');
const nameInput = document.querySelector('#client-name');
const phoneInput = document.querySelector('#client-phone');
const emailInput = document.querySelector('#client-email');
const commentInput = document.querySelector('#comment');
const giftCheck = document.querySelector('#agree-gift');
const smsCheck = document.querySelector('#agree-sms');
const bookingErrors = document.querySelector('#booking-errors');
const bookingResult = document.querySelector('#booking-result');

const summaryService = document.querySelector('#summary-service');
const summaryBarber = document.querySelector('#summary-barber');
const summaryTime = document.querySelector('#summary-time');
const bookingTotal = document.querySelector('#booking-total');

const NOT_CHOSEN = 'not chosen yet';
const TUESDAY = 2;
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 5;
const MAX_DAYS_AHEAD = 30;
const MAX_COMMENT = 300;
const DAY_MS = 24 * 60 * 60 * 1000;
const HAIRCUT_SERVICES = ['kids-haircut', 'haircut', 'long-haircut', 'haircut-beard', 'perm'];

let wasSubmitted = false;

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

function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getDesignError(serviceOption, design) {
    if (design !== 'none' && serviceOption !== null && !HAIRCUT_SERVICES.includes(serviceOption.value)) {
        return 'A hair design is added only to a haircut, please choose a haircut service or "No design".';
    }
    return '';
}

function getGiftError(serviceOption, level) {
    if (!giftCheck.checked) {
        return '';
    }
    if (level === 'lead') {
        return 'The free bonus comes only with a top or senior barber.';
    }
    if (serviceOption !== null && !HAIRCUT_SERVICES.includes(serviceOption.value)) {
        return 'The free bonus comes only with a haircut.';
    }
    return '';
}

function getBarberError(serviceOption, barberOption) {
    if (barberOption === null) {
        return 'Please choose a barber or a level.';
    }
    const level = barberOption.dataset.level;
    if (serviceOption !== null && getServicePrice(serviceOption, level, null) === null) {
        return capitalize(level) + ' barbers do not do this service, please choose a top or senior barber.';
    }
    return '';
}

function getDateError(date) {
    if (date === null) {
        return 'Please choose the day of your visit.';
    }
    const daysFromToday = Math.round((date - getToday()) / DAY_MS);
    if (daysFromToday < 0) {
        return 'This day has already passed, please choose a day from today on.';
    }
    if (daysFromToday > MAX_DAYS_AHEAD) {
        return 'The form takes days up to 30 days ahead, for a later day please call us.';
    }
    return '';
}

function getTimeError(date, time) {
    if (time === '') {
        return 'Please choose a time.';
    }
    const isToday = date !== null && date.getTime() === getToday().getTime();
    if (isToday && Number(time.slice(0, 2)) <= new Date().getHours()) {
        return 'This time today has already passed, please choose a later time or another day.';
    }
    return '';
}

function validateBooking() {
    const errors = [];
    const serviceOption = getChosenOption(serviceSelect);
    const barberOption = getChosenOption(barberSelect);
    const level = barberOption === null ? '' : barberOption.dataset.level;
    const date = parseVisitDate(dateInput.value);
    const people = Number(peopleInput.value);

    checkField(nameInput, getNameError(nameInput.value.trim()), errors);
    checkField(phoneInput, isValidPhone(phoneInput.value) ? '' : 'Please write a phone number like +7 700 000 0000.', errors);
    checkField(emailInput, isValidEmail(emailInput.value) ? '' : 'Please write an email like name@mail.com.', errors);
    checkField(commentInput, commentInput.value.length <= MAX_COMMENT ? '' : 'The comment can have up to 300 characters.', errors);
    checkField(giftCheck, getGiftError(serviceOption, level), errors);
    checkField(serviceSelect, serviceOption === null ? 'Please choose a service.' : '', errors);
    checkField(designSelect, getDesignError(serviceOption, designSelect.value), errors);
    checkField(barberSelect, getBarberError(serviceOption, barberOption), errors);
    checkField(dateInput, getDateError(date), errors);
    checkField(timeSelect, getTimeError(date, timeSelect.value), errors);
    checkField(peopleInput, Number.isInteger(people) && people >= MIN_PEOPLE && people <= MAX_PEOPLE ? '' : 'From 1 to 5 people.', errors);
    return errors;
}

function addResultLine(list, label, value) {
    const item = createElement('li', [], value);
    item.prepend(createElement('strong', [], label + ': '));
    list.append(item);
}

function showBookingResult() {
    const serviceOption = getChosenOption(serviceSelect);
    const designOption = designSelect.options[designSelect.selectedIndex];
    const barberOption = getChosenOption(barberSelect);
    const date = parseVisitDate(dateInput.value);
    const comment = commentInput.value.trim();

    const list = createElement('ul', ['list-unstyled', 'mb-2']);
    addResultLine(list, 'Name', nameInput.value.trim());
    addResultLine(list, 'Phone', phoneInput.value.trim());
    addResultLine(list, 'Email', emailInput.value.trim());
    addResultLine(list, 'Service', describeService(serviceOption, designOption));
    addResultLine(list, 'Barber', describeBarber(barberOption));
    addResultLine(list, 'Date and time', describeTime(date, timeSelect.value));
    addResultLine(list, 'People', peopleInput.value);
    addResultLine(list, 'Total to pay at the barbershop', describeTotal(serviceOption, designOption, barberOption, date, peopleInput.value).text);
    addResultLine(list, 'Free bonus', giftCheck.checked ? 'yes' : 'no');
    addResultLine(list, 'SMS reminder', smsCheck.checked ? 'yes' : 'no');
    if (comment !== '') {
        addResultLine(list, 'Comment', comment);
    }

    bookingResult.replaceChildren(
        createElement('p', ['fw-bold', 'fs-5', 'mb-2'], 'Demo request ' + makeReference('LG') + ' is ready'),
        list,
        createElement('p', ['mb-0'], 'This is a front-end demonstration: no data was sent to a server and no real booking was made. To book for real, call LOGOVO at ' + LOGOVO_PHONE + '.')
    );
    bookingResult.classList.remove('is-hidden');
}

function handleFormChange() {
    updateSummary();
    bookingResult.classList.add('is-hidden');
    if (wasSubmitted) {
        showErrorList(bookingErrors, validateBooking());
    }
}

dateInput.min = toInputDate(getToday());
dateInput.max = toInputDate(new Date(getToday().getTime() + MAX_DAYS_AHEAD * DAY_MS));
bookingForm.noValidate = true;
bookingResult.tabIndex = -1;

selectFromAddress(serviceSelect, 'service');
selectFromAddress(designSelect, 'design');
selectFromAddress(barberSelect, 'barber');
updateSummary();

bookingForm.addEventListener('change', handleFormChange);
bookingForm.addEventListener('input', handleFormChange);

bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    wasSubmitted = true;
    const errors = validateBooking();
    showErrorList(bookingErrors, errors);
    if (errors.length > 0) {
        bookingResult.classList.add('is-hidden');
        errors[0].field.focus();
        return;
    }
    showBookingResult();
    bookingResult.focus();
});

bookingForm.addEventListener('reset', function () {
    wasSubmitted = false;
    showErrorList(bookingErrors, []);
    bookingResult.classList.add('is-hidden');
    bookingForm.querySelectorAll('.is-invalid, .is-valid').forEach(clearFieldState);
    setTimeout(updateSummary, 0);
});
