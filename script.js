// DOM Elements
const arrayContainer = document.getElementById("array-container");
const generateBtn = document.getElementById("generate-array");
const arraySizeInput = document.getElementById("array-size");
const speedSlider = document.getElementById("speed-slider");
const speedValueEl = document.getElementById("speed-value");
const sortBtn = document.getElementById("sort-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const algoItems = document.querySelectorAll(".algo-item");
const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");
const timeEl = document.getElementById("time");
const operationsEl = document.getElementById("operations");
const timeComplexityEl = document.getElementById("time-complexity");
const spaceComplexityEl = document.getElementById("space-complexity");
const algoDescriptionEl = document.getElementById("algo-description");

// Global variables
let array = [];
let arraySize = parseInt(arraySizeInput.value);
let sorting = false;
let paused = false;
let selectedAlgorithm = "bubble";
let speed = 200;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let operations = 0;
let animationId = null;
let resizeTimeout = null;
// Configuration for container sizing
const CONTAINER_BASE_HEIGHT = 260; // px for small arrays
const CONTAINER_THRESHOLD = 40; // number of bars before growing
const CONTAINER_EXTRA_PER_ITEM = 4; // px added per extra item above threshold
const CONTAINER_MAX_HEIGHT = 800; // cap

const capIndicator = document.getElementById("height-cap-indicator");
let algoInfo = {
  bubble: {
    time: "O(n²)",
    space: "O(1)",
    description:
      "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  },
  quick: {
    time: "O(n log n)",
    space: "O(log n)",
    description:
      'Quick sort is a divide-and-conquer algorithm that works by selecting a "pivot" element and partitioning the array around the pivot.',
  },
  merge: {
    time: "O(n log n)",
    space: "O(n)",
    description:
      "Merge sort is a divide-and-conquer algorithm that divides the input array into two halves, sorts them, and then merges the sorted halves.",
  },
  insertion: {
    time: "O(n²)",
    space: "O(1)",
    description:
      "Insertion sort builds the final sorted array one item at a time by inserting each element into its correct position.",
  },
  selection: {
    time: "O(n²)",
    space: "O(1)",
    description:
      "Selection sort divides the input list into a sorted and an unsorted region, repeatedly selecting the smallest element from the unsorted region.",
  },
  heap: {
    time: "O(n log n)",
    space: "O(1)",
    description:
      "Heap sort uses a binary heap data structure to sort elements by building a heap and repeatedly extracting the maximum element.",
  },
  radix: {
    time: "O(nk)",
    space: "O(n+k)",
    description:
      "Radix sort is a non-comparative sorting algorithm that sorts numbers by processing individual digits.",
  },
  shell: {
    time: "O(n log n)",
    space: "O(1)",
    description:
      "Shell sort is an optimization of insertion sort that allows the exchange of items that are far apart by using a gap sequence.",
  },
  binary: {
    time: "O(log n)",
    space: "O(1)",
    description:
      "Binary Search finds an element by repeatedly dividing the search interval in half. Requires a sorted array.",
  },
  linear: {
    time: "O(n)",
    space: "O(1)",
    description:
      "Linear Search checks each element sequentially until the target is found.",
  },
};

// Binary search modal & result elements
const binaryModal = document.getElementById("binarySearchModal");
const searchValueInput = document.getElementById("searchValue");
const startSearchBtn = document.getElementById("startSearch");
const cancelSearchBtn = document.getElementById("cancelSearch");
const resultMessageEl = document.getElementById("resultMessage");
// Linear search modal elements
const linearModal = document.getElementById("linearSearchModal");
const linearSearchInput = document.getElementById("linearSearchValue");
const startLinearBtn = document.getElementById("startLinearSearch");
const cancelLinearBtn = document.getElementById("cancelLinearSearch");

// Initialize
function init() {
  generateNewArray();
  updateSpeed();
  updateAlgorithmInfo();

  // Event Listeners
  generateBtn.addEventListener("click", generateNewArray);
  arraySizeInput.addEventListener("change", () => {
    arraySize = parseInt(arraySizeInput.value);
    if (arraySize < 5) arraySize = 5;
    if (arraySize > 100) arraySize = 100;
    arraySizeInput.value = arraySize;
    generateNewArray();
  });
  speedSlider.addEventListener("input", updateSpeed);
  sortBtn.addEventListener("click", startSorting);
  pauseBtn.addEventListener("click", togglePause);
  resetBtn.addEventListener("click", reset);

  algoItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!sorting) {
        algoItems.forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        selectedAlgorithm = item.dataset.algo;
        updateAlgorithmInfo();
        // If user selected Binary or Linear Search, prompt for the target value
        if (selectedAlgorithm === "binary") {
          // show modal only when not currently sorting
          if (!sorting) showBinaryModal();
        } else if (selectedAlgorithm === "linear") {
          if (!sorting) showLinearModal();
        }
      }
    });
  });

  // Modal buttons (if present in DOM)
  if (startSearchBtn)
    startSearchBtn.addEventListener("click", () => startBinarySearch());
  if (cancelSearchBtn)
    cancelSearchBtn.addEventListener("click", () => hideBinaryModal());
  // Linear modal buttons
  if (startLinearBtn)
    startLinearBtn.addEventListener("click", () => startLinearSearch());
  if (cancelLinearBtn)
    cancelLinearBtn.addEventListener("click", () => hideLinearModal());

  // Add window resize handler
  window.addEventListener("resize", () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      if (!sorting) {
        // Reflow bars to new container size without regenerating values
        adjustContainerHeight(array.length);
        renderArray();
      }
    }, 250);
  });
}

