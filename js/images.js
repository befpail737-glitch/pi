/* 图片加载和优化相关JavaScript */

// 定义图片管理类
class ImageManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupImagePlaceholders();
    this.setupErrorHandling();
  }

  // 设置懒加载
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              
              // 如果有webp格式的图片
              if (img.dataset.webp) {
                this.supportsWebP().then(supported => {
                  if (supported) {
                    img.src = img.dataset.webp;
                  }
                });
              }
              
              img.classList.remove('loading');
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // 观察所有带有data-src属性的图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
      });
    } else {
      // 退回到传统的懒加载方法
      this.fallbackLazyLoading();
    }
  }

  // 检测WebP支持
  async supportsWebP() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = function () {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // 传统懒加载备选方案
  fallbackLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageLoader = (img) => {
      img.src = img.dataset.src;
      if (img.dataset.webp) {
        this.supportsWebP().then(supported => {
          if (supported) {
            img.src = img.dataset.webp;
          }
        });
      }
      img.classList.remove('loading');
      img.classList.add('loaded');
    };

    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.5) {
        imageLoader(img);
      }
    });

    // 监听滚动事件以加载其他图片
    window.addEventListener('scroll', this.throttle(() => {
      images.forEach(img => {
        if (!img.classList.contains('loaded')) {
          const rect = img.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.5) {
            imageLoader(img);
          }
        }
      });
    }, 200));
  }

  // 设置图片占位符
  setupImagePlaceholders() {
    // 为所有没有src的图片设置占位符
    document.querySelectorAll('img[alt]').forEach(img => {
      if (!img.src || img.src === window.location.href) {
        const alt = img.getAttribute('alt');
        // 创建占位符内容
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-image';
        placeholder.innerHTML = alt || '图片';
        
        // 替换图片元素
        img.parentNode.replaceChild(placeholder, img);
      }
    });
  }

  // 设置图片错误处理
  setupErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        // 创建占位符元素
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-image';
        placeholder.textContent = this.alt || '加载失败';
        
        // 替换图片
        this.parentNode.replaceChild(placeholder, this);
      });
    });
  }

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // 预加载关键图片
  preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  // 获取优化的图片URL
  getOptimizedImageUrl(baseUrl, options = {}) {
    const params = new URLSearchParams(options);
    return `${baseUrl}?${params}`;
  }
}

// 初始化图片管理器
document.addEventListener('DOMContentLoaded', () => {
  const imageManager = new ImageManager();
  
  // 将供全局访问
  window.ImageManager = imageManager;
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageManager;
}