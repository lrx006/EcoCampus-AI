/**
 * EcoCampus AI - 生成节能周报
 * 调用 /api/report，弹窗展示鼓励语
 */
(function () {
  var btn = document.getElementById('reportGenerateBtn');
  var modalEl = document.getElementById('reportModal');
  var bodyEl = document.getElementById('reportModalBody');

  function getScore() {
    return typeof window.ecocampusQuizScore === 'number' ? window.ecocampusQuizScore : 0;
  }

  if (!btn || !modalEl || !bodyEl) return;

  btn.addEventListener('click', function () {
    if (btn.disabled) return;
    var score = getScore();
    bodyEl.textContent = '正在生成周报…';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>生成中…';
    var modal = new bootstrap.Modal(modalEl);
    modal.show();

    function done() {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-magic me-2"></i>生成我的节能周报';
    }

    fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: score }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('请求失败');
        return res.json();
      })
      .then(function (data) {
        bodyEl.textContent = data.report || '暂无内容';
        if (window.ecocampusStats && window.ecocampusStats.incReportCount) window.ecocampusStats.incReportCount();
        done();
      })
      .catch(function () {
        bodyEl.textContent = '生成失败，请检查网络后重试。';
        done();
      });
  });
})();