// Get maximum height for bars based on container height
function getMaxHeight() {
  const containerHeight = arrayContainer.clientHeight || 300;
  return Math.floor(containerHeight * 0.9); // Use 90% of container height for bars
}

// Compute the display height (pixels) for a given array value.
function computeBarHeight(value) {
  const containerHeight = arrayContainer.clientHeight || 300;
  const maxVal = 100; // fixed scale 1..100
  // scale value to 90% of container height
  return Math.max(4, Math.round((value / maxVal) * (containerHeight * 0.9)));
}

// Adjust the container height based on number of bars so visualization
// remains readable. Keeps within reasonable bounds.
function adjustContainerHeight(count) {
  let desired = CONTAINER_BASE_HEIGHT;
  if (count > CONTAINER_THRESHOLD) {
    desired =
      CONTAINER_BASE_HEIGHT +
      (count - CONTAINER_THRESHOLD) * CONTAINER_EXTRA_PER_ITEM;
  }
  const capped = Math.min(CONTAINER_MAX_HEIGHT, desired);
  // Use minHeight so the container can grow/shrink naturally inside its parent
  arrayContainer.style.minHeight = capped + "px";
  arrayContainer.style.maxHeight = CONTAINER_MAX_HEIGHT + "px";
  // allow natural height otherwise
  arrayContainer.style.height = "auto";

  // Show cap indicator briefly when we hit the maximum
  if (capped >= CONTAINER_MAX_HEIGHT && capIndicator) {
    capIndicator.classList.add("show");
    setTimeout(() => capIndicator.classList.remove("show"), 3000);
  }
}

// Generate new random array
function generateNewArray() {
  // Reset visual state but keep arraySize
  sorting = false;
  paused = false;
  comparisons = 0;
  swaps = 0;
  operations = 0;
  startTime = 0;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Adjust container height to fit array size nicely
  adjustContainerHeight(arraySize);

  // Generate array values scaled to container height
  array = [];
  // Values now in fixed range 1..100 (duplicates allowed)
  for (let i = 0; i < arraySize; i++) {
    const value = Math.floor(Math.random() * 100) + 1; // 1..100
    array.push(value);
  }

  resetStats();
  // Reset horizontal scroll to start
  renderArray();
  if (arrayContainer) arrayContainer.scrollLeft = 0;
}

