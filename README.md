# 🎯 AlgoViz — Interactive Algorithm Visualizer v2.0

**Premium sorting & searching algorithm visualizer with real-time animations, live statistics, and interactive exploration!** AlgoViz helps you deeply understand how different algorithms work by displaying beautifully animated visualizations and detailed performance metrics with a modern, accessible interface.

![Algorithm Visualizer Screenshot](screenshot.png) _AlgoViz — Premium Algorithm Visualizer in Action_

---

## ⭐ What's New in v2.0

✨ **Major Updates**:

- 🔢 **10 Algorithms** (expanded from 8): Added Binary Search & Linear Search
- 🎨 **Premium UI Redesign**: Modern gradient backgrounds, particle animations, improved typography
- ⌨️ **Enhanced Accessibility**: Keyboard navigation, ARIA labels, semantic HTML5
- 🔤 **Typography Upgrade**: Google Fonts integration (Inter, Space Grotesk, JetBrains Mono)
- 🐛 **Bug Fixes**: Fixed HTML parsing, dual finishSorting calls, slider/input handling
- 💫 **Visual Polish**: Status indicators, smooth stat animations, refined color palette
- 📱 **Better Responsive Design**: Optimized for all device sizes with dynamic height adjustment

---


## 🌟 Core Features

### 🧩 Algorithm Visualization

**10 Powerful Algorithms** organized in two categories:

**Sorting Algorithms (8)**:

- **Bubble Sort** — O(n²) | Simple comparison-based algorithm, great for learning
- **Quick Sort** — O(n log n) | Divide-and-conquer with efficient average-case performance
- **Merge Sort** — O(n log n) | Stable algorithm with guaranteed performance
- **Insertion Sort** — O(n²) | Efficient for small datasets and nearly-sorted data
- **Selection Sort** — O(n²) | Simple selection-based approach
- **Heap Sort** — O(n log n) | Uses binary heap data structure for sorting
- **Radix Sort** — O(nk) | Non-comparative integer sorting (k = number of digits)
- **Shell Sort** — O(n log n) | Generalized insertion sort with improved performance

**Searching Algorithms (2)**:

- **Binary Search** — O(log n) | Efficient halving search on sorted arrays
- **Linear Search** — O(n) | Sequential search works on unsorted arrays

**Dynamic Color Coding**:

- 🔵 **Default** — Unsorted/inactive elements
- 🔴 **Comparing** — Elements currently being compared
- 🟢 **Sorted** — Successfully sorted/found elements
- 🟡 **Pivot** — Pivot element (in Quick Sort & Radix Sort)
- 🟠 **Active** — Currently active operation
- ❌ **Not Found** — Search target not found

**Real-time Animation**:

- Smooth step-by-step execution with visual feedback
- Adjustable speed (Slow → Normal → Fast)
- Pause/Resume functionality for deeper analysis
- Live operation counter

### 📊 Live Performance Metrics

**Real-time Statistics Tracking**:

- ⏱️ **Execution Time** — Milliseconds elapsed during algorithm execution
- 🔄 **Swaps** — Number of element exchanges performed
- ↔️ **Comparisons** — Total comparison operations made
- ⚙️ **Total Operations** — Sum of all algorithm operations
- 📈 **Status Indicator** — Real-time algorithm state (Ready/Sorting/Paused/Complete)

**Complexity Information**:

- Time Complexity (best, average, worst cases)
- Space Complexity analysis
- Algorithm descriptions and use-case recommendations

### 🎚️ Professional Control Panel

- **Array Size Selector** — 5–100 elements (dynamically adjusts visualization)
- **Speed Control Slider** — Fine-grained animation speed adjustment
- **One-Click Array Generation** — Instant new random array
- **Start/Pause/Reset Controls** — Full execution management
- **Algorithm Categories** — Organized sorting & searching sections
- **Keyboard Navigation** — Tab through controls, Enter to select algorithms

### 🎨 Premium Visual Design

