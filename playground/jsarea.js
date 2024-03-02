document.addEventListener('DOMContentLoaded', initarea);

function initarea(){
    let te = document.getElementById("editor")
    te.addEventListener('keydown', handleKeyDown)
}

function handleKeyDown(event){
    if(event.key === 'Tab'){
        event.preventDefault();

        const start = this.selectionStart;
        const end = this.selectionEnd;

        this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }

    /*
    let code = document.getElementById("editor").innerText
    var keywords = [ "public", "class", "private", "static", "return", "void" ];
    for (var i = 0; i < keywords.length; i++)
    {
            var regex = new RegExp(keywords[i], "g");
            //var regex = new RegExp("([^A-z0-9])(" + keywords[i] + ")([^A-z0-9])(?![^<]*>|[^<>]*</)", "g");
            code = code.replace(regex, "<span class='rm-code-keyword'>$2</span>");
            console.log(code)
    }
    */
}