// Render array as bars
function renderArray() {
  try {
    arrayContainer.innerHTML = "";
    if (!array || array.length === 0) return;

    const containerWidth = arrayContainer.clientWidth || 800;
    const containerHeight = arrayContainer.clientHeight || 300;
    const gap = Math.max(1, Math.round(containerWidth * 0.002));
    const totalGap = gap * (array.length - 1);
    const rawWidth = Math.floor((containerWidth - totalGap) / array.length);
    const minWidth = 2;
    const maxWidth = 60;
    const barWidth = Math.max(minWidth, Math.min(maxWidth, rawWidth));

    const maxVal = Math.max(...array);

    // Create an inner wrapper so the outer container (which scrolls)
    // places the horizontal scrollbar below the bars.
    const inner = document.createElement("div");
    inner.className = "bars-inner";
    inner.style.display = "flex";
    inner.style.alignItems = "flex-end";
    inner.style.gap = `${gap}px`;

    array.forEach((value, i) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";
      const height = computeBarHeight(value);
      bar.style.height = `${height}px`;
      bar.style.width = `${barWidth}px`;
      // Add a small label shown on hover; always set title for accessibility
      const label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = value;
      bar.title = `${value}`;
      bar.appendChild(label);
      inner.appendChild(bar);
    });

    // Append the inner wrapper first so we can measure the real bar widths
    arrayContainer.appendChild(inner);

    // Create an index row to sit below the bars and align with them.
    // Use the measured widths of the rendered bars to ensure pixel-perfect alignment,
    // which fixes misalignment issues when there are only a few bars (e.g. < 30).
    const indexRow = document.createElement("div");
    indexRow.className = "bars-index";
    indexRow.style.display = "flex";
    indexRow.style.gap = `${gap}px`;
    indexRow.style.marginTop = "8px";

    // Measure each bar after it's in the DOM and create a matching index item
    const bars = inner.querySelectorAll(".array-bar");
    bars.forEach((bar, i) => {
      const rect = bar.getBoundingClientRect();
      // Fallback to the computed style width when bounding rect width is 0
      const measuredWidth = Math.max(1, Math.round(rect.width)) || barWidth;

      const idx = document.createElement("div");
      idx.className = "index-item";
      idx.style.width = `${measuredWidth}px`;
      idx.style.textAlign = "center";
      idx.style.fontSize = "0.8rem";
      idx.style.color = "var(--dark)";
      idx.textContent = i; // keep 0-based index for now
      indexRow.appendChild(idx);
    });

    // Append the index row after the bars so both rows scroll together
    arrayContainer.appendChild(indexRow);
  } catch (err) {
    console.error("renderArray error:", err);
  }
}

// Update animation speed
function updateSpeed() {
  const v = parseInt(speedSlider.value, 10) || 50;
  // Non-linear mapping for better control: slider -> delay (ms)
  const MIN_DELAY = 5; // fastest
  const MAX_DELAY = 600; // slowest
  const t = (100 - v) / 99; // 0..1 where higher slider => faster (smaller delay)
  // quadratic easing for finer control at the fast end
  speed = Math.round(MIN_DELAY + (MAX_DELAY - MIN_DELAY) * Math.pow(t, 2));

  // Update textual display next to slider
  if (speedValueEl) {
    let label = "";
    if (speed <= 20) label = "Very fast";
    else if (speed <= 60) label = "Fast";
    else if (speed <= 180) label = "Normal";
    else if (speed <= 350) label = "Slow";
    else label = "Very slow";
    speedValueEl.textContent = `${label} — ${speed}ms`;
  }

  // Update slider appearance (fill to value)
  try {
    const min = parseInt(speedSlider.min || 1, 10);
    const max = parseInt(speedSlider.max || 100, 10);
    const pct = ((v - min) / (max - min)) * 100;
    speedSlider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, #e0e0e0 ${pct}%)`;
  } catch (e) {
    // ignore styling errors
  }
}

// Update algorithm info
// Utility function for performance monitoring
function updateStats(forceUpdate = false) {
  if (!sorting && !forceUpdate) return;

  const currentTime = performance.now();
  const timeElapsed = Math.floor(currentTime - startTime);

  timeEl.textContent = `${timeElapsed}ms`;
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
  operationsEl.textContent = operations;
}

// Reset the stats counters and UI
function resetStats() {
  comparisons = 0;
  swaps = 0;
  operations = 0;
  startTime = 0;
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
  operationsEl.textContent = operations;
  timeEl.textContent = `0ms`;
}

function updateAlgorithmInfo() {
  const info = algoInfo[selectedAlgorithm];
  timeComplexityEl.textContent = info.time;
  spaceComplexityEl.textContent = info.space;
  algoDescriptionEl.textContent = info.description;

  // Reset stats when changing algorithms
  if (!sorting) {
    resetStats();
    updateStats(true);
  }
}

