// import React, { createRef, useEffect, useRef } from 'react';
// import './Slider.scss';

// const Slider = ({imgWidth, imgHeight}) => {
//     const slidesUrls = [
//             {url: 'https://www.sunchemical.com/wp-content/uploads/2019/07/SunWave_banner-1200x400.jpg'},
//             {url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPuUErrrIAbhJWNbw-taT2n5SqTHHPAdjPS6Nd8eGJhsYOmZ1sEHICT8QkN5EbEL0XWVo&usqp=CAU'},
//             {url: 'https://www.mapix.com/wp-content/uploads/2018/04/1200x400.png'},
//             {url: 'https://sinctech.com/wp-content/uploads/2017/07/placeholder-1200x400.png'}
//         ], //slider_item
//         slidesWrapper = useRef(null), 
//         slidesField = useRef(null), 
//         slider = useRef(null), 
//         dotWrapper = useRef(null), 
//         slides = useRef(slidesUrls.map(() => createRef())),
//         dots = useRef(slidesUrls.map(() => createRef()));

//     let slideIndex = 1, offset = 0, toSlide = 1,
//         width = '';

//     useEffect(() => {
//         width = replaceWords(window.getComputedStyle(slidesWrapper.current).width);
//         fixSlideSize();
//         fixOffset();
        
//         window.addEventListener('resize', fixOffset);

//         colorCurDot();
        
//         slidesField.current.style.width = 100 * slidesUrls.length + '%';

//         return () => window.removeEventListener('resize', fixOffset);
//     }, []);

//     const nextBtnClicked = () => {
//         toRight();
//         if (slideIndex < slidesUrls.length) {
//             slideIndex++;
//         } else {
//             slideIndex = 1;
//         }
//         colorCurDot();
//     };

//     const prevBtnClicked = () => {
//         toLeft();
//         if (slideIndex > 1) {
//             slideIndex--;
//         } else {
//             slideIndex = slidesUrls.length;
//         }
//         colorCurDot();
//     };

//     function toRight() {
//         if (offset == width * (slidesUrls.length - 1)) {
//             offset = 0;
//         } else {
//             offset += width * toSlide;
//         }
//         slidesField.current.style.transform = `translateX(-${offset}px)`;
//     }

//     function toLeft() {
//         if (offset === 0) {
//             offset = width * (slidesUrls.length - 1) * toSlide;
//         } else {
//             offset -= width * toSlide;
//         }
//         slidesField.current.style.transform = `translateX(-${offset}px)`;
//     }

//     function goToSlideByDot(dotIndex) {
//         toSlide = Math.abs(dotIndex - slideIndex);
//         if (dotIndex < slideIndex) {
//             slideIndex = dotIndex;
//             toLeft();
//         } else if (dotIndex > slideIndex) {
//             slideIndex = dotIndex;
//             toRight();
//         }
//         toSlide = 1;
//         colorCurDot();
//     }

//     function colorCurDot() {
//         dots.current.forEach(({current}) => {
//             current.style.background = "none";
//         });
//         dots.current[slideIndex - 1].current.style.background = "#fdc84b";
//     }

//     function fixSlideSize() {
//         slides.current.forEach(({current}) => {
//             current.style.width = `${width}px`;
//         });
//     }

//     function fixSliderHeight() {
//         slider.current.style.height = `${width/(imgWidth/imgHeight)}px`;
//     }

//     function fixOffset() {
//         let temp = width;
//         width = replaceWords(window.getComputedStyle(slidesWrapper.current).width);
//         fixSlideSize();
//         fixSliderHeight();
//         if (width > temp) {
//             offset += (slideIndex - 1) * Math.abs(width - temp);
//         } else if (width < temp) {
//             offset -= (slideIndex - 1) * Math.abs(width - temp);
//         }
//         slidesField.current.style.transform = `translateX(-${offset}px)`;
//     }

//     function replaceWords(element) {
//         let lastNumIndexInWidth = element.length - element.split('').reverse().join('').search(/\d/);
//         return Math.round(+element.split('').splice(0, lastNumIndexInWidth).join(''));
//     }

//     return (
//         <div className="slider" ref={slider}>
//             <div className="container" ref={slidesWrapper}>
//                 <div className="track" ref={slidesField}>
//                     {
//                         slidesUrls.map(({url}, i) => <div key={i} ref={slides.current[i]} className="item"><img src={url} alt=""/></div>)
//                     }
//                 </div>
//             </div>
//             <div className="btn_prev" onClick={prevBtnClicked}></div>
//             <div className="btn_next" onClick={nextBtnClicked}></div>
//             <div className="dot-wrapper" ref={dotWrapper}>
//                 {
//                     slidesUrls.map((_, i) => <div className='slider-dot' ref={dots.current[i]} key={i} onClick={() => goToSlideByDot(i+1)}></div>)
//                 }
//             </div>
//         </div>
//     );
// };

// export default Slider;