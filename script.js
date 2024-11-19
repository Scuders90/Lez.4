let score = 0;

const emailList = [
    {
        id: 1,
        from: "servizio.clienti@bancasicura.it",
        subject: "Aggiornamento dati account",
        body: "Gentile cliente, è necessario aggiornare i suoi dati. Clicchi qui.",
        date: "10:30",
        isSpam: true,
        unread: true
    },
    {
        id: 2,
        from: "newsletter@amazon.it",
        subject: "Le nostre offerte della settimana",
        body: "Scopri le migliori offerte Amazon della settimana!",
        date: "09:15",
        isSpam: false,
        unread: true
    },
    {
        id: 3,
        from: "mario.rossi@gmail.com",
        subject: "Riunione di domani",
        body: "Ciao, confermo la riunione di domani alle 15:00.",
        date: "Ieri",
        isSpam: false,
        unread: false
    }
];

function inizializzaEmailList() {
    const container = document.querySelector('.email-list');
    container.innerHTML = '';
    
    emailList.forEach(email => {
        const div = document.createElement('div');
        div.className = `email-item ${email.unread ? 'unread' : ''} ${email.isSpam ? 'suspicious' : ''}`;
        div.innerHTML = `
            <div class="email-preview">
                <div>${email.from}</div>
                <div>${email.subject}</div>
            </div>
            <div class="email-date">${email.date}</div>
        `;
        div.onclick = () => mostraEmail(email);
        container.appendChild(div);
    });
}

function mostraEmail(email) {
    const detailView = document.querySelector('.email-detail');
    const listView = document.querySelector('.email-list');
    const composeView = document.querySelector('.compose-email');
    
    detailView.style.display = 'block';
    listView.style.display = 'none';
    composeView.style.display = 'none';
    
    detailView.querySelector('.email-from').textContent = `Da: ${email.from}`;
    detailView.querySelector('.email-subject').textContent = email.subject;
    detailView.querySelector('.email-body').textContent = email.body;
    detailView.querySelector('.email-date').textContent = email.date;
}

function identificaSpam() {
    const emailMostrata = document.querySelector('.email-detail .email-from').textContent;
    const email = emailList.find(e => `Da: ${e.from}` === emailMostrata);
    
    if (email.isSpam) {
        score += 10;
        mostraFeedback("Corretto! Questa è una email sospetta.", true);
    } else {
        score -= 5;
        mostraFeedback("Attenzione! Questa non è una email sospetta.", false);
    }
    
    document.getElementById('score').textContent = score;
}

function mostraFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isSuccess ? 'success' : 'error'}`;
    feedback.textContent = message;
    
    document.querySelector('.email-detail').appendChild(feedback);
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

function verificaEmail() {
    const to = document.getElementById('to-field').value;
    const subject = document.getElementById('subject-field').value;
    const message = document.getElementById('message-field').value;
    
    let points = 0;
    let feedback = [];
    
    // Verifica destinatario
    if (to.includes('@') && to.includes('.')) {
        points += 5;
    } else {
        feedback.push("Indirizzo email non valido");
    }
    
    // Verifica oggetto
    if (subject.length > 0) {
        points += 5;
    } else {
        feedback.push("Inserire un oggetto");
    }
    
    // Verifica messaggio
    if (message.length > 10) {
        points += 5;
    } else {
        feedback.push("Il messaggio è troppo breve");
    }
    
    score += points;
    document.getElementById('score').textContent = score;
    
    if (feedback.length > 0) {
        mostraFeedback(feedback.join(", "), false);
    } else {
        mostraFeedback("Email composta correttamente!", true);
        chiudiComposizione();
    }
}

document.querySelector('.new-email-btn').onclick = () => {
    document.querySelector('.email-list').style.display = 'none';
    document.querySelector('.email-detail').style.display = 'none';
    document.querySelector('.compose-email').style.display = 'block';
};

function chiudiComposizione() {
    document.querySelector('.compose-email').style.display = 'none';
    document.querySelector('.email-list').style.display = 'block';
    document.getElementById('to-field').value = '';
    document.getElementById('subject-field').value = '';
    document.getElementById('message-field').value = '';
}

window.onload = inizializzaEmailList;
