const { initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');

module.exports = async function usePostgresAuthState(prisma, sessionId) {
    const writeData = async (keyId, data) => {
        try {
            const keyData = JSON.stringify(data, BufferJSON.replacer);
            await prisma.whatsAppAuth.upsert({
                where: {
                    sessionId_keyId: {
                        sessionId,
                        keyId
                    }
                },
                create: {
                    sessionId,
                    keyId,
                    keyData
                },
                update: {
                    keyData
                }
            });
        } catch (e) {
            console.error(`Error writing auth state for ${keyId}:`, e.message);
        }
    };

    const readData = async (keyId) => {
        try {
            const record = await prisma.whatsAppAuth.findUnique({
                where: {
                    sessionId_keyId: {
                        sessionId,
                        keyId
                    }
                }
            });
            if (record && record.keyData) {
                return JSON.parse(record.keyData, BufferJSON.reviver);
            }
            return null;
        } catch (e) {
            console.error(`Error reading auth state for ${keyId}:`, e.message);
            return null;
        }
    };

    const removeData = async (keyId) => {
        try {
            await prisma.whatsAppAuth.deleteMany({
                where: {
                    sessionId,
                    keyId
                }
            });
        } catch (e) {}
    };

    const creds = await readData('creds') || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async id => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                const { proto } = require('@whiskeysockets/baileys');
                                value = proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const keyId = `${category}-${id}`;
                            if (value) {
                                tasks.push(writeData(keyId, value));
                            } else {
                                tasks.push(removeData(keyId));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => {
            return writeData('creds', creds);
        }
    };
};
