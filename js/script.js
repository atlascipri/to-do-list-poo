const form = document.querySelector("[dado-form]");
const containerLista = document.querySelector("[dado-container-lista]");
const tituloTarefa = document.querySelector("[dado-input]");
const btnRemoverTodasTarefas = document.getElementById("btn-remover-tudo");  


document.addEventListener("DOMContentLoaded", () => {
    Tarefas.tarefas = Storage.obterTarefas();
    UI.atualizarInterface();
    Tarefas.removerTarefa();
    Tarefas.editarTarefa();
    Tarefas.concluirTarefa();
});

form.addEventListener("submit", (e) => { 
    e.preventDefault();
    Tarefas.adicionarTarefa();
    Storage.salvarTarefas(Tarefas.tarefas);
    UI.atualizarInterface();
});

btnRemoverTodasTarefas.addEventListener("click", () => {
    Tarefas.removerTodasTarefas();
});

class Tarefa {
    constructor(id, tituloTarefa){
        this.id = id;
        this.titulo = tituloTarefa;
        this.concluida = false;
    };
};

class UI {

    static exibirTarefas(){
        let exibirTarefas = Tarefas.tarefas.map((tarefa) => {
            return `<div class='tarefa ${tarefa.concluida ? "concluida" : ""}' >
                        <p class="tarefa-titulo"> ${tarefa.titulo} </p>
                        <div class="icons">
                        <span class="btn-concluir" data-id=${tarefa.id}> ✔️ </span>
                        <span class="btn-editar" data-id = ${tarefa.id}> 🖊️ </span> 
                        <span class="btn-remover" data-id = ${tarefa.id}> 🗑️ </span>
                        </div>
                    </div> `
        });
        containerLista.innerHTML = exibirTarefas.join(" ");
    };

    static exibirOcultarbtnRemoverTodasTarefas(){    
        btnRemoverTodasTarefas.style.display = Tarefas.tarefas.length > 0 ? "flex" : "none";
    };

    static atualizarInterface(){
        this.exibirTarefas();
        this.exibirOcultarbtnRemoverTodasTarefas();
    }
};


class Tarefas{
    static tarefas = [];

    static adicionarTarefa() {
        let id = Math.floor(Math.random() * 1000000);

        const tarefa = new Tarefa(id, tituloTarefa.value);
        
        this.tarefas = [... this.tarefas, tarefa];
        
        tituloTarefa.value = "";

        tituloTarefa.focus();

        UI.atualizarInterface();
    };

    static removerTarefa(){
        containerLista.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-remover")){
                    e.target.parentElement.parentElement.remove();  

                    let btnId = e.target.dataset.id;

                    this.tarefas = this.tarefas.filter((tarefa) => tarefa.id !== +btnId);
            
                    Storage.salvarTarefas(this.tarefas); 
                    UI.atualizarInterface();
            };
        });
    };
    
    static concluirTarefa() {
        containerLista.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-concluir")) {
                let btnId = e.target.dataset.id;
                const tarefaIndex = this.tarefas.findIndex((tarefa) => tarefa.id === +btnId);
                this.tarefas[tarefaIndex].concluida = !this.tarefas[tarefaIndex].concluida; 
                console.log(this.tarefas[tarefaIndex].concluida);
                Storage.salvarTarefas(this.tarefas);
                UI.atualizarInterface();
            }
        });
    }

    static editarTarefa(){
        let modoEdicao = true;
        containerLista.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-editar")){
                let titulo = e.target.parentElement.parentElement.firstElementChild;
                const btnId = e.target.dataset.id;
                if (modoEdicao) {
                    titulo.setAttribute("contenteditable", "true");
                    titulo.focus();
                    titulo.style.outline = "none";
                    e.target.textContent = "Salvar";
                    titulo.style.color = "darkblue";
                } else {
                    e.target.textContent = "🖊️";
                    titulo.style.color = "black";
                    titulo.removeAttribute("contenteditable");

                    const tarefas = Storage.obterTarefas();
                    const tarefaIndex = this.tarefas.findIndex((tarefa) => tarefa.id === +btnId);
                    this.tarefas[tarefaIndex].titulo = titulo.textContent;
                    Storage.salvarTarefas(this.tarefas);

                };
                modoEdicao = !modoEdicao;
            };
        });
    };

    static removerTodasTarefas(){
            this.tarefas = [];
            Storage.salvarTarefas(this.tarefas);
            UI.atualizarInterface();
        
    };
};

class Storage{
    static salvarTarefas(tarefas) {
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
    };
    
    static obterTarefas(){
        return localStorage.getItem("tarefas") ? JSON.parse(localStorage.getItem("tarefas")) : [];
    };

};



