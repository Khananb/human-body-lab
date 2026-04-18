// quizEngine.js
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = [];
let quizCompleted = false;

async function initQuiz(system) {
  try {
    const response = await fetch('assets/data/questions.json');
    const data = await response.json();
    currentQuestions = data[system] || [];
    if(currentQuestions.length === 0) {
      document.getElementById('questionArea').innerText = 'No questions found.';
      return;
    }
    // Shuffle questions
    currentQuestions = shuffleArray(currentQuestions).slice(0,10); // take 10
    userAnswers = new Array(currentQuestions.length).fill(null);
    renderQuestion(0);
  } catch(e) {
    document.getElementById('questionArea').innerText = 'Error loading questions.';
  }
}

function shuffleArray(arr) {
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderQuestion(index) {
  if(index >= currentQuestions.length) {
    showResults();
    return;
  }
  currentIndex = index;
  const q = currentQuestions[index];
  document.getElementById('questionArea').innerHTML = `<h3>${index+1}. ${q.question}</h3>`;
  const optionsDiv = document.getElementById('optionsArea');
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.innerHTML = `<i class="far fa-circle"></i> ${opt}`;
    btn.addEventListener('click', () => selectOption(index, i));
    if(userAnswers[index] === i) {
      btn.style.background = '#2a4a8a';
      btn.innerHTML = `<i class="fas fa-check-circle"></i> ${opt}`;
    }
    optionsDiv.appendChild(btn);
  });
  
  document.getElementById('progressText').innerText = `Question ${index+1} of ${currentQuestions.length}`;
  document.getElementById('prevBtn').style.display = index>0 ? 'inline-flex' : 'none';
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.style.display = index < currentQuestions.length-1 ? 'inline-flex' : 'none';
  document.getElementById('submitBtn').style.display = index === currentQuestions.length-1 ? 'inline-flex' : 'none';
  
  const resultArea = document.getElementById('resultArea');
  resultArea.style.display = 'none';
}

function selectOption(qIndex, optIndex) {
  userAnswers[qIndex] = optIndex;
  renderQuestion(qIndex);
}

function nextQuestion() {
  if(currentIndex < currentQuestions.length-1) renderQuestion(currentIndex+1);
}

function prevQuestion() {
  if(currentIndex > 0) renderQuestion(currentIndex-1);
}

function submitQuiz() {
  let correctCount = 0;
  currentQuestions.forEach((q, idx) => {
    if(userAnswers[idx] === q.correct) correctCount++;
  });
  // Add XP: 2 points per correct answer
  const xpEarned = correctCount * 2;
  const newXP = window.addXP(xpEarned);
  
  const resultArea = document.getElementById('resultArea');
  resultArea.style.display = 'block';
  resultArea.innerHTML = `<i class="fas fa-trophy"></i> You scored ${correctCount}/${currentQuestions.length}. Earned ${xpEarned} XP! Total XP: ${newXP}`;
  
  document.getElementById('prevBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('optionsArea').innerHTML = '';
}

function showResults() { submitQuiz(); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prevBtn')?.addEventListener('click', prevQuestion);
  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('submitBtn')?.addEventListener('click', submitQuiz);
});

window.initQuiz = initQuiz;
