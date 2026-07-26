import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface GoogleAccountPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccount) => void;
}

const DEFAULT_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'google_user_1',
    name: 'Ummadi Ushasree',
    email: 'ummadiushasree2006@gmail.com',
    avatarColor: '#4285F4', // Google Blue
  },
  {
    id: 'google_user_2',
    name: 'Ushasree Ummadi',
    email: 'ummadiushasree06@gmail.com',
    avatarColor: '#34A853', // Google Green
  },
];

export default function GoogleAccountPickerModal({
  visible,
  onClose,
  onSelectAccount
}: GoogleAccountPickerModalProps) {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleAddCustomAccount = () => {
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setEmailError('Please enter a valid Google email address.');
      return;
    }
    const newAcc: GoogleAccount = {
      id: `google_${Date.now()}`,
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim().toLowerCase(),
      avatarColor: '#34A853', // Google Green
    };
    setIsAddingAccount(false);
    onSelectAccount(newAcc);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.googleGLogo}>
              <Text style={styles.gText}>G</Text>
            </View>
            <Text style={styles.titleText}>Choose an account</Text>
            <Text style={styles.subtitleText}>to continue to Smart Chef AI</Text>
          </View>

          {isAddingAccount ? (
            /* Custom Account Input Screen */
            <View style={styles.customAccountContainer}>
              <Text style={styles.customAccountTitle}>Sign in with Google</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Name (Optional)"
                  placeholderTextColor="#94A3B8"
                  value={customName}
                  onChangeText={setCustomName}
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Google Email Address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={customEmail}
                  onChangeText={(txt) => {
                    setCustomEmail(txt);
                    if (emailError) setEmailError('');
                  }}
                />
                {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </View>

              <View style={styles.customActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsAddingAccount(false)}
                >
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleAddCustomAccount}
                >
                  <Text style={styles.confirmBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Accounts List */
            <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
              {DEFAULT_ACCOUNTS.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  style={styles.accountRow}
                  activeOpacity={0.7}
                  onPress={() => onSelectAccount(acc)}
                >
                  <View style={[styles.avatar, { backgroundColor: acc.avatarColor }]}>
                    <Text style={styles.avatarInitial}>{acc.name.charAt(0)}</Text>
                  </View>

                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{acc.name}</Text>
                    <Text style={styles.accountEmail}>{acc.email}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add Account Option */}
              <TouchableOpacity
                style={styles.addAccountRow}
                activeOpacity={0.7}
                onPress={() => setIsAddingAccount(true)}
              >
                <View style={styles.addIconCircle}>
                  <Text style={styles.addIconText}>👤+</Text>
                </View>
                <Text style={styles.addAccountText}>Use another account</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Footer note */}
          <View style={styles.footer}>
            <Text style={styles.footerNotice}>
              To continue, Google will share your name, email address, and profile picture with Smart Chef AI.
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    maxHeight: '85%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  googleGLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  accountsList: {
    marginVertical: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  accountEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  addAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  addIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addIconText: {
    fontSize: 16,
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4285F4',
  },
  customAccountContainer: {
    paddingVertical: 12,
  },
  customAccountTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
  customActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  footerNotice: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
