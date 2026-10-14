(function () {
  var lock = document.getElementById("lock");
  if (!lock) return;
  var root = document.documentElement;
  var slider = document.getElementById("slider");
  var knob = document.getElementById("knob");
  var D = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var M = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function tick() {
    var n = new Date(), h = n.getHours() % 12 || 12, m = n.getMinutes();
    document.getElementById("lock-clock").textContent = h + ":" + (m < 10 ? "0" : "") + m;
    document.getElementById("lock-date").textContent = D[n.getDay()] + ", " + M[n.getMonth()] + " " + n.getDate();
  }
  tick(); setInterval(tick, 10000);

  function unlock() {
    try { sessionStorage.setItem("unlocked", "1"); } catch (e) {}
    lock.classList.add("opening");
    setTimeout(function () { root.className = ""; lock.classList.remove("opening"); }, 450);
  }

  var startX = null, max = 0;
  function pos(e) { return (e.touches ? e.touches[0] : e).clientX; }
  function down(e) {
    startX = pos(e); max = slider.clientWidth - knob.offsetWidth - 4;
    knob.style.transition = "none"; e.preventDefault();
  }
  function move(e) {
    if (startX === null) return;
    var x = Math.max(0, Math.min(max, pos(e) - startX));
    knob.style.left = (2 + x) + "px";
    slider.style.setProperty("--fade", 1 - x / (max * 0.6));
  }
  function up() {
    if (startX === null) return;
    var x = parseFloat(knob.style.left || 2) - 2;
    startX = null; knob.style.transition = "left .25s";
    if (x > max * 0.85) unlock();
    else { knob.style.left = "2px"; slider.style.setProperty("--fade", 1); }
  }
  knob.addEventListener("mousedown", down);
  knob.addEventListener("touchstart", down);
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move);
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
  slider.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); unlock(); } });
  document.getElementById("skip").addEventListener("click", function (e) { e.preventDefault(); unlock(); });
})();
