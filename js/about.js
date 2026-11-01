'use strict';

// jQuery rewrite (old: old-js-version.js): $('<p>', {...}) and .appendTo() replaced createElement + append,
// one delegated .on() replaced a handler per button. About the same length (231 lines, was 223, with the new button).

$(function () {
    const $reviewForm = $('#review-form');
    const $reviewErrors = $('#review-errors');
    const $reviewResult = $('#review-result');
    const $reviewName = $('#review-name');
    const $reviewEmail = $('#review-email');
    const $reviewPhone = $('#review-phone');
    const $reviewDate = $('#review-date');
    const $reviewVisits = $('#review-visits');
    const $reviewBarber = $('#review-barber');
    const $reviewText = $('#review-text');

    const MIN_REVIEW = 20;
    const MAX_REVIEW = 500;
    const LOW_RATING_MIN = 50;
    const OPENING_DATE = new Date(2024, 0, 1);

    const RATING_WORDS = { 5: 'excellent', 4: 'good', 3: 'normal', 2: 'bad' };
    const LEVEL_WORDS = { lead: 'Lead barber', top: 'Top barber', senior: 'Senior barber', unknown: 'Barber level not given' };
    const FILTER_OPTIONS = [['all', 'All ratings'], ['5', '5 - excellent'], ['4', '4 - good'], ['3', '3 - normal'], ['2', '2 or less - bad']];

    const reviews = [
        { name: 'Rustem', rating: 5, level: 'senior', text: 'We came to LOGOVO for our university project. Senior barber Akhmadzhon answered all our questions and showed us his workplace.', date: new Date(2026, 8, 13, 13, 20) },
        { name: 'Abylay', rating: 5, level: 'top', text: 'The price stand with three barber levels is easy to understand, and the waiting area with a sofa and a game console is really comfortable.', date: new Date(2026, 8, 13, 13, 45) },
        { name: 'Alfarabi', rating: 4, level: 'unknown', text: 'Friendly team and a calm atmosphere. Many clients were waiting, so it is better to book a time before you come.', date: new Date(2026, 8, 13, 14, 5) }
    ];

    const $ratingFilter = $('<select>', { id: 'review-filter', 'class': 'form-select' });
    $.each(FILTER_OPTIONS, function (index, option) {
        $('<option>', { value: option[0], text: option[1] }).appendTo($ratingFilter);
    });

    const $showAllButton = $('<button>', { type: 'button', 'class': 'btn btn-outline-secondary', text: 'Show all reviews' });

    const $reviewControls = $('<div>', { 'class': 'row g-3 align-items-end mb-3' }).append(
        $('<p>', { 'class': 'col-12 col-sm-6 col-lg-4 mb-0' }).append(
            $('<label>', { 'class': 'form-label', 'for': 'review-filter', text: 'Show reviews with rating' }),
            $ratingFilter
        ),
        $('<p>', { 'class': 'col-12 col-sm-6 col-lg-4 mb-0' }).append($showAllButton)
    );

    const $reviewCount = $('<p>', { 'class': 'fw-semibold mb-3', role: 'status', 'aria-live': 'polite' });
    const $reviewList = $('<ul>', { id: 'review-list', 'class': 'row g-3 list-unstyled mb-4' });

    const $counter = $('<span>', { id: 'review-text-counter', 'class': 'form-text d-block rounded px-2' })
        .appendTo($reviewText.parent());
    $reviewText.attr('aria-describedby', 'review-text-error review-text-counter');

    $('#feedback > p:first').after(
        $('<h3>', { 'class': 'h5', text: 'What Visitors Say' }),
        $reviewControls,
        $reviewCount,
        $reviewList
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

    function getFilterValue(rating) {
        return rating <= 2 ? '2' : String(rating);
    }

    function filterReviews(list, rating) {
        if (rating === 'all') {
            return list;
        }
        return list.filter(function (review) {
            return getFilterValue(review.rating) === rating;
        });
    }

    function createReviewCard(review, withButton) {
        const $body = $('<div>', { 'class': 'card-body' }).append(
            $('<h4>', { 'class': 'card-title h6 mb-1', text: review.name }),
            $('<p>', { 'class': 'mb-1', text: makeStars(review.rating) + ' ' + review.rating + ' of 5, ' + RATING_WORDS[review.rating] }),
            $('<p>', { 'class': 'small text-body-secondary mb-2', text: LEVEL_WORDS[review.level] + ' · ' + formatDateTime(review.date) }),
            $('<p>', { 'class': 'card-text mb-0', text: review.text })
        );
        if (withButton) {
            const filterText = review.rating <= 2 ? 'reviews rated 2 or less' : review.rating + '-star reviews';
            $('<button>', { type: 'button', 'class': 'btn btn-link btn-sm p-0 mt-2', text: 'Show only ' + filterText })
                .appendTo($body);
        }
        return $('<li>', { 'class': 'col-12 col-md-6 col-lg-4' })
            .attr('data-rating', getFilterValue(review.rating))
            .append($('<article>', { 'class': 'card h-100 shadow-sm border-top border-4 border-warning' }).append($body));
    }

    function createEmptyReviews() {
        const $box = $('<p>', { 'class': 'bg-white border rounded p-3 mb-0', text: 'No reviews with this rating yet. ' })
            .append($('<button>', { type: 'button', 'class': 'btn btn-link p-0 align-baseline', text: 'Show all reviews' }));
        return $('<li>', { 'class': 'col-12' }).attr('data-rating', 'all').append($box);
    }

    function renderReviews() {
        const rating = $ratingFilter.val();
        const shown = filterReviews(reviews, rating);
        $reviewList.empty();
        if (shown.length === 0) {
            $reviewList.append(createEmptyReviews());
        }
        $.each(shown, function (index, review) {
            createReviewCard(review, rating === 'all').appendTo($reviewList);
        });
        $reviewCount.text('Showing ' + shown.length + ' of ' + reviews.length + ' reviews, average rating ' +
            getAverageRating(reviews) + ' of 5');
    }

    function showAllReviews() {
        $ratingFilter.val('all');
        renderReviews();
    }

    function updateCounter() {
        const length = $reviewText.val().trim().length;
        if (length > MAX_REVIEW) {
            $counter.text(length + ' / ' + MAX_REVIEW + ' characters, ' + (length - MAX_REVIEW) + ' too many');
        } else if (length < MIN_REVIEW) {
            $counter.text(length + ' / ' + MAX_REVIEW + ' characters, at least ' + MIN_REVIEW + ' needed');
        } else {
            $counter.text(length + ' / ' + MAX_REVIEW + ' characters');
        }
        $counter.toggleClass('is-error', length > MAX_REVIEW)
            .toggleClass('is-success', length >= MIN_REVIEW && length <= MAX_REVIEW);
    }

    function getChosenRating() {
        return Number($reviewForm.find('input[name="rating"]:checked').val());
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
        const name = $reviewName.val().trim();
        const email = $reviewEmail.val().trim();
        const phone = $reviewPhone.val().trim();
        const visits = Number($reviewVisits.val());

        checkField($reviewName, getNameError(name), errors);
        checkField($reviewEmail, isValidEmail(email) ? '' : 'Please write an email like name@mail.com.', errors);
        checkField($reviewPhone, phone !== '' && !isValidPhone(phone) ? 'Please write a phone number like +7 700 000 0000 or leave it empty.' : '', errors);
        checkField($reviewDate, getVisitDateError($reviewDate.val()), errors);
        checkField($reviewVisits, Number.isInteger(visits) && visits >= 1 && visits <= 100 ? '' : 'From 1 to 100 visits.', errors);
        checkField($reviewText, getReviewTextError($reviewText.val().trim(), getChosenRating()), errors);
        return errors;
    }

    let reviewWasSubmitted = false;

    // required stays in the HTML: without this file the browser still checks the form
    $reviewForm.prop('noValidate', true);
    $reviewDate.attr('max', toInputDate(new Date()));
    $reviewResult.attr('tabindex', '-1');
    prepareBoxes($reviewErrors.add($reviewResult));

    $reviewForm.on('input', function () {
        updateCounter();
        $reviewResult.fadeOut(200);
        if (reviewWasSubmitted) {
            showErrorList($reviewErrors, validateReview());
        }
    });

    $reviewForm.on('submit', function (event) {
        // without preventDefault() the browser would send the form and reload the page, losing the new review
        event.preventDefault();
        reviewWasSubmitted = true;
        const errors = validateReview();
        showErrorList($reviewErrors, errors);
        if (errors.length > 0) {
            $reviewResult.stop(true, true).hide();
            $reviewForm.find('.is-invalid:first').trigger('focus');
            return;
        }

        const review = {
            name: $reviewName.val().trim(),
            rating: getChosenRating(),
            level: $reviewBarber.val(),
            text: $reviewText.val().trim(),
            date: new Date()
        };
        const visitDay = new Date($reviewDate.val() + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const visitText = 'visit on ' + visitDay + ', ' + $reviewVisits.val() + ' visit(s) in total';

        reviews.unshift(review);
        $reviewForm.trigger('reset');
        showAllReviews();

        // first <li> (the new review) -> hide -> fade in -> its <article> -> gold outline
        $reviewList.children('li:first').hide().fadeIn(800).find('article').addClass('is-selected');

        $reviewResult.empty().append(
            $('<p>', { 'class': 'fw-bold fs-5 mb-2', text: 'Thank you, ' + review.name + '!' }),
            $('<p>', {
                'class': 'mb-2',
                text: 'Your review is now first in the list above: ' + review.rating + ' of 5, ' +
                    LEVEL_WORDS[review.level].toLowerCase() + ', ' + visitText + '.'
            }),
            $('<p>', { 'class': 'mb-0', text: 'This is a front-end demonstration: nothing was sent to a server or to LOGOVO, and the review disappears when you reload the page.' })
        );
        showResultBox($reviewResult);
    });

    $reviewForm.on('reset', function () {
        reviewWasSubmitted = false;
        showErrorList($reviewErrors, []);
        $reviewResult.stop(true, true).hide();
        $(this).find('.is-invalid, .is-valid').each(function () {
            clearFieldState($(this));
        });
        // runs before the fields are cleared
        setTimeout(updateCounter, 0);
    });

    $ratingFilter.on('change', renderReviews);
    $showAllButton.on('click', showAllReviews);

    // Delegated: the buttons are created on every render, so $('#review-list button').on() would miss them;
    // #review-list always exists and catches the click as it bubbles up.
    $reviewList.on('click', 'button', function () {
        const rating = $(this).closest('li').attr('data-rating');
        $ratingFilter.val(rating);
        renderReviews();
    });

    updateCounter();
    renderReviews();
});
