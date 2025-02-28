import { ChangeEvent } from "react";

interface CustomSelectProps {
    title: string,
    options: (string | number)[],
    currentValue: string,
    onChange: (val: ChangeEvent<HTMLSelectElement>) => void ,
    customValue?: string,
    onCustomChange?: (val : ChangeEvent<HTMLInputElement>) => void
}

export default function CustomSelect({title, options, currentValue, onChange, customValue, onCustomChange} : CustomSelectProps) {
    const customSupportedTitles = ['Film', 'Developer', 'ISO']; // Selects that support custom values

    return (
        <div className="lg:m-3 lg:w-1/3 mx-3 my-1 flex flex-col">
            <label htmlFor="developer">{title}: </label>
            <select
                className="text-zinc-800 dark:text-zinc-800"
                id="developer"
                value={currentValue}
                onChange={(e) => onChange(e)}
                >
                    <option
                        value="">
                            Select...
                    </option>
                {
                    options.map((option) => (
                        <option
                            key={option}
                            value={option}>
                                {option}
                        </option>
                    ))
                }
                {
                    customSupportedTitles.includes(title) && (
                    <option
                        value="Other">
                            Other
                    </option>
                )}
            </select>
            {(currentValue === "Other" && onCustomChange) && (
                <input className="m-3 border rounded-sm border-zinc-400 text-zinc-800 dark:text-zinc-800"
                    type={title === 'ISO' ? 'number' : 'text'}
                    maxLength={50}
                    value={customValue}
                    onChange={(e) => onCustomChange(e)} />
            )}
        </div>)
}