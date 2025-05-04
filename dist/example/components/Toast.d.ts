type ToastProps = {
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    style?: {
        background?: string;
        color?: string;
    };
    removeToast: () => void;
};
export declare const Toast: ({ message, action, style, removeToast }: ToastProps) => import("react/jsx-runtime").JSX.Element;
export {};
