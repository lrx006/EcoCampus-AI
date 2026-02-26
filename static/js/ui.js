/**
 * EcoCampus AI - 界面增强：小贴士轮播、平滑滚动、区块高亮
 */
(function () {
  var TIP_INTERVAL_MS = 5000;
  var tips = [
    '空调设定 26℃ 最省电又舒适，每调高 1℃ 约省 7% 电。',
    '白天采光好时关掉靠窗的灯，既省电又护眼。',
    '离开教室记得关灯、关空调，人走电断。',
    '废旧电池要投放到有害垃圾或指定回收点。',
    '短距离优先步行或骑行，零排放又健康。',
    '电脑不用时关机或休眠，待机也会耗电。',
    '充电器不用时拔掉，减少待机功耗。',
    '打印前先预览，双面打印更环保。',
    '1～3 层走楼梯，省电梯电又锻炼身体。',
    '塑料瓶、易拉罐投入可回收物桶。',
  ];
  var tipIndex = 0;
  var heroTipEl = document.getElementById('heroTip');

  function showNextTip() {
    if (!heroTipEl) return;
    heroTipEl.textContent = tips[tipIndex % tips.length];
    heroTipEl.style.opacity = '0';
    heroTipEl.offsetHeight;
    heroTipEl.style.transition = 'opacity 0.3s ease';
    heroTipEl.style.opacity = '1';
    tipIndex++;
  }

  function initSmoothScroll() {
    document.querySelectorAll('.nav-smooth[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href === '#') {
          document.querySelector('.hero-block') && document.querySelector('.hero-block').scrollIntoView({ behavior: 'smooth', block: 'start' });
          e.preventDefault();
          return;
        }
        var id = href.slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initSectionHighlight() {
    var sections = document.querySelectorAll('#dashboard, #quiz, #report, #stats, #badges, #tips, #chat');
    var navLinks = document.querySelectorAll('.nav-smooth');
    var headerOffset = 100;

    function updateActive() {
      var scrollY = window.scrollY || window.pageYOffset;
      var current = 'hero';
      sections.forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        var top = rect.top + scrollY;
        if (scrollY >= top - headerOffset) current = sec.id;
      });
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var section = href === '#' ? 'hero' : href.slice(1);
        link.classList.toggle('active', section === current);
      });
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', updateActive);
  }

  if (heroTipEl && tips.length) {
    showNextTip();
    setInterval(showNextTip, TIP_INTERVAL_MS);
  }
  function initSidebarToggle() {
    var KEY_LEFT = 'ecocampus_sidebar_left';
    var KEY_RIGHT = 'ecocampus_sidebar_right';
    var left = document.getElementById('sidebarLeft');
    var right = document.getElementById('sidebarRight');
    var btnLeft = document.getElementById('sidebarLeftToggle');
    var btnRight = document.getElementById('sidebarRightToggle');

    function getStored(key, def) {
      try {
        return localStorage.getItem(key) === '1';
      } catch (e) {
        return def;
      }
    }
    function setStored(key, val) {
      try {
        localStorage.setItem(key, val ? '1' : '0');
      } catch (e) {}
    }

    if (left && btnLeft) {
      if (getStored(KEY_LEFT, false)) left.classList.add('collapsed');
      btnLeft.addEventListener('click', function () {
        left.classList.toggle('collapsed');
        setStored(KEY_LEFT, left.classList.contains('collapsed'));
      });
    }
    if (right && btnRight) {
      if (getStored(KEY_RIGHT, false)) right.classList.add('collapsed');
      btnRight.addEventListener('click', function () {
        right.classList.toggle('collapsed');
        setStored(KEY_RIGHT, right.classList.contains('collapsed'));
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initSectionHighlight();
    initSidebarToggle();
  });
})();
