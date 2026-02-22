/**
 * LUMINA THEME — Main JavaScript
 * Version: 1.0.0
 * ES6+ with modular architecture
 */

'use strict';

// ============================================================
// 1. GSAP Setup & Animations
// ============================================================
class AnimationManager {
  constructor() {
    this.gsapReady = false;
    this.init();
  }

  async init() {
    // Wait for GSAP to be available
    await this.waitForGSAP();
    this.setupScrollTrigger();
    this.initHeroAnimations();
    this.initScrollAnimations();
    this.initPageTransition();
  }

  waitForGSAP() {
    return new Promise((resolve) => {
      if (typeof gsap !== 'undefined') {
        this.gsapReady = true;
        resolve();
        return;
      }
      const check = setInterval(() => {
        if (typeof gsap !== 'undefined') {
          clearInterval(check);
          this.gsapReady = true;
          resolve();
        }
      }, 50);
    });
  }

  setupScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
      }
    }
  }

  initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero || !this.gsapReady) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('.hero__eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    });

    tl.to('.hero__title-line', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.3');

    tl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.4');

    tl.to('.hero__ctas', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.4');

    // Parallax effect
    if (typeof ScrollTrigger !== 'undefined') {
      const heroMedia = hero.querySelector('.hero__media');
      if (heroMedia) {
        gsap.to(heroMedia, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }

  initScrollAnimations() {
    if (!this.gsapReady || typeof ScrollTrigger === 'undefined') {
      // Fallback to IntersectionObserver
      this.initIntersectionObserver();
      return;
    }

    // Animate elements with GSAP ScrollTrigger
    gsap.utils.toArray('.anim-fade-up').forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray('.anim-fade-in').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          }
        }
      );
    });

    gsap.utils.toArray('.anim-scale-in').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          }
        }
      );
    });

    // Staggered children
    gsap.utils.toArray('[data-stagger]').forEach((parent) => {
      const children = parent.children;
      const stagger = parseFloat(parent.dataset.stagger) || 0.1;
      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: parent,
            start: 'top 85%',
          }
        }
      );
    });
  }

  initIntersectionObserver() {
    const animElements = document.querySelectorAll(
      '.anim-fade-up, .anim-fade-in, .anim-scale-in, .anim-slide-left, .anim-slide-right'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animElements.forEach(el => observer.observe(el));
  }

  initPageTransition() {
    if (!this.gsapReady) return;

    const overlay = document.getElementById('page-overlay');
    if (!overlay) return;

    // Exit animation on link click
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          link.hasAttribute('target') || link.hasAttribute('data-no-transition')) {
        return;
      }

      link.addEventListener('click', (e) => {
        const url = link.href;
        if (url.startsWith(window.location.origin) || url.startsWith('/')) {
          // Only transition within same origin
        }
      });
    });
  }
}

// ============================================================
// 2. Header & Navigation
// ============================================================
class Header {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.scrollThreshold = 50;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    this.handleScroll();
    this.initMobileMenu();
    this.initMegaMenu();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    if (this.header) {
      if (currentScrollY > this.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      // Hide/show header on scroll direction
      if (currentScrollY > 200) {
        if (currentScrollY > this.lastScrollY + 5) {
          this.header.style.transform = 'translateY(-100%)';
        } else if (currentScrollY < this.lastScrollY - 5) {
          this.header.style.transform = 'translateY(0)';
        }
      } else {
        this.header.style.transform = 'translateY(0)';
      }
    }

    // Scroll to top button
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
      scrollBtn.classList.toggle('visible', currentScrollY > 400);
    }

    this.lastScrollY = currentScrollY;
  }

  initMobileMenu() {
    if (!this.mobileMenuBtn || !this.mobileNav) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      const isOpen = this.mobileNav.classList.contains('open');
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });
  }

  openMobileMenu() {
    this.mobileNav.classList.add('open');
    this.mobileMenuBtn.classList.add('active');
    this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    document.getElementById('page-overlay')?.classList.add('active');
  }

  closeMobileMenu() {
    this.mobileNav.classList.remove('open');
    this.mobileMenuBtn.classList.remove('active');
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    document.getElementById('page-overlay')?.classList.remove('active');
  }

  initMegaMenu() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const trigger = item.querySelector('.nav-link');
      const menu = item.querySelector('.mega-menu');
      if (!trigger || !menu) return;

      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');

      item.addEventListener('mouseenter', () => {
        trigger.setAttribute('aria-expanded', 'true');
      });

      item.addEventListener('mouseleave', () => {
        trigger.setAttribute('aria-expanded', 'false');
      });

      // Keyboard nav
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const expanded = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', !expanded);
        }
        if (e.key === 'Escape') {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  }
}

