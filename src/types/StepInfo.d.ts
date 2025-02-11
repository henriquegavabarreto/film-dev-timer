import Duration from "./Duration";

interface StepInfo {
    id: string,
    title: string,
    description: string,
    duration: Duration,
    startAgitationDuration: Duration,
    agitationInterval: Duration,
    agitationDuration: Duration
}

export default StepInfo;