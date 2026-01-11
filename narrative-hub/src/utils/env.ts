export const getApiBaseUrl = () => {
    // Priority 1: Explicit environment variable
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Priority 2: In browser, detect if we're on a Vercel deployment and try to guess the API URL
    // (This is a fallback for when people forget to set the env var)
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('vercel.app')) {
            // If the API server is also on Vercel, it might be on a different subdomain or the same one
            // But usually for separate repos, they have different URLs.
            // For now, we'll just log a helpful hint.
            console.warn('[Env] NEXT_PUBLIC_API_URL is missing. API calls to localhost will fail in production.');
        }
    }

    return 'http://localhost:3001';
};
