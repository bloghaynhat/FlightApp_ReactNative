import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    PaymentMethod: undefined;
    QRCodeScreen: { paymentMethod: string; confirmationCode?: string };
};

type QRCodeScreenRouteProp = RouteProp<RootStackParamList, 'QRCodeScreen'>;

const QRCodeScreen = ({ route }: { route: QRCodeScreenRouteProp }) => {
    const { paymentMethod, confirmationCode } = route.params;

    const qrValue = getQRCodeValue(paymentMethod);

    const handlePaymentSuccess = () => {
        Alert.alert('Thanh toán thành công!', `Bạn đã thanh toán qua ${paymentMethod}` + (confirmationCode ? `\nMã xác nhận: ${confirmationCode}` : ''), [{ text: 'OK' }]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quét mã QR để thanh toán</Text>
            <QRCode value={qrValue} size={250} />
            <Text style={styles.info}>
                Phương thức thanh toán: {paymentMethod === 'momo' ? 'Momo' : paymentMethod}
            </Text>
            {confirmationCode && <Text style={styles.info}>Mã xác nhận: {confirmationCode}</Text>}
            <Button title="Thanh toán thành công" onPress={handlePaymentSuccess} />
        </View>
    );
};

const getQRCodeValue = (paymentMethod: string) => {
    if (paymentMethod === 'momo') {
        return 'https://paymentgateway.com/momo';
    } else if (paymentMethod === 'vnpay') {
        return 'https://paymentgateway.com/vnpay';
    } else if (paymentMethod === 'credit_card') {
        return 'https://paymentgateway.com/credit_card';
    }
    return '';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default QRCodeScreen;