- **Animated Background Particles** — Subtle ambient animation
- **Gradient Text & Buttons** — Modern aesthetic with smooth transitions
- **Dark Theme** — Easy on the eyes with vibrant accent colors
- **Responsive Bar Visualization** — Dynamic sizing based on array size
- **Modern Typography** — Professional font stack with multiple weights
- **Smooth Transitions** — Polished animations and state changes

### 📱 Responsive & Accessible

- **Works on all devices** — Desktop, tablet, mobile
- **ARIA labels & roles** — Full screen reader support
- **Semantic HTML5** — Proper heading hierarchy and structure
- **Keyboard-friendly** — Navigate and control entirely with keyboard
- **Color-independent information** — Not reliant on color alone for meaning
- **Readable fonts** — High contrast, optimized sizing

## 📂 Project Structure

```
AlgoViz/
├── index.html              # Semantic HTML5 structure with accessibility features
├── style.css               # Premium CSS with variables, animations, responsive design
├── script.js               # Core algorithm implementations & visualization engine
├── README.md               # Comprehensive documentation (this file)
└── screenshot.png          # Project screenshot
```

### File Descriptions

- **index.html**: Modern HTML5 structure featuring semantic elements, ARIA labels for accessibility, header with branding, control panel with algorithm categories, array visualization container, statistics display, and modal dialogs for search inputs.

- **style.css**: Advanced CSS3 stylesheet with CSS custom properties (variables), flexible layout system (Flexbox/Grid), smooth animations and transitions, particle effects, responsive breakpoints, dark theme color palette, and modern design patterns.

- **script.js**: Pure JavaScript (ES6+) implementing all 10 algorithms, real-time visualization engine, event handling, state management, statistics tracking, and animation sequencing with async/await patterns.

---

## 🚀 Quick Start

### Option 1: Live Demo (Instant, No Setup)

