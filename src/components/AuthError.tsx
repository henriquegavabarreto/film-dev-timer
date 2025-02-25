// Display Auth error message if there is one available
export default function AuthError(props: { errorMessage: string | null }) {
    if(!props.errorMessage || props.errorMessage == "") return null; // do not render if there is no message

    return(<p className="text-red-500 mb-4">{props.errorMessage}</p>);
};