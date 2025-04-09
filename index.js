document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cardsContainer');
    const cards = document.querySelectorAll('.card');
    const instruction = document.querySelector('.instruction');
    const restartButton = document.getElementById('restart');
    const flipSound = new Audio('sounds/flipsound.mp3');
    const winSound = new Audio('sounds/win.mp3');
    flipSound.load();
    winSound.preload = 'auto';
    winSound.load();
   
    let canFlip = true;
    let hasFlipped = false;
    
    // Detect if the device is likely mobile
    const isMobile = window.innerWidth <= 768;
    
    // Set shorter timings for mobile
    const previewTime = isMobile ? 4000 : 5000;
    const shuffleInterval = isMobile ? 600 : 800;
    const maxShuffles = isMobile ? 6 : 7;

    // Set the back of all cards to use your photo
    const cardBacks = document.querySelectorAll('.card-back');
    cardBacks.forEach(back => {
        // Update this path to match your photo location
        back.style.backgroundImage = "url('images/z6489713203938_b0b847aaae7c13eb07afe210b1bd56ac.jpg')";
    });

    // Initial display showing the front of cards
    cards.forEach(card => {
        card.classList.add('flipped');
    });

    // After preview time, hide the cards and start shuffling
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
        
        setTimeout(() => {
            startShuffling();
        }, 600);
    }, previewTime);

    function startShuffling() {
        // Shuffle card contents
const cardContents = Array.from(cards).map(card => card.innerHTML);

// Shuffle the contents array
for (let i = cardContents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardContents[i], cardContents[j]] = [cardContents[j], cardContents[i]];
}

// Gán lại nội dung đã xáo trộn vào từng thẻ
cards.forEach((card, index) => {
    card.innerHTML = cardContents[index];
});

        instruction.textContent = "Đang trộn, đợi xíiii";
        
        // Always use the simpler animation for mobile devices
        if (isMobile) {
            simpleShuffling();
            return;
        }
        
        // For desktop: advanced shuffling with position swapping
        // Store the original layout before making cards absolute
        const cardPositions = [];
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            cardPositions.push({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
        });
        
        // Make container position relative to contain absolute cards
        const containerRect = cardsContainer.getBoundingClientRect();
        cardsContainer.style.height = `${containerRect.height}px`;
        cardsContainer.style.position = 'relative';
        
        // Set cards to absolute positioning with initial positions
        cards.forEach((card, index) => {
            card.style.position = 'absolute';
            card.style.left = `${cardPositions[index].left - containerRect.left}px`;
            card.style.top = `${cardPositions[index].top - containerRect.top}px`;
            card.style.width = `${cardPositions[index].width}px`;
            card.style.height = `${cardPositions[index].height}px`;
            card.style.margin = '0';
            card.classList.add('shuffling');
        });

        // Perform shuffle animation
        let shuffles = 0;
        
        function performShuffle() {
            shuffles++;
            
            // Shuffle the positions array
            for (let i = cardPositions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cardPositions[i], cardPositions[j]] = [cardPositions[j], cardPositions[i]];
            }
            
            // Apply new positions to cards
            cards.forEach((card, index) => {
                card.style.left = `${cardPositions[index].left - containerRect.left}px`;
                card.style.top = `${cardPositions[index].top - containerRect.top}px`;
            });
            
            if (shuffles < maxShuffles) {
                setTimeout(performShuffle, shuffleInterval);
            } else {
                // Restore cards to original layout after shuffling
                setTimeout(() => {
                    cardsContainer.style.height = '';
                    cardsContainer.style.position = '';
                    
                    cards.forEach(card => {
                        card.classList.remove('shuffling');
                        card.style.position = '';
                        card.style.left = '';
                        card.style.top = '';
                        card.style.margin = '';
                    });
                    
                    instruction.textContent = "Chọn thẻ bất kì điii";
                    canFlip = true;
                }, shuffleInterval);
            }
        }
        
        performShuffle();
    }
    
    // Simpler shuffling method for mobile
    function simpleShuffling() {
        let shuffles = 0;
        
        function simpleAnimation() {
            shuffles++;
            
            // Visual effect - briefly hide and show with fade
            cards.forEach(card => {
                card.style.opacity = "0.5";
                card.style.transform = "scale(0.95)";
            });
            
            setTimeout(() => {
                cards.forEach(card => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                });
            }, 200);
            
            if (shuffles < maxShuffles) {
                setTimeout(simpleAnimation, 500);
            } else {
                instruction.textContent = "Chọn thẻ bất kì điii";
                canFlip = true;
            }
        }
        
        simpleAnimation();
    }

    // Add click event to cards
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (canFlip && !card.classList.contains('flipped')) {
    
                // 💡 Play flip sound trước khi làm bất cứ animation gì
               
               
    
                // 🃏 Flip the card
                card.classList.add('flipped');
    
                setTimeout(() => {
                    card.classList.add('selected');
    
                    cards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.add('hidden');
                        }
                    });
    
                    instruction.textContent = "Được rồi đi thoaiii";
                    restartButton.style.display = 'block';
    
                    // 🏆 Play win sound
                  
    
                    // 🎉 Confetti
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 }
                    });
                }, 600);
    
                hasFlipped = true;
                canFlip = false;
            }
        });
    });
    
    

    restartButton.addEventListener('click', () => {
        cards.forEach(card => {
            card.classList.remove('flipped', 'selected', 'hidden');
        });
        
        restartButton.style.display = 'none';
        instruction.textContent = "Đang trộn, đợi xíiii";
        
        setTimeout(() => {
            startShuffling();
        }, 600);
    });
    
    
});