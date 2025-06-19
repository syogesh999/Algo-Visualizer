# 🎯 Interactive Algorithm Visualizer

**Visualize sorting algorithms in action with real-time animations and step-by-step execution!** This interactive tool helps you understand how different sorting algorithms work by displaying animated visualizations and detailed performance metrics.

![Algorithm Visualizer Screenshot](screenshot.png) *Example screenshot of the visualizer in action*

## 🌟 Features

### 🧩 Algorithm Visualization
- **8 Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort, Heap Sort, Radix Sort, Shell Sort
- **Color-coded Elements**: 
  - 🔵 Normal elements
  - 🔴 Elements being compared
  - 🟢 Sorted elements
  - 🟡 Pivot elements (in Quick Sort)
- **Real-time Animation**: Watch algorithms work step-by-step with adjustable speed

### 📊 Performance Metrics
- Real-time statistics tracking:
  - ⏱️ Execution time
  - 🔄 Number of swaps
  - ↔️ Number of comparisons
  - ⚙️ Total operations
- Time and space complexity information for each algorithm

### 🎚️ Interactive Controls
- Adjustable array size (5-100 elements)
- Speed control slider for animation
- One-click array generation
- Start/Pause/Reset functionality

### 📱 Responsive Design
- Works seamlessly on desktop and mobile devices
- Clean, modern UI with gradient backgrounds
- Intuitive control panel layout

## 📂 File Structure

```
Algo-Visualizer/
├── index.html          # Main HTML structure
├── style.css           # All CSS styles
├── script.js           # All JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Live Demo

Experience the visualizer directly in your browser:  
👉 [https://syogesh999.github.io/Algo-Visualizer/](https://syogesh999.github.io/Algo-Visualizer/)

## 💻 Local Setup

1. Clone the repository:
```bash
git clone https://github.com/syogesh999/Algo-Visualizer.git
```

2. Open the project directory:
```bash
cd Algo-Visualizer
```

3. Launch the visualizer:
   - Simply open `index.html` in any modern web browser
   - Or use a local server (e.g., with Python):
     ```bash
     python -m http.server
     ```
     Then visit `http://localhost:8000` in your browser

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **UI Libraries**: Font Awesome (for icons)
- **Design**: CSS Variables, Flexbox, CSS Grid, Responsive Design
- **Animations**: CSS Transitions, Async/Await for animation sequencing

## 📖 Educational Value

This visualizer helps in understanding:
- How different sorting algorithms work internally
- Time/space complexity differences between algorithms
- The actual number of operations required for different approaches
- Why some algorithms perform better than others on different data sets

**Happy visualizing!** 👨‍💻👩‍💻
