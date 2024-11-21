
const emails = [
    {
        id: 1,
        from: 'servizio.clienti@bancasicura.it',
        subject: 'Aggiornamento dati account',
        content: 'Gentile cliente, è necessario aggiornare i suoi dati. Clicchi qui.',
        isSuspicious: true,
        correctFolder: 'Spam',
        hint: 'Controlla attentamente il mittente e il contenuto che richiede di cliccare su un link.'
    },
    {
        id: 2,
        from: 'newsletter@amazon.it',
        subject: 'Le nostre offerte della settimana',
        content: 'Scopri le migliori offerte Amazon della settimana!',
        isSuspicious: false,
        correctFolder: 'Personale',
        hint: 'Le newsletter legittime possono essere organizzate in cartelle specifiche.'
    },
    {
        id: 3,
        from: 'mario.rossi@gmail.com',
        subject: 'Riunione di domani',
        content: 'Ciao, confermo la riunione di domani alle 15:00.',
        isSuspicious: false,
        correctFolder: 'Lavoro',
        hint: 'Le email di lavoro dovrebbero essere organizzate nella cartella appropriata.'
    }
];

let score = 0;
let completedTasks = {
    identifySuspicious: false,
    organizeEmails: false,
    composeEmail: false
};

function updateProgress() {
    const totalTasks = Object.keys(completedTasks).length;
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    const percentage = (completedCount / totalTasks) * 100;
    
    document.querySelector('.progress').style.width = `${percentage}%`;
    
    // Aggiorna i checkmark
    const taskItems = document.querySelectorAll('.task-item');
    Object.values(completedTasks).forEach((completed, index) => {
        if (completed) {
            taskItems[index].classList.add('completed');
            taskItems[index].querySelector('.checkmark').textContent = '✅';
        }
    });
}

function showFeedback(message, isSuccess) {
    const feedbackDiv = document.querySelector('.feedback-message');
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback-message ${isSuccess ? 'success' : 'error'}`;
    feedbackDiv.style.display = 'block';
    
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 3000);
}

function showHint() {
    // Mostra suggerimento contestuale basato sulla situazione corrente
    let hint = 'Suggerimento generale: controlla sempre il mittente delle email.';
    showFeedback(hint, true);
}

function handleEmailAction(emailId, action, folder) {
    const email = emails.find(e => e.id === emailId);
    
    if (action === 'identify' && email.isSuspicious) {
        score += 10;
        completedTasks.identifySuspicious = true;
        showFeedback('Ottimo! Hai identificato correttamente un\'email sospetta!', true);
    } else if (action === 'move' && folder === email.correctFolder) {
        score += 5;
        completedTasks.organizeEmails = true;
        showFeedback('Email organizzata correttamente!', true);
    }
    
    updateProgress();
}

function validateNewEmail(subject, content, recipients) {
    let isValid = true;
    let feedback = [];

    if (!subject) {
        isValid = false;
        feedback.push('Inserisci un oggetto');
    }

    if (content.length < 10) {
        isValid = false;
        feedback.push('Il contenuto è troppo breve');
    }

    if (!recipients || !recipients.includes('@')) {
        isValid = false;
        feedback.push('Inserisci un destinatario valido');
    }

    if (isValid) {
        completedTasks.composeEmail = true;
        score += 15;
        showFeedback('Email composta correttamente!', true);
    } else {
        showFeedback(feedback.join('\n'), false);
    }
    
    updateProgress();
}

function renderEmails() {
    const emailList = document.querySelector('.email-list');
    emailList.innerHTML = '';
    
    emails.forEach(email => {
        const emailElement = document.createElement('div');
        emailElement.className = `email-item ${email.isSuspicious ? 'suspicious' : ''}`;
        emailElement.innerHTML = `
            <div>
                <div><strong>Da:</strong> ${email.from}</div>
                <div><strong>Oggetto:</strong> ${email.subject}</div>
            </div>
            <div class="email-actions">
                <button onclick="handleEmailAction(${email.id}, 'identify')">Segnala</button>
                <button onclick="handleEmailAction(${email.id}, 'move', 'Spam')">Sposta</button>
            </div>
        `;
        emailList.appendChild(emailElement);
    });
}

// Inizializzazione
function init() {
    renderEmails();
    updateProgress();
}

window.onload = init;
