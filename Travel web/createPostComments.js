// createPostComments.js
export const createPostComments = (post, comments) => {
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentHeader = document.createElement('div');
    commentHeader.classList.add('comment-header');
    commentHeader.textContent = 'Comments';

    commentSection.appendChild(commentHeader); // Append header at the top

    const commentList = document.createElement('div');
    commentList.classList.add('comment-list');

    const postComments = comments.filter(comment => comment.post_id === post.post_id);
    postComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentProfilePicture = document.createElement('img');
        commentProfilePicture.dataset.src = comment.profilePicture;
        commentProfilePicture.alt = `${comment.username}'s profile picture`;
        commentProfilePicture.classList.add('profile-picture', 'lazy');

        const commentUsername = document.createElement('span');
        commentUsername.textContent = comment.username;
        commentUsername.classList.add('username');

        const commentText = document.createElement('p');
        commentText.textContent = comment.comment;
        commentText.classList.add('comment-text');

        commentElement.appendChild(commentProfilePicture);
        commentElement.appendChild(commentUsername);
        commentElement.appendChild(commentText);

        commentList.appendChild(commentElement);
    });

    commentSection.appendChild(commentList); // Append comment list below header

    const commentTyping = document.createElement('div');
    commentTyping.classList.add('comment-typing');

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';

    const commentButton = document.createElement('button');
    commentButton.textContent = 'Post';
    commentButton.disabled = true;

    commentInput.addEventListener('input', () => {
        commentButton.disabled = !commentInput.value.trim();
    });

    commentButton.addEventListener('click', () => {
        const newComment = {
            post_id: post.post_id,
            user_id: 0, // Dummy user_id for example
            username: 'current_user',
            comment: commentInput.value,
            profilePicture: 'path/to/current_user.jpg'
        };

        comments.push(newComment);

        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentProfilePicture = document.createElement('img');
        commentProfilePicture.dataset.src = newComment.profilePicture;
        commentProfilePicture.alt = `${newComment.username}'s profile picture`;
        commentProfilePicture.classList.add('profile-picture', 'lazy');

        const commentUsername = document.createElement('span');
        commentUsername.textContent = newComment.username;
        commentUsername.classList.add('username');

        const commentText = document.createElement('p');
        commentText.textContent = newComment.comment;
        commentText.classList.add('comment-text');

        commentElement.appendChild(commentProfilePicture);
        commentElement.appendChild(commentUsername);
        commentElement.appendChild(commentText);

        commentList.appendChild(commentElement); // Append new comment to the list

        commentInput.value = '';
        commentButton.disabled = true;
    });

    commentTyping.appendChild(commentInput);
    commentTyping.appendChild(commentButton);

    commentSection.appendChild(commentTyping); // Append typing field at the bottom

    return commentSection;
};
