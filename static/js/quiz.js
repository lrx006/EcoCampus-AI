/**
 * EcoCampus AI - 节能知识闯关
 * 10 关卡片问答 + 翻转展示 AI 反馈
 */
(function () {
  // 10 个关卡：题目、选项、正确答案索引、答对/答错解析
  var quizLevels = [
    {
      title: '电池回收',
      question: '废旧电池应该如何处理？',
      options: [
        '随意丢弃',
        '投入可回收物桶',
        '送往指定回收点或有害垃圾箱',
        '埋入土里',
      ],
      correctIndex: 2,
      explainRight: '你的决策减少了重金属对土壤与水源的污染，AI 分析：正确分类回收能降低碳排放并保护生态环境。',
      explainWrong: '💡 AI 提示：废旧电池属于有害垃圾，应送往指定回收点或投入有害垃圾箱，切勿随意丢弃或混入其他垃圾。',
    },
    {
      title: '光照调节',
      question: '白天教室采光充足时，以下做法最节能的是？',
      options: [
        '保持所有日光灯常开',
        '关闭靠窗一侧的灯，保留内侧灯',
        '拉上窗帘并开灯',
        '全部关灯',
      ],
      correctIndex: 1,
      explainRight: '你的决策减少了不必要的照明用电，AI 分析：合理利用自然光可显著降低照明能耗与碳排放。',
      explainWrong: '💡 AI 提示：采光好时应优先关闭靠窗一侧的灯，保留内侧照明即可，既保证亮度又节约用电。',
    },
    {
      title: '空调设定',
      question: '夏季使用空调时，推荐将室温设定在多少度最兼顾舒适与节能？',
      options: [
        '22℃',
        '26℃',
        '20℃',
        '30℃',
      ],
      correctIndex: 1,
      explainRight: '你的决策在舒适与节能间取得平衡，AI 分析：26℃ 可减少制冷负荷，有效降低碳排放。',
      explainWrong: '💡 AI 提示：夏季空调设定在 26℃ 左右最合适，每调高 1℃ 约可节省约 7% 的制冷电量。',
    },
    {
      title: '待机能耗',
      question: '电脑、显示器一晚上不关机只待机，大约会多消耗多少度电？',
      options: [
        '几乎为 0，待机很省电',
        '约 0.1～0.3 度，积少成多',
        '约 1 度以上',
        '和开机时一样多',
      ],
      correctIndex: 1,
      explainRight: '你的认知有助于减少“ phantom load」（待机耗电）”！AI 分析：待机功耗虽小，但整夜累积可观，养成关机或休眠习惯可显著省电。',
      explainWrong: '💡 AI 提示：待机并非零耗电，电脑+显示器一晚上约 0.1～0.3 度，长期累积可观。离开时关机或设为休眠，既省电又延长设备寿命。',
    },
    {
      title: '低碳出行',
      question: '校园内短距离移动，以下哪种方式相对更低碳？',
      options: [
        '乘坐校车/班车',
        '骑自行车或步行',
        '骑电动车',
        '打出租车',
      ],
      correctIndex: 1,
      explainRight: '你的选择直接减少了校园交通碳排放！AI 分析：骑行或步行零排放，还能锻炼身体，短距离首选。',
      explainWrong: '💡 AI 提示：短距离优先骑行或步行，零排放且有益健康；校车、电动车次之。养成“能走不骑、能骑不坐车”的习惯，减排效果明显。',
    },
    {
      title: '节约用水',
      question: '洗手、洗水果时，以下哪种做法更节水？',
      options: [
        '一直开着水龙头冲洗',
        '用盆接水洗或间歇关闭水龙头',
        '用大量热水冲洗',
        '无所谓，水费很便宜',
      ],
      correctIndex: 1,
      explainRight: '你的习惯能减少水资源浪费！AI 分析：用盆接水或随手关龙头可大幅降低用水量，校园节水从细节做起。',
      explainWrong: '💡 AI 提示：洗手、洗东西时用盆接水或不用时关掉水龙头，可节省大量水。长期坚持，每人每天能省下不少升。',
    },
    {
      title: '纸张与打印',
      question: '打印文档时，以下哪种做法更环保？',
      options: [
        '单面打印，方便阅读',
        '双面打印、先预览再打印，减少废页',
        '多打几份备用',
        '全部彩打，更清晰',
      ],
      correctIndex: 1,
      explainRight: '你的选择减少了纸张与能耗！AI 分析：双面打印和预览能显著减少用纸与打印机耗电，既省资源又省钱。',
      explainWrong: '💡 AI 提示：尽量双面打印，打印前先预览避免错打废页，非必要不彩打。节约用纸就是保护森林与减少碳排放。',
    },
    {
      title: '充电器习惯',
      question: '手机、笔记本充满电后，充电器一直插在插座上会怎样？',
      options: [
        '完全不再耗电',
        '仍有待机功耗，长期会浪费电',
        '会损坏设备',
        '能保护电池',
      ],
      correctIndex: 1,
      explainRight: '你的认知有助于减少“吸血鬼用电”！AI 分析：空载充电器仍有几瓦待机功耗，拔掉或关插座可省电又安全。',
      explainWrong: '💡 AI 提示：充电器不拔会持续消耗少量电（待机功耗），积少成多。充满后拔掉或关闭插座更省电更安全。',
    },
    {
      title: '楼梯与电梯',
      question: '上下楼 1～3 层，以下哪种方式更节能又健康？',
      options: [
        '一律坐电梯',
        '优先走楼梯，既省电又锻炼',
        '看心情',
        '电梯更快，楼梯太累',
      ],
      correctIndex: 1,
      explainRight: '你的选择既省电又强身！AI 分析：低楼层走楼梯可减少电梯能耗，还能增加日常活动量，一举两得。',
      explainWrong: '💡 AI 提示：1～3 层优先走楼梯，能减少电梯用电，还有益健康。养成“能走楼梯就不坐电梯”的习惯吧。',
    },
    {
      title: '垃圾分类',
      question: '喝完的塑料饮料瓶应该投入哪类垃圾桶？',
      options: [
        '其他垃圾',
        '厨余垃圾',
        '可回收物',
        '有害垃圾',
      ],
      correctIndex: 2,
      explainRight: '正确分类让资源循环利用！AI 分析：塑料瓶属于可回收物，投入可回收桶后能再生成原料，减少石油消耗。',
      explainWrong: '💡 AI 提示：塑料瓶、易拉罐等属于可回收物，应投入可回收物桶。正确分类是资源循环的第一步。',
    },
  ];

  var currentLevel = 0;
  var totalScore = 0;
  var answered = false;

  var startEl = document.getElementById('quizStart');
  var playEl = document.getElementById('quizPlay');
  var endEl = document.getElementById('quizEnd');
  var startBtn = document.getElementById('quizStartBtn');
  var levelNumEl = document.getElementById('quizLevelNum');
  var progressBarEl = document.getElementById('quizProgressBar');
  var levelBadgeEl = document.getElementById('quizLevelBadge');
  var questionEl = document.getElementById('quizQuestion');
  var optionsEl = document.getElementById('quizOptions');
  var cardInnerEl = document.getElementById('quizCardInner');
  var feedbackContentEl = document.getElementById('quizFeedbackContent');
  var nextBtn = document.getElementById('quizNextBtn');
  var totalScoreEl = document.getElementById('quizTotalScore');
  var restartBtn = document.getElementById('quizRestartBtn');
  var bestScoreWrap = document.getElementById('quizBestScoreWrap');
  var bestScoreEl = document.getElementById('quizBestScore');
  var bestScoreEndWrap = document.getElementById('quizBestScoreEndWrap');
  var bestScoreEndEl = document.getElementById('quizBestScoreEnd');

  var STORAGE_KEY = 'ecocampus_quiz_best';

  function getBestScore() {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch (e) {
      return 0;
    }
  }

  function setBestScore(score) {
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch (e) {}
  }

  function updateBestScoreDisplay() {
    var best = getBestScore();
    if (bestScoreWrap && bestScoreEl) {
      if (best > 0) {
        bestScoreWrap.classList.remove('d-none');
        bestScoreEl.textContent = best;
      } else {
        bestScoreWrap.classList.add('d-none');
      }
    }
    if (bestScoreEndWrap && bestScoreEndEl) {
      if (best > 0) {
        bestScoreEndWrap.classList.remove('d-none');
        bestScoreEndEl.textContent = best;
      } else {
        bestScoreEndWrap.classList.add('d-none');
      }
    }
  }

  function showStart() {
    startEl.classList.remove('d-none');
    playEl.classList.add('d-none');
    endEl.classList.add('d-none');
    updateBestScoreDisplay();
  }

  function showPlay() {
    startEl.classList.add('d-none');
    playEl.classList.remove('d-none');
    endEl.classList.add('d-none');
  }

  function showEnd() {
    startEl.classList.add('d-none');
    playEl.classList.add('d-none');
    endEl.classList.remove('d-none');
    if (totalScoreEl) totalScoreEl.textContent = totalScore;
    window.ecocampusQuizScore = totalScore;
    var best = getBestScore();
    if (totalScore > best) {
      setBestScore(totalScore);
      best = totalScore;
    }
    if (bestScoreEndWrap && bestScoreEndEl) {
      bestScoreEndWrap.classList.remove('d-none');
      bestScoreEndEl.textContent = best;
    }
    if (window.ecocampusStats && window.ecocampusStats.updateStats) window.ecocampusStats.updateStats();
    if (window.ecocampusStats && window.ecocampusStats.updateBadges) window.ecocampusStats.updateBadges();
    if (window.confetti) {
      var duration = 3 * 1000;
      var end = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }

  function renderQuestion() {
    var level = quizLevels[currentLevel];
    levelNumEl.textContent = currentLevel + 1;
    progressBarEl.style.width = ((currentLevel + 1) / quizLevels.length * 100) + '%';
    levelBadgeEl.textContent = level.title;
    questionEl.textContent = level.question;
    optionsEl.innerHTML = '';
    level.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn quiz-option-btn rounded-3 mb-2 w-100 text-start';
      btn.textContent = String.fromCharCode(65 + i) + '. ' + opt;
      btn.dataset.index = i;
      optionsEl.appendChild(btn);
    });
    cardInnerEl.classList.remove('flipped');
    nextBtn.textContent = currentLevel === quizLevels.length - 1 ? '查看结果' : '下一关';
    answered = false;
  }

  function showFeedback(isCorrect, text) {
    answered = true;
    if (isCorrect) totalScore += 10;
    feedbackContentEl.innerHTML = '<div class="quiz-feedback-text">' + text + '</div>';
    cardInnerEl.classList.add('flipped');
  }

  function handleAnswer(clickedIndex) {
    if (answered) return;
    var level = quizLevels[currentLevel];
    var isCorrect = clickedIndex === level.correctIndex;
    var text = isCorrect
      ? '🎉 环保值 +10，AI分析：' + level.explainRight
      : level.explainWrong;
    showFeedback(isCorrect, text);
  }

  function nextLevel() {
    currentLevel++;
    if (currentLevel >= quizLevels.length) {
      showEnd();
      return;
    }
    renderQuestion();
  }

  function restart() {
    currentLevel = 0;
    totalScore = 0;
    renderQuestion();
    showPlay();
  }

  if (startBtn) startBtn.addEventListener('click', function () {
    currentLevel = 0;
    totalScore = 0;
    renderQuestion();
    showPlay();
  });

  if (optionsEl) optionsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.quiz-option-btn');
    if (!btn) return;
    var index = parseInt(btn.dataset.index, 10);
    handleAnswer(index);
  });

  if (nextBtn) nextBtn.addEventListener('click', nextLevel);
  if (restartBtn) restartBtn.addEventListener('click', restart);
})();
