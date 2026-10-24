'use strict';

const photoGrid = document.querySelector('#photos .row');

const photos = [
    { src: 'images/tools-station.jpg', alt: 'Barber workplace with clippers, scissors and combs', caption: "Senior barber Akhmadzhon's workplace with his clippers, scissors and combs", actionText: 'Book with Akhmadzhon', actionLink: 'booking.html?barber=akhmadzhon#booking' },
    { src: 'images/shelf-products.jpg', alt: 'Shelf with hair and beard products', caption: 'Hair and beard products that our barbers use every day', actionText: 'See beard services and prices', actionLink: 'services.html#price-table' },
    { src: 'images/awards-shelf.jpg', alt: 'Two 2GIS Awards 2025 on a glass shelf', caption: 'Two 2GIS Awards 2025 for the best barbershop in the category', actionText: 'Read about LOGOVO', actionLink: 'about.html#about-us' },
    { src: 'images/lounge.jpg', alt: 'Waiting area with a TV, a game console and a sofa', caption: 'Waiting area for our guests', actionText: 'Book a visit', actionLink: 'booking.html#booking' }
];

let currentPhoto = -1;
let lastOpenButton = null;

const viewer = createElement('div', ['row', 'justify-content-center', 'mb-4', 'is-hidden']);
viewer.id = 'photo-viewer';
viewer.setAttribute('role', 'region');
viewer.setAttribute('aria-label', 'Large photo');
const viewerBox = createElement('div', ['col-12', 'col-md-8', 'col-lg-5', 'bg-white', 'border', 'rounded', 'shadow-sm', 'p-3']);
const viewerImage = createElement('img', ['img-fluid', 'rounded', 'd-block', 'mx-auto']);
const viewerCaption = createElement('p', ['fst-italic', 'mb-1']);
const viewerCount = createElement('p', ['small', 'text-body-secondary', 'mb-2']);
viewerCount.setAttribute('aria-live', 'polite');
const viewerAction = createElement('a', ['btn', 'btn-warning', 'btn-sm']);
const prevButton = createButton('← Previous', ['btn-outline-secondary', 'btn-sm']);
const nextButton = createButton('Next →', ['btn-outline-secondary', 'btn-sm']);
const closeButton = createButton('Close', ['btn-outline-dark', 'btn-sm']);
const viewerButtons = createElement('p', ['d-flex', 'flex-wrap', 'gap-2', 'mb-3']);
viewerButtons.append(viewerAction, prevButton, nextButton, closeButton);
viewerBox.append(viewerCaption, viewerCount, viewerButtons, viewerImage);
viewer.append(viewerBox);
photoGrid.before(viewer);

const hint = createElement('p', ['text-body-secondary', 'small'], 'Press "View larger" on a photo. In the large view you can use the arrow keys and Esc.');
viewer.before(hint);

function getNextIndex(index, step) {
    return (index + step + photos.length) % photos.length;
}

function createPhotoFigure(photo, index) {
    const figure = createElement('figure', ['col-12', 'col-md-6', 'col-lg-3', 'mb-0']);
    const ratio = createElement('div', ['ratio', 'ratio-4x3']);
    const image = createElement('img', ['object-fit-cover', 'rounded', 'shadow-sm']);
    image.src = photo.src;
    image.alt = photo.alt;
    ratio.append(image);

    const caption = createElement('figcaption', ['figure-caption', 'fst-italic', 'mt-2'], photo.caption);
    const openButton = createButton('View larger', ['btn-outline-secondary', 'btn-sm', 'mt-2']);
    openButton.setAttribute('aria-controls', viewer.id);
    openButton.addEventListener('click', function () {
        lastOpenButton = openButton;
        showPhoto(index);
    });

    figure.append(ratio, caption, openButton);
    return figure;
}

function renderPhotos() {
    photoGrid.replaceChildren();
    photos.forEach(function (photo, index) {
        photoGrid.append(createPhotoFigure(photo, index));
    });
}

function showPhoto(index) {
    currentPhoto = index;
    const photo = photos[index];
    viewerImage.src = photo.src;
    viewerImage.alt = photo.alt;
    viewerCaption.textContent = photo.caption;
    viewerCount.textContent = 'Photo ' + (index + 1) + ' of ' + photos.length;
    viewerAction.textContent = photo.actionText;
    viewerAction.href = photo.actionLink;

    Array.from(photoGrid.children).forEach(function (figure, figureIndex) {
        figure.classList.toggle('is-selected', figureIndex === index);
    });

    if (viewer.classList.contains('is-hidden')) {
        viewer.classList.remove('is-hidden');
        viewer.scrollIntoView({ block: 'nearest' });
        nextButton.focus();
    }
}

function closeViewer() {
    viewer.classList.add('is-hidden');
    Array.from(photoGrid.children).forEach(function (figure) {
        figure.classList.remove('is-selected');
    });
    currentPhoto = -1;
    if (lastOpenButton !== null) {
        lastOpenButton.focus();
    }
}

prevButton.addEventListener('click', function () {
    showPhoto(getNextIndex(currentPhoto, -1));
});

nextButton.addEventListener('click', function () {
    showPhoto(getNextIndex(currentPhoto, 1));
});

closeButton.addEventListener('click', closeViewer);

document.addEventListener('keydown', function (event) {
    if (currentPhoto === -1) {
        return;
    }
    if (event.key === 'ArrowRight') {
        showPhoto(getNextIndex(currentPhoto, 1));
    } else if (event.key === 'ArrowLeft') {
        showPhoto(getNextIndex(currentPhoto, -1));
    } else if (event.key === 'Escape') {
        closeViewer();
    }
});

renderPhotos();
