/* =============================================================
   AlgoViz — Script
   Fixed bugs:
   1. Broken HTML input/slider parsing fixed (HTML restructured)
   2. Double finishSorting() call eliminated (algoPromise .catch removed)
   3. updateStats() called with forceUpdate=true where needed
   4. Modals now properly placed in DOM (not nested inside slider)
   5. Keyboard (Enter) support on algo items
   6. Status chip reflecting app state
   7. Stat bump animation
   ============================================================= */

'use strict';

/* ──────────────────────────────────────
   DOM References
   ────────────────────────────────────── */
const arrayContainer   = document.getElementById('array-container');
const generateBtn      = document.getElementById('generate-array');
const arraySizeInput   = document.getElementById('array-size');
const speedSlider      = document.getElementById('speed-slider');
const speedValueEl     = document.getElementById('speed-value');
const sortBtn          = document.getElementById('sort-btn');
const pauseBtn         = document.getElementById('pause-btn');
const resetBtn         = document.getElementById('reset-btn');
const algoItems        = document.querySelectorAll('.algo-item');
const comparisonsEl    = document.getElementById('comparisons');
const swapsEl          = document.getElementById('swaps');
const timeEl           = document.getElementById('time');
const operationsEl     = document.getElementById('operations');
const timeComplexityEl = document.getElementById('time-complexity');
const spaceComplexityEl= document.getElementById('space-complexity');
const algoDescriptionEl= document.getElementById('algo-description');
const resultMessageEl  = document.getElementById('resultMessage');
const statusChip       = document.getElementById('status-chip');
const capIndicator     = document.getElementById('height-cap-indicator');

// Binary search modal
const binaryModal      = document.getElementById('binarySearchModal');
const searchValueInput = document.getElementById('searchValue');
const startSearchBtn   = document.getElementById('startSearch');
const cancelSearchBtn  = document.getElementById('cancelSearch');

// Linear search modal
const linearModal      = document.getElementById('linearSearchModal');
const linearSearchInput= document.getElementById('linearSearchValue');
const startLinearBtn   = document.getElementById('startLinearSearch');
const cancelLinearBtn  = document.getElementById('cancelLinearSearch');

/* ──────────────────────────────────────
   State
   ────────────────────────────────────── */
let array             = [];
let arraySize         = parseInt(arraySizeInput.value, 10) || 30;
let sorting           = false;
let paused            = false;
let selectedAlgorithm = 'bubble';
let speed             = 200;       // ms delay per step
let comparisons       = 0;
let swaps             = 0;
let startTime         = 0;
let operations        = 0;
let animationId       = null;
let resizeTimeout     = null;

// Container sizing constants
const CONTAINER_BASE_HEIGHT      = 260;
const CONTAINER_THRESHOLD        = 40;
const CONTAINER_EXTRA_PER_ITEM   = 4;
const CONTAINER_MAX_HEIGHT       = 700;

/* ──────────────────────────────────────
   Algorithm Metadata
   ────────────────────────────────────── */
const algoInfo = {
  bubble:    { time:'O(n²)',       space:'O(1)',      description:'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient for large datasets.' },
  quick:     { time:'O(n log n)',  space:'O(log n)',  description:'Quick sort is a divide-and-conquer algorithm. It selects a pivot element and partitions the array around the pivot, recursively sorting both halves.' },
  merge:     { time:'O(n log n)',  space:'O(n)',      description:'Merge sort divides the array into halves, sorts each half recursively, then merges the sorted halves. It guarantees O(n log n) time in all cases.' },
  insertion: { time:'O(n²)',       space:'O(1)',      description:'Insertion sort builds the final sorted array one element at a time, inserting each element into its correct position relative to already-sorted elements.' },
  selection: { time:'O(n²)',       space:'O(1)',      description:'Selection sort divides the list into sorted and unsorted regions, repeatedly selecting the minimum from the unsorted region and appending it to the sorted region.' },
  heap:      { time:'O(n log n)',  space:'O(1)',      description:'Heap sort uses a binary heap data structure. It first builds a max-heap and then extracts the maximum element repeatedly to produce a sorted sequence.' },
  radix:     { time:'O(nk)',       space:'O(n + k)', description:'Radix sort is a non-comparative integer sorting algorithm that groups keys by individual digits. Very efficient when the range of digit values (k) is small.' },
  shell:     { time:'O(n log n)',  space:'O(1)',      description:'Shell sort generalises insertion sort by sorting elements far apart first, progressively reducing the gap. Much faster than insertion sort on average.' },
  binary:    { time:'O(log n)',    space:'O(1)',      description:'Binary search finds a target by repeatedly halving the search interval. Requires the array to be sorted. Very efficient for large datasets.' },
  linear:    { time:'O(n)',        space:'O(1)',      description:'Linear search checks each element sequentially from left to right until the target is found or the array is exhausted. Works on unsorted arrays.' },
};

