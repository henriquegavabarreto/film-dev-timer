import EditWorkflow from "@/components/EditWorkflow";
import { getResources } from "@/lib/getResources";

export default async function EditWorkflowPage() {
    try {
        const resources = await getResources();

        return(
            <div>
                <div className="text-xl m-5">Edit Workflow</div>
                <EditWorkflow {...resources} />
            </div>
        );
    } catch (error) {
        return (
            <div className="flex align-center justify-center mt-5">Resources could not be loaded. Try again in a few minutes.</div>
        );
    }
}