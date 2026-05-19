'use strict';
/* ═══════════════════════════════════
   PÔÔK Snack — main.js  (final)
   All assets used as CSS backgrounds.
   Waves/stars/shards handled by CSS classes.
═══════════════════════════════════ */

const GEMINI_KEY = 'AIzaSyAimhgvW_z0NsWDrjz9VVk52LWtLAfseQk';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT = `You are Pôôk Assistant, a cheerful AI helper for PÔÔK Snack — a Vietnamese brand making healthy, crispy vegetable snacks.
PRODUCTS: Individual cans (140g tall & mini) in 4 flavors: Carrot, Beetroot, Sweet Potato, Lotus Root. Also: 4-can gift sets, premium gift boxes, full crates.
KEY FACTS: 100% plant-based, naturally gluten-free, NOT fried — uses low-temperature vacuum drying. Vegetables from Vietnamese farms. Consume within 7 days of opening. Contains inedible desiccant packet inside.
TONE: Warm, cheerful, uses emojis 🥕🌸💜🌿. Max 3 sentences per reply. For pricing direct to Contact page.
Reply in the same language as the user (English or Vietnamese).`;

/* ─── NAVBAR ─── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 40)
  , { passive: true });
}

/* ─── MOBILE MENU ─── */
let _mobOpen = false;

function toggleMenu() {
  _mobOpen = !_mobOpen;
  const menu = document.getElementById('mobMenu');
  const btn  = document.getElementById('burgerBtn');
  if (!menu || !btn) return;
  btn.classList.toggle('open', _mobOpen);
  if (_mobOpen) {
    menu.classList.add('show');
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    document.body.style.overflow = 'hidden';
  } else {
    _menuClose();
  }
}

function _menuClose() {
  if (!_mobOpen) return;
  _mobOpen = false;
  const menu = document.getElementById('mobMenu');
  const btn  = document.getElementById('burgerBtn');
  if (menu) { menu.classList.remove('open'); setTimeout(() => menu.classList.remove('show'), 260); }
  if (btn)  btn.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── SCROLL REVEAL ─── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.rv').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * .96)
      el.classList.add('in');
    else
      obs.observe(el);
  });
}

/* ─── CARD RIPPLE ─── */
function initRipple() {
  document.querySelectorAll('.pcard:not([data-rip])').forEach(card => {
    card.dataset.rip = '1';
    card.addEventListener('click', e => {
      const rect = card.getBoundingClientRect();
      const sz   = Math.max(rect.width, rect.height);
      const r    = document.createElement('span');
      r.className = 'ripple';
      r.style.cssText = `width:${sz}px;height:${sz}px;
        left:${e.clientX - rect.left - sz / 2}px;
        top:${e.clientY  - rect.top  - sz / 2}px;`;
      card.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

/* ─── PAGE TRANSITION ─── */
function initTransition() {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity .28s ease';
  requestAnimationFrame(() =>
    requestAnimationFrame(() => { document.body.style.opacity = '1'; })
  );
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || h.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = h; }, 250);
  });
}

/* ─── FAQ ─── */
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const ico = btn.querySelector('.fq-ico');
  const was = ans.classList.contains('open');
  document.querySelectorAll('.faq-ans').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-btn').forEach(b => {
    b.classList.remove('open');
    const i = b.querySelector('.fq-ico'); if (i) i.textContent = '+';
  });
  if (!was) { ans.classList.add('open'); btn.classList.add('open'); if (ico) ico.textContent = '−'; }
}

/* ─── PRODUCT FILTER ─── */
function filterProd(cat, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.filterable').forEach(c => {
    c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
}

/* ─── CONTACT FORM ─── */
function submitForm() {
  const vals = ['fname','fphone','femail','fmsg'].map(id => {
    const el = document.getElementById(id); return el ? el.value.trim() : '';
  });
  if (vals.some(v => !v)) { alert('Please fill in all required fields.'); return; }
  const ok = document.getElementById('formOk');
  if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 5000); }
}

/* ─── PRODUCT GALLERY ─── */
let _galCur  = 0;
const _galImgs = ['cam cao 1.png','hồng cao 1.png','tím cao 1.png','xanh cao 1.png'];

function initGallery() {
  const thumbs = document.getElementById('galThumbs');
  const dots   = document.getElementById('galDots');
  if (!thumbs || !dots) return;
  _galImgs.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = 'images/' + src; t.alt = '';
    t.className = 'gthumb' + (i === 0 ? ' on' : '');
    t.onclick = () => galSet(i);
    thumbs.appendChild(t);
    const d = document.createElement('span');
    d.className = 'gd' + (i === 0 ? ' on' : '');
    d.onclick = () => galSet(i);
    dots.appendChild(d);
  });
}

