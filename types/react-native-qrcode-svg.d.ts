declare module 'react-native-qrcode-svg' {
    import React from 'react';
    import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

    export interface QRCodeProps {
        value: string;
        size?: number;
        color?: string;
        backgroundColor?: string;
        logo?: string;
        logoSize?: number;
        logoBackgroundColor?: string;
        logoBorderRadius?: number;
        logoMargin?: number;
        logoPadding?: number;
        style?: ViewStyle | TextStyle | ImageStyle;
    }

    const QRCode: React.FC<QRCodeProps>;
    export default QRCode;
}
