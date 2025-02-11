import WorkflowHistoryItem from "@/types/WorkflowHistoryItem";
import Link from "next/link";

// Display History info
export default function HistoryListItem(props: {historyItem: WorkflowHistoryItem}) {
    // parse date
    const date = (): string => {
        const str = props.historyItem.createdAt.toLocaleString();
        return str.slice(0, str.indexOf('T'))
    }

    return(
        <tr className="hover:bg-slate-100 dark:hover:text-black border-b-2 border-zinc-100 md:text-sm text-xs">
            <td className="py-4 max-w-56">{date()}</td>
            <td className="py-4">{props.historyItem.workflowTitle}</td>
            <td className="py-4">{props.historyItem.notes}</td>
            <td className="p-4">
                {
                    props.historyItem.workflowId == '' ?
                    <>Workflow deleted</>
                    :
                    <Link href={`/workflow/${props.historyItem.workflowId}`}>
                        <button
                            className="w-full font-semibold text-blue-500 border-2 border-blue-500 transition ease-in-out hover:bg-blue-500 hover:text-white py-2 rounded-md">
                            See Workflow
                        </button>
                    </Link>
                }
                
            </td>
        </tr>
    );
}