/* Binary Search UI helpers and visualization */
function showBinaryModal() {
  if (!binaryModal) return;
  binaryModal.classList.add("open");
  binaryModal.setAttribute("aria-hidden", "false");
  if (searchValueInput) {
    searchValueInput.value = "";
    setTimeout(() => searchValueInput.focus(), 80);
  }
}

function hideBinaryModal() {
  if (!binaryModal) return;
  binaryModal.classList.remove("open");
  binaryModal.setAttribute("aria-hidden", "true");
}

function showResult(msg, timeout = 4000) {
  if (!resultMessageEl) return;
  resultMessageEl.textContent = msg;
  resultMessageEl.classList.add("show");
  setTimeout(() => {
    resultMessageEl.classList.remove("show");
  }, timeout);
}

function startBinarySearch() {
  if (!searchValueInput) return;
  const v = parseInt(searchValueInput.value, 10);
  if (Number.isNaN(v)) {
    showResult("Please enter a valid number", 2000);
    return;
  }
  hideBinaryModal();
  startBinarySearchRun(v);
}

async function startBinarySearchRun(target) {
  if (sorting) return;

  // Prepare UI similar to startSorting
  comparisons = 0;
  swaps = 0;
  operations = 0;
  startTime = performance.now();
  updateStats();

  sorting = true;
  sortBtn.disabled = true;
  pauseBtn.disabled = false;
  generateBtn.disabled = true;
  arraySizeInput.disabled = true;

  try {
    await binarySearchVisual(target);
  } catch (err) {
    if (err && err.message === "sorting-aborted") {
      // User cancelled or reset
    } else {
      console.error("Binary search error:", err);
    }
  } finally {
    finishSorting();
  }
}

