import { WorkflowInfo } from "@/types/WorkflowInfo";
import TimerComponent from "./TimerComponent";
import { useState } from "react";
import HistoryItemForm from "./HistoryItemForm";
import DeleteWorkflowButton from "./DeleteWorkflowButton";
import Link from "next/link";
import ScreenLockCheckbox from "./ScreenLockCheckBox";

// Display workflow details and interactive timers
export default function WorkflowDetails (props: { workflow: WorkflowInfo }) {
    const { workflow } = props;

    // track timer activity to prevent some user interaction when there is an active timer
    // one timer can't be activated if there is one timer already running
    const [hasActiveTimer, setHasActiveTimer] = useState(false);
    
    function handleTimerChange(value: boolean) {
        setHasActiveTimer(value);
    }

    return (
        <>
            <div className="m-5 flex flex-row justify-between">
                <ScreenLockCheckbox/>
                <div>
                    <Link href={`/workflow/${workflow.id}/edit`}>
                        <button
                            disabled={hasActiveTimer}
                            className="m-4 p-4 font-semibold text-orange-400 border-2 border-orange-400 transition ease-in-out hover:bg-orange-400 hover:text-white disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-white rounded-md" 
                            >Edit Workflow</button>
                    </Link>
                    <DeleteWorkflowButton id={workflow.id} hasActiveTimer={hasActiveTimer} />
                </div>    
            </div>
            <div className="m-5 rounded-lg shadow-md border-2 border-zinc-500">
                <h3 className="text-xl font-bold m-5">{workflow.title}</h3>
                <p className="m-5 whitespace-pre-line">{workflow.description}</p>
                <div className="m-4 flex flex-row justify-start flex-wrap">
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            Film:
                        </div>
                        <div>
                            {workflow.film}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            Format:
                        </div>
                        <div>
                            {workflow.filmFormat}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            ISO:
                        </div>
                        <div>
                            {workflow.iso}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            Developer:
                        </div>
                        <div>
                            {workflow.developer}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            Dilution:
                        </div>
                        <div>
                            {workflow.dilution}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/5 p-4 mx-3 my-2 border shadow-lg border-zinc-200 rounded-xl">
                        <div className="text-sm">
                            Temperature:
                        </div>
                        <div>
                            {workflow.temperature}
                        </div>
                    </div>
                </div>
                <h3 className="m-5 text-xl">Steps</h3>
                <div className="flex flex-col m-5">
                    {workflow.steps && workflow.steps.map((step) => (
                        <TimerComponent
                            key={step.id}
                            stepInfo={step}
                            hasActiveTimer={hasActiveTimer}
                            onTimerChange={handleTimerChange}
                        />
                    ))}
                </div>
                <div className="m-3 text-center">
                    <HistoryItemForm workflowId={workflow.id!} workflowTitle={workflow.title} hasActiveTimer={hasActiveTimer}/>
                </div>
            </div>
        </>
    );
};