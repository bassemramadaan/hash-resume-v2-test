import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { INDUSTRY_DOMAINS, findMatchingIndustry, DomainKeywordGroup } from '../../data/industryKeywords';
import {
  Sparkles,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Briefcase,
  Search,
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
  const [isOpen, setIsOpen] = useState(!compact);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedChips, setAddedChips] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCustomKeywords, setAiCustomKeywords] = useState<{
    technical: string[];
    tools: string[];
    softSkills: string[];
  } | null>(null);

  // Check which skills the user already has
  const existingSkillNames = new Set((resumeData.skills || []).map((s) => s.name.toLowerCase().trim()));

  const handleAdd = (keyword: string, category: 'technical' | 'soft' | 'tool') => {
    if (existingSkillNames.has(keyword.toLowerCase().trim()) || addedChips.includes(keyword)) {
      return;
    }
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

  // Compile a unified, prioritized list of keywords
  const techList = aiCustomKeywords?.technical?.length
    ? aiCustomKeywords.technical
    : isAr ? selectedDomain.technical.ar : selectedDomain.technical.en;

  const toolsList = aiCustomKeywords?.tools?.length
    ? aiCustomKeywords.tools
    : isAr ? selectedDomain.tools.ar : selectedDomain.tools.en;

  const softList = aiCustomKeywords?.softSkills?.length
    ? aiCustomKeywords.softSkills
    : isAr ? selectedDomain.softSkills.ar : selectedDomain.softSkills.en;

  // Interleave and deduplicate for a natural high-value balance (Tech -> Tools -> Soft)
  const combinedItems: { name: string; category: 'technical' | 'soft' | 'tool' }[] = [];
  const seen = new Set<string>();

  const maxLen = Math.max(techList.length, toolsList.length, softList.length);
  for (let i = 0; i < maxLen; i++) {
    if (techList[i] && !seen.has(techList[i].toLowerCase().trim())) {
      seen.add(techList[i].toLowerCase().trim());
      combinedItems.push({ name: techList[i], category: 'technical' });
    }
    if (toolsList[i] && !seen.has(toolsList[i].toLowerCase().trim())) {
      seen.add(toolsList[i].toLowerCase().trim());
      combinedItems.push({ name: toolsList[i], category: 'tool' });
    }
    if (softList[i] && !seen.has(softList[i].toLowerCase().trim())) {
      seen.add(softList[i].toLowerCase().trim());
      combinedItems.push({ name: softList[i], category: 'soft' });
    }
  }

  // Filter based on search query if present
  const query = searchQuery.trim().toLowerCase();
  const filteredItems = query
    ? combinedItems.filter((item) => item.name.toLowerCase().includes(query))
    : combinedItems;

  const TOP_COUNT = 8;
  const visibleItems = showAll || query ? filteredItems : filteredItems.slice(0, TOP_COUNT);
  const totalCount = filteredItems.length;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden transition-all text-start">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-orange-50/30 hover:bg-slate-100/80 transition cursor-pointer text-start"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#001639] text-[#FF4D2D] flex items-center justify-center shadow-2xs shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-[#001639] truncate">
              {isAr ? 'الكلمات المفتاحية المقترحة لمجالك المستهدف' : 'Suggested keywords for your target role'}
            </h3>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
              {isAr ? 'أضف المهارات الموصى بها بنقرة واحدة لرفع درجة التوافق مع ATS' : 'Add recommended keywords with one click to boost ATS compatibility'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            {isOpen ? (isAr ? 'إخفاء' : 'Collapse') : (isAr ? 'عرض المهارات' : 'Show skills')}
          </span>
          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 border-t border-slate-100">
          {/* Controls Row: Select Industry Dropdown + Search Input + Optional AI Trigger */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto flex-1">
              {/* Select Industry */}
              <div className="flex items-center gap-1.5 shrink-0">
                <label htmlFor="industry-select" className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'المجال:' : 'Industry:'}</span>
                </label>
                <select
                  id="industry-select"
                  value={selectedDomain.id}
                  onChange={(e) => {
                    const found = INDUSTRY_DOMAINS.find((d) => d.id === e.target.value);
                    if (found) {
                      setSelectedDomain(found);
                      setAiCustomKeywords(null);
                      setShowAll(false);
                    }
                  }}
                  className="px-2.5 py-1.5 h-9 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-800 outline-none transition cursor-pointer shadow-2xs"
                >
                  {INDUSTRY_DOMAINS.map((domain) => {
                    const label = isAr ? domain.nameAr : lang === 'fr' ? domain.nameFr : domain.nameEn;
                    return (
                      <option key={domain.id} value={domain.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-full sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في المهارات المقترحة...' : 'Search suggested skills...'}
                  className="w-full ps-8 pe-3 py-1.5 h-9 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none transition shadow-2xs"
                />
              </div>
            </div>

            {/* AI Generation Trigger if Job Title exists */}
            {userJobTitle && (
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={isAiLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer shrink-0 disabled:opacity-50 active:scale-95 self-start md:self-auto"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4D2D]" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                )}
                <span>{isAr ? `توليد لـ "${userJobTitle}"` : `AI tailored for "${userJobTitle}"`}</span>
              </button>
            )}
          </div>

          {/* Curated Skill Chips */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>
                {query
                  ? (isAr ? `نتائج البحث (${totalCount})` : `Search results (${totalCount})`)
                  : (isAr
                    ? `أبرز المهارات الموصى بها (${showAll ? totalCount : Math.min(TOP_COUNT, totalCount)})`
                    : `Top recommended skills (${showAll ? totalCount : Math.min(TOP_COUNT, totalCount)})`)}
              </span>
            </div>

            {visibleItems.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                {isAr ? 'لم يتم العثور على مهارات مطابقة للبحث.' : 'No matching skills found.'}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {visibleItems.map((item, idx) => {
                  const alreadyHas =
                    existingSkillNames.has(item.name.toLowerCase().trim()) || addedChips.includes(item.name);

                  return (
                    <button
                      key={`${item.name}-${idx}`}
                      type="button"
                      disabled={alreadyHas}
                      onClick={() => handleAdd(item.name, item.category)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-2xs max-w-full ${
                        alreadyHas
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default opacity-90'
                          : 'bg-white hover:bg-[#001639] hover:text-white text-slate-800 border border-slate-200 cursor-pointer active:scale-95'
                      }`}
                    >
                      {alreadyHas ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{isAr ? `تمت إضافة ${item.name}` : `✓ Added`}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
                          <span className="truncate">{isAr ? `+ إضافة ${item.name}` : `+ Add ${item.name}`}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Expand / Collapse toggle for remaining skills */}
            {!query && totalCount > TOP_COUNT && (
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs font-bold text-[#001639] hover:text-[#FF4D2D] transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {showAll
                      ? (isAr ? 'عرض أبرز 8 مهارات فقط' : 'Show top 8 only')
                      : (isAr ? `عرض جميع المهارات (${totalCount})` : `Show all ${totalCount} skills`)}
                  </span>
                  {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

