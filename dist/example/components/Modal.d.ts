import { ReactNode } from 'react';
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: (dialogRef: HTMLDialogElement | null) => void;
    children: ReactNode;
};
export declare const Modal: ({ isOpen, onClose, onOpen, children }: ModalProps) => import("react/jsx-runtime").JSX.Element;
export {};
