document.addEventListener('DOMContentLoaded', function() {

    // --- SplashCursor WebGL Fluid Cursor Effect ---
    if (typeof initSplashCursor === 'function') {
        initSplashCursor({
            RAINBOW_MODE: false,
            COLOR: '#FFB7C5'
        });
    }

    // --- Background Music (starts at 0:47) ---
    const bgMusic = document.getElementById('bg-music');
    const playBtn = document.getElementById('music-play-btn');
    const playIcon = document.getElementById('play-icon');
    const musicDisc = document.getElementById('music-disc');
    const progressFill = document.getElementById('music-progress');
    const MUSIC_START_TIME = 47;

    function setPlayingUI() {
        playIcon.textContent = '⏸';
        playBtn.classList.add('playing');
        musicDisc.classList.add('spinning');
    }

    function setPausedUI() {
        playIcon.textContent = '▶';
        playBtn.classList.remove('playing');
        musicDisc.classList.remove('spinning');
    }

    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!bgMusic.paused) {
            // Currently playing, so pause it
            bgMusic.pause();
            setPausedUI();
        } else {
            // Currently paused, so play it
            bgMusic.volume = 0.8;
            if (bgMusic.currentTime < MUSIC_START_TIME || bgMusic.ended) {
                try {
                    bgMusic.currentTime = MUSIC_START_TIME;
                } catch(err) {
                    console.warn('Seek error:', err);
                }
            }
            bgMusic.play().then(function() {
                setPlayingUI();
            }).catch(function(err) {
                console.error('Playback error:', err);
                setPausedUI();
            });
        }
    });

    // When the song ends, reset the UI
    bgMusic.addEventListener('ended', function() {
        setPausedUI();
        bgMusic.currentTime = MUSIC_START_TIME;
        progressFill.style.width = '0%';
    });

    // Progress bar + keep playback after MUSIC_START_TIME
    bgMusic.addEventListener('timeupdate', function() {
        if (bgMusic.currentTime < MUSIC_START_TIME && !bgMusic.paused) {
            bgMusic.currentTime = MUSIC_START_TIME;
        }
        if (bgMusic.duration) {
            var playableRange = bgMusic.duration - MUSIC_START_TIME;
            var currentProgress = bgMusic.currentTime - MUSIC_START_TIME;
            var percent = Math.max(0, (currentProgress / playableRange) * 100);
            progressFill.style.width = percent + '%';
        }
    });

    // --- Live Age Counter ---
    // Pihu's birthday: September 16
    const birthDate = new Date('2004-09-16T00:00:00');
    const countdownElement = document.getElementById('countdown');

    function updateAge() {
        const now = new Date();

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        countdownElement.innerHTML = years + 'y ' + months + 'm ' + days + 'd <br> ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    setInterval(updateAge, 1000);
    updateAge();

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Initialize LightGallery ---
    lightGallery(document.getElementById('lightgallery'), {
        speed: 500,
        download: false
    });

    // --- Hall of Fame Scroller ---
    var scroller = document.getElementById('hall-of-fame-scroller');
    var scrollLeftBtn = document.getElementById('scroll-left-btn');
    var scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        var card = scroller.querySelector('.snap-center');
        var cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);

        scrollRightBtn.addEventListener('click', function() {
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        scrollLeftBtn.addEventListener('click', function() {
            scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // --- Sakura Petal Animation ---
    var canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var petals = [];
        var numPetals = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Petal() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.w = 25 + Math.random() * 15;
            this.h = 20 + Math.random() * 10;
            this.opacity = this.w / 40;
            this.flip = Math.random();
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flipSpeed = Math.random() * 0.03;
        }

        Petal.prototype.draw = function() {
            if (this.y > canvas.height || this.x > canvas.width) {
                this.x = -this.w;
                this.y = Math.random() * canvas.height * 2 - canvas.height;
                this.xSpeed = 1.5 + Math.random() * 2;
                this.ySpeed = 1 + Math.random() * 1;
                this.flip = Math.random();
            }
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
            ctx.bezierCurveTo(this.x, this.y + this.h, this.x - this.w / 2, this.y, this.x, this.y);
            ctx.closePath();
            ctx.fillStyle = '#FFB7C5';
            ctx.fill();
        };

        Petal.prototype.update = function() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.flip += this.flipSpeed;
            this.draw();
        };

        function createPetals() {
            petals = [];
            for (var i = 0; i < numPetals; i++) {
                petals.push(new Petal());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(function(petal) {
                petal.update();
            });
            requestAnimationFrame(animate);
        }

        createPetals();
        animate();
    }
});
