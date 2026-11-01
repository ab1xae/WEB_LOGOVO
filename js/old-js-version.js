'use strict';

// NOT LINKED TO ANY PAGE.
// The plain-JavaScript versions from Assignments 4-5, kept only to compare them with the
// jQuery rewrite (Assignment 6). Each block below is the old code exactly as it was.
//   0. Field error helpers that were in js/main.js -> now js/forms.js
//   1. Booking form           -> now js/booking.js
//   2. Reviews on about.html  -> now js/about.js
//   3. Price list search      -> now js/services.js

// ====================================================================
// 0. Field error helpers (were in js/main.js, used by both forms)
// ====================================================================

function showFieldError(field, message) {
    let feedback = document.getElementById(field.id + '-error');
    if (feedback === null) {
        feedback = createElement('span', ['invalid-feedback']);
        feedback.id = field.id + '-error';
        field.parentElement.append(feedback);
        field.setAttribute('aria-describedby', feedback.id);
    }
    feedback.textContent = message;
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldState(field) {
    field.classList.remove('is-invalid', 'is-valid');
    field.removeAttribute('aria-invalid');
}

function checkField(field, message, errors) {
    if (message === '') {
        clearFieldState(field);
        if (field.type !== 'checkbox') {
            field.classList.add('is-valid');
        }
    } else {
        showFieldError(field, message);
        errors.push({ field: field, message: message });
    }
    return message === '';
}

function showErrorList(box, errors) {
    box.replaceChildren();
    if (errors.length === 0) {
        box.classList.add('is-hidden');
        return;
    }
    const word = errors.length === 1 ? 'field' : 'fields';
    box.append(createElement('p', ['fw-bold', 'mb-2'], 'Please fix ' + errors.length + ' ' + word + ':'));
    const list = createElement('ul', ['mb-0']);
    errors.forEach(function (error) {
        list.append(createElement('li', [], error.message));
    });
    box.append(list);
    box.classList.remove('is-hidden');
}

// ====================================================================
// 1. Booking form (js/booking.js)
// ====================================================================

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

// ====================================================================
// 2. Reviews and review form (js/about.js)
// ====================================================================

const reviewForm = document.querySelector('#review-form');
const reviewErrors = document.querySelector('#review-errors');
const reviewResult = document.querySelector('#review-result');
const reviewName = document.querySelector('#review-name');
const reviewEmail = document.querySelector('#review-email');
const reviewPhone = document.querySelector('#review-phone');
const reviewDate = document.querySelector('#review-date');
const reviewVisits = document.querySelector('#review-visits');
const reviewBarber = document.querySelector('#review-barber');
const reviewText = document.querySelector('#review-text');

const MIN_REVIEW = 20;
const MAX_REVIEW = 500;
const LOW_RATING_MIN = 50;
const OPENING_DATE = new Date(2024, 0, 1);

const RATING_WORDS = { 5: 'excellent', 4: 'good', 3: 'normal', 2: 'bad' };
const LEVEL_WORDS = { lead: 'Lead barber', top: 'Top barber', senior: 'Senior barber', unknown: 'Barber level not given' };

const reviews = [
    { name: 'Rustem', rating: 5, level: 'senior', text: 'We came to LOGOVO for our university project. Senior barber Akhmadzhon answered all our questions and showed us his workplace.', date: new Date(2026, 8, 13, 13, 20) },
    { name: 'Abylay', rating: 5, level: 'top', text: 'The price stand with three barber levels is easy to understand, and the waiting area with a sofa and a game console is really comfortable.', date: new Date(2026, 8, 13, 13, 45) },
    { name: 'Alfarabi', rating: 4, level: 'unknown', text: 'Friendly team and a calm atmosphere. Many clients were waiting, so it is better to book a time before you come.', date: new Date(2026, 8, 13, 14, 5) }
];

const ratingFilter = createElement('select', ['form-select']);
ratingFilter.id = 'review-filter';
[['all', 'All ratings'], ['5', '5 - excellent'], ['4', '4 - good'], ['3', '3 - normal'], ['2', '2 or less - bad']].forEach(function (option) {
    const item = createElement('option', [], option[1]);
    item.value = option[0];
    ratingFilter.append(item);
});

const filterLabel = createElement('label', ['form-label'], 'Show reviews with rating');
filterLabel.htmlFor = ratingFilter.id;
const filterWrapper = createElement('p', ['col-12', 'col-sm-6', 'col-lg-4', 'mb-0']);
filterWrapper.append(filterLabel, ratingFilter);

const showAllButton = createButton('Show all reviews', ['btn-outline-secondary']);
const buttonWrapper = createElement('p', ['col-12', 'col-sm-6', 'col-lg-4', 'mb-0']);
buttonWrapper.append(showAllButton);

const reviewControls = createElement('div', ['row', 'g-3', 'align-items-end', 'mb-3']);
reviewControls.append(filterWrapper, buttonWrapper);

const reviewCount = createElement('p', ['fw-semibold', 'mb-3']);
reviewCount.setAttribute('role', 'status');
reviewCount.setAttribute('aria-live', 'polite');

const reviewList = createElement('ul', ['row', 'g-3', 'list-unstyled', 'mb-4']);
reviewList.id = 'review-list';

const counter = createElement('span', ['form-text', 'd-block', 'rounded', 'px-2']);
counter.id = 'review-text-counter';
reviewText.parentElement.append(counter);
reviewText.setAttribute('aria-describedby', 'review-text-error review-text-counter');

document.querySelector('#feedback > p').after(
    createElement('h3', ['h5'], 'What Visitors Say'),
    reviewControls,
    reviewCount,
    reviewList
);

function formatDateTime(date) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) +
        ', ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function makeStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getAverageRating(list) {
    if (list.length === 0) {
        return 0;
    }
    const sum = list.reduce(function (total, review) {
        return total + review.rating;
    }, 0);
    return Math.round(sum / list.length * 10) / 10;
}

