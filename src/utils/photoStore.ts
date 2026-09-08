let pendingPhotoUri: string | null = null;
let pendingOriginalUri: string | null = null;
let isAiEnhanced: boolean = false;

export function setPendingProductPhoto(photoUri: string | null, originalUri: string | null = null, aiEnhanced: boolean = false) {
  pendingPhotoUri = photoUri;
  pendingOriginalUri = originalUri || photoUri;
  isAiEnhanced = aiEnhanced;
}

export function getPendingProductPhoto() {
  return {
    photoUri: pendingPhotoUri,
    originalUri: pendingOriginalUri,
    aiEnhanced: isAiEnhanced,
  };
}

export function clearPendingProductPhoto() {
  pendingPhotoUri = null;
  pendingOriginalUri = null;
  isAiEnhanced = false;
}
