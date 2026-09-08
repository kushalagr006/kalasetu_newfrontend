import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

export default function TopLangSelector({ dark = false }: { dark?: boolean }) {
  const [globalLang, setGlobalLang] = useGlobalLang();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLangObj =
    ALL_LANGUAGES.find((l) => l.code === globalLang) || ALL_LANGUAGES[1];

  const handleSelect = (code: LangCode) => {
    setGlobalLang(code);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.pillBtn, dark && styles.pillBtnDark]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="globe-outline"
          size={14}
          color={dark ? '#FFFFFF' : '#2C2C2C'}
          style={{ marginRight: 5 }}
        />
        <Text style={[styles.pillText, dark && styles.pillTextDark]}>
          {currentLangObj.nativeName}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={dark ? '#FFFFFF' : '#666666'}
          style={{ marginLeft: 3 }}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>भाषा चुनें / Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={ALL_LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = globalLang === item.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      isSelected && styles.langOptionSelected,
                    ]}
                    onPress={() => handleSelect(item.code)}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        isSelected && styles.langOptionTextSelected,
                      ]}
                    >
                      {item.nativeName} ({item.englishName})
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#3B6029" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 1,
  },
  pillBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  pillTextDark: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
    padding: 18,
    maxHeight: 460,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E0D8',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE7DF',
  },
  langOptionSelected: {
    backgroundColor: '#F0F6EE',
    borderColor: '#3B6029',
  },
  langOptionText: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  langOptionTextSelected: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
});