/* ──────────────────────────────────────
   Initialisation
   ────────────────────────────────────── */
function init() {
  generateNewArray();
  updateSpeed();
  updateAlgorithmInfo();

  generateBtn.addEventListener('click', generateNewArray);

  arraySizeInput.addEventListener('change', () => {
    let v = parseInt(arraySizeInput.value, 10);
    if (isNaN(v) || v < 5)   v = 5;
    if (v > 100) v = 100;
    arraySizeInput.value = v;
    arraySize = v;
    generateNewArray();
  });

  speedSlider.addEventListener('input', updateSpeed);
  sortBtn.addEventListener('click', startSorting);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', reset);

  // Algorithm selector (click + keyboard)
  algoItems.forEach(item => {
    const handleSelect = () => {
      if (sorting) return;
      algoItems.forEach(i => { i.classList.remove('selected'); i.setAttribute('aria-pressed','false'); });
      item.classList.add('selected');
      item.setAttribute('aria-pressed','true');
      selectedAlgorithm = item.dataset.algo;
      updateAlgorithmInfo();
      if (selectedAlgorithm === 'binary') showBinaryModal();
      else if (selectedAlgorithm === 'linear') showLinearModal();
    };
    item.addEventListener('click', handleSelect);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(); } });
  });

  // Modal buttons
  if (startSearchBtn)  startSearchBtn.addEventListener('click',  startBinarySearch);
  if (cancelSearchBtn) cancelSearchBtn.addEventListener('click', hideBinaryModal);
  if (startLinearBtn)  startLinearBtn.addEventListener('click',  startLinearSearch);
  if (cancelLinearBtn) cancelLinearBtn.addEventListener('click', hideLinearModal);

  // Close modal on backdrop click
  [binaryModal, linearModal].forEach(m => {
    if (!m) return;
    const bd = m.querySelector('.modal-backdrop');
    if (bd) bd.addEventListener('click', () => { hideBinaryModal(); hideLinearModal(); });
  });

  // Enter key submits search modals
  if (searchValueInput)  searchValueInput.addEventListener('keydown',  e => { if (e.key === 'Enter') startBinarySearch(); });
  if (linearSearchInput) linearSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') startLinearSearch(); });

  // Responsive resize
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!sorting) { adjustContainerHeight(array.length); renderArray(); }
    }, 220);
  });
}

/* ──────────────────────────────────────
   Array container sizing
   ────────────────────────────────────── */
function adjustContainerHeight(count) {
  let desired = CONTAINER_BASE_HEIGHT;
  if (count > CONTAINER_THRESHOLD) {
    desired = CONTAINER_BASE_HEIGHT + (count - CONTAINER_THRESHOLD) * CONTAINER_EXTRA_PER_ITEM;
  }
  const capped = Math.min(CONTAINER_MAX_HEIGHT, desired);
  arrayContainer.style.minHeight = capped + 'px';
  arrayContainer.style.maxHeight = Math.min(CONTAINER_MAX_HEIGHT, Math.floor(window.innerHeight * 0.45)) + 'px';
  arrayContainer.style.height = 'auto';

  if (capped >= CONTAINER_MAX_HEIGHT && capIndicator) {
    capIndicator.classList.add('show');
    setTimeout(() => capIndicator.classList.remove('show'), 3000);
  }
}

/* ──────────────────────────────────────
   Generate & Render
   ────────────────────────────────────── */
function generateNewArray() {
  if (sorting) return; // prevent generating mid-sort
  sorting = false;
  paused  = false;
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }

  arraySize = parseInt(arraySizeInput.value, 10) || 30;
  adjustContainerHeight(arraySize);

  array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);

  resetStats();
  renderArray();
  if (arrayContainer) arrayContainer.scrollLeft = 0;
  setStatus('idle');
  hideResult();
}

