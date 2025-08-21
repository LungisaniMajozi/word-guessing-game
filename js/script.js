document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const wordDisplay = document.getElementById('wordDisplay');
    const categoryName = document.getElementById('categoryName');
    const livesCount = document.getElementById('livesCount');
    const message = document.getElementById('message');
    const mobileToast = document.getElementById('mobileToast');
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

    // Hidden input for mobile keyboard
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.autocapitalize = 'none';
    hiddenInput.autocorrect = 'off';
    hiddenInput.spellcheck = 'false';
    hiddenInput.maxLength = '1';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    hiddenInput.style.height = '0';
    hiddenInput.style.width = '0';
    hiddenInput.style.fontSize = '1px';
    document.body.appendChild(hiddenInput);

    // Focus input on tap/click (mobile)
    document.querySelector('.container').addEventListener('touchstart', (e) => {
        if (!levelUpModal.classList.contains('show') && !gameOverModal.classList.contains('show')) {
            hiddenInput.focus();
        }
    });

    document.querySelector('.container').addEventListener('click', (e) => {
        const container = document.querySelector('.container');
        if (e.target === container || container.contains(e.target)) {
            if (!levelUpModal.classList.contains('show') && !gameOverModal.classList.contains('show')) {
                hiddenInput.focus();
            }
        }
    });

    // Game state
    let selectedDifficulty = 'easy';
    let currentWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let lives = 5;
    let gameLevel = 1;
    let gameScore = 0;
    let currentCategory = '';

    // Word lists
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

    // Complete hints
    const hints = {
        'cat': 'A common pet that says "meow"',
        'dog': 'Man\'s best friend',
        'lion': 'King of the jungle',
        'frog': 'Starts as a tadpole, jumps high',
        'red': 'Color of fire trucks and hearts',
        'blue': 'Color of the sky on a clear day',
        'pink': 'Soft romantic color, like a flower',
        'gold': 'Shiny precious metal, first prize',
        'apple': 'Keeps the doctor away',
        'mango': 'Tropical fruit with sweet golden flesh',
        'cherry': 'Small red fruit with a pit',
        'grape': 'Grows in bunches, used for wine',
        'japan': 'Island nation in East Asia',
        'france': 'Famous for the Eiffel Tower',
        'canada': 'Known for maple syrup and politeness',
        'peru': 'Home of Machu Picchu',
        'tiger': 'Striped big cat, orange and black',
        'giraffe': 'Tallest animal, long neck',
        'raccoon': 'Washes food, masked bandit',
        'panda': 'Black and white bear from China',
        'purple': 'Mix of red and blue, royal color',
        'emerald': 'Green precious gemstone',
        'crimson': 'Deep red, like royal robes',
        'violet': 'Purple flower or color',
        'banana': 'Yellow fruit, monkeys love it',
        'kiwi': 'Brown fuzzy fruit with green inside',
        'coconut': 'Big tropical fruit with water inside',
        'papaya': 'Orange tropical fruit with black seeds',
        'germany': 'In central Europe, known for cars',
        'sweden': 'Home of IKEA and ABBA',
        'portugal': 'Westernmost country in Europe',
        'belgium': 'Famous for chocolate and waffles',
        'cheetah': 'Fastest land animal',
        'hippopotamus': 'Large river animal, dangerous',
        'platypus': 'Weird mammal that lays eggs',
        'chimpanzee': 'Smart primate, close to humans',
        'aquamarine': 'Blue-green gemstone or ocean color',
        'fuchsia': 'Bright pink-purple color',
        'burgundy': 'Dark red wine color',
        'chartreuse': 'Yellow-green color, rare and bold',
        'pomegranate': 'Fruit full of red juicy seeds',
        'dragonfruit': 'Exotic fruit with pink skin and green scales',
        'persimmon': 'Sweet orange fruit, a bit like apricot',
        'passionfruit': 'Tart tropical fruit with many seeds',
        'australia': 'Land of kangaroos and koalas',
        'madagascar': 'Island with unique lemurs',
        'luxembourg': 'Small rich country in Europe',
        'slovenia': 'Beautiful Alpine country near Italy'
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

    // Smart message: shows on top (mobile) or center (desktop)
    function showMessage(text, type) {
        // Mobile toast (top of screen)
        mobileToast.textContent = text;
        mobileToast.className = `mobile-toast ${type} show`;

        // Desktop message (center)
        if (window.innerWidth >= 768) {
            message.textContent = text;
            message.className = `message ${type} show`;
            setTimeout(() => {
                message.classList.remove('show');
            }, 4000);
        }

        // Auto-hide mobile toast
        setTimeout(() => {
            mobileToast.classList.remove('show');
        }, 4000);
    }

    // Event Listeners
    hiddenInput.addEventListener('input', (e) => {
        const key = e.data;
        if (key) handleKeyPress(key);
        hiddenInput.value = '';
    });

    window.addEventListener('keydown', (e) => {
        if (levelUpModal.classList.contains('show') || gameOverModal.classList.contains('show')) return;
        handleKeyPress(e.key);
    });

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
        if (hint) {
            showMessage(`💡 ${hint}`, 'warning');
        } else {
            showMessage('🔍 No hint available', 'error');
        }
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

    [levelUpModal, gameOverModal].forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('show');
        });
    });

    // Start game
    initGame();
});