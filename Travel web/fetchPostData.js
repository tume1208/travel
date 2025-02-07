// fetchPostData.js
export const fetchPostData = () => {
    return Promise.all([
        fetch('posts.json').then(response => response.json()),
        fetch('post_interactions.json').then(response => response.json()),
        fetch('post_comments.json').then(response => response.json())
    ]);
};
