const button = document.getElementById("generateBtn");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");

button.addEventListener("click", () => {

    const prompt =
        document.getElementById("prompt").value;

    if(prompt.trim() === "")
    {
        alert("Enter a prompt first.");
        return;
    }

    resultCard.style.display = "none";

    let progress = 0;

    progressBar.style.width = "0%";

    const interval = setInterval(() => {

        progress += 2;

        progressBar.style.width =
            progress + "%";

        statusText.innerText =
            "Generating... " + progress + "%";

        if(progress >= 100)
        {
            clearInterval(interval);

            statusText.innerText =
                "Generation Complete";

            resultCard.style.display =
                "block";

            resultText.innerText =
                prompt;
        }

    },100);

});