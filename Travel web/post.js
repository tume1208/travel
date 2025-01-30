document.addEventListener('DOMContentLoaded', () => {
    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            const postSection = document.getElementById('postSection');
            const fullScreenVideo = document.getElementById('fullScreenVideo');
            const fullScreenVideoElement = document.querySelector('.full-screen-video-element');
            const backArrow = document.querySelector('.back-arrow');
            let currentVideoIndex = 0;

            data.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                const postHeader = `
                    <div class="post-header">
                        <img src="${post.profilePicture}" alt="Profile Picture" class="profile-picture">
                        <span class="username">${post.username}</span>
                    </div>
                `;

                const postMedia = post.post_video ? `
                    <div class="post-media">
                        <video class="post-video" autoplay muted loop playsinline>
                            <source src="${post.post_video}" type="video/mp4">
                        </video>
                    </div>
                ` : post.image_url ? `
                    <div class="post-media">
                        <img src="${post.image_url}" alt="Post Image" class="post-image" loading="lazy">
                    </div>
                ` : '';

                const postCaption = `
                    <div class="post-caption">
                        <p>${post.caption}</p>
                    </div>
                `;

                const postActions = `
                    <div class="post-actions">
                        <span class="material-icons">favorite_border</span>
                        <span class="material-icons">share</span>
                        <span class="material-icons">comment</span>
                    </div>
                `;

                const postDetails = `
                    <div class="post-details">
                        <span class="location">${post.location}</span>
                        <span class="created-at">${post.created_at}</span>
                        <span class="agency">${post.agency}</span>
                    </div>
                `;

                postElement.innerHTML = postHeader + postMedia + postCaption + postActions + postDetails;
                postSection.appendChild(postElement);

                // Add click event to enlarge video
                if (post.post_video) {
                    const videoElement = postElement.querySelector('.post-video');
                    videoElement.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default controls
                        currentVideoIndex = index;
                        fullScreenVideoElement.src = post.post_video;
                        fullScreenVideoElement.controls = false; // Remove unnecessary controls
                        fullScreenVideoElement.autoplay = true; // Ensure autoplay
                        fullScreenVideoElement.muted = true; // Mute the video
                        fullScreenVideoElement.loop = true; // Loop the video
                        fullScreenVideoElement.playsinline = true; // Ensure inline playback
                        fullScreenVideoElement.load(); // Load the video
                        fullScreenVideoElement.addEventListener('loadedmetadata', () => {
                            fullScreenVideoElement.play(); // Autoplay the video
                        });
                        fullScreenVideo.style.display = 'flex';
                    });
                }
            });

            // Add event listener to back arrow
            backArrow.addEventListener('click', () => {
                fullScreenVideo.style.display = 'none';
                fullScreenVideoElement.pause();
            });

            // Add event listener for sliding through videos
            fullScreenVideo.addEventListener('click', (event) => {
                const modalWidth = fullScreenVideo.offsetWidth;
                const clickX = event.clientX;
                if (clickX > modalWidth / 2) {
                    // Slide to next video
                    currentVideoIndex = (currentVideoIndex + 1) % data.length;
                } else {
                    // Slide to previous video
                    currentVideoIndex = (currentVideoIndex - 1 + data.length) % data.length;
                }
                const nextVideo = data[currentVideoIndex];
                if (nextVideo.post_video) {
                    fullScreenVideoElement.src = nextVideo.post_video;
                    fullScreenVideoElement.load(); // Load the video
                    fullScreenVideoElement.addEventListener('loadedmetadata', () => {
                        fullScreenVideoElement.play(); // Autoplay the video
                    });
                }
            });

            // Add touch event listeners for mobile users
            fullScreenVideo.addEventListener('touchstart', handleTouchStart, { passive: true });
            fullScreenVideo.addEventListener('touchmove', handleTouchMove, { passive: true });

            let xDown = null;
            let yDown = null;

            function handleTouchStart(evt) {
                const firstTouch = evt.touches[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            }

            function handleTouchMove(evt) {
                if (!xDown || !yDown) {
                    return;
                }
                const xUp = evt.touches[0].clientX;
                const yUp = evt.touches[0].clientY;
                const xDiff = xDown - xUp;
                const yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0) {
                        // Slide to next video
                        currentVideoIndex = (currentVideoIndex + 1) % data.length;
                    } else {
                        // Slide to previous video
                        currentVideoIndex = (currentVideoIndex - 1 + data.length) % data.length;
                    }
                    const nextVideo = data[currentVideoIndex];
                    if (nextVideo.post_video) {
                        fullScreenVideoElement.src = nextVideo.post_video;
                        fullScreenVideoElement.load(); // Load the video
                        fullScreenVideoElement.addEventListener('loadedmetadata', () => {
                            fullScreenVideoElement.play(); // Autoplay the video
                        });
                    }
                }
                xDown = null;
                yDown = null;
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
});
