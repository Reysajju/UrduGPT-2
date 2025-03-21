class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private initialized = false;

  private async initializeSounds() {
    if (this.initialized) return;

    // Using more reliable notification sounds from Mixkit
const soundUrls = {
  send: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  receive: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3'
};

    for (const [name, url] of Object.entries(soundUrls)) {
      try {
        const audio = new Audio();
        
        // Set up error handling before setting the source
        audio.onerror = (e) => {
          console.error(`Error loading sound ${name}:`, e);
          this.handleSoundLoadError(name);
        };

        audio.preload = 'auto';
        audio.src = url;
        
        // Set specific volume levels for each sound type
        if (name === 'send') {
          audio.volume = 0.3; // Sent messages are quieter
        } else {
          audio.volume = 0.5; // Received messages are more noticeable
        }
        
        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
          audio.oncanplaythrough = resolve;
          audio.onerror = reject;
        });
        
        this.sounds.set(name, audio);
      } catch (error) {
        console.error(`Failed to load sound: ${name}`, error);
        this.handleSoundLoadError(name);
      }
    }

    this.initialized = true;
  }

  private handleSoundLoadError(name: string) {
    // Create a silent audio element as fallback
    const silentAudio = new Audio();
    silentAudio.volume = 0;
    this.sounds.set(name, silentAudio);
  }

  async playSound(name: 'send' | 'receive', volume: number = 0.5) {
    try {
      await this.initializeSounds();
      const sound = this.sounds.get(name);
      if (sound) {
        // Apply user-defined volume while maintaining relative volume differences
        const baseVolume = name === 'send' ? 0.3 : 0.5;
        sound.volume = (volume * baseVolume);
        
        // Reset the audio to the beginning if it's already playing
        sound.currentTime = 0;
        await sound.play().catch(error => {
          console.warn(`Failed to play sound ${name}:`, error);
        });
      }
    } catch (error) {
      console.error('Error in playSound:', error);
      // Continue execution even if sound fails
    }
  }

  clearSounds() {
    this.sounds.forEach(sound => {
      sound.src = '';
      sound.remove();
    });
    this.sounds.clear();
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();