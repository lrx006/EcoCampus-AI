/**
 * EcoCampus AI - 节能助手对话
 * 调用 /api/chat（纯规则匹配，无需 API Key）
 */
(function () {
  var messagesEl = document.getElementById('chatMessages');
  var inputEl = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSendBtn');
  if (!messagesEl || !inputEl || !sendBtn) return;

  var isLoading = false;

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function appendBotMessage(text) {
    if (!text) text = '我这边有点卡，稍后再试一下吧～';
    var wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg-bot';
    wrap.innerHTML =
      '<span class="chat-msg-avatar"><i class="fas fa-leaf"></i></span>' +
      '<div class="chat-msg-bubble">' + escapeHtml(String(text)) + '</div>';
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendUserMessage(text) {
    var wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg-user';
    wrap.innerHTML =
      '<div class="chat-msg-bubble">' + escapeHtml(String(text)) + '</div>' +
      '<span class="chat-msg-avatar chat-msg-avatar-user"><i class="fas fa-user"></i></span>';
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setLoading(on) {
    isLoading = on;
    sendBtn.disabled = on;
    sendBtn.innerHTML = on ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-paper-plane"></i>';
  }

  function send() {
    var text = (inputEl.value || '').trim();
    if (!text || isLoading) return;
    inputEl.value = '';
    appendUserMessage(text);
    setLoading(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('请求失败');
        var ct = (res.headers.get('Content-Type') || '').toLowerCase();
        if (ct.indexOf('application/json') === -1) throw new Error('非 JSON 响应');
        return res.json();
      })
      .then(function (data) {
        var reply = data && typeof data.reply === 'string' ? data.reply : '';
        appendBotMessage(reply);
      })
      .catch(function () {
        appendBotMessage('网络不太稳，请稍后再试～');
      })
      .finally(function () {
        setLoading(false);
        inputEl.focus();
      });
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
})();
