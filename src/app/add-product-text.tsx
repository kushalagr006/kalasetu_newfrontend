import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getPendingProductPhoto } from '@/utils/photoStore';
import { useGlobalLang } from '@/utils/languageStore';
import TopLangSelector from '@/components/TopLangSelector';
import { TEXT_STRINGS } from '@/utils/productQuestions';

export default function AddProductTextScreen() {
  const router = useRouter();
  const [globalLang] = useGlobalLang();
  const t = TEXT_STRINGS[globalLang] || TEXT_STRINGS.hi;

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [category, setCategory] = useState(t.labelCategory);
  const [location, setLocation] = useState('');

  const handleSaveProduct = () => {
    if (!productName.trim()) {
      Alert.alert('Notice', t.errNameAlert);
      return;
    }
    Alert.alert(
      'Success',
      t.successAlert,
      [
        {
          text: 'OK',
          onPress: () => router.push('/products'),
        },
      ]
    );
  };

  const pendingPhoto = getPendingProductPhoto();
  const photoUri = pendingPhoto.photoUri;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row with Back Button and Language Selector */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#3B6029" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {t.headerTitle}
          </Text>

          <TopLangSelector />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Photo Banner Preview */}
          {photoUri && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: 10,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#EFECE6',
              elevation: 2,
            }}>
              <Image
                source={{ uri: photoUri }}
                style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: '#F0F0F0' }}
                resizeMode="cover"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3B6029' }}>
                  {t.photoAttached}
                </Text>
                <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }}>
                  {t.photoSub}
                </Text>
              </View>
            </View>
          )}

          {/* Top Info Banner Card */}
          <View style={styles.infoBanner}>
            <View style={styles.pencilCircleSmall}>
              <Ionicons name="pencil" size={26} color="#3B6029" />
            </View>

            <View style={styles.infoTextGroup}>
              <Text style={styles.infoTitle}>
                {t.infoTitle}
              </Text>
              <Text style={styles.infoSubtitle}>
                {t.infoSub}
              </Text>
            </View>
          </View>

          {/* Form Fields */}

          {/* 1. Product Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.labelName}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t.placeholderName}
              placeholderTextColor="#999999"
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          {/* 2 & 3. Price and Stock Row */}
          <View style={styles.formRow}>
            {/* Price */}
            <View style={[styles.formGroup, styles.formCol]}>
              <Text style={styles.label}>
                {t.labelPrice}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t.placeholderPrice}
                placeholderTextColor="#999999"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            {/* Stock */}
            <View style={[styles.formGroup, styles.formCol]}>
              <Text style={styles.label}>
                {t.labelStock}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t.placeholderStock}
                placeholderTextColor="#999999"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>
          </View>

          {/* 4. Product Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.labelDescription}
            </Text>
            <View style={styles.multilineInputContainer}>
              <TextInput
                style={styles.multilineInput}
                placeholder={t.placeholderDescription}
                placeholderTextColor="#999999"
                multiline
                maxLength={300}
                value={description}
                onChangeText={setDescription}
              />
              <Text style={styles.charCounter}>{`${description.length}/300`}</Text>
            </View>
          </View>

          {/* 5. Features / Materials */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.labelMaterials}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t.placeholderMaterials}
              placeholderTextColor="#999999"
              value={features}
              onChangeText={setFeatures}
            />
          </View>

          {/* 6. Category Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.labelCategory}
            </Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => Alert.alert(t.labelCategory, category)}
              activeOpacity={0.8}
            >
              <View style={styles.dropdownLeftGroup}>
                <Ionicons name="color-palette-outline" size={20} color="#3B6029" style={{ marginRight: 10 }} />
                <Text style={styles.dropdownText}>{category || t.labelCategory}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* 7. Product City / Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t.labelLocation}
            </Text>
            <View style={styles.locationInputBox}>
              <Ionicons name="location-outline" size={20} color="#777777" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.locationTextInput}
                placeholder={t.placeholderLocation}
                placeholderTextColor="#999999"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity
                style={styles.selectLocBtn}
                onPress={() => Alert.alert(t.labelLocation, t.placeholderLocation)}
                activeOpacity={0.8}
              >
                <Text style={styles.selectLocBtnText}>{t.help}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Save Product CTA Button */}
          <TouchableOpacity
            style={styles.saveProductButton}
            onPress={handleSaveProduct}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.saveProductButtonText}>
              {t.saveButton}
            </Text>
          </TouchableOpacity>

          {/* Bottom Lock / Review Note */}
          <View style={styles.reviewLockRow}>
            <Ionicons name="lock-closed-outline" size={14} color="#777777" style={{ marginRight: 6 }} />
            <Text style={styles.reviewLockText}>
              {t.infoSub}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  helpButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  helpText: {
    fontSize: 11,
    color: '#3B6029',
    fontWeight: '600',
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  /* Top Info Banner */
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
    borderWidth: 1,
    borderColor: '#EAEFE8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  pencilCircleSmall: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  /* Form Inputs */
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formCol: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  asterisk: {
    color: '#D32F2F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1A1A',
  },
  multilineInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 14,
    padding: 12,
  },
  multilineInput: {
    height: 90,
    fontSize: 14,
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    color: '#888888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dropdownLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  locationInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  selectLocBtn: {
    backgroundColor: '#F0F7ED',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectLocBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Save Product CTA Button */
  saveProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveProductButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reviewLockText: {
    fontSize: 12,
    color: '#777777',
  },
});
