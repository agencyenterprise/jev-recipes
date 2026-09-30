// Shared, progressively enhanced controls for the explorer and static guides.
export function addCopyButtons(root = document) {
  for (const pre of root.querySelectorAll('pre')) {
    if (pre.parentElement.classList.contains('code-block')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.addEventListener('click', () => copyText(button, pre.textContent));
    wrapper.append(button);
  }
}

async function copyText(button, text) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select to copy';
    const code = button.parentElement.querySelector('pre, code');
    if (code) {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  button.setAttribute('aria-live', 'polite');
  setTimeout(() => {
    button.textContent = 'Copy';
    button.removeAttribute('aria-live');
  }, 2000);
}
for (const button of document.querySelectorAll('[data-copy-text]'))
  button.addEventListener('click', () => copyText(button, button.dataset.copyText));
addCopyButtons();

for (const contents of document.querySelectorAll('.contents-disclosure')) {
  contents.open = !matchMedia('(max-width: 760px)').matches;
}
