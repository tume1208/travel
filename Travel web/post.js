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
                    </div>
                `;

                const postMedia = post.post_video ? `
                    <div class="post-media">
                        <video class="post-video media-element" autoplay muted loop playsinline>
                            <source src="${post.post_video}" type="video/mp4">
                        </video>
                    </div>
                ` : post.image_url ? `
                    <div class="post-media">
                        <img src="${post.image_url}" alt="Post Image" class="post-image media-element" loading="lazy">
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

                // Add click event to redirect to reels.html
                if (post.post_video) {
                    const videoElement = postElement.querySelector('.post-video');
                    videoElement.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default controls
                        localStorage.setItem('autoPlay', 'true');
                        window.location.href = `reels.html?index=${index}`;
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});
