import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  camHint: string;
  camSub: string;
  shutterText: string;
  retakeText: string;
  galleryText: string;
  nextBtn: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'नया उत्पाद जोड़ें',
    camHint: 'कैमरा खोलने के लिए यहाँ टैप करें',
    camSub: 'अपने उत्पाद की साफ़ और सीधी फोटो खींचें।',
    shutterText: 'कैमरा खोलें और फोटो खींचें',
    retakeText: 'दोबारा फोटो लें',
    galleryText: 'गैलरी से चुनें',
    nextBtn: 'आगे बढ़ें (Next) →',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Add New Product',
    camHint: 'Tap here to open camera',
    camSub: 'Capture a clear, well-lit photo of your product.',
    shutterText: 'Open Camera & Snap Photo',
    retakeText: 'Retake Photo',
    galleryText: 'Choose from Gallery',
    nextBtn: 'Next →',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

export default function AddProductCameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || (globalLang === 'en' ? 'en' : 'hi');
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  const videoRef = useRef<any>(null);
  const [webStream, setWebStream] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isWebCamActive, setIsWebCamActive] = useState(false);

  // Initialize Web RTC Camera if running in web browser
  useEffect(() => {
    let activeStream: any = null;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        .then((s) => {
          activeStream = s;
          setWebStream(s);
          setIsWebCamActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.log('Camera fallback:', err);
          navigator.mediaDevices
            ?.getUserMedia({ video: true })
            .then((s) => {
              activeStream = s;
              setWebStream(s);
              setIsWebCamActive(true);
              if (videoRef.current) {
                videoRef.current.srcObject = s;
              }
            })
            .catch((e) => console.log('Camera permission fallback error:', e));
        });
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (webStream && videoRef.current && !hasSnapped) {
      videoRef.current.srcObject = webStream;
    }
  }, [webStream, hasSnapped]);

  // Open native mobile camera using expo-image-picker
  const launchNativeCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert(
          selectedLang === 'hi'
            ? 'कैमरा का उपयोग करने के लिए अनुमति (Permission) आवश्यक है।'
            : 'Camera permission is required to snap photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
        setHasSnapped(true);
      }
    } catch (err) {
      console.log('Error launching camera:', err);
    }
  };

  // Pick from gallery
  const launchGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert(
          selectedLang === 'hi'
            ? 'गैलरी का उपयोग करने के लिए अनुमति (Permission) आवश्यक है।'
            : 'Gallery permission is required to choose photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
        setHasSnapped(true);
      }
    } catch (err) {
      console.log('Error opening gallery:', err);
    }
  };

  const handleSnapPhoto = () => {
    if (hasSnapped) {
      // Retake photo
      setCapturedImage(null);
      setHasSnapped(false);
      if (Platform.OS !== 'web') {
        launchNativeCamera();
      }
      return;
    }

    if (Platform.OS === 'web' && videoRef.current && isWebCamActive) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setCapturedImage(dataUrl);
          setHasSnapped(true);
          return;
        }
      } catch (err) {
        console.log('Snap canvas error:', err);
      }
    }

    // On Native mobile or web fallback, launch native camera picker
    launchNativeCamera();
  };

  const handleNext = () => {
    router.push({
      pathname: '/add-product-details',
      params: { lang: selectedLang },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t.headerTitle}</Text>

          {/* Language Selector Pill */}
          <TouchableOpacity
            style={styles.langSelectorBtn}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={13} color="#2C2C2C" />
            <Text style={styles.langSelectorText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={11} color="#2C2C2C" />
          </TouchableOpacity>
        </View>

        {/* Camera Main Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Central Camera Viewfinder Card */}
          <View style={styles.cameraViewfinderCard}>
            {/* Viewfinder Top Bar */}
            <View style={styles.viewfinderTopRow}>
              <Ionicons name="flash-outline" size={20} color="#666" />
              <View style={styles.liveIndicator}>
                <View style={[styles.redDot, hasSnapped && styles.greenDot]} />
                <Text style={styles.liveText}>
                  {hasSnapped ? 'CAPTURED' : isWebCamActive ? 'LIVE WEBCAM' : 'CAMERA READY'}
                </Text>
              </View>
              <Ionicons name="camera-reverse-outline" size={22} color="#666" />
            </View>

            {/* Viewfinder Frame Container */}
            <TouchableOpacity
              style={styles.frameContainer}
              onPress={handleSnapPhoto}
              activeOpacity={0.9}
            >
              {hasSnapped && capturedImage ? (
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.capturedPhoto}
                  resizeMode="cover"
                />
              ) : Platform.OS === 'web' && isWebCamActive ? (
                React.createElement('video', {
                  ref: videoRef,
                  autoPlay: true,
                  playsInline: true,
                  muted: true,
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 16,
                  },
                })
              ) : (
                <View style={styles.cameraGraphicBox}>
                  <View style={styles.cameraCircleOuter}>
                    <Ionicons
                      name={hasSnapped ? 'checkmark-circle' : 'camera'}
                      size={54}
                      color="#3B6029"
                    />
                  </View>
                  <Text style={styles.camHintText}>
                    {hasSnapped
                      ? selectedLang === 'hi'
                        ? 'फोटो सफलतापूर्वक खींची गई! 🎉'
                        : 'Photo Captured Successfully! 🎉'
                      : t.camHint}
                  </Text>
                  <Text style={styles.camSubText}>{t.camSub}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Shutter & Controls Row */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.shutterButton, hasSnapped && styles.shutterButtonCaptured]}
                onPress={handleSnapPhoto}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={hasSnapped ? 'refresh' : 'camera'}
                  size={28}
                  color={hasSnapped ? '#1F4D25' : '#FFFFFF'}
                />
              </TouchableOpacity>
              <Text style={styles.shutterText}>
                {hasSnapped ? t.retakeText : t.shutterText}
              </Text>

              {/* Gallery Pick Link */}
              {!hasSnapped && (
                <TouchableOpacity
                  style={styles.galleryBtn}
                  onPress={launchGallery}
                  activeOpacity={0.7}
                >
                  <Ionicons name="images-outline" size={16} color="#3B6029" />
                  <Text style={styles.galleryBtnText}>{t.galleryText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Language Selection Modal */}
        <Modal
          visible={isLangModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsLangModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsLangModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedLang === item.code && (
                      <Ionicons name="checkmark" size={20} color="#3B6029" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  langSelectorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  /* Camera Viewfinder Card */
  cameraViewfinderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  viewfinderTopRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7ED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
  },
  greenDot: {
    backgroundColor: '#2E7D32',
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B6029',
    letterSpacing: 0.5,
  },
  frameContainer: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  cameraGraphicBox: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  cameraCircleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#D0E2CC',
  },
  camHintText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  camSubText: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  controlsRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  shutterButtonCaptured: {
    backgroundColor: '#EAF2E8',
    borderWidth: 2,
    borderColor: '#3B6029',
  },
  shutterText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 6,
    marginBottom: 8,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F0F7ED',
  },
  galleryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6029',
  },
  /* Next Button */
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAF8F5',
  },
  langOptionSelected: {
    backgroundColor: '#F0F7ED',
    borderWidth: 1,
    borderColor: '#3B6029',
  },
  langOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  langOptionTextSelected: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
});
