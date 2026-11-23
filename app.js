'use strict';
const textNodes = [...document.querySelectorAll('[data-t]')];
const japanese = Object.fromEntries(textNodes.map(node => [node.dataset.t,node.innerHTML]));
const altNodes = [...document.querySelectorAll('[data-alt]')];
altNodes.forEach(image => { japanese[image.dataset.alt] = image.alt; });
japanese.meta = document.querySelector('meta[name="description"]').content;
window.translations.ja = japanese;
const supported = ['ja','en','es','pt-BR'];
const selector = document.querySelector('#language');
function renderScreenshots(language) {
  const gallery = document.querySelector('#screenshot-grid');
  gallery.replaceChildren();
  const screenshots = window.workshopApps[0].screenshots;
  document.querySelector('#screenshots').hidden = !screenshots.length;
  for (const shot of screenshots) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = shot.src;
    img.alt = shot.alt[language] || shot.alt.ja;
    img.loading = 'lazy';
    img.width = shot.width;
    img.height = shot.height;
    const caption = document.createElement('figcaption'); caption.textContent = img.alt;
    figure.append(img,caption); gallery.append(figure);
  }
}
function setLanguage(language, persist = false) {
  if (!supported.includes(language)) language = 'ja';
  const strings = window.translations[language];
  textNodes.forEach(node => { node.innerHTML = strings[node.dataset.t] || japanese[node.dataset.t]; });
  altNodes.forEach(image => { image.alt = strings[image.dataset.alt] || japanese[image.dataset.alt]; });
  document.documentElement.lang = language;
  document.title = `${strings.studio} — MuShelf`;
  document.querySelector('meta[name="description"]').content = strings.meta;
  document.querySelector('.header .brand').setAttribute('aria-label',strings.studio);
  document.querySelector('nav').setAttribute('aria-label',strings.navApps);
  selector.setAttribute('aria-label',strings.language);
  selector.value = language;
  document.querySelectorAll('[data-play]').forEach(link => {
    const url = new URL(window.workshopApps[0].playUrl); url.searchParams.set('hl',language); link.href = url.href;
  });
  renderScreenshots(language);
  if (persist) {
    try { localStorage.setItem('norichan-language',language); } catch {}
    try { const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url); } catch {}
  }
}
selector.addEventListener('change',() => setLanguage(selector.value,true));
let saved; try { saved = localStorage.getItem('norichan-language'); } catch {}
const requested = new URLSearchParams(location.search).get('lang');
setLanguage(requested || saved || 'ja');
document.querySelector('#year').textContent = new Date().getFullYear();
