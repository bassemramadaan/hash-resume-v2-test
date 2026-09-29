import React from 'react';
import { motion } from 'motion/react';
import { Eye, FileCheck2, UserCheck, Users, Sparkles } from 'lucide-react';

interface SocialProofSectionProps {
  isAr: boolean;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({ isAr }) => {
  const cards = [
    {
      id: 'card-live-preview',
      icon: Eye,
      title: isAr ? 'معاينة حية ومباشرة' : 'Live preview',
      desc: isAr
        ? 'شاهد كل تعديل وإنجاز يظهر أمامك فوراً كما سيظهر في الـ PDF.'
        : 'See every change instantly.',
      badge: isAr ? 'فوري' : 'Instant',
    },
    {
      id: 'card-ats-friendly',
      icon: FileCheck2,
      title: isAr ? 'هيكل مناسب لـ ATS' : 'ATS-friendly structure',
      desc: isAr
        ? 'تصاميم وهياكل واضحة ونظيفة يسهل على مسؤولي التوظيف وخوارزميات الفرز قراءتها.'
        : 'Clean layouts recruiters can read.',
      badge: isAr ? 'تنسيق قياسي' : 'Recruiter-ready',
    },
    {
      id: 'card-no-account',
      icon: UserCheck,
      title: isAr ? 'بدون الحاجة لحساب' : 'No account required',
      desc: isAr
        ? 'ابدأ مباشرة دون تسجيل حساب أو كلمات مرور مع حفظ محلي كامل.'
        : 'Start without registration.',
      badge: isAr ? 'دخول مباشر' : 'No sign-up',
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-14 px-4 sm:px-6 bg-slate-50/80 border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Tagline + Proof Count */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#001639] tracking-tight">
            {isAr ? 'تجربة سريعة تضمن وصولك للمقابلات' : 'Built for Speed & Recruiter Impact'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {isAr ? 'موثوق من أكثر من 500 باحث عن عمل لتجاوز فلاتر التوظيف بنجاح' : 'Trusted by 500+ job seekers to pass recruiter screening'}
          </p>
        </div>

        {/* 3 Clear Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                id={card.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition text-start flex flex-col justify-between space-y-3.5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF4D2D] flex items-center justify-center group-hover:bg-[#FF4D2D] group-hover:text-white transition shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#001639]">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] font-normal text-slate-400">
                  <span>{isAr ? 'متاح لجميع القوالب' : 'Included in all templates'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

