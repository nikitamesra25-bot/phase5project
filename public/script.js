const form = document.getElementById("askForm");
const questionInput = document.getElementById("question");
const answer = document.getElementById("answer");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const question = questionInput.value;

    if (!question) {
        answer.innerHTML = "<p>Please enter a question.</p>";
        return;
    }

    try {
        const response = await fetch("/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        console.log(data);

        if (data.error) {
            answer.innerHTML = `<p>${data.error}</p>`;
            return;
        }

        answer.innerHTML = `<p>${data.answer}</p>`;

    } catch (error) {
        console.log(error);

        answer.innerHTML = "<p>Something went wrong.</p>";
    }
});