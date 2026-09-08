import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { enhanceCameraPhotoBase64 } from '@/services/apiClient';
import { setPendingProductPhoto } from '@/utils/photoStore';
import { useGlobalLang } from '@/utils/languageStore';

type LangCode = 'hi' | 'en';

const TRANSLATIONS: Record<
  LangCode,
  {
    headerTitle: string;
    subTitle: string;
    instructions: string;
    galleryOptionTitle: string;
    galleryOptionSub: string;
    nextBtnText: string;
    retakeBtnText: string;
    photoCapturedToast: string;
    placeCenterText: string;
    photoCapturedBadge: string;
    enhancingBadge: string;
  }
> = {
  hi: {
    headerTitle: 'अपने उत्पाद की फोटो खींचें',
    subTitle: 'कृपया अपने उत्पाद की साफ़ और स्पष्ट फ़ोटो लें।',
    instructions: 'उत्पाद को अच्छी रोशनी में रखें और कैमरा सीधा रखें',
    galleryOptionTitle: 'यहाँ गैलरी से चुनें',
    galleryOptionSub: 'फ़ोन गैलरी से फ़ोटो अपलोड करें',
    nextBtnText: 'आगे बढ़ें',
    retakeBtnText: 'पुनः फ़ोटो लें',
    photoCapturedToast: 'फ़ोटो खींच ली गई है!',
    placeCenterText: 'उत्पाद को फ्रेम के बीच में रखें',
    photoCapturedBadge: '✨ OpenCV AI एनहांस्ड फोटो ✓',
    enhancingBadge: 'AI द्वारा फोटो एनहांस हो रही है...',
  },
  en: {
    headerTitle: 'Take a photo of your product',
    subTitle: 'Please take a clear and sharp photo of your product.',
    instructions: 'Keep product in good light and hold camera steady',
    galleryOptionTitle: 'Choose from gallery here',
    galleryOptionSub: 'Upload photo from phone gallery',
    nextBtnText: 'Proceed',
    retakeBtnText: 'Retake Photo',
    photoCapturedToast: 'Photo captured successfully!',
    placeCenterText: 'Keep product inside frame center',
    photoCapturedBadge: '✨ OpenCV AI Enhanced Photo ✓',
    enhancingBadge: 'Enhancing with AI...',
  },
};

