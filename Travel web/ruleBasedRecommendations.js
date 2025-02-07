// ruleBasedRecommendations.js
export const getRuleBasedRecommendations = (posts, postInteractions) => {
    const scores = posts.map(post => {
        const interaction = postInteractions.find(i => i.post_id === post.post_id);
        const score = (interaction.likes_count * 2) + interaction.comments_count;
        return { post, score };
    });

    scores.sort((a, b) => b.score - a.score);

    return scores.map(scoreObj => scoreObj.post);
};
