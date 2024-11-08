const messages = JSON.parse(localStorage.getItem('messages')) || [];
const previewElement = document.getElementById('jsonlPreview');
const languageSelector = document.getElementById('languageSelector');

// Atualizar a pré-visualização com o conteúdo atual do local storage
updatePreview();

// Função para salvar mensagens no local storage
function saveToLocalStorage() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Função para adicionar mensagem ao array
document.getElementById('addMessage').addEventListener('click', () => {
    const systemContent = document.getElementById('systemContent').value;
    const userContent = document.getElementById('userContent').value;
    const assistantContent = document.getElementById('assistantContent').value;

    if (!systemContent || !userContent || !assistantContent) {
        alert('Please fill in all fields.');
        return;
    }

    // Adiciona a mensagem formatada ao array de mensagens
    messages.push({
        messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent },
            { role: "assistant", content: assistantContent }
        ]
    });

    // Salva no local storage e limpa os campos de entrada para nova entrada
    saveToLocalStorage();
    document.getElementById('userContent').value = '';
    document.getElementById('assistantContent').value = '';
    updatePreview();
});

// Função para atualizar a pré-visualização do JSONL
function updatePreview() {
    previewElement.textContent = messages.map(msg => JSON.stringify(msg)).join('\n');
}

// Função para baixar o arquivo JSONL
document.getElementById('downloadJsonl').addEventListener('click', () => {
    if (messages.length === 0) {
        alert('No messages added.');
        return;
    }

    const blob = new Blob([previewElement.textContent], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversas.jsonl';
    a.click();
    URL.revokeObjectURL(url);
});

// Função para deletar o cache do local storage
document.getElementById('clearCache').addEventListener('click', () => {
    localStorage.removeItem('messages');
    messages.length = 0;
    updatePreview();
});

// Função para alterar o idioma
languageSelector.addEventListener('change', () => {
    const lang = languageSelector.value;
    const translations = {
        en: {
            title: "JSONL File Generator for Fine-Tuning",
            systemContentLabel: "System Content",
            userContentLabel: "User Message",
            assistantContentLabel: "Assistant's Response",
            previewTitle: "JSONL Preview",
            placeholderSystem: "E.g., You are a dental clinic assistant.",
            placeholderUser: "Enter the user's question here.",
            placeholderAssistant: "Enter the assistant's response here."
        },
        pt: {
            title: "Gerador de Arquivo JSONL para Fine-Tuning",
            systemContentLabel: "Contexto (System Content)",
            userContentLabel: "Mensagem do Usuário",
            assistantContentLabel: "Resposta do Assistente",
            previewTitle: "Pré-visualização do JSONL",
            placeholderSystem: "Ex.: Você é um assistente de consultório odontológico.",
            placeholderUser: "Digite a pergunta do usuário.",
            placeholderAssistant: "Digite a resposta do assistente."
        },
        es: {
            title: "Generador de Archivo JSONL para Fine-Tuning",
            systemContentLabel: "Contexto del Sistema",
            userContentLabel: "Mensaje del Usuario",
            assistantContentLabel: "Respuesta del Asistente",
            previewTitle: "Vista Previa de JSONL",
            placeholderSystem: "Ejemplo: Eres un asistente de una clínica dental.",
            placeholderUser: "Escribe la pregunta del usuario.",
            placeholderAssistant: "Escribe la respuesta del asistente."
        },
        hi: {
            title: "फाइन-ट्यूनिंग के लिए JSONL फ़ाइल जनरेटर",
            systemContentLabel: "सिस्टम सामग्री",
            userContentLabel: "उपयोगकर्ता संदेश",
            assistantContentLabel: "सहायक की प्रतिक्रिया",
            previewTitle: "JSONL पूर्वावलोकन",
            placeholderSystem: "उदाहरण: आप एक डेंटल क्लिनिक के सहायक हैं।",
            placeholderUser: "उपयोगकर्ता का प्रश्न यहाँ लिखें।",
            placeholderAssistant: "सहायक की प्रतिक्रिया यहाँ लिखें।"
        }
    };

    document.getElementById('title').innerText = translations[lang].title;
    document.getElementById('systemContentLabel').innerText = translations[lang].systemContentLabel;
    document.getElementById('userContentLabel').innerText = translations[lang].userContentLabel;
    document.getElementById('assistantContentLabel').innerText = translations[lang].assistantContentLabel;
    document.getElementById('previewTitle').innerText = translations[lang].previewTitle;
    document.getElementById('systemContent').placeholder = translations[lang].placeholderSystem;
    document.getElementById('userContent').placeholder = translations[lang].placeholderUser;
    document.getElementById('assistantContent').placeholder = translations[lang].placeholderAssistant;
});

// Inicializa com o idioma padrão (Inglês)
languageSelector.dispatchEvent(new Event('change'));

