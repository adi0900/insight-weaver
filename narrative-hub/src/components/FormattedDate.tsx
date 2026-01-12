'use client';

import { useEffect, useState } from 'react';

interface FormattedDateProps {
    date: Date | string | number;
    format?: 'time' | 'date' | 'full';
    className?: string;
}

export function FormattedDate({ date, format = 'time', className = '' }: FormattedDateProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className={className}>--:--</span>;
    }

    const dateObj = new Date(date);

    let display = '';
    if (format === 'time') {
        display = dateObj.toLocaleTimeString();
    } else if (format === 'date') {
        display = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else {
        display = dateObj.toLocaleString();
    }

    return <span className={className}>{display}</span>;
}