function computeBarHeight(value) {
  const h = arrayContainer.clientHeight || 260;
  return Math.max(4, Math.round((value / 100) * (h * 0.88)));
}

function renderArray() {
  try {
    arrayContainer.innerHTML = '';
    if (!array || array.length === 0) return;

    const containerWidth = arrayContainer.clientWidth || 700;
    const gap = Math.max(2, Math.round(containerWidth * 0.003));
    const totalGap = gap * (array.length - 1);
    const rawWidth = Math.floor((containerWidth - totalGap - 32) / array.length);
    const barWidth = Math.max(3, Math.min(56, rawWidth));

    const inner = document.createElement('div');
    inner.className = 'bars-inner';
    inner.style.gap = `${gap}px`;

    array.forEach((value, i) => {
      const bar = document.createElement('div');
      bar.className = 'array-bar';
      bar.style.height = `${computeBarHeight(value)}px`;
      bar.style.width  = `${barWidth}px`;
      bar.title = `[${i}] = ${value}`;

      const label = document.createElement('span');
      label.className = 'bar-label';
      label.textContent = value;
      bar.appendChild(label);
      inner.appendChild(bar);
    });

    arrayContainer.appendChild(inner);

    // Index row — rendered after bars are in DOM to get accurate widths
    requestAnimationFrame(() => {
      if (!arrayContainer.contains(inner)) return;
      const indexRow = document.createElement('div');
      indexRow.className = 'bars-index';
      indexRow.style.gap = `${gap}px`;

      const bars = inner.querySelectorAll('.array-bar');
      bars.forEach((bar, i) => {
        const w = Math.max(1, Math.round(bar.getBoundingClientRect().width)) || barWidth;
        const idx = document.createElement('div');
        idx.className = 'index-item';
        idx.style.width = `${w}px`;
        // Only show every Nth index when bars are tiny to avoid clutter
        idx.textContent = (barWidth < 10 && i % 5 !== 0) ? '' : i;
        indexRow.appendChild(idx);
      });
      arrayContainer.appendChild(indexRow);
    });

  } catch (err) {
    console.error('renderArray error:', err);
  }
}

/* ──────────────────────────────────────
   Speed
   ────────────────────────────────────── */
function updateSpeed() {
  const v = parseInt(speedSlider.value, 10) || 50;
  const MIN_DELAY = 5, MAX_DELAY = 650;
  const t = (100 - v) / 99;
  speed = Math.round(MIN_DELAY + (MAX_DELAY - MIN_DELAY) * Math.pow(t, 2));

  if (speedValueEl) {
    let label = speed <= 20 ? 'Very fast' : speed <= 60 ? 'Fast' : speed <= 180 ? 'Normal' : speed <= 380 ? 'Slow' : 'Very slow';
    speedValueEl.textContent = label;
  }

  // Colour the filled portion of the track
  try {
    const min = parseInt(speedSlider.min, 10) || 1;
    const max = parseInt(speedSlider.max, 10) || 100;
    const pct = ((v - min) / (max - min)) * 100;
    speedSlider.style.background =
      `linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)`;
  } catch (_) {}
}

/* ──────────────────────────────────────
   Stats & Info
   ────────────────────────────────────── */
function resetStats() {
  comparisons = swaps = operations = 0;
  startTime = 0;
  updateStatUI(true);
}

function updateStatUI(force = false) {
  if (!force && !sorting) return;

  const elapsed = (startTime > 0) ? Math.floor(performance.now() - startTime) : 0;

  setStatValue(comparisonsEl, comparisons);
  setStatValue(swapsEl, swaps);
  setStatValue(operationsEl, operations);
  timeEl.textContent = `${elapsed}ms`;
}

function setStatValue(el, newVal) {
  if (!el) return;
  const prev = parseInt(el.textContent.replace(/[^\d]/g, ''), 10) || 0;
  el.textContent = newVal;
  if (newVal !== prev && newVal > 0) bumpAnim(el);
}

function bumpAnim(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
  el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
}

function updateAlgorithmInfo() {
  const info = algoInfo[selectedAlgorithm] || algoInfo.bubble;
  timeComplexityEl.textContent  = info.time;
  spaceComplexityEl.textContent = info.space;
  algoDescriptionEl.textContent = info.description;
  if (!sorting) resetStats();
}

/* ──────────────────────────────────────
   Status Chip
   ────────────────────────────────────── */
