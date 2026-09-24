const OWNER_EMAIL = 'ameliashap@gmail.com';
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'} });
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function database(env) { if (!env.DB) throw new Error('Contact database unavailable'); return env.DB; }
function owner(request) { return !!request.headers.get('oai-authenticated-user-id') && request.headers.get('oai-authenticated-user-email')?.toLowerCase() === OWNER_EMAIL; }
function html(content, status = 200) { return new Response(content, { status, headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"frame-ancestors 'self' https://chatgpt.com; base-uri 'self'; form-action 'self'"} }); }
function inboxPage(body) { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Contact inbox | Amelia Shapiro</title><style>body{font:16px/1.6 Arial,sans-serif;color:#f3edf9;background:#141019;color-scheme:dark;margin:0}main{max-width:820px;margin:auto;padding:40px 24px}h1{font:40px Georgia,serif}a{color:#c49aff}article{background:#251c31;border:1px solid #40334f;border-radius:8px;padding:24px;margin:20px 0}h2{font-size:20px;margin:0}time{font-size:14px;color:#c0b4ce}.message{white-space:pre-wrap;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #c49aff;outline-offset:4px}</style></head><body><main><a href="/#contact">Back to portfolio</a><h1>Contact inbox</h1>${body}</main></body></html>`; }
async function limitedText(request) {
  if (Number(request.headers.get('content-length')) > 32768) return null;
  const reader = request.body?.getReader(); if (!reader) return '';
  let size = 0; const chunks = [];
  while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > 32768) { await reader.cancel(); return null; } chunks.push(value); }
  const bytes = new Uint8Array(size); let offset=0; for (const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.length; } return new TextDecoder().decode(bytes);
}
async function contact(request, env) {
  if (request.method !== 'POST') return json({error:'Method not allowed.'},405);
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({error:'Please send your message from the contact form.'},403);
  const type = request.headers.get('content-type') || '';
  if (!type.startsWith('application/json') && !type.startsWith('application/x-www-form-urlencoded')) return json({error:'Unsupported request.'},415);
  const raw = await limitedText(request); if (raw === null) return json({error:'Your message is too long.'},413);
  let data; try { data = type.startsWith('application/json') ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw)); } catch { return json({error:'Please check your message and try again.'},400); }
  if (!data || typeof data !== 'object') return json({error:'Please complete all fields.'},400);
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!name || name.length>100 || !email || email.length>254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !message || message.length>5000 || data.website) return json({error:'Enter your name, a valid email address, and a message of up to 5,000 characters.'},400);
  const id = typeof data.id === 'string' && /^[a-f0-9-]{36}$/i.test(data.id) ? data.id : crypto.randomUUID();
  const identity = request.headers.get('cf-connecting-ip') || request.headers.get('oai-authenticated-user-id') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new URL(request.url).hostname+':'+identity));
  const senderHash = Array.from(new Uint8Array(digest), x=>x.toString(16).padStart(2,'0')).join('');
  const db=database(env), now=Date.now();
  const existing=await db.prepare('SELECT id FROM contact_messages WHERE id = ? AND sender_hash = ?').bind(id,senderHash).first();
  if (!existing) {
    const recent=await db.prepare('SELECT COUNT(*) AS count FROM contact_messages WHERE sender_hash = ? AND created_at > ?').bind(senderHash,now-600000).first();
    if (recent.count>=5) return json({error:'You have sent several messages recently. Please try again in 10 minutes.'},429);
    await db.prepare('INSERT INTO contact_messages (id,name,email,message,created_at,sender_hash) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,name,email,message,now,senderHash).run();
  }
  return type.startsWith('application/json') ? json({ok:true}) : new Response(null,{status:303,headers:{Location:'/?contact=sent#contact','Cache-Control':'no-store'}});
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/contact') return await contact(request,env);
      if (url.pathname === '/inbox') {
        if (!request.headers.get('oai-authenticated-user-id')) return new Response(null,{status:302,headers:{Location:'/signin-with-chatgpt?return_to=%2Finbox','Cache-Control':'no-store'}});
        if (!owner(request)) return html(inboxPage('<p>This inbox is available only to the site owner.</p>'),403);
        if (request.method!=='GET') return new Response('Method not allowed',{status:405});
        const page=Math.min(10000,Math.max(0,Number.parseInt(url.searchParams.get('page')||'0',10)||0));
        const {results}=await database(env).prepare('SELECT name,email,message,created_at FROM contact_messages ORDER BY created_at DESC LIMIT 51 OFFSET ?').bind(page*50).all();
        const body=results.slice(0,50).map(m=>`<article><h2>${escape(m.name)}</h2><a href="mailto:${escape(encodeURIComponent(m.email))}">${escape(m.email)}</a><br><time>${escape(new Date(m.created_at).toISOString().replace('T',' ').replace('Z',' UTC'))}</time><p class="message">${escape(m.message)}</p></article>`).join('') || '<p>No messages yet. New contact submissions will appear here.</p>';
        return html(inboxPage('<p>Messages submitted through your portfolio. No email notifications are sent.</p>'+body+(page>0?`<a href="/inbox?page=${page-1}">Newer messages</a> · `:'')+(results.length>50?`<a href="/inbox?page=${page+1}">Older messages</a>`:'')));
      }
      if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405});
      const asset = ASSETS[url.pathname==='/'?'/index.html':url.pathname];
      if (!asset) return new Response('Not found',{status:404});
      const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
      if (asset.type.startsWith('text/html')) {
        let page=new TextDecoder().decode(bytes);
        if(owner(request)) page=page.replace('<p>© 2026 Amelia Shapiro</p>','<p>© 2026 Amelia Shapiro</p><a href="/inbox">My contact inbox</a>');
        return html(request.method==='HEAD'?'':page);
      }
      return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'}});
    } catch(error) {
      console.error('Portfolio request failed:', error instanceof Error ? error.message : 'Unknown error');
      return url.pathname === '/api/contact' ? json({error:'Your message could not be saved right now. Please try again shortly.'},503) : html(inboxPage('<p>The inbox is temporarily unavailable. Please try again shortly.</p>'),503);
    }
  }
};
