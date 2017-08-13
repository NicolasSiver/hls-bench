let button          = document.getElementById('buttonStart'),
    mediaInput      = document.getElementById('mediaUrl'),
    versionInput    = document.getElementById('libraryVersion'),
    iterationsInput = document.getElementById('iterations');

button.addEventListener('click', () => {
    startStartupTimeBenchmark(mediaInput.value, versionInput.value, parseInt(iterationsInput.value));
});

function startStartupTimeBenchmark(url, version, repeats) {
    loadLibrary(version, error => {
        if (error !== null) {
            return console.error('Error has occurred. Load Library. ', error);
        }

        
    });
}

function loadLibrary(version, done) {
    let script = document.createElement('script');

    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@v' + version;
    script.async = true;
    script.onload = () => done(null);
    script.onerror = err => done(err);

    document.querySelector('head').appendChild(script);
}
