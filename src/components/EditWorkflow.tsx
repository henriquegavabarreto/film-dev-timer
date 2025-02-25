'use client';
import { useWorkflowContext } from "@/context/WorkflowContext";
import { auth } from "@/lib/firebase";
import getWorkflow from "@/lib/getWorkflow";
import { ResourcesData } from "@/types/ResourcesData";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { useParams } from "next/navigation";
import useSWR from "swr";
import WorkflowForm from "./WorkflowForm";

// Loads WorkflowForm with editable data
export default function EditWorkflow(resources: ResourcesData) {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { selectedWorkflow, setSelectedWorkflow } = useWorkflowContext(); // get context

    const shouldFetch = !selectedWorkflow || selectedWorkflow.id !== id; // fetch if there is no valid workflow to display

    // fetch workflow if needed
    const { data, error, isLoading } = useSWR<WorkflowInfo>(shouldFetch ? `/workflow/${id}` : null, () => getWorkflow(id, auth));

    if (isLoading) return <div>loading...</div>
    if (error) return <div>failed to load</div>

    const workflow = data || selectedWorkflow || null; // use fetched data or workflow from context
    
    if (!workflow) return <div>No workflow found</div>;

    setSelectedWorkflow(workflow); // make sure the current workflow is the selected one

    return(
        <WorkflowForm resources={resources} editingWorkflow={workflow} />
    );
}