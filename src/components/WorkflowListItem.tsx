import { useWorkflowContext } from "@/context/WorkflowContext";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { useRouter } from "next/navigation";

// Display some workflow info for workflow list
export default function WorkflowListItem (workflow: WorkflowInfo) {
    const router = useRouter();
    const { setSelectedWorkflow } = useWorkflowContext();

    return (
        <tr className="hover:bg-slate-100 dark:hover:text-black border-b-2 border-zinc-100 md:text-sm text-xs">
            <td className="py-4 max-w-56">{workflow.title}</td>
            <td className="py-4">{workflow.film}</td>
            <td className="py-4">{workflow.filmFormat}</td>
            <td className="py-4">{workflow.iso}</td>
            <td className="py-4">{workflow.developer}</td>
            <td className="py-4">{workflow.dilution}</td>
            <td className="py-4">{workflow.temperature}</td>
            <td className="p-4">
                <button
                    onClick={() => {
                        setSelectedWorkflow(workflow); // add workflow to context
                        router.push(`/workflow/${workflow.id}`);
                    }}
                    className="w-full font-semibold text-blue-500 border-2 border-blue-500 transition ease-in-out hover:bg-blue-500 hover:text-white py-2 rounded-md">
                    Open
                </button>
            </td>
        </tr>
    );
}