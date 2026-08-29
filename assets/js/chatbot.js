/* chatbot.js — floating product-assistant widget, shared across every
   primary-site page via a single <script src="chatbot.js"> (or
   "../chatbot.js" from one level deep). Self-contained: injects its own
   stylesheet next to itself, builds its own DOM, talks to the
   dealer-backend's /api/chat endpoint. No page-specific wiring needed.
*/
(function () {
  const CONFIG = { apiBaseUrl: window.SILVERWIND_API_BASE || 'http://localhost:4100' };
  // production example: apiBaseUrl: 'https://api.silverwind.website'

  // Resolve the stylesheet relative to this script's own URL, so the widget
  // works from any page depth. This file lives in assets/js/, the stylesheet
  // in assets/css/ — hence the ../css/ hop.
  const thisScript = document.currentScript;

  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = new URL('../css/chatbot.css', thisScript.src).href;
  document.head.appendChild(cssLink);

  const ICON_CHAT = `<svg class="sw-icon-chat" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 12.5C4 8.36 7.8 5 12.5 5S21 8.36 21 12.5 17.2 20 12.5 20c-1.02 0-2-.16-2.9-.46L5 21l1.2-3.6C4.46 16 4 14.3 4 12.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9.5 11.5v-1a3 3 0 0 1 6 0v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M8.7 11.5h.8a.8.8 0 0 1 .8.8v1.4a.8.8 0 0 1-.8.8h-.8a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Zm5.8 0h.8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-.8a.8.8 0 0 1-.8-.8v-1.4a.8.8 0 0 1 .8-.8Z" fill="currentColor"/>
  </svg>`;
  const ICON_CLOSE = `<svg class="sw-icon-close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  const ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 12l16-7-6.5 7L20 19 4 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;

  const root = document.createElement('div');
  root.id = 'sw-chatbot-root';
  root.innerHTML = `
    <div class="sw-chat-window" role="dialog" aria-modal="false" aria-label="DubShop Product Assistant" hidden>
      <div class="sw-chat-header">
        <p class="sw-chat-title">DubShop</p>
        <p class="sw-chat-subtitle">Product Assistant</p>
      </div>
      <div class="sw-chat-body" id="sw-chat-body" aria-live="polite"></div>
      <form class="sw-chat-form" id="sw-chat-form">
        <label for="sw-chat-input" class="sw-visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Type your message</label>
        <input type="text" id="sw-chat-input" class="sw-chat-input" placeholder="Type your message..." maxlength="500" autocomplete="off">
        <button type="submit" class="sw-chat-send" id="sw-chat-send" aria-label="Send message">${ICON_SEND}</button>
      </form>
    </div>
    <button type="button" class="sw-chat-toggle" id="sw-chat-toggle" aria-haspopup="dialog" aria-expanded="false" aria-label="Open chat with DubShop Product Assistant">
      ${ICON_CHAT}${ICON_CLOSE}
    </button>
  `;
  document.body.appendChild(root);

  const toggleBtn = root.querySelector('#sw-chat-toggle');
  const windowEl = root.querySelector('.sw-chat-window');
  const bodyEl = root.querySelector('#sw-chat-body');
  const formEl = root.querySelector('#sw-chat-form');
  const inputEl = root.querySelector('#sw-chat-input');
  const sendBtn = root.querySelector('#sw-chat-send');

  let opened = false;
  let welcomed = false;

  function esc(v) {
    return String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function addMessage(text, from) {
    const div = document.createElement('div');
    div.className = `sw-msg sw-from-${from}`;
    div.innerHTML = `<div class="sw-msg-bubble">${esc(text)}</div><div class="sw-msg-time">${timeNow()}</div>`;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return div;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'sw-msg sw-from-bot';
    div.id = 'sw-typing-indicator';
    div.innerHTML = `<div class="sw-msg-bubble"><span class="sw-typing"><span></span><span></span><span></span></span></div>`;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return div;
  }

  function openChat() {
    opened = true;
    root.classList.add('is-open');
    windowEl.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close chat');
    if (!welcomed) {
      welcomed = true;
      addMessage("Hi! How can I help you find the right tires or wheels?", 'bot');
    }
    inputEl.focus();
  }
  function closeChat() {
    opened = false;
    root.classList.remove('is-open');
    windowEl.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open chat with DubShop Product Assistant');
  }
  toggleBtn.addEventListener('click', () => (opened ? closeChat() : openChat()));

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = inputEl.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;
    const typingEl = addTyping();

    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json().catch(() => ({}));
      typingEl.remove();
      if (!res.ok) {
        // Some failures (rate limiting, a proxy/gateway error) come back as
        // plain text, so data is empty here — say something specific per
        // status rather than blaming the connection for every one of them.
        const fallback = res.status === 429
          ? "You're sending messages a bit quickly — please wait a moment and try again."
          : "Sorry, I'm having trouble connecting right now. Please try again.";
        addMessage(data.error || fallback, 'error');
      } else if (typeof data.reply === 'string' && data.reply) {
        addMessage(data.reply, 'bot');
      } else {
        // 200 but the body wasn't the { reply } shape we expect — don't
        // render "undefined" into the transcript.
        addMessage("Sorry, I didn't quite get that. Please try again.", 'error');
      }
    } catch {
      typingEl.remove();
      addMessage("Sorry, I'm having trouble connecting right now. Please try again.", 'error');
    } finally {
      inputEl.disabled = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  });
})();
