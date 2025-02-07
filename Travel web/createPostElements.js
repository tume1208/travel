// createPostElements.js
export const createPostHeader = (post) => {
    const profilePicture = document.createElement('img');
    profilePicture.dataset.src = post.profilePicture;
    profilePicture.alt = `${post.username}'s profile picture`;
    profilePicture.classList.add('profile-picture', 'lazy');

    const username = document.createElement('span');
    username.textContent = post.username;
    username.classList.add('username');

    const header = document.createElement('div');
    header.appendChild(profilePicture);
    header.appendChild(username);

    return header;
};

export const createPostIcons = (interaction) => {
    const icons = document.createElement('div');
    icons.classList.add('post-icons');

    const leftIcons = document.createElement('div');
    leftIcons.classList.add('post-left-icons');

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-regular', 'fa-heart', 'post-icon');
    const likeCount = document.createElement('span');
    likeCount.textContent = interaction.likes_count;
    likeCount.classList.add('interaction-count');

    const commentIcon = document.createElement('i');
    commentIcon.classList.add('fa-regular', 'fa-comment', 'post-icon');
    const commentCount = document.createElement('span');
    commentCount.textContent = interaction.comments_count;
    commentCount.classList.add('interaction-count');

    const shareIcon = document.createElement('i');
    shareIcon.classList.add('fa-solid', 'fa-share', 'post-icon');
    const shareCount = document.createElement('span');
    shareCount.textContent = interaction.shares_count;
    shareCount.classList.add('interaction-count');

    leftIcons.appendChild(heartIcon);
    leftIcons.appendChild(likeCount);
    leftIcons.appendChild(commentIcon);
    leftIcons.appendChild(commentCount);
    leftIcons.appendChild(shareIcon);
    leftIcons.appendChild(shareCount);

    const saveIcon = document.createElement('i');
    saveIcon.classList.add('fa-regular', 'fa-bookmark', 'post-icon', 'post-right-icon');
    const bookmarkCount = document.createElement('span');
    bookmarkCount.textContent = interaction.bookmarks_count;
    bookmarkCount.classList.add('interaction-count');

    icons.appendChild(leftIcons);
    icons.appendChild(saveIcon);
    icons.appendChild(bookmarkCount);

    return icons;
};
