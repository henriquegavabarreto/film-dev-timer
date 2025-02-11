import Duration from "@/types/Duration";

// parse Duration interface info to ms
export default function parseDurationToMs(duration: Duration): number {
    const { h, m, s } = duration; 
    return (h * 3600 + m * 60 + s) * 1000;
}