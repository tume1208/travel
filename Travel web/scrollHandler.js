document.addEventListener('DOMContentLoaded', () => {
    fetch('story.json')
        .then(response => response.json())
        .then(data => {
            window.storyData = data; // Store data in the window object
            
            const storiesContainer = document.getElementById('stories');
            const storyModal = document.getElementById('storyModal');
            const closeModal = document.querySelector('.close');
            const header = document.querySelector('header');
            const bottomNav = document.querySelector('.bottom-nav');
            let storyTimer; // Assuming this variable is used somewhere else in your code

            const enableScroll = () => {
                document.body.style.overflow = 'auto';
            };

            const showHeaderAndBottomNav = () => {
                header.style.display = 'block'; // Show the header
                bottomNav.style.display = 'flex'; // Show bottomNav as flex
                bottomNav.style.visibility = 'visible'; // Ensure visibility
                console.log('Showing header and bottomNav');
            };

            const hideModal = () => {
                storyModal.style.display = 'none';
                showHeaderAndBottomNav(); // Show header and bottom nav
                enableScroll(); // Enable scrolling
                clearTimeout(storyTimer);
            };

            // Event listener for the close modal button
            closeModal.addEventListener('click', () => {
                hideModal();
                console.log('Closed modal, bottomNav display:', getComputedStyle(bottomNav).display, getComputedStyle(bottomNav).visibility, bottomNav.offsetWidth, bottomNav.offsetHeight);
            });

            // Event listener for clicks outside the story modal
            window.addEventListener('click', (event) => {
                if (event.target === storyModal) {
                    hideModal();
                    console.log('Clicked outside modal, bottomNav display:', getComputedStyle(bottomNav).display, getComputedStyle(bottomNav).visibility, bottomNav.offsetWidth, bottomNav.offsetHeight);
                }
            });

            // Always show header and bottom nav when modal is not displayed
            if (getComputedStyle(storyModal).display === 'none') {
                showHeaderAndBottomNav();
            }

            // Assuming you have a function to populate stories in the container
            // populateStories(data, storiesContainer);
        })
        .catch(error => console.error('Error fetching story data:', error));
});
