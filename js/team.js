'use strict';

const barbers = [
    { id: 'daniyar', name: 'Daniyar', level: 'lead', section: 'lead-barbers' },
    { id: 'arman', name: 'Arman', level: 'lead', section: 'lead-barbers' },
    { id: 'yerassyl', name: 'Yerassyl', level: 'lead', section: 'lead-barbers' },
    { id: 'nurbakyt', name: 'Nurbakyt', level: 'top', section: 'top-barbers' },
    { id: 'baktybay', name: 'Baktybay', level: 'top', section: 'top-barbers' },
    { id: 'ilyas', name: 'Ilyas', level: 'top', section: 'top-barbers' },
    { id: 'akhmadzhon', name: 'Akhmadzhon', level: 'senior', section: 'senior-barbers' },
    { id: 'shukur', name: 'Shukur', level: 'senior', section: 'senior-barbers' },
    { id: 'khan', name: 'Khan', level: 'senior', section: 'senior-barbers' }
];

const LEVEL_NAMES = { lead: 'Lead', top: 'Top', senior: 'Senior' };
const HAIRCUT_IDS = ['kids-haircut', 'haircut', 'long-haircut', 'haircut-beard', 'perm'];

function createLabeledControl(control, labelText, classes) {
    const wrapper = createElement('p', classes.concat(['mb-0']));
    const label = createElement('label', ['form-label'], labelText);
    label.htmlFor = control.id;
    wrapper.append(label, control);
    return wrapper;
}

function createOptions(select, options) {
    options.forEach(function (option) {
        const item = createElement('option', [], option.text);
        item.value = option.value;
        select.append(item);
    });
    return select;
}

const barberSearch = createElement('input', ['form-control']);
barberSearch.type = 'search';
barberSearch.id = 'barber-search';
barberSearch.placeholder = 'for example Ilyas';

const levelSelect = createOptions(createElement('select', ['form-select']), [
    { value: 'all', text: 'All levels' },
    { value: 'lead', text: 'Lead' },
    { value: 'top', text: 'Top' },
    { value: 'senior', text: 'Senior' }
]);
levelSelect.id = 'barber-level';

const finderReset = createButton('Reset', ['btn-outline-secondary', 'w-100']);
const finderResetWrapper = createElement('p', ['col-12', 'col-md-2', 'mb-0']);
finderResetWrapper.append(finderReset);

const finder = createElement('div', ['row', 'g-3', 'align-items-end', 'mt-4']);
finder.append(
    createLabeledControl(barberSearch, 'Find a barber by name', ['col-12', 'col-sm-6', 'col-md-5']),
    createLabeledControl(levelSelect, 'Level', ['col-12', 'col-sm-6', 'col-md-5']),
    finderResetWrapper
);

const finderCount = createElement('p', ['fw-semibold', 'mt-3', 'mb-0']);
finderCount.setAttribute('role', 'status');
finderCount.setAttribute('aria-live', 'polite');

const finderEmpty = createElement('p', ['is-hidden', 'is-error', 'rounded', 'p-3', 'mt-3', 'mb-0']);

document.querySelector('#team-intro').append(finder, finderCount, finderEmpty);

function findBarbers(query, level) {
    const text = query.trim().toLowerCase();
    return barbers.filter(function (barber) {
        return (level === 'all' || barber.level === level) && barber.name.toLowerCase().startsWith(text);
    });
}

function applyBarberFilter() {
    const found = findBarbers(barberSearch.value, levelSelect.value);
    const foundIds = found.map(function (barber) {
        return barber.id;
    });

    barbers.forEach(function (barber) {
        const card = document.getElementById('barber-' + barber.id);
        card.closest('li').classList.toggle('is-hidden', !foundIds.includes(barber.id));
    });

    ['lead-barbers', 'top-barbers', 'senior-barbers'].forEach(function (sectionId) {
        const hasBarbers = found.some(function (barber) {
            return barber.section === sectionId;
        });
        document.getElementById(sectionId).classList.toggle('is-hidden', !hasBarbers);
    });

    finderCount.textContent = 'Showing ' + found.length + ' of ' + barbers.length + ' barbers';
    finderEmpty.replaceChildren();
    finderEmpty.classList.toggle('is-hidden', found.length !== 0);
    if (found.length === 0) {
        const showAll = createButton('Show all barbers', ['btn-outline-secondary', 'btn-sm', 'ms-2']);
        showAll.addEventListener('click', resetFinder);
        finderEmpty.append('No barber matches "' + barberSearch.value.trim() + '" at this level. You can also choose "Any barber" of a level in the booking form.', showAll);
    }
}

function resetFinder() {
    barberSearch.value = '';
    levelSelect.value = 'all';
    applyBarberFilter();
    barberSearch.focus();
}

