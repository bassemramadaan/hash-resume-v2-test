import { detectResumeRedFlags } from '../utils/redFlagDetector';
import { calculateResumeFingerprint, isResumeBlank } from '../utils/resumeFingerprint';
import { parsePaymentCodes } from '../types/payment';
import { createEmptyResume } from '../store/useResumeStore';
import { ResumeData } from '../types/resume';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[Unit Test Assertion Failed]: ${msg}`);
  }
}

async function runCoreFeaturesTests() {
  console.log('--- Running Automated Unit Tests for Core Features ---');

  // 1. Test Red Flag & ATS Detector
  console.log('Test 1: Testing ATS & Red Flag detector logic...');
  const dirtyResume: ResumeData = {
    personalInfo: {
      fullName: 'John Doe',
      jobTitle: 'Developer',
      email: 'rockstar_gamer99999@gmail.com', // Unprofessional email detected
      phone: '',                              // Missing phone
      location: 'Cairo',
      linkedin: '',
      summary: 'Muslim applicant, Single, National ID 12345678901234. Hard worker.', // Sensitive fields
    },
    experiences: [
      {
        id: '1',
        company: 'Old Corp',
        position: 'Junior Dev',
        location: 'Cairo',
        startDate: '2020',
        endDate: '2021',
        current: false,
        bulletPoints: ['Responsible for fixing bugs'],
      },
    ],
    education: [],
    skills: [{ id: 's1', name: 'Coding', category: 'technical' }],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };

  const redFlags = detectResumeRedFlags(dirtyResume);
  assert(redFlags.length >= 3, `Expected at least 3 red flags, got ${redFlags.length}`);
  console.log(`✓ Detected ${redFlags.length} actionable ATS red flags.`);

  // 2. Test Blank Resume & Fingerprint
  console.log('Test 2: Testing Blank resume state & Fingerprint calculation...');
  const emptyResume = createEmptyResume();
  assert(isResumeBlank(emptyResume), 'Initial empty resume must be detected as blank');

  const fp1 = calculateResumeFingerprint(emptyResume);
  emptyResume.personalInfo.fullName = 'Ahmed Ali';
  const fp2 = calculateResumeFingerprint(emptyResume);
  assert(fp1 !== fp2, 'Fingerprint must change when resume data is modified');
  console.log('✓ Fingerprint & blank state calculation verified.');

  // 3. Test Payment Codes Parser
  console.log('Test 3: Testing Payment code parsing & multi-key extraction...');
  const singleCodes = ['HASH-A1B2-C3D4'];
  const parsedSingle = parsePaymentCodes(singleCodes);
  assert(parsedSingle.activatedCode === 'HASH-A1B2-C3D4', 'Should set activatedCode on 50 EGP single plan');
  assert(parsedSingle.remainingCodes.length === 0, 'Should have 0 remaining codes for single plan');

  const bundleCodes = ['HASH-1111-2222', 'HASH-3333-4444', 'HASH-5555-6666'];
  const parsedBundle = parsePaymentCodes(bundleCodes);
  assert(parsedBundle.activatedCode === 'HASH-1111-2222', 'Should activate first code for current download');
  assert(parsedBundle.remainingCodes.length === 2, 'Should keep 2 remaining codes for 120 EGP bundle');
  assert(parsedBundle.remainingCodes[0] === 'HASH-3333-4444', 'Should preserve remaining key sequence');
  console.log('✓ Payment multi-key codes parser verified.');

  console.log('--- ALL Core Unit Tests Passed Successfully! ---');
}

runCoreFeaturesTests().catch((err) => {
  console.error('Core feature tests failed:', err);
  process.exit(1);
});

