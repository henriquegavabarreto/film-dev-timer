import { WorkflowInfo } from "@/types/WorkflowInfo";
import WorkflowListItem from "./WorkflowListItem";

// Display list with some workflow info
export default function WorkflowList (props: { data: WorkflowInfo[] }) {
    return (
        <div className="overflow-auto">
            <table className="text-center w-screen">
                <thead className="border-b-4 border-zinc-200 text-sm md:text-base">
                    <tr>
                        <th className="p-2">Title</th>
                        <th className="p-2">Film</th>
                        <th className="p-2">Format</th>
                        <th className="p-2">ISO</th>
                        <th className="p-2">Developer</th>
                        <th className="p-2">Dilution</th>
                        <th className="p-2">Temperature</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.data.map((workflow) => 
                            (<WorkflowListItem key={workflow.id} {...workflow} />)
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}