import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import gsap from 'gsap';
import * as confetti from 'canvas-confetti';

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  text: string;
  photoKey: string;
  defaultSvg: string;
  defaultImage?: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'birthday-app';

  // Audio System
  audio!: HTMLAudioElement;
  isPlaying = false;
  isMuted = false;
  currentTrackIndex = 0;
  audioVolume = 0.5;
  tracks = [
    { name: 'Kehte Hain Khuda Ne (Raabta)', url: 'assets/raabta.mp3' },
    { name: 'Tender Affection', url: 'assets/tender_affection.mp3' },
    { name: 'Romantic Serenade', url: 'assets/romantic_serenade.mp3' }
  ];
  showMusicPanel = false;
  customTrackUrl = '';

  // Google Search Surprise
  googleSearchInput = '';
  isGoogleTyping = false;
  isGoogleLoading = false;
  showGoogleResults = false;
  googleSurpriseUnlocked = false;

  // Timeline & local-storage photos
  timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      title: '✨ The Day Destiny Sat Between Us',
      date: 'Our First Meeting',
      text: 'The moment where awkward introductions slowly turned into endless comfort.',
      photoKey: 'photo_memory_firstmeeting',
      defaultSvg: 'cafe',
      defaultImage: 'assets/firstmeeting.png'
    },
    {
      id: 2,
      title: 'The Moment I Saw You ❤️',
      date: 'Our Dream Date',
      text: `That moment felt like a scene straight out of my dreams. 🕊️`,
      photoKey: 'photo_memory_9',
      defaultSvg: 'park',
      defaultImage: 'assets/Gemini_waiting_with_flowers.png'
    },
    {
      id: 3,
      title: '💍 Proposal Moment',
      date: '28 November 2024',
      text: 'The moment our forever started.',
      photoKey: 'photo_memory_1',
      defaultSvg: 'ring',
      defaultImage: 'assets/ChatGPT_Prapose.png'
    },
    {
      id: 4,
      title: '☕ Cafe Hand-Holding Conversation',
      date: 'Cozy Cafe Date',
      text: 'Some conversations become memories forever.',
      photoKey: 'photo_memory_2',
      defaultSvg: 'cafe',
      defaultImage: 'assets/Gemini_cafe_night.png'
    },
    {
      id: 5,
      title: '🛵 best Hug Ever',
      date: 'Evening Rides',
      text: 'You always felt like home.',
      photoKey: 'photo_memory_3',
      defaultSvg: 'scooter',
      defaultImage: 'assets/hug.png'
    },
    {
      id: 6,
      title: '🍽️ Sharing our fav food - Sizzler at Yanki',
      date: 'Yanki Restaurant',
      text: 'Every meal tasted better with you.',
      photoKey: 'photo_memory_4',
      defaultSvg: 'food',
      defaultImage: 'assets/yanki_fav_food.png'
    },
    {
      id: 7,
      title: '🌙 Balcony Relaxing Night',
      date: 'Cozy Midnight Peace',
      text: 'Peace was always beside you.',
      photoKey: 'photo_memory_5',
      defaultSvg: 'moon',
      defaultImage: 'assets/balcony.png'
    },
    {
      id: 8,
      title: '🚉 Station Surprise With Injured Leg',
      date: 'Station Reunion',
      text: 'He was waiting for me at the station despite having one injured leg, still smiling and surprising me. That day I realized how deeply you love me.',
      photoKey: 'photo_memory_6',
      defaultSvg: 'station',
      defaultImage: 'assets/injurded.png'
    },
    {
      id: 9,
      title: '💄 Painting Happiness',
      date: 'Sweet Makeup Date',
      text: `Getting ready with the person I love most. He makes my heart blush more than the makeup—not just doing makeup, he's painting happiness on my face. His care feels softer than any blush. 🌸`,
      photoKey: 'photo_memory_10',
      defaultSvg: 'cafe',
      defaultImage: 'assets/makeup.png'
    }
  ];

  activeMemoryPreview: TimelineEvent | null = null;

  // Voice Controlled Surprise
  isSpeechSupported = false;
  recognition: any;
  isListening = false;
  voiceInputText = '';
  voiceSurpriseUnlocked = false;
  voiceErrorText = '';
  manualCodeInput = '';

  // Reasons Flip Cards
  reasons = [
    { title: 'Your Smile', desc: 'Your smile lights up even my darkest days. It’s my absolute favorite view in the whole world.', icon: 'smile' },
    { title: 'Your Care', desc: 'The gentle way you check up on me, pamper me, and make sure I have eaten. You care like no other.', icon: 'heart' },
    { title: 'The Way You Understand Me', desc: 'You read between my lines and understand my silence, my chaotic thoughts, and my unsaid worries.', icon: 'sparkles' },
    { title: 'How Safe I Feel With You', desc: 'No matter how chaotic the world gets, in your virtual or real embrace, I feel fully protected and peaceful.', icon: 'shield' },
    { title: 'Your Support', desc: 'You push me towards my dreams, support my ambitions, and believe in me even when I doubt myself.', icon: 'star' },
    { title: 'Our Memories Together', desc: 'Every late-night call, shared laugh, virtual movie date, and sweet conversation is forever locked in my heart.', icon: 'camera' }
  ];

  // Romantic Spin Wheel Game & Coupon Locker
  isSpinning = false;
  wonCoupon: any = null;
  claimedCoupons: string[] = [];
  couponsList = [
    { id: 'yes_day', name: '🍔 Yes-Day! (I pay for food)', desc: 'A whole day where I say YES to your planned cozy dates and treat you to your favorite meal!' },
    { id: 'coffee_chat', name: '☕ Midnight Coffee & Chat', desc: 'A cozy midnight video date sharing warm drinks and endless conversations with zero rules!' },
    { id: 'forehead_kisses', name: '💋 Forehead Kisses & Hugs', desc: 'Good for one million warm hugs and sweet forehead kisses next time we meet!' },
    { id: 'stargazing', name: '🌙 Romantic Stargazing Call', desc: 'A late-night call where we stargaze together and exchange sweet, romantic secrets.' },
    { id: 'surprise_gift', name: '🎁 A Secret Surprise Gift', desc: 'Mansi\'s secret choice coupon! Claim this to receive a special package made with love.' },
    { id: 'pampering', name: '🌸 Infinite Free Pampering', desc: 'A whole day dedicated entirely to pampering you, doing your makeup, and showering you with affection.' }
  ];

  // Dictionary of loaded base64 images
  loadedImages: { [key: string]: string } = {};

  // Long Distance Section Details
  loveStartDate = new Date('2024-07-07T00:00:00');
  timeElapsed = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private counterInterval: any;

  // Birthday Special Section
  cakeCandlesLit = true;
  wishMade = false;
  showWishConfirmation = false;
  smokeParticles: Array<{ left: number; top: number; size: number }> = [];

  // Love Letter
  letterOpened = false;
  letterText = `My dearest Raj,

Happy Birthday, my love! ❤️

Thank you for entering my life and making it so incredibly beautiful. Distance may keep us in separate cities today, but there is not a single second where my heart doesn't feel your presence.

Every conversation we share, every virtual coffee, and every little memory we have created feels like pure magic. I am so grateful for your infinite care, your warm smile, and the safety I find in you.

No matter where life takes us, I want every chapter of my life to have you in it. You are my forever, my home, and the love of my life.

I hope this birthday brings you all the happiness, laughter, and success in the world, and I promise to spend all your future birthdays right beside you.

With all my love, always and forever,
Mansi 🌸`;

  letterTypewriterText = '';
  private letterInterval: any;

  // Heart generation list
  floatingHearts: Array<{ id: number; left: number; size: number; delay: number; duration: number }> = [];
  
  @ViewChild('cakeContainer') cakeContainer!: ElementRef;

  ngOnInit() {
    this.initAudio();
    this.initSpeechRecognition();
    this.loadPersistedImages();
    this.startLoveCounter();
    this.generateFloatingHeartsArray();
    this.animateStarsBackground();
    this.loadClaimedCoupons();
  }

  ngOnDestroy() {
    if (this.counterInterval) clearInterval(this.counterInterval);
    if (this.letterInterval) clearInterval(this.letterInterval);
  }

  // --- AUDIO CONTROLLER ---
  initAudio() {
    this.audio = new Audio(this.tracks[this.currentTrackIndex].url);
    this.audio.loop = true;
    this.audio.volume = this.audioVolume;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.log('Autoplay blocked. User gesture required.', err);
        // Retry
        this.isPlaying = false;
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
  }

  changeVolume(event: any) {
    this.audioVolume = event.target.value;
    this.audio.volume = this.audioVolume;
  }

  changeTrack(index: number) {
    this.currentTrackIndex = index;
    const wasPlaying = this.isPlaying;
    this.audio.pause();
    this.audio = new Audio(this.tracks[index].url);
    this.audio.loop = true;
    this.audio.volume = this.audioVolume;
    this.audio.muted = this.isMuted;
    if (wasPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      });
    }
  }

  playCustomUrl() {
    if (this.customTrackUrl) {
      const wasPlaying = this.isPlaying;
      this.audio.pause();
      this.audio = new Audio(this.customTrackUrl);
      this.audio.loop = true;
      this.audio.volume = this.audioVolume;
      this.audio.muted = this.isMuted;
      if (wasPlaying) {
        this.audio.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {
          alert('Could not play the custom audio URL. Please check the link.');
        });
      } else {
        this.audio.play().then(() => {
          this.isPlaying = true;
        });
      }
    }
  }

  // --- PERSISTED IMAGES MANAGEMENT ---
  loadPersistedImages() {
    // Check all timeline keys
    this.timelineEvents.forEach(e => {
      const saved = localStorage.getItem(e.photoKey);
      if (saved) {
        this.loadedImages[e.photoKey] = saved;
      }
    });
  }

  onPhotoUploaded(event: any, key: string) {
    const file = event.target.files[0];
    if (!file) return;

    // Standard compress & convert to Base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Str = e.target.result;
      
      // Save in localStorage (if it fits, limit size by compressing if necessary)
      try {
        localStorage.setItem(key, base64Str);
        this.loadedImages[key] = base64Str;
        this.triggerSingleConfetti();
      } catch (err) {
        console.error('Storage full! Trying to save directly.', err);
        alert('Image is too large. Please select a smaller photo or compress it.');
      }
    };
    reader.readAsDataURL(file);
  }

  deletePhoto(key: string, event: Event) {
    event.stopPropagation();
    localStorage.removeItem(key);
    delete this.loadedImages[key];
  }

  // --- FLOATING HEARTS BACKGROUND ---
  generateFloatingHeartsArray() {
    for (let i = 0; i < 30; i++) {
      this.floatingHearts.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 10,
        duration: Math.random() * 8 + 6
      });
    }
  }

  triggerSingleConfetti() {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff4d80', '#ffd700', '#24083a', '#e0115f']
    });
  }

  // --- ACTIONS ---
  startStory() {
    this.triggerSingleConfetti();
    
    // Play music automatically when user clicks Start
    if (!this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.log('Blocked autoplay bypassed by user action.', err);
      });
    }

    const nextSection = document.getElementById('google-surprise');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Start typing surprise
    setTimeout(() => {
      this.startGoogleTypingAnimation();
    }, 800);
  }

  // --- GOOGLE SEARCH STYLE SURPRISE ---
  startGoogleTypingAnimation() {
    if (this.isGoogleTyping || this.googleSurpriseUnlocked) return;
    this.isGoogleTyping = true;
    this.googleSearchInput = '';
    
    const textToType = "Searching for the best person in the world...";
    let i = 0;
    const typingTimer = setInterval(() => {
      if (i < textToType.length) {
        this.googleSearchInput += textToType.charAt(i);
        i++;
      } else {
        clearInterval(typingTimer);
        this.isGoogleTyping = false;
        
        // Trigger Loading spinner
        this.isGoogleLoading = true;
        setTimeout(() => {
          this.isGoogleLoading = false;
          this.showGoogleResults = true;
          this.googleSurpriseUnlocked = true;
          
          // Confetti for success!
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff4d80', '#ffd700']
          });
        }, 2200);
      }
    }, 80);
  }

  resetGoogleSurprise() {
    this.googleSearchInput = '';
    this.isGoogleTyping = false;
    this.isGoogleLoading = false;
    this.showGoogleResults = false;
    this.googleSurpriseUnlocked = false;
    this.startGoogleTypingAnimation();
  }

  scrollFromGoogle() {
    const nextSection = document.getElementById('timeline-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --- WEB SPEECH RECOGNITION API ---
  initSpeechRecognition() {
    const SpeechObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechObj) {
      this.isSpeechSupported = true;
      this.recognition = new SpeechObj();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.voiceErrorText = '';
      };
      
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        this.isListening = false;
        this.voiceErrorText = 'Speech not recognized. Please try again or use manual box below!';
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
      
      this.recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript.toLowerCase();
        this.voiceInputText = resultText;
        this.checkSpeechResult(resultText);
      };
    } else {
      this.isSpeechSupported = false;
    }
  }

  toggleListening() {
    if (!this.isSpeechSupported) return;
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.voiceInputText = '';
      this.recognition.start();
    }
  }

  checkSpeechResult(text: string) {
    if (text.includes('i love you') || text.includes('love you') || text.includes('love') || text.includes('raj') || text.includes('mansi')) {
      this.unlockVoiceSurprise();
    } else {
      this.voiceErrorText = `You said: "${text}". Say "I Love You" to unlock!`;
    }
  }

  submitManualCode() {
    const cleanCode = this.manualCodeInput.trim().toLowerCase();
    if (cleanCode.includes('i love you') || cleanCode.includes('love') || cleanCode === 'iloveyou') {
      this.unlockVoiceSurprise();
    } else {
      this.voiceErrorText = 'Incorrect code. Type "I Love You" to unlock the magic!';
    }
  }

  unlockVoiceSurprise() {
    this.voiceSurpriseUnlocked = true;
    this.voiceErrorText = '';
    
    // Play a massive explosion of hearts!
    const end = Date.now() + (3 * 1000);
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#ff4d80', '#e0115f', '#ffd700']
      });
    }, 200);

    setTimeout(() => {
      const voiceSurpriseResult = document.getElementById('voice-surprise-unlocked-panel');
      if (voiceSurpriseResult) {
        voiceSurpriseResult.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }

  // --- LOVE TIMELINE DURATION COUNTER ---
  startLoveCounter() {
    const updateTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - this.loveStartDate.getTime();
      
      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      this.timeElapsed = { days, hours, minutes, seconds };
    };

    updateTime();
    this.counterInterval = setInterval(updateTime, 1000);
  }





  triggerMassiveConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti burst from both sides
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  blowOutCandles() {
    if (!this.cakeCandlesLit) return;
    this.cakeCandlesLit = false;

    // Create realistic smoke particles
    this.smokeParticles = [];
    const candleCount = 5;
    for (let i = 0; i < candleCount; i++) {
      this.smokeParticles.push({
        left: 20 + i * 35 + Math.random() * 5,
        top: -15 - Math.random() * 5,
        size: Math.random() * 6 + 4
      });
    }

    // Gentle smoke fade out
    setTimeout(() => {
      this.smokeParticles = [];
    }, 2000);

    // Massive confetti explosion for the birthday wish!
    this.triggerMassiveConfetti();
  }

  makeAWish() {
    this.wishMade = true;
    this.showWishConfirmation = true;
    
    // Sparkle confetti effect
    const defaults = { spread: 360, ticks: 50, gravity: 0.5, decay: 0.94, startVelocity: 30, colors: ['#ffd700', '#ffeb3b'] };
    confetti({ ...defaults, particleCount: 40, scalar: 1.2 });
    confetti({ ...defaults, particleCount: 20, scalar: 0.75 });
  }

  // --- LOVE LETTER OPENER ---
  toggleLetter() {
    this.letterOpened = !this.letterOpened;
    
    if (this.letterOpened) {
      this.letterTypewriterText = '';
      let index = 0;
      if (this.letterInterval) clearInterval(this.letterInterval);
      
      this.letterInterval = setInterval(() => {
        if (index < this.letterText.length) {
          this.letterTypewriterText += this.letterText.charAt(index);
          index++;
        } else {
          clearInterval(this.letterInterval);
        }
      }, 35); // Fast fluid typing speed
    } else {
      if (this.letterInterval) clearInterval(this.letterInterval);
      this.letterTypewriterText = '';
    }
  }

  // --- REPLAY OUR STORY ---
  replayStory() {
    // Reset surprises if they want to experience again
    this.googleSurpriseUnlocked = false;
    this.showGoogleResults = false;
    this.googleSearchInput = '';
    this.voiceSurpriseUnlocked = false;
    this.manualCodeInput = '';
    this.cakeCandlesLit = true;
    this.wishMade = false;
    this.showWishConfirmation = false;
    this.letterOpened = false;
    this.letterTypewriterText = '';
    this.activeMemoryPreview = null;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.triggerSingleConfetti();
  }

  selectMemoryPreview(event: TimelineEvent) {
    this.activeMemoryPreview = event;
    this.triggerSingleConfetti();
  }

  closeMemoryPreview() {
    this.activeMemoryPreview = null;
  }

  // --- ROMANTIC SPIN WHEEL GAME & COUPON LOCKER ---
  loadClaimedCoupons() {
    const saved = localStorage.getItem('claimed_coupons');
    if (saved) {
      this.claimedCoupons = JSON.parse(saved);
    }
  }

  spinWheel() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.wonCoupon = null;

    // Pick a random slice index (0 to 5)
    const randomIndex = Math.floor(Math.random() * this.couponsList.length);
    
    // Slices are 60 degrees. Let's calculate spin.
    const sliceAngle = 360 / this.couponsList.length;
    const baseRotations = 1800; // 5 full spins
    const targetOffset = 360 - (randomIndex * sliceAngle + sliceAngle / 2);
    const finalAngle = baseRotations + targetOffset;

    gsap.set('.wheel-canvas', { rotation: 0 });

    gsap.to('.wheel-canvas', {
      rotation: finalAngle,
      duration: 4,
      ease: 'power4.out',
      onComplete: () => {
        this.isSpinning = false;
        this.wonCoupon = this.couponsList[randomIndex];
        this.triggerSingleConfetti();
        
        // Trigger sweet confetti spray
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#ff4d80', '#ffd700']
        });
      }
    });
  }

  claimCoupon(couponId: string) {
    if (!this.claimedCoupons.includes(couponId)) {
      this.claimedCoupons.push(couponId);
      localStorage.setItem('claimed_coupons', JSON.stringify(this.claimedCoupons));
      this.wonCoupon = null;
      this.triggerSingleConfetti();
    }
  }

  isCouponClaimed(couponId: string): boolean {
    return this.claimedCoupons.includes(couponId);
  }

  // Canvas star background particles
  animateStarsBackground() {
    // We can run a smooth CSS particle stars effect or let GSAP do animations.
    // CSS-based background twinkling is highly optimized.
  }
}
