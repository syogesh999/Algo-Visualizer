// DOM Elements
const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate-array');
const arraySizeInput = document.getElementById('array-size');
const speedSlider = document.getElementById('speed-slider');
const sortBtn = document.getElementById('sort-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const algoItems = document.querySelectorAll('.algo-item');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const timeEl = document.getElementById('time');
const operationsEl = document.getElementById('operations');
const timeComplexityEl = document.getElementById('time-complexity');
const spaceComplexityEl = document.getElementById('space-complexity');
const algoDescriptionEl = document.getElementById('algo-description');

// Global variables
let array = [];
let arraySize = parseInt(arraySizeInput.value);
let sorting = false;
let paused = false;
let selectedAlgorithm = 'bubble';
let speed = 200;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let operations = 0;
let animationId = null;
let algoInfo = {
    bubble: {
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    quick: {
        time: 'O(n log n)',
        space: 'O(log n)',
        description: 'Quick sort is a divide-and-conquer algorithm that works by selecting a "pivot" element and partitioning the array around the pivot.'
    },
    merge: {
        time: 'O(n log n)',
        space: 'O(n)',
        description: 'Merge sort is a divide-and-conquer algorithm that divides the input array into two halves, sorts them, and then merges the sorted halves.'
    },
    insertion: {
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Insertion sort builds the final sorted array one item at a time by inserting each element into its correct position.'
    },
    selection: {
        time: 'O(n²)',
        space: 'O(1)',
        description: 'Selection sort divides the input list into a sorted and an unsorted region, repeatedly selecting the smallest element from the unsorted region.'
    },
    heap: {
        time: 'O(n log n)',
        space: 'O(1)',
        description: 'Heap sort uses a binary heap data structure to sort elements by building a heap and repeatedly extracting the maximum element.'
    },
    radix: {
        time: 'O(nk)',
        space: 'O(n+k)',
        description: 'Radix sort is a non-comparative sorting algorithm that sorts numbers by processing individual digits.'
    },
    shell: {
        time: 'O(n log n)',
        space: 'O(1)',
        description: 'Shell sort is an optimization of insertion sort that allows the exchange of items that are far apart by using a gap sequence.'
    }
};

// Initialize
function init() {
    generateNewArray();
    updateSpeed();
    updateAlgorithmInfo();
    
    // Event Listeners
    generateBtn.addEventListener('click', generateNewArray);
    arraySizeInput.addEventListener('change', () => {
        arraySize = parseInt(arraySizeInput.value);
        generateNewArray();
    });
    speedSlider.addEventListener('input', updateSpeed);
    sortBtn.addEventListener('click', startSorting);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', reset);
    
    algoItems.forEach(item => {
        item.addEventListener('click', () => {
            algoItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            selectedAlgorithm = item.dataset.algo;
            updateAlgorithmInfo();
        });
    });
}

// Generate new random array
function generateNewArray() {
    // Reset state
    reset();
    
    // Generate array
    array = [];
    const containerHeight = arrayContainer.clientHeight;
    
    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * (containerHeight - 50) + 10);
        array.push(value);
    }
    
    renderArray();
}

// Render array as bars
function renderArray() {
    arrayContainer.innerHTML = '';
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

// Update animation speed
function updateSpeed() {
    // Map slider value (1-100) to delay (5-200ms)
    speed = 205 - speedSlider.value * 2;
}

// Update algorithm info
function updateAlgorithmInfo() {
    const info = algoInfo[selectedAlgorithm];
    timeComplexityEl.textContent = info.time;
    spaceComplexityEl.textContent = info.space;
    algoDescriptionEl.textContent = info.description;
}

// Start sorting process
function startSorting() {
    if (sorting || array.length === 0) return;
    
    // Reset stats
    comparisons = 0;
    swaps = 0;
    operations = 0;
    startTime = Date.now();
    updateStats();
    
    sorting = true;
    sortBtn.disabled = true;
    pauseBtn.disabled = false;
    generateBtn.disabled = true;
    arraySizeInput.disabled = true;
    
    // Start selected algorithm
    switch (selectedAlgorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'quick':
            quickSort();
            break;
        case 'merge':
            mergeSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'heap':
            heapSort();
            break;
        case 'radix':
            radixSort();
            break;
        case 'shell':
            shellSort();
            break;
    }
}

// Toggle pause
function togglePause() {
    paused = !paused;
    pauseBtn.innerHTML = paused ? 
        '<i class="fas fa-play"></i> Resume' : 
        '<i class="fas fa-pause"></i> Pause';
    
    if (!paused) {
        // Resume sorting
        startSorting();
    }
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
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.remove('highlight', 'sorted', 'pivot');
    });
}