async function binarySearchVisual(target) {
  if (!array || array.length === 0) {
    showResult("Array is empty", 2000);
    return;
  }

  // Ensure array is sorted (silent, non-animated) for binary search
  array.sort((a, b) => a - b);
  renderArray();

  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    await checkPaused();

    const mid = Math.floor((low + high) / 2);
    const bars = arrayContainer.querySelectorAll(".array-bar");

    // Clear previous markers
    bars.forEach((b) =>
      b.classList.remove("range", "mid", "found", "low", "high")
    );

    // Mark current search range
    for (let k = low; k <= high; k++) {
      if (bars[k]) bars[k].classList.add("range");
    }

    // Mark low/high/mid visually
    if (bars[low]) bars[low].classList.add("low");
    if (bars[high]) bars[high].classList.add("high");
    if (bars[mid]) bars[mid].classList.add("mid");

    // Ensure mid is visible in the scroller
    try {
      if (bars[mid] && typeof bars[mid].scrollIntoView === "function") {
        bars[mid].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    } catch (e) {
      // ignore scroll errors
    }

    // Wait to show step
    await sleep(Math.max(80, speed));

    comparisons++;
    operations++;
    updateStats();

    if (array[mid] === target) {
      if (bars[mid]) {
        bars[mid].classList.remove("mid", "range");
        bars[mid].classList.add("found");
      }
      showResult(`Element ${target} found at index ${mid} ✅`, 5000);
      return;
    } else if (array[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  showResult(`Element ${target} not found ❌`, 4000);
}

/* Linear Search UI helpers and visualization */
function showLinearModal() {
  if (!linearModal) return;
  linearModal.classList.add("open");
  linearModal.setAttribute("aria-hidden", "false");
  if (linearSearchInput) {
    linearSearchInput.value = "";
    setTimeout(() => linearSearchInput.focus(), 80);
  }
}

function hideLinearModal() {
  if (!linearModal) return;
  linearModal.classList.remove("open");
  linearModal.setAttribute("aria-hidden", "true");
}

function startLinearSearch() {
  if (!linearSearchInput) return;
  const v = parseInt(linearSearchInput.value, 10);
  if (Number.isNaN(v)) {
    showResult("Please enter a valid number", 2000);
    return;
  }
  hideLinearModal();
  startLinearSearchRun(v);
}

async function startLinearSearchRun(target) {
  if (sorting) return;

  // Prepare UI like other runs
  comparisons = 0;
  swaps = 0;
  operations = 0;
  startTime = performance.now();
  updateStats();

  sorting = true;
  sortBtn.disabled = true;
  pauseBtn.disabled = false;
  generateBtn.disabled = true;
  arraySizeInput.disabled = true;

  try {
    await linearSearchVisual(target);
  } catch (err) {
    if (err && err.message === "sorting-aborted") {
      // cancelled
    } else {
      console.error("Linear search error:", err);
    }
  } finally {
    finishSorting();
  }
}

async function linearSearchVisual(target) {
  if (!array || array.length === 0) {
    showResult("Array is empty", 2000);
    return;
  }

  const bars = arrayContainer.querySelectorAll(".array-bar");

  for (let i = 0; i < array.length; i++) {
    await checkPaused();

    // highlight current
    bars.forEach((b) => b.classList.remove("active", "fail", "found"));
    if (bars[i]) bars[i].classList.add("active");

    // ensure visible
    try {
      if (bars[i] && typeof bars[i].scrollIntoView === "function") {
        bars[i].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    } catch (e) {}

    await sleep(Math.max(80, speed));

    comparisons++;
    operations++;
    updateStats();

    if (array[i] === target) {
      if (bars[i]) {
        bars[i].classList.remove("active");
        bars[i].classList.add("found");
      }
      showResult(`Element ${target} found at index ${i} ✅`, 5000);
      return;
    } else {
      if (bars[i]) {
        bars[i].classList.remove("active");
        bars[i].classList.add("fail");
      }
    }
  }

  showResult(`Element ${target} not found ❌`, 4000);
}

// Start sorting process
function startSorting() {
  if (sorting || array.length === 0) return;

  // If binary or linear search is selected, prompt for the search value instead of starting a sort
  if (selectedAlgorithm === "binary") {
    showBinaryModal();
    return;
  }
  if (selectedAlgorithm === "linear") {
    showLinearModal();
    return;
  }

  // Reset stats
  comparisons = 0;
  swaps = 0;
  operations = 0;
  startTime = performance.now();
  updateStats();

  sorting = true;
  sortBtn.disabled = true;
  pauseBtn.disabled = false;
  generateBtn.disabled = true;
  arraySizeInput.disabled = true;

  // Start selected algorithm
  let algoPromise;
  switch (selectedAlgorithm) {
    case "bubble":
      algoPromise = bubbleSort();
      break;
    case "quick":
      algoPromise = quickSort();
      break;
    case "merge":
      algoPromise = mergeSort();
      break;
    case "insertion":
      algoPromise = insertionSort();
      break;
    case "selection":
      algoPromise = selectionSort();
      break;
    case "heap":
      algoPromise = heapSort();
      break;
    case "radix":
      algoPromise = radixSort();
      break;
    case "shell":
      algoPromise = shellSort();
      break;
  }

  if (algoPromise && typeof algoPromise.then === "function") {
    algoPromise.catch((err) => {
      if (err && err.message === "sorting-aborted") {
        // Clean up UI when user cancelled the run
        finishSorting();
      } else {
        console.error("Sorting error:", err);
        // Ensure UI isn't left blocked
        finishSorting();
      }
    });
  }
}

// Toggle pause
function togglePause() {
  // Only allow pausing when a sort is active
  if (!sorting) return;

  paused = !paused;
  if (paused) {
    pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    // keep sortBtn disabled while paused
    sortBtn.disabled = true;
    // keep generate disabled while paused to avoid mid-run changes
    generateBtn.disabled = true;
  } else {
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    // allow UI to remain locked while sorting
    sortBtn.disabled = true;
    generateBtn.disabled = true;
  }
  // When paused, the running async algorithms will wait. When resumed,
  // they continue automatically because we await checkPaused() in async loops.
}

// Reset everything
function reset() {
  sorting = false;
  paused = false;
  comparisons = 0;
  swaps = 0;
  operations = 0;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  updateStats();

  sortBtn.disabled = false;
  pauseBtn.disabled = true;
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  generateBtn.disabled = false;
  arraySizeInput.disabled = false;

  // Remove highlights
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => {
    bar.classList.remove(
      "highlight",
      "sorted",
      "pivot",
      "range",
      "mid",
      "found",
      "low",
      "high",
      "active",
      "fail"
    );
  });
}

// (Duplicate updateStats removed — consolidated above)

// Swap two elements in the array
async function swap(i, j) {
  await checkPaused();
  // Visualize swap
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars[i].classList.add("highlight");
  bars[j].classList.add("highlight");

  // Swap values
  [array[i], array[j]] = [array[j], array[i]];

  // Update heights
  bars[i].style.height = `${computeBarHeight(array[i])}px`;
  bars[j].style.height = `${computeBarHeight(array[j])}px`;

  // Wait for animation
  await sleep(speed);

  // Remove highlight
  bars[i].classList.remove("highlight");
  bars[j].classList.remove("highlight");

  swaps++;
  operations++;
  updateStats();
}

// Compare two elements (visualize without swapping)
async function compare(i, j) {
  await checkPaused();
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars[i].classList.add("highlight");
  bars[j].classList.add("highlight");

  // Wait for animation
  await sleep(speed);

  // Remove highlight
  bars[i].classList.remove("highlight");
  bars[j].classList.remove("highlight");

  comparisons++;
  operations++;
  updateStats();
}

// Mark an element as pivot
async function markPivot(index) {
  await checkPaused();
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars[index].classList.add("pivot");

  await sleep(speed * 2);

  bars[index].classList.remove("pivot");
}

// Mark an element as sorted
function markSorted(index) {
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars[index].classList.add("sorted");
}

// Sleep function for animation
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wait while paused — used to implement cooperative pause/resume without
// cancelling the current sorting run.
async function checkPaused() {
  // If sorting has been cancelled, throw so algorithms can abort.
  if (!sorting) throw new Error("sorting-aborted");
  while (paused) {
    if (!sorting) throw new Error("sorting-aborted");
    await sleep(50);
  }
}

// Sorting Algorithms
async function bubbleSort() {
  const len = array.length;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      await checkPaused();

      // Visualize comparison
      await compare(j, j + 1);

      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }
    markSorted(len - i - 1);
  }

  // Mark all sorted
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => bar.classList.add("sorted"));

  finishSorting();
}

