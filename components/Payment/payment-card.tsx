

import type { ReactNode } from "react"
import React from "react"

const ChevronDown = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
)

interface PaymentCardProps {
    icon: ReactNode
    title: string
    isOpen: boolean
    onToggle: () => void
    children: ReactNode
}

export default function PaymentCard({ icon, title, isOpen, onToggle, children }: PaymentCardProps) {
    return (
        <div className="mb-4 bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow">
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-purple-600">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="px-6 py-4 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">{children}</div>
            )}
        </div>
    )
}