function galSet(i) {
  _galCur = (i + _galImgs.length) % _galImgs.length;
  const m = document.getElementById('galImg');
  if (m) {
    m.style.opacity = '.3';
    setTimeout(() => { m.src = 'images/' + _galImgs[_galCur]; m.style.opacity = '1'; }, 180);
  }
  document.querySelectorAll('.gthumb').forEach((t,idx) => t.classList.toggle('on', idx === _galCur));
  document.querySelectorAll('.gd').forEach((d,idx) => d.classList.toggle('on', idx === _galCur));
}

function galNav(dir) { galSet(_galCur + dir); }

function pickFlavor(btn, imgFile) {
  document.querySelectorAll('.fp').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const i = _galImgs.indexOf(imgFile);
  galSet(i >= 0 ? i : 0);
}

/* ─── AI CHATBOT ─── */
let _chatHistory = [];
let _chatOpen    = false;

function initChat() {
  const fab   = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const xBtn  = document.getElementById('chatClose');
  const send  = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const badge = document.getElementById('chatBadge');
  if (!fab || !panel) return;

  setTimeout(() => { if (!_chatOpen && badge) badge.classList.remove('hide'); }, 3000);

  fab.addEventListener('click', () => {
    _chatOpen = !_chatOpen;
    panel.classList.toggle('open', _chatOpen);
    fab.classList.toggle('open', _chatOpen);
    if (badge) badge.classList.add('hide');
    if (_chatOpen) {
      setTimeout(() => input && input.focus(), 350);
      if (_chatHistory.length === 0) {
        _botMsg('Xin chào! 👋 Mình là Pôôk Assistant. Hỏi mình về snack rau củ của chúng mình nhé! 🥕✨');
        setTimeout(_showSugs, 700);
      }
    }
  });

  if (xBtn) xBtn.addEventListener('click', () => {
    _chatOpen = false;
    panel.classList.remove('open');
    fab.classList.remove('open');
  });

  if (send)  send.addEventListener('click', _sendChat);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendChat(); }
    });
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  }
}

function _botMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.innerHTML = `<div class="msg-bub">${text}</div><div class="msg-t">${now}</div>`;
  msgs.insertBefore(d, document.getElementById('typingInd'));
  msgs.scrollTop = msgs.scrollHeight;
}
function _userMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  const d = document.createElement('div');
  d.className = 'msg user';
  d.innerHTML = `<div class="msg-bub">${text}</div><div class="msg-t">${now}</div>`;
  msgs.insertBefore(d, document.getElementById('typingInd'));
  msgs.scrollTop = msgs.scrollHeight;
}
function _showTyping() { const t = document.getElementById('typingInd'); if (t) { t.classList.add('show'); document.getElementById('chatMsgs').scrollTop = 999999; } }
function _hideTyping() { const t = document.getElementById('typingInd'); if (t) t.classList.remove('show'); }
function _showSugs()   { const s = document.getElementById('chatSugs'); if (s) s.style.display = 'flex'; }
function _hideSugs()   { const s = document.getElementById('chatSugs'); if (s) s.style.display = 'none'; }

function sendSuggestion(text) { _hideSugs(); _doSend(text); }

function _sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = ''; inp.style.height = 'auto';
  _doSend(text);
}

