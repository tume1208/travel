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
    return sliderContainer;
};
