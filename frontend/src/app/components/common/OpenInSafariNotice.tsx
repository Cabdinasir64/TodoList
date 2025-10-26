'use client';
import { useEffect, useState } from 'react';

export default function OpenInSafariNotice() {
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || '';
        if (/WhatsApp|FBAV|Instagram/i.test(ua)) {
            setShowNotice(true);
        }
    }, []);

    if (!showNotice) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 text-center p-4 shadow-md border-t border-yellow-300 z-50">
            <p className="text-sm text-gray-800">
                It looks like you opened this link inside WhatsApp or another app browser. <br />
                For the best experience, please open in Safari.
            </p>
            <a
                href="https://todo-list-cyan-zeta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700"
            >
                Open in Safari
            </a>
        </div>
    );
}
