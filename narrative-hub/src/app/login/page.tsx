'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi } from '@/services/api';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDemoLogin = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Use demo credentials
            const response = await authApi.login({
                email: 'nilambhojwaningp@gmail.com', // Use the configured user email
                password: 'password123'
            });

            if (response.success && response.token) {
                localStorage.setItem('iw_token', response.token);
                // Pre-set the public viz for demo purposes so it works out of the box
                localStorage.setItem('custom_viz_url', 'https://public.tableau.com/views/RegionalSampleWorkbook/Storms');
                router.push('/dashboard');
            } else {
                throw new Error('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to log in. Please check backend connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Insight Weaver</h1>
                    <p className="text-slate-400">Enterprise Analytics Agent</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            <span className="text-slate-200 font-medium">Secure Demo Access</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Access the full platform using our pre-configured demo account.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                        className="w-full h-12 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Enter Demo Interface
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-4">
                        Powered by Tableau Cloud & Salesforce Data Cloud
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