const STATUS_MAP = {
  idle:    { cls:'idle',    icon:'fa-circle',        text:'Ready' },
  running: { cls:'running', icon:'fa-spinner fa-spin', text:'Running' },
  paused:  { cls:'paused',  icon:'fa-pause-circle',  text:'Paused' },
  done:    { cls:'done',    icon:'fa-check-circle',  text:'Done' },
};

function setStatus(key) {
  if (!statusChip) return;
  const s = STATUS_MAP[key] || STATUS_MAP.idle;
  statusChip.className = `status-chip ${s.cls}`;
  statusChip.innerHTML = `<i class="fas ${s.icon}"></i> <span>${s.text}</span>`;
}

/* ──────────────────────────────────────
   Result Message
   ────────────────────────────────────── */
function showResult(msg, timeout = 4500, isError = false) {
  if (!resultMessageEl) return;
  resultMessageEl.textContent = msg;
  resultMessageEl.className = 'result-message show' + (isError ? ' error' : '');
  clearTimeout(resultMessageEl._timer);
  resultMessageEl._timer = setTimeout(() => hideResult(), timeout);
}

function hideResult() {
  if (!resultMessageEl) return;
  resultMessageEl.classList.remove('show', 'error');
}

/* ──────────────────────────────────────
   Sleep & Pause guard
   ────────────────────────────────────── */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.max(1, ms)));
}

async function checkPaused() {
  if (!sorting) throw new Error('sorting-aborted');
  while (paused) {
    if (!sorting) throw new Error('sorting-aborted');
    await sleep(50);
  }
}

/* ──────────────────────────────────────
   UI Locking helpers
   ────────────────────────────────────── */
function lockUI() {
  sorting = true;
  sortBtn.disabled = true;
  pauseBtn.disabled = false;
  generateBtn.disabled = true;
  arraySizeInput.disabled = true;
  algoItems.forEach(i => i.style.pointerEvents = 'none');
  setStatus('running');
}

function unlockUI() {
  sorting = false;
  paused  = false;
  sortBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Pause</span>';
  generateBtn.disabled = false;
  arraySizeInput.disabled = false;
  algoItems.forEach(i => i.style.pointerEvents = '');
}

function finishSorting() {
  unlockUI();
  // Record final elapsed time
  const elapsed = startTime > 0 ? Math.floor(performance.now() - startTime) : 0;
  timeEl.textContent = `${elapsed}ms`;
  setStatus('done');

  // Clean up search markers (do NOT remove "sorted" class)
  const bars = arrayContainer.querySelectorAll('.array-bar');
  bars.forEach(bar => bar.classList.remove('range','mid','low','high','active','fail'));
}

/* ──────────────────────────────────────
   Primitive visualisation helpers
   ────────────────────────────────────── */
function getBars() {
  return arrayContainer.querySelectorAll('.array-bar');
}

async function swap(i, j) {
  await checkPaused();
  const bars = getBars();
  if (!bars[i] || !bars[j]) return;

  bars[i].classList.add('highlight');
  bars[j].classList.add('highlight');

  [array[i], array[j]] = [array[j], array[i]];

  bars[i].style.height = `${computeBarHeight(array[i])}px`;
  bars[j].style.height = `${computeBarHeight(array[j])}px`;

  await sleep(speed);

  bars[i].classList.remove('highlight');
  bars[j].classList.remove('highlight');

  swaps++;
  operations++;
  updateStatUI();
}

async function compare(i, j) {
  await checkPaused();
  const bars = getBars();
  if (!bars[i] || !bars[j]) return;

  bars[i].classList.add('highlight');
  bars[j].classList.add('highlight');

  await sleep(speed);

  bars[i].classList.remove('highlight');
  bars[j].classList.remove('highlight');

  comparisons++;
  operations++;
  updateStatUI();
}

async function markPivot(index) {
  const bars = getBars();
  if (!bars[index]) return;
  bars[index].classList.add('pivot');
  await sleep(speed * 1.5);
  bars[index].classList.remove('pivot');
}

function markSorted(index) {
  const bars = getBars();
  if (bars[index]) bars[index].classList.add('sorted');
}

function markAllSorted() {
  getBars().forEach(b => b.classList.add('sorted'));
}

/* ──────────────────────────────────────
   Sort / Search — Start
   ────────────────────────────────────── */