async function quickSort() {
  await quickSortHelper(0, array.length - 1);

  // Mark all sorted
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => bar.classList.add("sorted"));

  finishSorting();
}

async function quickSortHelper(low, high) {
  if (low < high) {
    await checkPaused();

    const pivotIndex = await partition(low, high);
    await quickSortHelper(low, pivotIndex - 1);
    await quickSortHelper(pivotIndex + 1, high);
  } else if (low === high) {
    markSorted(low);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  await markPivot(high);

  let i = low - 1;

  for (let j = low; j < high; j++) {
    await checkPaused();

    await compare(j, high);

    if (array[j] < pivot) {
      i++;
      if (i !== j) {
        await swap(i, j);
      }
    }
  }

  if (i + 1 !== high) {
    await swap(i + 1, high);
  }

  markSorted(i + 1);
  return i + 1;
}

async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);

  // Mark all sorted
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => bar.classList.add("sorted"));

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
  const left = array.slice(low, mid + 1);
  const right = array.slice(mid + 1, high + 1);

  let i = 0,
    j = 0,
    k = low;

  while (i < left.length && j < right.length) {
    await checkPaused();

    await compare(low + i, mid + 1 + j);

    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }

    // Visualize the change
    const bars = arrayContainer.querySelectorAll(".array-bar");
    bars[k].style.height = `${computeBarHeight(array[k])}px`;
    bars[k].classList.add("highlight");

    await sleep(speed);
    bars[k].classList.remove("highlight");

    k++;
    operations++;
    updateStats();
  }

  while (i < left.length) {
    array[k] = left[i];

    const bars = arrayContainer.querySelectorAll(".array-bar");
    bars[k].style.height = `${computeBarHeight(array[k])}px`;
    bars[k].classList.add("highlight");

    await sleep(speed);
    bars[k].classList.remove("highlight");

    i++;
    k++;
    operations++;
    updateStats();
  }

  while (j < right.length) {
    array[k] = right[j];

    const bars = arrayContainer.querySelectorAll(".array-bar");
    bars[k].style.height = `${computeBarHeight(array[k])}px`;
    bars[k].classList.add("highlight");

    await sleep(speed);
    bars[k].classList.remove("highlight");

    j++;
    k++;
    operations++;
    updateStats();
  }

  // Mark merged section as sorted
  for (let i = low; i <= high; i++) {
    markSorted(i);
  }
}

