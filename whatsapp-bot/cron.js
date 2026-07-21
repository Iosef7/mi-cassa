const cron = require('node-cron');
const { PrismaClient } = require('../prisma/generated/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function initScheduler(sessions, messageQueue, processMessageQueue) {
    console.log('[Scheduler] Initializing cron jobs...');

    // 1. WhatsApp Status Publisher (Runs every minute)
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const scheduledStatuses = await prisma.whatsappStatus.findMany({
                where: {
                    status: 'SCHEDULED',
                    publishAt: { lte: now }
                }
            });

            if (scheduledStatuses.length === 0) return;

            for (const statusRow of scheduledStatuses) {
                // Check expiration
                if (statusRow.expiresAt && new Date(statusRow.expiresAt) < now) {
                    console.log(`[Scheduler] Status ${statusRow.id} has expired. Marking as EXPIRED.`);
                    await prisma.whatsappStatus.update({
                        where: { id: statusRow.id },
                        data: { status: 'EXPIRED' }
                    });
                    continue;
                }

                // Prepare parameters
                let sessionIds = [];
                try {
                    sessionIds = JSON.parse(statusRow.sessionIds);
                } catch (e) {
                    console.error(`[Scheduler] Invalid sessionIds JSON for status ${statusRow.id}`);
                    continue;
                }

                let mediaUrls = [];
                try {
                    mediaUrls = JSON.parse(statusRow.mediaUrls);
                } catch (e) {}

                // Since we only support one media file per status in our queue logic:
                const mediaPath = mediaUrls.length > 0 ? path.join(process.cwd(), '..', 'public', mediaUrls[0]) : null;

                let queuedCount = 0;
                for (const sessionId of sessionIds) {
                    const session = sessions.get(sessionId);
                    if (session && session.isConnected) {
                        messageQueue.push({
                            type: 'status',
                            sessionId,
                            content: statusRow.caption || "",
                            mediaPath
                        });
                        queuedCount++;
                    } else {
                        console.log(`[Scheduler] Session ${sessionId} not connected, skipping status ${statusRow.id}`);
                    }
                }

                // If at least one was queued, we trigger the queue processor
                if (queuedCount > 0) {
                    processMessageQueue();
                }

                // Handle recurrence or completion
                if (statusRow.recurringInterval === 'WEEKLY') {
                    const nextPublish = new Date(statusRow.publishAt);
                    nextPublish.setDate(nextPublish.getDate() + 7);
                    await prisma.whatsappStatus.update({
                        where: { id: statusRow.id },
                        data: { publishAt: nextPublish, publishedAt: new Date() }
                    });
                    console.log(`[Scheduler] Processed weekly status ${statusRow.id}, next run at ${nextPublish.toISOString()}`);
                } else {
                    await prisma.whatsappStatus.update({
                        where: { id: statusRow.id },
                        data: { status: 'PUBLISHED', publishedAt: new Date() }
                    });
                    console.log(`[Scheduler] Processed one-off status ${statusRow.id}, marked as PUBLISHED`);
                }
            }
        } catch (err) {
            console.error('[Scheduler] Error processing scheduled statuses:', err);
        }
    });

    // 2. Garbage Collector (Runs every day at 3:00 AM)
    cron.schedule('0 3 * * *', async () => {
        try {
            console.log('[GC] Running status media garbage collector...');
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const oldStatuses = await prisma.whatsappStatus.findMany({
                where: {
                    status: 'PUBLISHED',
                    publishedAt: { lt: sevenDaysAgo }
                }
            });

            for (const statusRow of oldStatuses) {
                let mediaUrls = [];
                try {
                    mediaUrls = JSON.parse(statusRow.mediaUrls);
                } catch (e) {}

                for (const mediaUrl of mediaUrls) {
                    const filePath = path.join(process.cwd(), '..', 'public', mediaUrl);
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                            console.log(`[GC] Deleted file ${filePath}`);
                        } catch (err) {
                            console.error(`[GC] Error deleting file ${filePath}`, err);
                        }
                    }
                }

                await prisma.whatsappStatus.update({
                    where: { id: statusRow.id },
                    data: { status: 'CLEANED' }
                });
            }
            console.log('[GC] Garbage collection completed.');
        } catch (err) {
            console.error('[GC] Error in Garbage Collector:', err);
        }
    });
}

module.exports = { initScheduler };
