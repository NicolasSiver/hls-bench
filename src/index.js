let button          = document.getElementById('buttonStart'),
    mediaInput      = document.getElementById('mediaUrl'),
    versionInput    = document.getElementById('libraryVersion'),
    iterationsInput = document.getElementById('iterations');

button.addEventListener('click', () => {
    startStartupTimeBenchmark(mediaInput.value, versionInput.value, parseInt(iterationsInput.value));
});

function loadLibrary(version, done) {
    let script = document.createElement('script');

    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@v' + version;
    script.async = true;
    script.onload = () => done(null);
    script.onerror = err => done(err);

    document.querySelector('head').appendChild(script);
}

function recordStartupTime(url, cursor, total, resultList) {
    if (++cursor <= total) {
        console.log('****************************');
        console.log('Record', cursor, 'from', total);
        console.log('****************************');
        recordStartupTimePlayer(url, record => {
            resultList.push(record);
            renderRecords(resultList);
            recordStartupTime(url, cursor, total, resultList);
        });
    }
}

function recordStartupTimePlayer(mediaUrl, done) {
    let container = document.querySelector('.player-container');
    let video = document.createElement('video');
    let hls = new Hls({
        autoStartLoad          : false,
        debug                  : true,
        initialLiveManifestSize: 3,
        liveSyncDurationCount  : 3,
        maxMaxBufferLength     : 100
    });
    let time = null;

    video.addEventListener('play', () => {
        time = window.performance.now();
    });

    video.addEventListener('playing', () => {
        time = window.performance.now() - time;
        // Disposing
        video.pause();
        hls.destroy();
        video.remove();

        video = null;
        hls = null;

        done({label: 'Startup Time', value: time});
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.startLoad();
        video.play();
    });

    container.appendChild(video);
    hls.attachMedia(video);
    hls.loadSource(mediaUrl);
}

function renderRecords(records) {
    let outputElement = document.querySelector('.output');
    let recordsText = '';
    let total = 0;

    records.forEach((record, index) => {
        total += record.value;
        recordsText += index + ', ' + record.label + ', ' + record.value + '\n';
    });

    recordsText = 'Average: ' + total / records.length + '\n\n' + recordsText;

    outputElement.textContent = recordsText;
}

function startStartupTimeBenchmark(url, version, repeats) {
    let records = [], cursor = 0;

    loadLibrary(version, error => {
        if (error !== null) {
            return console.error('Error has occurred. Load Library. ', error);
        }

        recordStartupTime(url, cursor, repeats, records);
    });
}
