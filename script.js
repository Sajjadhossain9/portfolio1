const video = document.querySelector("#heroVideo");
let duration = 0;
let frameId = null;

function syncVideoToPage() {
  const documentHeight = document.documentElement.scrollHeight;
  const maxScroll = Math.max(1, documentHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

  if (duration > 0 && Number.isFinite(duration)) {
    const safeEnd = Math.max(0, duration - 0.04);
    const targetTime = progress * safeEnd;

    if (Math.abs(video.currentTime - targetTime) > 0.02) {
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

video.addEventListener("loadedmetadata", () => {
  duration = video.duration || 0;
  video.pause();
  syncVideoToPage();
});

video.addEventListener("durationchange", () => {
  duration = video.duration || duration;
  requestVideoSync();
});

window.addEventListener("scroll", requestVideoSync, { passive: true });
window.addEventListener("resize", requestVideoSync);
window.addEventListener("load", requestVideoSync);

video.load();
requestVideoSync();