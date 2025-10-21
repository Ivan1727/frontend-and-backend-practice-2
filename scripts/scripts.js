// Основные функции сайта
document.addEventListener('DOMContentLoaded', function() {
    initProgressBars();

    initForms();
    
    if (document.querySelector('.project-card')) {
        initProjectModals();
        initProjectFilters();
    }
    
    if (document.getElementById('diaryEntries')) {
        initDiary();
    }
    
    // Добавление плавной прокрутки для всех ссылок с якорями
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Ф-ция для анимации прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // наблюдатель для анимации при прокрутке
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-in-out';
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Ф-ция для инициализации обработчиков форм
function initForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            if (name === '') {
                showError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                clearError('name');
            }
            
            if (email === '') {
                showError('email', 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError('email');
            }
            
            if (message === '') {
                showError('message', 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (isValid) {
                // Вывод данных в консоль
                console.log('=== ФОРМА КОНТАКТОВ ===');
                console.log('Имя:', name);
                console.log('Email:', email);
                console.log('Сообщение:', message);
                console.log('Время отправки:', new Date().toLocaleString());
                console.log('=====================');
                
                // Уведомление
                showNotification('Сообщение успешно отправлено!','success');
                
                // Очистка формы
                contactForm.reset();
            }
        });
    }
    
    // Обработка формы добавления записи в дневник
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('entryTitle').value.trim();
            const date = document.getElementById('entryDate').value;
            const status = document.getElementById('entryStatus').value;
            
            if (title === '') {
                showError('entryTitle', 'Пожалуйста, введите название задачи');
                return;
            }
            
            addDiaryEntry(title, date, status);
            diaryForm.reset();
            showNotification('Запись успешно добавлена в дневник!', 'success');
        });
    }
}

// Ф-ция для проверки валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Ф-ция для отображения ошибки
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = document.getElementById(`${fieldId}Error`);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldId}Error`;
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
    }
    
    field.classList.add('is-invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Ф-ция для очистки ошибки
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    field.classList.remove('is-invalid');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Ф-ция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создание элемента уведомлений
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Скрытие уведомление через 5 секуд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Ф-ция для скачивания резюме
function downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Резюме_Иван_Мухин.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Резюме успешно скачано!', 'success');
}

// Ф-ции для работы с проектами
function initProjectModals() {
    // Данные проектов
    const projectsData = {
        'project1': {
            title: 'Личный сайт',
            description: 'Адаптивный веб-сайт с использованием HTML и CSS. Проект включает в себя главную страницу, портфолио и контактную форму.',
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project2': {
            title: 'Todo-приложение',
            description: 'Интерактивное приложение для управления задачами с возможностью добавления, редактирования и удаления задач.',
            technologies: ['JavaScript', 'LocalStorage', 'Bootstrap'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project3': {
            title: 'Портфолио на Bootstrap',
            description: 'Современное адаптивное портфолио с использованием Bootstrap 5. Включает анимации и интерактивные элементы.',
            technologies: ['Bootstrap 5', 'JavaScript', 'CSS3'],
            liveLink: '#',
            codeLink: '#',
            images: []
        },
        'project4': {
            title: 'Интернет-магазин',
            description: 'Прототип интернет-магазина с корзиной покупок и системой фильтрации товаров.',
            technologies: ['React', 'Node.js', 'MongoDB'],
            liveLink: '#',
            codeLink: '#',
            images: []
        }
    };

    // Обработчики для модальных окон проектов
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (project) {
                showProjectModal(project);
            }
        });
    });
}

function showProjectModal(project) {
    // Создание модального окна
    let modal = document.getElementById('projectModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'projectModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="projectModalTitle">${project.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p id="projectModalDescription">${project.description}</p>
                        <h6>Технологии:</h6>
                        <div id="projectModalTechnologies"></div>
                        <div class="mt-3">
                            <a href="${project.liveLink}" class="btn btn-primary me-2" target="_blank">Живая версия</a>
                            <a href="${project.codeLink}" class="btn btn-outline-secondary" target="_blank">Исходный код</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Обновление содержимого модального окна
        document.getElementById('projectModalTitle').textContent = project.title;
        document.getElementById('projectModalDescription').textContent = project.description;
        
        const technologiesContainer = document.getElementById('projectModalTechnologies');
        technologiesContainer.innerHTML = project.technologies.map(tech => 
            `<span class="badge bg-secondary me-1">${tech}</span>`
        ).join('');
        
        const liveLink = modal.querySelector('.btn-primary');
        const codeLink = modal.querySelector('.btn-outline-secondary');
        liveLink.href = project.liveLink;
        codeLink.href = project.codeLink;
    }
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter');
    
    setTimeout(() => {
        filterProjects('all');
    }, 100);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-item');
    const container = document.getElementById('projectsContainer');
    
    if (!container) return;
    
    projects.forEach(project => {
        project.style.display = 'none';
        project.classList.remove('d-flex');
    });
    
    // Показ соответствующих фильтру проектов
    let visibleProjects = 0;
    projects.forEach(project => {
        const category = project.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            project.style.display = 'block';
            project.classList.add('d-flex');
            visibleProjects++;
        }
    });
    
    // Если видимых проектов > 3, добавляются классы для выравнивания по левому краю
    if (visibleProjects < 3) {
        container.classList.add('justify-content-start');
        container.classList.remove('justify-content-center', 'justify-content-between');
    } else {
        container.classList.remove('justify-content-start');
    }
}

// Ф-ции для работы с дневником
function initDiary() {
    // Загрузка записей дневника из localStorage
    loadDiaryEntries();
    
    updateCourseProgress();
}

function loadDiaryEntries() {
    let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [
        { 
            title: 'Верстка макета сайта', 
            date: '2024-12-15', 
            status: 'completed' 
        },
        { 
            title: 'JavaScript основы', 
            date: '2024-12-10', 
            status: 'completed' 
        },
        { 
            title: 'Работа с формами', 
            date: '2024-12-05', 
            status: 'in-progress' 
        },
        { 
            title: 'Адаптивный дизайн', 
            date: '2024-12-01', 
            status: 'in-progress' 
        }
    ];
    
    // Добавление ID к старым записям, если их нет
    diaryEntries = diaryEntries.map(entry => {
        if (!entry.id) {
            return {
                ...entry,
                id: generateId()
            };
        }
        return entry;
    });
    
    // Сохранение обратно в localStorage с ID
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    if (entriesContainer) {
        renderDiaryEntries(entriesContainer, diaryEntries);
    }
}


function renderDiaryEntries(container, entries) {
    container.innerHTML = '';
    
    if (entries.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Записей пока нет</p>';
        return;
    }
    
    entries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = `diary-entry ${entry.status}`;
        entryElement.setAttribute('data-entry-id', entry.id);
        
        const statusIcon = entry.status === 'completed' ? '✓' : '⟳';
        const statusText = entry.status === 'completed' ? 'Завершено' : 'В процессе';
        
        entryElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h5 class="mb-2">${entry.title}</h5>
                    <p class="mb-1"><small class="text-muted">Дата: ${entry.date}</small></p>
                    <span class="badge ${entry.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                        ${statusIcon} ${statusText}
                    </span>
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm ms-3 delete-entry" data-entry-id="${entry.id}">
                    Удалить
                </button>
            </div>
        `;
        
        container.appendChild(entryElement);
    });
    
    addDeleteHandlers();
}

function addDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('.delete-entry');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const entryId = this.getAttribute('data-entry-id');
            deleteDiaryEntry(entryId);
        });
    });
}

function deleteDiaryEntry(entryId) {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
        return;
    }
    
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const updatedEntries = diaryEntries.filter(entry => entry.id !== entryId);
    
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    
    // Обновление отображения
    const entriesContainer = document.getElementById('diaryEntries');
    renderDiaryEntries(entriesContainer, updatedEntries);
    
    updateCourseProgress();
    
    showNotification('Запись успешно удалена!', 'success');
}

function addDiaryEntry(title, date, status) {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    
    // Если дата не указана, используется текущая дата
    const entryDate = date || new Date().toISOString().split('T')[0];
    
    const newEntry = {
        id: generateId(),
        title: title,
        date: entryDate,
        status: status
    };
    
    diaryEntries.unshift(newEntry);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    
    const entriesContainer = document.getElementById('diaryEntries');
    renderDiaryEntries(entriesContainer, diaryEntries);
    
    updateCourseProgress();
}

function updateCourseProgress() {
    const coursesContainer = document.getElementById('coursesProgress');
    if (!coursesContainer) return;
    
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const totalEntries = diaryEntries.length;
    const completedEntries = diaryEntries.filter(entry => entry.status === 'completed').length;
    const progressPercentage = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
    
    coursesContainer.innerHTML = `
        <div class="mb-3">
            <h6>Общий прогресс обучения</h6>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%">
                    ${progressPercentage}%
                </div>
            </div>
        </div>
        <div>
            <p><strong>Завершено задач:</strong> ${completedEntries} из ${totalEntries}</p>
            <p><strong>Всего задач:</strong> ${totalEntries}</p>
        </div>
    `;
}

// Вспомогательные ф-ции
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Глобальные ф-ции для вызова из HTML
window.downloadResume = downloadResume;