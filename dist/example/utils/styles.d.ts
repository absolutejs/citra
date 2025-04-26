import { CSSProperties } from 'react';
export declare const styleReset = "\n    * {\n        margin: 0;\n        padding: 0;\n        box-sizing: border-box;\n        font-weight: inherit;\n    }\n";
export declare const bodyDefault: CSSProperties;
export declare const mainDefault: CSSProperties;
export declare const htmlDefault: CSSProperties;
type ButtonStyleProps = {
    backgroundColor?: string;
    color?: string;
};
export declare const buttonStyle: ({ backgroundColor, color }: ButtonStyleProps) => CSSProperties;
export declare const formStyle: CSSProperties;
export declare const formButtonStyle: (isFullOpacity?: boolean) => CSSProperties;
export {};
