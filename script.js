// DOM Elements
const numberInput = document.getElementById("numberInput");
const datasetSize = document.getElementById("datasetSize");
const generateRandomButton = document.getElementById("generateRandom");
const algorithmSelect = document.getElementById("algorithm");
const sortButton = document.getElementById("sortButton");
const speedControl = document.getElementById("speedControl");
const barsContainer = document.getElementById("bars");
const timeComplexity = document.getElementById("timeComplexity");
const spaceComplexity = document.getElementById("spaceComplexity");
const elapsedTime = document.getElementById("elapsedTime");
const algorithmInfo = document.getElementById("algorithmInfo");

// Algorithm Descriptions
const algorithmDescriptions = {
  bubbleSort:
    "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Time Complexity: O(n²), Space Complexity: O(1).",
  quickSort:
    "Quick Sort picks a pivot element and partitions the array into two halves, then recursively sorts the halves. Time Complexity: O(n log n), Space Complexity: O(log n).",
  mergeSort:
    "Merge Sort divides the array into two halves, sorts them recursively, and then merges the sorted halves. Time Complexity: O(n log n), Space Complexity: O(n).",
  insertionSort:
    "Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position. Time Complexity: O(n²), Space Complexity: O(1).",
  selectionSort:
    "Selection Sort repeatedly selects the smallest element from the unsorted portion and swaps it with the first unsorted element. Time Complexity: O(n²), Space Complexity: O(1).",
  heapSort:
    "Heap Sort builds a max heap and repeatedly extracts the maximum element to sort the array. Time Complexity: O(n log n), Space Complexity: O(1).",
};

// Event Listeners
generateRandomButton.addEventListener("click", generateRandomDataset);
sortButton.addEventListener("click", startSorting);
algorithmSelect.addEventListener("change", updateAlgorithmDescription);

// Generate Random Dataset
function generateRandomDataset() {
  const size = parseInt(datasetSize.value);
  if (isNaN(size) || size < 1 || size > 100) {
    alert("Please enter a valid dataset size (1-100).");
    return;
  }
  const randomNumbers = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1
  );
  numberInput.value = randomNumbers.join(", ");
  renderBars(randomNumbers);
}

// Render Bars with Smooth Transitions
function renderBars(numbers, highlightIndices = []) {
  barsContainer.innerHTML = "";
  numbers.forEach((num, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${num * 3}px`;
    bar.style.transition = "height 0.2s ease";
    if (highlightIndices.includes(index)) {
      bar.style.backgroundColor = "#ff6b6b"; // Highlight color
    } else {
      bar.style.backgroundColor = "#007bff"; // Default color
    }
    barsContainer.appendChild(bar);
  });
}

// Update Algorithm Description
function updateAlgorithmDescription() {
  const selectedAlgorithm = algorithmSelect.value;
  algorithmInfo.textContent = algorithmDescriptions[selectedAlgorithm];
}

// Start Sorting
async function startSorting() {
  const numbers = numberInput.value
    .split(",")
    .map((num) => parseFloat(num.trim()));
  if (numbers.some(isNaN)) {
    alert("Please enter valid numbers separated by commas.");
    return;
  }
  const selectedAlgorithm = algorithmSelect.value;
  const speed = parseInt(speedControl.value);
  const startTime = performance.now();
  await sortingAlgorithms[selectedAlgorithm](numbers, speed);
  const endTime = performance.now();
  elapsedTime.textContent = `${(endTime - startTime).toFixed(2)} ms`;
}

// Sorting Algorithms with Visualization
const sortingAlgorithms = {
  bubbleSort: async function (arr, speed) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          renderBars(arr, [j, j + 1]);
          await sleep(speed);
        }
      }
    }
  },
  quickSort: async function (arr, speed, low = 0, high = arr.length - 1) {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high, speed);
      await this.quickSort(arr, speed, low, pivotIndex - 1);
      await this.quickSort(arr, speed, pivotIndex + 1, high);
    }
  },
  mergeSort: async function (arr, speed) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await this.mergeSort(arr.slice(0, mid), speed);
    const right = await this.mergeSort(arr.slice(mid), speed);
    const merged = await merge(left, right, speed);
    renderBars(merged);
    await sleep(speed);
    return merged;
  },
  insertionSort: async function (arr, speed) {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        renderBars(arr, [j, j + 1]);
        await sleep(speed);
      }
      arr[j + 1] = key;
      renderBars(arr);
      await sleep(speed);
    }
  },
  selectionSort: async function (arr, speed) {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) minIndex = j;
      }
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      renderBars(arr, [i, minIndex]);
      await sleep(speed);
    }
  },
  heapSort: async function (arr, speed) {
    await buildMaxHeap(arr, speed);
    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      renderBars(arr, [0, i]);
      await sleep(speed);
      await heapify(arr, 0, i, speed);
    }
  },
};

// Helper Functions
async function partition(arr, low, high, speed) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      renderBars(arr, [i, j]);
      await sleep(speed);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  renderBars(arr, [i + 1, high]);
  await sleep(speed);
  return i + 1;
}

async function merge(left, right, speed) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());
    renderBars([...result, ...left, ...right]);
    await sleep(speed);
  }
  return [...result, ...left, ...right];
}

async function buildMaxHeap(arr, speed) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, i, n, speed);
  }
}

async function heapify(arr, i, n, speed) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    renderBars(arr, [i, largest]);
    await sleep(speed);
    await heapify(arr, largest, n, speed);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize
updateAlgorithmDescription();
