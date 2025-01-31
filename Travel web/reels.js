document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentVideoIndex = parseInt(urlParams.get('index'), 10);
    const fullScreenVideoElement = document.querySelector('.full-screen-video-element');
    const backArrow = document.querySelector('.back-arrow');
    const profilePicture = document.querySelector('.profile-picture');
    const username = document.querySelector('.username');
    const likeCount = document.querySelector('.like-count');

    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            let currentIndex = currentVideoIndex;

            function loadVideo(index) {
                const post = data[index];
                if (post.post_video) {
                    fullScreenVideoElement.src = post.post_video;
                    fullScreenVideoElement.load();
                    fullScreenVideoElement.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default controls
                        fullScreenVideoElement.play().catch(error => {
                            console.error('Error playing video:', error);
                        });
                    }, { once: true });
                    // Remove default controls
                    fullScreenVideoElement.controls = false;

                    // Update profile info and like count
                    profilePicture.src = post.profilePicture;
                    username.textContent = post.username;
                    likeCount.textContent = post.likes;
                }
            }

            loadVideo(currentIndex);

            // Add event listener to back arrow
            backArrow.addEventListener('click', () => {
                window.history.back();
            });

            // Add event listener for scrolling through videos
            document.addEventListener('wheel', (event) => {
                if (event.deltaY > 0) {
                    // Scroll down to next video
                    currentIndex = (currentIndex + 1) % data.length;
                } else {
                    // Scroll up to previous video
                    currentIndex = (currentIndex - 1 + data.length) % data.length;
                }
                loadVideo(currentIndex);
                fullScreenVideoElement.play().catch(error => {
                    console.error('Error playing video:', error);
                });
            });

            // Add touch event listeners for mobile users
            fullScreenVideoElement.addEventListener('touchstart', handleTouchStart, { passive: true });
            fullScreenVideoElement.addEventListener('touchmove', handleTouchMove, { passive: true });

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

                if (Math.abs(yDiff) > Math.abs(xDiff)) {
                    if (yDiff > 0) {
                        // Swipe up to next video
                        currentIndex = (currentIndex + 1) % data.length;
                    } else {
                        // Swipe down to previous video
                        currentIndex = (currentIndex - 1 + data.length) % data.length;
                    }
                    loadVideo(currentIndex);
                    fullScreenVideoElement.play().catch(error => {
                        console.error('Error playing video:', error);
                    });
                }
                xDown = null;
                yDown = null;
            }
        })
        .catch(error => console.error('Error fetching posts:', error));

    // Redirect to index.html on refresh
    window.addEventListener('beforeunload', (event) => {
        window.location.href = 'index.html';
    });
});
