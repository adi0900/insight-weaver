export const getApiBaseUrl = () => {
    // Priority 1: Explicit environment variable
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Priority 2: In browser, detect environment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001';
        }

        if (hostname.includes('vercel.app')) {
            console.warn('[Env] Running on Vercel without NEXT_PUBLIC_API_URL.');
        }
    }

    return 'https://insight-weaver-api.onrender.com';
};

export const getTableauHost = () => {
    return process.env.NEXT_PUBLIC_TABLEAU_HOST || 'https://prod-in-a.online.tableau.com';
};

export const getTableauSite = () => {
    return process.env.NEXT_PUBLIC_TABLEAU_SITE_ID || 'nilambhojwaningp-2072bfe41a';
};

