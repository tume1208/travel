document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('posts.json').then(response => response.json()),
        fetch('post_interactions.json').then(response => response.json())
    ])
    .then(([posts, postInteractions]) => {
        const postSection = document.getElementById('postSection');

        posts.forEach(post => {
            const postElement = document.createElement('div'); // Add this line to define postElement
            postElement.classList.add('post');

            const interaction = postInteractions.find(i => i.post_id === post.post_id);

            const profilePicture = document.createElement('img');
            profilePicture.src = post.profilePicture;
            profilePicture.alt = `${post.username}'s profile picture`;
            profilePicture.classList.add('profile-picture');

            const username = document.createElement('span');
            username.textContent = post.username;
            username.classList.add('username');

            const header = document.createElement('div');
            header.appendChild(profilePicture);
            header.appendChild(username);

            const caption = document.createElement('p');
            caption.textContent = post.caption;
            caption.classList.add('caption');
            if (post.caption.length > 250) {
                caption.classList.add('collapsed');
            }

            caption.addEventListener('click', () => {
                caption.classList.toggle('collapsed');
            });

            const sliderContainer = document.createElement('div');
            sliderContainer.classList.add('slider-container');

            const slider = document.createElement('div');
            slider.classList.add('slider');

            post.media.forEach(media => {
                if (media.endsWith('.mp4')) {
                    const video = document.createElement('video');
                    video.src = media;
                    video.autoplay = true;
                    video.muted = true;
                
                    // Apply class to main video posts
                    video.classList.add('post-video');
                    
                    // Remove default controls
                    video.controls = false;
                
                    // Unmute when the video is clicked
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
                    img.src = media;
                    img.addEventListener('error', () => console.error('Failed to load image:', media));
                    slider.appendChild(img);
                }
            });
            
            sliderContainer.appendChild(slider);

            const icons = document.createElement('div');
            icons.classList.add('post-icons');

            const leftIcons = document.createElement('div');
            leftIcons.classList.add('post-left-icons');

            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fa-regular', 'fa-heart', 'post-icon');
            const likeCount = document.createElement('span');
            likeCount.textContent = interaction.likes_count;
            likeCount.classList.add('interaction-count');

            const commentIcon = document.createElement('i');
            commentIcon.classList.add('fa-regular', 'fa-comment', 'post-icon');
            const commentCount = document.createElement('span');
            commentCount.textContent = interaction.comments_count;
            commentCount.classList.add('interaction-count');

            const shareIcon = document.createElement('i');
            shareIcon.classList.add('fa-solid', 'fa-share', 'post-icon');
            const shareCount = document.createElement('span');
            shareCount.textContent = interaction.shares_count;
            shareCount.classList.add('interaction-count');

            leftIcons.appendChild(heartIcon);
            leftIcons.appendChild(likeCount);
            leftIcons.appendChild(commentIcon);
            leftIcons.appendChild(commentCount);
            leftIcons.appendChild(shareIcon);
            leftIcons.appendChild(shareCount);

            const saveIcon = document.createElement('i');
            saveIcon.classList.add('fa-regular', 'fa-bookmark', 'post-icon');
            saveIcon.classList.add('post-right-icon');
            const bookmarkCount = document.createElement('span');
            bookmarkCount.textContent = interaction.bookmarks_count;
            bookmarkCount.classList.add('interaction-count');

            icons.appendChild(leftIcons);
            icons.appendChild(saveIcon);
            icons.appendChild(bookmarkCount);

            heartIcon.addEventListener('click', () => {
                heartIcon.classList.toggle('fa-solid');
                heartIcon.classList.toggle('fa-regular');
            });
            
            commentIcon.addEventListener('click', () => {
                // Open a comment input field (if needed) without incrementing the count
            });
            
            shareIcon.addEventListener('click', () => {
                // Perform share action (if needed) without incrementing the count
            });
            
            saveIcon.addEventListener('click', () => {
                saveIcon.classList.toggle('fa-solid');
                saveIcon.classList.toggle('fa-regular');
            });
            

            postElement.appendChild(header);
            postElement.appendChild(sliderContainer);
            postElement.appendChild(icons);
            postElement.appendChild(caption);

            postSection.appendChild(postElement);

            // Add swipe functionality
            let currentIndex = 0;
            const totalImages = slider.children.length;
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
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
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
                    return; // Prevent swiping beyond the first and last images
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
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
});
