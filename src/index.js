import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageApiService from './js/getImage';
import createMarkupForOneElement from './js/createImageCard';
import LoadMoreBtn from './js/loadMoreBtn';



Notify.init({
  width: '400px',
  distance: '50px',
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade',
  borderRadius: '10px',
  position: 'center-top',
  closeButton: false,
  timeout: 1500,
  // backOverlay: true,
  // backOverlayColor: 'rgba(117, 117, 117, 1)',
  failure: {
    background: '#2196f3',
  },
});

const galleryWrapper = document.querySelector('.gallery');
const gallery = new SimpleLightbox('.gallery a', {captions: false});
const form = document.getElementById("search-form");
const searchInput = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-button');
const imageApiService = new ImageApiService;
const loadMoreBtn = new LoadMoreBtn ({
  selector: ".load-more",
  isHidden: true,
});


form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", fetchImages);


function onSubmit(e){
  e.preventDefault();
 
  const form = e.currentTarget;
  const query = form.elements.searchQuery.value.trim();

  imageApiService.searchQuery = query;

  imageApiService.resetPage();
  clearPage();
  loadMoreBtn.show();
  fetchImages().finally(() => form.reset())
};

async function fetchImages() {
  loadMoreBtn.hide();
    try {  
       const data = await imageApiService.getImages();
    const totalHits = data.totalHits;
    console.log(data);
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      loadMoreBtn.hide();
      throw new Error('No data')
    }
    
   const images = data.hits;

    const  murkup =  images.reduce(
    (murkup, image) => 
   createMarkupForOneElement(image) + murkup,
   ""
   );    
   appendImageCards(murkup);

   gallery.refresh();
   loadMoreBtn.show();
   loadMoreBtn.enable();

  if(galleryWrapper.childElementCount === totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide()
  } else if(galleryWrapper.childElementCount <= 40) {
    Notify.info(`Hooray! We found ${totalHits} images`);
  } 
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  } catch (error) {
    console.error(error)
  }
}



function clearPage() {
  galleryWrapper.innerHTML = '';
}

function appendImageCards(markup) {
  galleryWrapper.insertAdjacentHTML("beforeend", markup);
}