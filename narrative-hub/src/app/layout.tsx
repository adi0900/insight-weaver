import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Insight Weaver | AI-Driven Analytics Narratives',
    description:
        'Transform fragmented enterprise data into collaborative, AI-driven narratives that drive decisions. Powered by Tableau Cloud and Salesforce Data Cloud.',
    keywords: [
        'analytics',
        'AI',
        'Tableau',
        'Salesforce',
        'data visualization',
        'business intelligence',
        'narratives',
    ],
    authors: [{ name: 'Insight Weaver Team' }],
    openGraph: {
        title: 'Insight Weaver',
        description: 'AI-Driven Analytics Narratives',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${playfair.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link rel="icon" href="data:," />
                <script
                    type="module"
                    src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
                    async
                ></script>
            </head>
            <body className="min-h-screen bg-white dark:bg-slate-900">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
