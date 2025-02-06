document.addEventListener('DOMContentLoaded', () => {
  const cacheKey = 'stories';

  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const storyData = JSON.parse(cachedData);
    window.storyData = storyData;
    renderStories(storyData);
  } else {
    fetch('story.json')
      .then(response => response.json())
      .then(data => {
        window.storyData = data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
        renderStories(data);
      })
      .catch(error => console.error('Error fetching stories:', error));
  }
});

const renderStories = (data) => {
  const storiesContainer = document.getElementById('stories');
  const storyModal = document.getElementById('storyModal');
  const optionsIcon = document.querySelector('.options');
  const optionsMenu = document.querySelector('.options-menu');
  const storyImageModal = document.querySelector('.story-image-modal');
  const storyVideoModal = document.querySelector('.story-video-modal');
  const storyLocationModal = document.querySelector('.story-location-modal');
  const progressBar = document.querySelector('.progress-bar');
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
          <source src="${story.image}" type="video/mp4" loading="lazy">
        </video>
      `;
    } else {
      storyElement.innerHTML += `
        <div class="story-location">${story.location}</div>
        <img src="${story.image}" alt="${user.username}'s story" class="story-media" loading="lazy">
      `;
    }

    storyElement.addEventListener('click', () => {
      currentUserIndex = userIndex;
      currentStoryIndex = 0;
      storyModal.style.display = 'block';
      disableScroll(); // Disable scrolling
      showStory(currentUserIndex, currentStoryIndex);
    });

    storiesContainer.appendChild(storyElement);
  });

  // Add event listeners for clicking on the left and right sides of the modal
  storyModal.addEventListener('click', (event) => {
    const modalWidth = storyModal.offsetWidth;
    const clickX = event.clientX;
    // Check if the click target is not the heart icon, profile picture, options menu, or comment bar
    if (event.target.closest('.material-icons.favorite-border') || event.target.closest('.profile-picture-modal') || event.target.closest('.options') || event.target.closest('.comment-bar')) {
      return; // Do nothing if the click is on these elements
    }
    if (clickX > modalWidth / 2) { // Click on the right side
      currentStoryIndex = (currentStoryIndex + 1) % data[currentUserIndex].stories.length;
      if (currentStoryIndex === 0) {
        currentUserIndex = (currentUserIndex + 1) % data.length;
      }
    } else { // Click on the left side
      currentStoryIndex = (currentStoryIndex - 1 + data[currentUserIndex].stories.length) % data[currentUserIndex].stories.length;
      if (currentStoryIndex === data[currentUserIndex].stories.length - 1) {
        currentUserIndex = (currentUserIndex - 1 + data.length) % data.length;
      }
    }
    showStory(currentUserIndex, currentStoryIndex);
  });

  // Event listener for options icon
  optionsIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click from closing the modal
    optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Close the options menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (!optionsMenu.contains(event.target) && event.target !== optionsIcon) {
      optionsMenu.style.display = 'none';
    }
  });

  // Prevent clicks inside the options menu from closing the story modal
  optionsMenu.addEventListener('click', (event) => {
    event.stopPropagation();
  });
};

