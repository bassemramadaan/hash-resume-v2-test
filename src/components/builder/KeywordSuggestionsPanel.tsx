import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { INDUSTRY_DOMAINS, findMatchingIndustry, DomainKeywordGroup } from '../../data/industryKeywords';
import {
  Sparkles,
  Plus,
  Check,
  Search,
  Wrench,
  Cpu,
  Layers,
  HeartHandshake,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface KeywordSuggestionsPanelProps {
  onAddKeyword?: (keyword: string, category?: 'technical' | 'soft' | 'tool') => void;
  compact?: boolean;
}

export const KeywordSuggestionsPanel: React.FC<KeywordSuggestionsPanelProps> = ({
  onAddKeyword,
  compact = false,
}) => {
  const { resumeData, settings, addSkill } = useResumeStore();
  const t = getTranslation(settings.language);
  const lang = settings.language;
  const isAr = lang === 'ar';

  const userJobTitle = resumeData.personalInfo.jobTitle || '';
  const initialMatchedDomain = findMatchingIndustry(userJobTitle) || INDUSTRY_DOMAINS[0];

  const [selectedDomain, setSelectedDomain] = useState<DomainKeywordGroup>(initialMatchedDomain);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedChips, setAddedChips] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCustomKeywords, setAiCustomKeywords] = useState<{
    technical: string[];
    tools: string[];
    softSkills: string[];
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Check which skills the user already has
  const existingSkillNames = new Set((resumeData.skills || []).map((s) => s.name.toLowerCase().trim()));

  const handleAdd = (keyword: string, category: 'technical' | 'soft' | 'tool') => {
    if (onAddKeyword) {
      onAddKeyword(keyword, category);
    } else {
      addSkill({
        name: keyword,
        category,
        level: 'advanced',
      });
    }
    setAddedChips((prev) => [...prev, keyword]);
  };

  const handleAiSuggest = async () => {
    if (!userJobTitle.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: userJobTitle,
          domain: selectedDomain.nameEn,
          language: settings.language,
        }),
      });
      const data = await res.json();
      if (data && (data.technical || data.tools || data.softSkills)) {
        setAiCustomKeywords({
          technical: data.technical || [],
          tools: data.tools || [],
          softSkills: data.softSkills || [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch AI keywords:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Keywords to display: fallback to standard domain keywords or AI results
  const technicalKeywords = aiCustomKeywords?.technical?.length
    ? aiCustomKeywords.technical
    : isAr ? selectedDomain.technical.ar : selectedDomain.technical.en;

  const toolKeywords = aiCustomKeywords?.tools?.length
    ? aiCustomKeywords.tools
    : isAr ? selectedDomain.tools.ar : selectedDomain.tools.en;

  const softKeywords = aiCustomKeywords?.softSkills?.length
    ? aiCustomKeywords.softSkills
    : isAr ? selectedDomain.softSkills.ar : selectedDomain.softSkills.en;

  const domainName = isAr ? selectedDomain.nameAr : lang === 'fr' ? selectedDomain.nameFr : selectedDomain.nameEn;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50/40 border border-orange-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-orange-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#001639] text-[#FF4D2D] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#001639] flex items-center gap-1.5">
              <span>{isAr ? 'الكلمات المفتاحية المقترحة لمجالك (ATS Boost)' : 'Suggested Industry Keywords (ATS Boost)'}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isAr
                ? 'انقر على أي كلمة لإضافتها بضغطة واحدة إلى مهاراتك ورفع التوافق مع خوارزميات التوظيف.'
                : 'Click any keyword to add it directly to your skills for higher ATS ranking.'}
            </p>
          </div>
        </div>

        {compact && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-orange-100/50 transition cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Domain Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 block">
              {isAr ? 'اختر مجالك المهني المستهدف:' : 'Select Target Industry:'}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {INDUSTRY_DOMAINS.map((domain) => {
                const isSelected = selectedDomain.id === domain.id;
                const label = isAr ? domain.nameAr : lang === 'fr' ? domain.nameFr : domain.nameEn;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => {
                      setSelectedDomain(domain);
                      setAiCustomKeywords(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#001639] text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Custom Generation Button for user's specific job title */}
          {userJobTitle && (
            <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-orange-200 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
                <span className="text-xs text-slate-700 truncate">
                  {isAr
                    ? `توليد كلمات مخصصة بالذكاء الاصطناعي لـ "${userJobTitle}"`
                    : `Generate AI keywords tailored for "${userJobTitle}"`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={isAiLoading}
                className="px-3 py-1 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-lg transition cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1 min-h-[30px]"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-[#FF4D2D]" />
                )}
                <span>{isAr ? 'توليد بالذكاء الاصطناعي' : 'Generate'}</span>
              </button>
            </div>
          )}

          {/* Keyword Categories */}
          <div className="space-y-3">
            {/* 1. Technical Skills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#001639] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#FF4D2D]" />
                <span>{isAr ? 'المهارات التقنية التخصصية:' : 'Technical & Core Skills:'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {technicalKeywords.map((kw, idx) => {
                  const alreadyHas = existingSkillNames.has(kw.toLowerCase().trim()) || addedChips.includes(kw);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={alreadyHas}
                      onClick={() => handleAdd(kw, 'technical')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        alreadyHas
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-white hover:bg-[#001639] hover:text-white text-slate-800 border border-slate-200 shadow-2xs active:scale-95'
                      }`}
                    >
                      {alreadyHas ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-[#FF4D2D]" />}
                      <span>{kw}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tools & Software */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#001639] flex items-center gap-1">
                <Wrench className="w-3 h-3 text-indigo-600" />
                <span>{isAr ? 'الأدوات والبرامج والأنظمة:' : 'Tools & Software:'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {toolKeywords.map((tool, idx) => {
                  const alreadyHas = existingSkillNames.has(tool.toLowerCase().trim()) || addedChips.includes(tool);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={alreadyHas}
                      onClick={() => handleAdd(tool, 'tool')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        alreadyHas
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-white hover:bg-indigo-700 hover:text-white text-slate-800 border border-slate-200 shadow-2xs active:scale-95'
                      }`}
                    >
                      {alreadyHas ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-indigo-600" />}
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Soft Skills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#001639] flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-emerald-600" />
                <span>{isAr ? 'المهارات القيادية والشخصية:' : 'Soft & Leadership Skills:'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {softKeywords.map((soft, idx) => {
                  const alreadyHas = existingSkillNames.has(soft.toLowerCase().trim()) || addedChips.includes(soft);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={alreadyHas}
                      onClick={() => handleAdd(soft, 'soft')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        alreadyHas
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-white hover:bg-emerald-700 hover:text-white text-slate-800 border border-slate-200 shadow-2xs active:scale-95'
                      }`}
                    >
                      {alreadyHas ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-emerald-600" />}
                      <span>{soft}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
