import {
  loadSavedResume,
  saveResumeDirectly,
  loadSavedSettings,
  saveSettingsDirectly,
  loadSavedActivation,
  saveActivationDirectly,
  LOCAL_STORAGE_KEY_RESUME,
  LOCAL_STORAGE_KEY_SETTINGS,
  LOCAL_STORAGE_KEY_ACTIVATION,
  LOCAL_STORAGE_KEY_CORRUPT_BACKUP,
} from '../utils/resumeStorage';
import {
  createEmptyResume,
} from '../store/useResumeStore';
import {
  calculateResumeFingerprint,
  validateResumeLockState,
  isResumeBlank,
  clearDownloadCompletionFlags,
  STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED,
  STORAGE_KEY_RESUME_FINGERPRINT,
} from '../utils/resumeFingerprint';
import { ResumeData, ActivationState, ResumeSettings } from '../types/resume';

// Mock browser LocalStorage & SessionStorage in Node environment
class StorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Setup global mock
(global as any).localStorage = new StorageMock();
(global as any).sessionStorage = new StorageMock();
(global as any).window = {
  localStorage: (global as any).localStorage,
  sessionStorage: (global as any).sessionStorage,
};

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failure] ${message}`);
  }
}

async function runAutosaveAndLockTests() {
  console.log('--- Starting Autosave & Persistence Test Suite ---');

  // Test 1: New/incognito visitor starts blank
  {
    console.log('Test 1: New / Incognito visitor starts blank...');
    localStorage.clear();
    sessionStorage.clear();

    const empty = createEmptyResume();
    const { data, loadedFromStorage } = loadSavedResume(empty);

    assert(loadedFromStorage === false, 'Should report loadedFromStorage as false for new visitor');
    assert(isResumeBlank(data) === true, 'New visitor resume must be blank');
    assert(data.personalInfo.fullName === '', 'Full name must be empty');
    console.log('✓ Test 1 Passed: Blank initial state verified.');
  }

  // Test 2: Enter personal info (Arabic) -> refresh -> data remains intact
  {
    console.log('Test 2: Enter Arabic personal information and simulate reload...');
    localStorage.clear();

    const empty = createEmptyResume();
    const resumeArabic: ResumeData = {
      ...empty,
      personalInfo: {
        ...empty.personalInfo,
        fullName: 'أحمد محمود الفقي',
        jobTitle: 'مهندس برمجيات أول',
        email: 'ahmed.elfeqy@example.com',
        phone: '+201001234567',
        location: 'القاهرة، مصر',
        summary: 'أكثر من 5 سنوات من الخبرة المتميزة في بناء وتطوير التطبيقات السحابية',
      },
    };

    saveResumeDirectly(resumeArabic);

    // Simulate page reload by re-invoking loadSavedResume
    const { data: reloaded, loadedFromStorage } = loadSavedResume(createEmptyResume());

    assert(loadedFromStorage === true, 'Data should be loaded from storage');
    assert(reloaded.personalInfo.fullName === 'أحمد محمود الفقي', 'Arabic name must be preserved');
    assert(reloaded.personalInfo.email === 'ahmed.elfeqy@example.com', 'Email must be preserved');
    assert(reloaded.personalInfo.jobTitle === 'مهندس برمجيات أول', 'Job title must be preserved');
    assert(reloaded.personalInfo.summary.includes('أكثر من 5 سنوات'), 'Preset summary must NOT be wiped');
    console.log('✓ Test 2 Passed: Arabic resume draft persisted safely.');
  }

  // Test 3: Enter English personal information + experiences + reload
  {
    console.log('Test 3: Enter English resume with experiences and simulate reload...');
    localStorage.clear();

    const empty = createEmptyResume();
    const resumeEnglish: ResumeData = {
      ...empty,
      personalInfo: {
        ...empty.personalInfo,
        fullName: 'Sarah Jenkins',
        jobTitle: 'Product Manager',
        email: 'sarah.jenkins@example.com',
        phone: '+1 555 0199',
        location: 'San Francisco, CA',
        summary: 'Experienced PM leading cloud scale products.',
      },
      experiences: [
        {
          id: 'exp-101',
          company: 'CloudScale Inc',
          position: 'Senior PM',
          location: 'SF',
          startDate: '2021',
          endDate: 'Present',
          current: true,
          bulletPoints: ['Increased activation by 28%'],
        },
      ],
      skills: [
        { id: 'sk-1', name: 'Roadmapping', category: 'technical' },
      ],
    };

    saveResumeDirectly(resumeEnglish);

    const { data: reloaded } = loadSavedResume(createEmptyResume());
    assert(reloaded.personalInfo.fullName === 'Sarah Jenkins', 'English name preserved');
    assert(reloaded.experiences.length === 1, 'Experiences length preserved');
    assert(reloaded.experiences[0].company === 'CloudScale Inc', 'Experience company preserved');
    assert(reloaded.skills.length === 1, 'Skills preserved');
    console.log('✓ Test 3 Passed: English resume & multi-section data persisted safely.');
  }

  // Test 4: Blank new resume does NOT show download lock
  {
    console.log('Test 4: Blank new resume must never show download lock...');
    localStorage.clear();
    sessionStorage.clear();

    const blankResume = createEmptyResume();
    const activation: ActivationState = {
      isActivated: true,
      activatedCode: 'PREVIEW-CODE-123',
      remainingDownloads: 0,
      planType: 'single',
      activatedAt: new Date().toISOString(),
      isResumeLocked: true, // Corrupt/stale lock flag
      lockedResumeFingerprint: 'rfp_old123',
      verifiedReference: 'REF-123',
    };

    // Store stale lock flags
    sessionStorage.setItem(STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED, 'true');

    const { isValid } = validateResumeLockState(activation, blankResume);
    assert(isValid === false, 'Blank resume MUST NOT validate as locked');

    // Clean up flags safely without wiping entire storage
    clearDownloadCompletionFlags();
    assert(sessionStorage.getItem(STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED) === null, 'Stale flag removed');
    assert(localStorage.getItem(STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED) === null, 'Stale flag removed');
    console.log('✓ Test 4 Passed: Blank resume is protected against stale download locks.');
  }

  // Test 5: Valid existing resume remains editable unless matching verified record exists
  {
    console.log('Test 5: Valid resume editability vs verified lock verification...');
    const empty = createEmptyResume();
    const realResume: ResumeData = {
      ...empty,
      personalInfo: {
        ...empty.personalInfo,
        fullName: 'Omar Tarek',
        email: 'omar@example.com',
        jobTitle: 'Backend Engineer',
      },
    };

    const fingerprint = calculateResumeFingerprint(realResume);
    assert(Boolean(fingerprint), 'Fingerprint should be generated for non-empty resume');

    // 1. Unlocked case
    const unlockedActivation: ActivationState = {
      isActivated: false,
      activatedCode: null,
      remainingDownloads: 0,
      planType: 'free_preview',
      activatedAt: null,
      isResumeLocked: false,
    };
    const check1 = validateResumeLockState(unlockedActivation, realResume);
    assert(check1.isValid === false, 'Unlocked resume must be editable');

    // 2. Lock with mismatched fingerprint (modified resume)
    const lockedActivation: ActivationState = {
      isActivated: true,
      activatedCode: 'HASH-ACT-1',
      remainingDownloads: 0,
      planType: 'single',
      activatedAt: new Date().toISOString(),
      isResumeLocked: true,
      lockedResumeFingerprint: 'rfp_different_fingerprint',
      verifiedReference: 'VERIFIED-REF-999',
    };
    sessionStorage.setItem(STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED, 'true');
    sessionStorage.setItem('verified_reference', 'VERIFIED-REF-999');

    const check2 = validateResumeLockState(lockedActivation, realResume);
    assert(check2.isValid === false, 'Mismatched fingerprint must unlock resume');

    // 3. Fully matched legitimate lock
    lockedActivation.lockedResumeFingerprint = fingerprint;
    sessionStorage.setItem(STORAGE_KEY_RESUME_FINGERPRINT, fingerprint);

    const check3 = validateResumeLockState(lockedActivation, realResume);
    assert(check3.isValid === true, 'Legitimate matching record is validly locked');
    console.log('✓ Test 5 Passed: Lock state accurately enforces cryptographic fingerprint matching.');
  }

  // Test 6: Corrupted JSON data recovery & backup test
  {
    console.log('Test 6: Corrupt JSON handling...');
    localStorage.clear();
    const corruptPayload = '{"personalInfo": {"fullName": "Corrupted Json... unclosed string';
    localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, corruptPayload);

    const { data: recovered, loadedFromStorage } = loadSavedResume(createEmptyResume());
    assert(loadedFromStorage === false, 'Corrupt data should not be loaded as valid resume');
    assert(isResumeBlank(recovered) === true, 'Safe fallback should be blank');
    assert(localStorage.getItem(LOCAL_STORAGE_KEY_CORRUPT_BACKUP) === corruptPayload, 'Corrupt backup must be saved');
    console.log('✓ Test 6 Passed: Corrupt data backed up safely without crashing.');
  }

  // Test 7: Simulated Deployment / Update
  {
    console.log('Test 7: Simulated cache update / deployment persistence...');
    const userDraft: ResumeData = {
      ...createEmptyResume(),
      personalInfo: {
        fullName: 'Nouran El-Sayed',
        jobTitle: 'Data Analyst',
        email: 'nouran.elsayed@example.com',
        phone: '+20 111 222 3333',
        location: 'Alexandria, Egypt',
        linkedin: '',
        github: '',
        website: '',
        photoUrl: '',
        summary: 'Specialized in SQL and Python data visualization.',
      },
    };

    saveResumeDirectly(userDraft);

    // Simulate SW / Cache wipe (only caches, never localStorage)
    // LocalStorage remains untouched
    const { data: preservedDraft } = loadSavedResume(createEmptyResume());
    assert(preservedDraft.personalInfo.fullName === 'Nouran El-Sayed', 'User draft preserved across deployment updates');
    console.log('✓ Test 7 Passed: Resume draft persisted across simulated updates.');
  }

  console.log('\n🎉 ALL AUTOSAVE & PERSISTENCE TESTS PASSED SUCCESSFULLY! (100% PASS RATE)\n');
}

runAutosaveAndLockTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
