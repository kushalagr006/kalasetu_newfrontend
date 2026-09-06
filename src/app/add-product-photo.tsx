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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
    photoCapturedBadge: 'फ़ोटो कैप्चर हुई ✓',
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
    photoCapturedBadge: 'Photo Captured ✓',
  },
};

export default function AddProductPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const selectedLang: LangCode = (params.lang as LangCode) === 'en' ? 'en' : 'hi';
  const t = TRANSLATIONS[selectedLang];

  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedSource, setCapturedSource] = useState<any>(
    require('@/assets/images/product_pot.png')
  );

  const handleCapturePhoto = () => {
    setCapturedSource(require('@/assets/images/product_pot.png'));
    setHasCapturedPhoto(true);
  };

  const handlePickFromGallery = () => {
    setCapturedSource(require('@/assets/images/product_basket.png'));
    setHasCapturedPhoto(true);
  };

  const handleProceedNext = () => {
    // Navigate to the next page where voice (mic) and text options are present
    router.push({ pathname: '/add-product', params: { lang: selectedLang } });
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
                  <Image source={capturedSource} style={styles.previewImage} resizeMode="cover" />
                  <View style={styles.capturedBadge}>
                    <Text style={styles.capturedBadgeText}>{t.photoCapturedBadge}</Text>
                  </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },
  /* Subtitle Banner */
  subtitleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
    borderWidth: 1,
    borderColor: '#EAEFE8',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  subtitleText: {
    flex: 1,
    fontSize: 13,
    color: '#444444',
    fontWeight: '500',
    lineHeight: 18,
  },
  /* Camera Viewfinder Card */
  cameraFrameCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
    }),
  },
  viewfinderTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  controlIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  guidelineText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  viewportBox: {
    height: 280,
    marginHorizontal: 14,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLivePlaceholder: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  sampleLiveStreamImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  cornerReticle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#3B6029',
    zIndex: 10,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  previewImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  capturedBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    backgroundColor: '#3B6029',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  capturedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shutterRow: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  /* Gallery Card */
  galleryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    elevation: 1,
  },
  galleryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  galleryTextGroup: {
    flex: 1,
  },
  galleryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  gallerySubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  /* Proceed Button */
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    height: 54,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 3px 5px rgba(59, 96, 41, 0.25)' },
      default: { shadowColor: '#3B6029', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
    }),
  },
  proceedButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
