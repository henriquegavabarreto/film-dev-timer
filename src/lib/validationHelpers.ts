import FilmFormat from "@/types/FilmFormat";
import StepInfo from "@/types/StepInfo";
import { WorkflowInfo } from "@/types/WorkflowInfo";

export const validateLength = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        throw new Error('String values must respect maximum lengths.');
    } 
}

export const validateCommonData = (data: WorkflowInfo) => {
    const validStepAttributes = [
        'id',
        'title',
        'description',
        'duration',
        'startAgitationDuration',
        'agitationInterval',
        'agitationDuration'];

    if (!data) {
        throw new Error('Workflow data is missing.');
    }

    if(data.steps.length <= 0) {
        throw new Error('Workflow must have at least one step.');
    }

    // validate attributes of each step
    data.steps.forEach((step: StepInfo) => {
        const keys = Object.keys(step);
        keys.forEach((key: string) => {
            if(!validStepAttributes.includes(key)) {
                throw new Error('Steps can only have valid attributes.');
            }
        })

        if(keys.length !== validStepAttributes.length) {
            throw new Error('Invalid number of step attributes.');
        }
    })

    if (!data.film || !data.developer || !data.iso) {
        throw new Error('Missing film, developer, or iso data.');
    }

    if(!data.title) {
        throw new Error('Workflow needs a title to be saved');
    }

    // check if film format is from enum
    if(!Object.values(FilmFormat).includes(data.filmFormat as FilmFormat)) {
        throw new Error('Film format must be part of the list');
    }

    // check if there is temperature
    if(!data.temperature) {
        throw new Error('Temperature must be especified');
    }

    // Valitate max length of strings for following fields
    validateLength(data.title, 50);
    validateLength(data.description, 200);
    validateLength(data.film, 50);
    validateLength(data.developer, 50);
    validateLength(data.iso, 6);
    validateLength(data.dilution, 15);
}