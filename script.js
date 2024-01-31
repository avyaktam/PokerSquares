let deck, board, currentCard, totalScore = 0, gameStarted = false;
let scoredRows = new Set();
let scoredColumns = new Set();

function initializeGame() {
    deck = createDeck();
    shuffle(deck);
    board = Array(5).fill().map(() => Array(5).fill(null));
    currentCard = deck.pop();
    displayCurrentCard();
    updateScore(0);
    gameStarted = false;
    document.getElementById('deck-img').src = 'cards/Backside.png';
    scoredRows.clear();
    scoredColumns.clear();
}
function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dealCard() {
    return deck.pop();
}

function calculateScore() {
    let totalScore = 0;
    // Calculate scores for each row and column
    return totalScore;
}

// Functions to evaluate poker hands and assign points according to the American point system
document.getElementById('board').addEventListener('click', function(e) {
    if (e.target.classList.contains('card-slot') && !e.target.textContent) {
        let card = dealCard();
        placeCard(e);
        e.target.textContent = `${card.rank} of ${card.suit}`;
        let rowIndex = parseInt(e.target.dataset.row);
        let columnIndex = parseInt(e.target.dataset.column);
        board[rowIndex][columnIndex] = card;
        if (deck.length === 0) {
            calculateScore();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.getElementById('deck').addEventListener('click', drawNextCard);
    document.getElementById('restart-button').addEventListener('click', restartGame);
});

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault(); // This allows us to drop.
}

function onDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    
    // Logic to move the image from the deck to the card slot
    // and to handle the card placement in the game's logic

    event.dataTransfer.clearData();
}



function evaluateHand(hand) {
    // Filter out null values (unfilled slots)
    hand = hand.filter(card => card); 
    if (hand.length !== 5) return { score: 0, hand: 'Incomplete' };
    // Sorting the hand by rank
    hand.sort((a, b) => getCardValue(a.rank) - getCardValue(b.rank));

    // Check for each type of hand
    if (isRoyalFlush(hand)) return { score: 30, hand: 'Royal Flush' };
    if (isStraightFlush(hand)) return { score: 30, hand: 'Straight Flush' };
    if (isFourOfAKind(hand)) return { score: 16, hand: 'Four Of A Kind' };
    if (isFullHouse(hand)) return { score: 10, hand: 'Full House' };
    if (isFlush(hand)) return { score: 5, hand: 'Flush' };
    if (isStraight(hand)) return { score: 12, hand: 'Straight' };
    if (isThreeOfAKind(hand)) return { score: 6, hand: 'Three Of A Kind' };
    if (isTwoPair(hand)) return { score: 3, hand: 'Two Pair' };
    if (isOnePair(hand)) return { score: 1, hand: 'One Pair' };

    return { score: 0, hand: 'No Hand' };
}


function getCardValue(rank) {
    // Returns a numerical value for each card rank for sorting
    const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    return values[rank];
}

function isRoyalFlush(hand) {
    return isStraightFlush(hand) && hand[4].rank === 'A';
}


function isStraightFlush(hand) {
    return isFlush(hand) && isStraight(hand);
}

function isFourOfAKind(hand) {
    // Check if four cards have the same rank
    for (let i = 0; i < 2; i++) {
        if (hand[i].rank === hand[i + 1].rank &&
            hand[i].rank === hand[i + 2].rank &&
            hand[i].rank === hand[i + 3].rank) {
            return true;
        }
    }
    return false;
}

function isFullHouse(hand) {
    // Check for three of a kind and a pair
    let firstThreeSame = hand[0].rank === hand[1].rank && hand[1].rank === hand[2].rank;
    let lastTwoSame = hand[3].rank === hand[4].rank;
    let firstTwoSame = hand[0].rank === hand[1].rank;
    let lastThreeSame = hand[2].rank === hand[3].rank && hand[3].rank === hand[4].rank;

    return (firstThreeSame && lastTwoSame) || (firstTwoSame && lastThreeSame);
}

function isFlush(hand) {
    // Check if all cards have the same suit
    return hand.every(card => card.suit === hand[0].suit);
}

function isStraight(hand) {
    if (hand[0].rank === '2' && hand[1].rank === '3' && hand[2].rank === '4' && hand[3].rank === '5' && hand[4].rank === 'A') {
        return true; // Special case for Ace-low straight
    }

    for (let i = 0; i < 4; i++) {
        if (getCardValue(hand[i].rank) + 1 !== getCardValue(hand[i + 1].rank)) {
            return false;
        }
    }
    return true;
}


function isThreeOfAKind(hand) {
    // Check if three cards have the same rank
    for (let i = 0; i < 3; i++) {
        if (hand[i].rank === hand[i + 1].rank && hand[i].rank === hand[i + 2].rank) {
            return true;
        }
    }
    return false;
}

function isTwoPair(hand) {
    // Check if there are two different pairs
    let pairs = 0;
    for (let i = 0; i < 4; i++) {
        if (hand[i].rank === hand[i + 1].rank) {
            pairs++;
            i++; // Skip the next card
        }
    }
    return pairs === 2;
}