export default function AddProductPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang = (params.lang as string) || globalLang || 'hi';
  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;

  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [enhancedPhotoUri, setEnhancedPhotoUri] = useState<string | null>(null);
  const [capturedSource, setCapturedSource] = useState<any>(
    require('@/assets/images/product_pot.png')
  );

  const processPhotoUri = async (rawUri: string) => {
    setLocalPhotoUri(rawUri);
    setCapturedSource({ uri: rawUri });
    setIsEnhancing(true);
    setHasCapturedPhoto(true);

    try {
      const enhancedBase64 = await enhanceCameraPhotoBase64(rawUri);
      if (enhancedBase64) {
        setEnhancedPhotoUri(enhancedBase64);
        setPendingProductPhoto(enhancedBase64, rawUri, true);
        setCapturedSource({ uri: enhancedBase64 });
      } else {
        setEnhancedPhotoUri(rawUri);
        setPendingProductPhoto(rawUri, rawUri, false);
      }
    } catch {
      setEnhancedPhotoUri(rawUri);
      setPendingProductPhoto(rawUri, rawUri, false);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCapturePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        alert(selectedLang === 'hi' ? 'कैमरा अनुमति आवश्यक है' : 'Camera permission is required');
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.9,
        base64: true,
        allowsEditing: false,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        await processPhotoUri(uri);
      }
    } catch (e) {
      console.log('Camera error:', e);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        alert(selectedLang === 'hi' ? 'गैलरी अनुमति आवश्यक है' : 'Gallery permission is required');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
        base64: true,
        allowsEditing: false,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        await processPhotoUri(uri);
      }
    } catch (e) {
      console.log('Gallery error:', e);
    }
  };

  const handleProceedNext = () => {
    const finalUri = enhancedPhotoUri || localPhotoUri;
    setPendingProductPhoto(finalUri, localPhotoUri, true);
    router.push({
      pathname: '/add-product-details',
      params: {
        lang: selectedLang,
        ...(finalUri ? { photoUri: finalUri } : {}),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Bar Header with Back Arrow */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Subtitle Banner */}
          <View style={styles.subtitleBanner}>
            <Ionicons name="camera-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
            <Text style={styles.subtitleText}>{t.subTitle}</Text>
          </View>

          {/* Camera Viewfinder Container */}
          <View style={styles.cameraFrameCard}>
            {/* Top Viewfinder Controls */}
            <View style={styles.viewfinderTopBar}>
              <TouchableOpacity
                style={styles.controlIconBtn}
                onPress={() => setIsFlashOn(!isFlashOn)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isFlashOn ? 'flash' : 'flash-outline'}
                  size={20}
                  color={isFlashOn ? '#F59E0B' : '#FFFFFF'}
                />
              </TouchableOpacity>

              <View style={styles.guidelineBadge}>
                <Text style={styles.guidelineText}>{t.placeCenterText}</Text>
              </View>

              <TouchableOpacity style={styles.controlIconBtn} activeOpacity={0.7}>
                <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Central Viewport Box */}
            <View style={styles.viewportBox}>
              {/* Corner Focus Reticles */}
              <View style={[styles.cornerReticle, styles.cornerTL]} />
              <View style={[styles.cornerReticle, styles.cornerTR]} />
              <View style={[styles.cornerReticle, styles.cornerBL]} />
              <View style={[styles.cornerReticle, styles.cornerBR]} />

              {hasCapturedPhoto ? (
                <View style={styles.previewImageContainer}>
                  <Image source={capturedSource} style={styles.previewImage} resizeMode="contain" />
                  {isEnhancing ? (
                    <View style={styles.enhancingBadgeContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.enhancingBadgeText}>{t.enhancingBadge}</Text>
                    </View>
                  ) : (
                    <View style={styles.capturedBadge}>
                      <Text style={styles.capturedBadgeText}>{t.photoCapturedBadge}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.cameraLivePlaceholder}>
                  <Image
                    source={require('@/assets/images/product_pot.png')}
                    style={styles.sampleLiveStreamImage}
                    resizeMode="cover"
                  />
                  <View style={styles.gridOverlay}>
                    <View style={styles.gridLineV} />
                    <View style={styles.gridLineH} />
                  </View>
                </View>
              )}
            </View>

            {/* Camera Shutter Capture Action Row */}
            <View style={styles.shutterRow}>
              {hasCapturedPhoto ? (
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={() => setHasCapturedPhoto(false)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.retakeBtnText}>{t.retakeBtnText}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.shutterButtonOuter}
                  onPress={handleCapturePhoto}
                  activeOpacity={0.85}
                >
                  <View style={styles.shutterButtonInner}>
                    <Ionicons name="camera" size={30} color="#3B6029" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Bottom Gallery Choice Card ("यहाँ गैलरी से चुनें") */}
          <TouchableOpacity
            style={styles.galleryCard}
            onPress={handlePickFromGallery}
            activeOpacity={0.85}
          >
            <View style={styles.galleryIconCircle}>
              <Ionicons name="images-outline" size={24} color="#3B6029" />
            </View>

            <View style={styles.galleryTextGroup}>
              <Text style={styles.galleryTitle}>{t.galleryOptionTitle}</Text>
              <Text style={styles.gallerySubtitle}>{t.galleryOptionSub}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#777777" />
          </TouchableOpacity>

          {/* Next Button ("आगे बढ़ें →") */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceedNext}
            activeOpacity={0.88}
          >
            <Text style={styles.proceedButtonText}>{t.nextBtnText}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
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
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0EBE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  subtitleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF3E8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 13,
    color: '#2D4B1E',
    fontWeight: '500',
    flex: 1,
  },
  cameraFrameCard: {
    backgroundColor: '#1E241B',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  viewfinderTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  controlIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guidelineText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  viewportBox: {
    height: 280,
    backgroundColor: '#0F130E',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerReticle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#84CC16',
    borderWidth: 3,
    zIndex: 10,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  previewImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  capturedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(59, 96, 41, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capturedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  enhancingBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 64, 175, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  enhancingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraLivePlaceholder: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  sampleLiveStreamImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  shutterRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  shutterButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#84CC16',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  galleryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  galleryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EBF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  galleryTextGroup: {
    flex: 1,
  },
  galleryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  gallerySubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    paddingVertical: 14,
    borderRadius: 14,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