function startSorting() {
  if (sorting || array.length === 0) return;

  if (selectedAlgorithm === 'binary') { showBinaryModal(); return; }
  if (selectedAlgorithm === 'linear') { showLinearModal(); return; }

  comparisons = swaps = operations = 0;
  startTime = performance.now();
  updateStatUI(true);
  hideResult();

  lockUI();

  const algoMap = {
    bubble:    bubbleSort,
    quick:     quickSort,
    merge:     mergeSort,
    insertion: insertionSort,
    selection: selectionSort,
    heap:      heapSort,
    radix:     radixSort,
    shell:     shellSort,
  };

  const fn = algoMap[selectedAlgorithm];
  if (!fn) { unlockUI(); return; }

  fn().catch(err => {
    if (err?.message !== 'sorting-aborted') console.error('Sorting error:', err);
    finishSorting();
  });
}

/* ──────────────────────────────────────
   Pause / Resume
   ────────────────────────────────────── */
function togglePause() {
  if (!sorting) return;
  paused = !paused;
  if (paused) {
    pauseBtn.innerHTML = '<i class="fas fa-play"></i> <span>Resume</span>';
    setStatus('paused');
  } else {
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Pause</span>';
    setStatus('running');
  }
}

/* ──────────────────────────────────────
   Reset
   ────────────────────────────────────── */
function reset() {
  sorting = false;
  paused  = false;
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }

  unlockUI();
  resetStats();
  hideResult();

  // Strip all colour classes
  getBars().forEach(bar =>
    bar.classList.remove('highlight','sorted','pivot','range','mid','found','low','high','active','fail')
  );
  setStatus('idle');
}

/* ═══════════════════════════════════════════
   SORTING ALGORITHMS
   ═══════════════════════════════════════════ */

/* ── Bubble Sort ── */
async function bubbleSort() {
  const len = array.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      await compare(j, j + 1);
      if (array[j] > array[j + 1]) await swap(j, j + 1);
    }
    markSorted(len - i - 1);
  }
  markAllSorted();
  finishSorting();
}

/* ── Quick Sort ── */
async function quickSort() {
  await quickSortHelper(0, array.length - 1);
  markAllSorted();
  finishSorting();
}

async function quickSortHelper(low, high) {
  if (low < high) {
    await checkPaused();
    const p = await partition(low, high);
    await quickSortHelper(low, p - 1);
    await quickSortHelper(p + 1, high);
  } else if (low === high) {
    markSorted(low);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  await markPivot(high);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    await compare(j, high);
    if (array[j] < pivot) {
      i++;
      if (i !== j) await swap(i, j);
    }
  }
  if (i + 1 !== high) await swap(i + 1, high);
  markSorted(i + 1);
  return i + 1;
}

/* ── Merge Sort ── */
async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
  markAllSorted();
  finishSorting();
}

async function mergeSortHelper(low, high) {
  if (low < high) {
    await checkPaused();
    const mid = Math.floor((low + high) / 2);
    await mergeSortHelper(low, mid);
    await mergeSortHelper(mid + 1, high);
    await merge(low, mid, high);
  }
}

async function merge(low, mid, high) {
  const left  = array.slice(low, mid + 1);
  const right = array.slice(mid + 1, high + 1);
  let i = 0, j = 0, k = low;

  while (i < left.length && j < right.length) {
    await checkPaused();
    comparisons++;
    operations++;
    updateStatUI();

    if (left[i] <= right[j]) { array[k] = left[i]; i++; }
    else                      { array[k] = right[j]; j++; }

    const bars = getBars();
    if (bars[k]) {
      bars[k].style.height = `${computeBarHeight(array[k])}px`;
      bars[k].classList.add('highlight');
      await sleep(speed);
      bars[k].classList.remove('highlight');
    }
    k++;
  }
  while (i < left.length) {
    await checkPaused();
    array[k] = left[i];
    const bars = getBars();
    if (bars[k]) {
      bars[k].style.height = `${computeBarHeight(array[k])}px`;
      bars[k].classList.add('highlight');
      await sleep(speed);
      bars[k].classList.remove('highlight');
    }
    i++; k++; operations++; updateStatUI();
  }
  while (j < right.length) {
    await checkPaused();
    array[k] = right[j];
    const bars = getBars();
    if (bars[k]) {
      bars[k].style.height = `${computeBarHeight(array[k])}px`;
      bars[k].classList.add('highlight');
      await sleep(speed);
      bars[k].classList.remove('highlight');
    }
    j++; k++; operations++; updateStatUI();
  }
  for (let x = low; x <= high; x++) markSorted(x);
}

