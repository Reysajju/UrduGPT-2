import React, { useRef, useState } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import type { ProfilePhotoState } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const DEFAULT_AVATAR = 'https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/avatars/01.png';

export function ProfilePhotoUpload() {
  const { updateSettings } = useSettingsStore();
  const [state, setState] = useState<ProfilePhotoState>({
    photo: null,
    isUploading: false,
    error: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG or PNG file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setState({ ...state, error });
      return;
    }

    setState({ ...state, isUploading: true, error: null });

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = preview;
      });

      // Set canvas dimensions to 150x150
      canvas.width = 150;
      canvas.height = 150;

      // Calculate dimensions to maintain aspect ratio
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      // Convert to base64
      const resizedImage = canvas.toDataURL(file.type);
      
      // Update settings with the new photo
      updateSettings({ profilePhoto: resizedImage });
      setState({ photo: resizedImage, isUploading: false, error: null });
    } catch (error) {
      setState({ ...state, isUploading: false, error: 'Failed to process image' });
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleRemovePhoto = () => {
    updateSettings({ profilePhoto: undefined });
    setState({ photo: null, isUploading: false, error: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={state.photo || DEFAULT_AVATAR}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
          />
          {state.isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              disabled={state.isUploading}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
            
            {state.photo && (
              <button
                onClick={handleRemovePhoto}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>
          
          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}
          
          <p className="text-sm text-white/70">
            JPG or PNG, max 5MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}