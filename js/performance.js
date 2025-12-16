/* 性能优化工具和检查 */

// 性能监控器
class PerformanceOptimizer {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // 页面加载完成后开始监控
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
    } else {
      this.startMonitoring();
    }
  }

  startMonitoring() {
    this.measureLoadTime();
    this.monitorResourceUsage();
    this.setupLazyLoading();
    this.optimizeImages();
  }

  measureLoadTime() {
    // 测量页面加载时间
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.loadTime = loadTime;
      console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
      
      // 检查是否在可接受范围内（小于3秒）
      if (loadTime > 3000) {
        console.warn('页面加载时间过长，请优化性能');
      }
    });
  }

  monitorResourceUsage() {
    // 监控内存和CPU使用情况（如果支持）
    if ('memory' in performance) {
      this.metrics.memory = performance.memory;
      console.log('内存使用情况:', performance.memory);
    }
    
    // 性能条目监控
    if ('getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        console.log(`${entry.name} 耗时: ${entry.duration}ms`);
      });
    }
  }

  setupLazyLoading() {
    // 已在images.js中实现，这里提供额外的优化
    // 为所有图片添加loading="lazy"属性（如果支持）
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      // 检查是否在可视区域内，如果不在则应用懒加载
      if (!this.isInViewport(img)) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  optimizeImages() {
    // 为所有图片添加适当的srcset属性以优化加载
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      // 如果有WebP支持，使用WebP格式
      if (img.dataset.webp) {
        this.checkWebPSupport().then(supported => {
          if (supported) {
            img.src = img.dataset.webp;
          } else {
            img.src = img.dataset.src;
          }
        });
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  async checkWebPSupport() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // 压缩CSS和JavaScript的建议
  suggestOptimizations() {
    const recommendations = [];
    
    // 检查是否有未压缩的CSS/JS文件
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll('script[src]');
    
    // 提示开发者工具
    recommendations.push('建议使用构建工具（如Webpack、Gulp）来压缩和合并CSS/JS文件');
    recommendations.push('考虑使用CDN来托管静态资源');
    recommendations.push('使用字体子集来减少字体文件大小');
    recommendations.push('实现资源预加载以提高关键资源的加载速度');
    
    console.log('性能优化建议:', recommendations);
    return recommendations;
  }

  // 实现防抖和节流功能
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
}

// 实现资源预加载器
class ResourcePreloader {
  static preloadCriticalResources() {
    const criticalResources = [
      // 添加关键资源的URL
    ];
    
    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  static preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
  const perfOptimizer = new PerformanceOptimizer();
  perfOptimizer.suggestOptimizations();
  
  // 预加载关键资源
  ResourcePreloader.preloadCriticalResources();
});

// 性能监控工具函数
function measureFunctionPerformance(fn, name) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`${name} 执行时间: ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

// 导出性能优化相关函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PerformanceOptimizer,
    ResourcePreloader,
    measureFunctionPerformance
  };
}