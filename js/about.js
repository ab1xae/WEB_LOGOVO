'use strict';

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
