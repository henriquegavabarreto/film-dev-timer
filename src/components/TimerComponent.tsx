"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import StepInfo from '@/types/StepInfo';
import TimerClass from '@/lib/TimerClass';
import DurationDisplay from './DurationDisplay';

// interactive timer based on TimerClass
export default function TimerComponent(props: { stepInfo: StepInfo , hasActiveTimer: boolean, onTimerChange: (value: boolean) => void}) {
    const { title, description, duration, startAgitationDuration, agitationInterval, agitationDuration } = props.stepInfo;

    const onComplete = () => {
        setIsActive(false);
        props.onTimerChange(false);
    }

    // Timer state and instance
    const [timer] = useState(() => new TimerClass(duration, startAgitationDuration, agitationInterval, agitationDuration, onComplete));
    const [isActive, setIsActive] = useState(false); // Track if timer is active
    const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time
    const [checked, setChecked] = useState(false);

    // UEffect to update elapsed time when timer is active
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                setElapsedTime(timer.elapsedTime);
            }, 50);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval); // Clean up on component unmount
        };
    }, [isActive, timer]);

    // Handle button click to start or reset the timer
    const handleButtonClick = () => {
        if (isActive) {
            // Reset the timer if active
            timer.stop();
            setIsActive(false);
            setElapsedTime(0);
            props.onTimerChange(false);
        } else { // Start the timer if not active
            if(props.hasActiveTimer) return; // cannot start timer if another timer is already active
            timer.start();
            setIsActive(true);
            props.onTimerChange(true);
        }
    };

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        if(isActive) { // cannot check if this timer is active
            setChecked(false);
            return;
        }

        setChecked(e.target.checked);
    }

    return (
        <div className="m-5 flex flex-row justify-start items-center">
            <input type="checkbox" checked={checked} onChange={handleCheck}className="m-2 size-5"/>
            <div className={`grow border-2 ${checked ? 'border-lime-700' : 'border-zinc-400'} rounded-lg p-5`}>
                <h5 className="p-2 text-xl font-bold">{title}</h5>
                <p className="p-2 whitespace-pre-line">{description}</p>
                <div>
                    <p className="p-2">Remaining Time: <DurationDisplay {...timer.timeRemaining} /></p>
                    <p className="p-2">Agitation Starts in: <DurationDisplay {...timer.NextAgitationStartsIn} /></p>
                    <p className="p-2">Agitation Ends in: <DurationDisplay {...timer.NextAgitationEndsIn} /></p>
                </div>
                <div className="text-end">
                    <button
                        disabled={checked}
                        className="disabled:border-zinc-300 disabled:text-zinc-300 disabled:hover:bg-inherit font-semibold text-lime-600 border-2 border-lime-600 transition ease-in-out hover:bg-lime-600 hover:text-white py-2 px-4 rounded-md"
                        onClick={handleButtonClick}>{isActive ? 'Reset Timer' : !checked ? 'Start Timer' : 'Disabled'}
                    </button>
                </div>
            </div>
        </div>
    );
}
