let currentQuestion = 0;
let testData = [];

async function loadTest() {
const res = await fetch('/tests/test.json');
testData = await res.json();
showQuestion();
}

function showQuestion() {
const container = document.getElementById("testContent");
const questionText = document.getElementById("questionText");
const answersBox = document.getElementById("answersBox");

if (currentQuestion >= testData.questions.length) {
container.style.display = 'none';
document.getElementById("resultBox").style.display = 'block';
return;
}

const q = testData.questions[currentQuestion];
questionText.textContent = q.question;
answersBox.innerHTML = '';

q.answers.forEach(answer => {
const btn = document.createElement("button");
btn.textContent = answer;
btn.onclick = () => {
currentQuestion++;
showQuestion();
};
answersBox.appendChild(btn);
});

gsap.from(".anim", { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 });
}

window.addEventListener("DOMContentLoaded", loadTest);