👉 **[Open AlgoViz](https://syogesh999.github.io/Algo-Visualizer/)**

### Option 2: Local Development

**Prerequisites**: Git, and any modern web browser

**Steps**:

```bash
# Clone the repository
git clone https://github.com/syogesh999/Algo-Visualizer.git

# Navigate to project
cd Algo-Visualizer

# Open directly in browser (simplest method)
# Windows: Start explorer and double-click index.html
# macOS: open index.html
# Linux: xdg-open index.html

# OR use a local development server

# Python 3
python -m http.server 8000

# Python 2 (if Python 3 not available)
python -m SimpleHTTPServer 8000

# Node.js (if installed)
npx http-server

# PHP
php -S localhost:8000
```

Then visit in your browser:

- **Direct file**: `file:///path/to/Algo-Visualizer/index.html`
- **Local server**: `http://localhost:8000`

---

## 🛠️ Technology Stack

### Frontend Framework

- **HTML5** — Semantic markup, form validation, accessibility
- **CSS3** — Custom properties, Grid/Flexbox, animations, transitions
- **JavaScript ES6+** — Arrow functions, async/await, template literals, destructuring

### External Libraries & Resources

**Icons & Fonts**:

- 🎯 [Font Awesome 6.4.0](https://fontawesome.com/) — 1000+ professional icons via CDN
- 🔤 [Google Fonts](https://fonts.google.com/) — Typography system:
  - **Inter** — Clean UI font (weights: 300, 400, 500, 600, 700)
  - **Space Grotesk** — Bold headings (weights: 400, 500, 600, 700)
  - **JetBrains Mono** — Code/statistics display (weights: 400, 500)

**Build & Performance**:

- Lazy CSS font loading for optimal performance
- Font preconnection hints for faster resource resolution
- Optimized animation frame rates
- Minimal dependencies (pure JavaScript with CDN libraries)

**Design Principles**:

- Dark theme with accent colors (primary: #6c63ff, accent: #00d2ff)
- Premium color palette with 16+ semantic color variables
- Responsive design with mobile-first approach
- Accessibility-first HTML structure

## � Learning Outcomes

**What You'll Understand**:

### Sorting Algorithms

- ✅ How comparison-based sorting works (Bubble, Insertion, Selection)
- ✅ Divide-and-conquer strategies (Quick Sort, Merge Sort)
- ✅ Heap-based sorting and heap data structures
- ✅ Non-comparative sorting (Radix Sort)
- ✅ Time complexity trade-offs: O(n²) vs. O(n log n)
- ✅ Space complexity considerations for different algorithms
- ✅ Stability and in-place sorting concepts

### Searching Algorithms

- ✅ Sequential vs. halving search strategies
- ✅ Binary search requirements (sorted data) and O(log n) efficiency
- ✅ Linear search applicability to unsorted data
- ✅ When to use each search algorithm

### Algorithm Analysis

- ✅ Big O notation in practice (not just theory)
- ✅ Impact of array size on execution time
- ✅ Operation counting (comparisons, swaps)
- ✅ Best/average/worst case scenarios
- ✅ Algorithm selection based on data size and type

### Visual Learning Benefits

- 📊 See algorithms in action — no more abstract concepts
- 🎯 Immediate feedback on algorithm behavior
- ⚡ Understand performance differences empirically
- 💡 Build intuition about algorithm efficiency
- 🧠 Enhance memory retention through interactive visualization

---

## 🌐 Browser Compatibility

| Browser       | Version | Support |
| ------------- | ------- | ------- |
| Chrome        | Latest  | ✅ Full |
| Firefox       | Latest  | ✅ Full |
| Safari        | 14+     | ✅ Full |
| Edge          | Latest  | ✅ Full |
| Opera         | Latest  | ✅ Full |
| Mobile Safari | iOS 13+ | ✅ Full |
| Chrome Mobile | Latest  | ✅ Full |

**Requirements**: ES6 JavaScript support, CSS3 animations, modern DOM API

---

## 📖 Algorithm Deep Dives

### Bubble Sort

- **Time Complexity**: O(n²) | **Space**: O(1)
- **Use Case**: Educational purposes, nearly sorted small arrays
- **Stability**: Yes
- **Best For**: Understanding basic sorting concepts

### Quick Sort

- **Time Complexity**: O(n log n) average, O(n²) worst | **Space**: O(log n)
- **Use Case**: General-purpose sorting, in-place requirements
- **Stability**: No (but variants exist)
- **Best For**: Most practical applications

### Merge Sort

- **Time Complexity**: O(n log n) guaranteed | **Space**: O(n)
- **Use Case**: Consistent performance needed, stable sort required
- **Stability**: Yes
- **Best For**: Large datasets, external sorting

### Insertion Sort

- **Time Complexity**: O(n²) | **Space**: O(1)
- **Use Case**: Small arrays, nearly sorted data, online sorting
- **Stability**: Yes
- **Best For**: Small datasets, real-time insertion

### Selection Sort

- **Time Complexity**: O(n²) | **Space**: O(1)
- **Use Case**: Minimizing memory writes, theoretical study
- **Stability**: No
- **Best For**: Understanding selection-based approach

### Heap Sort

- **Time Complexity**: O(n log n) guaranteed | **Space**: O(1)
- **Use Case**: When worst-case guarantee needed, in-place sort
- **Stability**: No
- **Best For**: System libraries requiring guaranteed O(n log n)

### Radix Sort

- **Time Complexity**: O(nk) where k = digits | **Space**: O(n + k)
- **Use Case**: Integer sorting, limited digit range
- **Stability**: Yes
- **Best For**: Sorting by digit/character, postal codes

### Shell Sort

- **Time Complexity**: O(n log n) average | **Space**: O(1)
- **Use Case**: In-place sorting, better than insertion sort
- **Stability**: No
- **Best For**: Performance without extra space

### Binary Search

- **Time Complexity**: O(log n) | **Space**: O(1)
- **Requirement**: Array must be sorted
- **Best For**: Large sorted datasets, millions of elements

### Linear Search

- **Time Complexity**: O(n) | **Space**: O(1)
- **Requirement**: None (works on unsorted data)
- **Best For**: Small arrays, searching unsorted data

---

## 🎓 Educational Resources & References

### Algorithm Learning

- 📖 [Visualgo](https://visualgo.net/) — Interactive visualization algorithms library
- 📖 [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) — Quick complexity reference
- 📖 [GeeksforGeeks Algorithms](https://www.geeksforgeeks.org/fundamentals-of-algorithms/) — Detailed algorithm tutorials
- 📖 [Khan Academy - Algorithms](https://www.khanacademy.org/computing/computer-science/algorithms) — Free algorithm courses

### Complexity Analysis

- 📊 [Big-O Analysis Guide](https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a7c5/) — Comprehensive complexity guide
- 📊 [Master Theorem](https://www.geeksforgeeks.org/master-theorem-for-divide-and-conquer/) — Analyzing recursive algorithms

### Web Development

- 🎨 [MDN Web Docs](https://developer.mozilla.org/) — HTML/CSS/JavaScript reference
- 🎨 [CSS Tricks](https://css-tricks.com/) — Advanced CSS techniques
- 🎨 [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/) — Accessibility standards

### Interactive Learning

- 🖥️ [LeetCode](https://leetcode.com/) — Practice algorithm problems
- 🖥️ [HackerRank](https://www.hackerrank.com/) — Algorithm challenges
- 🖥️ [CodeSignal](https://codesignal.com/) — Coding assessments

---

## ✨ Features Showcase

```
┌─────────────────────────────────────────┐
│         AlgoViz Feature Matrix           │
├─────────────────────────────────────────┤
│ • 10 Algorithms (8 Sort + 2 Search)    │
│ • Real-time Performance Metrics         │
│ • Adjustable Speed Control             │
│ • Dynamic Array Sizing (5-100)         │
│ • Live Statistics & Operation Counter  │
│ • Color-coded Element States           │
│ • Keyboard Navigation Support          │
│ • Mobile Responsive Design             │
│ • Dark Theme with Accent Colors        │
│ • Animated Particle Background         │
│ • WCAG Accessibility Compliance        │
│ • No Dependencies (Pure Vanilla JS)    │
└─────────────────────────────────────────┘
```

---

## 🐛 Known Issues & Limitations

**Current Limitations**:

- Maximum array size: 100 elements (for visualization clarity)
- Animations disabled in some high-contrast mode browsers
- Some older mobile browsers may have reduced animation smoothness

**Recent Bug Fixes (v2.0)**:

- ✅ Fixed HTML input/slider parsing (restructured HTML)
- ✅ Eliminated double finishSorting() calls
- ✅ Fixed updateStats() forceUpdate logic
- ✅ Fixed modal placement in DOM hierarchy
- ✅ Added keyboard (Enter) support on algorithm items
- ✅ Enhanced status chip state reflection

---

## 🤝 Contributing

Found a bug? Want to add more algorithms?

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Potential Enhancements

- [ ] Additional algorithms (Counting Sort, Bucket Sort, Cocktail Sort)
- [ ] Step-through debugging mode with variable inspection
- [ ] Algorithm comparison side-by-side
- [ ] Dark/Light theme toggle
- [ ] Export statistics as charts/PDF
- [ ] Multi-language support
- [ ] Performance benchmarking suite
- [ ] Custom algorithm input

---

## 📋 License & Attribution

**License**: MIT License — Free to use, modify, and distribute

**Original Author**: [syogesh999](https://github.com/syogesh999)

**Repository**: [Algo-Visualizer](https://github.com/syogesh999/Algo-Visualizer)

**Version**: 2.0 (Enhanced & Modernized)

---

## 📞 Support & Feedback

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/syogesh999/Algo-Visualizer/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/syogesh999/Algo-Visualizer/discussions)
- ⭐ **Show Support**: Star the repository!

---

## 🎉 Getting Started Now!

Ready to visualize algorithms? Start here:

1. **Online**: Visit [https://syogesh999.github.io/Algo-Visualizer/](https://syogesh999.github.io/Algo-Visualizer/)
2. **Local**: Clone and open `index.html`
3. **Learn**: Select an algorithm and watch it sort!

**Pro Tips**:

- Use **Slow** speed to understand each step
- Try **Normal** speed for typical observation
- Use **Fast** speed to see overall performance difference
- Try different **array sizes** to see complexity in action
- **Pause** during execution to analyze state

---

**Made with ❤️ for learning. Happy visualizing!** 🚀

_Last Updated: 2026 | AlgoViz v2.0_
