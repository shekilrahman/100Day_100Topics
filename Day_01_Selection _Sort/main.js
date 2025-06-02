 let values = [];
    let originalValues = [];
    let isRunning = false;
    let currentPass = 0;
    let comparisons = 0;
    let swaps = 0;

    const container = document.getElementById('boxes');
    const stepsContainer = document.getElementById('steps');

    const steps = [
      "Initialize: Start with unsorted array",
      "Find minimum element in unsorted portion",
      "Compare current element with minimum",
      "Update minimum if smaller element found",
      "Swap minimum with first unsorted element",
      "Move boundary: element is now sorted",
      "Repeat until entire array is sorted"
    ];

    function generateRandomArray() {
      values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90 + 10));
      originalValues = [...values];
      resetCounters();
      createBoxes();
      createSteps();
    }

    function resetCounters() {
      currentPass = 0;
      comparisons = 0;
      swaps = 0;
      updateStatusBar();
    }

    function updateStatusBar() {
      document.getElementById('currentPass').innerHTML = `<i class="fas fa-play-circle"></i><span>Pass: ${currentPass}</span>`;
      document.getElementById('comparisons').innerHTML = `<i class="fas fa-exchange-alt"></i><span>Comparisons: ${comparisons}</span>`;
      document.getElementById('swaps').innerHTML = `<i class="fas fa-arrows-alt-h"></i><span>Swaps: ${swaps}</span>`;
    }

    function createBoxes() {
      container.innerHTML = '';
      values.forEach((val, index) => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = val;
        box.dataset.value = val;
        box.dataset.index = index;
        container.appendChild(box);
      });
    }

    function createSteps() {
      stepsContainer.innerHTML = '';
      steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('step');
        stepDiv.textContent = step;
        stepDiv.id = `step-${index}`;
        stepsContainer.appendChild(stepDiv);
      });
      document.getElementById('step-0').classList.add('active');
    }

    function updateActiveStep(stepIndex) {
      document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
      if (stepIndex < steps.length) {
        document.getElementById(`step-${stepIndex}`).classList.add('active');
      }
    }

    async function startSort() {
      if (isRunning) return;
      
      isRunning = true;
      document.querySelector('.btn-primary').disabled = true;
      
      const boxes = container.children;
      const n = boxes.length;
      
      updateActiveStep(1);

      for (let i = 0; i < n - 1; i++) {
        currentPass = i + 1;
        updateStatusBar();
        
        let minIdx = i;
        boxes[minIdx].classList.add('current');
        boxes[minIdx].classList.add('minimum');
        
        updateActiveStep(2);
        await sleep(800);

        for (let j = i + 1; j < n; j++) {
          boxes[j].classList.add('comparing');
          comparisons++;
          updateStatusBar();
          updateActiveStep(3);
          
          await sleep(600);

          const valJ = parseInt(boxes[j].dataset.value);
          const valMin = parseInt(boxes[minIdx].dataset.value);

          if (valJ < valMin) {
            boxes[minIdx].classList.remove('minimum');
            minIdx = j;
            boxes[minIdx].classList.add('minimum');
            updateActiveStep(4);
            await sleep(400);
          }

          boxes[j].classList.remove('comparing');
          await sleep(200);
        }

        if (minIdx !== i) {
          updateActiveStep(5);
          await animateSwap(boxes[i], boxes[minIdx]);
          swaps++;
          updateStatusBar();
        }

        boxes[minIdx].classList.remove('current', 'minimum');
        boxes[i].classList.add('sorted');
        updateActiveStep(6);
        await sleep(500);
      }

      boxes[n - 1].classList.add('sorted');
      updateActiveStep(6);
      
      await sleep(1000);
      celebrateCompletion();
      
      isRunning = false;
      document.querySelector('.btn-primary').disabled = false;
    }

    async function animateSwap(boxA, boxB) {
      return new Promise(resolve => {
        const rectA = boxA.getBoundingClientRect();
        const rectB = boxB.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const dx = rectB.left - rectA.left;
        const dy = rectB.top - rectA.top;

        boxA.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
        boxB.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.1)`;
        boxA.style.zIndex = "10";
        boxB.style.zIndex = "10";

        setTimeout(() => {
          boxA.style.transform = '';
          boxB.style.transform = '';
          boxA.style.zIndex = '';
          boxB.style.zIndex = '';

          const tempValue = boxA.dataset.value;
          const tempText = boxA.textContent;
          
          boxA.dataset.value = boxB.dataset.value;
          boxA.textContent = boxB.textContent;
          boxB.dataset.value = tempValue;
          boxB.textContent = tempText;

          const tempIndex = values.indexOf(parseInt(tempValue));
          const currentIndex = values.indexOf(parseInt(boxA.dataset.value));
          [values[tempIndex], values[currentIndex]] = [values[currentIndex], values[tempIndex]];

          resolve();
        }, 600);
      });
    }

    async function celebrateCompletion() {
      const boxes = container.children;
      for (let i = 0; i < boxes.length; i++) {
        setTimeout(() => {
          boxes[i].style.animation = 'sortedCelebration 0.6s ease-out';
        }, i * 100);
      }
      
      setTimeout(() => {
        for (let box of boxes) {
          box.style.animation = '';
        }
      }, 2000);
    }

    function generateNewArray() {
      if (isRunning) return;
      generateRandomArray();
    }

    function resetArray() {
      if (isRunning) return;
      values = [...originalValues];
      resetCounters();
      createBoxes();
      createSteps();
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateRandomArray();