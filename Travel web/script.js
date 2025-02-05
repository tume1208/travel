document.addEventListener('DOMContentLoaded', () => {
    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            window.storyData = data; // Store data in the window object
            const storiesContainer = document.getElementById('stories');
            const storyModal = document.getElementById('storyModal');
            const closeModal = document.querySelector('.close');
            const optionsIcon = document.querySelector('.options');
            const optionsMenu = document.querySelector('.options-menu');
            const storyImageModal = document.querySelector('.story-image-modal');
            const storyVideoModal = document.querySelector('.story-video-modal');
            const storyLocationModal = document.querySelector('.story-location-modal');
            const progressBar = document.querySelector('.progress-bar');
            const header = document.getElementById('header');
            const bottomNav = document.querySelector('.bottom-nav');
            let currentStoryIndex = 0;
            let currentUserIndex = 0;
            let storyTimer;

            const showStory = (userIndex, storyIndex) => {
                const user = data[userIndex];
                const story = user.stories[storyIndex];

                if (!story || !story.image) {
                    console.error('Story or story image is undefined');
                    return;
                }
                bottomNav.style.display = 'none';
                if (story.image.endsWith('.mp4')) {
                    storyImageModal.style.display = 'none';
                    storyVideoModal.style.display = 'block';
                    storyVideoModal.querySelector('source').src = story.image;
                    storyVideoModal.load();
                } else {
                    storyImageModal.style.display = 'block';
                    storyVideoModal.style.display = 'none';
                    storyImageModal.src = story.image;
                    storyImageModal.addEventListener('load', () => {
                        resetProgressBar();
                    });
                }
                const profilePicture = user.profilePicture || 'profile/user.jpg';
                storyLocationModal.innerHTML = `
                    <img src="${profilePicture}" alt="${user.username}'s profile picture" class="profile-picture-modal">
                    <span>${user.username}</span>
                `;
                updateProgressBar(user.stories.length, storyIndex);
                clearTimeout(storyTimer);
                storyTimer = setTimeout(() => {
                    currentStoryIndex = (currentStoryIndex + 1) % user.stories.length;
                    if (currentStoryIndex === 0) {
                        currentUserIndex = (currentUserIndex + 1) % data.length;
                    }
                    showStory(currentUserIndex, currentStoryIndex);
                }, 5000); // Change story every 5 seconds

                // Check if the story is liked and update the heart icon
                const heartIcon = document.querySelector('.comment-bar .material-icons');
                if (heartIcon) {
                    const isLiked = localStorage.getItem(`liked_${story.id}`);
                    heartIcon.textContent = isLiked ? 'favorite' : 'favorite_border';
                    heartIcon.style.color = isLiked ? 'red' : 'black';
                }
            };

            const updateProgressBar = (totalStories, activeIndex) => {
                progressBar.innerHTML = '';
                for (let i = 0; i < totalStories; i++) {
                    const segment = document.createElement('div');
                    segment.classList.add('progress-segment');
                    if (i === activeIndex) {
                        segment.classList.add('active');
                    }
                    progressBar.appendChild(segment);
                }
            };

            const resetProgressBar = () => {
                const activeSegment = document.querySelector('.progress-segment.active');
                if (activeSegment) {
                    activeSegment.style.animation = 'none';
                    activeSegment.offsetHeight; // Trigger reflow
                    activeSegment.style.animation = 'load 5s linear forwards';
                }
            };

            const disableScroll = () => {
                document.body.style.overflow = 'hidden';
            };

            const enableScroll = () => {
                document.body.style.overflow = 'auto';
            };

            data.forEach((user, userIndex) => {
                const storyElement = document.createElement('div');
                storyElement.classList.add('story');

                // Create story lines
                const storyLines = document.createElement('div');
                storyLines.classList.add('story-lines');
                user.stories.forEach((story, storyIndex) => {
                    const storyLine = document.createElement('div');
                    storyLine.classList.add('story-line');
                    if (storyIndex === 0) {
                        storyLine.classList.add('active');
                    }
                    storyLines.appendChild(storyLine);
                });
                storyElement.appendChild(storyLines);

                // Create story media
                const story = user.stories[0];
                if (story.image.endsWith('.mp4')) {
                    storyElement.innerHTML += `
                        <div class="story-location">${story.location}</div>
                        <video class="story-media" autoplay muted loop playsinline>
                            <source src="${story.image}" type="video/mp4">
                        </video>
                    `;

                    // Add event listener for the video to start playing
                    const storyVideo = storyElement.querySelector('.story-media');
                    storyVideo.addEventListener('playing', () => {
                        clearTimeout(storyTimer);
                        showStory(userIndex, 0);
                    });
                } else {
                    storyElement.innerHTML += `
                        <div class="story-location">${story.location}</div>
                        <img src="${story.image}" alt="${user.username}'s story" class="story-media" loading="lazy">
                    `;
                }

                // Add event listener for clicking on the story
                storyElement.addEventListener('click', () => {
                    storyModal.style.display = 'flex';
                    header.style.display = 'none'; // Hide the header
                    disableScroll(); // Disable scrolling
                    showStory(userIndex, 0);
                });

                storiesContainer.appendChild(storyElement);
            });
        });
});

