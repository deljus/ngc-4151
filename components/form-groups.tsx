import format from "date-fns/format"
import * as React from "react"
import { HTMLAttributes } from "react"
import InputMask from "react-input-mask"

export function FormControl({label, children, className = ''}: FormControlProps) {
    return (
        <div className={`form-control ${className}`}>
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            {children}
        </div>
    )
}

type FormControlProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
}
