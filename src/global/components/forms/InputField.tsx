import { ChangeEvent } from "react";

interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    autoComplete?: string;
    className?: string;
    required?: boolean;
}

export const InputField = ({ id, name, placeholder, error, ...props }: InputFieldProps) => {
    const baseClasses =
        "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow";

    const errorClasses = error
        ? "border-red-500 focus:border-red-500"
        : "border-slate-200 focus:border-slate-400 hover:border-slate-300";

    return (
        <div className="mb-4">
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <input
                id={id}
                name={name}
                placeholder={placeholder}
                className={`${baseClasses} ${errorClasses} ${props.className || ""}`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
