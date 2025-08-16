/**
 * Smart Quantum QR Worker - Refactored
 * Handles QR scanning, redirection, file serving, and analytics.
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // API Route dispatcher
            if (path.startsWith('/qr/')) {
                const qrId = path.split('/')[2];
                return await handleQRScan(request, qrId, env);
            }

            if (path.startsWith('/analytics/')) {
                const qrId = path.split('/')[2];
                return await handleAnalytics(request, qrId, env);
            }

            if (path === '/batch-analytics') {
                return await handleBatchAnalytics(request, env);
            }

            if (path === '/upload') {
                return await handleFileUpload(request, env);
            }

            if (path.startsWith('/metadata/')) {
                const key = path.split('/')[2];
                return await handleMetadataRequest(request, key, env);
            }

            if (path === '/metadata') {
                return await handleMetadataRequest(request, null, env);
            }

            if (path.startsWith('/file/')) {
                const fileId = path.split('/')[2];
                return await handleFileServe(request, fileId, env);
            }

            // Health check or default response
            return new Response('Smart-QR API v2.0 - Active', {
                headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
            });

        } catch (error) {
            console.error('Worker runtime error:', error);
            return new Response(JSON.stringify({
                error: 'Internal Server Error',
                message: error.message
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};

/**
 * Handles the actual QR code scan redirection logic.
 */
async function handleQRScan(request, qrId, env) {
    try {
        const qrMetadata = await env.QR_METADATA.get(qrId, { type: 'json' });

        if (!qrMetadata) {
            return new Response('QR Code not found', { status: 404 });
        }

        const userLocation = getUserDetails(request);
        const currentTime = new Date().toISOString();

        // Record scan in background
        ctx.waitUntil(recordAnalytics(qrId, userLocation, currentTime, env));

        let targetFile = null;
        if (qrMetadata.type === 'time') {
            targetFile = getFileByTime(qrMetadata.configurations, currentTime);
        } else if (qrMetadata.type === 'location') {
            targetFile = getFileByLocation(qrMetadata.configurations, userLocation);
        }

        if (!targetFile) {
            return new Response('No content available for current conditions', { status: 404 });
        }

        const fileInfo = await env.QR_METADATA.get(`file-${targetFile.fileId}`, { type: 'json' });
        if (!fileInfo) {
            return new Response('Content file meta not found', { status: 404 });
        }

        // Fetch from B2
        const b2Response = await fetch(fileInfo.b2Url, {
            headers: {
                'Authorization': `Basic ${btoa(`${env.B2_APPLICATION_KEY_ID}:${env.B2_APPLICATION_KEY}`)}`
            }
        });

        if (!b2Response.ok) {
            return new Response('Failed to retrieve content from storage', { status: 502 });
        }

        const fileBuffer = await b2Response.arrayBuffer();
        const headers = new Headers();
        headers.set('Content-Type', fileInfo.type || 'application/octet-stream');
        headers.set('Content-Disposition', `inline; filename="${fileInfo.originalName}"`);
        headers.set('Cache-Control', 'public, max-age=3600');

        return new Response(fileBuffer, { headers });

    } catch (error) {
        console.error('Scan processing error:', error);
        return new Response('Error processing scan', { status: 500 });
    }
}

/**
 * Enhanced user details extraction
 */
function getUserDetails(request) {
    const cf = request.cf || {};
    return {
        country: cf.country || 'Unknown',
        region: cf.region || 'Unknown',
        city: cf.city || 'Unknown',
        ip: request.headers.get('cf-connecting-ip') || 'Unknown',
        userAgent: request.headers.get('user-agent') || 'Unknown'
    };
}

/**
 * Analytics recording with cleaner structure
 */
async function recordAnalytics(qrId, details, timestamp, env) {
    try {
        const key = `analytics-${qrId}`;
        let data = await env.QR_METADATA.get(key, { type: 'json' }) || {
            total: 0,
            byCountry: {},
            byCity: {},
            devices: { 'Mobile': 0, 'Desktop': 0, 'Tablet': 0, 'Other': 0 },
            scans: []
        };

        data.total++;
        data.lastScan = timestamp;

        const country = details.country;
        const city = details.city;

        // Simple Device Detection
        const ua = details.userAgent.toLowerCase();
        let device = 'Desktop';
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            device = 'Tablet';
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            device = 'Mobile';
        }
        data.devices = data.devices || { 'Mobile': 0, 'Desktop': 0, 'Tablet': 0, 'Other': 0 };
        data.devices[device] = (data.devices[device] || 0) + 1;

        data.byCountry[country] = (data.byCountry[country] || 0) + 1;
        data.byCity[city] = (data.byCity[city] || 0) + 1;

        data.scans.push({
            t: timestamp,
            c: country,
            ci: city,
            ua: details.userAgent
        });

        // Trim history to prevent KV size issues
        if (data.scans.length > 200) data.scans.shift();

        // Generate Live Insights
        data.insights = generateInsights(data);

        await env.QR_METADATA.put(key, JSON.stringify(data));
    } catch (err) {
        console.error('Analytics record failed:', err);
    }
}

