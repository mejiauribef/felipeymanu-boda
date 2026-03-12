/**
 * Floating music player — play/pause toggle.
 */
let musicPlaying = false;

function initMusic() {
  const player = document.getElementById('music-player');
  const audio = document.getElementById('bg-music');
  const icon = document.getElementById('music-icon');

  if (!player || !audio) return;

  player.addEventListener('click', () => {
    if (musicPlaying) {
      audio.pause();
      player.classList.remove('playing');
      icon.innerHTML = '&#9835;'; // ♫
    } else {
      audio.play().catch(() => {
        // Autoplay blocked — silently fail
      });
      player.classList.add('playing');
      icon.innerHTML = '&#10074;&#10074;'; // ❚❚
    }
    musicPlaying = !musicPlaying;
  });
}

function startMusic() {
  const audio = document.getElementById('bg-music');
  const player = document.getElementById('music-player');
  const icon = document.getElementById('music-icon');

  if (!audio || !player) return;

  audio.play().then(() => {
    musicPlaying = true;
    player.classList.add('playing');
    icon.innerHTML = '&#10074;&#10074;';
  }).catch(() => {
    // Autoplay blocked
  });
}