barberSearch.addEventListener('input', applyBarberFilter);
levelSelect.addEventListener('change', applyBarberFilter);
finderReset.addEventListener('click', resetFinder);
applyBarberFilter();

const mainServices = services.filter(function (service) {
    return !service.isAddOn && service.id !== 'student-day';
});
const designs = services.filter(function (service) {
    return service.isAddOn;
});

const compareService = createOptions(createElement('select', ['form-select']), mainServices.map(function (service) {
    return { value: service.id, text: service.name };
}));
compareService.id = 'compare-service';

const compareDesign = createOptions(createElement('select', ['form-select']), [{ value: 'none', text: 'No design' }].concat(designs.map(function (design) {
    return { value: design.id, text: design.name.split(',')[0] + ', +' + design.lead + ' tg' };
})));
compareDesign.id = 'compare-design';

const compareCards = createElement('ul', ['row', 'g-3', 'list-unstyled', 'mt-2', 'mb-0']);
const compareControls = createElement('div', ['row', 'g-3']);
compareControls.append(
    createLabeledControl(compareService, 'Service', ['col-12', 'col-md-6']),
    createLabeledControl(compareDesign, 'Hair design', ['col-12', 'col-md-6'])
);

const compareSection = createElement('section', ['mt-5']);
compareSection.id = 'price-compare';
compareSection.append(
    createElement('h2', ['border-bottom', 'border-2', 'border-warning', 'pb-2', 'mb-3'], 'Compare the Price by Level'),
    createElement('p', [], 'Choose a service and see what it costs with a lead, top or senior barber. You pay at the barbershop after the visit.'),
    compareControls,
    compareCards
);
document.querySelector('#hair-designs').before(compareSection);

function getVisitPrice(service, design, level) {
    const price = getPrice(service, level);
    if (price === null) {
        return null;
    }
    return design === undefined ? price : price + getPrice(design, level);
}

function isHaircut(service) {
    return HAIRCUT_IDS.includes(service.id);
}

function describeBonus(level, service) {
    if (level === 'lead') {
        return 'Without the free bonus.';
    }
    if (!isHaircut(service)) {
        return 'The free bonus comes only with a haircut.';
    }
    return 'With the free bonus: face mask, head massage, wax hair removal.';
}

function createLevelCard(level, service, design, cheapest) {
    const price = getVisitPrice(service, design, level);
    const item = createElement('li', ['col-12', 'col-md-4']);
    const card = createElement('div', ['card', 'h-100', 'shadow-sm', 'border-top', 'border-4', 'border-warning']);
    const body = createElement('div', ['card-body']);
    body.append(createElement('h3', ['card-title', 'h5'], LEVEL_NAMES[level] + ' barber'));

    if (price === null) {
        body.append(createElement('p', ['card-text', 'mb-0'], LEVEL_NAMES[level] + ' barbers do not do this service.'));
    } else {
        body.append(createElement('p', ['card-text', 'fs-4', 'fw-bold', 'text-primary', 'mb-1'], formatPrice(price, false)));
        body.append(createElement('p', ['card-text', 'small', 'mb-2'], describeBonus(level, service)));
        if (price === cheapest) {
            body.append(createElement('p', ['badge', 'text-bg-dark', 'mb-2'], 'Lowest price'));
            card.classList.add('is-active');
        }
        const link = createElement('a', ['btn', 'btn-warning', 'btn-sm', 'd-table'], 'Book with a ' + level + ' barber');
        const designPart = design === undefined ? '' : '&design=' + design.id.replace('design-', '');
        link.href = 'booking.html?service=' + service.id + designPart + '&barber=any-' + level + '#booking';
        body.append(link);
    }

    card.append(body);
    item.append(card);
    return item;
}

function renderComparison() {
    const service = mainServices.find(function (item) {
        return item.id === compareService.value;
    });
    const design = designs.find(function (item) {
        return item.id === compareDesign.value;
    });
    compareCards.replaceChildren();
    if (design !== undefined && !isHaircut(service)) {
        const message = createElement('li', ['col-12']);
        message.append(createElement('p', ['is-error', 'rounded', 'p-3', 'mb-0'], 'A hair design is added only to a haircut. Choose a haircut or "No design".'));
        compareCards.append(message);
        return;
    }

    const prices = LEVELS.map(function (level) {
        return getVisitPrice(service, design, level);
    }).filter(function (price) {
        return price !== null;
    });
    const cheapest = Math.min(...prices);

    LEVELS.forEach(function (level) {
        compareCards.append(createLevelCard(level, service, design, cheapest));
    });
}

compareService.value = 'haircut';
compareService.addEventListener('change', renderComparison);
compareDesign.addEventListener('change', renderComparison);
renderComparison();
