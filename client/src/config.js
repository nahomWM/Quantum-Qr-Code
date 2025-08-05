export const getWorkerUrl = () => {
    return localStorage.getItem('worker_url') || 'https://smart-qr-worker.weldemdhinnahom.workers.dev';
};

export const API_ENDPOINTS = {
    UPLOAD: () => `${getWorkerUrl()}/upload`,
    METADATA: () => `${getWorkerUrl()}/metadata`,
    ANALYTICS: (id) => `${getWorkerUrl()}/analytics/${id}`,
    BATCH_ANALYTICS: () => `${getWorkerUrl()}/batch-analytics`,
    QR: (id) => `${getWorkerUrl()}/qr/${id}`
};
