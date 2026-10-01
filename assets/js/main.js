/**
 * GustAvo — Script di navigazione, galleria e custom video player
 * Istituto Amedeo Avogadro, Torino · Classe 5CI
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Menu Mobile (Hamburger)
    // ----------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (hamburgerBtn && navMobile) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMobile.classList.toggle('visibile');
            hamburgerBtn.classList.toggle('aperto', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMobile.classList.remove('visibile');
                hamburgerBtn.classList.remove('aperto');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ----------------------------------------------------
    // 2. Lightbox Galleria
    // ----------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        const galleryImgs = document.querySelectorAll('.gallery-card img, .galleria-item img');

        const openLightbox = (src, alt) => {
            lightboxImg.src = src;
            lightboxImg.alt = alt || 'Foto ingrandita';
            lightbox.classList.add('attivo');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('attivo');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        };

        galleryImgs.forEach(img => {
            img.addEventListener('click', () => openLightbox(img.src, img.alt));
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('attivo')) closeLightbox();
        });
    }

    // ----------------------------------------------------
    // 3. Custom Sleek Video Player
    // ----------------------------------------------------
    const playerWrapper = document.getElementById('videoPlayer');
    const video = document.getElementById('projectVideo');
    const bigPlayBtn = document.getElementById('bigPlayBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const videoTimeline = document.getElementById('videoTimeline');
    const videoProgress = document.getElementById('videoProgress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeIcon = document.getElementById('volumeIcon');
    const muteIcon = document.getElementById('muteIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (playerWrapper && video) {
        const formatTime = (seconds) => {
            if (isNaN(seconds) || seconds < 0) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        const togglePlay = () => {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        };

        video.addEventListener('play', () => {
            playerWrapper.classList.add('playing');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        });

        video.addEventListener('pause', () => {
            playerWrapper.classList.remove('playing');
            playerWrapper.classList.remove('hide-controls');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        });

        video.addEventListener('ended', () => {
            playerWrapper.classList.remove('playing');
            playerWrapper.classList.remove('hide-controls');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        });

        if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        // Avanzamento e tempi
        video.addEventListener('timeupdate', () => {
            if (!isNaN(video.duration) && video.duration > 0) {
                const percent = (video.currentTime / video.duration) * 100;
                if (videoProgress) videoProgress.style.width = `${percent}%`;
            }
            if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
        });

        video.addEventListener('loadedmetadata', () => {
            if (durationTimeEl && !isNaN(video.duration)) {
                durationTimeEl.textContent = formatTime(video.duration);
            }
        });

        // ----------------------------------------------------
        // Buffer Blob in memoria: risolve definitivamente il problema
        // dei server/CDN (es. Cloudflare Workers / static hosting) che non
        // supportano HTTP Byte-Ranges (206 Partial Content), permettendo
        // il seeking istantaneo e fluido a qualsiasi minuto senza tornare a 00:00.
        // ----------------------------------------------------
        let blobLoaded = false;
        let pendingSeek = null;

        const videoSrc = video.querySelector('source') ? video.querySelector('source').src : video.src;
        if (videoSrc && !videoSrc.startsWith('blob:')) {
            fetch(videoSrc)
                .then(res => {
                    if (!res.ok) throw new Error('Caricamento video non riuscito');
                    return res.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const curTime = pendingSeek !== null ? pendingSeek : video.currentTime;
                    const wasPlaying = !video.paused;
                    video.src = blobUrl;
                    video.currentTime = curTime;
                    if (wasPlaying) video.play();
                    blobLoaded = true;
                    pendingSeek = null;
                })
                .catch(err => {
                    console.warn('Fallback seek standard attivo:', err);
                });
        }

        // Timeline interattiva e trascinamento fluido del cursore
        if (videoTimeline) {
            let isScrubbing = false;
            let justScrubbed = false;
            let scrubPos = 0;
            let wasPlayingBeforeScrub = false;

            const updateScrubVisual = (clientX) => {
                const rect = videoTimeline.getBoundingClientRect();
                scrubPos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                if (videoProgress) {
                    videoProgress.style.width = `${scrubPos * 100}%`;
                }
                if (!isNaN(video.duration) && video.duration > 0 && currentTimeEl) {
                    currentTimeEl.textContent = formatTime(scrubPos * video.duration);
                }
            };

            const seekToPosition = (targetTime) => {
                if (isNaN(video.duration) || video.duration <= 0) return;
                targetTime = Math.max(0, Math.min(video.duration, targetTime));
                if (currentTimeEl) currentTimeEl.textContent = formatTime(targetTime);
                if (videoProgress) videoProgress.style.width = `${(targetTime / video.duration) * 100}%`;

                if (blobLoaded) {
                    video.currentTime = targetTime;
                } else {
                    pendingSeek = targetTime;
                    try {
                        video.currentTime = targetTime;
                    } catch (e) {
                        // ignore se non ancora pronto
                    }
                }
            };

            const startScrub = (e) => {
                isScrubbing = true;
                wasPlayingBeforeScrub = !video.paused;
                if (wasPlayingBeforeScrub) video.pause();
                videoTimeline.classList.add('scrubbing');
                const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                if (clientX !== null) updateScrubVisual(clientX);
            };

            const moveScrub = (e) => {
                if (!isScrubbing) return;
                e.preventDefault();
                const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                if (clientX !== null) updateScrubVisual(clientX);
            };

            const endScrub = () => {
                if (isScrubbing) {
                    isScrubbing = false;
                    justScrubbed = true;
                    setTimeout(() => { justScrubbed = false; }, 150);
                    videoTimeline.classList.remove('scrubbing');
                    if (!isNaN(video.duration) && video.duration > 0) {
                        const targetTime = scrubPos * video.duration;
                        seekToPosition(targetTime);
                    }
                    if (wasPlayingBeforeScrub) {
                        video.play();
                    }
                }
            };

            videoTimeline.addEventListener('mousedown', startScrub);
            videoTimeline.addEventListener('touchstart', startScrub, { passive: false });

            window.addEventListener('mousemove', moveScrub);
            window.addEventListener('touchmove', moveScrub, { passive: false });

            window.addEventListener('mouseup', endScrub);
            window.addEventListener('touchend', endScrub);

            // Click diretto sulla timeline (senza trascinamento)
            videoTimeline.addEventListener('click', (e) => {
                if (isScrubbing || justScrubbed) return;
                const rect = videoTimeline.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (!isNaN(video.duration) && video.duration > 0) {
                    seekToPosition(pos * video.duration);
                }
            });
        }

        // Controllo volume
        let lastVolume = 1;
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                video.volume = val;
                video.muted = val === 0;
                updateVolumeUI();
            });
        }

        const updateVolumeUI = () => {
            const vol = (video.muted || video.volume === 0) ? 0 : video.volume;
            const pct = Math.round(vol * 100);
            if (volumeSlider) {
                volumeSlider.value = vol;
                volumeSlider.style.setProperty('--vol-fill', `${pct}%`);
            }
            if (vol === 0) {
                if (volumeIcon) volumeIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            } else {
                if (volumeIcon) volumeIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        };

        // Inizializza gradiente volume iniziale
        updateVolumeUI();

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = lastVolume > 0 ? lastVolume : 1;
                } else {
                    lastVolume = video.volume;
                    video.muted = true;
                }
                updateVolumeUI();
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (playerWrapper.requestFullscreen) {
                        playerWrapper.requestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });
        }

        // Dissolvenza automatica dei controlli durante la riproduzione
        let hideTimeout;
        const resetHideTimer = () => {
            playerWrapper.classList.remove('hide-controls');
            clearTimeout(hideTimeout);
            if (!video.paused) {
                hideTimeout = setTimeout(() => {
                    playerWrapper.classList.add('hide-controls');
                }, 2400);
            }
        };

        playerWrapper.addEventListener('mousemove', resetHideTimer);
        playerWrapper.addEventListener('mouseleave', () => {
            if (!video.paused) {
                playerWrapper.classList.add('hide-controls');
            }
        });
    }

    // ----------------------------------------------------
    // 4. Rimozione banner/tooltip nativo del browser in basso a sinistra sui link
    // ----------------------------------------------------
    const disableBrowserLinkPreview = () => {
        document.querySelectorAll('a[href]').forEach(a => {
            const url = a.getAttribute('href');
            if (!url || url.startsWith('#')) return;

            a.dataset.href = url;
            a.removeAttribute('href');
            a.setAttribute('role', 'link');
            a.setAttribute('tabindex', '0');

            const navigate = (openInNewTab = false) => {
                if (openInNewTab || a.target === '_blank') {
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = url;
                }
            };

            a.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(e.ctrlKey || e.metaKey || e.button === 1);
            });

            a.addEventListener('auxclick', (e) => {
                if (e.button === 1) { // Click rotellina mouse
                    e.preventDefault();
                    navigate(true);
                }
            });

            a.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    navigate(e.ctrlKey || e.metaKey);
                }
            });
        });
    };

    disableBrowserLinkPreview();

    // ----------------------------------------------------
    // 5. Skeleton UI per le immagini
    // ----------------------------------------------------
    document.querySelectorAll('.skeleton').forEach(box => {
        const img = box.querySelector('img');
        if (!img) return;

        const fatto = () => box.classList.add('loaded');

        if (img.complete && img.naturalWidth > 0) {
            fatto();
        } else {
            img.addEventListener('load', fatto, { once: true });
            img.addEventListener('error', fatto, { once: true });
        }
    });
});

