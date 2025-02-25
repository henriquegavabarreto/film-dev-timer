import StepInfo from "@/types/StepInfo";
import DurationDisplay from "./DurationDisplay";

// Display step information for workflow form
export default function Step({ stepInfo, onEdit, onDelete}: {stepInfo: StepInfo, onEdit: (id: string) => void, onDelete: (id: string) => void}) {
    const { id, title, description, duration, startAgitationDuration, agitationInterval, agitationDuration} = stepInfo;
    
    const editStep = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        onEdit(id); // edit step with id
    }

    const deleteStep = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        onDelete(id); // delete step with id
    }

    return (
        <div className="m-3 p-3 lg:w-1/5 flex flex-col border border-zinc-600 rounded-lg">
            <div className="text-lg font-semibold">{title}</div>
            <div className="my-2 whitespace-pre-line">{description}</div>
            <div className="mt-1">Duration: <DurationDisplay {...duration}/></div>
            <div className="mt-1">Start Agitation Duration: <DurationDisplay {...startAgitationDuration}/></div>
            <div className="mt-1">Agitation Interval: <DurationDisplay {...agitationInterval}/></div>
            <div className="mt-1">Agitation Duration: <DurationDisplay {...agitationDuration}/></div>
            <div className="mt-4 flex flex-row justify-around">
                <button
                    className="font-semibold text-blue-500 border-2 border-blue-500 transition ease-in-out hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md"
                    onClick={editStep}>Edit</button>
                <button
                    className="font-semibold text-red-500 border-2 border-red-500 transition ease-in-out hover:bg-red-500 hover:text-white px-2 py-1 rounded-md"
                    onClick={deleteStep}>Delete</button>
            </div>
        </div>
    );
}