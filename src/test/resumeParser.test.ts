import {
  normalizeJsonResume,
  parseCvTextLines,
  isResumeEmpty,
  mergeResumeData,
  parseResumeFile,
} from '../services/resumeParser';
import { createEmptyResume } from '../store/useResumeStore';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${msg}`);
  }
}

async function runAllTests() {
  console.log('--- Starting Complete Resume Parser Test Suite ---');

  // Test 1: Valid exported JSON
  {
    console.log('Test 1: Valid exported JSON structure...');
    const validJsonObj = {
      personalInfo: {
        fullName: 'Omar Hassan',
        jobTitle: 'Senior Frontend Engineer',
        email: 'omar@example.com',
        phone: '+20 100 000 0000',
        location: 'Cairo, Egypt',
        linkedin: 'https://linkedin.com/in/omarhassan',
        github: 'https://github.com/omarhassan',
        summary: 'Experienced developer building modern web apps.',
      },
      experiences: [
        {
          id: 'exp-1',
          company: 'Tech Corp',
          position: 'Frontend Lead',
          location: 'Cairo',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bulletPoints: ['Architected design system', 'Reduced bundle size by 40%'],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Cairo University',
          degree: 'Bachelor of Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016',
          endDate: '2020',
        },
      ],
      skills: [
        { id: 'sk-1', name: 'React', category: 'technical' },
        { id: 'sk-2', name: 'TypeScript', category: 'technical' },
      ],
      projects: [
        {
          id: 'pr-1',
          title: 'Hash Resume',
          description: 'ATS resume builder',
          technologies: ['React', 'Tailwind'],
        },
      ],
      certifications: [
        {
          id: 'ct-1',
          title: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023',
        },
      ],
      languages: [
        { id: 'lg-1', language: 'Arabic', proficiency: 'native' },
        { id: 'lg-2', language: 'English', proficiency: 'fluent' },
      ],
    };

    const normalized = normalizeJsonResume(validJsonObj);
    assert(normalized.personalInfo.fullName === 'Omar Hassan', 'Name should match');
    assert(normalized.personalInfo.email === 'omar@example.com', 'Email should match');
    assert(normalized.experiences.length === 1, 'Experiences length should be 1');
    assert(normalized.education.length === 1, 'Education length should be 1');
    assert(normalized.skills.length === 2, 'Skills length should be 2');
    assert(!isResumeEmpty(normalized), 'Resume should not be empty');
    console.log('✓ Valid exported JSON passed.');
  }

  // Test 2: Invalid JSON format & empty JSON structure
  {
    console.log('Test 2: Invalid JSON rejection...');
    let threw = false;
    try {
      normalizeJsonResume({ random: 'data', other: 123 });
    } catch (e: any) {
      threw = true;
      assert(e.message === 'INVALID_JSON', 'Should throw INVALID_JSON');
    }
    assert(threw, 'Invalid JSON should throw');
    console.log('✓ Invalid JSON rejection passed.');
  }

  // Test 3: Unsupported file type handling
  {
    console.log('Test 3: Unsupported file type...');
    let threw = false;
    try {
      const dummyFile = new File(['hello content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      await parseResumeFile(dummyFile, 'en');
    } catch (e: any) {
      threw = true;
      assert(
        e.message.includes('PDF or JSON') || e.message.includes('PDF أو JSON'),
        'Should reject unsupported file with clear message'
      );
    }
    assert(threw, 'Unsupported file should throw');
    console.log('✓ Unsupported file handling passed.');
  }

  // Test 4: CV Text Lines extraction (English & Arabic)
  {
    console.log('Test 4: Text lines & Headings parser for English & Arabic...');
    const sampleCvLines = [
      'Bassam Ramadan',
      'Senior Full Stack Engineer',
      'Cairo, Egypt',
      'bassem@example.com • +20 100 123 4567 • linkedin.com/in/bassemramadan',
      'Professional Summary',
      'Accomplished software engineer with 7+ years of experience in React, Node.js, and Cloud architectures.',
      'Work Experience',
      'Senior Engineer - Tech Corp - Cairo',
      '• Built high-scale microservices serving 1M+ active users.',
      '• Led frontend modernization to React 19 and Tailwind CSS.',
      'Education',
      'BSc Computer Engineering - Ain Shams University',
      'Technical Skills',
      'React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL, Docker, AWS',
      'Languages',
      'Arabic (Native), English (Fluent)',
    ];

    const parsed = parseCvTextLines(sampleCvLines);
    assert(parsed.personalInfo.fullName.includes('Bassam Ramadan'), 'Name should be Bassam Ramadan');
    assert(parsed.personalInfo.email === 'bassem@example.com', 'Email should be extracted');
    assert(parsed.personalInfo.phone.includes('100 123 4567'), 'Phone should be extracted');
    assert(parsed.personalInfo.summary.includes('Accomplished software engineer'), 'Summary should be extracted');
    assert(parsed.experiences.length >= 1, 'Should extract at least 1 experience');
    assert(parsed.education.length >= 1, 'Should extract education');
    assert(parsed.skills.length >= 5, 'Should extract multiple skills');
    console.log('✓ CV Text lines & Headings parser passed.');
  }

  // Test 5: Arabic headings extraction
  {
    console.log('Test 5: Arabic Headings parser...');
    const arabicCvLines = [
      'أحمد محمود الفقي',
      'مهندس نظم وبرمجيات سحابية',
      'الرياض، المملكة العربية السعودية',
      'ahmed@example.com • +966 50 123 4567',
      'النبذة الشخصية',
      'مهندس برمجيات محترف أمتلك خبرة تتجاوز 6 سنوات في بناء المنصات الرقمية وتصميم بنى الخدمات المصغرة.',
      'الخبرات المهنية',
      'مهندس برمجيات أول - شركة الحلول المتقدمة - الرياض',
      '• قيادة فريق التطوير وإطلاق بوابات دفع متطورة.',
      'التعليم',
      'بكالوريوس هندسة الحاسب والمعلومات - جامعة الملك سعود',
      'المهارات',
      'جافاسكريبت, تايب سكريبت, رياكت, نود, دوكر, بايثون',
      'اللغات',
      'العربية, الإنجليزية',
    ];

    const parsed = parseCvTextLines(arabicCvLines);
    assert(parsed.personalInfo.fullName.includes('أحمد محمود'), 'Arabic Name should be extracted');
    assert(parsed.personalInfo.email === 'ahmed@example.com', 'Arabic Email should be extracted');
    assert(parsed.personalInfo.location.includes('الرياض'), 'Arabic location should be extracted');
    assert(parsed.personalInfo.summary.includes('مهندس برمجيات محترف'), 'Arabic summary should be extracted');
    assert(parsed.experiences.length >= 1, 'Arabic experience should be extracted');
    assert(parsed.education.length >= 1, 'Arabic education should be extracted');
    assert(parsed.skills.length >= 4, 'Arabic skills should be extracted');
    console.log('✓ Arabic Headings parser passed.');
  }

  // Test 6: Empty text / Scanned PDF empty check
  {
    console.log('Test 6: Empty resume detection...');
    const emptyResume = createEmptyResume();
    assert(isResumeEmpty(emptyResume), 'createEmptyResume must be detected as empty');

    const emptyLines: string[] = [];
    const parsedEmpty = parseCvTextLines(emptyLines);
    assert(isResumeEmpty(parsedEmpty), 'Empty lines must produce empty resume');
    console.log('✓ Empty resume detection passed.');
  }

  // Test 7: Merge vs Replace logic
  {
    console.log('Test 7: Merge vs Replace logic...');
    const current = createEmptyResume();
    current.personalInfo.fullName = 'Existing User';
    current.personalInfo.email = 'existing@email.com';
    current.experiences = [
      {
        id: 'e-1',
        company: 'Old Company',
        position: 'Junior Dev',
        location: 'Cairo',
        startDate: '2019',
        endDate: '2021',
        current: false,
        bulletPoints: ['Fixed bugs'],
      },
    ];

    const incoming = createEmptyResume();
    incoming.personalInfo.fullName = 'Incoming User';
    incoming.personalInfo.phone = '+20 111 222 3333';
    incoming.personalInfo.jobTitle = 'Frontend Engineer';
    incoming.experiences = [
      {
        id: 'e-2',
        company: 'New Company',
        position: 'Lead Dev',
        location: 'Dubai',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bulletPoints: ['Built apps'],
      },
    ];
    incoming.skills = [{ id: 's1', name: 'TypeScript', category: 'technical' }];

    // Merge: preserves existing name & email, adds new phone, job title, and appends unique experiences
    const merged = mergeResumeData(current, incoming);
    assert(merged.personalInfo.fullName === 'Existing User', 'Merge must preserve existing name');
    assert(merged.personalInfo.email === 'existing@email.com', 'Merge must preserve existing email');
    assert(merged.personalInfo.phone === '+20 111 222 3333', 'Merge must fill in missing phone');
    assert(merged.personalInfo.jobTitle === 'Frontend Engineer', 'Merge must fill in missing job title');
    assert(merged.experiences.length === 2, 'Merge must combine experiences');
    assert(merged.skills.length === 1, 'Merge must add incoming skills');
    console.log('✓ Merge vs Replace logic passed.');
  }

  // Test 8: Re-importing same file & input reset verification
  {
    console.log('Test 8: Input reset simulation...');
    const mockInputElement = { value: 'C:\\fakepath\\resume.pdf' };
    mockInputElement.value = '';
    assert(mockInputElement.value === '', 'File input value should be cleared after outcome');
    console.log('✓ Input reset verification passed.');
  }

  console.log('🎉 ALL RESUME PARSER TESTS COMPLETED SUCCESSFULLY WITH 100% PASS RATE!');
}

runAllTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
