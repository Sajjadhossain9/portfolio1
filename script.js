const video = document.querySelector("#heroVideo");
let duration = 0;
let frameId = null;
let primed = false;

function syncVideoToPage() {
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

  if (duration > 0 && Number.isFinite(duration) && video.readyState >= 2) {
    const safeEnd = Math.max(0, duration - 0.05);
    const targetTime = progress * safeEnd;

    if (Math.abs(video.currentTime - targetTime) > 0.015) {
      video.currentTime = targetTime;
    }
  }

  frameId = null;
}

function requestVideoSync() {
  if (frameId === null) {
    frameId = requestAnimationFrame(syncVideoToPage);
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

  requestVideoSync();
}

video.addEventListener("loadedmetadata", () => {
  duration = video.duration || 0;
  requestVideoSync();
});

video.addEventListener("loadeddata", primeVideoFrame, { once: true });

video.addEventListener("durationchange", () => {
  duration = video.duration || duration;
  requestVideoSync();
});

video.addEventListener("error", () => {
  console.error("Background video could not be loaded:", video.error);
});

window.addEventListener("scroll", requestVideoSync, { passive: true });
window.addEventListener("resize", requestVideoSync);
window.addEventListener("load", requestVideoSync);

video.load();
requestVideoSync();