function isOnePair(hand) {
    // Check if there is a pair
    for (let i = 0; i < 4; i++) {
        if (hand[i].rank === hand[i + 1].rank) {
            return true;
        }
    }
    return false;
}

function createBoard() {
    let boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let cardSlot = document.createElement('div');
            cardSlot.classList.add('card-slot');
            cardSlot.dataset.row = i;
            cardSlot.dataset.column = j;
            cardSlot.addEventListener('dragover', handleDragOver);
            cardSlot.addEventListener('drop', handleDrop);

            let cardImage = document.createElement('img');
            cardImage.src = './cards/blank.png'; // Set the blank image for each slot
            cardImage.classList.add('card-img');
            cardSlot.appendChild(cardImage);
            boardElement.appendChild(cardSlot);
        }
    }
}

function drawNextCard() {
    if (!gameStarted && deck.length > 0) {
        gameStarted = true; // Start the game
        currentCard = deck.pop(); // Get the first card from the deck
        displayCurrentCard();
    }
}

function displayCurrentCard() {
    let deckImage = document.getElementById('deck-img');
    if (currentCard) {
        deckImage.src = `./cards/${currentCard.suit}_${currentCard.rank}.png`;
    } else {
        // This ensures the backside image is shown if there are no more cards to draw
        deckImage.src = './cards/Backside.png';
    }
}
function endGame() {
    // Ensure this function is called only when the game is truly over
    if (isBoardFull()) {
        let endMessage;
        if (totalScore >= 70) {
            endMessage = `Score: ${totalScore} YOU WIN!`;
        } else {
            endMessage = `Score: ${totalScore} YOU LOSE.`;
        }
        console.log(endMessage); // Debug: Check the message in console
        document.getElementById('score').textContent = endMessage;
        
        // Reset the deck image back to the backside image
        document.getElementById('deck-img').src = './cards/Backside.png';
    } else {
        console.log('Board is not full yet.'); // Debug: Inform that the game is not over yet
    }
}

// Adjust the logic where cards are placed to ensure endGame is called appropriately
function placeCard(event) {
    let cardImage = event.target.closest('.card-slot').querySelector('.card-img');
    if (gameStarted && cardImage.src.includes('blank') && currentCard) {
        // Logic to update the board state and image...
        let rowIndex = parseInt(cardImage.parentNode.dataset.row);
        let columnIndex = parseInt(cardImage.parentNode.dataset.column);
        board[rowIndex][columnIndex] = currentCard;
        cardImage.src = `./cards/${currentCard.suit}_${currentCard.rank}.png`;
        currentCard = deck.length > 0 ? deck.pop() : null; // Get the next card or null if the deck is empty
        displayCurrentCard();

        // Update score and check if the game has ended
        updateScore(rowIndex, columnIndex);
    }
}

function dealCardToBoard(event) {
    let cardImage = event.target.tagName === 'IMG' ? event.target : event.target.querySelector('.card-img');
    if (gameStarted && cardImage.src.includes('blank') && currentCard) {
        let slot = cardImage.parentNode;
        let rowIndex = parseInt(slot.dataset.row);
        let columnIndex = parseInt(slot.dataset.column);
        board[rowIndex][columnIndex] = currentCard; // Place the current card on the board

        // Update the slot with the current card image
        cardImage.src = `./cards/${currentCard.suit}_${currentCard.rank}.png`;
        cardImage.classList.add('occupied'); // Mark the slot as occupied

        currentCard = deck.length > 0 ? deck.pop() : null; // Get the next card
        displayCurrentCard(); // Update the display for the next card

        // Play card placement sound
        playCardSound();

        // Check if the board is full after placing the card
        if (isBoardFull()) {
            endGame(); // End the game if the board is full
        } else {
            // Continue the game if there are empty slots
            updateScore(); // Update the score based on the current board state
        }
    }
}


document.getElementById('deck-img').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        currentCard = deck.pop(); // Get the first card from the deck
        displayCurrentCard(); // Display the current card
    }
});

function isBoardFull() {
    // Assuming board is a 2D array of card objects or null for empty slots
    return board.every(row => row.every(cell => cell !== null));
}


function calculateScore() {
    let totalScore = 0;
    // Evaluate and score each row
    for (let row of board) {
        totalScore += evaluateHand(row);
    }
    // Evaluate and score each column
    for (let i = 0; i < 5; i++) {
        let column = board.map(row => row[i]);
        totalScore += evaluateHand(column);
    }
    // Display total score
    document.getElementById('score').textContent = `Total Score: ${totalScore}`;
}


// Function to check if a row is complete and update the score
function isRowComplete(rowIndex) {
    return board[rowIndex].every(cell => cell !== null);
}

function isColumnComplete(columnIndex) {
    return board.every(row => row[columnIndex] !== null);
}

let completedRows = Array(5).fill(false);
let completedColumns = Array(5).fill(false);

