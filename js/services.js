'use strict';

// jQuery rewrite (old: old-js-version.js): $('<td>', {...}) replaced createElement + textContent,
// one delegated .on() replaced a handler per button. Shorter (120 lines, was 140), equally clear.

$(function () {
    const $priceBody = $('#price-table tbody');

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
        const $select = $('<select>', { id: id, 'class': 'form-select' });
        $.each(options, function (index, option) {
            $('<option>', { value: option[0], text: option[1] }).appendTo($select);
        });
        return $select;
    }

    function wrapWithLabel($control, labelText, classes) {
        return $('<p>', { 'class': classes + ' mb-0' }).append(
            $('<label>', { 'class': 'form-label', 'for': $control.attr('id'), text: labelText }),
            $control
        );
    }

    const $searchInput = $('<input>', { type: 'search', id: 'service-search', 'class': 'form-control', placeholder: 'for example beard' });
    const $categorySelect = createSelect('service-category', CATEGORY_OPTIONS);
    const $sortSelect = createSelect('service-sort', SORT_OPTIONS);
    const $resetButton = $('<button>', { type: 'button', id: 'service-reset', 'class': 'btn btn-outline-secondary w-100', text: 'Reset' });

    const $controls = $('<div>', { 'class': 'row g-3 align-items-end mb-3' }).append(
        wrapWithLabel($searchInput, 'Search a service', 'col-12 col-md-4'),
        wrapWithLabel($categorySelect, 'Category', 'col-6 col-md-3'),
        wrapWithLabel($sortSelect, 'Sort', 'col-6 col-md-3'),
        $('<p>', { 'class': 'col-12 col-md-2 mb-0' }).append($resetButton)
    );

    const $resultCount = $('<p>', { 'class': 'fw-semibold mb-2', role: 'status', 'aria-live': 'polite' });

    $('#price-table .table-responsive').before($controls, $resultCount);

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
        const $cell = $('<td>', { 'class': 'text-end', text: formatPrice(price, service.isAddOn) });
        if (price === null) {
            $cell.append($('<span>', { 'class': 'visually-hidden', text: ' not done by a ' + level + ' barber' }));
        }
        return $cell;
    }

    function createServiceRow(service) {
        const $bookLink = $('<a>', { id: 'book-' + service.id, 'class': 'btn btn-warning btn-sm', text: 'Book' })
            .attr('href', 'booking.html?' + service.link + '#booking')
            .append($('<span>', { 'class': 'visually-hidden', text: ': ' + service.name }));

        const $row = $('<tr>', { id: 'price-' + service.id })
            .append($('<th>', { scope: 'row', text: service.name }));
        $.each(LEVELS, function (index, level) {
            $row.append(createPriceCell(service, level));
        });
        $row.append($('<td>', { 'class': 'text-center' }).append($bookLink));

        $row.toggleClass('is-active', service.id === 'student-day' && new Date().getDay() === 2);
        if ($row.hasClass('is-active')) {
            $row.children('th').append($('<span>', { 'class': 'visually-hidden', text: ' (today is Student Day)' }));
        }
        return $row;
    }

    function createEmptyRow(query) {
        const message = query.trim() === ''
            ? 'There are no services in this category.'
            : 'No services match "' + query.trim() + '".';
        const $cell = $('<td>', { 'class': 'text-center py-4', colspan: 5 })
            .text(message)
            .append($('<button>', { type: 'button', 'class': 'btn btn-outline-secondary btn-sm ms-2', text: 'Show all services' }));
        return $('<tr>').append($cell);
    }

    function renderServices() {
        const found = filterServices(services, $searchInput.val(), $categorySelect.val());
        const shown = sortServices(found, $sortSelect.val());

        $priceBody.empty();
        if (shown.length === 0) {
            $priceBody.append(createEmptyRow($searchInput.val()));
        }
        $.each(shown, function (index, service) {
            createServiceRow(service).appendTo($priceBody);
        });

        $resultCount.text('Showing ' + shown.length + ' of ' + services.length + ' services');
    }

    function resetServices() {
        $searchInput.val('');
        $categorySelect.val('all');
        $sortSelect.val('default');
        renderServices();
        $searchInput.trigger('focus');
    }

    $searchInput.on('input', renderServices);
    $categorySelect.on('change', renderServices);
    $sortSelect.on('change', renderServices);
    $resetButton.on('click', resetServices);

    // Delegated: the "Show all services" button is created later, so a direct .on() at page load would miss it
    $priceBody.on('click', 'button', resetServices);

    renderServices();
});
