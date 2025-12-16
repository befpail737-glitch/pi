/* 页面间过渡动画 */

class PageTransition {
  constructor() {
    this.isTransitioning = false;
    this.init();
  }

  init() {
    // 监听所有内部链接点击
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    // 监听页面加载完成
    window.addEventListener('load', () => {
      this.fadeInPage();
    });
    
    // 监听浏览器前进后退
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  handleLinkClick(e) {
    // 检查是否是内部链接
    const link = e.target.closest('a');
    if (!link || this.isTransitioning) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return; // 不处理锚点链接、邮件链接或电话链接
    }

    // 对于外部链接，直接跳转
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      return;
    }

    e.preventDefault();
    
    // 开始退出动画
    this.transitionOut(() => {
      // 延迟以确保动画完成
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    });
  }

  handlePopState(e) {
    // 处理浏览器前进后退
    this.transitionOut(() => {
      this.reloadPage();
    });
  }

  transitionOut(callback) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    const body = document.body;
    body.classList.add('page-exit-active');
    
    // 设置过渡持续时间
    setTimeout(() => {
      if (callback) callback();
      this.isTransitioning = false;
    }, 300);
  }

  fadeInPage() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.4s ease';
    
    // 延迟以确保样式应用
    setTimeout(() => {
      body.style.opacity = '1';
    }, 50);
  }

  reloadPage() {
    window.location.reload();
  }

  // 动态加载页面内容（AJAX方式，可选实现）
  loadPage(url, callback) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        // 解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取主要内容
        const newContent = doc.querySelector('main')?.innerHTML;
        const newTitle = doc.querySelector('title')?.textContent;
        
        if (newContent) {
          document.querySelector('main').innerHTML = newContent;
          if (newTitle) {
            document.querySelector('title').textContent = newTitle;
          }
          
          // 更新URL但不刷新页面
          history.pushState({}, '', url);
          
          if (callback) callback();
        }
      })
      .catch(error => {
        console.error('页面加载失败:', error);
        // 如果AJAX加载失败，回退到正常页面跳转
        window.location.href = url;
      });
  }
}

// 滚动动画
class ScrollAnimation {
  constructor() {
    this.init();
  }

  init() {
    // 为所有带data-animate属性的元素添加动画
    this.animateOnScroll();
    
    // 监听滚动事件
    window.addEventListener('scroll', this.debounce(this.animateOnScroll.bind(this), 10));
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      if (this.isInViewport(el)) {
        const animationClass = el.getAttribute('data-animate');
        el.classList.add(animationClass, 'animate');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight * 0.8 &&
      rect.bottom >= 0
    );
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 初始化所有动画
document.addEventListener('DOMContentLoaded', () => {
  new PageTransition();
  new ScrollAnimation();
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PageTransition,
    ScrollAnimation
  };
}