// Update statistics display
function updateStats() {
    comparisonsEl.textContent = comparisons;
    swapsEl.textContent = swaps;
    operationsEl.textContent = operations;
    
    if (startTime > 0) {
        const elapsed = Date.now() - startTime;
        timeEl.textContent = `${elapsed}ms`;
    }
}

// Swap two elements in the array
async function swap(i, j) {
    // Visualize swap
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars[i].classList.add('highlight');
    bars[j].classList.add('highlight');
    
    // Swap values
    [array[i], array[j]] = [array[j], array[i]];
    
    // Update heights
    bars[i].style.height = `${array[i]}px`;
    bars[j].style.height = `${array[j]}px`;
    
    // Wait for animation
    await sleep(speed);
    
    // Remove highlight
    bars[i].classList.remove('highlight');
    bars[j].classList.remove('highlight');
    
    swaps++;
    operations++;
    updateStats();
}

// Compare two elements (visualize without swapping)
async function compare(i, j) {
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars[i].classList.add('highlight');
    bars[j].classList.add('highlight');
    
    // Wait for animation
    await sleep(speed);
    
    // Remove highlight
    bars[i].classList.remove('highlight');
    bars[j].classList.remove('highlight');
    
    comparisons++;
    operations++;
    updateStats();
}

// Mark an element as pivot
async function markPivot(index) {
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars[index].classList.add('pivot');
    
    await sleep(speed * 2);
    
    bars[index].classList.remove('pivot');
}

// Mark an element as sorted
function markSorted(index) {
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars[index].classList.add('sorted');
}

// Sleep function for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sorting Algorithms
async function bubbleSort() {
    const len = array.length;
    
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (paused) return;
            
            // Visualize comparison
            await compare(j, j + 1);
            
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
        markSorted(len - i - 1);
    }
    
    // Mark all sorted
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    finishSorting();
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
    
    // Mark all sorted
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    finishSorting();
}

async function quickSortHelper(low, high) {
    if (low < high) {
        if (paused) return;
        
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
        if (paused) return;
        
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
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    finishSorting();
}

async function mergeSortHelper(low, high) {
    if (low < high) {
        if (paused) return;
        
        const mid = Math.floor((low + high) / 2);
        
        await mergeSortHelper(low, mid);
        await mergeSortHelper(mid + 1, high);
        
        await merge(low, mid, high);
    }
}

async function merge(low, mid, high) {
    const left = array.slice(low, mid + 1);
    const right = array.slice(mid + 1, high + 1);
    
    let i = 0, j = 0, k = low;
    
    while (i < left.length && j < right.length) {
        if (paused) return;
        
        await compare(low + i, mid + 1 + j);
        
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        
        // Visualize the change
        const bars = arrayContainer.querySelectorAll('.array-bar');
        bars[k].style.height = `${array[k]}px`;
        bars[k].classList.add('highlight');
        
        await sleep(speed);
        bars[k].classList.remove('highlight');
        
        k++;
        operations++;
        updateStats();
    }
    
    while (i < left.length) {
        array[k] = left[i];
        
        const bars = arrayContainer.querySelectorAll('.array-bar');
        bars[k].style.height = `${array[k]}px`;
        bars[k].classList.add('highlight');
        
        await sleep(speed);
        bars[k].classList.remove('highlight');
        
        i++;
        k++;
        operations++;
        updateStats();
    }
    
    while (j < right.length) {
        array[k] = right[j];
        
        const bars = arrayContainer.querySelectorAll('.array-bar');
        bars[k].style.height = `${array[k]}px`;
        bars[k].classList.add('highlight');
        
        await sleep(speed);
        bars[k].classList.remove('highlight');
        
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
            if (paused) return;
            
            await compare(j, j - 1);
            await swap(j, j - 1);
            j--;
        }
        markSorted(i);
    }
    
    // Mark all sorted
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    finishSorting();
}

