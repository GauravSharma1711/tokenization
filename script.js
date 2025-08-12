
class SimpleTokenizer {
    constructor() {
      
        this.vocab = new Map();
       
        this.reverseVocab = new Map();
      
        this.specialTokens = ['<|endoftext|>', '<|pad|>'];
       
        this.isVocabBuilt = false;
    }

  
    build(text) {
       
        const tokens = text.match(/(\w+|[^\w\s])/g) || [];

      
        this.vocab.clear();
        this.reverseVocab.clear();

      
        this.specialTokens.forEach((token, index) => {
            this.vocab.set(token, index);
            this.reverseVocab.set(index, token);
        });

        let currentId = this.specialTokens.length;

        tokens.forEach(token => {
            if (!this.vocab.has(token)) {
                this.vocab.set(token, currentId);
                this.reverseVocab.set(currentId, token);
                currentId++;
            }
        });

        this.isVocabBuilt = true;
        return this.vocab;
    }

  
    encode(text) {
        if (!this.isVocabBuilt) {
            return [];
        }

        const tokens = text.match(/(\w+|[^\w\s])/g) || [];
        const tokenIds = tokens.map(token => {
          
            return this.vocab.has(token) ? this.vocab.get(token) : -1;
        });

        return tokenIds;
    }

 
    decode(tokenIds) {
        if (!this.isVocabBuilt) {
            return "";
        }

        const tokens = tokenIds.map(id => {
          
            return this.reverseVocab.has(parseInt(id)) ? this.reverseVocab.get(parseInt(id)) : '<|unknown|>';
        });

        return tokens.join(' ');
    }
}


const tokenizer = new SimpleTokenizer();


const trainingTextEl = document.getElementById('trainingText');
const textToTokenizeEl = document.getElementById('textToTokenize');
const tokenOutputEl = document.getElementById('tokenOutput');
const decodedOutputEl = document.getElementById('decodedOutput');
const vocabOutputEl = document.getElementById('vocabOutput');
const vocabSizeEl = document.getElementById('vocabSize');


function buildVocab() {
    const text = trainingTextEl.value.trim();
    if (text === '') {
        alert("Please enter some text to build the vocabulary.");
        return;
    }

    tokenizer.build(text);
    vocabSizeEl.textContent = tokenizer.vocab.size;

 
    let vocabStr = '';
    for (const [token, id] of tokenizer.vocab.entries()) {
        vocabStr += `${id}: '${token}'\n`;
    }
    vocabOutputEl.textContent = vocabStr;

    alert(`Vocabulary built with ${tokenizer.vocab.size} tokens!`);
}


function encodeText() {
    if (!tokenizer.isVocabBuilt) {
        alert("Please build the vocabulary first by clicking 'Build Vocabulary'.");
        return;
    }

    const text = textToTokenizeEl.value.trim();
    if (text === '') {
        alert("Please enter text to encode.");
        return;
    }

    const encoded = tokenizer.encode(text);
    tokenOutputEl.value = encoded.join(', ');
}


function decodeTokens() {
    if (!tokenizer.isVocabBuilt) {
        alert("Please build the vocabulary first by clicking 'Build Vocabulary'.");
        return;
    }

    const tokensStr = tokenOutputEl.value;
    if (tokensStr === '') {
        alert("Please enter tokens to decode.");
        return;
    }

 
    const tokens = tokensStr.split(',').map(s => s.trim());
    const decoded = tokenizer.decode(tokens);
    decodedOutputEl.textContent = decoded;
}


function alert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 ease-out transform scale-100 opacity-100';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.classList.add('scale-0', 'opacity-0');
        setTimeout(() => alertBox.remove(), 300);
    }, 3000);
}
