'use client';

import Duration from "@/types/Duration";
import { useEffect, useState } from "react";

// Custom input for timer duration
export default function DurationSelector(props: { title: string, clue: string, value: Duration, onDurationChange: (duration: Duration) => void }) {
    const [duration, setDuration] = useState<Duration>(props.value);

    // Update duration if the parent value changes (on edit)
    useEffect(() => {
        setDuration(props.value);
    }, [props.value]);

    // trigger onDurationChange whenever the duration is updated
    useEffect(() => {
        props.onDurationChange(duration);
    }, [duration]);

    // handle input change for duration values
    const handleChange = (field: keyof Duration, newValue: number) => {
        if (isNaN(newValue) || newValue < 0) newValue = 0; // Ensure non-negative values
        if ((field === 'm' || field === 's') && newValue > 59) {
            newValue = 59; // Cap minutes and seconds at 59
        }
        const updatedDuration = { ...duration, [field]: newValue };
        setDuration(updatedDuration);
    };

    return (
        <div className="p-4 rounded-md shadow-md">
            <h5>{props.title}</h5>
            <div className="mb-1 text-xs text-zinc-500">{props.clue}</div>
            <div>
                <input
                    className="mr-1 w-12 border border-zinc-400 rounded-sm text-zinc-600 dark:text-zinc-600"
                    type="number"
                    min="0"
                    value={duration.h}
                    onChange={(e) => handleChange('h', parseInt(e.target.value))}
                    placeholder="Hours"
                />
                <span>h</span>
                <input
                    className="mr-1 ml-4 w-12 border border-zinc-400 rounded-sm text-zinc-600 dark:text-zinc-600"
                    type="number"
                    min="0"
                    max="59"
                    value={duration.m}
                    onChange={(e) => handleChange('m', parseInt(e.target.value))}
                    placeholder="Minutes"
                />
                <span>m</span>
                <input
                    className="mr-1 ml-4 w-12 border border-zinc-400 rounded-sm text-zinc-600 dark:text-zinc-600"
                    type="number"
                    min="0"
                    max="59"
                    value={duration.s}
                    onChange={(e) => handleChange('s', parseInt(e.target.value))}
                    placeholder="Seconds"
                />
                <span>s</span>
            </div>
        </div>
    );
};