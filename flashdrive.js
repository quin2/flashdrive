document.addEventListener('DOMContentLoaded', init);

class FDMaker {
    constructor(corefunc){
        this.root = document.getElementById('root');

        this.state = new Proxy({}, {
            get: (target, name, reciever) => {
                return Reflect.get(target, name, reciever);
            },
            set: (target, name, value, reciever) => {
                Reflect.set(target, name, value, reciever);
                if(this.ready){
                    this.refresh()
                }
                return Reflect.set(target, name, value, reciever);
            }
        });

        this.history = [];

        this.fd = {
            text: this.text.bind(this),
            extLink: this.extLink.bind(this),
            link: this.link.bind(this),
            title: this.title.bind(this),
            refresh: this.refresh.bind(this),
            heading: this.heading.bind(this),
            field: this.field.bind(this),
            button: this.button.bind(this),
            pick: this.pick.bind(this),
            goto: this.goto.bind(this),
            state: this.state
        };

        this.initCore(corefunc, null);
    }

    goto(infunc, pass){
        if(this.corefunc !== undefined){
            this.history.push(this.corefunc);
        }
        this.initCore(infunc, pass);
    }

    initCore(infunc, pass){
        this.ready = false;
        this.corefunc = () => infunc(this.fd, pass);
        this.res = this.corefunc();
        this.refresh();
        this.ready = true;
    }

    text(content){
        this.addTextElem("div", content);
    }

    extLink(name, location){
        let link = this.addTextElem("a", name);
        link.setAttribute("href", location);
    }w

    link(name, dest, pass){
        this.intLink(name, () => this.goto(dest, pass));
    }

    intLink(name, el){
        let link = this.addTextElem("a", name);
        link.setAttribute("href", "#");
        link.addEventListener("click", el);
    }

    title(content){
        this.heading(content, 1);
        document.title = content;
    }

    refresh(){
        this.root.innerHTML = "";
     
        if(this.history.length > 0){
            this.intLink("Back", () => this.goBack());
        }
        this.res();
    }

    goBack(){
        let last = this.history.pop()
        this.initCore(last)
    }

    addTextElem(tag, text){
        let elem = document.createElement(tag);
        elem.innerHTML = text;
        this.root.appendChild(elem);
        return elem;
    }

    heading(content, level){
        this.addTextElem("h"+level, content);
    }

    field(title, type, tag, validation){
        let ff = document.createElement("input");
        ff.setAttribute("name", tag);
        ff.setAttribute("type", type);
        if(this.state[tag] !== undefined){
            ff.setAttribute("value", this.state[tag]);
        }

        ff.addEventListener("input", (e) => this.stateHandler(e, tag));

        this.label(title, tag);
        this.root.appendChild(ff);
        
        if(validation){
            ff.addEventListener("blur", () => this.valHandler(ff, validation, lb));
            let lb = document.createElement("label");
            lb.setAttribute("for", tag);
            lb.classList.add("msg");
            this.root.appendChild(lb);
        }
    }

    label(text, linked){
        let fft = document.createElement("label");
        fft.setAttribute("for", linked);
        fft.innerHTML = text;
        this.root.appendChild(fft);
    }

    stateHandler(e, tag){
        this.ready = false;
        this.state[tag] = e.target.value;
        this.ready = true;
    }

    valHandler(fieldRef, valFunction, msgRef){
        let value = fieldRef.value;
        let result = valFunction(value);
        if(!result[0]){
            msgRef.classList.remove("ok");
            msgRef.classList.add("err");
        }
        else{
            msgRef.classList.add("ok");
            msgRef.classList.remove("err");
        }
        msgRef.innerHTML = result[1];
    }

    button(text, callback){
        let button = this.addTextElem("button", text);
        button.addEventListener("click", callback);
    }

    pick(title, options, tag){
       const sel = document.createElement("select");
       sel.setAttribute("name", tag);

        if(this.state[tag] === undefined && options.length > 0){
            console.log("yuh")
            this.state[tag] = options[0]
        }

       for(let i = 0; i < options.length; i++){
            const selItem = document.createElement("option");
            selItem.setAttribute("value", options[i]);
            selItem.innerHTML = options[i];
            if(this.state[tag] === options[i]){
                selItem.setAttribute("selected", "selected");
            }
            sel.appendChild(selItem);
       }

       sel.addEventListener("input", (e) => {this.state[tag] = e.target.value;});

       this.label(title, tag);
       this.root.appendChild(sel);
    }
}

function init(){
    new FDMaker(main);
}