/* 可访问性验证和测试工具 */

// 可访问性检查器
class AccessibilityChecker {
  constructor() {
    this.checks = [];
    this.init();
  }

  init() {
    // 页面加载完成后运行检查
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runChecks());
    } else {
      this.runChecks();
    }
  }

  runChecks() {
    // 运行所有可访问性检查
    this.checkHeadings();
    this.checkAltTexts();
    this.checkARIAAttributes();
    this.checkColorContrast();
    this.checkFocusIndicators();
    this.checkLanguageAttribute();
    
    // 输出检查结果到控制台（开发时使用）
    console.log('可访问性检查完成');
  }

  checkHeadings() {
    // 检查标题层级是否正确
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      // 检查标题层级是否连续
      if (level > lastLevel + 1 && lastLevel !== 0) {
        console.warn(`标题层级不连续: ${lastLevel} -> ${level}`, heading);
      }
      
      lastLevel = level;
    });
  }

  checkAltTexts() {
    // 检查图片是否有alt属性
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        console.warn('图片缺少alt属性:', img);
      } else if (img.getAttribute('alt') === '') {
        // 装饰性图片可以有空alt
        const isDecorative = img.closest('.decoration, .bg-image, .visual-only');
        if (!isDecorative) {
          console.warn('图片alt属性为空，检查是否为装饰性图片:', img);
        }
      }
    });
  }

  checkARIAAttributes() {
    // 检查ARIA属性使用是否正确
    const ariaElements = document.querySelectorAll('[role], [aria-*]');
    
    ariaElements.forEach(el => {
      // 检查role属性值是否有效
      const role = el.getAttribute('role');
      if (role && !this.isValidRole(role)) {
        console.warn(`无效的role属性: ${role}`, el);
      }
      
      // 检查必要的ARIA标签是否都存在
      this.checkARIARequirements(el);
    });
  }

  isValidRole(role) {
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 
      'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 
      'contentinfo', 'definition', 'dialog', 'directory', 'document', 
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 
      'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 
      'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 
      'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation', 
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 
      'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 
      'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 
      'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];
    
    return validRoles.includes(role);
  }

  checkARIARequirements(element) {
    const role = element.getAttribute('role');
    
    switch(role) {
      case 'button':
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
        break;
        
      case 'menuitem':
        const parentMenu = element.closest('[role="menu"], [role="menubar"]');
        if (!parentMenu) {
          console.warn('menuitem缺少父级menu或menubar', element);
        }
        break;
    }
  }

  checkColorContrast() {
    // 注意：实际的颜色对比度检查需要更复杂的计算
    // 这里只是确保CSS中定义了适当的对比度
    console.log('颜色对比度检查完成（请使用外部工具进行精确检查）');
  }

  checkFocusIndicators() {
    // 检查可获得焦点的元素是否都有可见的焦点指示器
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(el => {
      // 检查是否设置了outline
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.outline === 'none' || computedStyle.outlineWidth === '0px') {
        // 检查是否有其他焦点指示（如box-shadow）
        const hasFocusIndicator = computedStyle.boxShadow && computedStyle.boxShadow !== 'none';
        if (!hasFocusIndicator) {
          console.warn('可聚焦元素缺少焦点指示器:', el);
        }
      }
    });
  }

  checkLanguageAttribute() {
    // 检查html标签是否有lang属性
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      console.warn('HTML标签缺少lang属性');
    } else {
      const lang = htmlElement.getAttribute('lang');
      if (!this.isValidLanguageCode(lang)) {
        console.warn(`无效的语言代码: ${lang}`);
      }
    }
  }

  isValidLanguageCode(code) {
    // 简单验证语言代码格式
    const langRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    return langRegex.test(code);
  }
}

// 初始化可访问性检查器
document.addEventListener('DOMContentLoaded', () => {
  new AccessibilityChecker();
});

// 提供一个手动运行检查的方法
function runAccessibilityCheck() {
  const checker = new AccessibilityChecker();
  checker.runChecks();
}

// 导出函数以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessibilityChecker,
    runAccessibilityCheck
  };
}