function filterReviews(list, rating) {
    if (rating === 'all') {
        return list;
    }
    return list.filter(function (review) {
        return rating === '2' ? review.rating <= 2 : review.rating === Number(rating);
    });
}

function createReviewCard(review) {
    const item = createElement('li', ['col-12', 'col-md-6', 'col-lg-4']);
    const card = createElement('article', ['card', 'h-100', 'shadow-sm', 'border-top', 'border-4', 'border-warning']);
    const body = createElement('div', ['card-body']);
    const stars = createElement('p', ['mb-1'], makeStars(review.rating) + ' ' + review.rating + ' of 5, ' + RATING_WORDS[review.rating]);
    body.append(
        createElement('h4', ['card-title', 'h6', 'mb-1'], review.name),
        stars,
        createElement('p', ['small', 'text-body-secondary', 'mb-2'], LEVEL_WORDS[review.level] + ' · ' + formatDateTime(review.date)),
        createElement('p', ['card-text', 'mb-0'], review.text)
    );
    card.append(body);
    item.append(card);
    return item;
}

function createEmptyReviews() {
    const item = createElement('li', ['col-12']);
    const box = createElement('p', ['bg-white', 'border', 'rounded', 'p-3', 'mb-0'], 'No reviews with this rating yet. ');
    const button = createButton('Show all reviews', ['btn-link', 'p-0', 'align-baseline']);
    button.addEventListener('click', showAllReviews);
    box.append(button);
    item.append(box);
    return item;
}

function renderReviews() {
    const shown = filterReviews(reviews, ratingFilter.value);
    reviewList.replaceChildren();
    if (shown.length === 0) {
        reviewList.append(createEmptyReviews());
    }
    shown.forEach(function (review) {
        reviewList.append(createReviewCard(review));
    });
    reviewCount.textContent = 'Showing ' + shown.length + ' of ' + reviews.length + ' reviews, average rating ' +
        getAverageRating(reviews) + ' of 5';
}

function showAllReviews() {
    ratingFilter.value = 'all';
    renderReviews();
}

function updateCounter() {
    const length = reviewText.value.trim().length;
    if (length > MAX_REVIEW) {
        counter.textContent = length + ' / ' + MAX_REVIEW + ' characters, ' + (length - MAX_REVIEW) + ' too many';
    } else if (length < MIN_REVIEW) {
        counter.textContent = length + ' / ' + MAX_REVIEW + ' characters, at least ' + MIN_REVIEW + ' needed';
    } else {
        counter.textContent = length + ' / ' + MAX_REVIEW + ' characters';
    }
    counter.classList.toggle('is-error', length > MAX_REVIEW);
    counter.classList.toggle('is-success', length >= MIN_REVIEW && length <= MAX_REVIEW);
}

function getChosenRating() {
    return Number(reviewForm.querySelector('input[name="rating"]:checked').value);
}

function getVisitDateError(value) {
    if (value === '') {
        return 'Please choose the day of your visit.';
    }
    const date = new Date(value + 'T00:00');
    if (date > new Date()) {
        return 'The day of your visit cannot be in the future.';
    }
    if (date < OPENING_DATE) {
        return 'LOGOVO opened in 2024, please choose a later day.';
    }
    return '';
}

