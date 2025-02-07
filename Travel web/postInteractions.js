// postInteractions.js
export const setupPostInteractions = (postElement, commentSection, overlay) => {
    const heartIcon = postElement.querySelector('.fa-heart');
    const saveIcon = postElement.querySelector('.fa-bookmark');
    const commentIcon = postElement.querySelector('.fa-comment');
    const commentHeader = commentSection.querySelector('.comment-header');

    heartIcon.addEventListener('click', () => {
        heartIcon.classList.toggle('fa-solid');
        heartIcon.classList.toggle('fa-regular');
    });

    saveIcon.addEventListener('click', () => {
        saveIcon.classList.toggle('fa-solid');
        saveIcon.classList.toggle('fa-regular');
    });

    const toggleComments = (event) => {
        if (commentSection.classList.contains('visible')) {
            commentSection.classList.remove('visible');
            overlay.classList.remove('visible');
            document.body.style.overflow = ''; // Re-enable scrolling
        } else {
            commentSection.classList.add('visible');
            overlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Disable scrolling
        }
        event.stopPropagation();
    };

    commentIcon.addEventListener('click', toggleComments);
    commentHeader.addEventListener('click', toggleComments);
    overlay.addEventListener('click', (event) => {
        commentSection.classList.remove('visible');
        overlay.classList.remove('visible');
        document.body.style.overflow = ''; // Re-enable scrolling
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        if (!commentSection.contains(event.target) && !postElement.contains(event.target)) {
            commentSection.classList.remove('visible');
            overlay.classList.remove('visible');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
};
