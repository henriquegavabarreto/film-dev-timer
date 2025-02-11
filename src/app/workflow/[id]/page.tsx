'use client';

import WorkflowDetails from "@/components/WorkflowDetails";
import { useWorkflowContext } from "@/context/WorkflowContext";
import { auth } from "@/lib/firebase";
import getWorkflow from "@/lib/getWorkflow";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function WorkflowDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const { selectedWorkflow, setSelectedWorkflow } = useWorkflowContext();

    const shouldFetch = !selectedWorkflow || selectedWorkflow.id !== id;

    const { data, error, isLoading } = useSWR<WorkflowInfo>(
        shouldFetch ? `/workflow/${id}` : null,
        () => getWorkflow(id, auth),
        { onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return
         
            // Only retry up to 3 times.
            if (retryCount >= 3) return
         
            // Retry after 7 seconds.
            setTimeout(() => revalidate({ retryCount }), 7000)
          } }
    );

    if (isLoading) return <div className="flex align-center justify-center mt-5">loading...</div>
    if (error) return <div className="flex align-center justify-center mt-5">{error.message}</div>

    const workflow = data || selectedWorkflow || null;
    
    if (!workflow) return <div className="flex align-center justify-center">No workflow found</div>;

    setSelectedWorkflow(workflow); // make sure the current workflow is the selected one

    return (
        <div className="flex flex-col">
            <h2 className="m-5 text-xl text-center">Workflow Details</h2>
            <WorkflowDetails workflow={workflow} />
        </div>);
}