import { ReactNode } from 'react';
import { Toast } from './Toast';
type Toast = {
    id: number;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    style?: {
        background?: string;
        color?: string;
    };
};
type AddToastProps = {
    message: string;
    action?: Toast['action'];
    style?: Toast['style'];
    duration?: number;
};
export type ToastContextType = {
    addToast: (opts: AddToastProps) => void;
    registerHost: (host: HTMLElement | null) => void;
};
export declare const ToastContext: import("react").Context<ToastContextType | null>;
export declare const useToast: () => ToastContextType;
type ToastProviderProps = {
    children: ReactNode;
};
export declare const ToastProvider: ({ children }: ToastProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
