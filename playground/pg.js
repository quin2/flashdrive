document.addEventListener('DOMContentLoaded', pginit);

function pginit(){
    document.getElementById("run").addEventListener("click", loadCode);
    document.getElementById("gen").addEventListener("click", runPrompt);
}

function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function() { return eval(js); }.call(context);
}

function loadCode(){
    document.getElementById("console").innerHTML = ""
    let code = document.getElementById("editor").value

    eval(code)

    try {
        new FDMaker(main);
    }
    catch(e){
        let err = document.createElement("div")
        err.innerHTML = e
        document.getElementById("console").appendChild(err)
    }
}

async function runPrompt(){
    let codeArea = document.getElementById("editor");
    codeArea.value = ""

    let key = document.getElementById("key").value;
    let prompt = document.getElementById("prompt").value;

    let btn = document.getElementById("gen")
    btn.innerHTML = "Loading..."

    //get docs
    //https://raw.githubusercontent.com/quin2/flashdrive/main/readme.md
    let docs = await fetch("https://raw.githubusercontent.com/quin2/flashdrive/main/readme.md")
    docs = await docs.text()

    const finalPrompt = `Write the JavaScript for ${prompt} using the framework below. Only return JavaScript without formatting. You may create multiple cards. 
    THe framework will handle creating a back button:
        ${docs}`

    const req = {
        "model": "gpt-4-turbo-preview",
        "messages": [
            {
                "role": "user",
                "content": finalPrompt
            }
        ]
    }

    let result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify(req)
    })

    result = await result.json()

    btn.innerHTML = "Generate"

    codeArea.value = extractContents(result.choices[0].message.content)
    loadCode()
}

function extractContents(input){
    const regex = /```(?:js|javascript)\n([\s\S]*?)```/g;

    // Extract matches
    const matches = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        matches.push(match[1].trim());
    }

    if(matches.length == 0){
        return input
    }
    return matches[0];
}

/*
function main(fd){
	return () => {
		fd.title("home")
		fd.text("Flashdrive examples")
		fd.link("Titles", next)
		fd.link("Form playground", forms)
		fd.link("Temperature converter", tempconvert)
		fd.link("Counter", counters)
		fd.link("To do list", editableList)

		fd.extLink("Github page", "https://www.google.com")
	}
}
*/