function getReviewTextError(text, rating) {
    if (text === '') {
        return 'Please write a few words about your visit.';
    }
    if (text.length < MIN_REVIEW || text.length > MAX_REVIEW) {
        return 'The review must have from ' + MIN_REVIEW + ' to ' + MAX_REVIEW + ' characters.';
    }
    if (rating <= 3 && text.length < LOW_RATING_MIN) {
        return 'With a rating of 3 or less, please tell us what went wrong in at least ' + LOW_RATING_MIN + ' characters.';
    }
    return '';
}

function validateReview() {
    const errors = [];
    const visits = Number(reviewVisits.value);
    const phone = reviewPhone.value.trim();

    checkField(reviewName, getNameError(reviewName.value.trim()), errors);
    checkField(reviewEmail, isValidEmail(reviewEmail.value) ? '' : 'Please write an email like name@mail.com.', errors);
    checkField(reviewPhone, phone !== '' && !isValidPhone(phone) ? 'Please write a phone number like +7 700 000 0000 or leave it empty.' : '', errors);
    checkField(reviewDate, getVisitDateError(reviewDate.value), errors);
    checkField(reviewVisits, Number.isInteger(visits) && visits >= 1 && visits <= 100 ? '' : 'From 1 to 100 visits.', errors);
    checkField(reviewText, getReviewTextError(reviewText.value.trim(), getChosenRating()), errors);
    return errors;
}

let reviewWasSubmitted = false;

reviewForm.noValidate = true;
reviewDate.max = toInputDate(new Date());
reviewResult.tabIndex = -1;

reviewForm.addEventListener('input', function () {
    updateCounter();
    reviewResult.classList.add('is-hidden');
    if (reviewWasSubmitted) {
        showErrorList(reviewErrors, validateReview());
    }
});

