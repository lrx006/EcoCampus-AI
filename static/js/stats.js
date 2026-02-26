/**
 * EcoCampus AI - 今日数据与成就徽章
 */
(function () {
  var KEY_DATE = 'ecocampus_stats_date';
  var KEY_TODAY_PREDICT = 'ecocampus_today_predict';
  var KEY_TOTAL_PREDICT = 'ecocampus_total_predict';
  var KEY_REPORT_COUNT = 'ecocampus_report_count';

  function getTodayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function ensureToday() {
    var today = getTodayKey();
    try {
      if (localStorage.getItem(KEY_DATE) !== today) {
        localStorage.setItem(KEY_DATE, today);
        localStorage.setItem(KEY_TODAY_PREDICT, '0');
      }
    } catch (e) {}
  }

  function getTodayPredict() {
    ensureToday();
    return parseInt(localStorage.getItem(KEY_TODAY_PREDICT) || '0', 10);
  }

  function getTotalPredict() {
    return parseInt(localStorage.getItem(KEY_TOTAL_PREDICT) || '0', 10);
  }

  function getReportCount() {
    return parseInt(localStorage.getItem(KEY_REPORT_COUNT) || '0', 10);
  }

  function getQuizBest() {
    return parseInt(localStorage.getItem('ecocampus_quiz_best') || '0', 10);
  }

  function incTodayPredict() {
    ensureToday();
    var n = getTodayPredict() + 1;
    try {
      localStorage.setItem(KEY_TODAY_PREDICT, String(n));
      var t = getTotalPredict() + 1;
      localStorage.setItem(KEY_TOTAL_PREDICT, String(t));
    } catch (e) {}
    updateStats();
    updateBadges();
  }

  function incReportCount() {
    try {
      var n = getReportCount() + 1;
      localStorage.setItem(KEY_REPORT_COUNT, String(n));
    } catch (e) {}
    updateStats();
    updateBadges();
  }

  function updateStats() {
    var predictEl = document.getElementById('statPredictCount');
    var quizEl = document.getElementById('statQuizBest');
    var reportEl = document.getElementById('statReportCount');
    var badgeEl = document.getElementById('statBadgeCount');
    if (predictEl) predictEl.textContent = getTodayPredict();
    if (quizEl) quizEl.textContent = getQuizBest();
    if (reportEl) reportEl.textContent = getReportCount();
    if (badgeEl) badgeEl.textContent = countUnlockedBadges();
    var sidebarPredict = document.getElementById('sidebarStatPredict');
    var sidebarQuiz = document.getElementById('sidebarStatQuiz');
    if (sidebarPredict) sidebarPredict.textContent = getTodayPredict();
    if (sidebarQuiz) sidebarQuiz.textContent = getQuizBest();
  }

  function countUnlockedBadges() {
    var total = getTotalPredict();
    var best = getQuizBest();
    var report = getReportCount();
    var n = 0;
    if (total >= 1) n++;
    if (best > 0) n++;
    if (best >= 100) n++;
    if (report >= 1) n++;
    if (total >= 5) n++;
    if (total >= 1 && best > 0 && report >= 1) n++;
    return n;
  }

  function updateBadges() {
    var total = getTotalPredict();
    var best = getQuizBest();
    var report = getReportCount();
    var rules = {
      first_predict: total >= 1,
      quiz_done: best > 0,
      quiz_100: best >= 100,
      report_done: report >= 1,
      predict_5: total >= 5,
      eco_fan: total >= 1 && best > 0 && report >= 1,
    };
    document.querySelectorAll('.badge-card').forEach(function (card) {
      var badge = card.dataset.badge;
      var unlocked = rules[badge];
      card.classList.toggle('badge-unlocked', !!unlocked);
      card.classList.toggle('badge-locked', !unlocked);
    });
  }

  window.ecocampusStats = {
    incTodayPredict: incTodayPredict,
    incReportCount: incReportCount,
    updateStats: updateStats,
    updateBadges: updateBadges,
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateStats();
    updateBadges();
  });
})();
