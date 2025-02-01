document.addEventListener('DOMContentLoaded', () => {
    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            const postSection = document.getElementById('postSection');

            data.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                const postHeader = `
                    <div class="post-header">
                        <img src="${post.profilePicture}" alt="Profile Picture" class="profile-picture">
                        <span class="username">${post.username}</span>
                        <span class="location">${post.location}</span>
                    </div>
                `;
                const images = document.querySelectorAll('.post-image');
images.forEach(image => {
    image.addEventListener('load', () => {
        console.log('Image loaded:', image.src);
    });
});


                const postMedia = post.media && post.media.length > 1 ? `
                    <div class="post-media carousel">
                        <div class="carousel-inner">
                            ${post.media.map((media, i) => `
                                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                                    ${media.endsWith('.mp4') ? `
                                        <video class="post-video media-element" autoplay muted loop playsinline>
                                            <source src="${media}" type="video/mp4">
                                        </video>
                                    ` : `
                                        <img src="${media}" alt="Post Image" class="post-image media-element" loading="lazy">
                                    `}
                                </div>
                            `).join('')}
                        </div>
                        <div class="dots">
                            ${post.media.map((_, i) => `
                                <span class="dot ${i === 0 ? 'active' : ''}" onclick="currentSlide(${i}, ${index})"></span>
                            `).join('')}
                        </div>
                    </div>
                ` : post.media && post.media.length === 1 ? `
                    <div class="post-media">
                        ${post.media[0].endsWith('.mp4') ? `
                            <video class="post-video media-element" autoplay muted loop playsinline>
                                <source src="${post.media[0]}" type="video/mp4">
                            </video>
                        ` : `
                            <img src="${post.media[0]}" alt="Post Image" class="post-image media-element" loading="lazy">
                        `}
                    </div>
                ` : '';

                const postActions = `
                    <div class="post-actions">
                        <div class="left-icons">
                            <span class="material-icons">favorite_border</span>
                            <span class="material-icons">comment</span>
                            <span class="material-icons">share</span>
                        </div>
                        <div class="right-icons">
                            <span class="material-icons">bookmark_border</span>
                        </div>
                    </div>
                `;

                const postCaption = `
                    <div class="post-caption">
                        <p>${post.caption}</p>
                    </div>
                `;

                // Calculate the time difference
                const postDate = new Date(post.created_at);
                const now = new Date();
                const timeDiff = now - postDate;
                let timeAgo;

                if (timeDiff < 60 * 60 * 1000) { // Less than an hour
                    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
                    timeAgo = `${minutesAgo} minutes ago`;
                } else if (timeDiff < 24 * 60 * 60 * 1000) { // Less than a day
                    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                    timeAgo = `${hoursAgo} hours ago`;
                } else { // More than a day
                    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    timeAgo = `${daysAgo} days ago`;
                }

                const postDetails = `
                    <div class="post-details">
                        <span class="created-at">${timeAgo}</span>
                        <span class="agency">${post.agency}</span>
                    </div>
                `;

                postElement.innerHTML = postHeader + postMedia + postCaption + postActions + postDetails;
                postSection.appendChild(postElement);

                // Add click event to redirect to reels.html for single video posts
                if (post.media && post.media.length === 1 && post.media[0].endsWith('.mp4')) {
                    const videoElement = postElement.querySelector('.post-video');
                    videoElement.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default controls
                        localStorage.setItem('autoPlay', 'true');
                        localStorage.setItem('videoSrc', videoElement.querySelector('source').src);
                        window.location.href = `reels.html?index=${index}`;
                    });
                }

                // Add swipe functionality for carousel
                const carousel = postElement.querySelector('.carousel');
                if (carousel) {
                    let startX = 0;
                    let endX = 0;

                    carousel.addEventListener('touchstart', (event) => {
                        startX = event.touches[0].clientX;
                    }, { passive: true });

                    carousel.addEventListener('touchmove', (event) => {
                        endX = event.touches[0].clientX;
                    }, { passive: true });

                    carousel.addEventListener('touchend', () => {
                        if (startX > endX + 50) {
                            changeSlide(1, index); // Swipe left
                        } else if (startX < endX - 50) {
                            changeSlide(-1, index); // Swipe right
                        }
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});

function changeSlide(n, index) {
    const carousel = document.querySelectorAll('.carousel')[index];
    if (!carousel) return;
    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.dot');
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

    items[activeIndex].classList.remove('active');
    dots[activeIndex].classList.remove('active');

    const newIndex = (activeIndex + n + items.length) % items.length;
    items[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
}

function currentSlide(n, index) {
    const carousel = document.querySelectorAll('.carousel')[index];
    if (!carousel) return;
    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.dot');
    let activeIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

    items[activeIndex].classList.remove('active');
    dots[activeIndex].classList.remove('active');
    items[n].classList.add('active');
    dots[n].classList.add('active');
}
