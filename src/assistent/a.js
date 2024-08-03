// import the required dependencies
require("dotenv").config();
const OpenAI = require("openai");
const fsPromises = require("fs").promises;
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {

    // Create a thread using the assistantId
    const thread = await openai.beta.threads.create();
    // Use keepAsking as state for keep asking questions
    let keepAsking = true;
    while (keepAsking) {

      if (action === "2") {
        const fileName = await askQuestion("Enter the filename to upload: ");

        // Upload the file
        const file = await openai.files.create({
          file: fs.createReadStream(fileName),
          purpose: "assistants",
        });

        // Retrieve existing file IDs from assistant.json to not overwrite
        let existingFileIds = assistantDetails.file_ids || [];

        // Update the assistant with the new file ID
        await openai.beta.assistants.update(assistantId, {
          file_ids: [...existingFileIds, file.id],
        });

        // Update local assistantDetails and save to assistant.json
        assistantDetails.file_ids = [...existingFileIds, file.id];
        await fsPromises.writeFile(
          assistantFilePath,
          JSON.stringify(assistantDetails, null, 2)
        );

        console.log("File uploaded and successfully added to assistant\n");
      }

      if (action === "1") {
        let continueAskingQuestion = true;

        while (continueAskingQuestion) {
          const userQuestion = await askQuestion("\nWhat is your question? ");

          // Pass in the user question into the existing thread
          await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userQuestion,
          });

          // Create a run
          const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
          });

          // Imediately fetch run-status, which will be "in_progress"
          let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );

          // Polling mechanism to see if runStatus is completed
          while (runStatus.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(
              thread.id,
              run.id
            );

            // Check for failed, cancelled, or expired status
            if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
              console.log(
                `Run status is '${runStatus.status}'. Unable to complete the request.`
              );
              break; // Exit the loop if the status indicates a failure or cancellation
            }
          }

          // Get the last assistant message from the messages array
          const messages = await openai.beta.threads.messages.list(thread.id);

          // Find the last message for the current run
          const lastMessageForRun = messages.data
            .filter(
              (message) =>
                message.run_id === run.id && message.role === "assistant"
            )
            .pop();

          // If an assistant message is found, console.log() it
          if (lastMessageForRun) {
            console.log(`${lastMessageForRun.content[0].text.value} \n`);
          } else if (
            !["failed", "cancelled", "expired"].includes(runStatus.status)
          ) {
            console.log("No response received from the assistant.");
          }

          // Ask if the user wants to ask another question
          const continueAsking = await askQuestion(
            "Do you want to ask another question? (yes/no) "
          );
          continueAskingQuestion =
            continueAsking.toLowerCase() === "yes" ||
            continueAsking.toLowerCase() === "y";
        }
      }

    }
    // close the readline
    readline.close();
}

// Call the main function
main();