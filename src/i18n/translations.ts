import { Language } from '../types/resume';

export const translations = {
  ar: {
    appName: "Hash Resume",
    tagline: "صانع السير الذاتية الذكي المتوافق مع أنظمة ATS",
    subtitle: "أنشئ سيرة ذاتية احترافية بضغطة زر في أقل من 5 دقائق باللغة العربية والإنجليزية، متوافقة 100% مع خوارزميات التوظيف الحديثة وبخصوصية تامة.",
    slogan: "بدون إنشاء حساب. أنشئ سيرتك. حمّلها. وقدّم بها.",
    
    // Navbar
    navBuilder: "صانع السيرة",
    navTemplates: "القوالب",
    navAtsCheck: "فحص ATS الذكي",
    navPricing: "الأسعار والتفعيل",
    navFaq: "الأسئلة الشائعة",
    switchLang: "English",
    activatedStatus: "مُفعَّل",
    getActivated: "تفعيل السيرة",
    downloadPdf: "تحميل PDF",
    downloading: "جاري الإنشاء...",

    // Quick Actions
    startNewResume: "بدء سيرة جديدة",
    clearData: "مسح البيانات",
    resetConfirm: "البدء بسيرة ذاتية جديدة؟ مسودتك الحالية محفوظة تلقائياً.",
    startNewResumeTitle: "بدء سيرة ذاتية جديدة؟",
    startNewResumeDesc: "البدء بسيرة ذاتية جديدة؟ مسودتك الحالية محفوظة تلقائياً.",
    startNewResumeConfirmBtn: "نعم، ابدأ سيرة جديدة",
    startNewResumeCancelBtn: "إلغاء والتراجع",
    startNewResumeSuccessMsg: "تم تفريغ النموذج والبدء بسيرة ذاتية جديدة بنجاح.",
    
    // Sections Tabs
    tabPersonal: "المعلومات الشخصية",
    tabExperience: "الخبرات العملية",
    tabEducation: "التعليم والشهادات",
    tabSkills: "المهارات واللغات",
    tabProjects: "المشاريع والإنجازات",
    tabCustom: "أقسام إضافية",
    tabAiTools: "أدوات الذكاء الاصطناعي",
    tabAtsAnalyzer: "فحص ATS",

    // Personal Info Form
    fullName: "الاسم الكامل",
    jobTitle: "المسمى الوظيفي المستهدف",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    location: "المدينة / الدولة",
    linkedin: "رابط رابطين LinkedIn",
    github: "رابط GitHub (اختياري)",
    website: "الموقع الشخصي / المعرض (اختياري)",
    summary: "الملخص المهني",
    summaryPlaceholder: "اكتب ملخصاً مهنياً عن مهاراتك وأبرز خبراتك وأهدافك الوظيفية...",
    aiGenerateSummary: "صياغة بالذكاء الاصطناعي",
    photoUrl: "رابط الصورة الشخصية (اختياري)",

    // Experience Form
    addExperience: "إضافة خبرة جديدة",
    position: "المسمى الوظيفي",
    company: "اسم الشركة / المؤسسة",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    currentJob: "أعمل هنا حالياً",
    bulletPoints: "الإنجازات والمهام (نقاط ATS)",
    bulletPlaceholder: "مثال: أدرت فريقاً مكوناً من 5 مصممين وزدت إنتاجية القسم بنسبة 30%",
    addBullet: "إضافة نقطة إنجاز",
    aiEnhanceBullet: "تحسين بالنظام الذكي",

    // Education
    addEducation: "إضافة مؤهل تعليمي",
    degree: "الدرجة العلمية / المؤهل",
    institution: "الجامعة / المعهد",
    fieldOfStudy: "التخصص",
    gpa: "المعدل التراكمي (اختياري)",

    // Skills
    addSkill: "إضافة مهارة",
    skillName: "اسم المهارة",
    skillCategory: "التصنيف",
    techSkills: "مهارات تقنية",
    softSkills: "مهارات شخصية",
    tools: "أدوات وبرامج",
    aiSuggestSkills: "اقتراح مهارات ذكية",

    // Languages
    addLanguage: "إضافة لغة",
    languageName: "اللغة",
    proficiency: "مستوى الإتقان",
    profNative: "اللغة الأم",
    profFluent: "طلاقة كاملة",
    profAdvanced: "متقدم",
    profIntermediate: "متوسط",
    profBasic: "مبتدئ",

    // Projects & Certs
    addProject: "إضافة مشروع",
    projectTitle: "اسم المشروع",
    projectDesc: "وصف المشروع والإنجازات",
    addCert: "إضافة شهادة محترفة",
    certTitle: "اسم الشهادة",
    certIssuer: "الجهة المصدرة",
    certDate: "تاريخ الحصول عليها",

    // Customization & Templates
    customizeTitle: "تخصيص المظهر والتنسيق",
    templateSelect: "اختر القالب المناسب",
    colorSelect: "اللون الرئيسي",
    fontSelect: "نوع الخط",
    fontSizeSelect: "حجم الخط",
    spacingSelect: "المسافات والتباعد",
    showPhotoToggle: "إظهار الصورة الشخصية",
    
    // Templates Names & Desc
    tplBassux: "ATS Classic (BASSUX) - مناسب لأنظمة التوظيف",
    tplBassuxDesc: "تنسيق أحادي العمود بدون ألوان أو رسومات لاجتياز كافة أنظمة الفلترة الآلية (ATS).",
    atsSelectorNote: "الأفضل للتقديم الإلكتروني وأنظمة تتبع المتقدمين (ATS).",
    tplModernAts: "مودرن ATS (الأكثر قبولاً)",
    tplModernAtsDesc: "تنسيق قياسي حديث يضمن أعلى نسبة قراءة عبر أنظمة الفحص الآلي.",
    tplClassicProf: "كلاسيك احترافي",
    tplClassicProfDesc: "مناسب للشركات الكبرى، المؤسسات المالية، والوظائف الإدارية.",
    tplMinimalExec: "مينيمال تنفيذي",
    tplMinimalExecDesc: "تصميم أنيق وبسيط يركز بشكل مباشر على الخبرات والإنجازات.",
    tplTechnicalClean: "تقني نقي (Tech & Eng)",
    tplTechnicalCleanDesc: "مصمم خصيصاً للمبرمجين والمشروعات والمهندسين والوظائف التقنية.",
    tplCreativeCompact: "إبداعي مركز",
    tplCreativeCompactDesc: "إطار مميز مع ألوان جذابة لوظائف التسويق والمبيعات والتصميم.",

    // ATS Analyzer
    atsAnalyzerTitle: "محلل السيرة الذاتية لنظام ATS",
    atsAnalyzerSub: "افحص سيرتك الذاتية مقابل متطلبات الوظيفة المستهدفة للحصول على نسبة التوافق والتوصيات المباشرة.",
    targetJobDescLabel: "أدخل الوصف الوظيفي المستهدف (اختياري لنتائج أكثر دقة):",
    jobDescPlaceholder: "انسخ هنا متطلبات الوظيفة أو الإعلان الوظيفي...",
    runAtsCheck: "تحليل السيرة الآن",
    atsScore: "درجة التوافق مع ATS",
    atsStrengths: "نقاط القوة في سيرتك الذاتية",
    atsMissingKeywords: "كلمات مفتاحية يُفضل إضافتها",
    atsActionPoints: "خطوات سريعة لرفع درجتك",

    // Pricing & Activation
    pricingTitle: "اختر خطة التفعيل المناسبة",
    pricingSub: "دفع لمرة واحدة بأسعار تناسب السوق المصري والعربي. بدون اشتراكات شهرية متكررة وبدون تكاليف خفية.",
    oneTimePayNotice: "دفع لمرة واحدة بدون اشتراك تجديد آلي",
    
    planSingleTitle: "تفعيل واحد",
    planSinglePrice: "50 ج.م",
    planSingleDesc: "مثالي لبناء وحفظ سيرة ذاتية واحدة مكتملة وتحميلها بمرونة.",
    planSingleFeature1: "تحميل السيرة الذاتية بصيغة PDF عالية الجودة",
    planSingleFeature2: "جميع القوالب المحترفة المتوافقة مع ATS",
    planSingleFeature3: "استخدام الذكاء الاصطناعي لتحسين الصياغة",
    planSingleFeature4: "حفظ تلقائي في المتصفح بخصوصية 100%",

    planBundleTitle: "باقة 3 تفعيلات",
    planBundleBadge: "الأكثر توفيراً (120 ج.م بدل 150)",
    planBundlePrice: "120 ج.م",
    planBundleDesc: "ممتازة لإنشاء نسخ متعددة بأسماء أو لغات أو تخصصات مختلفة.",
    planBundleFeature1: "3 تفعيلات مستقلة لإنشاء 3 سير ذاتية مختلفة",
    planBundleFeature2: "توفير 30 جنيه مصري فوراً",
    planBundleFeature3: "تحليل ATS غير محدود لكل النسخ",
    planBundleFeature4: "دعم فني وتحديثات مستمرة",

    paymentMethodsTitle: "طرق الدفع المتوفرة في مصر والوطن العربي:",
    payVodafoneCash: "فودافون كاش / اتصالات / أورانج / وي كاش",
    payInstapay: "إنستاباي (InstaPay)",
    payCards: "بطاقات الميزا / الفيزا / الماستركارد",
    payFawry: "فوري / منافذ الدفع الإلكتروني",
    
    enterCodePrompt: "أدخل كود التفعيل بعد إتمام تحويل المبلغ:",
    codePlaceholder: "مثال: HASH-XXXX-XXXX",
    verifyCodeBtn: "تحقق وتفعيل الآن",
    demoCodesNotice: "أدخل كود التفعيل المستلم عبر واتساب أو رسالة التأكيد لتفعيل التحميل الفوري.",

    // Footer & Privacy
    privacyGuaranteed: "بياناتك بأمان 100%: تُحفظ سيرتك الذاتية محلياً في متصفحك فقط ولن يُنقل أي نص لشيرفر خارجي مجهول.",
    allRightsReserved: "جميع الحقوق محفوظة منصة Hash Resume",
  },

  en: {
    appName: "Hash Resume",
    tagline: "Smart ATS-Friendly Resume Builder",
    subtitle: "Create professional ATS-compliant resumes in Arabic & English in under 5 minutes. Powered by AI with 100% client-side privacy.",
    slogan: "No sign-up. Build. Download. Apply.",

    // Navbar
    navBuilder: "Resume Builder",
    navTemplates: "Templates",
    navAtsCheck: "Smart ATS Check",
    navPricing: "Pricing & Activation",
    navFaq: "FAQ",
    switchLang: "عربي",
    activatedStatus: "Activated",
    getActivated: "Activate",
    downloadPdf: "Download PDF",
    downloading: "Generating PDF...",

    // Quick Actions
    startNewResume: "Start New Resume",
    clearData: "Reset Builder",
    resetConfirm: "Start a new resume? Your current draft is saved.",
    startNewResumeTitle: "Start a new resume?",
    startNewResumeDesc: "Start a new resume? Your current draft is saved.",
    startNewResumeConfirmBtn: "Yes, Start Fresh",
    startNewResumeCancelBtn: "Cancel",
    startNewResumeSuccessMsg: "Resume has been cleared. You are ready to start fresh.",

    // Sections Tabs
    tabPersonal: "Personal Info",
    tabExperience: "Work Experience",
    tabEducation: "Education",
    tabSkills: "Skills & Languages",
    tabProjects: "Projects & Portfolio",
    tabCustom: "Custom Sections",
    tabAiTools: "AI Assistant",
    tabAtsAnalyzer: "ATS Score",

    // Personal Info Form
    fullName: "Full Name",
    jobTitle: "Target Job Title",
    email: "Email Address",
    phone: "Phone Number",
    location: "City, Country",
    linkedin: "LinkedIn Profile URL",
    github: "GitHub URL (Optional)",
    website: "Portfolio / Website (Optional)",
    summary: "Professional Summary",
    summaryPlaceholder: "Write a concise summary highlighting your experience, skills, and key impact...",
    aiGenerateSummary: "Generate with AI",
    photoUrl: "Photo URL (Optional)",

    // Experience Form
    addExperience: "Add New Experience",
    position: "Job Position / Title",
    company: "Company Name",
    startDate: "Start Date",
    endDate: "End Date",
    currentJob: "I currently work here",
    bulletPoints: "Key Achievements & Responsibilities (ATS Bullets)",
    bulletPlaceholder: "e.g. Led a team of 5 developers and improved application throughput by 35%",
    addBullet: "Add Achievement Bullet",
    aiEnhanceBullet: "Enhance with AI",

    // Education
    addEducation: "Add Education",
    degree: "Degree / Qualification",
    institution: "University / Institution",
    fieldOfStudy: "Field of Study",
    gpa: "GPA (Optional)",

    // Skills
    addSkill: "Add Skill",
    skillName: "Skill Name",
    skillCategory: "Category",
    techSkills: "Technical Skills",
    softSkills: "Soft Skills",
    tools: "Tools & Software",
    aiSuggestSkills: "AI Skill Recommendations",

    // Languages
    addLanguage: "Add Language",
    languageName: "Language",
    proficiency: "Proficiency Level",
    profNative: "Native / Bilingual",
    profFluent: "Full Professional",
    profAdvanced: "Advanced",
    profIntermediate: "Intermediate",
    profBasic: "Elementary",

    // Projects & Certs
    addProject: "Add Project",
    projectTitle: "Project Title",
    projectDesc: "Project Description & Stack",
    addCert: "Add Certification",
    certTitle: "Certification Name",
    certIssuer: "Issuing Organization",
    certDate: "Date Earned",

    // Customization & Templates
    customizeTitle: "Appearance & Styling",
    templateSelect: "Select Resume Template",
    colorSelect: "Primary Theme Color",
    fontSelect: "Typography Font",
    fontSizeSelect: "Font Size",
    spacingSelect: "Layout Spacing",
    showPhotoToggle: "Display Photo",

    // Templates Names & Desc
    tplBassux: "ATS Classic (BASSUX)",
    tplBassuxDesc: "True single-column plain text layout without colors or graphics for maximum ATS friendliness.",
    atsSelectorNote: "Best for online applications and Applicant Tracking Systems (ATS).",
    tplModernAts: "Modern ATS (Recommended)",
    tplModernAtsDesc: "Optimized clean structure designed for high recruiter readability and scanner compliance.",
    tplClassicProf: "Classic Professional",
    tplClassicProfDesc: "Traditional corporate layout suitable for enterprise, finance, and management roles.",
    tplMinimalExec: "Minimal Executive",
    tplMinimalExecDesc: "Elegant typography with direct focus on executive accomplishments.",
    tplTechnicalClean: "Technical Clean",
    tplTechnicalCleanDesc: "Tailored for Software Engineers, Tech, Product, and Data professionals.",
    tplCreativeCompact: "Creative Compact",
    tplCreativeCompactDesc: "Modern accent panels ideal for Marketing, Sales, and Design candidates.",

    // ATS Analyzer
    atsAnalyzerTitle: "ATS Resume Analyzer & Checker",
    atsAnalyzerSub: "Evaluate your resume against target job descriptions to get instant score breakdowns and actionable fixes.",
    targetJobDescLabel: "Target Job Description (Optional for exact keyword match):",
    jobDescPlaceholder: "Paste the job description or requirements here...",
    runAtsCheck: "Run ATS Scan Now",
    atsScore: "ATS Match Score",
    atsStrengths: "Identified Strengths",
    atsMissingKeywords: "Recommended Missing Keywords",
    atsActionPoints: "Actionable Improvement Steps",

    // Pricing & Activation
    pricingTitle: "Simple One-Time Activation",
    pricingSub: "No subscription trap. Pay once and keep editing locally on your device with complete peace of mind.",
    oneTimePayNotice: "One-time payment with zero auto-renewing subscriptions",

    planSingleTitle: "Single Activation",
    planSinglePrice: "50 EGP",
    planSingleDesc: "Perfect for creating, polishing, and exporting one primary resume.",
    planSingleFeature1: "Unlimited high-resolution PDF exports",
    planSingleFeature2: "All 5 ATS-compliant professional templates",
    planSingleFeature3: "AI Summary, Skill, and Bullet optimizer",
    planSingleFeature4: "100% private client-side browser storage",

    planBundleTitle: "3-Resume Pack",
    planBundleBadge: "Best Value (120 EGP - Save 30 EGP)",
    planBundlePrice: "120 EGP",
    planBundleDesc: "Ideal for creating targeted variations in different languages or fields.",
    planBundleFeature1: "3 separate activation slots for different resumes",
    planBundleFeature2: "Save 30 EGP instantly",
    planBundleFeature3: "Full access to AI ATS Analyzer for all versions",
    planBundleFeature4: "Priority support and future template updates",

    paymentMethodsTitle: "Accepted Payment Methods (Egypt & MENA):",
    payVodafoneCash: "Vodafone Cash / Etisalat / Orange / WE Pay",
    payInstapay: "InstaPay Mobile Wallet",
    payCards: "Meeza / Visa / MasterCard",
    payFawry: "Fawry / E-Payment Outlets",

    enterCodePrompt: "Enter your activation code after transferring:",
    codePlaceholder: "e.g. HASH-XXXX-XXXX",
    verifyCodeBtn: "Verify & Activate Now",
    demoCodesNotice: "Enter the activation code received via WhatsApp or confirmation message to unlock download.",

    // Footer & Privacy
    privacyGuaranteed: "100% Local Privacy: Your resume data stays strictly inside your browser's local storage and is never uploaded to remote databases.",
    allRightsReserved: "All rights reserved - Hash Resume Platform",
  },

  fr: {
    appName: "Hash Resume",
    tagline: "Générateur de CV intelligent compatible ATS",
    subtitle: "Créez un CV professionnel compatible ATS en moins de 5 minutes. Optimisé par l'IA avec une confidentialité totale.",
    slogan: "Sans inscription. Créez. Téléchargez. Postulez.",

    // Navbar
    navBuilder: "Créateur de CV",
    navTemplates: "Modèles",
    navAtsCheck: "Vérification ATS",
    navPricing: "Tarifs & Activation",
    navFaq: "FAQ",
    switchLang: "Français",
    activatedStatus: "Activé",
    getActivated: "Activer le CV",
    downloadPdf: "Télécharger PDF",
    downloading: "Génération en cours...",

    // Quick Actions
    startNewResume: "Nouveau CV",
    clearData: "Effacer les données",
    resetConfirm: "Voulez-vous vraiment réinitialiser toutes les données et commencer un nouveau CV vierge ?",
    startNewResumeTitle: "Commencer un nouveau CV vierge",
    startNewResumeDesc: "Toutes les données saisies seront effacées pour vous permettre de recommencer à zéro. Vos crédits d'activation et paramètres sont conservés.",
    startNewResumeConfirmBtn: "Oui, nouveau CV",
    startNewResumeCancelBtn: "Annuler",
    startNewResumeSuccessMsg: "Le CV a été réinitialisé avec succès.",
    
    // Sections Tabs
    tabPersonal: "Informations personnelles",
    tabExperience: "Expériences professionnelles",
    tabEducation: "Formation & Diplômes",
    tabSkills: "Compétences & Langues",
    tabProjects: "Projets & Réalisations",
    tabCustom: "Sections personnalisées",
    tabAiTools: "Outils IA",
    tabAtsAnalyzer: "Analyseur ATS",

    // Personal Info Form
    fullName: "Nom complet",
    jobTitle: "Titre du poste visé",
    email: "Adresse e-mail",
    phone: "Numéro de téléphone",
    location: "Ville / Pays",
    linkedin: "Profil LinkedIn",
    github: "Lien GitHub (optionnel)",
    website: "Site web / Portfolio (optionnel)",
    summary: "Résumé professionnel",
    summaryPlaceholder: "Rédigez un résumé professionnel percutant de vos compétences et réalisations...",
    aiGenerateSummary: "Générer avec l'IA",
    photoUrl: "Photo de profil (optionnelle)",

    // Experience Form
    addExperience: "Ajouter une expérience",
    position: "Poste occupé",
    company: "Entreprise / Organisation",
    startDate: "Date de début",
    endDate: "Date de fin",
    currentJob: "Poste actuel",
    bulletPoints: "Réalisations et missions (points clés ATS)",
    bulletPlaceholder: "Ex: Dirigé une équipe de 5 personnes et augmenté la productivité de 30%",
    addBullet: "Ajouter une réalisation",
    aiEnhanceBullet: "Améliorer avec l'IA",

    // Education
    addEducation: "Ajouter une formation",
    degree: "Diplôme / Niveau d'études",
    institution: "Université / École",
    fieldOfStudy: "Domaine d'études",
    gpa: "Mention / Moyenne (optionnel)",

    // Skills
    addSkill: "Ajouter une compétence",
    skillName: "Nom de la compétence",
    skillCategory: "Catégorie",
    techSkills: "Compétences techniques",
    softSkills: "Compétences relationnelles",
    tools: "Outils & Logiciels",
    aiSuggestSkills: "Suggérer des compétences IA",

    // Languages
    addLanguage: "Ajouter une langue",
    languageName: "Langue",
    proficiency: "Niveau",
    profNative: "Langue maternelle",
    profFluent: "Courant",
    profAdvanced: "Avancé",
    profIntermediate: "Intermédiaire",
    profBasic: "Débutant",

    // Projects & Certs
    addProject: "Ajouter un projet",
    projectTitle: "Titre du projet",
    projectDesc: "Description du projet et réalisations",
    addCert: "Ajouter une certification",
    certTitle: "Nom de la certification",
    certIssuer: "Organisme délivreur",
    certDate: "Date d'obtention",

    // Customization & Templates
    customizeTitle: "Personnalisation & Mise en page",
    templateSelect: "Sélectionner un modèle",
    colorSelect: "Couleur principale",
    fontSelect: "Police de caractères",
    fontSizeSelect: "Taille de police",
    spacingSelect: "Espacement des sections",
    showPhotoToggle: "Afficher la photo",
    showIconsToggle: "Afficher les icônes de contact",

    // ATS Score & Validation
    atsScoreTitle: "Score de compatibilité ATS",
    atsScoreDesc: "Analyse en temps réel de votre CV selon les standards des recruteurs.",
    atsPassed: "Optimisé pour ATS",
    atsWarning: "Améliorations conseillées",
    atsCritical: "Corrections requises",
    atsImproveBtn: "Améliorer les sections",

    // ATS Analyzer
    atsAnalyzerTitle: "Analyseur de CV pour système ATS",
    atsAnalyzerSub: "Évaluez votre CV par rapport aux exigences du poste pour obtenir un score et des recommandations.",
    targetJobDescLabel: "Description du poste visé (optionnelle pour ciblage précis) :",
    jobDescPlaceholder: "Collez ici les exigences ou l'annonce de l'emploi...",
    runAtsCheck: "Analyser le CV maintenant",
    atsScore: "Score de compatibilité ATS",
    atsStrengths: "Points forts identifiés",
    atsMissingKeywords: "Mots-clés manquants recommandés",
    atsActionPoints: "Actions rapides pour améliorer votre score",

    // AI Assistant
    aiAssistantTitle: "Assistant IA Hash Resume",
    aiAssistantDesc: "Optimisez la rédaction de votre CV grâce à nos modèles d'intelligence artificielle.",
    aiActionTranslate: "Traduire en anglais professionnel",
    aiActionMetrics: "Ajouter des indicateurs chiffrés (KPIs)",
    aiActionPolish: "Perfectionner le style rédactionnel",
    aiThinking: "Analyse IA en cours...",
    applyAiText: "Appliquer au CV",

    // Pricing & Activation
    pricingTitle: "Activation simple et sans abonnement",
    pricingSub: "Payez une seule fois sans piège d'abonnement récurrent ni frais cachés.",
    oneTimePayNotice: "Paiement unique sans renouvellement automatique",
    pricingSubtitle: "Payez une seule fois par CV complet, sans frais cachés ni renouvellement automatique.",
    planSingleTitle: "Activation Unique",
    planSinglePrice: "50 EGP",
    planSingleDesc: "Idéal pour télécharger et finaliser votre CV professionnel immédiatement.",
    planSingleFeature1: "Export PDF vectoriel haute résolution illimité",
    planSingleFeature2: "Accès complet aux 5 modèles conformes ATS",
    planSingleFeature3: "Optimisation de texte et résumé par IA",
    planSingleFeature4: "Stockage 100% privé dans votre navigateur",

    planBundleTitle: "Pack 3 CVs",
    planBundleBadge: "Meilleure offre (120 EGP - Économisez 30 EGP)",
    planBundlePrice: "120 EGP",
    planBundleDesc: "Parfait pour postuler à différents postes ou en plusieurs langues.",
    planBundleFeature1: "3 activations distinctes pour différents CVs",
    planBundleFeature2: "30 EGP d'économie immédiate",
    planBundleFeature3: "Accès complet à l'analyseur ATS IA",
    planBundleFeature4: "Support prioritaire et nouveaux modèles",

    paymentMethodsTitle: "Moyens de paiement acceptés (Égypte & MENA) :",
    payVodafoneCash: "Vodafone Cash / Etisalat / Orange / WE Pay",
    payInstapay: "InstaPay Mobile Wallet",
    payCards: "Meeza / Visa / MasterCard",
    payFawry: "Fawry / Points de paiement",

    enterCodePrompt: "Entrez votre code d'activation après le virement :",
    codePlaceholder: "Ex: HASH-XXXX-XXXX",
    verifyCodeBtn: "Vérifier & Activer maintenant",
    demoCodesNotice: "Entrez le code d'activation reçu par WhatsApp ou e-mail pour débloquer le téléchargement.",

    // Footer & Privacy
    privacyGuaranteed: "Confidentialité 100% locale : Vos données restent exclusivement stockées dans votre navigateur.",
    allRightsReserved: "Tous droits réservés - Plateforme Hash Resume",
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.ar;
}
