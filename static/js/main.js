/**
 * EcoCampus AI - 智能监控区
 * 滑块 → 防抖后 Fetch /api/predict → 更新仪表盘与警告
 */

(function () {
  const POWER_WARNING_THRESHOLD_KW = 5.0;
  const RAW_TO_KW = 1 / 40;
  const DEBOUNCE_MS = 200;
  const GAUGE_ANIMATION_MS = 800;

  const hourSlider = document.getElementById('hourSlider');
  const tempSlider = document.getElementById('tempSlider');
  const holidaySlider = document.getElementById('holidaySlider');
  const hourValue = document.getElementById('hourValue');
  const tempValue = document.getElementById('tempValue');
  const holidayValue = document.getElementById('holidayValue');
  const powerValueOverlay = document.getElementById('powerValueOverlay');
  const powerWarning = document.getElementById('powerWarning');

  if (!hourSlider || !tempSlider || !holidaySlider) return;

  let powerGaugeChart = null;
  let fetchPredictDebounceTimer = null;
  const RECENT_MAX = 5;
  let recentPredictions = [];

  function debounce(fn, ms) {
    return function () {
      if (fetchPredictDebounceTimer) clearTimeout(fetchPredictDebounceTimer);
      fetchPredictDebounceTimer = setTimeout(function () {
        fetchPredictDebounceTimer = null;
        fn();
      }, ms);
    };
  }

  function getParams() {
    return {
      hour: Number(hourSlider.value),
      temp: Number(tempSlider.value),
      is_holiday: Number(holidaySlider.value),
    };
  }

  function updateLabels() {
    if (hourValue) hourValue.textContent = hourSlider.value;
    if (tempValue) tempValue.textContent = tempSlider.value;
    if (holidayValue) holidayValue.textContent = holidaySlider.value === '1' ? '是' : '否';
  }

  function rawToKw(power) {
    return (power * RAW_TO_KW);
  }

  function showGaugeLoading() {
    if (!powerValueOverlay) return;
    powerValueOverlay.innerHTML = '<i class="fas fa-sync fa-spin"></i>';
    powerValueOverlay.classList.add('gauge-loading');
  }

  function showGaugeValue(value) {
    if (!powerValueOverlay) return;
    powerValueOverlay.textContent = value;
    powerValueOverlay.classList.remove('gauge-loading');
  }

  function fetchPredict() {
    const params = getParams();
    fetch((window.API_PREDICT || '/api/predict'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (data) {
        const power = data.power;
        const powerKw = rawToKw(power);
        updateGauge(powerKw);
        showGaugeValue(powerKw.toFixed(1));
        if (powerKw > POWER_WARNING_THRESHOLD_KW) {
          if (powerWarning) {
            powerWarning.classList.remove('d-none');
            powerWarning.classList.add('power-warning-visible');
          }
        } else {
          if (powerWarning) {
            powerWarning.classList.add('d-none');
            powerWarning.classList.remove('power-warning-visible');
          }
        }
        var p = getParams();
        recentPredictions.unshift({ hour: p.hour, temp: p.temp, is_holiday: p.is_holiday, powerKw: powerKw });
        if (recentPredictions.length > RECENT_MAX) recentPredictions.pop();
        renderRecentPredictions();
        if (window.ecocampusStats && window.ecocampusStats.incTodayPredict) window.ecocampusStats.incTodayPredict();
      })
      .catch(function () {
        showGaugeValue('--');
        if (powerWarning) {
          powerWarning.classList.add('d-none');
          powerWarning.classList.remove('power-warning-visible');
        }
        if (powerGaugeChart) {
          powerGaugeChart.data.datasets[0].data = [0, 8];
          powerGaugeChart.update('none');
        }
      });
  }

  function updateGauge(powerKw) {
    const maxKw = 8;
    const value = Math.min(Math.max(0, powerKw), maxKw);
    const rest = maxKw - value;
    if (powerGaugeChart) {
      const isHigh = value > POWER_WARNING_THRESHOLD_KW;
      powerGaugeChart.data.datasets[0].data = [value, rest];
      powerGaugeChart.data.datasets[0].backgroundColor = isHigh
        ? ['#dc3545', 'rgba(0,0,0,0.08)']
        : ['#5bb8a3', 'rgba(0,0,0,0.08)'];
      powerGaugeChart.update('active');
    }
  }

  function initGauge() {
    const canvas = document.getElementById('powerGauge');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    powerGaugeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['能耗', '剩余'],
        datasets: [{
          data: [0, 8],
          backgroundColor: ['#5bb8a3', 'rgba(0,0,0,0.08)'],
          borderWidth: 0,
        }],
      },
      options: {
        circumference: 180,
        rotation: 270,
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        animation: { duration: GAUGE_ANIMATION_MS },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });
  }

  function resetControl() {
    hourSlider.value = 12;
    tempSlider.value = 20;
    holidaySlider.value = 0;
    updateLabels();
    showGaugeLoading();
    fetchPredict();
  }

  function applyPreset(hour, temp, holiday) {
    hourSlider.value = hour;
    tempSlider.value = temp;
    holidaySlider.value = holiday;
    updateLabels();
    showGaugeLoading();
    fetchPredict();
  }

  function renderRecentPredictions() {
    var el = document.getElementById('recentPredictionsList');
    if (el) {
      if (recentPredictions.length === 0) {
        el.innerHTML = '<li class="text-muted">暂无记录</li>';
      } else {
        el.innerHTML = recentPredictions.map(function (r) {
          var h = r.hour + '时';
          var t = r.temp + '°C';
          var day = r.is_holiday ? '节假日' : '平日';
          return '<li class="recent-pred-item">' + h + ' ' + t + ' ' + day + ' → <strong>' + r.powerKw.toFixed(1) + ' kW</strong></li>';
        }).join('');
      }
    }
    var sidebarEl = document.getElementById('sidebarRecentList');
    if (sidebarEl) {
      var list = recentPredictions.slice(0, 3);
      if (list.length === 0) {
        sidebarEl.innerHTML = '<li class="text-muted">暂无</li>';
      } else {
        sidebarEl.innerHTML = list.map(function (r) {
          var h = r.hour + '时';
          var t = r.temp + '°C';
          return '<li>' + h + ' ' + t + ' → <strong>' + r.powerKw.toFixed(1) + ' kW</strong></li>';
        }).join('');
      }
    }
  }

  function onSliderInput() {
    updateLabels();
    showGaugeLoading();
    debouncedFetchPredict();
  }

  var debouncedFetchPredict = debounce(fetchPredict, DEBOUNCE_MS);

  hourSlider.addEventListener('input', onSliderInput);
  tempSlider.addEventListener('input', onSliderInput);
  holidaySlider.addEventListener('input', onSliderInput);

  var resetBtn = document.getElementById('controlResetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetControl);

  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var h = parseInt(btn.dataset.hour, 10);
      var t = parseInt(btn.dataset.temp, 10);
      var hol = parseInt(btn.dataset.holiday, 10);
      applyPreset(h, t, hol);
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    updateLabels();
    initGauge();
    if (powerGaugeChart) {
      fetchPredict();
    } else {
      if (powerValueOverlay) powerValueOverlay.textContent = '--';
    }
    renderRecentPredictions();
  });
})();
