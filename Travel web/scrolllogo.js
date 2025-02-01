let lastScrollTop = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.style.top = '-80px'; // Adjust the value based on your header height
    } else {
        // Scrolling up
        header.style.top = '0';
    }
    lastScrollTop = scrollTop;
});