async function insertionSort() {
  const len = array.length;

  for (let i = 1; i < len; i++) {
    let j = i;

    while (j > 0 && array[j] < array[j - 1]) {
      await checkPaused();

      await compare(j, j - 1);
      await swap(j, j - 1);
      j--;
    }
    markSorted(i);
  }

  // Mark all sorted
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => bar.classList.add("sorted"));

  finishSorting();
}

async function selectionSort() {
  const len = array.length;

  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;

    // Visualize current min candidate
    const bars = arrayContainer.querySelectorAll(".array-bar");
    bars[minIndex].classList.add("pivot");

    for (let j = i + 1; j < len; j++) {
      await checkPaused();

      // Visualize comparison
      await compare(minIndex, j);

      if (array[j] < array[minIndex]) {
        bars[minIndex].classList.remove("pivot");
        minIndex = j;
        bars[minIndex].classList.add("pivot");
        await sleep(speed);
      }
    }

    if (minIndex !== i) {
      await swap(i, minIndex);
    }

    bars[minIndex].classList.remove("pivot");
    markSorted(i);
  }

  // Mark all sorted
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) => bar.classList.add("sorted"));

  finishSorting();
}

// Simplified versions of other algorithms for demonstration
async function heapSort() {
  // Heap sort implementation would go here
  // For demo purposes, we'll simulate with delays
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
  // Simplified for demo
  const bars = arrayContainer.querySelectorAll(".array-bar");
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    await compare(largest, left);
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    await compare(largest, right);
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    await swap(i, largest);
    await heapify(n, largest);
  }
}

async function radixSort() {
  // Radix sort implementation would go here
  // For demo purposes, we'll simulate with delays
  const max = Math.max(...array);
  const len = array.length;
  const bars = arrayContainer.querySelectorAll(".array-bar");

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await checkPaused();

    const output = new Array(len);
    const count = new Array(10).fill(0);

    for (let i = 0; i < len; i++) {
      count[Math.floor(array[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = len - 1; i >= 0; i--) {
      await checkPaused();

      const index = Math.floor(array[i] / exp) % 10;
      output[count[index] - 1] = array[i];
      count[index]--;

      // Visualize
      bars[i].classList.add("highlight");
      await sleep(speed / 2);
      bars[i].classList.remove("highlight");
    }

    for (let i = 0; i < len; i++) {
      await checkPaused();

      array[i] = output[i];
      bars[i].style.height = `${computeBarHeight(array[i])}px`;
      bars[i].classList.add("highlight");
      await sleep(speed / 2);
      bars[i].classList.remove("highlight");
      operations++;
      updateStats();
    }
  }

  // Mark all sorted
  bars.forEach((bar) => bar.classList.add("sorted"));
  finishSorting();
}

async function shellSort() {
  // Shell sort implementation would go here
  // For demo purposes, we'll simulate with delays
  const len = array.length;
  const bars = arrayContainer.querySelectorAll(".array-bar");

  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      await checkPaused();

      const temp = array[i];
      let j;

      bars[i].classList.add("highlight");
      await sleep(speed);

      for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
        await checkPaused();

        await compare(j, j - gap);
        array[j] = array[j - gap];
        bars[j].style.height = `${computeBarHeight(array[j])}px`;
        bars[j].classList.add("pivot");
        await sleep(speed);
        bars[j].classList.remove("pivot");
      }

      array[j] = temp;
      bars[j].style.height = `${computeBarHeight(array[j])}px`;
      bars[i].classList.remove("highlight");
      swaps++;
      operations++;
      updateStats();
    }
  }

  // Mark all sorted
  bars.forEach((bar) => bar.classList.add("sorted"));
  finishSorting();
}

// Clean up after sorting finishes
function finishSorting() {
  sorting = false;
  sortBtn.disabled = false;
  pauseBtn.disabled = true;
  generateBtn.disabled = false;
  arraySizeInput.disabled = false;

  // If startTime is not set (e.g., user cancelled early), show 0ms
  let elapsed = 0;
  if (startTime && startTime > 0) {
    elapsed = Math.floor(performance.now() - startTime);
  }
  timeEl.textContent = `${elapsed}ms`;

  // Clean up any search/visual markers left behind
  const bars = arrayContainer.querySelectorAll(".array-bar");
  bars.forEach((bar) =>
    bar.classList.remove(
      "range",
      "mid",
      "found",
      "low",
      "high",
      "active",
      "fail"
    )
  );
}

// Initialize the app
init();