function generateInsights(data) {
    const insights = [];

    // 1. Peak Time Analysis
    const hours = data.scans.map(s => new Date(s.t).getHours());
    if (hours.length > 10) {
        const counts = {};
        hours.forEach(h => counts[h] = (counts[h] || 0) + 1);
        const peakHour = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        insights.push({
            type: 'peak_time',
            title: 'Peak Activity',
            message: `Most scans occur around ${peakHour}:00. Considerations for time-based content changes?`,
            color: 'text-emerald-400'
        });
    }

    // 2. Location Dominance
    const sortedCountries = Object.entries(data.byCountry).sort((a, b) => b[1] - a[1]);
    if (sortedCountries.length > 0) {
        const topCountry = sortedCountries[0];
        const percent = Math.round((topCountry[1] / data.total) * 100);
        if (percent > 40) {
            insights.push({
                type: 'geo_dominance',
                title: 'Targeting Opportunity',
                message: `${percent}% of traffic is from ${topCountry[0]}. Localized content could boost conversion.`,
                color: 'text-orange-400'
            });
        }
    }

    return insights;
}

/**
 * API: Get Analytics
 */
async function handleAnalytics(request, qrId, env) {
    const data = await env.QR_METADATA.get(`analytics-${qrId}`, { type: 'json' });
    return new Response(JSON.stringify(data || { total: 0, scans: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

/**
 * API: File Upload
 */
async function handleFileUpload(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return new Response('No file provided', { status: 400 });

    const fileId = crypto.randomUUID();
    const storageName = `${fileId}-${file.name}`;
    const buffer = await file.arrayBuffer();

    // B2 Upload
    const b2Url = `${env.B2_ENDPOINT}/file/${env.B2_BUCKET_NAME}/${storageName}`;
    const sha1 = await generateHash(buffer, 'SHA-1');

    const b2Res = await fetch(b2Url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`${env.B2_APPLICATION_KEY_ID}:${env.B2_APPLICATION_KEY}`)}`,
            'Content-Type': file.type,
            'Content-Length': file.size.toString(),
            'X-Bz-File-Name': storageName,
            'X-Bz-Content-Sha1': sha1
        },
        body: buffer
    });

    if (!b2Res.ok) {
        const errText = await b2Res.text();
        throw new Error(`B2 Upload Failed: ${errText}`);
    }

    const result = {
        fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        b2Url,
        uploadedAt: new Date().toISOString()
    };

    await env.QR_METADATA.put(`file-${fileId}`, JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

/**
 * API: Metadata (QR configurations)
 */
async function handleMetadataRequest(request, key, env) {
    if (request.method === 'GET') {
        const data = await env.QR_METADATA.get(key, { type: 'json' });
        return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    if (request.method === 'POST') {
        const body = await request.json();
        const qrId = body.id || crypto.randomUUID();

        const meta = {
            type: body.type,
            configurations: body.configurations,
            files: body.files,
            createdAt: new Date().toISOString()
        };

        await env.QR_METADATA.put(qrId, JSON.stringify(meta));
        return new Response(JSON.stringify({ success: true, qrId }), { headers: corsHeaders });
    }

    if (request.method === 'DELETE') {
        await env.QR_METADATA.delete(key);
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response('Method not allowed', { status: 405 });
}

/**
 * API: Serve file directly
 */
async function handleFileServe(request, fileId, env) {
    const info = await env.QR_METADATA.get(`file-${fileId}`, { type: 'json' });
    if (!info) return new Response('File not found', { status: 404 });

    const b2Res = await fetch(info.b2Url, {
        headers: {
            'Authorization': `Basic ${btoa(`${env.B2_APPLICATION_KEY_ID}:${env.B2_APPLICATION_KEY}`)}`
        }
    });

    if (!b2Res.ok) return new Response('Storage error', { status: 502 });

    const buffer = await b2Res.arrayBuffer();
    return new Response(buffer, {
        headers: {
            ...corsHeaders,
            'Content-Type': info.type,
            'Content-Disposition': `attachment; filename="${info.name}"`
        }
    });
}

// Helpers
function getFileByTime(configs, current) {
    const time = new Date(current).toTimeString().slice(0, 5);
    for (const c of configs) {
        if (isTimeInRange(time, c.start, c.end)) return c;
    }
    return null;
}

function getFileByLocation(configs, loc) {
    for (const c of configs) {
        if (c.locationCode === loc.country) return c;
    }
    return null;
}

function isTimeInRange(curr, start, end) {
    const c = t2m(curr), s = t2m(start), e = t2m(end);
    return s <= e ? (c >= s && c <= e) : (c >= s || c <= e);
}

function t2m(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

async function generateHash(buffer, algo) {
    const hash = await crypto.subtle.digest(algo, buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function handleBatchAnalytics(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    try {
        const { ids } = await request.json();
        const results = await Promise.all(ids.map(async (id) => {
            const data = await env.QR_METADATA.get(`analytics-${id}`, { type: 'json' });
            return { id, ...(data || { total: 0, scans: [] }) };
        }));

        return new Response(JSON.stringify(results), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: corsHeaders
        });
    }
}
