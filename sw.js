// Service Worker for background notifications
const CACHE_NAME = 'homework-timer-v1';

self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// 타이머 저장소
let activeTimers = new Map();

// 백그라운드에서 메시지 수신
self.addEventListener('message', function(event) {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'START_TIMER') {
        const { duration, startTime, userId } = event.data;
        const timerId = `${userId}_${startTime}`;
        
        console.log('Starting timer:', { duration, startTime, userId });
        
        // 기존 타이머가 있으면 취소
        if (activeTimers.has(timerId)) {
            clearTimeout(activeTimers.get(timerId));
        }
        
        // 타이머 완료 시점 계산
        const endTime = startTime + (duration * 1000);
        const delay = endTime - Date.now();
        
        console.log('Timer delay:', delay, 'ms');
        
        if (delay > 0) {
            const timeoutId = setTimeout(async () => {
                console.log('Timer completed, showing notification');
                
                try {
                    // 백그라운드에서 강력한 알림 표시
                    await self.registration.showNotification('⏰ 타이머 종료!', {
                        body: `${userId}의 타이머가 완료되었습니다! 🎉`,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
                        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
                        tag: `timer-alarm-${userId}`,
                        requireInteraction: true,
                        silent: false,
                        vibrate: [200, 100, 200, 100, 200],
                        actions: [
                            {
                                action: 'view',
                                title: '확인',
                                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✅</text></svg>'
                            },
                            {
                                action: 'snooze',
                                title: '5분 더',
                                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏱️</text></svg>'
                            }
                        ],
                        data: {
                            userId: userId,
                            completedAt: Date.now()
                        }
                    });
                    
                    console.log('Notification shown successfully');
                } catch (error) {
                    console.error('Failed to show notification:', error);
                }
                
                // 클라이언트에게 타이머 완료 메시지 전송
                try {
                    const clients = await self.clients.matchAll();
                    console.log('Sending message to clients:', clients.length);
                    
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'TIMER_COMPLETED',
                            userId: userId,
                            completedAt: Date.now()
                        });
                    });
                } catch (error) {
                    console.error('Failed to send message to clients:', error);
                }
                
                // 타이머 제거
                activeTimers.delete(timerId);
            }, delay);
            
            // 타이머 ID 저장
            activeTimers.set(timerId, timeoutId);
            console.log('Timer stored with ID:', timerId);
        } else {
            console.log('Timer already expired');
        }
    } else if (event.data && event.data.type === 'CANCEL_TIMER') {
        const { userId, startTime } = event.data;
        const timerId = `${userId}_${startTime}`;
        
        if (activeTimers.has(timerId)) {
            clearTimeout(activeTimers.get(timerId));
            activeTimers.delete(timerId);
            console.log('Timer cancelled:', timerId);
        }
    }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event.action);
    event.notification.close();
    
    if (event.action === 'snooze') {
        // 5분 추가 타이머 설정
        const userId = event.notification.data.userId;
        const snoozeTime = 5 * 60; // 5분
        const startTime = Date.now();
        
        setTimeout(async () => {
            await self.registration.showNotification('⏰ 스누즈 타이머 종료!', {
                body: `${userId}의 추가 5분이 완료되었습니다! 🎉`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
                tag: `snooze-alarm-${userId}`,
                requireInteraction: true,
                vibrate: [200, 100, 200]
            });
        }, snoozeTime * 1000);
        
        return;
    }
    
    // 기본 동작: 앱 창을 포커스하거나 열기
    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clients => {
            // 기존 창이 있으면 포커스
            for (let client of clients) {
                if (client.url.includes('children-homework') && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // 새 창 열기
            if (self.clients.openWindow) {
                return self.clients.openWindow('./index.html');
            }
        })
    );
});

// 알림 닫기 처리
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed:', event.notification.tag);
});