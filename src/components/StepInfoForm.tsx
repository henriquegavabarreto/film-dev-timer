'use client';

import { useCallback, useEffect, useState } from "react";
import StepInfo from "@/types/StepInfo";
import DurationSelector from "./DurationSelector";
import Duration from "@/types/Duration";
import parseDurationToMs from "@/lib/parseDurationToMs";

// Form to gather and save step information for a workflow
export default function StepInfoForm({ onSaveStep, editingStepInfo, onClose }: { onSaveStep: (info: StepInfo) => void, editingStepInfo?: StepInfo | null, onClose: () => void }) {
    const durationFields: {title: string, clue: string, key: keyof StepInfo}[] = [
        { title: "Duration", clue:"Total duration for this step", key: "duration" },
        { title: "Start Agitation Duration", clue:"Duration of initial agitation", key: "startAgitationDuration" },
        { title: "Agitation Interval", clue:"Time between repeated agitations", key: "agitationInterval" },
        { title: "Agitation Duration", clue:"Duration of each repeating agitation", key: "agitationDuration" }
      ];

    const defaultStepInfo = {
        id: Date.now().toString(),
        title: '',
        description: '',
        duration: { h: 0, m: 0, s: 0 },
        startAgitationDuration: { h: 0, m: 0, s: 0 },
        agitationInterval: { h: 0, m: 0, s: 0 },
        agitationDuration: { h: 0, m: 0, s: 0 }
    };

    const defaultFormUi = {formTitle: 'New Step', buttonText: 'Add Step'};
    const editingFormUi = {formTitle: 'Editing Step', buttonText: 'Update Step'};

    const [stepInfo, setStepInfo] = useState<StepInfo>(editingStepInfo || defaultStepInfo);
    const [uiText, setUiText] = useState<{formTitle: string, buttonText: string}>(editingStepInfo ? editingFormUi : defaultFormUi);

    const saveStep = (e: React.FormEvent): void => {
        e.preventDefault();
        if (stepInfo.title === '' || stepInfo.description === '' || parseDurationToMs(stepInfo.duration) <= 0) {
            alert('Title, Description and Duration must be filled to add a step.');
            return;
        }
        onSaveStep(stepInfo);
        setStepInfo(defaultStepInfo); // Reset the form after saving
        setUiText(defaultFormUi);
    };

    useEffect(() => {
        if (editingStepInfo) {
            setStepInfo(editingStepInfo); // Update the form when editingStepInfo changes
            setUiText(editingFormUi); // update ui to reflect user action
        }
    }, [editingStepInfo]);

    function closeDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        setStepInfo(defaultStepInfo);
        setUiText(defaultFormUi);
        onClose();
    }

    const handleDurationChange = useCallback(
        (key: string, duration: Duration) => {
            setStepInfo(prevState => ({
                ...prevState,
                [key]: duration
            }));
        }, [setStepInfo]
    );

    return (
        <div className="overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-600 bg-opacity-80">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative px-5 py-3 bg-white rounded-lg shadow">
                    <div className="pt-3 pb-5 flex flex-row justify-between">
                        <div className="font-semibold text-xl">{uiText.formTitle}</div>
                        <button
                            onClick={closeDialog}>X</button>
                    </div>
                    <div className="mx-3 my-2">
                        <div className="my-2 flex flex-col">
                            <label>Title: </label>
                            <input
                                className="border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                                type="text"
                                name="title"
                                placeholder="Step title"
                                value={stepInfo.title}
                                onChange={(e) => setStepInfo(prevState => ({ ...prevState, title: e.target.value }))}
                            />
                        </div>
                        <div className="my-2 flex flex-col">
                            <label>Description: </label>
                            <textarea
                                className="resize-none border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                                name="description"
                                placeholder="Step details"
                                value={stepInfo.description}
                                onChange={(e) => setStepInfo(prevState => ({ ...prevState, description: e.target.value }))}
                            />
                        </div>
                        {durationFields.map(({ title, clue, key }) => (
                            <DurationSelector
                                key={key}
                                title={title}
                                clue={clue}
                                value={stepInfo[key] as Duration}
                                onDurationChange={(duration: Duration) => handleDurationChange(key, duration)}
                            />
                        ))}
                        <div className="mt-5 text-center">
                            <button
                                className="font-semibold text-blue-600 border-2 border-blue-600 transition ease-in-out hover:bg-blue-600 hover:text-white px-2 py-1 m-3 rounded-md"
                                onClick={saveStep}>{uiText.buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};