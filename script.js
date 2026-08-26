const video = document.querySelector("#heroVideo");

let duration = 0;
let targetTime = 0;
let animationFrame = null;
let primed = false;

function pageProgress() {
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );

  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

function updateTargetTime() {
  if (duration > 0 && Number.isFinite(duration)) {
    targetTime = pageProgress() * Math.max(0, duration - 0.05);
  }

  startSmoothScrub();
}

function smoothScrub() {
  animationFrame = null;

  if (duration <= 0 || video.readyState < 2) return;

  const difference = targetTime - video.currentTime;

  if (Math.abs(difference) <= 0.008) {
    video.currentTime = targetTime;
    return;
  }

  const easing = Math.min(0.24, 0.12 + Math.abs(difference) * 0.025);
  video.currentTime += difference * easing;
  animationFrame = requestAnimationFrame(smoothScrub);
}

function startSmoothScrub() {
  if (animationFrame === null) {
    animationFrame = requestAnimationFrame(smoothScrub);
  }
}

async function primeVideoFrame() {
  if (primed) return;
  primed = true;

  try {
    video.muted = true;
    await video.play();
    video.pause();
  } catch (error) {
    video.pause();
  }

  updateTargetTime();
}

video.addEventListener("loadedmetadata", () => {
  duration = video.duration || 0;
  updateTargetTime();
});

video.addEventListener("loadeddata", primeVideoFrame, { once: true });

video.addEventListener("durationchange", () => {
  duration = video.duration || duration;
  updateTargetTime();
});

video.addEventListener("error", () => {
  console.error("Background video could not be loaded:", video.error);
});

window.addEventListener("scroll", updateTargetTime, { passive: true });
window.addEventListener("resize", updateTargetTime);
window.addEventListener("load", updateTargetTime);

video.load();
updateTargetTime();