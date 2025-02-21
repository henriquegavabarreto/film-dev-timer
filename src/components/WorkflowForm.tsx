'use client';

import FilmFormat from "@/types/FilmFormat";
import { ResourcesData } from "@/types/ResourcesData";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { useCallback, useEffect, useState } from "react";
import Dilution from "./Dilution";
import StepInfoForm from "./StepInfoForm";
import StepInfo from "@/types/StepInfo";
import Step from "./Step";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useWorkflowContext } from "@/context/WorkflowContext";

interface CustomData {
    customFilmName: string,
    customDeveloperName: string,
    customIso: string
}

// Form to gather and save workflow information - Can either be new with default info or an edit with loaded workflow info
export default function WorkflowForm(props: { resources: ResourcesData, editingWorkflow?: WorkflowInfo }) {
    const { setSelectedWorkflow } = useWorkflowContext();
    const defaultCustomData = {
        customFilmName: "",
        customDeveloperName: "",
        customIso: "0"
    };

    const defaultWorkflow: WorkflowInfo = {
        film: "",
        filmFormat: FilmFormat.F35mm,
        iso: "100",
        developer: "",
        dilution: "1+1",
        temperature: 20,
        title: "",
        description: "",
        steps: []
    };

    const getUpdatedData = (data: WorkflowInfo) => {
        const updatedData = data;

        if(customData.customFilmName !== "" && workflowInfo.film == "Other") {
            updatedData.film = customData.customFilmName;
        }
        if(customData.customDeveloperName !== "" && workflowInfo.developer == "Other") {
            updatedData.developer = customData.customDeveloperName;
        }
        if(customData.customIso !== "0" && workflowInfo.iso == "Other") {
            updatedData.iso = customData.customIso;
        }

        return updatedData;
    }

    const [workflowInfo, setWorkflowInfo] = useState<WorkflowInfo>(props.editingWorkflow || defaultWorkflow);
    const [customData, setCustomData] = useState<CustomData>(defaultCustomData);
    const [editStep, setEditStep] = useState<StepInfo | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const route = useRouter();

    const changeWorkflowProperty = (name: string, value: string | number | FilmFormat) => {
        setWorkflowInfo(prevWorkflow => ( {...prevWorkflow, [name]: value }))
    }

    useEffect(() => {
        // If the workflow is being edited
        if(props.editingWorkflow) {
            // check if current values are part of resources and adjust input field values accordingly
            if(!props.resources.developers.includes(workflowInfo.developer)){
                setCustomData(prevData => ( {...prevData, customDeveloperName: workflowInfo.developer }))
                changeWorkflowProperty('developer', "Other");
            }

            if(!props.resources.films.includes(workflowInfo.film)){
                setCustomData(prevData => ( {...prevData, customFilmName: workflowInfo.film }))
                changeWorkflowProperty('film', "Other");
            }
            if(!props.resources.isos.includes(Number(workflowInfo.iso))){
                setCustomData(prevData => ( {...prevData, customIso: workflowInfo.iso }))
                changeWorkflowProperty('iso', "Other");
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);

        if(workflowInfo.steps.length <= 0) {
            alert('Workflows must have at least one step');
            setSaving(false);
            return;
        }

        try {
            setErrorMessage(null);
            if(!auth.currentUser) throw new Error('User is not logged in');

            const idToken = await auth.currentUser.getIdToken();

            const data = getUpdatedData(workflowInfo);

            const url = props.editingWorkflow ? '/api/workflow/update' : '/api/workflow/new';

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...data })
            });

            if (!res.ok) {
                setSaving(false);
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create workflow');
            }
    
            const resData = await res.json();
            setSaving(false);
            setSelectedWorkflow(workflowInfo);
            route.push(`/workflow/${resData.id}`);
        } catch (error: unknown) {
            if(error instanceof Error) {
                setErrorMessage(error.message);
            }
            setErrorMessage("An unexpected error occurred.");
            setSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const renderCustomInput = (field: string, value: string, type: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return field === "Other" ? (
          <input maxLength={50} className="m-3 border rounded-sm border-zinc-400 text-zinc-800 dark:text-zinc-800" type={type} value={value} onChange={onChange} />
        ) : null;
    }

    const handleDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        setShowDialog(true);
    }

    const onCloseDialog = () => {
        setShowDialog(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
                {errorMessage && <div className="m-5"><p className="text-red-600">{errorMessage}</p></div>}
                <h3 className="text-lg m-5 border-b-2">Main Information</h3>
                <div className="flex flex-col mx-5">
                    <label htmlFor="title">Name: </label>
                    <input
                        id="title"
                        maxLength={50}
                        className="w-1/2 border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                        type="text"
                        value={workflowInfo.title}
                        onChange={(e) => changeWorkflowProperty('title', e.target.value)}
                        required
                        />
                </div>
                <div className="flex flex-col m-5">
                    <label htmlFor="description">Description: </label>
                    <textarea
                        id="description"
                        maxLength={200}
                        className="resize-none w-1/2 border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                        value={workflowInfo.description}
                        onChange={(e) => changeWorkflowProperty('description', e.target.value)}
                        />
                </div>
                <div className="flex lg:w-1/2 w-full md:flex-row flex-col px-3">
                    <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
                        <label htmlFor="filmName">Film: </label>
                        <select
                            className="text-zinc-800 dark:text-zinc-800"
                            id="filmName"
                            value={workflowInfo.film}
                            onChange={(e) => changeWorkflowProperty('film', e.target.value)}
                            >
                                <option
                                    value="">
                                </option>
                            {
                                props.resources.films.map((film) => (
                                    <option
                                        key={film}
                                        value={film}>
                                            {film}
                                    </option>
                                ))
                            }
                            <option
                                value="Other">
                                    Other
                            </option>
                        </select>
                        {renderCustomInput(workflowInfo.film, customData.customFilmName, "text", (e) => setCustomData(prevData => ( {...prevData, customFilmName: e.target.value })))}
                    </div>
                    <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
                        <label htmlFor="filmFormat">Film format: </label>
                        <select
                            className="text-zinc-800 dark:text-zinc-800"
                            id="filmFormat"
                            value={workflowInfo.filmFormat}
                            onChange={(e) => changeWorkflowProperty('filmFormat', e.target.value as FilmFormat)}
                            >
                            {
                                Object.values(FilmFormat).map((format) => (
                                    <option key={format} value={format}>
                                        {format}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
                        <label htmlFor="filmIso">ISO: </label>
                        <select
                            className="text-zinc-800 dark:text-zinc-800"
                            id="filmIso"
                            value={workflowInfo.iso}
                            onChange={(e) => changeWorkflowProperty('iso', e.target.value)}
                            >
                                <option
                                    value="">
                                </option>
                            {
                                props.resources.isos.map((iso) => (
                                    <option
                                        key={iso}
                                        value={iso}>
                                            {iso}
                                    </option>
                                ))
                            }
                            <option
                                value="Other">
                                    Other
                            </option>
                        </select>
                        {renderCustomInput(workflowInfo.iso, customData.customIso, "number", (e) => setCustomData(prevData => ( {...prevData, customIso: e.target.value })))}
                    </div>
                </div>
                <div className="flex lg:w-1/2 w-full md:flex-row flex-col px-3">
                    <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
                        <label htmlFor="developer">Developer: </label>
                        <select
                            className="text-zinc-800 dark:text-zinc-800"
                            id="developer"
                            value={workflowInfo.developer}
                            onChange={(e) => changeWorkflowProperty('developer', e.target.value)}
                            >
                                <option
                                    value="">
                                </option>
                            {
                                props.resources.developers.map((developer) => (
                                    <option
                                        key={developer}
                                        value={developer}>
                                            {developer}
                                    </option>
                                ))
                            }
                            <option
                                value="Other">
                                    Other
                            </option>
                        </select>
                        {renderCustomInput(workflowInfo.developer, customData.customDeveloperName, "text", (e) => setCustomData(prevData => ( {...prevData, customDeveloperName: e.target.value })))}
                    </div>
                    <Dilution
                        handleDilutionChange={useCallback((dilution: string) => {
                            setWorkflowInfo(prevWorkflow => ({ ...prevWorkflow, dilution }));
                        }, [])}
                        initialValue={props.editingWorkflow && workflowInfo.dilution}
                    />
                    <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
                        <label htmlFor="temperature">Temperature: </label>
                        <input
                            id="temperature"
                            maxLength={3}
                            className="text-center w-16 border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                            type="number"
                            value={workflowInfo.temperature}
                            onChange={(e) => changeWorkflowProperty('temperature', Number(e.target.value))}
                            required
                            />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg m-5 border-b-2">Steps</h3>
                    <div className="m-5 justify-start flex flex-row flex-wrap">
                        {
                            workflowInfo.steps.map(step => (
                                <Step
                                    key={step.id}
                                    stepInfo={step}
                                    onEdit={(id: string): void  => {
                                        const selectedStep = workflowInfo.steps.find(step => step.id === id);
                                        if(selectedStep) setEditStep(selectedStep);
                                        setShowDialog(true);
                                    } }
                                    onDelete={(id: string): void => {
                                        setWorkflowInfo(prevWorkflow => ({...prevWorkflow, steps: prevWorkflow.steps.filter(step => step.id !== id )}))
                                } } />
                            ))
                        }
                        <button
                            className="font-bold m-3 p-3 min-w-56 min-h-56 md:w-1/5 text-blue-500 border-2 border-blue-500 transition ease-in-out hover:bg-blue-500 hover:text-white rounded-lg"
                            onClick={handleDialog}>Add New Step</button>
                    </div>
                    <dialog open={showDialog}>
                        <StepInfoForm
                            onSaveStep={(info: StepInfo): void => {
                                if (editStep) {
                                    // Editing existing step
                                    setWorkflowInfo(prevWorkflow => ({
                                        ...prevWorkflow,
                                        steps: prevWorkflow.steps.map(step => step.id === info.id ? info : step)
                                    }));
                                } else {
                                    // Adding a new step
                                    setWorkflowInfo(prevWorkflow => ({
                                        ...prevWorkflow,
                                        steps: [...prevWorkflow.steps, info]
                                    }));
                                }
                                setEditStep(null); // Clear edit state after saving
                                setShowDialog(false);
                            } }
                            onClose={onCloseDialog}
                            editingStepInfo={editStep}/>
                    </dialog>
                </div>
                <button
                    className="m-5 font-semibold text-blue-600 border-2 border-blue-600 transition ease-in-out hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md"
                    type="submit"
                    disabled={saving}>{saving ? 'Saving...' : 'Save Workflow'}</button>
            </div>
        </form>
    );
}