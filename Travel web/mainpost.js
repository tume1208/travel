// main.js
import { fetchPostData } from './fetchPostData.js';
import { getRuleBasedRecommendations } from './ruleBasedRecommendations.js';
import { createPosts } from './createPosts.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchPostData()
        .then(([posts, postInteractions, comments]) => {
            const ruleBasedPosts = getRuleBasedRecommendations(posts, postInteractions);
            createPosts(ruleBasedPosts, postInteractions, comments);
        })
        .catch(error => console.error('Error fetching posts:', error));
});
