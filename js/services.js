'use strict';

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
