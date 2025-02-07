document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');

    if (fileInput) {
        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    // Handle image compression
                    new Compressor(file, {
                        quality: 0.6, // Compression quality (0 to 1)
                        success(result) {
                            // Handle the compressed image file
                            console.log('Compressed image file:', result);

                            // Example: Create an image element to display the compressed image
                            const imgElement = document.createElement('img');
                            imgElement.src = URL.createObjectURL(result);
                            document.body.appendChild(imgElement);
                        },
                        error(err) {
                            console.error('Compression error:', err.message);
                        },
                    });
                } else if (file.type.startsWith('video/')) {
                    // Handle video compression
                    compressVideo(file, 0.6) // Compression quality (0 to 1)
                        .then((compressedVideo) => {
                            console.log('Compressed video file:', compressedVideo);

                            // Example: Create a video element to display the compressed video
                            const videoElement = document.createElement('video');
                            videoElement.src = URL.createObjectURL(compressedVideo);
                            videoElement.controls = true;
                            document.body.appendChild(videoElement);
                        })
                        .catch((err) => {
                            console.error('Video compression error:', err.message);
                        });
                } else {
                    console.log('Unsupported file type:', file.type);
                }
            }
        });
    } else {
        console.error('File input element not found.');
    }
});

// Function to handle video compression
async function compressVideo(file, quality) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);

    await video.play();
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Video compression failed'));
            }
        }, file.type, quality);
    });
}
