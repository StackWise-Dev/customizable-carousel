// SELECTION OF ALL ELEMENTS
let stackCarousel = document.querySelector(".stack-carousel-section");
let carousel = document.querySelector(".stack-carousel-track");
let firstChildWidth = carousel.querySelector(".carousel-cell").offsetWidth;
let buttonsBlock = document.querySelector(".buttons-block");
let dotsBlock = document.querySelector(".carousel-dots");
let carouselButtons = document.querySelectorAll(".carousel-btn");
let carouselConfig = JSON.parse(carousel.dataset?.carouselConfig) || {};
let carouselCell = [...carousel.children];

// DECLARING ESSENTIAL VRIABLES
let isDragging = false, 
    scrollFlag = true,
    startX, 
    dotIndex = 0, 
    startScrollLeft, 
    startClientX,
    timeVariable, 
    allDots;
dotsBlock.setAttribute("data-count", carousel.children.length);

// COPY THE FIRST SLIDES AND ADD TO END AND LAST SLIDES TO ADD AT THE BEGINNING
let slidesToShow = Math.round(carousel.offsetWidth / firstChildWidth);
carouselCell.slice(-slidesToShow).reverse().forEach((element) => {
    carousel.insertAdjacentHTML("afterbegin", element.outerHTML);
});
carouselCell.slice(0, slidesToShow).forEach((element) => {
    carousel.insertAdjacentHTML("beforeend", element.outerHTML);
});

// WHEN YOU START DRAGGING WITH MOUSE OR TOUCH
function dragStart(e) {
    e.preventDefault();
    isDragging = true;
    scrollFlag = false;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
    startClientX = e.x;
};
function dragging(e) {
    if(!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};
function dragEnd(e) {
    isDragging = false;
    carousel.classList.remove("dragging");
    // THIS IS TO MAINTAIN THE DOTS MOVEMENT ALONG THE SCROLL
    // ADDED THIS LOGIC BECAUSE NEXT AND PREV BUTTON ALSO INCREASE THE DOTS VALUE
    if(!scrollFlag) {
        if(startClientX > e.x) {
            dotIndex++;
            carouselDotsTracker(dotIndex);
        } else {
            dotIndex--;
            carouselDotsTracker(dotIndex);
        }
        scrollFlag = true;
    }
};

carouselButtons.forEach((button) => {
    button.addEventListener("click", function() {
        carousel.scrollLeft += button.id === 'right' ? firstChildWidth : -firstChildWidth;
        if(button.id === 'right') {
            dotIndex++;
            carouselDotsTracker(dotIndex);
        } else {
            dotIndex--;
            carouselDotsTracker(dotIndex);
        } 
    });
});

// FOR INIFINITE SCROLL OF THE SLIDER
function infiniteScroll() {
    // RESET THE SLIDER WHEN REACH TO START AND END
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("removeTransition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("removeTransition");
    } else if(Math.ceil(carousel.scrollLeft) === (carousel.scrollWidth - carousel.offsetWidth)) {
        carousel.classList.add("removeTransition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("removeTransition");
    } 
}

// THIS FUNCTION TRACK THE TIME AND CHANGE SLIDER AFTER SECONDS THE USER HAS CHOOSEN
let timeTracker = () => {
    // THIS IS FOR SLIDER CONFIGURATIONS SET BY THE USER
    if(carouselConfig) {
        if(carouselConfig.slidesToShow) {
            carousel.style.gridAutoColumns = `calc((100% / ${carouselConfig?.slidesToShow || 3}) - 14px)`;
        }
        if(carouselConfig.isButtons) {
            buttonsBlock.style.display = "flex"
            buttonsBlock.classList.add(carouselConfig?.buttonsPosition || 'center')
        }
        if(carouselConfig.isDots) {
            dotsBlock.innerHTML = "";
            for(let i = 0; i < dotsBlock.dataset.count; i++) {
                let dot = document.createElement("span");
                dot.classList.add("carousel-dot");
                dotsBlock.appendChild(dot);
            }
            // THIS LOGIC IS TO BUILD THE DOTS AND PERFORM ONCLICK OPERATION ON DOTS
            allDots = document.querySelectorAll(".carousel-dot");
            allDots.forEach((dot, index) => {
                dot.addEventListener("click", function() {
                    dotIndex++;
                    if (index < dotIndex) {
                        carousel.scrollLeft -= firstChildWidth * (dotIndex - (index + 1));
                    } else {
                        carousel.scrollLeft += firstChildWidth * ((index + 1) - dotIndex);
                    }
                    dotIndex = index;
                    carouselDotsTracker(dotIndex);
                });
            });
        }   
    }
    // THIS IS FOR SLIDER TIMER
    if(window.innerWidth < 800 || !carouselConfig?.isAutoPlay) return;
    timeVariable = setInterval(() => {
        carousel.scrollLeft += firstChildWidth; 
        dotIndex++;
        carouselDotsTracker(dotIndex); 
    }, carouselConfig?.carouselDelay || 3000);
}
timeTracker();

// TRACK THE CURRENT DOT AND HIGHLIGHT IT
function carouselDotsTracker(index) {
    allDots.forEach(dot => dot.classList.remove("active"));
    if(index === Number(dotsBlock.dataset.count)) {
        dotIndex = index = 0;
    }
    if(index < 0) {
        dotIndex = index = Number(dotsBlock.dataset.count) - 1;
    } 
    allDots[index].classList.add("active");
}
carouselDotsTracker(dotIndex);

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragEnd);
carousel.addEventListener("scroll", infiniteScroll);
// STOP AND START CAROUSEL ON MOUSE ENTER AND LEAVE
stackCarousel.addEventListener("mouseenter", () => clearInterval(timeVariable));
stackCarousel.addEventListener("mouseleave", () => {
    timeTracker();
    carouselDotsTracker(dotIndex);
});