async function selectionSort() {
    const len = array.length;
    
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        
        // Visualize current min candidate
        const bars = arrayContainer.querySelectorAll('.array-bar');
        bars[minIndex].classList.add('pivot');
        
        for (let j = i + 1; j < len; j++) {
            if (paused) return;
            
            // Visualize comparison
            await compare(minIndex, j);
            
            if (array[j] < array[minIndex]) {
                bars[minIndex].classList.remove('pivot');
                minIndex = j;
                bars[minIndex].classList.add('pivot');
                await sleep(speed);
            }
        }
        
        if (minIndex !== i) {
            await swap(i, minIndex);
        }
        
        bars[minIndex].classList.remove('pivot');
        markSorted(i);
    }
    
    // Mark all sorted
    const bars = arrayContainer.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    finishSorting();
}

// Simplified versions of other algorithms for demonstration
async function heapSort() {
    // Heap sort implementation would go here
    // For demo purposes, we'll simulate with delays
    const len = array.length;
    
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        if (paused) return;
        await heapify(len, i);
    }
    
    for (let i = len - 1; i > 0; i--) {
        if (paused) return;
        await swap(0, i);
        markSorted(i);
        await heapify(i, 0);
    }
    
    markSorted(0);
    finishSorting();
}

async function heapify(n, i) {
    // Simplified for demo
    const bars = arrayContainer.querySelectorAll('.array-bar');
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
    const bars = arrayContainer.querySelectorAll('.array-bar');
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        if (paused) return;
        
        const output = new Array(len);
        const count = new Array(10).fill(0);
        
        for (let i = 0; i < len; i++) {
            count[Math.floor(array[i] / exp) % 10]++;
        }
        
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        for (let i = len - 1; i >= 0; i--) {
            if (paused) return;
            
            const index = Math.floor(array[i] / exp) % 10;
            output[count[index] - 1] = array[i];
            count[index]--;
            
            // Visualize
            bars[i].classList.add('highlight');
            await sleep(speed / 2);
            bars[i].classList.remove('highlight');
        }
        
        for (let i = 0; i < len; i++) {
            if (paused) return;
            
            array[i] = output[i];
            bars[i].style.height = `${array[i]}px`;
            bars[i].classList.add('highlight');
            await sleep(speed / 2);
            bars[i].classList.remove('highlight');
            operations++;
            updateStats();
        }
    }
    
    // Mark all sorted
    bars.forEach(bar => bar.classList.add('sorted'));
    finishSorting();
}

async function shellSort() {
    // Shell sort implementation would go here
    // For demo purposes, we'll simulate with delays
    const len = array.length;
    const bars = arrayContainer.querySelectorAll('.array-bar');
    
    for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < len; i++) {
            if (paused) return;
            
            const temp = array[i];
            let j;
            
            bars[i].classList.add('highlight');
            await sleep(speed);
            
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                if (paused) return;
                
                await compare(j, j - gap);
                array[j] = array[j - gap];
                bars[j].style.height = `${array[j]}px`;
                bars[j].classList.add('pivot');
                await sleep(speed);
                bars[j].classList.remove('pivot');
            }
            
            array[j] = temp;
            bars[j].style.height = `${array[j]}px`;
            bars[i].classList.remove('highlight');
            swaps++;
            operations++;
            updateStats();
        }
    }
    
    // Mark all sorted
    bars.forEach(bar => bar.classList.add('sorted'));
    finishSorting();
}

// Clean up after sorting finishes
function finishSorting() {
    sorting = false;
    sortBtn.disabled = false;
    pauseBtn.disabled = true;
    generateBtn.disabled = false;
    arraySizeInput.disabled = false;
    
    const elapsed = Date.now() - startTime;
    timeEl.textContent = `${elapsed}ms`;
}

// Initialize the app
init();