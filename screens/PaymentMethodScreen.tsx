import React, { useState } from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PaymentMethodScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('momo');

  const handlePayment = () => {
    alert('Thanh toán thành công với phương thức: ' + paymentMethod);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hình thức thanh toán</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
        <Picker selectedValue={paymentMethod} onValueChange={setPaymentMethod}>
          <Picker.Item label="Momo" value="momo" />
          <Picker.Item label="VNPay" value="vnpay" />
          <Picker.Item label="ShopeePay" value="shopeepay" />
          <Picker.Item label="Thẻ tín dụng" value="credit_card" />
        </Picker>
      </View>

      <Button title="Thanh toán" onPress={handlePayment} color="#FF9900" />
    </View>
  );
};

// Styles for the second screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PaymentMethodScreen;
