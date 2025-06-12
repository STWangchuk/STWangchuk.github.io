const draggableBoxes = document.querySelectorAll('.draggable-box');
const contactBtn = document.getElementById('contact-btn');
const aboutBtn = document.getElementById('about-btn');
const resumeBtn = document.getElementById('resume-btn');
const projectsBtn = document.getElementById('projects-btn');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');
const openSound = new Audio('assets/click.mp3');
const closeSound = new Audio('assets/close.mp3');

let zIndexCounter = 10000;
let soundOn = true;
let darkMode = false; 

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundIcon.src = soundOn ? 'assets/on.svg' : 'assets/off.svg';
  soundIcon.alt = soundOn ? 'Sound On' : 'Sound Off';

  console.log('Sound is now', soundOn ? 'ON' : 'OFF');
});

darkModeToggle.addEventListener('click', () => {
  darkMode = !darkMode;

  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    darkModeIcon.src = 'assets/moon.svg';
    darkModeIcon.alt = 'Dark Mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    darkModeIcon.src = 'assets/sun.svg';
    darkModeIcon.alt = 'Light Mode';
  }
});


function openDragBoxById(id) {
  const dragBox = document.getElementById(id);
  if (!dragBox) return;

  // Secret measuring hack
  dragBox.style.display = 'block';
  dragBox.style.visibility = 'hidden';

  const boxWidth = dragBox.offsetWidth;
  const boxHeight = dragBox.offsetHeight;

  const margin = 10; 

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const maxLeft = screenWidth - boxWidth - margin;
  const maxTop = screenHeight - boxHeight - margin;

  // Clamper
  const randomLeft = Math.floor(Math.random() * (maxLeft - margin + 1)) + margin;
  const randomTop = Math.floor(Math.random() * (maxTop - margin + 1)) + margin;

  dragBox.style.visibility = ''; 
  dragBox.style.left = `${randomLeft}px`;
  dragBox.style.top = `${randomTop}px`;

  zIndexCounter++;
  dragBox.style.zIndex = zIndexCounter;

  dragBox.classList.remove('pop-out');
  void dragBox.offsetWidth; // forcing reflow here
  dragBox.classList.add('pop-in');

  if (soundOn) openSound.play();
}

// Dragging functionality below. Crosscheck later if appearance doesn't work

draggableBoxes.forEach(dragBox => {
  let isDragging = false;
  let offsetX, offsetY;

  const header = dragBox.querySelector('.header');
  const closeBtn = dragBox.querySelector('.close-btn');

  header.addEventListener('mousedown', (e) => {
    zIndexCounter++;
    dragBox.style.zIndex = zIndexCounter;

    if (!e.target.classList.contains('close-btn')) {
      isDragging = true;
      offsetX = e.clientX - dragBox.offsetLeft;
      offsetY = e.clientY - dragBox.offsetTop;
      document.body.style.userSelect = 'none';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const boxWidth = dragBox.offsetWidth;
      const boxHeight = dragBox.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + boxWidth > screenWidth) newLeft = screenWidth - boxWidth;
      if (newTop + boxHeight > screenHeight) newTop = screenHeight - boxHeight;

      dragBox.style.left = `${newLeft}px`;
      dragBox.style.top = `${newTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });

  closeBtn.addEventListener('click', () => {
    dragBox.classList.remove('pop-in');
    dragBox.classList.add('pop-out');

    if (soundOn) closeSound.play();

    setTimeout(() => {
      dragBox.style.display = 'none';
    }, 300);
  });
});

aboutBtn.addEventListener('click', () => openDragBoxById('about'));
resumeBtn.addEventListener('click', () => openDragBoxById('resume'));
projectsBtn.addEventListener('click', () => openDragBoxById('projects'));
contactBtn.addEventListener('click', () => openDragBoxById('contact'));

document.querySelectorAll('#email-address').forEach(emailEl => {
  emailEl.addEventListener('click', () => {
    const email = 'sonam.wangchuk@yale.edu';
    navigator.clipboard.writeText(email);

    emailEl.setAttribute('data-tooltip', 'Copied!');
    setTimeout(() => {
      emailEl.setAttribute('data-tooltip', 'Tap to copy');
    }, 2000);
  });
});