/* ── Insertion Sort ── */
async function insertionSort() {
  const len = array.length;
  markSorted(0);
  for (let i = 1; i < len; i++) {
    let j = i;
    while (j > 0 && array[j] < array[j - 1]) {
      await compare(j, j - 1);
      await swap(j, j - 1);
      j--;
    }
    markSorted(i);
  }
  markAllSorted();
  finishSorting();
}

/* ── Selection Sort ── */
async function selectionSort() {
  const len = array.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    const bars = getBars();
    if (bars[minIndex]) bars[minIndex].classList.add('pivot');

    for (let j = i + 1; j < len; j++) {
      await compare(minIndex, j);
      if (array[j] < array[minIndex]) {
        if (bars[minIndex]) bars[minIndex].classList.remove('pivot');
        minIndex = j;
        const freshBars = getBars();
        if (freshBars[minIndex]) freshBars[minIndex].classList.add('pivot');
        await sleep(speed * 0.5);
      }
    }
    if (minIndex !== i) await swap(i, minIndex);
    const freshBars = getBars();
    if (freshBars[minIndex]) freshBars[minIndex].classList.remove('pivot');
    markSorted(i);
  }
  markAllSorted();
  finishSorting();
}

/* ── Heap Sort ── */
async function heapSort() {
  const len = array.length;
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await checkPaused();
    await heapify(len, i);
  }
  for (let i = len - 1; i > 0; i--) {
    await checkPaused();
    await swap(0, i);
    markSorted(i);
    await heapify(i, 0);
  }
  markSorted(0);
  finishSorting();
}

async function heapify(n, i) {
  let largest = i;
  const left  = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    await compare(largest, left);
    if (array[left] > array[largest]) largest = left;
  }
  if (right < n) {
    await compare(largest, right);
    if (array[right] > array[largest]) largest = right;
  }
  if (largest !== i) {
    await swap(i, largest);
    await heapify(n, largest);
  }
}

/* ── Radix Sort ── */
async function radixSort() {
  const max = Math.max(...array);
  const len = array.length;

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await checkPaused();

    const output = new Array(len);
    const count  = new Array(10).fill(0);

    for (let i = 0; i < len; i++) count[Math.floor(array[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = len - 1; i >= 0; i--) {
      await checkPaused();
      const digit = Math.floor(array[i] / exp) % 10;
      output[count[digit] - 1] = array[i];
      count[digit]--;

      const bars = getBars();
      if (bars[i]) {
        bars[i].classList.add('highlight');
        await sleep(speed * 0.4);
        bars[i].classList.remove('highlight');
      }
    }

    for (let i = 0; i < len; i++) {
      await checkPaused();
      array[i] = output[i];
      const bars = getBars();
      if (bars[i]) {
        bars[i].style.height = `${computeBarHeight(array[i])}px`;
        bars[i].classList.add('highlight');
        await sleep(speed * 0.4);
        bars[i].classList.remove('highlight');
      }
      operations++;
      updateStatUI();
    }
  }
  markAllSorted();
  finishSorting();
}

/* ── Shell Sort ── */
async function shellSort() {
  const len = array.length;
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      await checkPaused();
      const temp = array[i];
      const bars = getBars();
      if (bars[i]) bars[i].classList.add('highlight');
      await sleep(speed * 0.5);

      let j = i;
      while (j >= gap && array[j - gap] > temp) {
        await checkPaused();
        await compare(j, j - gap);
        array[j] = array[j - gap];
        const freshBars = getBars();
        if (freshBars[j]) {
          freshBars[j].style.height = `${computeBarHeight(array[j])}px`;
          freshBars[j].classList.add('pivot');
          await sleep(speed * 0.5);
          freshBars[j].classList.remove('pivot');
        }
        j -= gap;
      }
      array[j] = temp;
      const freshBars = getBars();
      if (freshBars[j]) freshBars[j].style.height = `${computeBarHeight(array[j])}px`;
      if (freshBars[i]) freshBars[i].classList.remove('highlight');
      swaps++;
      operations++;
      updateStatUI();
    }
  }
  markAllSorted();
  finishSorting();
}

