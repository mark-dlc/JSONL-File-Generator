const messages = JSON.parse(localStorage.getItem('messages')) || [];
const previewElement = document.getElementById('jsonlPreview');
const languageSelector = document.getElementById('languageSelector');
const jsonFileInput = document.getElementById('jsonFileInput');
const jsonFileStatus = document.getElementById('jsonFileStatus');
let uploadedJsonData = null;

// Update preview with current local storage content
updatePreview();

// Function to save messages to local storage
function saveToLocalStorage() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Function to handle JSON file upload
jsonFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        uploadedJsonData = null;
        jsonFileStatus.textContent = '';
        return;
    }

    if (file.type !== 'application/json') {
        jsonFileStatus.textContent = 'Please select a valid JSON file.';
        jsonFileStatus.className = 'file-status error';
        uploadedJsonData = null;
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            uploadedJsonData = JSON.parse(e.target.result);
            jsonFileStatus.textContent = `JSON file loaded successfully (${file.name})`;
            jsonFileStatus.className = 'file-status success';
            
            // If the JSON data is a string, use it as the assistant content
            if (typeof uploadedJsonData === 'string') {
                document.getElementById('assistantContent').value = uploadedJsonData;
            } else {
                // If it's an object, stringify it for the assistant content
                document.getElementById('assistantContent').value = JSON.stringify(uploadedJsonData, null, 2);
            }
        } catch (error) {
            jsonFileStatus.textContent = 'Invalid JSON file format.';
            jsonFileStatus.className = 'file-status error';
            uploadedJsonData = null;
        }
    };
    reader.readAsText(file);
});

// Function to add message to array
document.getElementById('addMessage').addEventListener('click', () => {
    const userContent = document.getElementById('userContent').value;
    const assistantContent = document.getElementById('assistantContent').value;

    if (!userContent || !assistantContent) {
        alert('Please fill in both the user message and assistant response fields.');
        return;
    }

    // Add the formatted message to the messages array
    messages.push({
        messages: [
            { role: "user", content: userContent },
            { role: "assistant", content: assistantContent }
        ]
    });

    // Save to local storage and clear input fields for new entry
    saveToLocalStorage();
    document.getElementById('userContent').value = '';
    document.getElementById('assistantContent').value = '';
    
    // Clear file input and status
    jsonFileInput.value = '';
    jsonFileStatus.textContent = '';
    uploadedJsonData = null;
    
    updatePreview();
});

// Function to update JSONL preview
function updatePreview() {
    previewElement.textContent = messages.map(msg => JSON.stringify(msg)).join('\n');
}

// Function to download JSONL file
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

// Function to delete local storage cache
document.getElementById('clearCache').addEventListener('click', () => {
    localStorage.removeItem('messages');
    messages.length = 0;
    updatePreview();
});

// Function to change language
languageSelector.addEventListener('change', () => {
    const lang = languageSelector.value;
    const translations = {
        en: {
            title: "JSONL File Generator for Fine-Tuning",
            userContentLabel: "User Message",
            assistantContentLabel: "Assistant's Response",
            jsonFileLabel: "Upload JSON File (Optional)",
            previewTitle: "JSONL Preview",
            placeholderUser: "Enter the user's question here.",
            placeholderAssistant: "Enter the assistant's response here or upload a JSON file below."
        },
        pt: {
            title: "Gerador de Arquivo JSONL para Fine-Tuning",
            userContentLabel: "Mensagem do Usuário",
            assistantContentLabel: "Resposta do Assistente",
            jsonFileLabel: "Carregar Arquivo JSON (Opcional)",
            previewTitle: "Pré-visualização do JSONL",
            placeholderUser: "Digite a pergunta do usuário.",
            placeholderAssistant: "Digite a resposta do assistente ou carregue um arquivo JSON abaixo."
        },
        es: {
            title: "Generador de Archivo JSONL para Fine-Tuning",
            userContentLabel: "Mensaje del Usuario",
            assistantContentLabel: "Respuesta del Asistente",
            jsonFileLabel: "Subir Archivo JSON (Opcional)",
            previewTitle: "Vista Previa de JSONL",
            placeholderUser: "Escribe la pregunta del usuario.",
            placeholderAssistant: "Escribe la respuesta del asistente o sube un archivo JSON abajo."
        },
        hi: {
            title: "फाइन-ट्यूनिंग के लिए JSONL फ़ाइल जनरेटर",
            userContentLabel: "उपयोगकर्ता संदेश",
            assistantContentLabel: "सहायक की प्रतिक्रिया",
            jsonFileLabel: "JSON फ़ाइल अपलोड करें (वैकल्पिक)",
            previewTitle: "JSONL पूर्वावलोकन",
            placeholderUser: "उपयोगकर्ता का प्रश्न यहाँ लिखें।",
            placeholderAssistant: "सहायक की प्रतिक्रिया यहाँ लिखें या नीचे JSON फ़ाइल अपलोड करें।"
        }
    };

    document.getElementById('title').innerText = translations[lang].title;
    document.getElementById('userContentLabel').innerText = translations[lang].userContentLabel;
    document.getElementById('assistantContentLabel').innerText = translations[lang].assistantContentLabel;
    document.getElementById('jsonFileLabel').innerText = translations[lang].jsonFileLabel;
    document.getElementById('previewTitle').innerText = translations[lang].previewTitle;
    document.getElementById('userContent').placeholder = translations[lang].placeholderUser;
    document.getElementById('assistantContent').placeholder = translations[lang].placeholderAssistant;
});

// Initialize with default language (English)
languageSelector.dispatchEvent(new Event('change'));