// ============================================================
// 3. Cart
// ============================================================
class Cart {
  constructor() {
    this.drawer = document.querySelector('.cart-drawer');
    this.overlay = document.getElementById('page-overlay');
    this.itemsContainer = document.querySelector('.cart-drawer__items');
    this.subtotalEl = document.querySelector('.cart-drawer__subtotal-price');
    this.countEls = document.querySelectorAll('.cart-count');
    this.cartData = { items: [], item_count: 0, total_price: 0 };
    this.init();
  }

  init() {
    this.fetchCart();
    this.bindEvents();
  }

  async fetchCart() {
    try {
      const res = await fetch('/cart.js', {
        headers: { 'Content-Type': 'application/json' }
      });
      this.cartData = await res.json();
      this.updateCount(this.cartData.item_count);
    } catch (e) {
      console.warn('Cart fetch failed:', e);
    }
  }

  bindEvents() {
    // Open cart
    document.querySelectorAll('[data-cart-open]').forEach(btn => {
      btn.addEventListener('click', () => this.openDrawer());
    });

    // Close cart
    document.querySelectorAll('[data-cart-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeDrawer());
    });

    // Overlay click
    this.overlay?.addEventListener('click', () => this.closeDrawer());

    // Add to cart forms
    document.querySelectorAll('[data-atc-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addToCart(form);
      });
    });

    // Keyboard escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawer?.classList.contains('open')) {
        this.closeDrawer();
      }
    });

    // Cart item events (delegated)
    this.itemsContainer?.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('[data-qty-btn]');
      const removeBtn = e.target.closest('[data-remove-item]');

      if (qtyBtn) {
        const lineIndex = parseInt(qtyBtn.closest('[data-line]')?.dataset.line);
        const action = qtyBtn.dataset.qtyBtn;
        const input = qtyBtn.closest('.quantity-control')?.querySelector('.quantity-input');
        if (!input) return;
        const currentQty = parseInt(input.value);
        const newQty = action === 'plus' ? currentQty + 1 : Math.max(0, currentQty - 1);
        this.updateQuantity(lineIndex, newQty);
      }

      if (removeBtn) {
        const lineIndex = parseInt(removeBtn.closest('[data-line]')?.dataset.line);
        this.updateQuantity(lineIndex, 0);
      }
    });

    // Discount code
    const discountBtn = document.querySelector('[data-discount-apply]');
    discountBtn?.addEventListener('click', () => {
      const input = document.querySelector('[data-discount-input]');
      if (input?.value) {
        window.location.href = `/discount/${input.value}?redirect=/checkout`;
      }
    });
  }

  async addToCart(form) {
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;

    const formData = new FormData(form);
    const data = {
      id: formData.get('id'),
      quantity: parseInt(formData.get('quantity')) || 1,
    };

    // Properties
    const properties = {};
    formData.forEach((val, key) => {
      if (key.startsWith('properties[')) {
        const propKey = key.match(/\[(.+)\]/)?.[1];
        if (propKey) properties[propKey] = val;
      }
    });
    if (Object.keys(properties).length) data.properties = properties;

    btn.classList.add('loading');
    btn.innerHTML = `<span class="btn__spinner"></span>`;

    try {
      const res = await fetch(window.shopData.routesCartAdd, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.description || 'Could not add to cart');
      }

      await this.fetchCart();
      await this.renderDrawerItems();
      this.openDrawer();

      btn.classList.remove('loading');
      btn.classList.add('success');
      btn.innerHTML = `✓ Added to Cart`;
      setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = btn.dataset.originalText || 'Add to Cart';
      }, 2500);

      Toast.show('Item added to cart!', 'success');

    } catch (err) {
      btn.classList.remove('loading');
      btn.innerHTML = btn.dataset.originalText || 'Add to Cart';
      Toast.show(err.message, 'error');
    }
  }

  async updateQuantity(line, qty) {
    try {
      const res = await fetch(window.shopData.routesCartChange, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity: qty })
      });
      this.cartData = await res.json();
      this.updateCount(this.cartData.item_count);
      this.renderDrawerItems();
      this.updateSubtotal(this.cartData.total_price);

      // Animate update
      if (this.gsapReady && typeof gsap !== 'undefined') {
        gsap.fromTo(this.subtotalEl, 
          { scale: 1.1 }, 
          { scale: 1, duration: 0.3, ease: 'back.out' }
        );
      }
    } catch (e) {
      Toast.show('Could not update cart', 'error');
    }
  }

  async renderDrawerItems() {
    if (!this.itemsContainer) return;

    const res = await fetch('/cart.js');
    this.cartData = await res.json();
    this.updateCount(this.cartData.item_count);
    this.updateSubtotal(this.cartData.total_price);

    if (this.cartData.item_count === 0) {
      this.itemsContainer.innerHTML = this.emptyCartHTML();
      return;
    }

    this.itemsContainer.innerHTML = this.cartData.items.map((item, i) => 
      this.cartItemHTML(item, i + 1)
    ).join('');
  }

  cartItemHTML(item, line) {
    const price = this.formatMoney(item.final_line_price);
    return `
      <div class="cart-item" data-line="${line}">
        <div class="cart-item__image">
          ${item.image 
            ? `<img src="${item.image}" alt="${item.title}" loading="lazy" width="100" height="100">`
            : `<div class="skeleton" style="width:100%;height:100%"></div>`
          }
        </div>
        <div class="cart-item__info">
          <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
          ${item.variant_title && item.variant_title !== 'Default Title'
            ? `<span class="cart-item__variant">${item.variant_title}</span>`
            : ''
          }
          <div class="cart-item__bottom">
            <div class="quantity-control">
              <button class="quantity-btn" data-qty-btn="minus" aria-label="Decrease">−</button>
              <input class="quantity-input" type="number" value="${item.quantity}" min="0" readonly>
              <button class="quantity-btn" data-qty-btn="plus" aria-label="Increase">+</button>
            </div>
            <span class="cart-item__price">${price}</span>
          </div>
          <button class="cart-item__remove" data-remove-item>Remove</button>
        </div>
      </div>
    `;
  }

  emptyCartHTML() {
    return `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛒</div>
        <h3 class="cart-empty__title">Your cart is empty</h3>
        <p class="cart-empty__text">Add some products to get started</p>
        <a href="/collections/all" class="btn btn--primary" data-cart-close>Continue Shopping</a>
      </div>
    `;
  }

  updateCount(count) {
    this.countEls.forEach(el => {
      el.textContent = count;
      el.classList.toggle('visible', count > 0);
    });
  }

  updateSubtotal(price) {
    if (this.subtotalEl) {
      this.subtotalEl.textContent = this.formatMoney(price);
    }
  }

  formatMoney(cents) {
    const format = window.shopData?.moneyFormat || '${{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
  }

  openDrawer() {
    this.drawer?.classList.add('open');
    this.overlay?.classList.add('active');
    document.body.classList.add('drawer-open');
    this.renderDrawerItems();
    this.drawer?.querySelector('[data-cart-close]')?.focus();
  }

  closeDrawer() {
    this.drawer?.classList.remove('open');
    this.overlay?.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }
}

