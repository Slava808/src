let questionCount = 0;

function addQuestion() {
questionCount++;
const container = document.getElementById("questionsContainer");
const div = document.createElement("div");
div.className = "question-card";
div.innerHTML = `
<div style="display:flex; gap: 8px;">
<input type="text" class="question" placeholder="Вопрос ${questionCount}" style="flex:1;" />
<button class="remove-btn" onclick="removeQuestion(this)">✖</button>
</div>
<div class="answers">
<div class="answer-line" data-index="1">
<input type="text" class="answer" placeholder="Ответ 1" />
<button class="remove-btn" onclick="removeAnswer(this)">✖</button>
</div>
</div>
<div class="actions">
<button onclick="addAnswer(this)">Добавить ответ</button>
</div>`;
container.appendChild(div);
}

function addAnswer(button) {
const answers = button.closest(".question-card").querySelector(".answers");
const index = answers.children.length + 1;
const div = document.createElement("div");
div.className = "answer-line";
div.setAttribute("data-index", index);
div.innerHTML = `
<input type="text" class="answer" placeholder="Ответ ${index}" />
<button class="remove-btn" onclick="removeAnswer(this)">✖</button>`;
answers.appendChild(div);
}

function removeAnswer(button) {
button.parentElement.remove();
}

function removeQuestion(button) {
button.closest(".question-card").remove();
}

function saveTest() {
const testName = document.getElementById("testName").value.trim();
const questions = [];

document.querySelectorAll(".question-card").forEach(card => {
const questionText = card.querySelector(".question").value.trim();
const answers = [];
card.querySelectorAll(".answer").forEach(input => {
const val = input.value.trim();
if (val) answers.push(val);
});

if (questionText && answers.length) {
questions.push({ question: questionText, answers });
}
});

if (testName && questions.length) {
const test = { name: testName, questions };

fetch("/save_test/", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(test)
})
.then(res => res.json())
.then(data => {
document.getElementById("alertMessage").textContent = data.message || "Ошибка сохранения";
document.getElementById("jsonPreview").textContent = JSON.stringify(test, null, 2);
})
.catch(err => {
document.getElementById("alertMessage").textContent = "Ошибка при отправке данных";
console.error(err);
});

} else {
document.getElementById("alertMessage").textContent = "Заполните имя теста и хотя бы один вопрос с ответами.";
}
}

document.addEventListener("DOMContentLoaded", () => addQuestion());
