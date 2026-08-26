const video=document.querySelector("#heroVideo");const hero=document.querySelector(".hero");let duration=0,rafId=null;
video.addEventListener("loadedmetadata",()=>{duration=video.duration||0;video.pause();});
function updateVideo(){const rect=hero.getBoundingClientRect();const distance=Math.max(1,hero.offsetHeight-window.innerHeight);const progress=Math.min(1,Math.max(0,-rect.top/distance));if(duration&&isFinite(duration)){const time=progress*duration;if(Math.abs(video.currentTime-time)>.025)video.currentTime=time}rafId=null}
function requestUpdate(){if(!rafId)rafId=requestAnimationFrame(updateVideo)}
window.addEventListener("scroll",requestUpdate,{passive:true});window.addEventListener("resize",requestUpdate);requestUpdate();