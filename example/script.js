function forms(fd){
	function action(){
		alert(JSON.stringify(fd.state))
	}

	function checkSum(value){
		if(value == 4){
			return [true, ""]
		}

		return [false, "Try again bozo"]
	}

	function resetAll(){
		fd.state.name = ""
		fd.state.sum = ""
	}

	return () => {
		fd.title("forms")

		fd.field("What's your name?", "text", "name")
		fd.field("What's 2+2", "number", "sum", checkSum)
	
		fd.button("Action", action)
		fd.button("Reset hard", fd.refresh)
		fd.button("Reset form values", resetAll)
		fd.button("home", () => fd.goto(main))
	}
}

function next(fd){
	return () => {
		fd.title("Page title")
		fd.heading("Heading level 2", 2)
		fd.heading("Heading level 3", 3)
		fd.text("Plain text")
	}
}

function main(fd){
	return () => {
		fd.title("home")
		fd.text("Flashdrive examples")
		fd.link("Titles", next)
		fd.link("Form playground", forms)
		fd.link("Temperature converter", tempconvert)
		fd.link("Counter", counters)
		fd.link("To do list", editableList)
		fd.link("Passing data", passing)

		fd.extLink("Github page", "https://github.com/quin2/flashdrive")
	}
}

function passing(fd){
	fd.state._pass = ""
	
	return () => {
		fd.title("Passing data")
		fd.field("Example text", "text", "_pass")
		fd.link("Go to next", passing2)
	}
}

function passing2(fd){
	return () => {
		console.log(fd.state)
		fd.title("Result")
		fd.text(fd.state._pass)
	}
}

function editableList(fd){
	function addff(){
		fd.state[Object.keys(fd.state).length] = ""
		console.log(fd.state)
		fd.state = fd.state
	}

	function empty(val, i){
		if(val == ""){
			fd.state[i] = ""
			fd.state = fd.state
		}

		return [false, ""]
	}

	return () => {
		fd.title("List")

		for(let i = 0; i < Object.keys(fd.state).length; i++){
			fd.field("", "text", `${i}`, (val) => empty(val, i))
		}

		fd.button("+", addff)
	}
}

function counters(fd){
	function increase(){
		fd.state.sum++;
		console.log(fd.state)
	}

	fd.state.sum = 0

	return () => {
		fd.title("counters")
		fd.text(`Sum is ${fd.state.sum}`)
		fd.button("add 1", increase)
	};
	
}

function tempconvert(fd){
	function convc(){
		const F = fd.state.f
		const C = (F - 32) * (5/9)
		//how to set value of another field?
		fd.state.c = C

		return [true, ""]
	}

	function convf(){
		const C = fd.state.c
		const F = C * (9/5) + 32
		//how to set value of another field?
		fd.state.f = F

		return [true, ""]
	}

	return () => {
		fd.title("temp conversion")
		fd.field("Celsius", "number", "c", convf)
		fd.field("Farenheit", "number", "f", convc)
	}
}