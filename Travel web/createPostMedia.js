// createPostMedia.js
export const createPostMedia = (post) => {
    const sliderContainer = document.createElement('div');
    sliderContainer.classList.add('slider-container');

    const slider = document.createElement('div');
    slider.classList.add('slider');

    post.media.forEach(media => {
        if (media.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.dataset.src = media;
            video.autoplay = true;
            video.muted = true;
            video.classList.add('post-video', 'lazy');
            video.controls = false;

            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                video.muted = !video.muted;
            });

            video.addEventListener('error', () => console.error('Failed to load video:', media));
            slider.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.dataset.src = media;
            img.classList.add('lazy');
            img.addEventListener('error', () => console.error('Failed to load image:', media));
            slider.appendChild(img);
        }
    });

    sliderContainer.appendChild(slider);

    // Swiping functionality
    let currentIndex = 0;
    const totalImages = slider.children.length;
    let startX, currentX, isDragging = false;

    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function goToNextImage() {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
            updateSliderPosition();
        }
    }

    function goToPrevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    }

    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        isDragging = true;
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].pageX;
        const diffX = startX - currentX;
        if ((currentIndex === 0 && diffX < 0) || (currentIndex === totalImages - 1 && diffX > 0)) {
            return;
        }
        slider.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diffX}px))`;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        isDragging = false;
        const endX = e.changedTouches[0].pageX;
        const diffX = startX - endX;

        if (diffX > 50 && currentIndex < totalImages - 1) {
            goToNextImage();
        } else if (diffX < -50 && currentIndex > 0) {
            goToPrevImage();
        } else {
            updateSliderPosition();
        }
    });

    return sliderContainer;
};
