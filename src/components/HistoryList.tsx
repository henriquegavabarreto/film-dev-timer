import WorkflowHistoryItem from "@/types/WorkflowHistoryItem";
import HistoryListItem from "./HistoryListItem";

// Display list of history items
export default function HistoryList(props: { data: WorkflowHistoryItem[] }) {
    return (
        <div className="overflow-auto">
            <table className="text-center w-screen">
                <thead className="border-b-4 border-zinc-200 text-sm md:text-base">
                    <tr>
                        <th className="p-2">Date Used</th>
                        <th className="p-2">Workflow</th>
                        <th className="p-2">Notes</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map((historyItem) => 
                            (<HistoryListItem key={historyItem.createdAt.toLocaleString()} historyItem={historyItem} />)
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}