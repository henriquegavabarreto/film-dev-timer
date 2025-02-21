'use client';

import { useEffect, useState } from "react";

// Custom input for Developer dilution
export default function Dilution({ handleDilutionChange, initialValue }: { handleDilutionChange: (dilution: string) => void, initialValue?: string }) {
    // set initial values when editing a workflow
    const [solute, setSolute] = useState(initialValue ?
        initialValue.slice(0, initialValue.indexOf('+')).trim() :
        '0');
    const [solvent, setSolvent] = useState(initialValue ?
        initialValue.slice(initialValue.indexOf('+') + 1).trim() :
        '0');
    
    useEffect(() => {
        handleDilutionChange(`${solute} + ${solvent}`);
    },[solvent, solute])

    return (
        <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
            <label htmlFor="dilution">Dilution</label>
            <div id="dilution" className="flex flex-row">
                <input
                    maxLength={5}
                    className="text-center w-16 border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                    type="number"
                    id="solute"
                    min="0"
                    value={solute}
                    onChange={(e) => setSolute(e.target.value)}/>
                <span className="mx-1">+</span>
                <input
                    maxLength={5}
                    className="text-center w-16 border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                    type="number"
                    id="solvent"
                    min="0"
                    value={solvent}
                    onChange={(e) => setSolvent(e.target.value)}/>
            </div>
        </div>
    );
}