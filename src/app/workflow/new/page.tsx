import WorkflowForm from "@/components/WorkflowForm";
import { getResources } from "@/lib/getResources";

export default async function NewWorkflow() {
    try {
        const resources = await getResources();

        return(
            <div>
                <div className="text-xl m-5">New Workflow</div>
                <WorkflowForm resources={resources} />
            </div>
        );
    } catch (error) {
        return (
            <div className="flex align-center justify-center mt-5">Resources could not be loaded. Try again in a few minutes.</div>
        );
    }
}