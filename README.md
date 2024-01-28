# Customizable Carousel Using Vanilla JS

> [!NOTE]
> This code is free and you can download it and use it in your projects. 

> [!IMPORTANT]
> Please give a star for this free code and follow me for more amazing content. [@StackWiseDev](https://www.youtube.com/@stackwisedev)

This is a simple carousel created using simple vanilla js and you can modify the code very easily. This code accepts configurations like show dots and carousel buttons, set the duration of carousel, how many slides to show.

### Configurations Object of Carousel 
You can change these configurations accordingly and can add more of your choice. Add these configurations on `stack-carousel-track` div in the carousel in `data-carousel-config` property.

```JSON
{
    "isAutoPlay": true, 
    "carouselDelay": 3000, 
    "slidesToShow": 3, 
    "isButtons": true, 
    "isDots": true, 
    "buttonsPosition": "center"
}
```

Follow me if you like it...
This carousel takes too much time to build the logic so make sure to leave a star for it and also you can find me on youtube [@StackWiseDev](https://www.youtube.com/@stackwisedev) .

## For REACT you can use the below code
```javascript
import React, { useEffect, useRef, useState } from "react";
import CarouselCell from "./CarouselCell";

const carouselConfig = {
  "isAutoPlay": true, 
  "carouselDelay": 3000, 
  "slidesToShow": 3, 
  "isButtons": true, 
  "isDots": true, 
  "buttonsPosition": "center"
}

function Carousel() {

  let carouselRef = useRef(null);
  let firstChildRef = useRef(null);
  let dotsRef = useRef(null);
  let [isDragging, setIsDragging] = useState(false);
  let [scrollFlag, setScrollFlag] = useState(true);
  let [startX, setStartX] = useState(null);
  let [startScrollLeft, setStartScrollLeft] = useState(null);
  let [dotIndex, setDotIndex] = useState(0);
  let timeVariable = useRef();

  useEffect(() => {
    let carousel = carouselRef.current;
    let carouselCell = Array.from(carousel.children);
    carouselCell.slice(-carouselConfig.slidesToShow).reverse().forEach((element) => {
      carousel.insertAdjacentHTML("afterbegin", element.outerHTML);
    });
    carouselCell.slice(0, carouselConfig.slidesToShow).forEach((element) => {
      carousel.insertAdjacentHTML("beforeend", element.outerHTML);
    });
    if(carouselConfig.isDots) {
      dotsRef.current.innerHTML = "";
      for (let i = 0; i < carouselCell.length; i++) {
        let dot = document.createElement("span");
        dot.classList.add("carousel-dot");
        dotsRef.current.appendChild(dot);
      };
      dotsClickAction(Array.from(dotsRef.current.children));
    }
    carouselDotsTracker(dotIndex++);
  }, []);

  useEffect(() => {
    intervalTracker();
    return () => {
      clearInterval(timeVariable.current);
    }
  }, [dotIndex]);
  function intervalTracker() {
    timeVariable.current = setInterval(() => {
      carouselRef.current.scrollLeft += firstChildRef.current.offsetWidth;
      setDotIndex(prev => prev + 1);
      carouselDotsTracker(dotIndex + 1);
    }, carouselConfig.carouselDelay);
  }

  // TRACK THE CURRENT DOT AND HIGHLIGHT IT
  async function carouselDotsTracker(index) {
    let dots = dotsRef.current;
    if(!dots) return;
    Array.from(dots.children).forEach((dot) => dot.classList.remove("active"));
    if (index === dots.children.length) {
      index = 0;
      setDotIndex(prev => prev = 0);
    }
    if (index < 0) {
      index = dots.children.length - 1;
      setDotIndex(dots.children.length - 1);
    }
    dots.children[index].classList.add("active");
  }

  // FUNCTIONALITY FOR DOTS CLICK
  function dotsClickAction(nodes) {
    nodes.forEach((node, index) => {
      node.addEventListener("click", function() {
        if (index < index + 1) {
          carouselRef.current.scrollLeft -= firstChildRef.current.offsetWidth * (dotIndex - (index + 1));
        } else {
          carouselRef.current.scrollLeft += firstChildRef.current.offsetWidth * (index + 1 - dotIndex);
        }
        setDotIndex(index)
        carouselDotsTracker(index);
      });
    });
  }

  // WHEN YOU START DRAGGING WITH MOUSE OR TOUCH
  function dragStart(e) {
    e.preventDefault();
    setIsDragging(true);
    setScrollFlag(false);
    setStartX(e.pageX);
    setStartScrollLeft(carouselRef.current.scrollLeft);
  }
  function dragging(e) {
    if (!isDragging) return;
    carouselRef.current.scrollLeft = startScrollLeft - (e.pageX - startX);
  }
  function dragEnd(e) {
    setIsDragging(false);
    // THIS IS TO MAINTAIN THE DOTS MOVEMENT ALONG THE SCROLL
    // ADDED THIS LOGIC BECAUSE NEXT AND PREV BUTTON ALSO INCREASE THE DOTS VALUE
    if (!scrollFlag) {
      if (startX > e.pageX) {
        setDotIndex(prevIndex => prevIndex + 1);
        carouselDotsTracker(dotIndex + 1);
      } else {
        setDotIndex(prevIndex => prevIndex - 1);
        carouselDotsTracker(dotIndex - 1);
      }
      scrollFlag = true;
    }
  }

  // FOR INIFINITE SCROLL OF THE SLIDER
  function infiniteScroll() {
    // RESET THE SLIDER WHEN REACH TO START AND END
    if (carouselRef.current.scrollLeft === 0) {
      carouselRef.current.classList.add("removeTransition");
      carouselRef.current.scrollLeft = carouselRef.current.scrollWidth - 2 * carouselRef.current.offsetWidth;
      carouselRef.current.classList.remove("removeTransition");
    } else if (
      Math.ceil(carouselRef.current.scrollLeft) ===
      carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
    ) {
      carouselRef.current.classList.add("removeTransition");
      carouselRef.current.scrollLeft = carouselRef.current.offsetWidth;
      carouselRef.current.classList.remove("removeTransition");
    }
  };

  // SLIDE CAROUSEL USING BUTTONS
  function slideCarousel(e) {
    carouselRef.current.scrollLeft += e.target.id === "right" ? firstChildRef.current.offsetWidth : -firstChildRef.current.offsetWidth;
    if (e.target.id === "right") {
      setDotIndex(prevIndex => prevIndex + 1);
      carouselDotsTracker(dotIndex + 1);
    } else {
      setDotIndex(prevIndex => prevIndex - 1);
      carouselDotsTracker(dotIndex - 1);
    }
  }

  // STOP CAROUSEL ON ENTER THE CAROUSEL
  function stopCarousel() {
    clearInterval(timeVariable.current);
  }

  // START CAROUSEL WHEN MOVE OUT OF THE CAROUSEL
  function startCarousel() {
    intervalTracker();
    carouselDotsTracker(dotIndex);
  }

  return (
    <section className="stack-carousel-section"
      onMouseUp={dragEnd}
      onMouseEnter={stopCarousel}
      onMouseLeave={startCarousel} >
        <div className="stack-carousel-block">
            <div className={`stack-carousel-track ${isDragging ? 'dragging': ''}`}
              onMouseDown={dragStart}
              onMouseMove={dragging}
              onScroll={infiniteScroll}
              ref={carouselRef} 
              style={{gridAutoColumns: `calc((100% / ${carouselConfig.slidesToShow}) - 14px)`}}>
              <CarouselCell ref={firstChildRef} src="/src/assets/imageone.jpg" heading="The Beaf Steaks" subheading="Fresh Crispy Beaf Steaks with Salad." content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima pariatur unde animi asperiores doloribus? Facilis quaerat mollitia molestias iure reprehenderit quasi ullam delectus! Architecto hic eius quae perspiciatis, quis possimus!" />
              <CarouselCell src="/src/assets/imagetwo.jpg" heading="Crispy Chicken Jal Freeze" subheading="Chicken Jal Freeze with Sauce & Salad." content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima pariatur unde animi asperiores doloribus? Facilis quaerat mollitia molestias iure reprehenderit quasi ullam delectus! Architecto hic eius quae perspiciatis, quis possimus!" />
              <CarouselCell src="/src/assets/imagethree.jpg" heading="Simple 0 Masala Noodles" subheading="No Masala Chinese Vegetables Noodles." content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima pariatur unde animi asperiores doloribus? Facilis quaerat mollitia molestias iure reprehenderit quasi ullam delectus! Architecto hic eius quae perspiciatis, quis possimus!" />
              <CarouselCell src="/src/assets/imagefour.jpg" heading="Yummy Burger" subheading="Kabab & Salad fully Loaded Burger." content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima pariatur unde animi asperiores doloribus? Facilis quaerat mollitia molestias iure reprehenderit quasi ullam delectus! Architecto hic eius quae perspiciatis, quis possimus!" />
              <CarouselCell src="/src/assets/imagefive.jpg" heading="Icecream Scoopes" subheading="Deliciouse Icecream Scoopes with Chocolate." content="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima pariatur unde animi asperiores doloribus? Facilis quaerat mollitia molestias iure reprehenderit quasi ullam delectus! Architecto hic eius quae perspiciatis, quis possimus!" />
            </div>
        </div>
        <div className="carousel-dots" ref={dotsRef}></div>
        <div className={`buttons-block ${carouselConfig.isButtons ? carouselConfig.buttonsPosition: 'center'}`} style={{ display: carouselConfig.isButtons ? 'flex': 'none'}}>
            <button type="button" onClick={slideCarousel} id="left" className="carousel-btn">{'<'}</button>
            <button type="button" onClick={slideCarousel} id="right" className="carousel-btn">{'>'}</button>
        </div>
    </section>

  );
}

export default Carousel;

```
