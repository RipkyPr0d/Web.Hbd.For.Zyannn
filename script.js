document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let currentScene = 1;
    let pinInput = '';
    const correctPin = '15112009'; // PIN tanggal lahir

    // Variabel global untuk kontrol animasi kembang api
    let fireworks = [];
    let particles = [];
    let isRunning = false;

    // Resize Canvas
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Scene Switcher Logic
    function switchScene(sceneNumber) {
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });

        // Hentikan animasi dan bersihkan layar kanvas seketika saat pindah scene
        isRunning = false;
        fireworks = [];
        particles = [];
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        if (sceneNumber === 5) {
            document.body.classList.add('final-dark');
        } else {
            document.body.classList.remove('final-dark');
        }

        const targetScene = document.getElementById(getSceneId(sceneNumber));
        if (targetScene) {
            targetScene.classList.add('active');
            currentScene = sceneNumber;
            onSceneEnter(sceneNumber);
        }
    }

    function getSceneId(num) {
        switch(num) {
            case 1: return 'scene-clue';
            case 2: return 'scene-pin';
            case 3: return 'scene-mystery';
            case 4: return 'scene-cake';
            case 5: return 'scene-fireworks';
            case 6: return 'scene-bouquet';
            case 7: return 'scene-notebook';
            case 8: return 'scene-ending';
            default: return 'scene-clue';
        }
    }

    function onSceneEnter(num) {
        if (num === 3) initMysteryGame();
        if (num === 5) startFireworksSequence();
        if (num === 6) {
            setTimeout(() => {
                switchScene(7);
            }, 5500);
        }
    }

    // --- SCENE 1 & 2: CLUE TO PIN ---
    document.getElementById('scene-clue').addEventListener('click', () => {
        switchScene(2);
    });

    const dots = document.querySelectorAll('.dot');
    const welcomeMsg = document.getElementById('welcome-msg');
    const pinWrapper = document.querySelector('.pin-wrapper');

    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const num = key.getAttribute('data-num');
            const action = key.getAttribute('data-action');

            if (num !== null && pinInput.length < 8) {
                pinInput += num;
                updateDots();
            } else if (action === 'del' && pinInput.length > 0) {
                pinInput = pinInput.slice(0, -1);
                updateDots();
            } else if (action === 'submit') {
                if (pinInput === correctPin) {
                    welcomeMsg.classList.add('show');
                    setTimeout(() => {
                        switchScene(3);
                    }, 1200);
                } else {
                    pinWrapper.classList.add('shake');
                    setTimeout(() => pinWrapper.classList.remove('shake'), 400);
                    pinInput = '';
                    updateDots();
                }
            }
        });
    });

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < pinInput.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    // --- SCENE 3: MYSTERY GAME ---
    function initMysteryGame() {
        const field = document.getElementById('stars-field');
        if (!field) return;
        field.innerHTML = '';
        const totalStars = 25;
        const targetIndex = Math.floor(Math.random() * totalStars);

        for (let i = 0; i < totalStars; i++) {
            const star = document.createElement('div');
            star.classList.add('game-star');
            
            const rx = Math.random() * 80 + 10;
            const ry = Math.random() * 80 + 10;
            star.style.left = `${rx}%`;
            star.style.top = `${ry}%`;

            if (i === targetIndex) {
                star.classList.add('target-star');
                star.addEventListener('click', (e) => {
                    triggerRipple(e);
                    star.classList.add('found');
                    setTimeout(() => {
                        switchScene(4);
                    }, 900);
                });
            } else {
                star.addEventListener('click', (e) => {
                    triggerRipple(e);
                    star.style.transform = 'scale(0.5)';
                    setTimeout(() => star.style.transform = 'scale(1)', 200);
                });
            }
            field.appendChild(star);
        }
    }

    function triggerRipple(e) {
        const rect = e.target.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        e.target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // --- SCENE 4: CAKE & CANDLES ---
    let candle0Off = false, candle1Off = false;
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.addEventListener('click', (e) => {
            e.stopPropagation();
            const candleId = flame.getAttribute('data-candle');
            flame.classList.add('extinguished');
            if (candleId === '0') candle0Off = true;
            if (candleId === '1') candle1Off = true;
            
            if (candle0Off && candle1Off) {
                setTimeout(() => {
                    if (bgMusic) {
                        bgMusic.volume = 0; 
                        bgMusic.play().catch(() => {});
                        let vol = 0;
                        const fadeIn = setInterval(() => {
                            vol += 0.02; 
                            if (vol >= 0.9) { vol = 0.9; clearInterval(fadeIn); }
                            bgMusic.volume = vol;
                        }, 50);
                    }
                    
                    const sceneCake = document.getElementById('scene-cake');
                    if (sceneCake) {
                        sceneCake.style.transition = 'opacity 2s ease, filter 2s ease';
                        sceneCake.style.opacity = '0';
                        sceneCake.style.filter = 'brightness(0)';
                    }

                    setTimeout(() => {
                        switchScene(5); 
                    }, 2000);
                }, 1500); 
            }
        });
    });

    // --- SCENE 5: ROCKET FIREWORKS ENGINE ---
    function startFireworksSequence() {
        const fwTitle = document.getElementById('fw-title');
        isRunning = true; 
        
        setTimeout(() => {
            if(fwTitle) fwTitle.classList.add('show');
        }, 500);

        setTimeout(() => {
            if(fwTitle) fwTitle.classList.remove('show');
            setTimeout(() => {
                switchScene(6);
            }, 1000);
        }, 7500);

        if (!canvas || !ctx) return;

        class Firework {
            constructor(startX, startY, targetX, targetY) {
                this.x = startX;
                this.y = startY;
                this.startX = startX;
                this.startY = startY;
                this.targetX = targetX;
                this.targetY = targetY;
                this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
                this.distanceTraveled = 0;
                this.coordinates = [];
                this.coordinateCount = 3;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.angle = Math.atan2(targetY - startY, targetX - startX);
                this.speed = 1.8;
                this.acceleration = 1.03;
                this.brightness = Math.random() * 50 + 50;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.speed *= this.acceleration;
                let vx = Math.cos(this.angle) * this.speed;
                let vy = Math.sin(this.angle) * this.speed;
                this.distanceTraveled = Math.hypot(this.startX - this.x, this.startY - this.y);

                if (this.distanceTraveled >= this.distanceToTarget) {
                    createParticles(this.targetX, this.targetY);
                    fireworks.splice(index, 1);
                } else {
                    this.x += vx;
                    this.y += vy;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsl(330, 100%, ${this.brightness}%)`;
                ctx.stroke();
            }
        }

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.coordinates = [];
                this.coordinateCount = 5;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 4 + 1;
                this.friction = 0.93;
                this.gravity = 0.6;
                this.hue = Math.random() * 40 + 320;
                this.brightness = Math.random() * 50 + 50;
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.025;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);
                this.speed *= this.friction;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.gravity;
                this.alpha -= this.decay;

                if (this.alpha <= 0) {
                    particles.splice(index, 1);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
                ctx.stroke();
            }
        }

        function createParticles(x, y) {
            let particleCount = 28;
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }

        let timerTotal = 70;
        let timerTick = 0;

        function loop() {
            if (!isRunning || currentScene !== 5) return;
            requestAnimationFrame(loop);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            let i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            let j = particles.length;
            while (j--) {
                particles[j].draw();
                particles[j].update(j);
            }

            if (timerTick >= timerTotal) {
                fireworks.push(new Firework(canvas.width / 2, canvas.height, Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1), Math.random() * (canvas.height * 0.4) + (canvas.height * 0.15)));
                timerTick = 0;
            } else {
                timerTick++;
            }
        }

        loop();
    }

    // --- SCENE 7: NOTEBOOK & TYPING EFFECT ---
    const notebookTrigger = document.getElementById('notebook-trigger');
    const book = document.getElementById('book');
    const notebookHint = document.getElementById('notebook-hint');
    const typedContentContainer = document.getElementById('typed-content-container');
    
    let isBookOpened = false;
    const messageText = `Haii Zyann,

Happy birthday yaa yang ke-17 kamuu! 🎉

Semoga di umur kamu yang bertambah ini kamu jadi pribadi yang lebih baik, dan semua impian kamu tercapai. 

Makasih juga udah pernah jadi rumah buat aku hehe.

ttd : -Rivki`;

    if (notebookTrigger) {
        notebookTrigger.addEventListener('click', () => {
            if (!isBookOpened) {
                isBookOpened = true;
                book.classList.add('opened');
                notebookHint.style.opacity = '0';
                setTimeout(() => {
                    notebookHint.style.display = 'none';
                    startTypingEffect();
                }, 800);
            }
        });
    }

    function startTypingEffect() {
        let i = 0;
        typedContentContainer.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'typed-cursor';
        typedContentContainer.appendChild(cursor);

        function typeWriter() {
            if (i < messageText.length) {
                const char = messageText.charAt(i);
                // Menangani baris baru (\n) agar berubah menjadi tag <br> di HTML
                if (char === '\n') {
                    const br = document.createElement('br');
                    typedContentContainer.insertBefore(br, cursor);
                } else {
                    const textNode = document.createTextNode(char);
                    typedContentContainer.insertBefore(textNode, cursor);
                }
                i++;
                setTimeout(typeWriter, 35);
            } else {
                setTimeout(() => {
                    cursor.remove();
                    setTimeout(() => {
                        switchScene(8);
                    }, 2500);
                }, 1000);
            }
        }
        typeWriter();
    }
});