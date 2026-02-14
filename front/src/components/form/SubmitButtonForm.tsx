interface SubmitButtonFormProps {
    label: string;
    colorClass?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "submit" | "button";
}

export default function SubmitButtonForm({ 
    label, 
    colorClass = "bg-green-500 hover:bg-green-600 focus:ring-green-400/20", 
    onClick, 
    disabled = false,
    type = "submit"
}: SubmitButtonFormProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full py-2.5 px-4 rounded-xl cursor-pointer
                text-white font-semibold text-sm
                transition-all duration-200
                focus:outline-none focus:ring-2
                disabled:cursor-not-allowed
                ${colorClass}
            `}
        >
            {label}
        </button>
    );
}