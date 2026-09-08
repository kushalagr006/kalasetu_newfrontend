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
import { enhanceCameraPhotoBase64 } from '@/services/apiClient';
import { setPendingProductPhoto } from '@/utils/photoStore';
import { ActivityIndicator } from 'react-native';

import TopLangSelector from '@/components/TopLangSelector';

const CAMERA_STRINGS: Record<LangCode, {
  headerTitle: string;
  camHint: string;
  camSub: string;
  shutterText: string;
  retakeText: string;
  galleryText: string;
  nextBtn: string;
  camAlert: string;
  galleryAlert: string;
  enhancingText: string;
  enhancedBadge: string;
  capturedSuccess: string;
}> = {
  hi: {
    headerTitle: 'नया उत्पाद जोड़ें',
    camHint: 'कैमरा खोलने के लिए यहाँ टैप करें',
    camSub: 'अपने उत्पाद की साफ़ और सीधी फोटो खींचें।',
    shutterText: 'कैमरा खोलें और फोटो खींचें',
    retakeText: 'दोबारा फोटो लें',
    galleryText: 'गैलरी से चुनें',
    nextBtn: 'आगे बढ़ें (Next) →',
    camAlert: 'कैमरा का उपयोग करने के लिए अनुमति (Permission) आवश्यक है।',
    galleryAlert: 'गैलरी का उपयोग करने के लिए अनुमति (Permission) आवश्यक है।',
    enhancingText: 'AI द्वारा फोटो एनहांस हो रही है...',
    enhancedBadge: '✨ OpenCV AI एनहांस्ड फोटो ✓',
    capturedSuccess: 'फोटो सफलतापूर्वक खींची गई! 🎉',
  },
  en: {
    headerTitle: 'Add New Product',
    camHint: 'Tap here to open camera',
    camSub: 'Capture a clear, well-lit photo of your product.',
    shutterText: 'Open Camera & Snap Photo',
    retakeText: 'Retake Photo',
    galleryText: 'Choose from Gallery',
    nextBtn: 'Next →',
    camAlert: 'Camera permission is required to snap photos.',
    galleryAlert: 'Gallery permission is required to choose photos.',
    enhancingText: 'Enhancing with AI...',
    enhancedBadge: '✨ OpenCV AI Enhanced Photo ✓',
    capturedSuccess: 'Photo Captured Successfully! 🎉',
  },
  bn: {
    headerTitle: 'নতুন পণ্য যোগ করুন',
    camHint: 'ক্যামেরা খুলতে এখানে ট্যাপ করুন',
    camSub: 'আপনার পণ্যের পরিষ্কার ও আলোকিত ছবি তুলুন।',
    shutterText: 'ক্যামেরা খুলুন এবং ছবি তুলুন',
    retakeText: 'পুনরায় ছবি তুলুন',
    galleryText: 'গ্যালারি থেকে বেছে নিন',
    nextBtn: 'পরবর্তী ধাপ →',
    camAlert: 'ক্যামেরা ব্যবহারের অনুমতি প্রয়োজন।',
    galleryAlert: 'গ্যালারি ব্যবহারের অনুমতি প্রয়োজন।',
    enhancingText: 'AI দ্বারা ছবি উন্নত করা হচ্ছে...',
    enhancedBadge: '✨ OpenCV AI উন্নত ছবি ✓',
    capturedSuccess: 'ছবি সফলভাবে তোলা হয়েছে! 🎉',
  },
  bho: {
    headerTitle: 'नया उत्पाद जोड़ीं',
    camHint: 'कैमरा खोले खातिर इहाँ दबाईं',
    camSub: 'अपना उत्पाद के साफ आ सीधा फोटो खींचीं।',
    shutterText: 'कैमरा खोलीं आ फोटो खींचीं',
    retakeText: 'दोबारा फोटो लीं',
    galleryText: 'गैलरी से चुनीं',
    nextBtn: 'आगे बढ़ीं →',
    camAlert: 'कैमरा के अनुमति जरूरी बा।',
    galleryAlert: 'गैलरी के अनुमति जरूरी बा।',
    enhancingText: 'AI से फोटो एनहांस हो रहल बा...',
    enhancedBadge: '✨ OpenCV AI एनहांस्ड फोटो ✓',
    capturedSuccess: 'फोटो खिंचा गइल! 🎉',
  },
  mr: {
    headerTitle: 'नवीन उत्पादन जोडा',
    camHint: 'कॅमेरा उघडण्यासाठी येथे टॅप करा',
    camSub: 'तुमच्या उत्पादनाचा स्पष्ट आणि चांगला प्रकाश असलेला फोटो काढा.',
    shutterText: 'कॅमेरा उघडा आणि फोटो काढा',
    retakeText: 'पुन्हा फोटो घ्या',
    galleryText: 'गॅलरीतून निवडा',
    nextBtn: 'पुढे जा →',
    camAlert: 'कॅमेरा परवानगी आवश्यक आहे.',
    galleryAlert: 'गॅलरी परवानगी आवश्यक आहे.',
    enhancingText: 'AI द्वारे फोटो सुधारित केला जात आहे...',
    enhancedBadge: '✨ OpenCV AI सुधारित फोटो ✓',
    capturedSuccess: 'फोटो यशस्वीरित्या काढला! 🎉',
  },
  gu: {
    headerTitle: 'નવું ઉત્પાદન ઉમેરો',
    camHint: 'કૅમેરો ખોલવા માટે અહીં ટૅપ કરો',
    camSub: 'તમારા ઉત્પાદનનો સ્પષ્ટ અને સારો ફોટો પાડો.',
    shutterText: 'કૅમેરો ખોલો અને ફોટો પાડો',
    retakeText: 'ફરીથી ફોટો લો',
    galleryText: 'ગૅલેરીમાંથી પસંદ કરો',
    nextBtn: 'આગળ વધો →',
    camAlert: 'કૅમેરાની પરવાનગી જરૂરી છે.',
    galleryAlert: 'ગૅલેરીની પરવાનગી જરૂરી છે.',
    enhancingText: 'AI દ્વારા ફોટો સુધારાઈ રહ્યો છે...',
    enhancedBadge: '✨ OpenCV AI સુધારેલ ફોટો ✓',
    capturedSuccess: 'ફોટો સફળતાપૂર્વક લેવાયો! 🎉',
  },
  raj: {
    headerTitle: 'नयो उत्पाद जोड़ो',
    camHint: 'कैमरो खोलण सारू अठै दबाओ',
    camSub: 'आपरा उत्पाद री साफ अर चोखी फोटो खींचो।',
    shutterText: 'कैमरो खोलो अर फोटो खींचो',
    retakeText: 'पाछो फोटो खींचो',
    galleryText: 'गैलरी सूं चुणो',
    nextBtn: 'आगै बढ़ो →',
    camAlert: 'कैमरा री इजाजत जरूरी है।',
    galleryAlert: 'गैलरी री इजाजत जरूरी है।',
    enhancingText: 'AI सूं फोटो ठीक होवे है...',
    enhancedBadge: '✨ OpenCV AI एनहांस्ड फोटो ✓',
    capturedSuccess: 'फोटो खिंच गयो! 🎉',
  },
  kn: {
    headerTitle: 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    camHint: 'ಕ್ಯಾಮರಾ ತೆರೆಯಲು ಇಲ್ಲಿ ಟ್ಯಾಪ್ ಮಾಡಿ',
    camSub: 'ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಸ್ಪಷ್ಟ ಮತ್ತು ಉತ್ತಮವಾದ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    shutterText: 'ಕ್ಯಾಮರಾ ತೆರೆಯಿರಿ ಮತ್ತು ಫೋಟೋ ತೆಗೆಯಿರಿ',
    retakeText: 'ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    galleryText: 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ',
    nextBtn: 'ಮುಂದೆ ಹೋಗಿ →',
    camAlert: 'ಕ್ಯಾಮರಾ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ.',
    galleryAlert: 'ಗ್ಯಾಲರಿ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ.',
    enhancingText: 'AI ಮೂಲಕ ಫೋಟೋ ವರ್ಧಿಸಲಾಗುತ್ತಿದೆ...',
    enhancedBadge: '✨ OpenCV AI ವರ್ಧಿತ ಫೋಟೋ ✓',
    capturedSuccess: 'ಫೋಟೋ ಯಶಸ್ವಿಯಾಗಿ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ! 🎉',
  },
};

