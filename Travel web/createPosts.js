// createPosts.js
import { postLazyLoad } from './postLazyLoad.js';
import { createPostComments } from './createPostComments.js';
import { setupPostInteractions } from './postInteractions.js';
import { createPostMedia } from './createPostMedia.js';
import { createPostHeader, createPostIcons } from './createPostElements.js';

export const createPosts = (posts, postInteractions, comments) => {
    const postSection = document.getElementById('postSection');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const interaction = postInteractions.find(i => i.post_id === post.post_id);

        const header = createPostHeader(post);
        const caption = document.createElement('p');
        caption.textContent = post.caption;
        caption.classList.add('caption');
        if (post.caption.length > 250) {
            caption.classList.add('collapsed');
        }

        caption.addEventListener('click', () => {
            caption.classList.toggle('collapsed');
        });

        const sliderContainer = createPostMedia(post);
        const icons = createPostIcons(interaction);

        const commentSection = createPostComments(post, comments);

        postElement.appendChild(header);
        postElement.appendChild(sliderContainer);
        postElement.appendChild(icons);
        postElement.appendChild(caption);
        postElement.appendChild(commentSection);

        postSection.appendChild(postElement);

        setupPostInteractions(postElement, commentSection, overlay);

        let currentIndex = 0;
        const totalImages = sliderContainer.children.length;
        let startX, currentX, isDragging = false;

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

        function updateSliderPosition() {
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
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
            sliderContainer.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diffX}px))`;
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

        // Lazy load all elements including profile pictures and media
        postLazyLoad(postElement.querySelectorAll('img.lazy, video.lazy'), postSection);
    });
};
