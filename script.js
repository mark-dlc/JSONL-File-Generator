const messages = JSON.parse(localStorage.getItem('messages')) || [];
const previewElement = document.getElementById('jsonlPreview');
const languageSelector = document.getElementById('languageSelector');
const jsonFileInput = document.getElementById('jsonFileInput');
const jsonFileStatus = document.getElementById('jsonFileStatus');
let uploadedJsonFiles = [];

// Update preview with current local storage content
updatePreview();

// Function to save messages to local storage
function saveToLocalStorage() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Function to handle JSON file upload
jsonFileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    uploadedJsonFiles = [];
    
    if (files.length === 0) {
        jsonFileStatus.textContent = '';
        return;
    }

    let processedFiles = 0;
    let validFiles = 0;
    let errorFiles = [];

    files.forEach((file, index) => {
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            errorFiles.push(file.name);
            processedFiles++;
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                const fileName = file.name.replace('.json', ''); // Remove .json extension
                
                uploadedJsonFiles.push({
                    fileName: fileName,
                    content: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2)
                });
                
                validFiles++;
            } catch (error) {
                errorFiles.push(file.name);
            }
            
            processedFiles++;
            
            // Update status when all files are processed
            if (processedFiles === files.length) {
                updateFileStatus(validFiles, errorFiles);
            }
        };
        reader.readAsText(file);
    });
});

function updateFileStatus(validFiles, errorFiles) {
    let statusText = '';
    let statusClass = '';
    
    if (validFiles > 0) {
        statusText += `${validFiles} JSON file(s) loaded successfully. `;
        statusClass = 'success';
    }
    
    if (errorFiles.length > 0) {
        statusText += `Error loading: ${errorFiles.join(', ')}`;
        statusClass = errorFiles.length === uploadedJsonFiles.length + errorFiles.length ? 'error' : 'warning';
    }
    
    jsonFileStatus.textContent = statusText;
    jsonFileStatus.className = `file-status ${statusClass}`;
}

// Function to process uploaded JSON files
document.getElementById('processJsonFiles').addEventListener('click', () => {
    if (uploadedJsonFiles.length === 0) {
        alert('No JSON files uploaded. Please select JSON files first.');
        return;
    }

    uploadedJsonFiles.forEach(fileData => {
        messages.push({
            messages: [
                { role: "user", content: fileData.fileName },
                { role: "assistant", content: fileData.content }
            ]
        });
    });

    // Save to local storage and clear uploaded files
    saveToLocalStorage();
    uploadedJsonFiles = [];
    jsonFileInput.value = '';
    jsonFileStatus.textContent = '';
    
    updatePreview();
    alert(`${uploadedJsonFiles.length} entries added from JSON files.`);
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
            jsonFileLabel: "Upload JSON Files (Optional)",
            previewTitle: "JSONL Preview",
            placeholderUser: "Enter the user's question here.",
            placeholderAssistant: "Enter the assistant's response here or upload JSON files below."
        },
        pt: {
            title: "Gerador de Arquivo JSONL para Fine-Tuning",
            userContentLabel: "Mensagem do Usuário",
            assistantContentLabel: "Resposta do Assistente",
            jsonFileLabel: "Carregar Arquivos JSON (Opcional)",
            previewTitle: "Pré-visualização do JSONL",
            placeholderUser: "Digite a pergunta do usuário.",
            placeholderAssistant: "Digite a resposta do assistente ou carregue arquivos JSON abaixo."
        },
        es: {
            title: "Generador de Archivo JSONL para Fine-Tuning",
            userContentLabel: "Mensaje del Usuario",
            assistantContentLabel: "Respuesta del Asistente",
            jsonFileLabel: "Subir Archivos JSON (Opcional)",
            previewTitle: "Vista Previa de JSONL",
            placeholderUser: "Escribe la pregunta del usuario.",
            placeholderAssistant: "Escribe la respuesta del asistente o sube archivos JSON abajo."
        },
        hi: {
            title: "फाइन-ट्यूनिंग के लिए JSONL फ़ाइल जनरेटर",
            userContentLabel: "उपयोगकर्ता संदेश",
            assistantContentLabel: "सहायक की प्रतिक्रिया",
            jsonFileLabel: "JSON फ़ाइलें अपलोड करें (वैकल्पिक)",
            previewTitle: "JSONL पूर्वावलोकन",
            placeholderUser: "उपयोगकर्ता का प्रश्न यहाँ लिखें।",
            placeholderAssistant: "सहायक की प्रतिक्रिया यहाँ लिखें या नीचे JSON फ़ाइलें अपलोड करें।"
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