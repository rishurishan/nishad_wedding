// --- Configuration: edit these ---
const WEDDING_DATE = new Date('2026-05-07T16:30:00+05:30');
const EVENT_TITLE = 'Nishad & Hasna Sherin Wedding';
const EVENT_LOCATION = 'Jalsa Auditorium, Kerala';
const EVENT_DESCRIPTION = 'Join us to celebrate our special day.';

// --- Cover open ---
const cover = document.getElementById('cover');
const openBtn = document.getElementById('openBtn');
const invite = document.getElementById('invite');

openBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  invite.setAttribute('aria-hidden', 'false');
  setTimeout(() => cover.remove(), 1000);
  tryPlayAudio();
});

// --- Flip date card ---
const dateCard = document.getElementById('dateCard');
dateCard.addEventListener('click', () => {
  const expanded = dateCard.getAttribute('aria-expanded') === 'true';
  dateCard.setAttribute('aria-expanded', String(!expanded));
});

// --- Countdown ---
const pad = (n) => String(n).padStart(2, '0');
const dd = document.getElementById('dd');
const hh = document.getElementById('hh');
const mm = document.getElementById('mm');
const ss = document.getElementById('ss');

function tick() {
  const now = new Date();
  let diff = Math.max(0, WEDDING_DATE - now);
  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);   diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);
  dd.textContent = pad(days);
  hh.textContent = pad(hours);
  mm.textContent = pad(mins);
  ss.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

// --- Add to calendar (.ics) ---
document.getElementById('calBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const dt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end = new Date(WEDDING_DATE.getTime() + 4 * 3600 * 1000);
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@wedding`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(WEDDING_DATE)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${EVENT_TITLE}`,
    `LOCATION:${EVENT_LOCATION}`,
    `DESCRIPTION:${EVENT_DESCRIPTION}`,
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wedding.ics';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// --- Scroll reveal ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section').forEach((s) => io.observe(s));

// --- Audio ---
// Place your music file at /home/rishan/wedding/music.mp3
const AUDIO_SRC = 'music.mp3';
const audioToggle = document.getElementById('audioToggle');
const audio = new Audio(AUDIO_SRC);
audio.loop = true;
audio.preload = 'auto';
let audioOn = false;

function setPlayingUI(on) {
  audioOn = on;
  audioToggle.classList.toggle('playing', on);
  audioToggle.classList.toggle('muted', !on);
}

function tryPlayAudio() {
  audio.play()
    .then(() => setPlayingUI(true))
    .catch(() => setPlayingUI(false));
}

audioToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audioOn) { audio.pause(); setPlayingUI(false); }
  else { tryPlayAudio(); }
});

setPlayingUI(false);
