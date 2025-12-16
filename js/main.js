// 主JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
  // 初始化页面功能
  initPageFeatures();
});

function initPageFeatures() {
  // 初始化平滑滚动
  initSmoothScrolling();

  // 初始化导航栏滚动效果
  initNavbarScrollEffect();

  // 初始化滚动动画
  initScrollAnimations();

  // 初始化汉堡菜单（移动端）
  initHamburgerMenu();

  // 初始化悬停动画
  initHoverEffects();
}

function initSmoothScrolling() {
  // 为所有内部链接添加平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        // 考虑到固定导航栏的高度
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initScrollAnimations() {
  // 检测浏览器是否支持Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    // 观察需要动画的元素
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }
}

function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // 点击菜单项后关闭菜单
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

// 初始化悬停动画效果
function initHoverEffects() {
  // 为卡片添加鼠标进入和离开事件
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // 可以添加额外的悬停效果
    });

    card.addEventListener('mouseleave', function() {
      // 可以添加鼠标离开效果
    });
  });

  // 为按钮添加悬停效果
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // 可以添加按钮悬停效果
    });
  });
}

// 导出函数以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPageFeatures,
    initSmoothScrolling,
    initNavbarScrollEffect,
    initScrollAnimations,
    initHamburgerMenu,
    initHoverEffects
  };
}