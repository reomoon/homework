// Service Worker for background notifications
self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// 백그라운드에서 메시지 수신
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'START_TIMER') {
        const { duration, startTime } = event.data;
        
        // 타이머 완료 시점 계산
        const endTime = startTime + (duration * 1000);
        const delay = endTime - Date.now();
        
        if (delay > 0) {
            setTimeout(() => {
                // 백그라운드에서 알림 표시
                self.registration.showNotification('⏰ 타이머 종료!', {
                    body: '설정한 시간이 끝났습니다. 수고하셨어요! 🎉',
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'timer-alarm',
                    requireInteraction: true,
                    actions: [
                        {
                            action: 'view',
                            title: '확인'
                        }
                    ]
                });
                
                // 클라이언트에게 타이머 완료 메시지 전송
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'TIMER_COMPLETED'
                        });
                    });
                });
            }, delay);
        }
    }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // 앱 창을 포커스하거나 열기
    event.waitUntil(
        self.clients.matchAll().then(clients => {
            if (clients.length > 0) {
                // 기존 창이 있으면 포커스
                return clients[0].focus();
            } else {
                // 새 창 열기
                return self.clients.openWindow('/');
            }
        })
    );
});