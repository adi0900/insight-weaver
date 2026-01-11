export const getApiBaseUrl = () => {
    // Priority 1: Explicit environment variable
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Priority 2: In browser, detect if we're on a Vercel deployment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // If we are on Vercel, and haven't specified an API URL, we can't guess easily 
        // unless it's a monorepo setup where the API is also on the same host or a relative path.
        // For now, let's look for common patterns.
        if (hostname.includes('vercel.app') && !hostname.includes('localhost')) {
            console.warn('[Env] Running on Vercel without NEXT_PUBLIC_API_URL.');
        }
    }

    return 'https://insight-weaver-api.onrender.com'; // Defaulting to your Render backend URL if possible
};

export const getTableauHost = () => {
    return process.env.NEXT_PUBLIC_TABLEAU_HOST || 'https://prod-in-a.online.tableau.com';
};

export const getTableauSite = () => {
    return process.env.NEXT_PUBLIC_TABLEAU_SITE_ID || 'nilambhojwaningp-2072bfe41a';
};

