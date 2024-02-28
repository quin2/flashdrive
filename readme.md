# Flashdrive
A lazy web framework

## Use

* Import flashdrive.min.js
```
<script src="flashdrive.min.js"></script>
```

* Add a root anchor to the page
```
<div id="root"></div>
```

* Set up main() in another JS file as the entry point
```
function main(fd){
    ...
}
```

* Optionally, import the stylesheet
```
<style src="style.css"></style>
```

## Reference
flash is all about creating small "cards" that the user navigates between. There isn't any layout, each card is rendered top to bottom
and can be styled by css

All rendering hapens inside of JavaScript functions. Each function is structured like this:
```
function card(fd){
    return () => {
        
    }
}
```
Where the function returned is called every time the component renders, from the wrapper function context.

The entire state of each card is held in ```fd.state```. All form inputs are bound to this variable, and you can also store any additional application state as well. If any state variable that you stored changes, the function returned from the card function is called, and the entire card rerenders. Unless you clear it out manually, state will also persist between all cards. 

If you need to, you can also trigger a rerender with ```fd.refresh()```


### title
Usage:
```
fd.title("My awesome title")
```
Sets the title of the current card

### heading
Usage:
```
fd.heading("Heading",headingLevel)
```
Displays a heading on the card at the given headingLevel

### text
Usage:
```
fd.text("Goodbye, moon!")
```
Displays a line of text in the card

### link
Usage:
```
fd.link("Link title", nextCardFunction)
```
Displays a link that will redirect the user to the next card in the stack

### extlink
Usage:
```
fd.extlink("Link title", "https://www.example.com")
```
Displays a link that will redirect the user to an external website

### goto
Usage:
```
fd.goto(nextCardFunction)
```
When called, redirects the user to the next card

### field
Usage:
```
fd.field("title", "type", "stateKey", validationFunc)
```
Displays an HTML input field with a title. The type directly maps to all HTML input field types. When the field value changes, the key in the state represented by stateKey will also change.

To handle validation, you can pass a function into validationFunc that will be called when the user exits the field. It should be structured like this:
```
let validationFunc = (newValue) => {
    let isValid = false;
    return [isValid, "message"];
}
```
If isValid is false, the validation message is shown. Otherwise, we don't show any validation message. 

### button
```
fd.button("Label", functionToCall)
```
Displays a button that will call a function

## Examples

### A counter
```
function main(fd){
	function increase(){
		fd.state.sum++;
	}

    function decrease(){
		fd.state.sum--;
	}

	fd.state.sum = 0

	return () => {
		fd.title("counters");
		fd.text(`Sum is ${fd.state.sum}`);
		fd.button("add 1", increase);
        fd.button("subtract 1", decrease)
	};
}
```