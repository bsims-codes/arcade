/**
 * VMK Arcade Room - Interactive Game Launcher
 *
 * Press P to toggle placement/debug mode for adjusting hotspot positions.
 */

// =============================================================================
// MACHINE CONFIGURATION
// Adjust x, y, width, height values to match your arcade-background.jpg image.
// =============================================================================
const machines = [
  {
    id: 'bubbles',
    label: 'Bubbles',
    hoverTooltip: 'Play Bubbles!',
    url: 'https://bsims-codes.github.io/myvmk-bubbles/',
    image: 'machine-bubbles.svg',
    // Adjust these coordinates to match your image:
    x: 50,
    y: 300,
    width: 120,
    height: 180
  },
  {
    id: 'tinks-hex',
    label: "Tink's Hex",
    hoverTooltip: "Play Tink's Hex!",
    url: 'https://bsims-codes.github.io/TinksHex/',
    image: 'FrontTinks_Hex2.png',
    // Adjust these coordinates to match your image:
    x: 220,
    y: 150,
    width: 120,
    height: 180
  },
  {
    id: 'swan',
    label: 'The Swan',
    hoverTooltip: 'Play The Swan!',
    url: 'https://bsims-codes.github.io/the-swan/',
    image: 'swan-arcade-machine.png',
    // Adjust these coordinates to match your image:
    x: 460,
    y: 150,
    width: 120,
    height: 180
  },
  {
    id: 'dinner-with-yzma',
    label: 'Dinner with Yzma',
    hoverTooltip: 'Play Dinner with Yzma!',
    url: 'https://bsims-codes.github.io/cup-shuffle/',
    image: 'dinner-with-yzma-arcade-machine.png',
    // Adjust these coordinates to match your image:
    x: 630,
    y: 350,
    width: 120,
    height: 180
  }
];

// =============================================================================
// DOM REFERENCES
// =============================================================================
const stage = document.getElementById('stage');
const hotspotsContainer = document.getElementById('hotspots');
const tooltip = document.getElementById('tooltip');
const debugOverlay = document.getElementById('debug-overlay');

const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const gameIframe = document.getElementById('game-iframe');
const fallbackLink = document.getElementById('fallback-link');
const externalLink = document.getElementById('external-link');

// =============================================================================
// STATE
// =============================================================================
let debugMode = false;
let loadTimeout = null;
let currentGameUrl = '';

// =============================================================================
// RENDER HOTSPOTS
// =============================================================================
function renderHotspots() {
  hotspotsContainer.innerHTML = '';

  machines.forEach(machine => {
    const hotspot = document.createElement('button');
    hotspot.className = 'hotspot';
    hotspot.setAttribute('data-id', machine.id);
    hotspot.setAttribute('data-coords', `${machine.x},${machine.y} ${machine.width}x${machine.height}`);
    hotspot.setAttribute('aria-label', machine.hoverTooltip || machine.label);
    hotspot.setAttribute('tabindex', '0');

    // Position and size
    hotspot.style.left = `${machine.x}px`;
    hotspot.style.top = `${machine.y}px`;
    hotspot.style.width = `${machine.width}px`;
    hotspot.style.height = `${machine.height}px`;

    // Add arcade machine image
    if (machine.image) {
      const img = document.createElement('img');
      img.src = machine.image;
      img.alt = machine.label;
      img.className = 'machine-image';
      img.draggable = false;
      hotspot.appendChild(img);
    }

    // Event listeners
    hotspot.addEventListener('mouseenter', (e) => showTooltip(e, machine));
    hotspot.addEventListener('mousemove', (e) => moveTooltip(e));
    hotspot.addEventListener('mouseleave', hideTooltip);
    hotspot.addEventListener('click', () => openModal(machine));
    hotspot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(machine);
      }
    });

    hotspotsContainer.appendChild(hotspot);
  });
}

// =============================================================================
// TOOLTIP
// =============================================================================
function showTooltip(e, machine) {
  tooltip.textContent = machine.hoverTooltip || machine.label;
  tooltip.classList.remove('hidden');
  moveTooltip(e);
}

