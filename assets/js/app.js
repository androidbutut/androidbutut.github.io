document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('chat-search');
  const list = document.getElementById('chat-list');
  input?.addEventListener('input', function () {
    const term = input.value.toLowerCase();
    [...list.children].forEach(item => {
      const title = item.querySelector('.chat-title')?.textContent.toLowerCase() || '';
      item.style.display = title.includes(term) ? '' : 'none';
    });
  });
});
