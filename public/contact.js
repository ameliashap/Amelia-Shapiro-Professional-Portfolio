const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
const button = form.querySelector('button');
let requestId = crypto.randomUUID();
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  button.disabled = true;
  button.textContent = 'Sending…';
  status.dataset.state = '';
  status.textContent = '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...Object.fromEntries(new FormData(form)), id:requestId}), signal:controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Your message could not be sent. Please try again.');
    form.reset();
    requestId = crypto.randomUUID();
    status.dataset.state = 'success';
    status.textContent = 'Your message has been sent. Thank you for getting in touch.';
  } catch (error) {
    status.dataset.state = 'error';
    status.textContent = error.name === 'AbortError' ? 'The connection timed out. Your text is still here; please try again.' : error instanceof TypeError ? 'Could not connect. Your text is still here; please try again.' : error.message;
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
    button.textContent = 'Send message';
    status.focus();
  }
});
if (new URLSearchParams(location.search).get('contact') === 'sent') {
  status.dataset.state = 'success';
  status.textContent = 'Your message has been sent. Thank you for getting in touch.';
}
