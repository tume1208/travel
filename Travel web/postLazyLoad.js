// postLazyLoad.js
export const postLazyLoad = (elements, root) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
                observer.unobserve(element);
            }
        });
    }, {
        root,
        rootMargin: '0px',
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
};
