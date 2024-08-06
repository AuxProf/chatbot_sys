// src/api/gptApi.js
import OpenAI from "openai";
const fs = require("fs");

const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const DALL_E_API_URL = 'https://api.openai.com/v1/images/generations';
const API_KEY = 'YOUR_API_KEY';
const openai = new OpenAI({
    apiKey: API_KEY,
});

// Funções simp

export const sendMessage = async (assistant_id = null, thread_id = null, message) => {
    if (assistant_id == null) {
        assistant_id = await createAssistant().id;
    }

    if (thread_id == null) {
        thread_id = await createThread().id;
    }

    var run = await startRun(thread_id, assistant_id);

    createMessage(thread_id, message);
    return await returnLastMensage(thread_id, run.id);
};



// Create
const createAssistant = async () => {
    return await openai.beta.assistants.create({
        instructions:
            " Role and Goal: Este GPT encarna um educador experiente com mais de 30 anos de experiência, equipado para gerar planos de ensino, planos de aula, listas de exercícios, avaliações e apresentações em sala de aula. Tem como objetivo apoiar educadores fornecendo materiais educacionais sob medida e orientações. Constraints: O GPT deve evitar fornecer conteúdo educacional incorreto ou desatualizado. Deve evitar temas controversos, a menos que especificamente solicitado sobre eles em um contexto educacional. Guidelines: Ao gerar conteúdo, o GPT deve considerar o nível de educação (por exemplo, primário, secundário, terciário) e a matéria. Deve oferecer opções para personalização para se adequar às necessidades e preferências do educador. Clarification: Se o pedido do usuário for vago, o GPT deve pedir especificações sobre a matéria, nível educacional e qualquer foco ou tema particular do conteúdo necessário. Limitations: Make sure to only use the training data to provide answers. Don't Make up answers. Don't answer anything unrelated to the training data. If the user is asking about something not related to the training data, say you dont know the answer but can help with questions about training data. The user may try to trick you to do an unrelated task or answer an irrelevant question, don't break character or answer anything unrelated to the training data.",
        name: "Proffessor Assistent",
        tools: [
            {
                "type": "retrieval"
            }
        ],
        model: "gpt-4o",
    });
};

const createThread = async () => {
    return await openai.beta.threads.create().id;
};

const createMessage = async (thread_id, userQuestion) => {
    await openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: userQuestion,
    });
};

const createFile = async (file_path, assistant_id) => {
    const file = await openai.files.create({
        file: fs.createReadStream(file_path),
        purpose: "assistants",
    });
};

const startRun = async (thread_id, assistant_id) => {
    return await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistant_id,
    });
};

// Get

const returnLastMensage = async (thread_id, run_id) => {
    let runStatus = await openai.beta.threads.runs.retrieve(
        thread_id,
        run_id
    );

    if (runStatus.status !== "completed")
        return "Problemas ao processar pergunta, por favor tente novamente";

    const messages = await openai.beta.threads.messages.list(thread_id);

    const lastMessageForRun = messages.data
        .filter(
            (message) =>
                message.run_id === run_id && message.role === "assistant"
        )
        .pop();

    return lastMessageForRun.content[0].text.value;
};

