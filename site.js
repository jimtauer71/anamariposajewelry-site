/* Ana Mariposa Jewelry — shared page script */

/* Contact form destination (fill in ONE of these, between the quotes).
   Web3Forms: paste the access key Web3Forms emails you (looks like
   a1b2c3d4-e5f6-7890-abcd-ef1234567890) into WEB3FORMS_ACCESS_KEY.
   Formspree: paste the form URL (https://formspree.io/f/xxxxxxx) into FORM_ENDPOINT.
   Until one is filled in, the form explains that it isn't connected yet. */
var WEB3FORMS_ACCESS_KEY = '9a198b80-c7b6-4185-bcda-56c8f9649f0d';
var FORM_ENDPOINT = '';

(function () {
  /* Galleries: every piece lives in content/pieces.json, which Ana edits
     through the admin screen (Pages CMS). Each gallery on a page shows the
     pieces whose category matches its data-category, in list order. */
  function localPath(p) { return String(p || '').replace(/^\/+/, ''); }

  function pieceItem(p) {
    var li = document.createElement('li');
    li.className = 'piece';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-full', localPath(p.image));
    btn.setAttribute('data-title', p.title || '');
    btn.setAttribute('aria-label', 'Enlarge photo: ' + (p.title || 'jewelry'));
    var img = document.createElement('img');
    img.src = localPath(p.image);
    img.alt = p.title || '';
    img.loading = 'lazy';
    img.addEventListener('load', function () {
      /* show unusual shapes (lariats, group shots) whole instead of cropped */
      var r = img.naturalWidth / img.naturalHeight;
      if (Math.abs(r - 0.75) > 0.04) { img.classList.add('fit'); }
    });
    btn.appendChild(img);
    li.appendChild(btn);
    var h = document.createElement('h3');
    h.textContent = p.title || '';
    li.appendChild(h);
    if (p.description) {
      var d = document.createElement('p');
      d.textContent = p.description;
      li.appendChild(d);
    }
    return li;
  }

  var galleries = document.querySelectorAll('ul.gallery[data-category]');
  if (galleries.length) {
    fetch('content/pieces.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) { throw new Error('missing'); } return r.json(); })
      .then(function (pieces) {
        galleries.forEach(function (ul) {
          var cat = ul.getAttribute('data-category');
          var mine = (pieces || []).filter(function (p) { return p && p.category === cat && p.image; });
          mine.forEach(function (p) { ul.appendChild(pieceItem(p)); });
          var empty = ul.parentNode.querySelector('.gallery-empty[hidden]');
          if (empty && !mine.length) { empty.hidden = false; }
        });
      })
      .catch(function () {
        galleries.forEach(function (ul) {
          var empty = ul.parentNode.querySelector('.gallery-empty[hidden]');
          if (empty) { empty.textContent = 'The photos couldn’t load. Please refresh the page.'; empty.hidden = false; }
        });
      });
  }

  /* Photo lightbox */
  var box = document.querySelector('dialog.lightbox');
  if (box) {
    var bigImg = box.querySelector('img');
    var cap = box.querySelector('figcaption');
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.piece button[data-full]');
      if (!btn) { return; }
      bigImg.src = btn.getAttribute('data-full');
      bigImg.alt = btn.getAttribute('data-title');
      cap.textContent = btn.getAttribute('data-title');
      if (box.showModal) { box.showModal(); }
    });
    box.querySelector('.close').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) { box.close(); } });
  }

  /* Contact form */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = document.getElementById('form-note');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) { return; }
      var url = FORM_ENDPOINT;
      var data = new FormData(form);
      if (WEB3FORMS_ACCESS_KEY) {
        url = 'https://api.web3forms.com/submit';
        data.append('access_key', WEB3FORMS_ACCESS_KEY);
        data.append('subject', 'New message from the Ana Mariposa Jewelry website');
        data.append('from_name', 'Ana Mariposa Jewelry website');
      }
      if (!url) {
        note.textContent = 'This form isn’t connected to Ana’s inbox yet, so your message was not sent. Please check back soon.';
        note.hidden = false;
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(url, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) { throw new Error('bad status'); }
          form.reset();
          note.textContent = 'Thank you! Your message was sent. Ana will be in touch soon.';
        })
        .catch(function () {
          note.textContent = 'Your message didn’t go through. Please try again in a few minutes.';
        })
        .then(function () { note.hidden = false; btn.disabled = false; btn.textContent = 'Send'; });
    });
  }
})();
