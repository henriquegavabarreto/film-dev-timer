import FilmFormat from "./FilmFormat";
import StepInfo from "./StepInfo";

export interface WorkflowInfo {
    id?: string,
    createdAt?: Date,
    createdBy?: string,
    title: string,
    description: string,
    film: string,
    filmFormat: FilmFormat,
    iso: string,
    developer: string,
    dilution: string,
    temperature: number,
    steps: StepInfo[]
}