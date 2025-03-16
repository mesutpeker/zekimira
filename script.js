document.addEventListener('DOMContentLoaded', () => {
    // Safari için iyileştirmeler
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Müzik kontrolü için elementler
    const backgroundMusicEl = document.getElementById('backgroundMusic');
    const soundToggleEl = document.getElementById('soundToggle');
    const soundOnEl = soundToggleEl.querySelector('.sound-on');
    const soundOffEl = soundToggleEl.querySelector('.sound-off');
    
    // Müzik kontrolü
    let isMusicPlaying = false;
    
    function toggleMusic() {
        if (isMusicPlaying) {
            backgroundMusicEl.pause();
            soundOnEl.classList.add('hidden');
            soundOffEl.classList.remove('hidden');
        } else {
            backgroundMusicEl.play().catch(error => {
                console.log('Müzik otomatik başlatılamadı:', error);
            });
            soundOnEl.classList.remove('hidden');
            soundOffEl.classList.add('hidden');
        }
        isMusicPlaying = !isMusicPlaying;
    }
    
    // Müzik kontrolü için event listener
    soundToggleEl.addEventListener('click', toggleMusic);
    
    // Sayfa etkileşiminde müziği başlat
    document.addEventListener('click', () => {
        if (!isMusicPlaying) {
            toggleMusic();
        }
    }, { once: true });
    
    // DOM elementlerini seçme
    const tensDigitEl = document.getElementById('tensDigit');
    const onesDigitEl = document.getElementById('onesDigit');
    const multiplierEl = document.getElementById('multiplier');
    
    // Karakter ve konuşma
    const characterEl = document.getElementById('character');
    const characterSpeechEl = document.getElementById('characterSpeech');
    
    // Kutucuklar
    const hundredsBoxEl = document.getElementById('hundredsBox');
    const tensBoxEl = document.getElementById('tensBox');
    const onesBoxEl = document.getElementById('onesBox');
    
    // Çoktan seçmeli ve giriş alanları
    const multipleChoiceContainerEl = document.getElementById('multipleChoiceContainer');
    const singleInputContainerEl = document.getElementById('singleInputContainer');
    const currentStepEl = document.getElementById('currentStep');
    const currentMultiplicationEl = document.getElementById('currentMultiplication');
    const answerInputEl = document.getElementById('answerInput');
    const checkBtnEl = document.getElementById('checkBtn');
    const feedbackEl = document.getElementById('feedback');
    
    // Elde sorma ve giriş
    const carryQuestionContainerEl = document.getElementById('carryQuestionContainer');
    const carryYesBtnEl = document.getElementById('carryYesBtn');
    const carryNoBtnEl = document.getElementById('carryNoBtn');
    const carryContainerEl = document.getElementById('carryContainer');
    
    // Animasyon ve kutlama
    const animationAreaEl = document.getElementById('animationArea');
    const celebrationEl = document.getElementById('celebration');
    const confettiEl = document.getElementById('confetti');
    const newProblemBtnEl = document.getElementById('newProblemBtn');
    
    // Oyun durumu
    let gameState = {
        twoDigitNumber: 0,
        oneDigitNumber: 0,
        tensDigit: 0,
        onesDigit: 0,
        currentStep: 'ones_product', // Değişen adımlar: 'ones_product', 'ones_digit', 'carry_question', 'carry', 'tens', 'complete'
        onesStepResult: 0, // Birler basamağı çarpımının tam sonucu (örn: 5x5=25)
        selectedOnesProduct: 0, // Kullanıcının seçtiği birler basamağı çarpım sonucu
        onesResult: 0, // Birler basamağındaki rakam (örn: 25'in birler basamağı 5)
        tensResult: 0,
        carry: 0,
        finalResult: 0,
        choiceButtons: [],
        carryOptionButtons: []
    };
    
    // Seçim butonlarını temizleme ve hazırlama
    function setupChoiceButtons() {
        // Çoktan seçmeli butonları temizle
        multipleChoiceContainerEl.innerHTML = '';
        
        // Doğru cevaba bağlı olarak seçenekler oluştur
        let correctAnswer = 0;
        let range = [0, 9]; // Varsayılan aralık
        
        if (gameState.currentStep === 'ones_product') {
            // Birler basamağı çarpımının tam sonucu (örn: 5x5=25)
            correctAnswer = gameState.onesStepResult;
            
            // Çarpım sonucu için daha geniş bir aralık
            const min = Math.max(0, correctAnswer - 15);
            const max = Math.min(90, correctAnswer + 15);
            range = [min, max];
            
        } else if (gameState.currentStep === 'ones_digit') {
            // Birler basamağı değeri (örn: 25'in birler basamağı 5)
            correctAnswer = gameState.onesResult;
            range = [0, 9]; // Birler basamağı 0-9 arası
            
        } else if (gameState.currentStep === 'carry') {
            // Elde değeri (örn: 25'in elde değeri 2)
            correctAnswer = gameState.carry;
            range = [0, 9]; // Elde 0-9 arası
            
        } else if (gameState.currentStep === 'tens') {
            // Onlar basamağı çarpımı + elde (örn: 2x5+2=12)
            correctAnswer = gameState.tensResult;
            
            // Onlar basamağı için daha geniş aralık
            if (correctAnswer <= 9) {
                range = [0, 18]; // Tek basamaklı cevap için
            } else {
                range = [Math.max(10, correctAnswer - 10), Math.min(99, correctAnswer + 10)]; // İki basamaklı cevap için
            }
        }
        
        // Doğru cevabı içerecek şekilde 3 seçenek oluştur
        const choices = generateChoices(correctAnswer, 3, range[0], range[1]);
        gameState.choiceButtons = [];
        
        // Seçenekleri karıştır
        shuffleArray(choices);
        
        // Butonları oluştur
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice;
            button.dataset.value = choice;
            
            button.addEventListener('click', () => {
                // Seçili butonu işaretle
                gameState.choiceButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                
                // Seçimi kontrol et
                setTimeout(() => {
                    if (parseInt(button.dataset.value) === correctAnswer) {
                        // Birler basamağı çarpımında, kullanıcının seçtiği değeri kaydet
                        if (gameState.currentStep === 'ones_product') {
                            gameState.selectedOnesProduct = correctAnswer;
                        }
                        handleCorrectAnswer(correctAnswer);
                    } else {
                        handleWrongAnswer(button);
                    }
                }, 300);
            });
            
            multipleChoiceContainerEl.appendChild(button);
            gameState.choiceButtons.push(button);
        });
    }
    
    // Elde var mı butonlarını ayarlama
    function setupCarryQuestionButtons() {
        // Elde var/yok butonlarının stillerini temizle
        carryYesBtnEl.classList.remove('selected');
        carryNoBtnEl.classList.remove('incorrect');
        
        // Event listener'ları temizle ve yeniden ekle (çift listener önlemi)
        carryYesBtnEl.removeEventListener('click', handleCarryYes);
        carryNoBtnEl.removeEventListener('click', handleCarryNo);
        
        carryYesBtnEl.addEventListener('click', handleCarryYes);
        carryNoBtnEl.addEventListener('click', handleCarryNo);
    }
    
    // Elde var butonuna tıklama
    function handleCarryYes() {
        if (gameState.carry > 0) {
            // Doğru cevap - elde var
            carryYesBtnEl.classList.add('selected');
            feedbackEl.textContent = 'Doğru! Elde var.';
            feedbackEl.className = 'feedback success';
            
            characterSpeechEl.textContent = `Evet! ${gameState.selectedOnesProduct} sayısında elde var.`;
            
            // Elde değeri adımına geç
            setTimeout(() => {
                gameState.currentStep = 'carry';
                updateDisplay();
                setupCarryOptionButtons();
            }, 1500);
        } else {
            // Yanlış cevap - elde yok
            carryYesBtnEl.classList.add('incorrect');
            feedbackEl.textContent = 'Yanlış! Elde yok.';
            
            characterSpeechEl.textContent = `Yanlış! ${gameState.selectedOnesProduct} sayısında elde yok. Onlar basamağından elde olmaz.`;
            
            setTimeout(() => {
                carryYesBtnEl.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Elde yok butonuna tıklama
    function handleCarryNo() {
        if (gameState.carry === 0) {
            // Doğru cevap - elde yok
            carryNoBtnEl.classList.add('selected');
            feedbackEl.textContent = 'Doğru! Elde yok.';
            feedbackEl.className = 'feedback success';
            
            characterSpeechEl.textContent = `Evet! ${gameState.selectedOnesProduct} sayısında elde yok.`;
            
            // Onlar basamağına geç
            setTimeout(() => {
                gameState.currentStep = 'tens';
                updateDisplay();
                setupChoiceButtons();
                highlightCurrentStep();
            }, 1500);
        } else {
            // Yanlış cevap - elde var
            carryNoBtnEl.classList.add('incorrect');
            feedbackEl.textContent = `Yanlış! Elde var: ${gameState.carry}`;
            
            characterSpeechEl.textContent = `Yanlış! ${gameState.selectedOnesProduct} sayısında elde var. ${gameState.selectedOnesProduct} = ${gameState.onesResult} + ${gameState.carry}0`;
            
            setTimeout(() => {
                carryNoBtnEl.classList.remove('incorrect');
            }, 1000);
        }
    }
    
    // Elde seçeneklerini hazırlama
    function setupCarryOptionButtons() {
        // Butonları seç
        gameState.carryOptionButtons = document.querySelectorAll('.carry-option-btn');
        
        // Önceki stilleri temizle
        gameState.carryOptionButtons.forEach(button => {
            button.style.backgroundColor = '';
            button.style.color = '';
            button.classList.remove('incorrect');
            button.style.animation = '';
        });
        
        // Event listener'ları ekle
        gameState.carryOptionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const userCarryValue = parseInt(button.dataset.value);
                
                if (userCarryValue === gameState.carry) {
                    // Doğru elde değeri
                    button.style.backgroundColor = '#4caf50';
                    button.style.color = 'white';
                    
                    feedbackEl.textContent = 'Doğru! Elde değerini buldun.';
                    feedbackEl.className = 'feedback success';
                    
                    characterSpeechEl.textContent = 'Harika! Elde değeri doğru.';
                    
                    // Onlar basamağı adımına geç
                    setTimeout(() => {
                        gameState.currentStep = 'tens';
                        updateDisplay();
                        setupChoiceButtons();
                        highlightCurrentStep();
                    }, 1500);
                } else {
                    // Yanlış elde değeri
                    button.classList.add('incorrect');
                    button.style.animation = 'shake-animation 0.5s linear';
                    
                    feedbackEl.textContent = `Yanlış! Elde değeri ${gameState.carry} olmalı.`;
                    characterSpeechEl.textContent = 'Tekrar dene! İpucu: ' + 
                        `${gameState.selectedOnesProduct} sayısının birler basamağı ${gameState.onesResult}, elde ${gameState.carry} olmalı.`;
                    
                    setTimeout(() => {
                        button.classList.remove('incorrect');
                        button.style.animation = '';
                    }, 500);
                }
            });
        });
    }
    
    // Seçenekler oluşturma (doğru cevabı içeren)
    function generateChoices(correctAnswer, numChoices, min, max) {
        const choices = [correctAnswer];
        
        while (choices.length < numChoices) {
            const randomChoice = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!choices.includes(randomChoice)) {
                choices.push(randomChoice);
            }
        }
        
        return choices;
    }
    
    // Diziyi karıştırma
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Safari için odak sorunlarını düzeltme
    if (isSafari) {
        answerInputEl.addEventListener('touchstart', function() {
            this.focus();
        });
    }
    
    // Karakter konuşmalarını güncelleme
    function updateCharacterSpeech(message) {
        characterSpeechEl.textContent = message;
        characterEl.style.animation = 'character-bounce 1s ease';
        
        setTimeout(() => {
            characterEl.style.animation = '';
        }, 1000);
    }
    
    // Yeni problem oluşturma
    function generateNewProblem() {
        // İki basamaklı rastgele sayı (10-99)
        const twoDigitNum = Math.floor(Math.random() * 90) + 10;
        
        // Bir basamaklı rastgele sayı (2-9) - 1'i hariç tutuyoruz çünkü çarpımda anlamlı olmaz
        const oneDigitNum = Math.floor(Math.random() * 8) + 2;
        
        // Oyun durumunu güncelleme
        gameState.twoDigitNumber = twoDigitNum;
        gameState.oneDigitNumber = oneDigitNum;
        gameState.tensDigit = Math.floor(twoDigitNum / 10);
        gameState.onesDigit = twoDigitNum % 10;
        gameState.currentStep = 'ones_product'; // İlk adım değişti
        gameState.selectedOnesProduct = 0; // Kullanıcının seçimini sıfırla
        
        // Sonuçları doğru hesaplama
        gameState.onesStepResult = gameState.onesDigit * oneDigitNum; // Tam çarpım sonucu
        gameState.onesResult = gameState.onesStepResult % 10; // Birler basamağı
        gameState.carry = Math.floor(gameState.onesStepResult / 10); // Elde değeri
        
        gameState.tensResult = gameState.tensDigit * oneDigitNum + gameState.carry;
        gameState.finalResult = gameState.twoDigitNumber * gameState.oneDigitNumber;
        
        // Ekrandaki değerleri güncelleme
        resetDisplay();
        updateDisplay();
        
        // Çoktan seçmeli butonları hazırla
        setupChoiceButtons();
        
        // Elde butonlarını hazırla
        setupCarryOptionButtons();
        
        // Elde soru butonlarını hazırla
        setupCarryQuestionButtons();
        
        // Animasyon ile sayıları vurgulama
        highlightCurrentStep();
        
        // Karakter konuşmasını güncelle
        updateCharacterSpeech('Hadi başlayalım! Önce birler basamağını çarpalım.');
        
        // Kutlama alanını temizleme
        celebrationEl.classList.add('hidden');
        confettiEl.innerHTML = '';
        
        console.log("Yeni problem oluşturuldu:", {
            twoDigitNum, 
            oneDigitNum,
            onesStepResult: gameState.onesStepResult,
            onesResult: gameState.onesResult,
            carry: gameState.carry,
            finalResult: gameState.finalResult
        });
    }
    
    // Tüm gösterimi sıfırlama
    function resetDisplay() {
        // Kutucukları sıfırlama
        hundredsBoxEl.innerHTML = '<span class="result-placeholder">?</span>';
        tensBoxEl.innerHTML = '<span class="result-placeholder">?</span>';
        onesBoxEl.innerHTML = '<span class="result-placeholder">?</span>';
        
        // Giriş alanlarını temizleme
        answerInputEl.value = '';
        
        // Geri bildirimleri temizleme
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        
        // Adım konteynerlerini ayarlama
        multipleChoiceContainerEl.classList.remove('hidden');
        singleInputContainerEl.classList.add('hidden');
        carryQuestionContainerEl.classList.add('hidden');
        carryContainerEl.classList.add('hidden');
        
        // Buton stillerini temizle
        carryYesBtnEl.classList.remove('selected', 'incorrect');
        carryNoBtnEl.classList.remove('selected', 'incorrect');
        
        // Animasyon alanını temizleme
        animationAreaEl.innerHTML = '';
        
        // Animasyon sınıflarını kaldırma
        removeAnimationClasses();
    }
    
    // Animasyon sınıflarını kaldırma
    function removeAnimationClasses() {
        [tensDigitEl, onesDigitEl, multiplierEl].forEach(el => {
            el.classList.remove('blink', 'highlight-digit');
        });
        
        [hundredsBoxEl, tensBoxEl, onesBoxEl].forEach(el => {
            el.classList.remove('box-glow', 'box-shake', 'target-box');
        });
    }
    
    // Soru başlığını daha dikkat çekici yapma
    function updateCurrentStepTitle(text) {
        currentStepEl.innerHTML = `<span class="step-highlight">${text}</span>`;
        currentStepEl.style.animation = 'pulse-question 2s infinite';
        
        // Safari için ek optimizasyon
        if (isSafari) {
            currentStepEl.style.webkitTransform = 'translateZ(0)';
        }
    }
    
    // Ekrandaki değerleri güncelleme
    function updateDisplay() {
        // Ana sayılar
        tensDigitEl.textContent = gameState.tensDigit;
        onesDigitEl.textContent = gameState.onesDigit;
        multiplierEl.textContent = gameState.oneDigitNumber;
        
        // Konteyner görünürlüklerini ayarla
        multipleChoiceContainerEl.classList.remove('hidden');
        singleInputContainerEl.classList.add('hidden');
        carryQuestionContainerEl.classList.add('hidden');
        carryContainerEl.classList.add('hidden');
        
        // Mevcut adımı güncelleme
        if (gameState.currentStep === 'ones_product') {
            updateCurrentStepTitle('Birler basamağını çarp:');
            currentMultiplicationEl.textContent = `${gameState.onesDigit} × ${gameState.oneDigitNumber} = ?`;
            multipleChoiceContainerEl.classList.remove('hidden');
            
            // Hedef kutuyu işaretle
            onesBoxEl.classList.add('target-box');
            
        } else if (gameState.currentStep === 'ones_digit') {
            updateCurrentStepTitle(`${gameState.selectedOnesProduct} sayısının birler basamağı değeri:`);
            currentMultiplicationEl.textContent = `${gameState.selectedOnesProduct} sayısının birler basamağında hangi rakam var?`;
            multipleChoiceContainerEl.classList.remove('hidden');
            
            // Hedef kutuyu işaretle
            onesBoxEl.classList.add('target-box');
            
        } else if (gameState.currentStep === 'carry_question') {
            updateCurrentStepTitle('Elde var mı?');
            currentMultiplicationEl.textContent = `${gameState.selectedOnesProduct} sayısında elde var mı?`;
            multipleChoiceContainerEl.classList.add('hidden');
            carryQuestionContainerEl.classList.remove('hidden');
            
        } else if (gameState.currentStep === 'carry') {
            updateCurrentStepTitle('Elde değeri:');
            currentMultiplicationEl.textContent = `${gameState.selectedOnesProduct} sayısında elde kaç var?`;
            multipleChoiceContainerEl.classList.add('hidden');
            carryContainerEl.classList.remove('hidden');
            
        } else if (gameState.currentStep === 'tens') {
            updateCurrentStepTitle('Onlar basamağını çarp ve eldeyi ekle:');
            if (gameState.carry > 0) {
                currentMultiplicationEl.textContent = `${gameState.tensDigit} × ${gameState.oneDigitNumber} + ${gameState.carry} = ?`;
            } else {
                currentMultiplicationEl.textContent = `${gameState.tensDigit} × ${gameState.oneDigitNumber} = ?`;
            }
            multipleChoiceContainerEl.classList.remove('hidden');
            
            // Hedef kutuları işaretle
            if (gameState.tensResult >= 10) {
                hundredsBoxEl.classList.add('target-box');
                tensBoxEl.classList.add('target-box');
            } else {
                tensBoxEl.classList.add('target-box');
            }
        }
        
        // Safari için ek optimizasyonlar
        if (isSafari) {
            document.querySelectorAll('.choice-btn, .carry-option-btn').forEach(btn => {
                btn.style.webkitAppearance = 'none';
                btn.style.webkitTapHighlightColor = 'transparent';
            });
            
            // Kompakt görünüm için ek düzenlemeler
            if (window.innerWidth <= 375) {
                document.querySelector('.game-board').style.padding = '10px';
                document.querySelectorAll('.result-box').forEach(box => {
                    box.style.width = '45px';
                    box.style.height = '45px';
                    box.style.fontSize = '20px';
                });
            }
        }
    }
    
    // Mevcut adımı vurgulama
    function highlightCurrentStep() {
        removeAnimationClasses();
        
        if (gameState.currentStep === 'ones_product' || gameState.currentStep === 'ones_digit') {
            // Birler basamağını ve çarpanı vurgulama
            onesDigitEl.classList.add('blink', 'highlight-digit');
            multiplierEl.classList.add('blink', 'highlight-digit');
            onesBoxEl.classList.add('target-box');
        } else if (gameState.currentStep === 'tens') {
            // Onlar basamağını ve çarpanı vurgulama
            tensDigitEl.classList.add('blink', 'highlight-digit');
            multiplierEl.classList.add('blink', 'highlight-digit');
            
            // Ayrıca hedef kutuları vurgula
            if (gameState.tensResult >= 10) {
                hundredsBoxEl.classList.add('target-box');
                tensBoxEl.classList.add('target-box');
            } else {
                tensBoxEl.classList.add('target-box');
            }
        }
    }
    
    // Uçan sayı animasyonu oluşturma
    function createFlyingNumber(number, startElement, targetElement, delay = 0) {
        // Başlangıç ve hedef elementlerin pozisyonlarını al
        const startRect = startElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        // Animasyon alanının pozisyonunu al
        const areaRect = animationAreaEl.getBoundingClientRect();
        
        // Başlangıç ve hedef pozisyonlarını animasyon alanına göre ayarla
        const startX = startRect.left + startRect.width / 2 - areaRect.left;
        const startY = startRect.top + startRect.height / 2 - areaRect.top;
        const targetX = targetRect.left + targetRect.width / 2 - areaRect.left;
        const targetY = targetRect.top + targetRect.height / 2 - areaRect.top;
        
        // Uçan sayı elementi oluştur
        const flyingNum = document.createElement('div');
        flyingNum.className = 'flying-number';
        flyingNum.textContent = number;
        flyingNum.style.left = `${startX}px`;
        flyingNum.style.top = `${startY}px`;
        
        // Animasyon alanına ekle
        animationAreaEl.appendChild(flyingNum);
        
        // Delay sonrası animasyonu başlat
        setTimeout(() => {
            // Animasyon yolunu belirle
            flyingNum.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
            flyingNum.style.left = `${targetX}px`;
            flyingNum.style.top = `${targetY}px`;
            flyingNum.style.opacity = '1';
            
            // Animasyon tamamlandığında hedef kutucuğa sayıyı ekle
            setTimeout(() => {
                targetElement.innerHTML = number;
                targetElement.classList.add('box-glow');
                flyingNum.remove();
            }, 1000);
        }, delay);
    }
    
    // Doğru cevap işleme
    function handleCorrectAnswer(correctAnswer) {
        feedbackEl.textContent = 'Doğru cevap!';
        feedbackEl.className = 'feedback success';
        
        // Seçili butonu bul
        const selectedButton = gameState.choiceButtons.find(btn => btn.classList.contains('selected'));
        
        if (gameState.currentStep === 'ones_product') {
            // Birler basamağı çarpımının tam sonucu
            updateCharacterSpeech(`Harika! ${gameState.onesDigit} × ${gameState.oneDigitNumber} = ${gameState.selectedOnesProduct} doğru cevap!`);
            
            // Bir sonraki adıma geç: birler basamağı değeri
            setTimeout(() => {
                gameState.currentStep = 'ones_digit';
                updateDisplay();
                setupChoiceButtons();
                highlightCurrentStep();
                updateCharacterSpeech(`Şimdi ${gameState.selectedOnesProduct} sayısının birler basamağını bulalım.`);
            }, 1500);
            
        } else if (gameState.currentStep === 'ones_digit') {
            // Birler basamağı değeri
            updateCharacterSpeech(`Doğru! ${gameState.selectedOnesProduct} sayısının birler basamağı ${gameState.onesResult}`);
            
            // Birler basamağı kutucuğuna uçan sayı animasyonu
            if (selectedButton) {
                createFlyingNumber(gameState.onesResult, selectedButton, onesBoxEl);
            }
            
            // Bir sonraki adıma geç: elde var mı
            setTimeout(() => {
                gameState.currentStep = 'carry_question';
                updateDisplay();
                setupCarryQuestionButtons();
                updateCharacterSpeech(`${gameState.selectedOnesProduct} sayısında elde var mı?`);
            }, 1500);
            
        } else if (gameState.currentStep === 'tens') {
            // Onlar basamağı için doğru cevap
            updateCharacterSpeech('Tebrikler! Çarpma işlemini başarıyla tamamladın.');
            
            // Sonuç kutucuklarına uçan sayı animasyonu
            if (selectedButton && correctAnswer >= 10) {
                const tensDigit = Math.floor(correctAnswer / 10);
                const onesDigit = correctAnswer % 10;
                
                createFlyingNumber(tensDigit, selectedButton, hundredsBoxEl);
                createFlyingNumber(onesDigit, selectedButton, tensBoxEl, 300);
            } else if (selectedButton) {
                createFlyingNumber(correctAnswer, selectedButton, tensBoxEl);
            }
            
            // Oyunu tamamla ve kutla
            gameState.currentStep = 'complete';
            
            setTimeout(() => {
                showCelebration();
            }, 2000);
        }
    }
    
    // Yanlış cevap işleme
    function handleWrongAnswer(button) {
        button.classList.add('incorrect');
        
        let correctAnswer;
        if (gameState.currentStep === 'ones_product') {
            correctAnswer = gameState.onesStepResult;
            feedbackEl.textContent = `Yanlış! ${gameState.onesDigit} × ${gameState.oneDigitNumber} = ${correctAnswer}`;
            updateCharacterSpeech(`Yanlış! ${gameState.onesDigit} × ${gameState.oneDigitNumber} = ${correctAnswer} olmalı.`);
        } else if (gameState.currentStep === 'ones_digit') {
            correctAnswer = gameState.onesResult;
            feedbackEl.textContent = `Yanlış! ${gameState.selectedOnesProduct} sayısının birler basamağı ${correctAnswer}`;
            updateCharacterSpeech(`Yanlış! ${gameState.selectedOnesProduct} sayısının birler basamağında ${correctAnswer} var.`);
        } else if (gameState.currentStep === 'tens') {
            correctAnswer = gameState.tensResult;
            if (gameState.carry > 0) {
                feedbackEl.textContent = `Yanlış! ${gameState.tensDigit} × ${gameState.oneDigitNumber} + ${gameState.carry} = ${correctAnswer}`;
                updateCharacterSpeech(`Yanlış! ${gameState.tensDigit} × ${gameState.oneDigitNumber} + ${gameState.carry} (elde) = ${correctAnswer}`);
            } else {
                feedbackEl.textContent = `Yanlış! ${gameState.tensDigit} × ${gameState.oneDigitNumber} = ${correctAnswer}`;
                updateCharacterSpeech(`Yanlış! ${gameState.tensDigit} × ${gameState.oneDigitNumber} = ${correctAnswer}`);
            }
        }
        
        setTimeout(() => {
            button.classList.remove('incorrect');
            button.classList.remove('selected');
        }, 1000);
    }
    
    // Kutlama efekti
    function showCelebration() {
        celebrationEl.classList.remove('hidden');
        
        // Basit konfeti efekti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = Math.random() * 15 + 5 + 'px';
            confettiEl.appendChild(confetti);
        }
        
        updateCharacterSpeech('Tebrikler! Çok iyisin! Sonuç: ' + gameState.finalResult);
    }
    
    // Event listeners
    checkBtnEl.addEventListener('click', () => {
        const userAnswer = parseInt(answerInputEl.value);
        
        if (gameState.currentStep === 'ones_product') {
            if (!isNaN(userAnswer) && userAnswer === gameState.onesStepResult) {
                gameState.selectedOnesProduct = userAnswer; // Kullanıcının seçimini kaydet
                handleCorrectAnswer(gameState.onesStepResult);
            } else {
                answerInputEl.classList.add('shake-input');
                setTimeout(() => answerInputEl.classList.remove('shake-input'), 500);
            }
        } else if (gameState.currentStep === 'ones_digit') {
            if (!isNaN(userAnswer) && userAnswer === gameState.onesResult) {
                handleCorrectAnswer(gameState.onesResult);
            } else {
                answerInputEl.classList.add('shake-input');
                setTimeout(() => answerInputEl.classList.remove('shake-input'), 500);
            }
        } else if (gameState.currentStep === 'tens') {
            if (!isNaN(userAnswer) && userAnswer === gameState.tensResult) {
                handleCorrectAnswer(gameState.tensResult);
            } else {
                answerInputEl.classList.add('shake-input');
                setTimeout(() => answerInputEl.classList.remove('shake-input'), 500);
            }
        }
    });
    
    // Yeni soru butonu
    newProblemBtnEl.addEventListener('click', generateNewProblem);
    
    // Enter tuşu için event listener
    answerInputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            checkBtnEl.click();
        }
    });
    
    // Input olayı
    answerInputEl.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 2) {
            this.value = this.value.slice(0, 2);
        }
    });
    
    // Safari için dokunma olayları
    if (isSafari) {
        document.querySelectorAll('.btn, .choice-btn, .carry-option-btn').forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Çift tıklama sorununu önler
                this.click();
            });
        });
    }
    
    // Oyunu başlatma
    generateNewProblem();
}); 