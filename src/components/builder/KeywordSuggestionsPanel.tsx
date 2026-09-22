import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { INDUSTRY_DOMAINS, findMatchingIndustry, DomainKeywordGroup } from '../../data/industryKeywords';
import { aiApi } from '../../lib/api';
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
  const [isOpen, setIsOpen] = useState(false);
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
      const data = await aiApi.suggestKeywords({
        jobTitle: userJobTitle,
        domain: selectedDomain.nameEn,
        language: settings.language,
      });

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
    <div className="bg-white border border-line rounded-none overflow-hidden transition-all text-start">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 bg-paper hover:bg-paper-2 transition cursor-pointer text-start"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-none border border-line bg-white text-orange flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-tajawal text-xs sm:text-sm font-bold text-ink truncate">
              {isAr ? 'الكلمات المفتاحية المقترحة لمجالك المستهدف' : 'Suggested keywords for your target role'}
            </h3>
            <p className="font-ibm-sans text-xs text-ink-soft truncate hidden sm:block">
              {isAr ? 'أضف المهارات الموصى بها بنقرة واحدة لرفع درجة التوافق مع ATS' : 'Add recommended keywords with one click to boost ATS compatibility'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-ibm-sans text-xs font-semibold text-ink-soft hidden sm:inline">
            {isOpen ? (isAr ? 'إخفاء' : 'Collapse') : (isAr ? 'عرض المهارات' : 'Show skills')}
          </span>
          <div className="w-6 h-6 rounded-none border border-line bg-white flex items-center justify-center text-ink-soft">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 border-t border-line bg-paper">
          {/* Controls Row: Select Industry Dropdown + Search Input + Optional AI Trigger */}
          <div className="flex flex-col gap-2.5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {/* Select Industry */}
              <div className="flex items-center gap-1.5 w-full min-w-0">
                <label htmlFor="industry-select" className="text-xs font-ibm-sans font-bold text-ink-soft whitespace-nowrap flex items-center gap-1.5 shrink-0">
                  <Briefcase className="w-3.5 h-3.5 text-ink-soft shrink-0" />
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
                  className="flex-1 w-full min-w-0 px-2.5 py-1.5 h-9 bg-white hover:bg-paper-2 focus:bg-white border border-line focus:border-ink focus:ring-1 focus:ring-ink rounded-none text-xs font-ibm-sans font-semibold text-ink outline-none transition cursor-pointer truncate"
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
              <div className="relative w-full min-w-0">
                <Search className="w-3.5 h-3.5 text-ink-soft absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في المهارات المقترحة...' : 'Search suggested skills...'}
                  className="w-full ps-8 pe-3 py-1.5 h-9 bg-white hover:bg-paper-2 focus:bg-white border border-line focus:border-ink focus:ring-1 focus:ring-ink rounded-none text-xs font-ibm-sans text-ink placeholder:text-ink-soft/50 outline-none transition"
                />
              </div>
            </div>

            {/* AI Generation Trigger if Job Title exists */}
            {userJobTitle && (
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={isAiLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-paper-2 text-ink text-xs font-ibm-sans font-bold rounded-none border border-line transition cursor-pointer shrink-0 disabled:opacity-50 active:scale-95 w-full min-h-[36px]"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-orange" />
                )}
                <span className="truncate">{isAr ? `توليد لـ "${userJobTitle}"` : `AI tailored for "${userJobTitle}"`}</span>
              </button>
            )}
          </div>

          {/* Curated Skill Chips */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-ink-soft font-ibm-sans font-semibold">
              <span>
                {query
                  ? (isAr ? `نتائج البحث (${totalCount})` : `Search results (${totalCount})`)
                  : (isAr
                    ? `أبرز المهارات الموصى بها (${showAll ? totalCount : Math.min(TOP_COUNT, totalCount)})`
                    : `Top recommended skills (${showAll ? totalCount : Math.min(TOP_COUNT, totalCount)})`)}
              </span>
            </div>

            {visibleItems.length === 0 ? (
              <div className="p-4 bg-white border border-line rounded-none text-center text-xs font-ibm-sans text-ink-soft">
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-ibm-sans font-medium transition max-w-full border ${
                        alreadyHas
                          ? 'bg-paper text-ink border-line opacity-60 cursor-default'
                          : 'bg-white hover:bg-ink hover:text-white text-ink border-line cursor-pointer active:scale-95'
                      }`}
                    >
                      {alreadyHas ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-orange shrink-0" />
                          <span className="truncate">{item.name}</span>
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
                  className="text-xs font-ibm-sans font-bold text-ink hover:text-orange transition inline-flex items-center gap-1 cursor-pointer"
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

