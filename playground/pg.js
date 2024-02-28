document.addEventListener('DOMContentLoaded', pginit);

function pginit(){
    document.getElementById("run").addEventListener("click", loadCode);
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