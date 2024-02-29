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

When the card first appears on the screen, everything inside the containing function is called once. If you need to initalize variables, do it there.

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
fd.link("Link title", nextCardFunction, toPass)
```
Displays a link that will redirect the user to the next card in the stack. toPass should be set to anything you want to pass to the next card.

### extlink
Usage:
```
fd.extlink("Link title", "https://www.example.com")
```
Displays a link that will redirect the user to an external website

### goto
Usage:
```
fd.goto(nextCardFunction, toPass)
```
When called, redirects the user to the next card. toPass behaves the same as it does in link.

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



function main(fd) {
    // Initialize project tracker state
    if (!fd.state.projects) {
        fd.state.projects = [];
        fd.state.newProjectTitle = "";
    }

    function addProject() {
        if(fd.state.newProjectTitle) {
            fd.state.projects.push({
                title: fd.state.newProjectTitle,
                tasks: []
            });
            fd.state.newProjectTitle = ""; // clear input after add
        }
        fd.refresh();
    }

    return () => {
        fd.title("Project Tracker");
        
        // Project creation form
        fd.text("Add a new project:");
        fd.field("Project Title", "text", "newProjectTitle");
        fd.button("Add Project", addProject);

        // List existing projects
        fd.heading("Projects", 1);
        if (fd.state.projects.length === 0) {
            fd.text("No projects added yet.");
        } else {
            fd.state.projects.forEach((project, index) => {
                fd.link(project.title, projectCard, {project: project, index: index});
            });
        }
    };
}

function projectCard(fd, inp) {
	  function addTask(projectIndex) {
        return function() {
            const taskTitle = prompt("Task Title:");
            if (taskTitle) {
                fd.state.projects[projectIndex].tasks.push({
                    title: taskTitle,
                    done: false
                });
            }
            fd.refresh();
        };
    }

    function toggleTaskStatus(projectIndex, taskIndex) {
        return function() {
            let task = fd.state.projects[projectIndex].tasks[taskIndex];
            task.done = !task.done;
            fd.refresh();
        };
    }

        return () => {
            fd.heading(inp.project.title, 2);
            inp.project.tasks.forEach((task, taskIndex) => {
                fd.text(`${task.done ? "✅" : "❌"} ${task.title}`);
                fd.button("Toggle", toggleTaskStatus(inp.index, taskIndex));
            });
            fd.button("Add Task", addTask(inp.index));
        };
    }