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
        })

        const fd = {
            text: this.text.bind(this),
            extLink: this.extLink.bind(this),
            link: this.link.bind(this),
            title: this.title.bind(this),
            refresh: this.refresh.bind(this),
            heading: this.heading.bind(this),
            field: this.field.bind(this),
            button: this.button.bind(this),
            goto: this.navHandler.bind(this),
            state: this.state
        };

        this.corefunc = () => corefunc(fd);
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

    link(name, dest){
        let link = this.addTextElem("a", name);
        link.setAttribute("href", "#");
        link.addEventListener("click", () => this.navHandler(dest));
    }

    title(content){
        this.heading(content, 1);
        document.title = content;
    }

    refresh(){
        this.root.innerHTML = "";
        this.res();
    }

    addTextElem(tag, text){
        let elem = document.createElement(tag);
        elem.innerHTML = text;
        this.root.appendChild(elem);
        return elem;
    }

    navHandler(dest){
        new FDMaker(dest);
    }

    heading(content, level){
        this.addTextElem("h"+level, content);
    }

    field(title, type, tag, validation){
        let ff = document.createElement("input");
        ff.setAttribute("name", tag);
        ff.setAttribute("type", type);
        if(tag !== undefined){
            ff.setAttribute("value", this.state[tag]);
        }

        ff.addEventListener("input", (e) => this.stateHandler(e, tag));

        let fft = document.createElement("label");
        fft.setAttribute("for", tag);
        fft.innerHTML = title;

        this.root.appendChild(fft);
        this.root.appendChild(ff);
        
        if(validation){
            ff.addEventListener("blur", () => this.valHandler(ff, validation, lb));
            let lb = document.createElement("label");
            lb.setAttribute("for", tag);
            lb.classList.add("msg");
            this.root.appendChild(lb);
        }
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
}

function init(){
    new FDMaker(main);
}