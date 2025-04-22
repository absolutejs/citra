import type { Dispatch, SetStateAction } from 'react';
type NavbarProps = {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
};
export declare const Navbar: ({ modalOpen, setModalOpen }: NavbarProps) => import("react/jsx-runtime").JSX.Element;
export {};
