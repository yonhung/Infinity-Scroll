const imageContainer = document.querySelector('#image-container')
const loader = document.querySelector('#loader');
const loaderBottom = document.querySelector('.loader--bottom');
let photosArray = [];
let photoAnchors = [];
let photosLoadedNum = 0;
let photosNum = 0;
let isPhotosDisplayed = false;
let isInitialLoad = true;

// Unsplash API
const apiKey = "xKC_3ckomBDoJlV7TsDdpuDGMn6vUnWz1fwQ-RUND6k";
let count = 5;
let apiUrl=`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

fetchPhotos();

// Check to see if scrolling near bottom of page and current photos has loaded,
// then Load More Photos
window.addEventListener('scroll',() => {
  if(window.pageYOffset + window.innerHeight >= getPageHeight() - window.innerHeight && isPhotosDisplayed) {
    fetchPhotos();
    isPhotosDisplayed = false;
  }
})

// Get the height of whole page
function getPageHeight() {
  return Math.max(
    document.body.scrollHeight,document.documentElement.scrollHeight,
    document.body.offsetHeight,document.documentElement.offsetHeight,
    document.body.clientHeight,document.documentElement.clientHeight
  )
}

// Do something if the first array of photos loaded
function initialLoaded() {
  isInitialLoad = false;
  loader.hidden = true;
  count = 20;
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
}

// Do something if an photo is loaded
function photoLoaded() {
  photosLoadedNum++;
  // all photos are loaded in once fetch
  if(photosLoadedNum === photosNum) {
    loaderBottom.hidden = true;
    displayPhotos();
    isPhotosDisplayed = true;
    if (isInitialLoad) initialLoaded();
  }
}

// Get photos from Unsplash API
async function fetchPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();

    photosNum = photosArray.length;
    photosLoadedNum = 0;
    loaderBottom.hidden = isInitialLoad ? true : false;
    createPhotos();
  } catch (error) {
    console.log(error);
  }
}

// Create Elements For Links & Photos
function createPhotos() {
  // Run function for each object in photosArray
  photosArray.forEach((photoObj) => {
    // Create <a> to link to unsplash
    const photoAnchor = document.createElement("a");
    setAttributes(photoAnchor,{
      href: photoObj.links.html,
      target: '_blank'
    });

    // Create <img> for photo
    const photoElem = document.createElement("img");
    setAttributes(photoElem, {
      src: photoObj.urls.regular,
      alt: photoObj.description
    });
    photoElem.addEventListener("load",photoLoaded);

    photoAnchor.append(photoElem);
    photoAnchors.push(photoAnchor);
  })
}

// Add all <a> and <img> elements to DOM
function displayPhotos() {
  imageContainer.append(...photoAnchors);
}

function setAttributes(element,attributes) {
  for (let key in attributes) {
    element.setAttribute(key,attributes[key]);
  }
}

