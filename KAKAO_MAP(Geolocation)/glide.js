new Glide('.glide', {
  type: 'carousel',
  focusAt: 'center',
  perView: 2,
  gap: 40,
  keyboard: true,
  peek: {
    before: 10,
    after: 10,
  },
}).mount();

function focusOnActiveCard() {
  let glideSlides = document.querySelectorAll('.glide_slide');
  glideSlides.forEach(function (slide) {
    //glide__slide--active인 경우
    if (slide.classList.contains('glide__slide--active')) {
      slide.style.filter = 'blur(0)';
    } else {
      //glide__slide--active가 아닌 경우
      slide.style.filter = 'blur(2px)';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // glide_slide 클래스가 glide_slide glide__slide--active 클래스로 변경되는 이벤트 감지
  document.querySelector('.glide').addEventListener('transitionend', function () {
    // glide_slide 클래스가 glide_slide glide__slide--active 클래스로 변경될 때 특정 CSS를 적용하는 함수 호출
    focusOnActiveCard();
  });
});
