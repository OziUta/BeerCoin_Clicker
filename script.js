document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    if (tg.initDataUnsafe) {
        tg.expand(); // Раскрываем приложение на весь экран
        tg.setHeaderColor('#0f0c29');
        tg.setBackgroundColor('#0f0c29');
        tg.enableClosingConfirmation(); // Подтверждение закрытия
    }
    
    // Элементы экранов
    const loadingScreen = document.getElementById('loading-screen');
    const mainMenu = document.getElementById('main-menu');
    const topicsScreen = document.getElementById('topics-screen');
    const travelCategoriesScreen = document.getElementById('travel-categories-screen');
    const wordsScreen = document.getElementById('words-screen');
    const testScreen = document.getElementById('test-screen');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    // Кнопки главного меню
    const learnWordsBtn = document.getElementById('learn-words-btn');
    const dictionaryBtn = document.getElementById('dictionary-btn');
    const reviewBtn = document.getElementById('review-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const backToTopicsBtn = document.getElementById('back-to-topics-btn');
    const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
    const backFromTestBtn = document.getElementById('back-from-test-btn');
    const reviewTravelBtn = document.getElementById('review-travel-btn');
    
    // Элементы для статистики
    const wordsLearnedElement = document.querySelector('.stat-value');
    
    // Элементы для тестирования
    const testWordElement = document.getElementById('test-word');
    const testTranscriptionElement = document.getElementById('test-transcription');
    const optionsContainer = document.getElementById('options-container');
    const testFeedbackElement = document.getElementById('test-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const correctAnswersElement = document.getElementById('correct-answers');
    const wrongAnswersElement = document.getElementById('wrong-answers');
    
    // Список тем
    const topicsList = document.getElementById('topics-list');
    
    // Темы для изучения
    const topics = [
        { id: 1, title: "Путешествия", words: 112, progress: 0 },
        { id: 2, title: "Еда и напитки", words: 40, progress: 0 },
        { id: 3, title: "Работа", words: 60, progress: 0 },
        { id: 4, title: "Семья", words: 25, progress: 0 },
        { id: 5, title: "Спорт", words: 30, progress: 0 },
        { id: 6, title: "Здоровье", words: 55, progress: 0 },
        { id: 7, title: "Технологии", words: 45, progress: 0 },
        { id: 8, title: "Искусство", words: 30, progress: 0 },
        { id: 9, title: "Наука", words: 40, progress: 0 },
        { id: 10, title: "Бизнес", words: 50, progress: 0 }
    ];
    
    // Данные для темы Путешествия
    const travelData = {
        nouns: {
            title: "Существительные",
            words: [
                { word: "trip", transcription: "/trɪp/", translation: "поездка", example: "We had a wonderful trip to Italy last summer.", exampleTranslation: "У нас была замечательная поездка в Италию прошлым летом.", learned: false },
                { word: "journey", transcription: "/ˈdʒɜːrni/", translation: "длительное путешествие", example: "The journey through the mountains took three days.", exampleTranslation: "Путешествие через горы заняло три дня.", learned: false },
                { word: "travel", transcription: "/ˈtrævəl/", translation: "путешествия (процесс)", example: "I love travel and exploring new cultures.", exampleTranslation: "Я люблю путешествия и изучение новых культур.", learned: false },
                { word: "adventure", transcription: "/ədˈventʃər/", translation: "приключение", example: "Our safari was a real adventure.", exampleTranslation: "Наше сафари было настоящим приключением.", learned: false },
                { word: "vacation", transcription: "/veɪˈkeɪʃən/", translation: "отпуск", example: "I need a vacation after this project.", exampleTranslation: "Мне нужен отпуск после этого проекта.", learned: false },
                { word: "destination", transcription: "/ˌdestɪˈneɪʃən/", translation: "пункт назначения", example: "Paris is our final destination.", exampleTranslation: "Париж - наш конечный пункт назначения.", learned: false },
                { word: "passport", transcription: "/ˈpæspɔːrt/", translation: "паспорт", example: "Don't forget your passport at home.", exampleTranslation: "Не забудьте паспорт дома.", learned: false },
                { word: "ticket", transcription: "/ˈtɪkɪt/", translation: "билет", example: "I bought tickets for the concert online.", exampleTranslation: "Я купил билеты на концерт онлайн.", learned: false },
                { word: "airplane", transcription: "/ˈerpleɪn/", translation: "самолёт", example: "The airplane will land in 30 minutes.", exampleTranslation: "Самолёт приземлится через 30 минут.", learned: false },
                { word: "hotel", transcription: "/hoʊˈtel/", translation: "отель", example: "We stayed at a five-star hotel in Dubai.", exampleTranslation: "Мы остановились в пятизвёздочном отеле в Дубае.", learned: false }
            ]
        },
        verbs: {
            title: "Глаголы",
            words: [
                { word: "to travel", transcription: "/ˈtrævəl/", translation: "путешествовать", example: "We love to travel to different countries.", exampleTranslation: "Мы любим путешествовать по разным странам.", learned: false },
                { word: "to plan", transcription: "/plæn/", translation: "планировать", example: "I need to plan my route carefully.", exampleTranslation: "Мне нужно тщательно спланировать маршрут.", learned: false },
                { word: "to book", transcription: "/bʊk/", translation: "бронировать", example: "I'll book the hotel tonight.", exampleTranslation: "Я забронирую отель сегодня вечером.", learned: false },
                { word: "to depart", transcription: "/dɪˈpɑːrt/", translation: "отправляться", example: "The train departs at 8 PM.", exampleTranslation: "Поезд отправляется в 8 вечера.", learned: false },
                { word: "to arrive", transcription: "/əˈraɪv/", translation: "прибывать", example: "We will arrive at noon tomorrow.", exampleTranslation: "Мы прибудем завтра в полдень.", learned: false },
                { word: "to stay", transcription: "/steɪ/", translation: "останавливаться", example: "We'll stay in Berlin for three days.", exampleTranslation: "Мы остановимся в Берлине на три дня.", learned: false },
                { word: "to explore", transcription: "/ɪkˈsplɔːr/", translation: "исследовать", example: "Let's explore the old town.", exampleTranslation: "Давай исследуем старый город.", learned: false },
                { word: "to pack", transcription: "/pæk/", translation: "паковать", example: "I need to pack my suitcase tonight.", exampleTranslation: "Мне нужно упаковать чемодан сегодня вечером.", learned: false }
            ]
        },
        adjectives: {
            title: "Прилагательные",
            words: [
                { word: "adventurous", transcription: "/ədˈventʃərəs/", translation: "любящий приключения", example: "He is an adventurous traveler.", exampleTranslation: "Он путешественник, любящий приключения.", learned: false },
                { word: "exciting", transcription: "/ɪkˈsaɪtɪŋ/", translation: "захватывающий", example: "The trip was really exciting.", exampleTranslation: "Поездка была действительно захватывающей.", learned: false },
                { word: "relaxing", transcription: "/rɪˈlæksɪŋ/", translation: "расслабляющий", example: "We had a relaxing vacation at the beach.", exampleTranslation: "У нас был расслабляющий отпуск на пляже.", learned: false },
                { word: "unforgettable", transcription: "/ˌʌnfərˈɡetəbl/", translation: "незабываемый", example: "It was an unforgettable experience.", exampleTranslation: "Это был незабываемый опыт.", learned: false },
                { word: "local", transcription: "/ˈloʊkl/", translation: "местный", example: "Try the local cuisine.", exampleTranslation: "Попробуйте местную кухню.", learned: false },
                { word: "sunny", transcription: "/ˈsʌni/", translation: "солнечный", example: "We had sunny weather all week.", exampleTranslation: "У нас была солнечная погода всю неделю.", learned: false },
                { word: "cheap", transcription: "/tʃiːp/", translation: "дешёвый", example: "We found cheap flights to Spain.", exampleTranslation: "Мы нашли дешёвые билеты в Испанию.", learned: false }
            ]
        },
        phrases: {
            title: "Полезные фразы",
            words: [
                { word: "Where is the check-in desk?", transcription: "/wer ɪz ðə ˈtʃek ɪn desk/", translation: "Где стойка регистрации?", example: "Excuse me, where is the check-in desk?", exampleTranslation: "Извините, где стойка регистрации?", learned: false },
                { word: "My flight has been delayed.", transcription: "/maɪ flaɪt hæz biːn dɪˈleɪd/", translation: "Мой рейс задержали.", example: "I'm sorry, my flight has been delayed.", exampleTranslation: "Извините, мой рейс задержали.", learned: false },
                { word: "I have a reservation under the name...", transcription: "/aɪ hæv ə ˌrezərˈveɪʃən ˈʌndər ðə neɪm/", translation: "У меня есть бронь на имя...", example: "Hello, I have a reservation under the name Smith.", exampleTranslation: "Здравствуйте, у меня есть бронь на имя Смит.", learned: false },
                { word: "How do I get to...?", transcription: "/haʊ du aɪ ɡet tu/", translation: "Как добраться до...?", example: "Excuse me, how do I get to the city center?", exampleTranslation: "Извините, как добраться до центра города?", learned: false },
                { word: "A table for two, please.", transcription: "/ə ˈteɪbl fɔːr tuː pliːz/", translation: "Столик на двоих, пожалуйста.", example: "Good evening, a table for two, please.", exampleTranslation: "Добрый вечер, столик на двоих, пожалуйста.", learned: false }
            ]
        }
    };
    
    // Переменные для управления словами
    let currentCategory = '';
    let currentWordIndex = 0;
    let currentWords = [];
    
    // Переменные для тестирования
    let testQuestions = [];
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    let selectedAnswer = null;
    
    // Статистика пользователя
    let userStats = {
        totalWordsLearned: 0,
        travelWordsLearned: 0
    };
    
    // Симуляция загрузки
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Показываем главное меню после загрузки
            setTimeout(() => {
                loadingScreen.classList.remove('active');
                mainMenu.classList.add('active');
            }, 500);
        }
        
        // Обновляем прогресс бар
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }, 200);
    
    // Обработчики кнопок главного меню
    learnWordsBtn.addEventListener('click', function() {
        showScreen(topicsScreen);
        renderTopics();
    });
    
    dictionaryBtn.addEventListener('click', function() {
        showNotification('Экран "Словарь" будет реализован позже');
    });
    
    reviewBtn.addEventListener('click', function() {
        showNotification('Экран "Повторение" будет реализован позже');
    });
    
    // Обработчики навигации
    backToMainBtn.addEventListener('click', function() {
        showScreen(mainMenu);
    });
    
    backToTopicsBtn.addEventListener('click', function() {
        showScreen(topicsScreen);
    });
    
    backToCategoriesBtn.addEventListener('click', function() {
        showScreen(travelCategoriesScreen);
    });
    
    backFromTestBtn.addEventListener('click', function() {
        showScreen(travelCategoriesScreen);
    });
    
    // Обработчик кнопки "Повторить все слова темы"
    reviewTravelBtn.addEventListener('click', function() {
        startTest();
    });
    
    // Функция отображения экрана
    function showScreen(screenToShow) {
        // Скрываем все экраны
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        screenToShow.classList.add('active');
        
        // Прокручиваем наверх
        screenToShow.scrollTop = 0;
    }
    
    // Функция рендеринга списка тем
    function renderTopics(filter = '') {
        topicsList.innerHTML = '';
        
        const filteredTopics = topics.filter(topic => 
            topic.title.toLowerCase().includes(filter.toLowerCase())
        );
        
        filteredTopics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'topic-item';
            topicElement.innerHTML = `
                <div class="topic-header">
                    <div class="topic-title">${topic.title}</div>
                    <div class="topic-count">${topic.words} слов</div>
                </div>
                <div class="topic-progress">
                    <div class="progress-bar-small">
                        <div class="progress-fill" style="width: ${topic.progress}%"></div>
                    </div>
                    <div class="progress-percent">${topic.progress}%</div>
                </div>
            `;
            
            // Обработчик клика по теме
            topicElement.addEventListener('click', function() {
                if (topic.title === "Путешествия") {
                    showScreen(travelCategoriesScreen);
                } else {
                    showNotification(`Начинаем урок "${topic.title}"`);
                }
            });
            
            topicsList.appendChild(topicElement);
        });
        
        // Если нет тем
        if (filteredTopics.length === 0) {
            topicsList.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-search" style="font-size: 2.5rem; color: #9370DB; margin-bottom: 15px;"></i>
                    <p style="color: #D8BFD8; text-align: center;">Темы не найдены</p>
                </div>
            `;
        }
    }
    
    // Получить все слова из темы Путешествия
    function getAllTravelWords() {
        return [
            ...travelData.nouns.words,
            ...travelData.verbs.words,
            ...travelData.adjectives.words,
            ...travelData.phrases.words
        ];
    }
    
    // Получить выученные слова из темы Путешествия
    function getLearnedTravelWords() {
        return getAllTravelWords().filter(word => word.learned);
    }
    
    // Обновить счетчик выученных слов
    function updateLearnedWordsCount() {
        const learnedWords = getLearnedTravelWords().length;
        userStats.travelWordsLearned = learnedWords;
        userStats.totalWordsLearned = learnedWords;
        
        // Обновляем отображение
        wordsLearnedElement.textContent = learnedWords;
    }
    
    // Обработчики для кнопок подкатегорий
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            currentCategory = category;
            currentWords = travelData[category].words;
            currentWordIndex = 0;
            
            // Обновляем информацию на экране слов
            document.getElementById('current-category-title').textContent = travelData[category].title;
            document.getElementById('current-category-subtitle').textContent = 'Путешествия';
            
            // Показываем экран слов
            showScreen(wordsScreen);
            updateWordDisplay();
        });
    });
    
    // Функция обновления отображения слова
    function updateWordDisplay() {
        if (currentWords.length === 0) return;
        
        const word = currentWords[currentWordIndex];
        
        document.getElementById('current-word').textContent = word.word;
        document.getElementById('current-transcription').textContent = word.transcription;
        document.getElementById('current-translation').textContent = word.translation;
        document.getElementById('current-example').textContent = word.example;
        document.getElementById('current-example-translation').textContent = word.exampleTranslation;
        
        // Устанавливаем тип слова
        let typeText = '';
        switch(currentCategory) {
            case 'nouns': typeText = 'существительное'; break;
            case 'verbs': typeText = 'глагол'; break;
            case 'adjectives': typeText = 'прилагательное'; break;
            case 'phrases': typeText = 'полезная фраза'; break;
        }
        document.getElementById('current-type').textContent = typeText;
    }
    
    // Обработчики навигации по словам
    document.getElementById('prev-word').addEventListener('click', function() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
            updateWordDisplay();
        }
    });
    
    document.getElementById('next-word').addEventListener('click', function() {
        if (currentWordIndex < currentWords.length - 1) {
            currentWordIndex++;
            updateWordDisplay();
        } else {
            showNotification('Вы завершили просмотр всех слов в этой категории.');
            // Возвращаемся к категориям
            setTimeout(() => {
                showScreen(travelCategoriesScreen);
            }, 1500);
        }
    });
    
    // Обработчики кнопок сложности
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const difficulty = this.getAttribute('data-difficulty');
            const currentWord = currentWords[currentWordIndex];
            
            // Помечаем слово как выученное если не "Трудно"
            if (difficulty !== 'hard' && !currentWord.learned) {
                currentWord.learned = true;
                updateLearnedWordsCount();
                showNotification(`Вы выучили новое слово! Всего выучено: ${userStats.totalWordsLearned}`);
            }
            
            // Переходим к следующему слову
            setTimeout(() => {
                if (currentWordIndex < currentWords.length - 1) {
                    currentWordIndex++;
                    updateWordDisplay();
                } else {
                    showNotification('Вы завершили изучение этой категории!');
                    setTimeout(() => {
                        showScreen(travelCategoriesScreen);
                    }, 1500);
                }
            }, 300);
        });
    });
    
    // Функция для начала тестирования
    function startTest() {
        // Собираем все слова из темы Путешествия
        const allWords = getAllTravelWords();
        
        // Если слов недостаточно
        if (allWords.length < 4) {
            showNotification('Недостаточно слов для тестирования');
            return;
        }
        
        // Выбираем 10 случайных слов (или меньше, если слов мало)
        const testCount = Math.min(10, allWords.length);
        const shuffledWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, testCount);
        
        // Создаем вопросы
        testQuestions = shuffledWords.map(word => ({
            word: word.word,
            transcription: word.transcription,
            correctTranslation: word.translation,
            example: word.example,
            options: generateOptions(word.translation, allWords)
        }));
        
        // Сбрасываем статистику теста
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        wrongAnswersCount = 0;
        selectedAnswer = null;
        
        // Обновляем отображение статистики
        correctAnswersElement.textContent = '0';
        wrongAnswersElement.textContent = '0';
        
        // Обновляем информацию о тесте
        totalQuestionsElement.textContent = testQuestions.length;
        currentQuestionElement.textContent = '1';
        
        // Показываем экран тестирования
        showScreen(testScreen);
        showQuestion();
    }
    
    // Функция для генерации вариантов ответов
    function generateOptions(correctTranslation, allWords) {
        const options = [correctTranslation];
        
        // Выбираем 3 случайных перевода из других слов
        const otherTranslations = allWords
            .map(word => word.translation)
            .filter(translation => translation !== correctTranslation);
        
        // Перемешиваем и берем 3
        const shuffled = [...otherTranslations].sort(() => Math.random() - 0.5).slice(0, 3);
        options.push(...shuffled);
        
        // Перемешиваем все варианты
        return options.sort(() => Math.random() - 0.5);
    }
    
    // Функция для отображения вопроса
    function showQuestion() {
        if (currentQuestionIndex >= testQuestions.length) {
            showTestResults();
            return;
        }
        
        const question = testQuestions[currentQuestionIndex];
        
        // Обновляем информацию о вопросе
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        testWordElement.textContent = question.word;
        testTranscriptionElement.textContent = question.transcription;
        
        // Очищаем контейнер с вариантами
        optionsContainer.innerHTML = '';
        testFeedbackElement.style.display = 'none';
        testFeedbackElement.innerHTML = '';
        nextQuestionBtn.disabled = true;
        
        // Добавляем варианты ответов
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = `${index + 1}. ${option}`;
            optionBtn.dataset.option = option;
            
            optionBtn.addEventListener('click', () => {
                if (selectedAnswer !== null) return; // Уже ответили
                
                selectedAnswer = option;
                checkAnswer(option, question.correctTranslation, question);
            });
            
            optionsContainer.appendChild(optionBtn);
        });
    }
    
    // Функция проверки ответа
    function checkAnswer(selected, correct, question) {
        // Отключаем все кнопки
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            
            if (btn.dataset.option === correct) {
                btn.classList.add('correct');
            } else if (btn.dataset.option === selected && selected !== correct) {
                btn.classList.add('wrong');
            }
        });
        
        // Показываем обратную связь
        testFeedbackElement.style.display = 'block';
        
        if (selected === correct) {
            correctAnswersCount++;
            correctAnswersElement.textContent = correctAnswersCount;
            
            testFeedbackElement.innerHTML = `
                <div class="feedback-correct">
                    <i class="fas fa-check-circle"></i>
                    <span>Правильно!</span>
                </div>
                <div class="feedback-translation">
                    <strong>Перевод:</strong> ${question.word} - ${correct}
                </div>
                <div class="feedback-example">
                    "${question.example}"
                </div>
            `;
        } else {
            wrongAnswersCount++;
            wrongAnswersElement.textContent = wrongAnswersCount;
            
            testFeedbackElement.innerHTML = `
                <div class="feedback-wrong">
                    <i class="fas fa-times-circle"></i>
                    <span>Неправильно</span>
                </div>
                <div class="feedback-translation">
                    <strong>Правильный ответ:</strong> ${question.word} - ${correct}
                </div>
                <div class="feedback-translation">
                    <strong>Ваш ответ:</strong> ${selected}
                </div>
                <div class="feedback-example">
                    "${question.example}"
                </div>
            `;
        }
        
        // Активируем кнопку следующего вопроса
        nextQuestionBtn.disabled = false;
    }
    
    // Обработчик кнопки следующего вопроса
    nextQuestionBtn.addEventListener('click', function() {
        currentQuestionIndex++;
        selectedAnswer = null;
        showQuestion();
    });
    
    // Функция показа результатов теста
    function showTestResults() {
        // Скрываем элементы теста
        testWordElement.textContent = '';
        testTranscriptionElement.textContent = '';
        optionsContainer.innerHTML = '';
        testFeedbackElement.style.display = 'none';
        nextQuestionBtn.style.display = 'none';
        
        // Показываем результаты
        const score = Math.round((correctAnswersCount / testQuestions.length) * 100);
        
        testWordElement.textContent = 'Результаты теста';
        testWordElement.style.fontSize = '1.5rem';
        testTranscriptionElement.textContent = `Вы ответили правильно на ${score}% вопросов`;
        
        testFeedbackElement.style.display = 'block';
        testFeedbackElement.innerHTML = `
            <div class="feedback-correct" style="justify-content: center;">
                <i class="fas fa-trophy"></i>
                <span>Правильных ответов: ${correctAnswersCount}/${testQuestions.length}</span>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <div style="font-size: 2.5rem; color: #8A2BE2; margin-bottom: 8px;">${score}%</div>
                <div style="color: #D8BFD8; margin-bottom: 15px; font-size: 0.9rem;">
                    ${getResultMessage(score)}
                </div>
                <button class="option-btn" id="restart-test-btn" style="background: rgba(138, 43, 226, 0.2);">
                    <i class="fas fa-redo"></i>
                    <span>Пройти тест еще раз</span>
                </button>
            </div>
        `;
        
        // Обработчик кнопки повторного теста
        document.getElementById('restart-test-btn').addEventListener('click', function() {
            startTest();
        });
    }
    
    // Функция получения сообщения по результатам
    function getResultMessage(score) {
        if (score >= 90) return 'Отличный результат! Вы отлично знаете тему!';
        if (score >= 70) return 'Хороший результат! Продолжайте в том же духе!';
        if (score >= 50) return 'Неплохо! Но есть куда расти.';
        return 'Попробуйте еще раз! Вы обязательно улучшите результат!';
    }
    
    // Поиск по темам
    const searchInput = document.getElementById('search-topics');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderTopics(this.value);
        });
    }
    
    // Функция показа уведомлений
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Удаление через 2 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    // Инициализация тем при загрузке
    renderTopics();
    
    // Инициализация начальной статистики
    updateLearnedWordsCount();
    
    // Предотвращение масштабирования на мобильных устройствах
    document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Улучшение для мобильного скролла
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    // Инициализация Telegram кнопки
    if (tg && tg.MainButton) {
        tg.MainButton.setText('Открыть LinguaBot');
        tg.MainButton.show();
    }
});
