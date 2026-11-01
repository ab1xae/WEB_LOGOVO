'use strict';

// jQuery rewrite (old: old-js-version.js): $(), .val()/.text()/.data(), .on() replaced querySelector,
// .value/.textContent/.dataset, addEventListener. Not shorter (295 lines, was 286), clearer only in the result box.

$(function () {
    const $bookingForm = $('#booking-form');
    const $serviceSelect = $('#service-select');
    const $designSelect = $('#hair-design');
    const $barberSelect = $('#barber-select');
    const $dateInput = $('#visit-date');
    const $timeSelect = $('#visit-time');
    const $peopleInput = $('#people-count');
    const $nameInput = $('#client-name');
    const $phoneInput = $('#client-phone');
    const $emailInput = $('#client-email');
    const $commentInput = $('#comment');
    const $giftCheck = $('#agree-gift');
    const $smsCheck = $('#agree-sms');
    const $bookingErrors = $('#booking-errors');
    const $bookingResult = $('#booking-result');

    const $summaryService = $('#summary-service');
    const $summaryBarber = $('#summary-barber');
    const $summaryTime = $('#summary-time');
    const $bookingTotal = $('#booking-total');

    const NOT_CHOSEN = 'not chosen yet';
    const TUESDAY = 2;
    const MIN_PEOPLE = 1;
    const MAX_PEOPLE = 5;
    const MAX_DAYS_AHEAD = 30;
    const MAX_COMMENT = 300;
    const DAY_MS = 24 * 60 * 60 * 1000;
    const HAIRCUT_SERVICES = ['kids-haircut', 'haircut', 'long-haircut', 'haircut-beard', 'perm'];

    let wasSubmitted = false;

    function getChosenOption($select) {
        if ($select.val() === '') {
            return null;
        }
        return $select.find('option:selected');
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

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function getServicePrice($serviceOption, level, date) {
        const tuesdayPrice = $serviceOption.data('priceTuesday' + capitalize(level));
        if (isStudentDay(date) && tuesdayPrice !== undefined) {
            return Number(tuesdayPrice);
        }
        const price = $serviceOption.data('price' + capitalize(level));
        if (price === undefined || price === '') {
            return null;
        }
        return Number(price);
    }

    function getDesignName($designOption) {
        return $designOption.text().split(',')[0];
    }

    function describeService($serviceOption, $designOption) {
        if ($serviceOption === null) {
            return NOT_CHOSEN;
        }
        if ($designOption.val() === 'none') {
            return $serviceOption.text();
        }
        return $serviceOption.text() + ' + ' + getDesignName($designOption) + ' design';
    }

    function describeBarber($barberOption) {
        if ($barberOption === null) {
            return NOT_CHOSEN;
        }
        const level = $barberOption.data('level');
        if ($barberOption.val() === 'any-' + level) {
            return $barberOption.text();
        }
        return $barberOption.text() + ' (' + level + ' barber)';
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

    function describeTotal($serviceOption, $designOption, $barberOption, date, peopleValue) {
        if ($serviceOption === null || $barberOption === null) {
            return { text: 'choose a service and a barber', isError: false };
        }

        const people = Number(peopleValue);
        if (!Number.isInteger(people) || people < MIN_PEOPLE || people > MAX_PEOPLE) {
            return { text: 'the number of people must be from 1 to 5', isError: true };
        }

        const level = $barberOption.data('level');
        const servicePrice = getServicePrice($serviceOption, level, date);
        if (servicePrice === null) {
            return {
                text: capitalize(level) + ' barbers do not do this service, please choose a top or senior barber',
                isError: true
            };
        }

        const onePerson = servicePrice + Number($designOption.data('price'));
        const total = onePerson * people;

        let text = total + ' tg';
        if (people > 1) {
            text = onePerson + ' tg × ' + people + ' people = ' + text;
        }
        if (isStudentDay(date) && $serviceOption.data('priceTuesdayLead') !== undefined) {
            text += ' (Student Day price)';
        }
        return { text: text, isError: false };
    }

    function updateSummary() {
        const $serviceOption = getChosenOption($serviceSelect);
        const $designOption = $designSelect.find('option:selected');
        const $barberOption = getChosenOption($barberSelect);
        const date = parseVisitDate($dateInput.val());

        $summaryService.text(describeService($serviceOption, $designOption));
        $summaryBarber.text(describeBarber($barberOption));
        $summaryTime.text(describeTime(date, $timeSelect.val()));

        const total = describeTotal($serviceOption, $designOption, $barberOption, date, $peopleInput.val());
        $bookingTotal.text(total.text).toggleClass('is-error', total.isError);
    }

    function selectFromAddress($select, paramName) {
        const value = new URLSearchParams(window.location.search).get(paramName);
        if (value === null) {
            return;
        }
        // :not([value=""]) skips "Choose a ..."; .filter() so a quote in the address cannot break a selector
        const $match = $select.find('option:not([value=""])').filter(function () {
            return $(this).val() === value;
        });
        if ($match.length > 0) {
            $select.val(value);
        }
    }

    function getToday() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    function getDesignError($serviceOption, design) {
        if (design !== 'none' && $serviceOption !== null && !HAIRCUT_SERVICES.includes($serviceOption.val())) {
            return 'A hair design is added only to a haircut, please choose a haircut service or "No design".';
        }
        return '';
    }

    // .prop('checked') is the current state, .attr('checked') only what the HTML had
    function getGiftError($serviceOption, level) {
        if (!$giftCheck.prop('checked')) {
            return '';
        }
        if (level === 'lead') {
            return 'The free bonus comes only with a top or senior barber.';
        }
        if ($serviceOption !== null && !HAIRCUT_SERVICES.includes($serviceOption.val())) {
            return 'The free bonus comes only with a haircut.';
        }
        return '';
    }

    function getBarberError($serviceOption, $barberOption) {
        if ($barberOption === null) {
            return 'Please choose a barber or a level.';
        }
        const level = $barberOption.data('level');
        if ($serviceOption !== null && getServicePrice($serviceOption, level, null) === null) {
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
        const name = $nameInput.val().trim();
        const phone = $phoneInput.val().trim();
        const email = $emailInput.val().trim();
        const comment = $commentInput.val().trim();
        const $serviceOption = getChosenOption($serviceSelect);
        const $barberOption = getChosenOption($barberSelect);
        const level = $barberOption === null ? '' : $barberOption.data('level');
        const date = parseVisitDate($dateInput.val());
        const people = Number($peopleInput.val());

        checkField($nameInput, getNameError(name), errors);
        checkField($phoneInput, isValidPhone(phone) ? '' : 'Please write a phone number like +7 700 000 0000.', errors);
        checkField($emailInput, isValidEmail(email) ? '' : 'Please write an email like name@mail.com.', errors);
        checkField($commentInput, comment.length <= MAX_COMMENT ? '' : 'The comment can have up to 300 characters.', errors);
        checkField($giftCheck, getGiftError($serviceOption, level), errors);
        checkField($serviceSelect, $serviceOption === null ? 'Please choose a service.' : '', errors);
        checkField($designSelect, getDesignError($serviceOption, $designSelect.val()), errors);
        checkField($barberSelect, getBarberError($serviceOption, $barberOption), errors);
        checkField($dateInput, getDateError(date), errors);
        checkField($timeSelect, getTimeError(date, $timeSelect.val()), errors);
        checkField($peopleInput, Number.isInteger(people) && people >= MIN_PEOPLE && people <= MAX_PEOPLE ? '' : 'From 1 to 5 people.', errors);
        return errors;
    }

    function addResultLine($list, label, value) {
        $('<li>').text(value).prepend($('<strong>').text(label + ': ')).appendTo($list);
    }

    function fillBookingResult() {
        const $serviceOption = getChosenOption($serviceSelect);
        const $designOption = $designSelect.find('option:selected');
        const $barberOption = getChosenOption($barberSelect);
        const date = parseVisitDate($dateInput.val());
        const comment = $commentInput.val().trim();

        const $list = $('<ul>', { 'class': 'list-unstyled mb-2' });
        addResultLine($list, 'Name', $nameInput.val().trim());
        addResultLine($list, 'Phone', $phoneInput.val().trim());
        addResultLine($list, 'Email', $emailInput.val().trim());
        addResultLine($list, 'Service', describeService($serviceOption, $designOption));
        addResultLine($list, 'Barber', describeBarber($barberOption));
        addResultLine($list, 'Date and time', describeTime(date, $timeSelect.val()));
        addResultLine($list, 'People', $peopleInput.val());
        addResultLine($list, 'Total to pay at the barbershop', describeTotal($serviceOption, $designOption, $barberOption, date, $peopleInput.val()).text);
        addResultLine($list, 'Free bonus', $giftCheck.prop('checked') ? 'yes' : 'no');
        addResultLine($list, 'SMS reminder', $smsCheck.prop('checked') ? 'yes' : 'no');
        if (comment !== '') {
            addResultLine($list, 'Comment', comment);
        }

        // .html(): our own text with a link; everything the visitor typed goes through .text()
        const $note = $('<p>', { 'class': 'mb-0' }).html(
            'This is a front-end demonstration: no data was sent to a server and no real booking was made. ' +
            'To book for real, call LOGOVO at <a href="tel:+77003968940">' + LOGOVO_PHONE + '</a>.'
        );

        $bookingResult.empty().append(
            $('<p>', { 'class': 'fw-bold fs-5 mb-2', text: 'Demo request ' + makeReference('LG') + ' is ready' }),
            $list,
            $note
        );
    }

    function handleFormChange() {
        updateSummary();
        $bookingResult.fadeOut(200);
        if (wasSubmitted) {
            showErrorList($bookingErrors, validateBooking());
        }
    }

    $dateInput.attr('min', toInputDate(getToday()));
    $dateInput.attr('max', toInputDate(new Date(getToday().getTime() + MAX_DAYS_AHEAD * DAY_MS)));
    // required stays in the HTML: without this file the browser still checks the form
    $bookingForm.prop('noValidate', true);
    $bookingResult.attr('tabindex', '-1');
    prepareBoxes($bookingErrors.add($bookingResult));

    selectFromAddress($serviceSelect, 'service');
    selectFromAddress($designSelect, 'design');
    selectFromAddress($barberSelect, 'barber');
    updateSummary();

    $bookingForm.on('input change', handleFormChange);

    $bookingForm.on('submit', function (event) {
        // without preventDefault() the browser would send the form and reload the page, losing the messages
        event.preventDefault();
        wasSubmitted = true;
        const errors = validateBooking();
        showErrorList($bookingErrors, errors);
        if (errors.length > 0) {
            $bookingResult.stop(true, true).hide();
            $bookingForm.find('.is-invalid:first').trigger('focus');
            return;
        }
        fillBookingResult();
        $bookingForm.trigger('reset');
        showResultBox($bookingResult);
    });

    $bookingForm.on('reset', function () {
        wasSubmitted = false;
        showErrorList($bookingErrors, []);
        $bookingResult.stop(true, true).hide();
        $(this).find('.is-invalid, .is-valid').each(function () {
            clearFieldState($(this));
        });
        // runs before the fields are cleared
        setTimeout(updateSummary, 0);
    });
});
