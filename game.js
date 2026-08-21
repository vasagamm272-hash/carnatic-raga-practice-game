class CarnatiRagaGame {
    constructor() {
        this.score = 0;
        this.level = 'Beginner';
        this.streak = 0;
        this.currentRaga = null;
        this.gameArea = document.getElementById('gameArea');
        this.init();
    }

    init() {
        document.getElementById('learnBtn').addEventListener('click', () => this.showLearnMode());
        document.getElementById('identifyBtn').addEventListener('click', () => this.showIdentifyMode());
        document.getElementById('practiceBtn').addEventListener('click', () => this.showPracticeMode());
        document.getElementById('quizBtn').addEventListener('click', () => this.showQuizMode());
        this.showLearnMode();
    }

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('streak').textContent = this.streak;
        
        if (this.score < 50) {
            this.level = 'Beginner';
        } else if (this.score < 150) {
            this.level = 'Intermediate';
        } else if (this.score < 300) {
            this.level = 'Advanced';
        } else {
            this.level = 'Master';
        }
        document.getElementById('level').textContent = this.level;
    }

    showLearnMode() {
        this.gameArea.innerHTML = '<h2>Learn Ragas</h2>';
        let html = '';
        
        ragas.forEach(raga => {
            html += `
                <div class="raga-card">
                    <h3>${raga.name}</h3>
                    <p><strong>Raga Type:</strong> ${raga.type}</p>
                    <p><strong>Mood:</strong> ${raga.mood}</p>
                    <p><strong>Arohana (Ascending):</strong> ${raga.arohana}</p>
                    <p><strong>Avarohana (Descending):</strong> ${raga.avarohana}</p>
                    <p><strong>Description:</strong> ${raga.description}</p>
                    <div class="swaras">
                        ${raga.swaras.map(s => `<span class="swara">${s}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        this.gameArea.innerHTML += html;
    }

    showIdentifyMode() {
        const raga = ragas[Math.floor(Math.random() * ragas.length)];
        this.currentRaga = raga;
        
        const options = this.generateOptions(raga);
        let html = `
            <div class="question-container">
                <h2>Identify the Raga</h2>
                <p><strong>Arohana:</strong> ${raga.arohana}</p>
                <p><strong>Avarohana:</strong> ${raga.avarohana}</p>
                <p><strong>Mood:</strong> ${raga.mood}</p>
                <div class="options">
                    ${options.map((opt, idx) => `
                        <button class="option-btn" onclick="game.checkIdentifyAnswer('${opt.name}', '${raga.name}', this)">
                            ${opt.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.gameArea.innerHTML = html;
    }

    showPracticeMode() {
        const raga = ragas[Math.floor(Math.random() * ragas.length)];
        this.currentRaga = raga;
        
        let html = `
            <div class="question-container">
                <h2>Practice: ${raga.name}</h2>
                <p><strong>Type:</strong> ${raga.type}</p>
                <p><strong>Arohana:</strong> ${raga.arohana}</p>
                <p><strong>Avarohana:</strong> ${raga.avarohana}</p>
                <h3 style="margin-top: 20px; color: #8B4513;">Swaras (Notes):</h3>
                <div class="swaras" style="margin-top: 15px; font-size: 1.3em;">
                    ${raga.swaras.map(s => `<span class="swara">${s}</span>`).join('')}
                </div>
                <p style="margin-top: 20px; line-height: 1.8;"><strong>Practice Tips:</strong> ${raga.practiceTips}</p>
                <button class="menu-btn" onclick="game.showPracticeMode()" style="margin-top: 20px;">Next Raga</button>
            </div>
        `;
        
        this.gameArea.innerHTML = html;
    }

    showQuizMode() {
        const raga = ragas[Math.floor(Math.random() * ragas.length)];
        this.currentRaga = raga;
        
        const quizTypes = [
            { question: `What is the mood of ${raga.name}?`, answer: raga.mood, options: ['Devotional', 'Romantic', 'Heroic', raga.mood].sort() },
            { question: `What type of raga is ${raga.name}?`, answer: raga.type, options: ['Melakarta', 'Janya', 'Obscure', raga.type].sort() },
            { question: `Which is the arohana of ${raga.name}?`, answer: raga.arohana, options: [raga.arohana, raga.avarohana, 'Sa Ri Ga Ma Pa', 'Different'] }
        ];
        
        const quiz = quizTypes[Math.floor(Math.random() * quizTypes.length)];
        
        let html = `
            <div class="question-container">
                <h2>Quiz</h2>
                <p style="font-size: 1.2em; margin-bottom: 20px;">${quiz.question}</p>
                <div class="options">
                    ${quiz.options.map(opt => `
                        <button class="option-btn" onclick="game.checkQuizAnswer('${opt}', '${quiz.answer}', this)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.gameArea.innerHTML = html;
    }

    generateOptions(correctRaga) {
        const options = [correctRaga];
        const otherRagas = ragas.filter(r => r.name !== correctRaga.name);
        
        for (let i = 0; i < 3; i++) {
            options.push(otherRagas[Math.floor(Math.random() * otherRagas.length)]);
        }
        
        return options.sort(() => Math.random() - 0.5);
    }

    checkIdentifyAnswer(selected, correct, button) {
        if (selected === correct) {
            this.score += 10;
            this.streak++;
            button.classList.add('correct');
            this.gameArea.innerHTML += '<div class="success-message">✓ Correct! Well done!</div>';
        } else {
            this.streak = 0;
            button.classList.add('incorrect');
            this.gameArea.innerHTML += `<div class="error-message">✗ Incorrect! The answer was ${correct}.</div>`;
        }
        
        this.updateStats();
        setTimeout(() => this.showIdentifyMode(), 2000);
    }

    checkQuizAnswer(selected, correct, button) {
        if (selected === correct) {
            this.score += 5;
            this.streak++;
            button.classList.add('correct');
            this.gameArea.innerHTML += '<div class="success-message">✓ Correct!</div>';
        } else {
            this.streak = 0;
            button.classList.add('incorrect');
            this.gameArea.innerHTML += `<div class="error-message">✗ Incorrect! The answer was ${correct}.</div>`;
        }
        
        this.updateStats();
        setTimeout(() => this.showQuizMode(), 2000);
    }
}

const game = new CarnatiRagaGame();