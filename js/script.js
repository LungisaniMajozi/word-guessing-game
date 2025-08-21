document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const wordDisplay = document.getElementById('wordDisplay');
    const categoryName = document.getElementById('categoryName');
    const livesCount = document.getElementById('livesCount');
    const hearts = document.getElementById('hearts');
    const keyboard = document.getElementById('keyboard');
    const message = document.getElementById('message');
    const currentLevel = document.getElementById('currentLevel');
    const score = document.getElementById('score');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
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

    // Game variables
    let selectedDifficulty = 'easy';
    let currentWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let lives = 5;
    let gameLevel = 1;
    let gameScore = 0;
    let currentCategory = '';
    
    // Word lists by difficulty and category
    const wordsByDifficulty = {
        easy: {
            animals: ['cat', 'dog', 'bird', 'fish', 'lion', 'bear', 'wolf', 'frog', 'duck', 'goat'],
            colors: ['red', 'blue', 'pink', 'gray', 'gold', 'lime', 'teal', 'rust', 'beige', 'ivory'],
            fruits: ['apple', 'grape', 'lemon', 'mango', 'peach', 'prune', 'guava', 'olive', 'berry', 'cherry'],
            countries: ['chile', 'peru', 'iran', 'nepal', 'ghana', 'sudan', 'italy', 'france', 'canada', 'japan']
        },
        medium: {
            animals: ['tiger', 'zebra', 'sheep', 'rabbit', 'koala', 'panda', 'otter', 'badger', 'raccoon', 'giraffe'],
            colors: ['purple', 'orange', 'silver', 'crimson', 'coral', 'amber', 'emerald', 'violet', 'turquoise', 'magenta'],
            fruits: ['banana', 'grapes', 'plum', 'kiwi', 'papaya', 'coconut', 'apricot', 'cantaloupe', 'watermelon', 'pineapple'],
            countries: ['brazil', 'germany', 'poland', 'belgium', 'sweden', 'norway', 'finland', 'austria', 'switzerland', 'portugal']
        },
        hard: {
            animals: ['cheetah', 'leopard', 'hippopotamus', 'rhinoceros', 'kangaroo', 'platypus', 'armadillo', 'chimpanzee', 'orangutan', 'porcupine'],
            colors: ['chartreuse', 'fuchsia', 'aquamarine', 'sapphire', 'amethyst', 'scarlet', 'tangerine', 'burgundy', 'olivedrab', 'slategray'],
            fruits: ['pomegranate', 'passionfruit', 'cranberry', 'blackberry', 'raspberry', 'clementine', 'persimmon', 'dragonfruit', 'starfruit', 'ackee'],
            countries: ['australia', 'singapore', 'malaysia', 'newzealand', 'austria', 'croatia', 'luxembourg', 'slovenia', 'madagascar', 'mongolia']
        }
    };

    // Hints for each word
    const hints = {
        // Easy level hints
        'cat': 'A common pet that says "meow"',
        'dog': 'Man\'s best friend',
        'bird': 'Has feathers and can fly',
        'fish': 'Lives in water, has gills',
        'lion': 'King of the jungle',
        'bear': 'Large mammal that hibernates',
        'wolf': 'Lives in packs, howls at the moon',
        'frog': 'Starts as a tadpole, jumps',
        'duck': 'Says "quack", webbed feet',
        'goat': 'Climbs mountains, makes "baa" sound',
        
        'red': 'Color of blood and fire trucks',
        'blue': 'Color of the sky on a sunny day',
        'pink': 'A light shade of red, often associated with romance',
        'gray': 'Between black and white, color of clouds',
        'gold': 'Precious metal, Olympic first place',
        'lime': 'Green citrus fruit',
        'teal': 'Blue-green color, like the bird',
        'rust': 'Color of oxidized iron',
        'beige': 'Light brown, like sand',
        'ivory': 'Color of elephant tusks',
        
        'apple': 'Keeps the doctor away',
        'grape': 'Used to make wine',
        'lemon': 'Sour yellow citrus',
        'mango': 'Tropical fruit with a pit',
        'peach': 'Fuzzy-skinned fruit',
        'prune': 'Dried plum',
        'guava': 'Tropical fruit with small seeds',
        'olive': 'Used to make oil',
        'berry': 'Small juicy fruit',
        'cherry': 'Small red fruit with a pit',
        
        'chile': 'Long South American country between the Andes and the Pacific',
        'peru': 'Home of Machu Picchu',
        'iran': 'Formerly known as Persia',
        'nepal': 'Home of Mount Everest',
        'ghana': 'West African country known for gold and cocoa',
        'sudan': 'Northeast African country along the Nile',
        'italy': 'Shaped like a boot',
        'france': 'Home of the Eiffel Tower',
        'canada': 'Second largest country by area',
        'japan': 'Island nation in East Asia',
        
        // Medium level hints
        'tiger': 'Striped big cat',
        'zebra': 'Black and white striped animal',
        'sheep': 'Provides wool, says "baa"',
        'rabbit': 'Hops, has long ears',
        'koala': 'Australian animal that eats eucalyptus',
        'panda': 'Black and white bear from China',
        'otter': 'Playful aquatic mammal',
        'badger': 'Burrowing animal with distinctive face markings',
        'raccoon': 'Washes its food, masked face',
        'giraffe': 'Tallest land animal',
        
        'purple': 'Mix of red and blue, royal color',
        'orange': 'Fruit and color',
        'silver': 'Precious metal, second place in Olympics',
        'crimson': 'Deep red color',
        'coral': 'Reef-building marine invertebrate',
        'amber': 'Fossilized tree resin',
        'emerald': 'Green precious stone',
        'violet': 'Purple flower',
        'turquoise': 'Blue-green gemstone',
        'magenta': 'Bright pinkish-purple color',
        
        'banana': 'Yellow fruit, monkeys love it',
        'grapes': 'Grows in bunches, used for wine',
        'plum': 'Purple fruit with a pit',
        'kiwi': 'Brown fuzzy fruit with green flesh',
        'papaya': 'Tropical fruit with black seeds',
        'coconut': 'Large brown tropical fruit with water inside',
        'apricot': 'Orange fruit similar to a peach',
        'cantaloupe': 'Orange-fleshed melon',
        'watermelon': 'Large green fruit with red flesh',
        'pineapple': 'Tropical fruit with spiky skin',
        
        'brazil': 'Largest country in South America',
        'germany': 'In the heart of Europe',
        'poland': 'In Central Europe, borders Germany',
        'belgium': 'Home of waffles and EU institutions',
        'sweden': 'Nordic country known for IKEA',
        'norway': 'Famous for its fjords',
        'finland': 'Land of a thousand lakes',
        'austria': 'Home of Vienna and the Alps',
        'switzerland': 'Famous for chocolate and banks',
        'portugal': 'Westernmost country in Europe',
        
        // Hard level hints
        'cheetah': 'Fastest land animal',
        'leopard': 'Spotted big cat that climbs trees',
        'hippopotamus': 'Large semi-aquatic African mammal',
        'rhinoceros': 'Large mammal with one or two horns',
        'kangaroo': 'Australian marsupial that hops',
        'platypus': 'Australian mammal that lays eggs',
        'armadillo': 'Mammal with a leathery shell',
        'chimpanzee': 'Primate closely related to humans',
        'orangutan': 'Red-haired ape from Borneo and Sumatra',
        'porcupine': 'Rodent with quills',
        
        'chartreuse': 'Yellow-green color, also a liqueur',
        'fuchsia': 'Vivid purplish-red color',
        'aquamarine': 'Blue-green gemstone',
        'sapphire': 'Blue precious stone',
        'amethyst': 'Purple quartz',
        'scarlet': 'Brilliant red with a slight orange tinge',
        'tangerine': 'Orange citrus fruit and color',
        'burgundy': 'Dark red wine color',
        'olivedrab': 'Olive green military color',
        'slategray': 'Gray with a blue tinge, like slate stone',
        
        'pomegranate': 'Fruit with many red seeds',
        'passionfruit': 'Tropical fruit with a wrinkled skin',
        'cranberry': 'Red tart fruit used in Thanksgiving sauce',
        'blackberry': 'Dark fruit that grows on brambles',
        'raspberry': 'Red fruit that grows on brambles',
        'clementine': 'Small easy-to-peel orange',
        'persimmon': 'Orange fruit with a sweet taste',
        'dragonfruit': 'Exotic fruit with green scales',
        'starfruit': 'Fruit that looks like a star when sliced',
        'ackee': 'Jamaican fruit, national fruit',
        
        'australia': 'Country and continent surrounded by oceans',
        'singapore': 'City-state in Southeast Asia',
        'malaysia': 'Southeast Asian country with Kuala Lumpur',
        'newzealand': 'Island nation with Maori culture',
        'austria': 'Alpine country with Vienna as capital',
        'croatia': 'European country with a jagged coastline',
        'luxembourg': 'Small European country between France and Germany',
        'slovenia': 'European country bordering Italy',
        'madagascar': 'Island nation off the coast of Africa',
        'mongolia': 'Landlocked country between China and Russia'
    };

    // Create keyboard
    function createKeyboard() {
        keyboard.innerHTML = '';
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        
        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.classList.add('key');
            button.textContent = letter;
            button.addEventListener('click', () => handleKeyPress(letter));
            keyboard.appendChild(button);
        });
    }

    // Initialize game
    function initGame() {
        // Reset game state
        correctLetters = [];
        wrongLetters = [];
        lives = 5;
        livesCount.textContent = lives;
        
        // Update hearts display
        Array.from(hearts.children).forEach((heart, index) => {
            heart.style.opacity = index < lives ? 1 : 0.3;
        });
        
        // Get random category
        const categories = Object.keys(wordsByDifficulty[selectedDifficulty]);
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        categoryName.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        
        // Get random word from selected category and difficulty
        const words = wordsByDifficulty[selectedDifficulty][currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
        
        // Reveal some letters at the beginning based on difficulty
        revealStartingLetters();
        
        // Display word with underscores
        displayWord();
        
        // Clear message
        showMessage('', '');
        
        // Enable keyboard
        enableKeyboard();
    }

    // Reveal some letters at the beginning of the game
    function revealStartingLetters() {
        // Clear any previously revealed letters
        correctLetters = [];
        
        // Determine how many letters to reveal based on difficulty and word length
        const wordLength = currentWord.length;
        let lettersToReveal;
        
        if (selectedDifficulty === 'easy') {
            // Easy: reveal 30-50% of letters, but at least 1 and no more than 3
            lettersToReveal = Math.min(3, Math.max(1, Math.floor(wordLength * 0.4)));
        } else if (selectedDifficulty === 'medium') {
            // Medium: reveal 20-30% of letters, but at least 1 and no more than 2
            lettersToReveal = Math.min(2, Math.max(1, Math.floor(wordLength * 0.25)));
        } else {
            // Hard: reveal 10-20% of letters, but at least 1
            lettersToReveal = Math.max(1, Math.floor(wordLength * 0.15));
        }
        
        // Get unique letters in the word
        const uniqueLetters = [...new Set(currentWord.split(''))];
        
        // Always reveal vowels if they exist in the word (makes it easier to start)
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const wordVowels = uniqueLetters.filter(letter => vowels.includes(letter));
        
        // Add vowels to correctLetters
        wordVowels.forEach(vowel => {
            if (!correctLetters.includes(vowel)) {
                correctLetters.push(vowel);
            }
        });
        
        // If we still need more letters, add consonants
        const consonants = uniqueLetters.filter(letter => !vowels.includes(letter));
        const shuffledConsonants = shuffleArray(consonants);
        
        // Add additional consonants if needed
        const additionalNeeded = lettersToReveal - correctLetters.length;
        if (additionalNeeded > 0) {
            for (let i = 0; i < Math.min(additionalNeeded, shuffledConsonants.length); i++) {
                if (!correctLetters.includes(shuffledConsonants[i])) {
                    correctLetters.push(shuffledConsonants[i]);
                }
            }
        }
        
        // Special case: if word is very short (2-3 letters), ensure at least one letter is shown
        if (correctLetters.length === 0 && wordLength <= 3) {
            // For very short words, reveal one random letter
            correctLetters.push(shuffledConsonants[0] || wordVowels[0]);
        }
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Display word with underscores for unguessed letters
    function displayWord() {
        wordDisplay.innerHTML = currentWord
            .split('')
            .map(letter => 
                `<span class="letter ${correctLetters.includes(letter) ? 'letter-reveal' : ''}">` +
                (correctLetters.includes(letter) ? letter : '_') + 
                '</span>'
            )
            .join(' ');
    }

    // Handle key press
    function handleKeyPress(letter) {
        const keyElement = [...keyboard.children].find(k => k.textContent === letter);
        
        if (keyElement.classList.contains('used')) return;
        
        const letterUpper = letter.toUpperCase();
        
        if (currentWord.includes(letterUpper)) {
            if (!correctLetters.includes(letterUpper)) {
                correctLetters.push(letterUpper);
                keyElement.classList.add('correct');
                showMessage('Correct!', 'success');
                
                // Check if word is complete
                if (checkWin()) {
                    gameScore += lives * 10;
                    score.textContent = gameScore;
                    
                    if (gameLevel % 3 === 0) {
                        // Every 3 levels, increase difficulty
                        if (selectedDifficulty === 'easy' && gameLevel === 3) {
                            selectedDifficulty = 'medium';
                            updateDifficultyButtons();
                        } else if (selectedDifficulty === 'medium' && gameLevel === 6) {
                            selectedDifficulty = 'hard';
                            updateDifficultyButtons();
                        }
                    }
                    
                    setTimeout(() => {
                        completedLevel.textContent = `Level ${gameLevel}`;
                        levelScore.textContent = gameScore;
                        levelUpModal.classList.add('show');
                    }, 1000);
                }
            } else {
                showMessage('You already guessed that!', 'warning');
            }
        } else {
            if (!wrongLetters.includes(letterUpper)) {
                wrongLetters.push(letterUpper);
                lives--;
                livesCount.textContent = lives;
                
                // Update hearts
                Array.from(hearts.children).forEach((heart, index) => {
                    heart.style.opacity = index < lives ? 1 : 0.3;
                });
                
                keyElement.classList.add('wrong');
                showMessage('Wrong!', 'error');
                
                // Check if game over
                if (lives <= 0) {
                    endGame(false);
                }
            } else {
                showMessage('You already tried that!', 'warning');
            }
        }
        
        // Mark key as used
        keyElement.classList.add('used');
        keyElement.disabled = true;
        
        // Update word display
        displayWord();
    }

    // Check if player has won
    function checkWin() {
        return [...currentWord].every(letter => correctLetters.includes(letter));
    }

    // End game
    function endGame(victory) {
        disableKeyboard();
        
        if (victory) {
            showMessage('You won!', 'success');
        } else {
            // Reveal the word
            correctLetters = [...new Set([...currentWord])];
            displayWord();
            revealedWord.textContent = currentWord;
            finalScore.textContent = gameScore;
            gameOverModal.classList.add('show');
        }
    }

    // Show message
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type} show`;
        
        // Hide message after 3 seconds
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // Disable keyboard
    function disableKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.disabled = true;
            key.classList.add('used');
        });
    }

    // Enable keyboard
    function enableKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.disabled = false;
            key.classList.remove('correct', 'wrong', 'used');
        });
    }

    // Create confetti effect
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = Math.random() * 100 + 'vh';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { 
                    transform: `translate(0, 0) rotate(0deg)`, 
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.1)'
            });
            
            animation.onfinish = () => {
                document.body.removeChild(confetti);
            };
        }
    }

    // Update difficulty buttons
    function updateDifficultyButtons() {
        difficultyButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.level === selectedDifficulty) {
                btn.classList.add('active');
            }
        });
    }

    // Event Listeners
    // Difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedDifficulty = this.dataset.level;
            
            // Reset game with new difficulty
            gameLevel = 1;
            gameScore = 0;
            currentLevel.textContent = gameLevel;
            score.textContent = gameScore;
            initGame();
        });
    });

    // New game button
    newGameBtn.addEventListener('click', function() {
        gameLevel = 1;
        gameScore = 0;
        currentLevel.textContent = gameLevel;
        score.textContent = gameScore;
        
        // Reset to easy if not already
        if (selectedDifficulty !== 'easy') {
            selectedDifficulty = 'easy';
            updateDifficultyButtons();
        }
        
        initGame();
    });

    // Hint button
    hintBtn.addEventListener('click', function() {
        if (hints[currentWord.toLowerCase()]) {
            showMessage(`Hint: ${hints[currentWord.toLowerCase()]}`, 'warning');
        } else {
            showMessage('No hint available', 'error');
        }
    });

    // Level up modal
    nextLevelBtn.addEventListener('click', function() {
        levelUpModal.classList.remove('show');
        gameLevel++;
        currentLevel.textContent = gameLevel;
        
        // Increase score bonus for level completion
        gameScore += 50;
        score.textContent = gameScore;
        
        initGame();
    });

    // Game over modal
    playAgainBtn.addEventListener('click', function() {
        gameOverModal.classList.remove('show');
        gameLevel = 1;
        gameScore = 0;
        currentLevel.textContent = gameLevel;
        score.textContent = gameScore;
        
        // Reset to easy if not already
        if (selectedDifficulty !== 'easy') {
            selectedDifficulty = 'easy';
            updateDifficultyButtons();
        }
        
        initGame();
    });

    // Close modals if clicked outside
    [levelUpModal, gameOverModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Initialize the game
    createKeyboard();
    initGame();

    // Add floating animation to container
    let animationFrame;
    function floatAnimation() {
        const container = document.querySelector('.container');
        const offset = Math.sin(Date.now() / 1000) * 5;
        container.style.transform = `translateY(${offset}px)`;
        animationFrame = requestAnimationFrame(floatAnimation);
    }
    floatAnimation();

    // Clean up animation on page hide
    window.addEventListener('beforeunload', function() {
        cancelAnimationFrame(animationFrame);
    });
});