import React, { useEffect, useState } from 'react';
import { getGHSDate, formatGHS } from 'ghs-time';
import './popup.css';

const Popup = () => {
    const [now, setNow] = useState(getGHSDate());

    useEffect(() => {
        const timer = setInterval(() => setNow(getGHSDate()), 864); // Update ca. alle 10 Centibeats
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-64 p-4 bg-[#faf9f6] text-charcoal">
            <h1 className="text-sm font-bold opacity-50 uppercase tracking-widest">Global Horizon Standard</h1>

            <div className="my-4">
                <div className="text-4xl font-mono font-bold text-yellow-600">
                    {now.beatsLong}
                </div>
                <div className="text-lg opacity-80">
                    {formatGHS(now, "text")}
                </div>
            </div>

            <div className="text-xs border-t pt-2 opacity-60 flex justify-between items-end">
                <div>
                    <div>{now.weekday}</div>
                    <div>
                        {now.month ? `Month ${now.month} (${now.monthName})` : now.monthName}
                    </div>
                </div>
                {now.isAuroraYear && (
                    <div className="flex flex-col items-end gap-1">
                        <span className="px-1 py-0.5 rounded bg-teal-100 text-teal-800 text-[8px] font-bold uppercase tracking-widest">
                            Aurora Year
                        </span>
                    </div>
                )}
            </div>

            <button
                onClick={() => chrome.tabs.create({ url: 'https://ghs-time.vercel.app' })}
                className="mt-4 w-full text-[10px] uppercase tracking-tighter hover:underline"
            >
                Open Dashboard →
            </button>
        </div>
    );
};

export default Popup;