"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    className?: string;
    required?: boolean;
    }

    export default function PasswordInput({ placeholder, value, onChange, className, required }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
        <input
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-12 ${className}`}
        />
        <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition"
        >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>
    );
}