// Event listener for the close modal button
closeModal.addEventListener('click', () => {
    storyModal.style.display = 'none';
    header.style.display = 'flex'; // Show the header
    enableScroll(); // Enable scrolling
    clearTimeout(storyTimer);
    setTimeout(() => {
        bottomNav.style.display = ''; // Reset display style to default
        console.log('Closed modal, bottomNav display:', getComputedStyle(bottomNav).display, getComputedStyle(bottomNav).visibility, bottomNav.offsetWidth, bottomNav.offsetHeight);
    }, 100); // Adjust the delay as needed
});

// Event listener for clicks outside the story modal
window.addEventListener('click', (event) => {
    if (event.target === storyModal) {
        storyModal.style.display = 'none';
        header.style.display = 'flex'; // Show the header
        enableScroll(); // Enable scrolling
        clearTimeout(storyTimer);
        setTimeout(() => {
            bottomNav.style.display = ''; // Reset display style to default
            console.log('Clicked outside modal, bottomNav display:', getComputedStyle(bottomNav).display, getComputedStyle(bottomNav).visibility, bottomNav.offsetWidth, bottomNav.offsetHeight);
        }, 100); // Adjust the delay as needed
    }
});

// Event listener for clicking on the left and right sides of the modal
storyModal.addEventListener('click', (event) => {
    const modalWidth = storyModal.offsetWidth;
    const clickX = event.clientX;

    // Check if the click target is not the heart icon, profile picture, options menu, or comment bar
    if (event.target.closest('.material-icons.favorite-border') || event.target.closest('.profile-picture-modal') || event.target.closest('.options') || event.target.closest('.comment-bar')) {
        return; // Do nothing if the click is on these elements
    }

    if (clickX > modalWidth / 2) {
        // Click on the right side
        currentStoryIndex = (currentStoryIndex + 1) % data[currentUserIndex].stories.length;
        if (currentStoryIndex === 0) {
            currentUserIndex = (currentUserIndex + 1) % data.length;
        }
    } else {
        // Click on the left side
        currentStoryIndex = (currentStoryIndex - 1 + data[currentUserIndex].stories.length) % data[currentUserIndex].stories.length;
        if (currentStoryIndex === data[currentUserIndex].stories.length - 1) {
            currentUserIndex = (currentUserIndex - 1 + data.length) % data.length;
        }
    }

    // Check if the story video modal is visible
    const storyVideoModalVideo = storyModal.querySelector('.story-video-modal video');
    if (storyVideoModalVideo && storyVideoModalVideo.paused) {
        storyVideoModalVideo.play();
    } else {
        showStory(currentUserIndex, currentStoryIndex);
    }
});
