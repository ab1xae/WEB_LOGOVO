'use strict';

const OPEN_HOUR = 10;
const CLOSE_HOUR = 21;
const LOGOVO_PHONE = '+7 700 396 8940';

const services = [
    { id: 'kids-haircut', name: 'Kids haircut (up to 7 years)', category: 'haircut', lead: 2000, top: 3000, senior: 4000, link: 'service=kids-haircut', isAddOn: false },
    { id: 'haircut', name: "Men's haircut (8 years and older)", category: 'haircut', lead: 3000, top: 4000, senior: 5000, link: 'service=haircut', isAddOn: false },
    { id: 'long-haircut', name: 'Long hair haircut', category: 'haircut', lead: 4000, top: 5000, senior: 6000, link: 'service=long-haircut', isAddOn: false },
    { id: 'haircut-beard', name: 'Haircut + beard styling', category: 'beard', lead: 5000, top: 7000, senior: 9000, link: 'service=haircut-beard', isAddOn: false },
    { id: 'beard', name: 'Beard styling', category: 'beard', lead: 2000, top: 3000, senior: 4000, link: 'service=beard', isAddOn: false },
    { id: 'hair-tint', name: 'Hair tinting', category: 'other', lead: 3000, top: 4000, senior: 5000, link: 'service=hair-tint', isAddOn: false },
    { id: 'beard-tint', name: 'Beard tinting', category: 'beard', lead: 2000, top: 3000, senior: 4000, link: 'service=beard-tint', isAddOn: false },
    { id: 'student-day', name: 'Tuesday "Student Day" men\'s haircut', category: 'haircut', lead: 2500, top: 3500, senior: 4500, link: 'service=haircut', isAddOn: false },
    { id: 'facial', name: 'Facial cleansing', category: 'other', lead: 3000, top: 4000, senior: 5000, link: 'service=facial', isAddOn: false },
    { id: 'perm', name: 'Perm + haircut', category: 'other', lead: null, top: 20000, senior: 20000, link: 'service=perm', isAddOn: false },
    { id: 'design-lightning', name: 'Hair design "Lightning", added to a haircut', category: 'design', lead: 500, top: 500, senior: 500, link: 'service=haircut&design=lightning', isAddOn: true },
    { id: 'design-spiderweb', name: 'Hair design "Spiderweb", added to a haircut', category: 'design', lead: 1000, top: 1000, senior: 1000, link: 'service=haircut&design=spiderweb', isAddOn: true }
];

const LEVELS = ['lead', 'top', 'senior'];

function getPrice(service, level) {
    const price = service[level];
    if (price === null || price === undefined) {
        return null;
    }
    return price;
}

function getLowestPrice(service) {
    const prices = LEVELS.map(function (level) {
        return getPrice(service, level);
    }).filter(function (price) {
        return price !== null;
    });
    return Math.min(...prices);
}

function formatPrice(amount, isAddOn) {
    if (amount === null) {
        return '—';
    }
    return (isAddOn ? '+' : '') + amount + ' tg';
}

function makeReference(prefix) {
    return prefix + '-' + Math.floor(1000 + Math.random() * 9000);
}

function createElement(tag, classes = [], text) {
    const element = document.createElement(tag);
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    if (text !== undefined) {
        element.textContent = text;
    }
    return element;
}

function createButton(text, classes) {
    const button = createElement('button', ['btn'].concat(classes), text);
    button.type = 'button';
    return button;
}

function toInputDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

function isValidPhone(value) {
    const digits = value.replace(/[\s()+-]/g, '');
    return /^[78]\d{10}$/.test(digits);
}

function getNameError(name) {
    if (name === '') {
        return 'Please write your name.';
    }
    if (name.length < 2 || name.length > 40 || /\d/.test(name)) {
        return 'The name must have from 2 to 40 letters and no digits.';
    }
    return '';
}

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

function describeOpenStatus(now) {
    const hour = now.getHours();
    if (hour >= OPEN_HOUR && hour < CLOSE_HOUR) {
        const minutesLeft = CLOSE_HOUR * 60 - (hour * 60 + now.getMinutes());
        return 'Open now, closes at 21:00 (in ' + Math.floor(minutesLeft / 60) + ' h ' + minutesLeft % 60 + ' min).';
    }
    if (hour < OPEN_HOUR) {
        return 'Closed now, opens today at 10:00.';
    }
    return 'Closed now, opens tomorrow at 10:00.';
}

function showOpenStatus() {
    const footerRow = document.querySelector('footer .row');
    const status = createElement('p', ['col-12', 'mb-0', 'small', 'text-center', 'text-warning'], describeOpenStatus(new Date()));
    footerRow.append(status);
}

showOpenStatus();
