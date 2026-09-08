import React from 'react';
import { TemplateId } from '../../types/resume';

interface TemplateMiniLayoutProps {
  templateId: TemplateId;
  previewColor?: string;
  isAr?: boolean;
}

export const TemplateMiniLayout: React.FC<TemplateMiniLayoutProps> = ({
  templateId,
  isAr = false,
}) => {
  switch (templateId) {
    // 1. Bassux (ATS Classic) - Pure single-column text, centered header, horizontal rules, no badges/graphics
    case 'bassux':
      return (
        <div className="w-full h-full bg-white p-3 rounded-lg border border-slate-200/90 text-slate-900 font-sans flex flex-col justify-between select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Centered ATS Header */}
          <div className="text-center border-b border-black pb-1.5 mb-1.5">
            <div className="font-bold text-[11px] uppercase tracking-wider text-black">
              {isAr ? 'باسم رمضان' : 'JOHN DOE'}
            </div>
            <div className="text-[8px] font-semibold text-neutral-800 mt-0.5">
              {isAr ? 'مهندس برمجيات أول' : 'SENIOR SOFTWARE ENGINEER'}
            </div>
            <div className="text-[6.5px] text-neutral-600 mt-0.5 tracking-tight flex items-center justify-center gap-1">
              <span>Cairo, EG</span>
              <span>•</span>
              <span>john@email.com</span>
              <span>•</span>
              <span>+20 100 000 0000</span>
            </div>
          </div>

          {/* Section 1: Experience */}
          <div className="space-y-1 mb-1.5 text-start">
            <div className="font-bold text-[8px] uppercase tracking-wide border-b border-black/70 pb-0.5 flex justify-between">
              <span>{isAr ? 'الخبرات المهنية' : 'PROFESSIONAL EXPERIENCE'}</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline text-[7.5px]">
                <span className="font-bold text-black">Tech Solutions Inc. - Lead Engineer</span>
                <span className="text-[6.5px] text-neutral-600 font-mono">2021 – Present</span>
              </div>
              <ul className="text-[6.5px] text-neutral-700 pl-2 space-y-0.5 list-disc">
                <li className="line-clamp-1">Architected enterprise cloud services handling 1M+ daily queries.</li>
                <li className="line-clamp-1">Reduced infrastructure costs by 28% through containerization.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Education */}
          <div className="space-y-0.5 mb-1 text-start">
            <div className="font-bold text-[8px] uppercase tracking-wide border-b border-black/70 pb-0.5">
              <span>{isAr ? 'التعليم' : 'EDUCATION'}</span>
            </div>
            <div className="flex justify-between text-[7px]">
              <span className="font-bold text-black">B.Sc. Computer Science - Cairo University</span>
              <span className="text-[6.5px] text-neutral-600 font-mono">2017 – 2021</span>
            </div>
          </div>

          {/* Section 3: Skills */}
          <div className="space-y-0.5 text-start">
            <div className="font-bold text-[8px] uppercase tracking-wide border-b border-black/70 pb-0.5">
              <span>{isAr ? 'المهارات التقنية' : 'SKILLS'}</span>
            </div>
            <p className="text-[6.5px] text-neutral-700 line-clamp-1">
              TypeScript, React, Node.js, Python, SQL, PostgreSQL, Docker, Git, REST APIs
            </p>
          </div>
        </div>
      );

    // 2. Modern ATS - Navy accents, crisp header, modern tag pills, modern divider line
    case 'modern-ats':
      return (
        <div className="w-full h-full bg-white p-3 rounded-lg border border-slate-200/90 text-slate-900 font-sans flex flex-col justify-between select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Modern Header: Name + Accent Title + Contact Stack */}
          <div className="border-b-2 border-[#001639] pb-1.5 mb-1.5 flex justify-between items-start text-start">
            <div>
              <div className="font-black text-[12px] text-[#001639] tracking-tight">
                {isAr ? 'باسم رمضان' : 'BASSAM RAMADAN'}
              </div>
              <div className="text-[8px] font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                <span>{isAr ? 'مطور واجهات ومصمم منتجات' : 'Full-Stack Developer & UI Architect'}</span>
              </div>
            </div>
            <div className="text-[6.5px] text-slate-500 text-end space-y-0.5 shrink-0">
              <div>dev@resume.com</div>
              <div>+20 111 222 3333</div>
              <div>linkedin.com/in/profile</div>
            </div>
          </div>

          {/* Section 1: Work Experience */}
          <div className="space-y-1 mb-1.5 text-start">
            <div className="text-[8px] font-black text-[#001639] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001639]"></span>
              <span>{isAr ? 'الخبرة المهنية' : 'WORK EXPERIENCE'}</span>
            </div>
            <div className="space-y-0.5 pl-2 border-l border-slate-200">
              <div className="flex justify-between items-center text-[7.5px]">
                <span className="font-bold text-slate-900">Senior Frontend Engineer @ Alpha Co</span>
                <span className="text-[6.5px] font-semibold text-slate-500 bg-slate-100 px-1 rounded">2022 - Now</span>
              </div>
              <p className="text-[6.5px] text-slate-600 line-clamp-1">
                Led frontend team to deliver high-velocity web portals using React & Tailwind.
              </p>
            </div>
          </div>

          {/* Section 2: Core Skills with modern pills */}
          <div className="space-y-1 mb-1 text-start">
            <div className="text-[8px] font-black text-[#001639] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001639]"></span>
              <span>{isAr ? 'المهارات' : 'CORE SKILLS'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {['React', 'Next.js', 'TypeScript', 'Node', 'GraphQL', 'Tailwind'].map((sk) => (
                <span key={sk} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[6.5px] font-bold border border-slate-200/80">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="space-y-0.5 text-start">
            <div className="text-[8px] font-black text-[#001639] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001639]"></span>
              <span>{isAr ? 'المؤهل الدراسي' : 'EDUCATION'}</span>
            </div>
            <div className="flex justify-between text-[7px] text-slate-700 pl-2">
              <span>B.Sc. in Software Engineering</span>
              <span className="text-[6.5px] text-slate-500">Graduated with Honors</span>
            </div>
          </div>
        </div>
      );

    // 3. Classic Professional - Serif typography, centered double line, formal italic accents
    case 'classic-professional':
      return (
        <div className="w-full h-full bg-white p-3 rounded-lg border border-slate-200/90 text-slate-900 font-serif flex flex-col justify-between select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Formal Centered Serif Header with Double Line */}
          <div className="text-center pb-1.5 mb-1.5 border-b-2 border-slate-400 border-double">
            <div className="font-serif font-bold text-[12px] uppercase tracking-widest text-slate-900">
              {isAr ? 'د. باسم رمضان' : 'ARTHUR H. PENDLETON'}
            </div>
            <div className="text-[7.5px] italic text-slate-700 mt-0.5">
              {isAr ? 'مستشار إداري وتنفيذي معتمد' : 'Senior Management & Operations Consultant'}
            </div>
            <div className="text-[6.5px] font-sans text-slate-500 mt-0.5 flex items-center justify-center gap-1.5">
              <span>London, UK</span>
              <span>♦</span>
              <span>arthur@consultancy.org</span>
              <span>♦</span>
              <span>+44 20 7946 0991</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="text-center mb-1 px-1">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-700 mb-0.5 font-sans">
              — {isAr ? 'الملخص التنفيذي' : 'EXECUTIVE SUMMARY'} —
            </div>
            <p className="text-[6.5px] italic text-slate-600 line-clamp-2 leading-tight">
              Over 14 years of strategic advisory and organizational transformation across global banking institutions.
            </p>
          </div>

          {/* Experience in Serif */}
          <div className="space-y-0.5 mb-1 text-start">
            <div className="text-[7.5px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 font-sans">
              {isAr ? 'السجل المهني' : 'PROFESSIONAL EXPERIENCE'}
            </div>
            <div className="flex justify-between items-baseline text-[7.5px]">
              <span className="font-bold text-slate-900">Managing Director, Global Strategy</span>
              <span className="text-[6.5px] italic text-slate-500">2018 – Present</span>
            </div>
            <div className="text-[6.5px] text-slate-700 pl-2">
              • Supervised cross-functional restructuring initiatives generating $4.5M in cost efficiencies.
            </div>
          </div>

          {/* Education */}
          <div className="space-y-0.5 text-start">
            <div className="text-[7.5px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 font-sans">
              {isAr ? 'المؤهلات الأكاديمية' : 'ACADEMIC CREDENTIALS'}
            </div>
            <div className="flex justify-between text-[7px] text-slate-800">
              <span className="font-bold">MBA in Finance & Strategic Management</span>
              <span className="text-[6.5px] italic text-slate-500">Oxford University</span>
            </div>
          </div>
        </div>
      );

    // 4. Technical Clean - Monospace prompts, developer brackets, // comment headers, ❯ arrows
    case 'technical-clean':
      return (
        <div className="w-full h-full bg-white p-3 rounded-lg border border-slate-200/90 text-slate-900 font-mono flex flex-col justify-between select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Developer Header: terminal prompt & code title */}
          <div className="border-b border-slate-200 pb-1.5 mb-1.5 text-start">
            <div className="text-[7px] text-blue-600 font-bold">
              ~/engineers/alex-dev $ cat profile.json
            </div>
            <div className="font-bold text-[11px] text-slate-900 tracking-tight mt-0.5">
              Alex Rivera
            </div>
            <div className="text-[7.5px] font-bold text-blue-600">
              // Senior Cloud & Systems Architect
            </div>
            <div className="text-[6px] text-slate-500 flex flex-wrap gap-x-2 mt-0.5">
              <span>gh: /alex-rivera</span>
              <span>email: alex@sys.io</span>
              <span>loc: Berlin, DE</span>
            </div>
          </div>

          {/* Tech Stack Brackets */}
          <div className="space-y-0.5 mb-1 text-start">
            <div className="text-[7.5px] font-bold text-slate-800">
              ❯ TECH_STACK:
            </div>
            <div className="flex flex-wrap gap-1 text-[6px]">
              <span className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[ Go ]</span>
              <span className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[ Rust ]</span>
              <span className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[ K8s ]</span>
              <span className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[ AWS ]</span>
              <span className="bg-slate-100 text-blue-700 px-1 py-0.5 rounded font-bold">[ Redis ]</span>
            </div>
          </div>

          {/* Experience with terminal arrows */}
          <div className="space-y-0.5 mb-1 text-start">
            <div className="text-[7.5px] font-bold text-slate-800">
              ❯ EXPERIENCE:
            </div>
            <div className="text-[7px] font-bold text-slate-900 flex justify-between">
              <span>CloudScale Systems — Staff SRE</span>
              <span className="text-[6.5px] text-blue-600">2020-Present</span>
            </div>
            <div className="text-[6.5px] text-slate-600 pl-1 space-y-0.5">
              <div>❯ Deployed multi-region zero-downtime mesh.</div>
              <div>❯ Reduced P99 latency by 45ms across services.</div>
            </div>
          </div>

          {/* Open Source / Projects */}
          <div className="space-y-0.5 text-start">
            <div className="text-[7.5px] font-bold text-slate-800">
              ❯ PROJECTS:
            </div>
            <div className="text-[6.5px] text-slate-700 flex justify-between">
              <span className="font-bold">lib-distributed-cache</span>
              <span className="text-blue-600">⭐ 2.4k stars</span>
            </div>
          </div>
        </div>
      );

    // 5. Minimal Executive - Generous spacing, prominent left quote bar, high-contrast leadership layout
    case 'minimal-exec':
      return (
        <div className="w-full h-full bg-white p-3 rounded-lg border border-slate-200/90 text-slate-900 font-sans flex flex-col justify-between select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Executive Header: Bold name, sleek subtitle */}
          <div className="border-b border-slate-200 pb-1.5 mb-1 text-start">
            <div className="font-black text-[13px] text-slate-900 tracking-tight">
              {isAr ? 'طارق المنشاوي' : 'MARCUS V. STERLING'}
            </div>
            <div className="text-[8px] font-bold text-slate-600 mt-0.5">
              {isAr ? 'نائب الرئيس التنفيذي للعمليات | CTO' : 'Chief Technology Officer & Executive Partner'}
            </div>
            <div className="text-[6.5px] text-slate-400 mt-0.5">
              New York, NY • marcus@sterling-exec.com • +1 (212) 555-0199
            </div>
          </div>

          {/* Distinctive Executive Quote/Statement with Thick Left Border */}
          <div className="border-l-2 border-slate-800 pl-2 py-0.5 mb-1.5 text-start bg-slate-50/60 rounded-r">
            <p className="text-[6.5px] italic text-slate-700 leading-snug">
              &ldquo;Transformational executive driving growth, M&amp;A integration, and digital modernization for Fortune 500 orgs.&rdquo;
            </p>
          </div>

          {/* Section 1: Executive Experience */}
          <div className="space-y-1 mb-1 text-start">
            <div className="text-[7.5px] font-black uppercase tracking-widest text-slate-900">
              {isAr ? 'المناصب القيادية والتنفيذية' : 'EXECUTIVE LEADERSHIP'}
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline text-[7.5px]">
                <span className="font-bold text-slate-900">Apex Global Holdings — Group CTO</span>
                <span className="text-[6.5px] font-mono text-slate-500">2019 – Present</span>
              </div>
              <p className="text-[6.5px] text-slate-600 line-clamp-1">
                Overseeing $85M operating budget and 240+ multi-national engineers.
              </p>
            </div>
          </div>

          {/* Section 2: Core Competencies Matrix */}
          <div className="space-y-0.5 text-start">
            <div className="text-[7.5px] font-black uppercase tracking-widest text-slate-900">
              {isAr ? 'مجالات الكفاءة الاستراتيجية' : 'CORE CAPABILITIES'}
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[6.5px] text-slate-600">
              <div>• Enterprise Architecture</div>
              <div>• P&amp;L Management</div>
              <div>• Mergers &amp; Acquisitions</div>
              <div>• Talent &amp; Culture Scale</div>
            </div>
          </div>
        </div>
      );

    // 6. Creative Compact - Two-Column Split (Dark Sidebar with Avatar on left, Main content on right)
    case 'creative-compact':
    default:
      return (
        <div className="w-full h-full bg-white rounded-lg border border-slate-200/90 flex select-none overflow-hidden text-[9px] leading-tight shadow-2xs">
          {/* Asymmetric Left Sidebar (36% width, dark navy background) */}
          <div className="w-[36%] bg-[#001639] text-white p-2 flex flex-col justify-between shrink-0 text-start">
            <div>
              {/* Mini Avatar Circle */}
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-[#FF4D2D] mx-auto mb-1.5 flex items-center justify-center text-[8px] font-bold text-white shadow-2xs">
                {isAr ? 'س' : 'CR'}
              </div>
              <div className="text-center">
                <div className="font-black text-[9px] text-white leading-tight">
                  {isAr ? 'سارة كمال' : 'SARAH K.'}
                </div>
                <div className="text-[6.5px] font-bold text-[#FF4D2D] mt-0.5">
                  {isAr ? 'مصممة إبداعية' : 'Creative Director'}
                </div>
              </div>

              {/* Sidebar Contact Info */}
              <div className="space-y-0.5 text-[5.5px] text-slate-300 mt-2 pt-1 border-t border-slate-700/80">
                <div className="truncate">✉ sarah@studio.design</div>
                <div>📱 +20 109 888 7777</div>
                <div>🌐 behance.net/sarahk</div>
              </div>

              {/* Sidebar Skill Bars */}
              <div className="mt-2 space-y-1">
                <div className="text-[6px] font-bold uppercase tracking-wider text-[#FF4D2D]">
                  {isAr ? 'المهارات' : 'SKILLS'}
                </div>
                {['Figma', 'UI/UX', 'Branding'].map((sk) => (
                  <div key={sk} className="space-y-0.5">
                    <div className="flex justify-between text-[5.5px] text-slate-200">
                      <span>{sk}</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF4D2D] rounded-full w-[85%]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[5.5px] text-slate-400 text-center">
              PORTFOLIO EDITION
            </div>
          </div>

          {/* Main Content Area (64% width) */}
          <div className="w-[64%] p-2.5 flex flex-col justify-between text-start bg-white">
            {/* About Me */}
            <div className="space-y-0.5">
              <div className="text-[7.5px] font-black uppercase tracking-wider text-[#FF4D2D] border-b border-slate-200 pb-0.5">
                {isAr ? 'نبذة إبداعية' : 'ABOUT ME'}
              </div>
              <p className="text-[6.5px] text-slate-600 line-clamp-2 leading-tight">
                Award-winning brand designer crafting immersive digital brand experiences for global startups.
              </p>
            </div>

            {/* Experience with timeline dots */}
            <div className="space-y-0.5">
              <div className="text-[7.5px] font-black uppercase tracking-wider text-[#FF4D2D] border-b border-slate-200 pb-0.5">
                {isAr ? 'الخبرات' : 'EXPERIENCE'}
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-baseline text-[7px]">
                  <span className="font-bold text-slate-900">Lead Product Designer</span>
                  <span className="text-[6px] text-slate-400 font-mono">2022-Now</span>
                </div>
                <div className="text-[6px] font-semibold text-[#FF4D2D]">Studio Hive Co.</div>
                <p className="text-[6px] text-slate-500 line-clamp-1">
                  Redesigned mobile app generating +140% conversion lift.
                </p>
              </div>
            </div>

            {/* Featured Projects */}
            <div className="space-y-0.5">
              <div className="text-[7.5px] font-black uppercase tracking-wider text-[#FF4D2D] border-b border-slate-200 pb-0.5">
                {isAr ? 'المشاريع' : 'FEATURED WORK'}
              </div>
              <div className="text-[6.5px] text-slate-700 flex justify-between">
                <span className="font-bold">Fintech App 2.0</span>
                <span className="text-[#FF4D2D] font-mono">Design Award &apos;23</span>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-0.5">
              <div className="text-[7.5px] font-black uppercase tracking-wider text-[#FF4D2D] border-b border-slate-200 pb-0.5">
                {isAr ? 'التعليم' : 'EDUCATION'}
              </div>
              <div className="text-[6.5px] text-slate-700">
                B.A. Graphic Design &amp; Visual Media
              </div>
            </div>
          </div>
        </div>
      );
  }
};