function updateScore(rowIndex, columnIndex) {
    let score = 0;
    let handDescriptions = [];

    // Score the row if it hasn't been scored yet
    if (!scoredRows.has(rowIndex)) {
        const rowResult = evaluateHand(board[rowIndex]);
        if (rowResult.score > 0) {
            score += rowResult.score;
            handDescriptions.push(`${rowResult.hand} (${rowResult.score})`);
            scoredRows.add(rowIndex); // Mark the row as scored
        }
    }

    // Score the column if it hasn't been scored yet
    let column = board.map(row => row[columnIndex]);
    if (!scoredColumns.has(columnIndex) && column.every(cell => cell !== null)) {
        const columnResult = evaluateHand(column);
        if (columnResult.score > 0) {
            score += columnResult.score;
            handDescriptions.push(`${columnResult.hand} (${columnResult.score})`);
            scoredColumns.add(columnIndex); // Mark the column as scored
        }
    }

    totalScore += score;
    document.getElementById('score').textContent = `Score: ${totalScore}`;

    // Only update the hand descriptions if there are new ones to add
    if (handDescriptions.length > 0) {
        document.getElementById('hands-display').textContent = handDescriptions.join(', ');
    }
    if (isBoardFull()) {
        endGame();
    }
}


function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

function endGame() {
    // Calculate final score and determine win/loss
    let message = totalScore >= 70 ? "YOU WIN!" : "YOU LOSE.";
    document.getElementById('score').textContent = `Score: ${totalScore} ${message}`;
    document.getElementById('deck-img').src = './cards/Backside.png'; // Reset the deck image to backside
    // Optionally reset the game or disable further actions
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    createBoard();
    setupDragAndDrop();
    document.getElementById('deck-img').addEventListener('click', drawNextCard);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('mute-button').addEventListener('click', toggleMute);
});

function playCardSound() {
    const sound = document.getElementById('card-sound');
    if (!sound.muted) {
        sound.volume = 0.5; // Medium volume
        sound.play();
    }
}

function toggleMute() {
    const sound = document.getElementById('card-sound');
    sound.muted = !sound.muted;
    document.getElementById('mute-button').textContent = sound.muted ? 'Unmute' : 'Mute';
}

function setupDragAndDrop() {
    // Only the deck image (current card to be placed) is draggable
    const deckImg = document.getElementById('deck-img');
    deckImg.draggable = true; // Ensure the deck image is draggable
    deckImg.addEventListener('dragstart', handleDragStart);

    // Ensure card slots and placed cards are not draggable
    const cardSlots = document.getElementsByClassName('card-slot');
    Array.from(cardSlots).forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        // Make sure the img element inside the slot is not draggable
        const img = slot.querySelector('img');
        if (img) {
            img.draggable = false; // Disable dragging for images inside slots
        }
    });
}

function handleDragStart(event) {
    // Allow drag only if the event is triggered by the deck image
    if (event.target.id === 'deck-img' && gameStarted && currentCard) {
        event.dataTransfer.setData('text/plain', `${currentCard.suit}_${currentCard.rank}`);
    } else {
        // Prevent dragging for other elements
        event.preventDefault();
    }
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow a drop
}

function handleDrop(event) {
    event.preventDefault(); // Prevent default to allow drop

    document.getElementById('hands-display').textContent = '';

    // Get card data from the drag event
    const cardData = event.dataTransfer.getData('text');
    let targetSlot = event.target;

    // If the drop target is the image inside the slot, get the slot element
    if (targetSlot.tagName === 'IMG') {
        targetSlot = targetSlot.parentNode;
    }

    // Ensure the target is a card slot and is empty
    if (targetSlot.classList.contains('card-slot') && targetSlot.querySelector('.card-img').src.includes('blank')) {
        // Set the card image to the slot
        const cardImage = targetSlot.querySelector('.card-img');
        cardImage.src = `./cards/${cardData}.png`;

        let rowIndex = parseInt(targetSlot.dataset.row);
        let columnIndex = parseInt(targetSlot.dataset.column);
        board[rowIndex][columnIndex] = { suit: cardData.split('_')[0], rank: cardData.split('_')[1] };
        updateScore(rowIndex, columnIndex);
        playCardSound(); 
        // Update game state with the new card
        currentCard = deck.pop();
        displayCurrentCard();

        // Update score if necessary
        if (isRowComplete(rowIndex) || isColumnComplete(columnIndex)) {
            updateScore();
        }

        // Check for game over or other conditions as needed
    }
}
function restartGame() {
    scoredRows.clear();
    scoredColumns.clear();
    completedRows.fill(false);
    completedColumns.fill(false);
    initializeGame();
    createBoard();
    setupDragAndDrop(); // Re-setup drag-and-drop if necessary
    totalScore = 0; // Reset the total score
    document.getElementById('score').textContent = `Score: ${totalScore}`; // Update the score display
    document.getElementById('message-area').textContent = ''; // Clear any messages
}
initializeGame();