export default function AddProductCameraScreen() {
  const router = useRouter();
  const [globalLang] = useGlobalLang();
  const t = CAMERA_STRINGS[globalLang] || CAMERA_STRINGS.hi;

  const videoRef = useRef<any>(null);
  const [webStream, setWebStream] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [isWebCamActive, setIsWebCamActive] = useState(false);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);

  const processAndEnhanceImage = async (rawUri: string) => {
    setCapturedImage(rawUri);
    setHasSnapped(true);
    setIsEnhancing(true);

    try {
      const enhancedBase64 = await enhanceCameraPhotoBase64(rawUri);
      if (enhancedBase64) {
        setEnhancedImage(enhancedBase64);
        setPendingProductPhoto(enhancedBase64, rawUri, true);
      } else {
        setEnhancedImage(rawUri);
        setPendingProductPhoto(rawUri, rawUri, false);
      }
    } catch {
      setEnhancedImage(rawUri);
      setPendingProductPhoto(rawUri, rawUri, false);
    } finally {
      setIsEnhancing(false);
    }
  };

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
        alert(t.camAlert);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        await processAndEnhanceImage(uri);
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
        alert(t.galleryAlert);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        await processAndEnhanceImage(uri);
      }
    } catch (err) {
      console.log('Error opening gallery:', err);
    }
  };

  const handleSnapPhoto = () => {
    if (hasSnapped) {
      // Retake photo
      setCapturedImage(null);
      setEnhancedImage(null);
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
          processAndEnhanceImage(dataUrl);
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
    const finalUri = enhancedImage || capturedImage;
    if (finalUri) {
      setPendingProductPhoto(finalUri, capturedImage, true);
    }
    router.push({
      pathname: '/add-product-details',
      params: {
        lang: globalLang,
        ...(finalUri ? { photoUri: finalUri } : {}),
      },
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

          {/* Top Language Selector */}
          <TopLangSelector />
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
              {hasSnapped && (enhancedImage || capturedImage) ? (
                <View style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <Image
                    source={{ uri: enhancedImage || capturedImage || '' }}
                    style={styles.capturedPhoto}
                    resizeMode="cover"
                  />
                  {isEnhancing ? (
                    <View style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      right: 12,
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                        {t.enhancingText}
                      </Text>
                    </View>
                  ) : enhancedImage ? (
                    <View style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      right: 12,
                      backgroundColor: '#3B6029',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                        {t.enhancedBadge}
                      </Text>
                    </View>
                  ) : null}
                </View>
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
                      ? t.capturedSuccess
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
