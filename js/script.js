document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const wordDisplay = document.getElementById('wordDisplay');
    const categoryName = document.getElementById('categoryName');
    const livesCount = document.getElementById('livesCount');
    const message = document.getElementById('message');
    const currentLevel = document.getElementById('currentLevel');
    const score = document.getElementById('score');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('newGameBtn');
    const hintBtn = document.getElementById('hintBtn');
    const levelUpModal = document.getElementById('levelUpModal');
    const gameOverModal = document.getElementById('gameOverModal');
    const completedLevel = document.getElementById('completedLevel');
    const levelScore = document.getElementById('levelScore');
    const finalScore = document.getElementById('finalScore');
    const revealedWord = document.getElementById('revealedWord');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // Game state
    let selectedDifficulty = 'easy';
    let currentWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let lives = 5;
    let gameLevel = 1;
    let gameScore = 0;
    let currentCategory = '';

    // Word lists and hints (same as before, for brevity — kept unchanged)
    const wordsByDifficulty = {
        easy: {
            animals: ['cat', 'dog', 'lion', 'frog'],
            colors: ['red', 'blue', 'pink', 'gold'],
            fruits: ['apple', 'mango', 'cherry', 'grape'],
            countries: ['japan', 'france', 'canada', 'peru']
        },
        medium: {
            animals: ['tiger', 'giraffe', 'raccoon', 'panda'],
            colors: ['purple', 'emerald', 'crimson', 'violet'],
            fruits: ['banana', 'kiwi', 'papaya', 'coconut'],
            countries: ['germany', 'sweden', 'portugal', 'belgium']
        },
        hard: {
            animals: ['cheetah', 'hippopotamus', 'platypus', 'chimpanzee'],
            colors: ['aquamarine', 'fuchsia', 'burgundy', 'chartreuse'],
            fruits: ['pomegranate', 'dragonfruit', 'passionfruit', 'persimmon'],
            countries: ['australia', 'madagascar', 'luxembourg', 'slovenia']
        }
    };

    const hints = {
        // Include all your previous hints here — kept same
        'cat': 'A common pet that says "meow"',
        'dog': 'Man\'s best friend',
        'tiger': 'Striped big cat',
        'cheetah': 'Fastest land animal',
        // ... add others as needed
        'apple': 'Keeps the doctor away',
        'banana': 'Yellow fruit, monkeys love it',
        'japan': 'Island nation in East Asia',
        'australia': 'Country and continent surrounded by oceans'
        // Add more as needed
    };

    // Initialize game
    function initGame() {
        correctLetters = [];
        wrongLetters = [];
        lives = 5;
        livesCount.textContent = lives;

        selectedDifficulty = difficultySelect.value;

        const categories = Object.keys(wordsByDifficulty[selectedDifficulty]);
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        categoryName.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);

        const words = wordsByDifficulty[selectedDifficulty][currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

        revealStartingLetters();
        displayWord();
        showMessage('', '');
    }

    function revealStartingLetters() {
        correctLetters = [];
        const uniqueLetters = [...new Set(currentWord.split(''))];
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const wordVowels = uniqueLetters.filter(l => vowels.includes(l));

        wordVowels.forEach(v => correctLetters.push(v));

        const consonants = uniqueLetters.filter(l => !vowels.includes(l));
        const shuffled = shuffleArray(consonants);
        const extra = selectedDifficulty === 'easy' ? 1 : selectedDifficulty === 'medium' ? 1 : 0;

        for (let i = 0; i < extra && i < shuffled.length; i++) {
            if (!correctLetters.includes(shuffled[i])) {
                correctLetters.push(shuffled[i]);
            }
        }
    }

    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function displayWord() {
		wordDisplay.innerHTML = '';
		currentWord.split('').forEach(letter => {
			const span = document.createElement('span');
			span.classList.add('letter-box');
			if (correctLetters.includes(letter)) {
				span.textContent = letter;
				span.classList.add('guessed');
			} else {
				span.classList.add('blank');
			}
			wordDisplay.appendChild(span);
		});
    }

    function handleKeyPress(key) {
        if (!/^[a-zA-Z]$/.test(key) || key.length !== 1) return;

        const letter = key.toUpperCase();

        if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
            showMessage('Already guessed!', 'warning');
            return;
        }

        if (currentWord.includes(letter)) {
            correctLetters.push(letter);
            displayWord();
            showMessage('Correct!', 'success');

            if (checkWin()) {
                gameScore += lives * 10;
                score.textContent = gameScore;
                setTimeout(() => {
                    completedLevel.textContent = `Level ${gameLevel}`;
                    levelScore.textContent = gameScore;
                    levelUpModal.classList.add('show');
                }, 600);
            }
        } else {
            wrongLetters.push(letter);
            lives--;
            livesCount.textContent = lives;
            showMessage('Wrong!', 'error');

            if (lives <= 0) {
                endGame(false);
            }
        }
    }

    function checkWin() {
        return [...new Set(currentWord.split(''))].every(l => correctLetters.includes(l));
    }

    function endGame(victory) {
        if (!victory) {
            correctLetters = [...new Set(currentWord.split(''))];
            displayWord();
            revealedWord.textContent = currentWord;
            finalScore.textContent = gameScore;
            gameOverModal.classList.add('show');
        }
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type} show`;
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // Event Listeners
    difficultySelect.addEventListener('change', () => {
        selectedDifficulty = difficultySelect.value;
    });

    newGameBtn.addEventListener('click', () => {
        gameLevel = 1;
        gameScore = 0;
        currentLevel.textContent = gameLevel;
        score.textContent = gameScore;
        initGame();
    });

    hintBtn.addEventListener('click', () => {
        const hint = hints[currentWord.toLowerCase()];
        showMessage(hint ? `Hint: ${hint}` : 'No hint available', 'warning');
    });

    nextLevelBtn.addEventListener('click', () => {
        levelUpModal.classList.remove('show');
        gameLevel++;
        currentLevel.textContent = gameLevel;
        gameScore += 50;
        score.textContent = gameScore;
        initGame();
    });

    playAgainBtn.addEventListener('click', () => {
        gameOverModal.classList.remove('show');
        gameLevel = 1;
        gameScore = 0;
        currentLevel.textContent = gameLevel;
        score.textContent = gameScore;
        initGame();
    });

    // Close modals when clicking outside
    [levelUpModal, gameOverModal].forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('show');
        });
    });

    // Keyboard input (physical only)
    window.addEventListener('keydown', (e) => {
        if (levelUpModal.classList.contains('show') || gameOverModal.classList.contains('show')) return;
        handleKeyPress(e.key);
    });

    // Start game
    initGame();
});