/* ═══════════════════════════════════════════
   BINARY SEARCH
   ═══════════════════════════════════════════ */
function showBinaryModal() {
  if (!binaryModal) return;
  binaryModal.classList.add('open');
  binaryModal.setAttribute('aria-hidden', 'false');
  if (searchValueInput) { searchValueInput.value = ''; setTimeout(() => searchValueInput.focus(), 80); }
}

function hideBinaryModal() {
  if (!binaryModal) return;
  binaryModal.classList.remove('open');
  binaryModal.setAttribute('aria-hidden', 'true');
}

function startBinarySearch() {
  if (!searchValueInput) return;
  const v = parseInt(searchValueInput.value, 10);
  if (isNaN(v)) { showResult('Please enter a valid number', 2500, true); return; }
  hideBinaryModal();
  runBinarySearch(v);
}

async function runBinarySearch(target) {
  if (sorting) return;
  comparisons = swaps = operations = 0;
  startTime = performance.now();
  updateStatUI(true);
  hideResult();
  lockUI();

  try {
    // Sort silently
    array.sort((a, b) => a - b);
    renderArray();
    await sleep(200);

    let low = 0, high = array.length - 1;
    while (low <= high) {
      await checkPaused();
      const mid = Math.floor((low + high) / 2);
      const bars = getBars();

      bars.forEach(b => b.classList.remove('range','mid','low','high','found'));
      for (let k = low; k <= high; k++) if (bars[k]) bars[k].classList.add('range');
      if (bars[low])  bars[low].classList.add('low');
      if (bars[high]) bars[high].classList.add('high');
      if (bars[mid])  bars[mid].classList.add('mid');

      try {
        bars[mid]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (_) {}

      await sleep(Math.max(80, speed));
      comparisons++; operations++;
      updateStatUI();

      if (array[mid] === target) {
        bars.forEach(b => b.classList.remove('range','mid','low','high'));
        if (bars[mid]) bars[mid].classList.add('found');
        showResult(`✅ Found ${target} at index ${mid}`);
        finishSorting();
        return;
      } else if (array[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    showResult(`❌ ${target} not found in array`, 4500, true);
  } catch (err) {
    if (err?.message !== 'sorting-aborted') console.error('Binary search error:', err);
  }
  finishSorting();
}

/* ═══════════════════════════════════════════
   LINEAR SEARCH
   ═══════════════════════════════════════════ */
function showLinearModal() {
  if (!linearModal) return;
  linearModal.classList.add('open');
  linearModal.setAttribute('aria-hidden', 'false');
  if (linearSearchInput) { linearSearchInput.value = ''; setTimeout(() => linearSearchInput.focus(), 80); }
}

function hideLinearModal() {
  if (!linearModal) return;
  linearModal.classList.remove('open');
  linearModal.setAttribute('aria-hidden', 'true');
}

function startLinearSearch() {
  if (!linearSearchInput) return;
  const v = parseInt(linearSearchInput.value, 10);
  if (isNaN(v)) { showResult('Please enter a valid number', 2500, true); return; }
  hideLinearModal();
  runLinearSearch(v);
}

async function runLinearSearch(target) {
  if (sorting) return;
  comparisons = swaps = operations = 0;
  startTime = performance.now();
  updateStatUI(true);
  hideResult();
  lockUI();

  try {
    const bars = getBars();
    for (let i = 0; i < array.length; i++) {
      await checkPaused();

      bars.forEach(b => b.classList.remove('active','fail','found'));
      if (bars[i]) bars[i].classList.add('active');

      try { bars[i]?.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); } catch (_) {}

      await sleep(Math.max(80, speed));
      comparisons++; operations++;
      updateStatUI();

      if (array[i] === target) {
        if (bars[i]) { bars[i].classList.remove('active'); bars[i].classList.add('found'); }
        showResult(`✅ Found ${target} at index ${i}`);
        finishSorting();
        return;
      } else {
        if (bars[i]) { bars[i].classList.remove('active'); bars[i].classList.add('fail'); }
      }
    }
    showResult(`❌ ${target} not found in array`, 4500, true);
  } catch (err) {
    if (err?.message !== 'sorting-aborted') console.error('Linear search error:', err);
  }
  finishSorting();
}

/* ──────────────────────────────────────
   Bootstrap
   ────────────────────────────────────── */
init();
