import { ReactNode, MouseEventHandler } from "react";

interface SidebarItemProps {
    icon: ReactNode;
    title: string;
    isActive?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
}

export default function SidebarItem({
                                        icon,
                                        title,
                                        isActive = false,
                                        onClick,
                                        className = "",
                                    }: SidebarItemProps) {

    return (
        <li>
            <button
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                } ${className}`}
                onClick={onClick}
            >
                {icon}
                <span>{title}</span>
            </button>
        </li>
    );
}