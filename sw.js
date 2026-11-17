// 앱 화면 파일만 캐시해요. 서버(Supabase) 요청은 건드리지 않아요.
const C='hairi-court-v10';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./config.js','./manifest.webmanifest','./icon.svg'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});

// 웹 푸시: 앱이 닫혀 있어도 서버가 보낸 알림을 보여줘요
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'헤이리 테니스 코트',{body:d.body||'',icon:'icon.svg',badge:'icon.svg',tag:d.tag||undefined,renotify:!!d.tag,silent:false,vibrate:d.urgent?[500,200,500,200,500,200,900]:[250,120,250],requireInteraction:!!d.urgent,data:{url:d.url||'./'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return clients.openWindow(e.notification.data&&e.notification.data.url||'./')}));
});
