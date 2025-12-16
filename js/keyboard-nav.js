/* 键盘导航支持 */

// 键盘导航管理器
class KeyboardNavigation {
  constructor() {
    this.currentFocus = null;
    this.init();
  }

  init() {
    // 监听键盘事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // 监听焦点变化
    document.addEventListener('focusin', this.handleFocusChange.bind(this));
    
    // 初始化焦点样式
    this.addFocusStyles();
  }

  handleKeyDown(e) {
    // 处理Tab键导航
    if (e.key === 'Tab') {
      this.handleTabNavigation(e);
      return;
    }

    // 处理导航菜单中的方向键
    if (this.isInNavMenu(e.target)) {
      this.handleNavMenuNavigation(e);
      return;
    }

    // 处理网格中的方向键导航
    if (this.isInGrid(e.target)) {
      this.handleGridNavigation(e);
      return;
    }

    // 处理焦点元素上的Enter或Space键
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        e.preventDefault();
        e.target.click();
      }
    }
  }

  handleTabNavigation(e) {
    // 添加tab键指示样式
    document.body.classList.add('keyboard-nav');
    document.body.classList.remove('mouse-nav');
  }

  handleFocusChange(e) {
    // 更新当前焦点元素
    this.currentFocus = e.target;
    
    // 添加焦点指示样式
    this.addFocusIndicator(e.target);
  }

  isInNavMenu(element) {
    return element.closest('[role="menubar"], .nav-menu') !== null;
  }

  isInGrid(element) {
    return element.closest('.grid, .feature-grid-container') !== null;
  }

  handleNavMenuNavigation(e) {
    const menu = e.target.closest('[role="menubar"], .nav-menu');
    const items = menu.querySelectorAll('a, button');
    const currentIndex = Array.from(items).indexOf(e.target);
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex) {
      items[newIndex].focus();
    }
  }

  handleGridNavigation(e) {
    const grid = e.target.closest('.grid, .feature-grid-container');
    const items = grid.querySelectorAll('.feature-card, .card');
    const currentItem = e.target.closest('.feature-card, .card');
    const currentIndex = Array.from(items).indexOf(currentItem);
    
    if (currentIndex === -1) return; // 当前元素不在网格中
    
    const gridColumns = this.getGridColumns(grid);
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(currentIndex + gridColumns, items.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(currentIndex - gridColumns, 0);
        break;
    }
    
    if (newIndex !== currentIndex) {
      items[newIndex].querySelector('a, button')?.focus();
    }
  }

  getGridColumns(grid) {
    // 简化计算，实际项目中可能需要更复杂的逻辑
    if (grid.classList.contains('grid-3-col')) return 3;
    if (grid.classList.contains('grid-2-col')) return 2;
    
    // 根据屏幕宽度和元素宽度计算列数
    const firstItem = grid.querySelector('.feature-card, .card');
    if (firstItem) {
      const containerWidth = grid.offsetWidth;
      const itemWidth = firstItem.offsetWidth + 20; // 估算包含间距的宽度
      return Math.max(1, Math.floor(containerWidth / itemWidth));
    }
    
    return 1;
  }

  addFocusIndicator(element) {
    // 移除之前的所有焦点指示
    document.querySelectorAll('.focus-indicator').forEach(el => {
      el.classList.remove('focus-indicator');
    });
    
    // 添加焦点指示到当前元素
    element.classList.add('focus-indicator');
  }

  addFocusStyles() {
    // 添加键盘焦点样式
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-nav :focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
      }
      
      .keyboard-nav button:focus,
      .keyboard-nav a:focus,
      .keyboard-nav input:focus,
      .keyboard-nav select:focus,
      .keyboard-nav textarea:focus,
      .keyboard-nav [tabindex]:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3) !important;
      }
      
      /* 鼠标导航模式下隐藏默认outline */
      .mouse-nav :focus {
        outline: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// 监听鼠标使用以切换导航模式
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
  document.body.classList.add('mouse-nav');
});

// 初始化键盘导航
document.addEventListener('DOMContentLoaded', () => {
  new KeyboardNavigation();
});

// 导出键盘导航类以便其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeyboardNavigation;
}