'use strict';

// Rewritten from main.js (old: old-js-version.js): .siblings()/.parent() replaced getElementById/parentElement,
// one .removeClass().addClass().attr() chain replaced three lines. A little shorter (38 lines, was 44).

// A browser check never replaces a server check: JavaScript can be switched off or the request sent without the page.

function showFieldError($field, message) {
    let $feedback = $field.siblings('.invalid-feedback');
    if ($feedback.length === 0) {
        const id = $field.attr('id') + '-error';
        $feedback = $('<span>', { id: id, 'class': 'invalid-feedback' }).appendTo($field.parent());
        $field.attr('aria-describedby', id);
    }
    $feedback.text(message);
    $field.removeClass('is-valid').addClass('is-invalid').attr('aria-invalid', 'true');
}

function clearFieldState($field) {
    $field.removeClass('is-invalid is-valid').removeAttr('aria-invalid');
}

function checkField($field, message, errors) {
    if (message === '') {
        clearFieldState($field);
        $field.not(':checkbox').addClass('is-valid');
    } else {
        showFieldError($field, message);
        errors.push({ field: $field, message: message });
    }
    return message === '';
}

function showErrorList($box, errors) {
    $box.stop(true, true);
    if (errors.length === 0) {
        $box.slideUp(200);
        return;
    }
    const word = errors.length === 1 ? 'field' : 'fields';
    const $list = $('<ul>', { 'class': 'mb-0' });
    $.each(errors, function (index, error) {
        $('<li>').text(error.message).appendTo($list);
    });
    $box.empty()
        .append($('<p>', { 'class': 'fw-bold mb-2', text: 'Please fix ' + errors.length + ' ' + word + ':' }), $list)
        .slideDown(300);
}

// swap is-hidden for jQuery's own display: none, so the effects can show and hide the boxes
function prepareBoxes($boxes) {
    $boxes.hide().removeClass('is-hidden');
}

function showResultBox($box) {
    $box.stop(true, true).fadeIn(400, function () {
        $(this).trigger('focus');
    });
}
