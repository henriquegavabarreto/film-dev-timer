// Display Auth error message if there is one available
export default function AuthError(props: { errorMessage: string | null }) {
    // do not render if there is no message
    if(!props.errorMessage || props.errorMessage == "") return null;

    return(
        <p className="text-red-500 mb-4">{props.errorMessage}</p>
    );
};