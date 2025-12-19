document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const TOP_ZONE_HEIGHT = 100; // 顶部 100px 区域

  const debounce = (fn, delay = 80) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  if (header) {
    const handleMouseMove = debounce((event) => {
      const isInTopZone = event.clientY <= TOP_ZONE_HEIGHT;
      if (isInTopZone) {
        header.classList.add('is-opaque');
      } else {
        header.classList.remove('is-opaque');
      }
    }, 60);

    document.addEventListener('mousemove', handleMouseMove);

    // 初始根据滚动位置设置一次状态
    if (window.scrollY < TOP_ZONE_HEIGHT) {
      header.classList.remove('is-opaque');
    } else {
      header.classList.add('is-opaque');
    }

    window.addEventListener(
      'scroll',
      debounce(() => {
        if (window.scrollY < TOP_ZONE_HEIGHT) {
          // 是否透明仍然由鼠标位置控制
          return;
        }
        header.classList.add('is-opaque');
      }, 80)
    );
  }

  // 导航栏锚点平滑滚动
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      if (href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          event.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight - 10;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // 明暗主题切换
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const applyThemeFromStorage = () => {
    const saved = window.localStorage.getItem('paya-theme');
    if (saved === 'light') {
      document.body.classList.add('theme-light');
    } else if (saved === 'dark') {
      document.body.classList.remove('theme-light');
    }
  };

  const updateThemeButtonLabel = () => {
    if (!themeToggleBtn) return;
    const isLight = document.body.classList.contains('theme-light');
    themeToggleBtn.textContent = isLight ? 'Dark' : 'Light';
  };

  applyThemeFromStorage();
  updateThemeButtonLabel();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLightNow = document.body.classList.toggle('theme-light');
      window.localStorage.setItem('paya-theme', isLightNow ? 'light' : 'dark');
      updateThemeButtonLabel();
    });
  }

  // 页脚年份自动更新
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }
});

