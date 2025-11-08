import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import type { ContactData } from "../../types/types";

interface ContactFormProps {
  contact: ContactData;
  onUpdate: (field: keyof ContactData, value: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onUpdate }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.contactCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={contact.email}
          onChangeText={(text) => onUpdate("email", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={contact.phone}
          onChangeText={(text) => onUpdate("phone", text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  contactCard: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 8,
  },
});

export default ContactForm;
