const contextMenuTemplate = document.createElement("template");
contextMenuTemplate.innerHTML = `
  <link rel="stylesheet" href="./webcomponents/contextMenu/contextMenu.css">
  
    <div class="context-menu" id="contextMenu">
        <ul>
            <li id="removeBtn">Eliminar</li>
        </ul>
    </div>
`;


class ContextMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(contextMenuTemplate.content.cloneNode(true));
        this.taskCard = null;
    }
  
    connectedCallback() {
        this.shadowRoot.querySelector(".context-menu").addEventListener("mouseleave", e => {
            this.hideContextMenu();
        });


        this.shadowRoot.getElementById("removeBtn").addEventListener("click", () => {
            this.taskCard.remove();
            this.taskCard.removeFromTaskList();
            this.hideContextMenu();
        });
    }

    showContextMenu(e, taskCard){
        e.preventDefault();
        this.shadowRoot.querySelector(".context-menu").style.top = `${e.clientY}px`;
        this.shadowRoot.querySelector(".context-menu").style.left = `${e.clientX}px`;
        this.shadowRoot.querySelector(".context-menu").classList.add("active");
        this.taskCard = taskCard;
    }

    hideContextMenu(){
        this.shadowRoot.querySelector(".context-menu").classList.remove("active");
        this.taskCard = null;
    }


}

customElements.define("context-menu", ContextMenu);