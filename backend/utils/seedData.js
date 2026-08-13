/**
 * Seed questions for Round 1: AI tools & trending technology.
 * Each question has exactly one correct answer (correctAnswer = option key).
 * Verified factual questions as of 2024-2025.
 */
const round1Questions = [
  {
    round: 1, type: 'mcq', order: 1,
    questionText: 'What does "LLM" stand for in the context of artificial intelligence?',
    options: [
      { key: 'A', text: 'Large Language Model' },
      { key: 'B', text: 'Long Logic Machine' },
      { key: 'C', text: 'Learning Language Matrix' },
      { key: 'D', text: 'Local Language Module' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 2,
    questionText: 'Which company developed ChatGPT?',
    options: [
      { key: 'A', text: 'Google' },
      { key: 'B', text: 'Microsoft' },
      { key: 'C', text: 'OpenAI' },
      { key: 'D', text: 'Anthropic' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 3,
    questionText: 'Which company developed the Gemini family of AI models?',
    options: [
      { key: 'A', text: 'Google' },
      { key: 'B', text: 'OpenAI' },
      { key: 'C', text: 'Meta' },
      { key: 'D', text: 'IBM' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 4,
    questionText: 'GitHub Copilot is primarily powered by which AI technology?',
    options: [
      { key: 'A', text: 'IBM Watson' },
      { key: 'B', text: 'OpenAI models' },
      { key: 'C', text: 'Amazon Lex' },
      { key: 'D', text: 'Apple Siri' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 5,
    questionText: 'What does "GPT" stand for in GPT-4?',
    options: [
      { key: 'A', text: 'General Purpose Translator' },
      { key: 'B', text: 'Generative Pre-trained Transformer' },
      { key: 'C', text: 'Global Processing Terminal' },
      { key: 'D', text: 'Graph Processing Tool' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 6,
    questionText: 'Which of the following is an AI image-generation model developed by OpenAI?',
    options: [
      { key: 'A', text: 'Midjourney' },
      { key: 'B', text: 'Stable Diffusion' },
      { key: 'C', text: 'DALL·E' },
      { key: 'D', text: 'Imagen' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 7,
    questionText: 'Which company developed the Claude AI assistant?',
    options: [
      { key: 'A', text: 'Anthropic' },
      { key: 'B', text: 'OpenAI' },
      { key: 'C', text: 'Google' },
      { key: 'D', text: 'Microsoft' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 8,
    questionText: 'Stable Diffusion is primarily used to generate what?',
    options: [
      { key: 'A', text: 'Music' },
      { key: 'B', text: 'Source code' },
      { key: 'C', text: 'Images' },
      { key: 'D', text: 'Spreadsheets' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 9,
    questionText: 'What does "RAG" stand for in the context of LLMs?',
    options: [
      { key: 'A', text: 'Random Access Generation' },
      { key: 'B', text: 'Retrieval-Augmented Generation' },
      { key: 'C', text: 'Rapid Algorithm Generation' },
      { key: 'D', text: 'Rule-Aware Generation' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 10,
    questionText: 'Which programming language is most commonly used for machine learning and AI?',
    options: [
      { key: 'A', text: 'Java' },
      { key: 'B', text: 'Python' },
      { key: 'C', text: 'C++' },
      { key: 'D', text: 'Ruby' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 11,
    questionText: 'Which company created and maintains TensorFlow?',
    options: [
      { key: 'A', text: 'Meta' },
      { key: 'B', text: 'Google' },
      { key: 'C', text: 'Microsoft' },
      { key: 'D', text: 'Amazon' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 12,
    questionText: 'PyTorch is primarily developed by which company\u2019s AI research lab?',
    options: [
      { key: 'A', text: 'Google' },
      { key: 'B', text: 'Microsoft' },
      { key: 'C', text: 'Meta' },
      { key: 'D', text: 'Apple' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 13,
    questionText: 'What does "NLP" stand for in AI?',
    options: [
      { key: 'A', text: 'Neural Logic Processing' },
      { key: 'B', text: 'Natural Language Processing' },
      { key: 'C', text: 'Network Layer Protocol' },
      { key: 'D', text: 'Non-Linear Programming' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 14,
    questionText: 'Which of the following is Amazon\u2019s cloud computing platform?',
    options: [
      { key: 'A', text: 'Azure' },
      { key: 'B', text: 'Google Cloud' },
      { key: 'C', text: 'AWS' },
      { key: 'D', text: 'Oracle Cloud' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 15,
    questionText: 'What does "AWS" stand for?',
    options: [
      { key: 'A', text: 'Advanced Web Service' },
      { key: 'B', text: 'Amazon Web Services' },
      { key: 'C', text: 'Automated Web System' },
      { key: 'D', text: 'Application Web Server' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 16,
    questionText: 'Microsoft\u2019s cloud computing platform is called?',
    options: [
      { key: 'A', text: 'Microsoft Cloud' },
      { key: 'B', text: 'Microsoft Azure' },
      { key: 'C', text: 'Windows Cloud' },
      { key: 'D', text: 'Office Cloud' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 17,
    questionText: 'Google\u2019s cloud computing platform is called?',
    options: [
      { key: 'A', text: 'Google Cloud' },
      { key: 'B', text: 'Google Sky' },
      { key: 'C', text: 'G-Cloud Drive' },
      { key: 'D', text: 'Google Net' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 18,
    questionText: 'What does "API" stand for?',
    options: [
      { key: 'A', text: 'Application Programming Interface' },
      { key: 'B', text: 'Application Process Integration' },
      { key: 'C', text: 'Automated Programming Instruction' },
      { key: 'D', text: 'Advanced Protocol Internet' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 19,
    questionText: 'Which HTTP method is typically used to request data from a server without modifying it?',
    options: [
      { key: 'A', text: 'POST' },
      { key: 'B', text: 'GET' },
      { key: 'C', text: 'DELETE' },
      { key: 'D', text: 'PUT' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 20,
    questionText: 'Which is a popular JavaScript runtime built on Chrome\u2019s V8 engine?',
    options: [
      { key: 'A', text: 'Deno' },
      { key: 'B', text: 'Bun' },
      { key: 'C', text: 'Node.js' },
      { key: 'D', text: 'Nashorn' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 21,
    questionText: 'What does the "S" in "HTTPS" stand for?',
    options: [
      { key: 'A', text: 'System' },
      { key: 'B', text: 'Secure' },
      { key: 'C', text: 'Server' },
      { key: 'D', text: 'Standard' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 22,
    questionText: 'Which technology is used to secure web traffic through encryption?',
    options: [
      { key: 'A', text: 'FTP' },
      { key: 'B', text: 'HTTP' },
      { key: 'C', text: 'TLS / SSL' },
      { key: 'D', text: 'DNS' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 23,
    questionText: 'What is "phishing" in cybersecurity?',
    options: [
      { key: 'A', text: 'A type of firewall' },
      { key: 'B', text: 'An antivirus program' },
      { key: 'C', text: 'A social-engineering attack to steal sensitive information' },
      { key: 'D', text: 'A network routing protocol' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 24,
    questionText: 'What does "VPN" stand for?',
    options: [
      { key: 'A', text: 'Virtual Private Network' },
      { key: 'B', text: 'Verified Public Node' },
      { key: 'C', text: 'Visual Processing Network' },
      { key: 'D', text: 'Variable Packet Node' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 25,
    questionText: 'What is the main purpose of Two-Factor Authentication (2FA)?',
    options: [
      { key: 'A', text: 'Speed up the login process' },
      { key: 'B', text: 'Add an extra layer of security' },
      { key: 'C', text: 'Store user passwords' },
      { key: 'D', text: 'Compress network data' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 26,
    questionText: 'What does "IoT" stand for?',
    options: [
      { key: 'A', text: 'Internet of Things' },
      { key: 'B', text: 'Internal Object Tool' },
      { key: 'C', text: 'Input Output Terminal' },
      { key: 'D', text: 'Integrated Online Technology' },
    ],
    correctAnswer: 'A', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 27,
    questionText: 'Which technology forms the foundation of cryptocurrencies like Bitcoin?',
    options: [
      { key: 'A', text: 'Cloud computing' },
      { key: 'B', text: 'Blockchain' },
      { key: 'C', text: 'Machine learning' },
      { key: 'D', text: 'Virtual reality' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 28,
    questionText: 'What does "CSS" stand for in web development?',
    options: [
      { key: 'A', text: 'Computer Style Sheet' },
      { key: 'B', text: 'Cascading Style Sheets' },
      { key: 'C', text: 'Creative Style System' },
      { key: 'D', text: 'Client Side Script' },
    ],
    correctAnswer: 'B', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 29,
    questionText: 'Which company originally developed the React JavaScript library?',
    options: [
      { key: 'A', text: 'Google' },
      { key: 'B', text: 'Twitter' },
      { key: 'C', text: 'Meta (Facebook)' },
      { key: 'D', text: 'Microsoft' },
    ],
    correctAnswer: 'C', marks: 1,
  },
  {
    round: 1, type: 'mcq', order: 30,
    questionText: 'What does "prompt engineering" refer to?',
    options: [
      { key: 'A', text: 'Building hardware prompts' },
      { key: 'B', text: 'Designing inputs to effectively guide AI model outputs' },
      { key: 'C', text: 'Engineering network prompts' },
      { key: 'D', text: 'Writing firmware code' },
    ],
    correctAnswer: 'B', marks: 1,
  },
];

module.exports = { round1Questions };