reviewForm.addEventListener('submit', function (event) {
    event.preventDefault();
    reviewWasSubmitted = true;
    const errors = validateReview();
    showErrorList(reviewErrors, errors);
    if (errors.length > 0) {
        reviewResult.classList.add('is-hidden');
        errors[0].field.focus();
        return;
    }

    const review = {
        name: reviewName.value.trim(),
        rating: getChosenRating(),
        level: reviewBarber.value,
        text: reviewText.value.trim(),
        date: new Date()
    };
    const visitDay = new Date(reviewDate.value + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const visitText = 'visit on ' + visitDay + ', ' + reviewVisits.value + ' visit(s) in total';

    reviews.unshift(review);
    reviewForm.reset();
    showAllReviews();
    reviewList.firstElementChild.firstElementChild.classList.add('is-selected');

    reviewResult.replaceChildren(
        createElement('p', ['fw-bold', 'fs-5', 'mb-2'], 'Thank you, ' + review.name + '!'),
        createElement('p', ['mb-2'], 'Your review is now first in the list above: ' + review.rating + ' of 5, ' +
            LEVEL_WORDS[review.level].toLowerCase() + ', ' + visitText + '.'),
        createElement('p', ['mb-0'], 'This is a front-end demonstration: nothing was sent to a server or to LOGOVO, and the review disappears when you reload the page.')
    );
    reviewResult.classList.remove('is-hidden');
    reviewResult.focus();
});

reviewForm.addEventListener('reset', function () {
    reviewWasSubmitted = false;
    showErrorList(reviewErrors, []);
    reviewResult.classList.add('is-hidden');
    reviewForm.querySelectorAll('.is-invalid, .is-valid').forEach(clearFieldState);
    setTimeout(updateCounter, 0);
});

ratingFilter.addEventListener('change', renderReviews);
showAllButton.addEventListener('click', showAllReviews);

updateCounter();
renderReviews();

// ====================================================================
// 3. Price list search, filter and sort (js/services.js)
// ====================================================================

const priceTableBox = document.querySelector('#price-table .table-responsive');
const priceBody = document.querySelector('#price-table tbody');

const CATEGORY_OPTIONS = [
    ['all', 'All services'],
    ['haircut', 'Haircuts'],
    ['beard', 'Beard'],
    ['other', 'Tinting, facial, perm'],
    ['design', 'Hair designs']
];

const SORT_OPTIONS = [
    ['default', 'As on the price stand'],
    ['cheap', 'Price: low to high'],
    ['expensive', 'Price: high to low']
];

function createSelect(id, options) {
    const select = createElement('select', ['form-select']);
    select.id = id;
    options.forEach(function (option) {
        const item = createElement('option', [], option[1]);
        item.value = option[0];
        select.append(item);
    });
    return select;
}

function wrapWithLabel(control, labelText, classes) {
    const wrapper = createElement('p', classes.concat(['mb-0']));
    const label = createElement('label', ['form-label'], labelText);
    label.htmlFor = control.id;
    wrapper.append(label, control);
    return wrapper;
}

const searchInput = createElement('input', ['form-control']);
searchInput.type = 'search';
searchInput.id = 'service-search';
searchInput.placeholder = 'for example beard';

const categorySelect = createSelect('service-category', CATEGORY_OPTIONS);
const sortSelect = createSelect('service-sort', SORT_OPTIONS);
const resetButton = createButton('Reset', ['btn-outline-secondary', 'w-100']);
resetButton.id = 'service-reset';

const controls = createElement('div', ['row', 'g-3', 'align-items-end', 'mb-3']);
const resetWrapper = createElement('p', ['col-12', 'col-md-2', 'mb-0']);
resetWrapper.append(resetButton);
controls.append(
    wrapWithLabel(searchInput, 'Search a service', ['col-12', 'col-md-4']),
    wrapWithLabel(categorySelect, 'Category', ['col-6', 'col-md-3']),
    wrapWithLabel(sortSelect, 'Sort', ['col-6', 'col-md-3']),
    resetWrapper
);

const resultCount = createElement('p', ['fw-semibold', 'mb-2']);
resultCount.setAttribute('role', 'status');
resultCount.setAttribute('aria-live', 'polite');

priceTableBox.before(controls, resultCount);

function filterServices(list, query, category) {
    const text = query.trim().toLowerCase();
    return list.filter(function (service) {
        const matchesText = text === '' || service.name.toLowerCase().includes(text);
        const matchesCategory = category === 'all' || service.category === category;
        return matchesText && matchesCategory;
    });
}

function sortServices(list, order) {
    const sorted = list.slice();
    if (order === 'cheap') {
        sorted.sort(function (a, b) {
            return getLowestPrice(a) - getLowestPrice(b);
        });
    } else if (order === 'expensive') {
        sorted.sort(function (a, b) {
            return getLowestPrice(b) - getLowestPrice(a);
        });
    }
    return sorted;
}

function createPriceCell(service, level) {
    const price = getPrice(service, level);
    const cell = createElement('td', ['text-end'], formatPrice(price, service.isAddOn));
    if (price === null) {
        cell.append(createElement('span', ['visually-hidden'], ' not done by a ' + level + ' barber'));
    }
    return cell;
}

function createServiceRow(service) {
    const row = createElement('tr');
    row.id = 'price-' + service.id;

    const nameCell = createElement('th', [], service.name);
    nameCell.scope = 'row';

    const bookCell = createElement('td', ['text-center']);
    const bookLink = createElement('a', ['btn', 'btn-warning', 'btn-sm'], 'Book');
    bookLink.id = 'book-' + service.id;
    bookLink.href = 'booking.html?' + service.link + '#booking';
    bookLink.append(createElement('span', ['visually-hidden'], ': ' + service.name));
    bookCell.append(bookLink);

    row.append(nameCell);
    LEVELS.forEach(function (level) {
        row.append(createPriceCell(service, level));
    });
    row.append(bookCell);

    if (service.id === 'student-day' && new Date().getDay() === 2) {
        row.classList.add('is-active');
    }
    return row;
}

function createEmptyRow(query) {
    const row = createElement('tr');
    const cell = createElement('td', ['text-center', 'py-4']);
    cell.colSpan = 5;
    const message = query.trim() === ''
        ? 'There are no services in this category.'
        : 'No services match "' + query.trim() + '".';
    const showAll = createButton('Show all services', ['btn-outline-secondary', 'btn-sm', 'ms-2']);
    showAll.addEventListener('click', resetServices);
    cell.append(message, showAll);
    row.append(cell);
    return row;
}

function renderServices() {
    const found = filterServices(services, searchInput.value, categorySelect.value);
    const shown = sortServices(found, sortSelect.value);

    priceBody.replaceChildren();
    if (shown.length === 0) {
        priceBody.append(createEmptyRow(searchInput.value));
    }
    shown.forEach(function (service) {
        priceBody.append(createServiceRow(service));
    });

    resultCount.textContent = 'Showing ' + shown.length + ' of ' + services.length + ' services';
}

function resetServices() {
    searchInput.value = '';
    categorySelect.value = 'all';
    sortSelect.value = 'default';
    renderServices();
    searchInput.focus();
}

searchInput.addEventListener('input', renderServices);
categorySelect.addEventListener('change', renderServices);
sortSelect.addEventListener('change', renderServices);
resetButton.addEventListener('click', resetServices);

renderServices();

