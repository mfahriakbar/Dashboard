const board = document.getElementById('sudoku-board');
        const checkButton = document.getElementById('check');
        const newGameButton = document.getElementById('new-game');
        const backToMenuButton = document.getElementById('back-to-menu');
        const timerElement = document.getElementById('timer');
        const messageElement = document.getElementById('message');
        const landingPage = document.getElementById('landing-page');
        const gamePage = document.getElementById('game-page');

        let timer;
        let timeLeft = 600;
        let currentPuzzle;
        let solution;
        let currentDifficulty;

        function generateSudoku(difficulty) {
            const seed = Math.random().toString();
            const rng = new Math.seedrandom(seed);
            
            const solvedPuzzle = Array(9).fill().map(() => Array(9).fill(0));
            fillSudoku(solvedPuzzle, 0, 0);
            
            const puzzle = JSON.parse(JSON.stringify(solvedPuzzle));
            
            const numbersToRemove = difficulty === 'easy' ? 30 : (difficulty === 'medium' ? 40 : 50);
            for (let i = 0; i < numbersToRemove; i++) {
                let row, col;
                do {
                    row = Math.floor(rng() * 9);
                    col = Math.floor(rng() * 9);
                } while (puzzle[row][col] === 0);
                puzzle[row][col] = 0;
            }
            
            return { puzzle, solution: solvedPuzzle };
        }

        function fillSudoku(grid, row, col) {
            if (col === 9) {
                row++;
                col = 0;
            }
            if (row === 9) return true;
            
            if (grid[row][col] !== 0) return fillSudoku(grid, row, col + 1);
            
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = numbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }
            
            for (let num of numbers) {
                if (isValid(grid, row, col, num)) {
                    grid[row][col] = num;
                    if (fillSudoku(grid, row, col + 1)) return true;
                    grid[row][col] = 0;
                }
            }
            return false;
        }

        function isValid(grid, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (grid[row][x] === num) return false;
            }
            for (let x = 0; x < 9; x++) {
                if (grid[x][col] === num) return false;
            }
            let startRow = row - row % 3, startCol = col - col % 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i + startRow][j + startCol] === num) return false;
                }
            }
            return true;
        }

        function renderBoard() {
            board.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    if (currentPuzzle[i][j] !== 0) {
                        cell.textContent = currentPuzzle[i][j];
                        cell.classList.add('fixed');
                    } else {
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.min = 1;
                        input.max = 9;
                        cell.appendChild(input);
                    }
                    board.appendChild(cell);
                }
            }
        }

        function startTimer() {
            clearInterval(timer);
            timeLeft = 600;
            updateTimerDisplay();
            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    messageElement.textContent = 'Waktu habis!';
                    disableInputs();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function checkSolution() {
            const inputs = board.querySelectorAll('.cell');
            let correct = true;
            inputs.forEach((cell, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                let cellValue;
                if (cell.classList.contains('fixed')) {
                    cellValue = parseInt(cell.textContent);
                } else {
                    const input = cell.querySelector('input');
                    cellValue = input.value ? parseInt(input.value) : 0;
                }
                if (cellValue !== solution[row][col]) {
                    correct = false;
                    if (!cell.classList.contains('fixed')) {
                        cell.querySelector('input').style.color = 'red';
                    }
                } else {
                    if (!cell.classList.contains('fixed')) {
                        cell.querySelector('input').style.color = 'green';
                    }
                }
            });
            if (correct) {
                clearInterval(timer);
                messageElement.textContent = 'Selamat! Anda telah menyelesaikan puzzle!';
                updateHighScore();
            } else {
                messageElement.textContent = 'Ada beberapa kesalahan. Coba lagi!';
            }
        }

        function disableInputs() {
            const inputs = board.querySelectorAll('input');
            inputs.forEach(input => input.disabled = true);
        }

        function updateHighScore() {
            const currentScore = 600 - timeLeft; // Lower score is better
            const highScore = localStorage.getItem(`highScore_${currentDifficulty}`);
            if (!highScore || currentScore < parseInt(highScore)) {
                localStorage.setItem(`highScore_${currentDifficulty}`, currentScore);
                messageElement.textContent += ` Skor tertinggi baru untuk tingkat ${currentDifficulty}!`;
            }
        }

        function startNewGame() {
            ({ puzzle: currentPuzzle, solution } = generateSudoku(currentDifficulty));
            renderBoard();
            startTimer();
            messageElement.textContent = '';
        }

        function startGame(difficulty) {
            currentDifficulty = difficulty;
            landingPage.classList.add('hidden');
            gamePage.classList.remove('hidden');
            startNewGame();
        }

        function backToMenu() {
            clearInterval(timer);
            gamePage.classList.add('hidden');
            landingPage.classList.remove('hidden');
        }

        checkButton.addEventListener('click', checkSolution);
        newGameButton.addEventListener('click', startNewGame);
        backToMenuButton.addEventListener('click', backToMenu);