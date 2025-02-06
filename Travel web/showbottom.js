document.addEventListener('DOMContentLoaded', () => {
    const storyModal = document.getElementById('storyModal');
    const header = document.getElementById('header');
    const bottomNav = document.querySelector('.bottom-nav');
    const closeModal = document.querySelector('.close');

    const showHeaderAndBottomNav = () => {
        header.style.display = 'block'; // Show the header
        bottomNav.style.display = 'block'; // Show bottomNav as flex
        bottomNav.style.visibility = 'visible'; // Ensure visibility
        console.log('Showing header and bottomNav');
    };

    const hideHeaderAndBottomNav = () => {
        header.style.display = 'none'; // Hide the header
        bottomNav.style.display = 'none'; // Hide bottomNav
        console.log('Hiding header and bottomNav');
    };

    const hideModal = () => {
        storyModal.style.display = 'none';
        showHeaderAndBottomNav(); // Show header and bottom nav
        document.body.style.overflow = 'auto'; // Enable scrolling
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

    // Ensure header and bottom nav are shown if the modal is not displayed
    if (getComputedStyle(storyModal).display === 'none') {
        showHeaderAndBottomNav();
    }

    // Add event listener to hide header and bottom nav when modal is displayed
    document.getElementById('stories').addEventListener('click', () => {
        if (getComputedStyle(storyModal).display === 'block') {
            hideHeaderAndBottomNav();
            document.body.style.overflow = 'hidden'; // Disable scrolling
            console.log('Showing story modal, hiding header and bottomNav');
        }
    });
});