// ============================================================
// 4. Search
// ============================================================
class Search {
  constructor() {
    this.drawer = document.querySelector('.search-drawer');
    this.input = document.querySelector('.search-drawer__input');
    this.results = document.querySelector('.search-results-grid');
    this.debounceTimer = null;
    this.init();
  }

  init() {
    document.querySelectorAll('[data-search-open]').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    document.querySelectorAll('[data-search-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.input?.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.query(this.input.value.trim());
      }, 350);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  }

  async query(q) {
    if (!q || q.length < 2) {
      if (this.results) this.results.innerHTML = '';
      return;
    }

    try {
      const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=8`);
      const data = await res.json();
      this.renderResults(data.resources?.results?.products || []);
    } catch (e) {
      console.warn('Search error:', e);
    }
  }

  renderResults(products) {
    if (!this.results) return;
    if (!products.length) {
      this.results.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1">No results found</p>`;
      return;
    }

    this.results.innerHTML = products.map(product => `
      <a href="${product.url}" class="search-result-item">
        <div class="product-card__media" style="aspect-ratio:1;border-radius:var(--radius-md);overflow:hidden;margin-bottom:var(--space-2)">
          ${product.featured_image?.url 
            ? `<img src="${product.featured_image.url}" alt="${product.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
            : `<div class="skeleton" style="width:100%;height:100%"></div>`
          }
        </div>
        <div style="font-size:var(--text-sm);font-weight:600">${product.title}</div>
        <div style="font-size:var(--text-sm);color:var(--color-text-muted)">${product.price}</div>
      </a>
    `).join('');
  }

  open() {
    this.drawer?.classList.add('open');
    document.getElementById('page-overlay')?.classList.add('active');
    document.body.classList.add('drawer-open');
    setTimeout(() => this.input?.focus(), 300);
  }

  close() {
    this.drawer?.classList.remove('open');
    document.getElementById('page-overlay')?.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }
}

// ============================================================
// 5. Product Gallery
// ============================================================
class ProductGallery {
  constructor() {
    this.mainImg = document.querySelector('.product-gallery__main img');
    this.thumbs = document.querySelectorAll('.product-gallery__thumb');
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (!this.mainImg || !this.thumbs.length) return;

    this.thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => this.setActive(i));
    });

    // Touch swipe
    let startX = 0;
    this.mainImg.parentElement.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.mainImg.parentElement.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
      }
    });
  }

  setActive(index) {
    const thumb = this.thumbs[index];
    const src = thumb.querySelector('img')?.src;
    const srcset = thumb.querySelector('img')?.srcset;

    if (src && this.mainImg) {
      // Animate transition
      if (typeof gsap !== 'undefined') {
        gsap.to(this.mainImg, {
          opacity: 0,
          scale: 0.98,
          duration: 0.2,
          onComplete: () => {
            this.mainImg.src = src;
            if (srcset) this.mainImg.srcset = srcset;
            gsap.to(this.mainImg, { opacity: 1, scale: 1, duration: 0.3 });
          }
        });
      } else {
        this.mainImg.src = src;
      }
    }

    this.thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    this.currentIndex = index;
  }

  next() {
    const next = (this.currentIndex + 1) % this.thumbs.length;
    this.setActive(next);
  }

  prev() {
    const prev = (this.currentIndex - 1 + this.thumbs.length) % this.thumbs.length;
    this.setActive(prev);
  }
}

// ============================================================
// 6. Variant Selector
// ============================================================
class VariantSelector {
  constructor() {
    this.form = document.querySelector('[data-product-form]');
    this.productData = this.parseProductData();
    this.init();
  }

  parseProductData() {
    const el = document.getElementById('product-json');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch { return null; }
  }

  init() {
    if (!this.form || !this.productData) return;

    this.form.querySelectorAll('[data-variant-option]').forEach(option => {
      option.addEventListener('click', () => this.handleOptionClick(option));
    });
  }

  handleOptionClick(option) {
    const group = option.closest('[data-option-group]');
    if (!group) return;

    group.querySelectorAll('[data-variant-option]').forEach(o => {
      o.classList.remove('active');
    });
    option.classList.add('active');

    // Update label
    const label = group.querySelector('[data-option-value]');
    if (label) label.textContent = option.dataset.value;

    this.updateVariant();
  }

  updateVariant() {
    const selectedOptions = Array.from(
      this.form.querySelectorAll('[data-option-group]')
    ).map(group => {
      return group.querySelector('[data-variant-option].active')?.dataset.value;
    });

    const variant = this.productData.variants.find(v => {
      return v.options.every((opt, i) => opt === selectedOptions[i]);
    });

    if (!variant) return;

    // Update hidden input
    const variantInput = this.form.querySelector('[name="id"]');
    if (variantInput) variantInput.value = variant.id;

    // Update price
    this.updatePrice(variant);

    // Update availability
    const atcBtn = this.form.querySelector('[type="submit"]');
    if (atcBtn) {
      if (variant.available) {
        atcBtn.disabled = false;
        atcBtn.innerHTML = atcBtn.dataset.originalText || 'Add to Cart';
      } else {
        atcBtn.disabled = true;
        atcBtn.innerHTML = 'Sold Out';
      }
    }

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());

    // Dispatch event
    document.dispatchEvent(new CustomEvent('variant:changed', { detail: { variant } }));
  }

  updatePrice(variant) {
    const priceEl = document.querySelector('[data-product-price]');
    const compareEl = document.querySelector('[data-product-compare-price]');
    
    if (priceEl) {
      priceEl.textContent = this.formatMoney(variant.price);
    }
    
    if (compareEl) {
      if (variant.compare_at_price > variant.price) {
        compareEl.textContent = this.formatMoney(variant.compare_at_price);
        compareEl.style.display = '';
      } else {
        compareEl.style.display = 'none';
      }
    }
  }

  formatMoney(cents) {
    const format = window.shopData?.moneyFormat || '${{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount);
  }
}

// ============================================================
// 7. Wishlist
// ============================================================
class Wishlist {
  constructor() {
    this.storageKey = 'lumina_wishlist';
    this.items = this.load();
    this.init();
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch { return []; }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  toggle(id) {
    const idx = this.items.indexOf(id);
    if (idx > -1) {
      this.items.splice(idx, 1);
      Toast.show('Removed from wishlist');
    } else {
      this.items.push(id);
      Toast.show('Added to wishlist!', 'success');
    }
    this.save();
    this.updateButtons();
    return idx === -1; // true if added
  }

  has(id) { return this.items.includes(id); }

  updateButtons() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const id = parseInt(btn.dataset.wishlistBtn);
      btn.classList.toggle('active', this.has(id));
      btn.setAttribute('aria-pressed', this.has(id));
      btn.title = this.has(id) ? 'Remove from wishlist' : 'Add to wishlist';
    });
  }

  init() {
    this.updateButtons();

    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.wishlistBtn);
        const added = this.toggle(id);

        // Animate
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            scale: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
          });
        }
      });
    });
  }
}

// ============================================================
// 8. Recently Viewed
// ============================================================
class RecentlyViewed {
  constructor() {
    this.storageKey = 'lumina_recently_viewed';
    this.maxItems = 8;
    this.init();
  }

  init() {
    const productId = document.querySelector('[data-product-id]')?.dataset.productId;
    if (productId) this.track(productId);
    this.render();
  }

  track(id) {
    const items = this.getItems().filter(i => i !== id);
    items.unshift(id);
    localStorage.setItem(this.storageKey, JSON.stringify(items.slice(0, this.maxItems)));
  }

  getItems() {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); } 
    catch { return []; }
  }

  render() {
    const container = document.querySelector('[data-recently-viewed]');
    if (!container) return;

    const items = this.getItems();
    const currentId = document.querySelector('[data-product-id]')?.dataset.productId;
    const filtered = items.filter(id => id !== currentId).slice(0, 4);

    if (!filtered.length) {
      container.closest('section')?.style.setProperty('display', 'none');
      return;
    }

    // Products are rendered server-side via sections
    container.setAttribute('data-product-ids', filtered.join(','));
  }
}

// ============================================================
// 9. Testimonials Slider
// ============================================================
class TestimonialsSlider {
  constructor(el) {
    this.el = el;
    this.track = el.querySelector('.testimonials-track');
    this.dots = el.querySelectorAll('.slider-dot');
    this.prevBtn = el.querySelector('[data-slider-prev]');
    this.nextBtn = el.querySelector('[data-slider-next]');
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    if (!this.track) return;

    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });

    // Touch swipe
    let startX = 0;
    this.track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    this.track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
    });

    this.startAutoplay();
    this.el.addEventListener('mouseenter', () => this.stopAutoplay());
    this.el.addEventListener('mouseleave', () => this.startAutoplay());
  }

  getCardWidth() {
    const card = this.track.querySelector('.testimonial-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
    return card.offsetWidth + gap;
  }

  goTo(index) {
    const cards = this.track.querySelectorAll('.testimonial-card');
    this.currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    const offset = this.getCardWidth() * this.currentIndex;

    if (typeof gsap !== 'undefined') {
      gsap.to(this.track, { x: -offset, duration: 0.6, ease: 'power3.out' });
    } else {
      this.track.style.transform = `translateX(${-offset}px)`;
    }

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  next() {
    const cards = this.track.querySelectorAll('.testimonial-card');
    const next = (this.currentIndex + 1) % cards.length;
    this.goTo(next);
  }

  prev() {
    const cards = this.track.querySelectorAll('.testimonial-card');
    const prev = (this.currentIndex - 1 + cards.length) % cards.length;
    this.goTo(prev);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
}

// ============================================================
// 10. Dark Mode Toggle
// ============================================================
class ThemeToggle {
  constructor() {
    this.key = 'lumina_theme';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.key) || 'light';
    this.setTheme(saved, false);

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme, animate = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.classList.toggle('active', theme === 'dark');
      btn.setAttribute('aria-checked', theme === 'dark');
    });
  }
}

// ============================================================
// 11. Product Accordions
// ============================================================
class Accordions {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item?.querySelector('.accordion-content');
        const expanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close all
        document.querySelectorAll('.accordion-trigger').forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          t.closest('.accordion-item')?.querySelector('.accordion-content')
            ?.setAttribute('aria-hidden', 'true');
        });

        if (!expanded) {
          trigger.setAttribute('aria-expanded', 'true');
          content?.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }
}

// ============================================================
// 12. Filter Groups
// ============================================================
class FilterGroups {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('.filter-group__title').forEach(title => {
      title.addEventListener('click', () => {
        const group = title.closest('.filter-group');
        group.classList.toggle('open');
        const content = group.querySelector('.filter-group__content');
        content?.classList.toggle('hidden');
      });
    });
  }
}

// ============================================================
// 13. Collection View Toggle
// ============================================================
class ViewToggle {
  constructor() {
    this.grid = document.querySelector('.products-grid');
    this.init();
  }

  init() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setView(view);
      });
    });
  }

  setView(view) {
    if (!this.grid) return;
    this.grid.className = `products-grid products-grid--${view}`;

    if (view === 'list') {
      this.grid.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('product-card--list');
      });
    } else {
      this.grid.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('product-card--list');
      });
    }
  }
}

// ============================================================
// 14. Sticky ATC
// ============================================================
class StickyATC {
  constructor() {
    this.btn = document.querySelector('.sticky-atc');
    this.atcSection = document.querySelector('.product-info__atc');
    this.init();
  }

  init() {
    if (!this.btn || !this.atcSection) return;

    const observer = new IntersectionObserver(([entry]) => {
      this.btn.style.display = entry.isIntersecting ? 'none' : 'block';
    }, { threshold: 0 });

    observer.observe(this.atcSection);

    this.btn.querySelector('button')?.addEventListener('click', () => {
      this.atcSection.querySelector('[type="submit"]')?.click();
    });
  }
}

// ============================================================
// 15. Announcement Bar
// ============================================================
class AnnouncementBar {
  constructor() {
    this.bar = document.querySelector('.announcement-bar');
    this.init();
  }

  init() {
    const closeBtn = this.bar?.querySelector('.announcement-bar__close');
    closeBtn?.addEventListener('click', () => {
      this.bar.style.maxHeight = this.bar.offsetHeight + 'px';
      requestAnimationFrame(() => {
        this.bar.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        this.bar.style.maxHeight = '0';
        this.bar.style.opacity = '0';
        this.bar.style.overflow = 'hidden';
      });
      sessionStorage.setItem('lumina_announcement_closed', '1');
    });

    if (sessionStorage.getItem('lumina_announcement_closed') === '1') {
      this.bar?.style.setProperty('display', 'none');
    }
  }
}

// ============================================================
// 16. Toast Notifications
// ============================================================
class Toast {
  static show(message, type = 'default', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'} 
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.add('hide');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }
}

// ============================================================
// 17. Scroll to Top
// ============================================================
class ScrollToTop {
  constructor() {
    this.btn = document.getElementById('scroll-to-top');
    this.init();
  }

  init() {
    if (!this.btn) return;
    this.btn.addEventListener('click', () => {
      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { scrollTo: 0, duration: 0.8, ease: 'power3.inOut' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// ============================================================
// 18. Lazy Loading
// ============================================================
class LazyLoader {
  constructor() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported, do nothing extra
      return;
    }
    // Fallback IntersectionObserver
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    imgs.forEach(img => observer.observe(img));
  }
}

// ============================================================
// 19. Infinite Scroll (Collection)
// ============================================================
class InfiniteScroll {
  constructor() {
    this.grid = document.querySelector('.products-grid');
    this.sentinel = document.querySelector('[data-infinite-scroll]');
    this.loading = false;
    this.page = 2;
    this.hasMore = !!this.sentinel;
    this.init();
  }

  init() {
    if (!this.sentinel || !this.grid) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.loading && this.hasMore) {
        this.loadMore();
      }
    }, { rootMargin: '200px' });

    observer.observe(this.sentinel);
  }

  async loadMore() {
    this.loading = true;

    // Skeleton loaders
    const skeletons = Array.from({ length: 4 }, () => {
      const el = document.createElement('div');
      el.className = 'product-card skeleton';
      el.style.cssText = 'height:400px;border-radius:var(--radius-lg)';
      this.grid.appendChild(el);
      return el;
    });

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('page', this.page);

      const res = await fetch(url.toString(), {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (!res.ok) throw new Error();

      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newCards = doc.querySelectorAll('.product-card');

      skeletons.forEach(s => s.remove());

      if (newCards.length === 0) {
        this.hasMore = false;
        this.sentinel.remove();
        return;
      }

      newCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        this.grid.appendChild(card);

        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = '';
        });
      });

      this.page++;
      if (newCards.length < 12) {
        this.hasMore = false;
        this.sentinel.remove();
      }

    } catch {
      skeletons.forEach(s => s.remove());
      this.hasMore = false;
    }

    this.loading = false;
  }
}

// ============================================================
// 20. Initialize Everything
// ============================================================
function closeAllOverlays() {
  document.body.classList.remove('drawer-open');
  document.body.removeAttribute('style');
  document.getElementById('page-overlay')?.classList.remove('active');
  document.querySelector('.mobile-nav')?.classList.remove('open');
  document.querySelector('.mobile-menu-btn')?.classList.remove('active');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.search-drawer')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  closeAllOverlays();

  // Overlay click closes all drawers
  document.getElementById('page-overlay')?.addEventListener('click', closeAllOverlays);

  // Core
  const themeToggle = new ThemeToggle();
  const header = new Header();
  const cart = new Cart();
  const search = new Search();
  const wishlist = new Wishlist();
  const recentlyViewed = new RecentlyViewed();
  const scrollToTop = new ScrollToTop();
  const lazyLoader = new LazyLoader();
  const announcementBar = new AnnouncementBar();
  const accordions = new Accordions();

  // Page-specific
  if (document.querySelector('.hero')) {
    new AnimationManager();
  } else {
    // Still init scroll animations
    const animMgr = new AnimationManager();
    animMgr.init();
  }

  if (document.querySelector('.product-gallery__main')) {
    new ProductGallery();
  }

  if (document.querySelector('[data-product-form]')) {
    new VariantSelector();
    new StickyATC();
  }

  if (document.querySelector('.testimonials')) {
    document.querySelectorAll('.testimonials').forEach(el => {
      new TestimonialsSlider(el);
    });
  }

  if (document.querySelector('.filter-group')) {
    new FilterGroups();
  }

  if (document.querySelector('.view-btn')) {
    new ViewToggle();
  }

  if (document.querySelector('[data-infinite-scroll]')) {
    new InfiniteScroll();
  }

  // Make toast globally available
  window.LuminaToast = Toast;

  // Make cart globally available
  window.LuminaCart = cart;

  // Make wishlist globally available
  window.LuminaWishlist = wishlist;

  // Log theme ready
  console.log('🌟 Lumina Theme Ready');
});

// Fix stuck overlay/body on back/forward navigation or page restore
window.addEventListener('pageshow', (e) => {
  if (e.persisted) closeAllOverlays();
});

// Export for potential module use
if (typeof module !== 'undefined') {
  module.exports = { Toast, Cart, Wishlist };
}
