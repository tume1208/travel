document.addEventListener('DOMContentLoaded', () => {
    const commentBar = document.querySelector('.comment-bar');
    const storyModal = document.getElementById('storyModal');
    let currentStoryIndex = 0;

    // Add event listener for clicking the heart icon
    const heartIcon = document.querySelector('.comment-bar .material-icons');
    if (heartIcon) {
        heartIcon.addEventListener('click', () => {
            const story = window.storyData[currentStoryIndex]; // Access data from the window object
            const isLiked = localStorage.getItem(`liked_${story.id}`);
            if (isLiked) {
                localStorage.removeItem(`liked_${story.id}`);
                heartIcon.textContent = 'favorite_border';
                heartIcon.style.color = 'black';
            } else {
                localStorage.setItem(`liked_${story.id}`, 'true');
                heartIcon.textContent = 'favorite';
                heartIcon.style.color = 'red';
            }
        });
    }

    // Add event listeners for manual scrolling
    storyModal.addEventListener('touchstart', handleTouchStart, false);
    storyModal.addEventListener('touchmove', handleTouchMove, false);

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
                // Swipe left
                currentStoryIndex = (currentStoryIndex + 1) % window.storyData.length;
            } else {
                // Swipe right
                currentStoryIndex = (currentStoryIndex - 1 + window.storyData.length) % window.storyData.length;
            }
            showStory(currentStoryIndex);
        }

        xDown = null;
        yDown = null;
    }
});