async function _doSend(text) {
  _hideSugs();
  _userMsg(text);
  _chatHistory.push({ role: 'user', parts: [{ text }] });
  const sendBtn = document.getElementById('chatSend');
  if (sendBtn) sendBtn.disabled = true;
  _showTyping();
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: _chatHistory,
        generationConfig: { maxOutputTokens: 300, temperature: 0.85 }
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data  = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, mình gặp sự cố 😅';
    _hideTyping();
    _chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    _botMsg(reply);
    if (_chatHistory.length <= 4) _showSugs();
  } catch (err) {
    _hideTyping();
    // BỔ SUNG: Fallback kịch bản nếu API Key gặp lỗi hoặc hết hạn
    console.error("API Call Failed:", err);
    let reply = "";
    const txtLow = text.toLowerCase();
    
    if (txtLow.includes('giá') || txtLow.includes('bao nhiêu')) {
        reply = "Các sản phẩm của Pôôk hiện đang có mức giá cụ thể trong trang Product, bạn vào xem chi tiết để lựa chọn nha! 🛒";
    } else if (txtLow.includes('vị') || txtLow.includes('loại') || txtLow.includes('flavor')) {
        reply = "Tụi mình có 4 hương vị đặc trưng: Cà rốt, Củ dền, Khoai lang và Củ sen nhé! Bạn có thể mua từng lon lẻ hoặc hộp mix nha 🌸";
    } else if (txtLow.includes('mua') || txtLow.includes('đặt') || txtLow.includes('ở đâu')) {
        reply = "Bạn có thể xem các combo tại trang Product, hoặc gửi thông tin ở trang Contact để tụi mình hỗ trợ bạn đặt hàng nhé! ✨";
    } else if (txtLow.includes('chào') || txtLow.includes('hello')) {
        reply = "Chào bạn! Cần mình tư vấn thêm về sản phẩm snack nào của Pôôk không nè? 🥕";
    } else {
        reply = "Xin lỗi bạn, hiện tại đường truyền AI đang tạm gián đoạn. Bạn cần hỗ trợ gì cứ để lại thông tin qua form Contact nhé! Mình sẽ báo đội ngũ CSKH phản hồi bạn sớm. 😅";
    }
    
    _chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    setTimeout(() => {
        _botMsg(reply);
        if (_chatHistory.length <= 4) _showSugs();
    }, 500); // delay tạo cảm giác tự nhiên
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ─── SHARED FOOTER ─── */
function buildFooter(slotId) {
  const slot = document.getElementById(slotId);
  if (!slot || slot.dataset.built) return;
  slot.dataset.built = '1';
  slot.innerHTML = `
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <div class="flogo"><img src="images/Artboard 130.png" alt="PÔÔK" onerror="this.style.display='none'"></div>
        <div class="fbrand">PÔÔK FOOD CO.</div>
        <div class="finfo">
          <p>📍 Text text text text text text text text text text text text</p>
          <p>📞 000-000-0000</p>
          <p>✉️ example@gmail.com</p>
        </div>
      </div>
      <nav class="fnav">
        <a href="index.html">Story</a>
        <a href="products.html">Product</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div>
        <div class="fsoc-title">You can find Pôôk at:</div>
        <div class="sbtns">
          <a href="#" class="sbtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook</a>
          <a href="#" class="sbtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg> Instagram</a>
          <a href="#" class="sbtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Thread</a>
        </div>
      </div>
    </div>
    <div class="fcopy">© PÔÔK, ALL RIGHT RESERVED.</div>
  </footer>`;
}

/* ─── CHAT WIDGET HTML ─── */
function buildChatWidget() {
  if (document.getElementById('chatFab')) return;
  const tpl = `
  <button class="chat-fab" id="chatFab" aria-label="Chat">
    <span class="chat-badge hide" id="chatBadge">1</span>
    <svg class="ico-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg class="ico-x" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="chat-panel" id="chatPanel">
    <div class="chat-head">
      <div class="chat-ava"><img src="images/Artboard 130.png" alt="" onerror="this.parentElement.innerHTML='<span style=font-size:22px>🥕</span>'"></div>
      <div>
        <div class="chat-hname">Pôôk Assistant 🌿</div>
        <div class="chat-hsub"><span class="status-dot"></span> Always here to help</div>
      </div>
      <button class="chat-xbtn" id="chatClose">✕</button>
    </div>
    <div class="chat-msgs" id="chatMsgs">
      <div class="typing" id="typingInd"><div class="tdot"></div><div class="tdot"></div><div class="tdot"></div></div>
    </div>
    <div class="chat-sugs" id="chatSugs" style="display:none">
      <button class="sug" onclick="sendSuggestion('What flavors do you have?')">🥕 Flavors?</button>
      <button class="sug" onclick="sendSuggestion('Are your snacks vegan?')">🌱 Vegan?</button>
      <button class="sug" onclick="sendSuggestion('How to order?')">🛒 Order?</button>
      <button class="sug" onclick="sendSuggestion('What makes PÔÔK special?')">✨ About</button>
    </div>
    <div class="chat-in-row">
      <textarea class="chat-input" id="chatInput" placeholder="Ask about our snacks…" rows="1"></textarea>
      <button class="chat-send" id="chatSend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  initTransition();
  initNavbar();
  initReveal();
  initRipple();
  buildChatWidget();
  initChat();
  initGallery();

  /* Mobile menu: close on outside click & link tap */
  document.addEventListener('click', e => {
    if (!_mobOpen) return;
    const menu = document.getElementById('mobMenu');
    const btn  = document.getElementById('burgerBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) _menuClose();
  });
  document.querySelectorAll('#mobMenu a').forEach(a => a.addEventListener('click', _menuClose));
});