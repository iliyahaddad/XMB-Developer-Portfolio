/* ------------------------------------------------------------------
   Portfolio configuration — this is the only file you need to edit
   to personalise the site. Every text has an English (en) and a
   Persian (fa) version.
------------------------------------------------------------------- */
window.PORTFOLIO_CONFIG = {
  username: 'iliyahaddad',
  name: { en: 'Iliya Haddad', fa: 'ایلیا حداد' },

  tagline: {
    en: 'Ideas become something real.',
    fa: 'ایده‌ها واقعی می‌شوند.'
  },
  intro: {
    en: 'Code, experiments and tools built out of curiosity — from low-level drivers to small utilities.',
    fa: 'کد، آزمایش و ابزارهایی که از سر کنجکاوی ساخته شده‌اند؛ از درایورهای سطح پایین تا ابزارهای کوچک کاربردی.'
  },

  /* Focus areas shown under Home → Focus. Icons: cpu, terminal, chip, globe, zap, layers */
  focus: [
    {
      icon: 'cpu',
      title: { en: 'Drivers and low-level', fa: 'درایور و سطح پایین' },
      text: {
        en: 'Windows driver models, hardware bring-up and reverse-engineering old graphics hardware.',
        fa: 'مدل‌های درایور ویندوز، راه‌اندازی سخت‌افزار و مهندسی معکوس کارت‌های گرافیک قدیمی.'
      }
    },
    {
      icon: 'terminal',
      title: { en: 'Retro and DOS tooling', fa: 'ابزارهای رترو و DOS' },
      text: {
        en: 'Open reconstructions of classic DOS and Windows 3.x software, and modern front-ends for legacy tools.',
        fa: 'بازسازی متن‌باز نرم‌افزارهای کلاسیک DOS و ویندوز ۳.x و رابط‌های مدرن برای ابزارهای قدیمی.'
      }
    },
    {
      icon: 'zap',
      title: { en: 'Embedded and IoT', fa: 'امبدد و اینترنت اشیا' },
      text: {
        en: 'PIC and ESP32 projects, infrared interfaces, MQTT dashboards and small connected devices.',
        fa: 'پروژه‌های PIC و ESP32، رابط‌های مادون‌قرمز، داشبوردهای MQTT و دستگاه‌های کوچک متصل.'
      }
    }
  ],

  approach: {
    title: { en: 'Learn by building. Improve by revisiting.', fa: 'با ساختن یاد بگیر، با بازبینی بهتر کن.' },
    text: {
      en: 'Every repository here started as a question: how does this actually work? I read the specs, build a small version, break it, and write down what I found so the next person does not have to start from zero.',
      fa: 'هر ریپازیتوری اینجا با یک سؤال شروع شد: این واقعاً چطور کار می‌کند؟ مستندات را می‌خوانم، یک نسخه‌ی کوچک می‌سازم، خرابش می‌کنم و یافته‌هایم را می‌نویسم تا نفر بعدی مجبور نباشد از صفر شروع کند.'
    }
  },

  /* Repositories listed first on Home → Featured (matched by exact repo name).
     If none match, the most-starred repositories are used instead. */
  pinned: [
    'WDDM-2_0-Driver-for-ATI-AMD-Series-Radeon-HD-5000',
    'irman-dual',
    'QuickCD'
  ],

  /* Shown only if the GitHub API cannot be reached and nothing is cached. */
  fallbackRepos: [
    {
      name: 'WDDM-2_0-Driver-for-ATI-AMD-Series-Radeon-HD-5000',
      language: 'C',
      description: {
        en: 'Experimental WDDM 2.0 physical-mode kernel-mode driver for ATI Mobility Radeon HD 5000 series (Madison / Juniper).',
        fa: 'درایور آزمایشی WDDM 2.0 در حالت فیزیکی برای سری ATI Mobility Radeon HD 5000 (Madison / Juniper).'
      }
    },
    {
      name: 'irman-dual',
      language: null,
      description: {
        en: 'IR-Man infrared receiver clone with automatic switching between serial and software USB.',
        fa: 'کلون گیرنده‌ی مادون‌قرمز IR-Man با تعویض خودکار بین سریال و USB نرم‌افزاری.'
      }
    }
  ],

  contact: {
    email: '',     // e.g. 'you@example.com' — leave empty to hide
    website: ''    // leave empty to use the website from your GitHub profile
  },

  cacheMinutes: 30,  // how long GitHub API responses are cached in the browser
  maxRepos: 60
};
