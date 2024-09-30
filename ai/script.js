const chatContainer = document.getElementById('chatContainer');
        const promptInput = document.getElementById('promptInput');
        const sendButton = document.getElementById('sendButton');
        const darkModeToggle = document.getElementById('darkModeToggle');
        let chatId = Date.now().toString();

        function toggleDarkMode() {
            document.body.classList.toggle('dark');
        }

        darkModeToggle.addEventListener('click', toggleDarkMode);

        async function sendMessage() {
            const prompt = promptInput.value.trim();
            if (!prompt) return;
        
            appendMessage('user', prompt);
            promptInput.value = '';
            
            const apiUrl = `https://api.itzpire.com/ai/gemini-ai?q=${encodeURIComponent(prompt)}&chat_id=${chatId}`;
            console.log('Requesting API:', apiUrl);  // Log API URL
        
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                appendMessage('ai', data.answer);
            } catch (error) {
                console.error('Error:', error);
                appendMessage('ai', 'Maaf, terjadi kesalahan saat memproses pesan Anda.');
            }
        }
        

        function appendMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('mb-4', 'p-2', 'rounded-lg', sender === 'user' ? 'bg-blue-100' : 'bg-gray-100', 'dark:text-gray-800');
            
            const iconElement = document.createElement('i');
            iconElement.classList.add('fas', sender === 'user' ? 'fa-user' : 'fa-robot', 'mr-2');
            
            const textElement = document.createElement('span');
            textElement.textContent = message;
            
            messageElement.appendChild(iconElement);
            messageElement.appendChild(textElement);
            
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        sendButton.addEventListener('click', sendMessage);
        promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