function moveTooltip(e) {
  const stageRect = stage.getBoundingClientRect();
  const x = e.clientX - stageRect.left;
  const y = e.clientY - stageRect.top;

  // Position tooltip above cursor
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y - 40}px`;
}

function hideTooltip() {
  tooltip.classList.add('hidden');
}

// =============================================================================
// MODAL
// =============================================================================
function openModal(machine) {
  currentGameUrl = machine.url;

  // Reset state
  modalContent.classList.remove('loaded', 'error');
  errorEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  // Set title and links
  modalTitle.textContent = machine.label;
  fallbackLink.href = machine.url;
  externalLink.href = machine.url;

  // Clear previous iframe src and set new one
  gameIframe.src = '';
  gameIframe.src = machine.url;

  // Show modal
  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Scale modal for current viewport
  updateModalScale();

  // Focus management
  modalClose.focus();

  // Start load timeout (5 seconds)
  clearTimeout(loadTimeout);
  loadTimeout = setTimeout(() => {
    showError();
  }, 5000);
}

function closeModal() {
  clearTimeout(loadTimeout);
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
  gameIframe.src = '';
  currentGameUrl = '';
}

function showError() {
  modalContent.classList.add('error');
  errorEl.classList.remove('hidden');
}

// Iframe load success
gameIframe.addEventListener('load', () => {
  // Only count as success if we have a URL set
  if (gameIframe.src && gameIframe.src !== 'about:blank') {
    clearTimeout(loadTimeout);
    modalContent.classList.add('loaded');

    // Focus iframe to enable keyboard input for the game
    setTimeout(() => {
      gameIframe.focus();
    }, 100);
  }
});

// Iframe error
gameIframe.addEventListener('error', () => {
  clearTimeout(loadTimeout);
  showError();
});

// Close button
modalClose.addEventListener('click', closeModal);

// Click outside modal to close
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Prevent clicks inside modal from closing
modal.addEventListener('click', (e) => {
  e.stopPropagation();
});

// =============================================================================
// KEYBOARD HANDLING
// =============================================================================
document.addEventListener('keydown', (e) => {
  // ESC to close modal
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
    closeModal();
    return;
  }

  // P to toggle debug/placement mode
  if (e.key === 'p' || e.key === 'P') {
    // Don't toggle if modal is open or if typing in an input
    if (!modalOverlay.classList.contains('hidden')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    toggleDebugMode();
  }
});

// =============================================================================
// DEBUG / PLACEMENT MODE
// =============================================================================
function toggleDebugMode() {
  debugMode = !debugMode;

  if (debugMode) {
    stage.classList.add('debug');
    debugOverlay.classList.remove('hidden');
    console.log('Placement mode enabled. Current machine positions:');
    console.table(machines.map(m => ({
      id: m.id,
      x: m.x,
      y: m.y,
      width: m.width,
      height: m.height
    })));
  } else {
    stage.classList.remove('debug');
    debugOverlay.classList.add('hidden');
    console.log('Placement mode disabled.');
  }
}

// Click on stage in debug mode to log coordinates
stage.addEventListener('click', (e) => {
  if (!debugMode) return;

  const stageRect = stage.getBoundingClientRect();
  const x = Math.round(e.clientX - stageRect.left);
  const y = Math.round(e.clientY - stageRect.top);

  console.log(`Clicked at: x=${x}, y=${y}`);
});

// =============================================================================
// TRAP FOCUS IN MODAL (Accessibility)
// =============================================================================
const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusableEls = modal.querySelectorAll(focusableSelectors);
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  if (e.shiftKey && document.activeElement === firstEl) {
    e.preventDefault();
    lastEl.focus();
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault();
    firstEl.focus();
  }
});

// =============================================================================
// RESPONSIVE SCALING
// =============================================================================
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;
const MODAL_CONTENT_WIDTH = 900;
const MODAL_CONTENT_HEIGHT = 700;
const MODAL_HEADER_HEIGHT = 47;
const MODAL_FOOTER_HEIGHT = 41;
const MODAL_TOTAL_HEIGHT = MODAL_CONTENT_HEIGHT + MODAL_HEADER_HEIGHT + MODAL_FOOTER_HEIGHT;

function updateStageScale() {
  const padding = 40;
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight - padding - 60;

  const scaleX = availableWidth / STAGE_WIDTH;
  const scaleY = availableHeight / STAGE_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1);

  if (scale < 1) {
    stage.style.transform = `scale(${scale})`;
    stage.style.marginBottom = `${-(STAGE_HEIGHT * (1 - scale))}px`;
  } else {
    stage.style.transform = '';
    stage.style.marginBottom = '';
  }
}

function updateModalScale() {
  const padding = 20;
  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight - padding;

  // Calculate scale needed to fit
  const scaleX = availableWidth / MODAL_CONTENT_WIDTH;
  const scaleY = availableHeight / MODAL_TOTAL_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1);

  // Apply scale and adjust the wrapper dimensions
  if (scale < 1) {
    // Scale the modal
    modal.style.transform = `scale(${scale})`;

    // Calculate the actual rendered size
    const scaledWidth = MODAL_CONTENT_WIDTH * scale;
    const scaledHeight = MODAL_TOTAL_HEIGHT * scale;

    // Set wrapper dimensions so flexbox centering works correctly
    modal.style.width = `${MODAL_CONTENT_WIDTH}px`;
    modal.style.height = `${MODAL_TOTAL_HEIGHT}px`;
    modal.style.margin = `${-(MODAL_TOTAL_HEIGHT - scaledHeight) / 2}px ${-(MODAL_CONTENT_WIDTH - scaledWidth) / 2}px`;
  } else {
    modal.style.transform = '';
    modal.style.width = '';
    modal.style.height = '';
    modal.style.margin = '';
  }
}

function handleResize() {
  updateStageScale();
  if (!modalOverlay.classList.contains('hidden')) {
    updateModalScale();
  }
}

// Listen for resize and orientation change
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
  setTimeout(handleResize, 150);
});

// =============================================================================
// INITIALIZE
// =============================================================================
renderHotspots();
updateStageScale(); // Initial scale check

console.log('VMK Arcade Room loaded!');
console.log('Press P to toggle placement mode for adjusting hotspot positions.');
