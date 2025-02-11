import Duration from "@/types/Duration";

// Displays Duration
export default function DurationDisplay(props: Duration) {
    const {h, m, s} = props;

    return (
        <>
        {h > 0 && <span>{h} h </span>}
        {m > 0 && <span>{m} m </span>}
        {s > 0 && <span>{s} s </span>}
        {h <= 0 && m <= 0 && s <= 0 && <span>0 s </span>}
        </>
    );
}