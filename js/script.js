const form = document.querySelector("[dado-form]");
const containerLista = document.querySelector("[dado-container-lista]");
const tituloTarefa = document.querySelector("[dado-input]");
let tarefas = [];

document.addEventListener("DOMContentLoaded", () => {
    tarefas = Storage.obterTarefas();
    Tarefas.removerTarefa();
    Tarefas.editarTarefa();
    UI.exibirTarefas();
});

form.addEventListener("submit", (e) => { 
    e.preventDefault();
    Tarefas.adicionarTarefa();
    Storage.salvarTarefas(tarefas);
});

class Tarefa {
    constructor(id, tituloTarefa){
        this.id = id;
        this.titulo = tituloTarefa;
    };
};

class UI {

    static exibirTarefas(){
        let exibirTarefas = tarefas.map((tarefa) => {
            return `<div class='tarefa'>
                        <p class="tarefa-titulo"> ${tarefa.titulo} </p>
                        <div class="icons">
                        <span class="btn-editar" data-id = ${tarefa.id}> 🖊️ </span> 
                        <span class="btn-remover" data-id = ${tarefa.id}> 🗑️ </span>
                        </div>
            `
        });
        containerLista.innerHTML = exibirTarefas.join(" ");
    };
};


class Tarefas{

    static adicionarTarefa() {
        let id = Math.floor(Math.random() * 1000000);

        const tarefa = new Tarefa(id, tituloTarefa.value);
        
        tarefas = [... tarefas, tarefa];
        
        tituloTarefa.value = "";

        UI.exibirTarefas();
    };

    static removerTarefa(){
        containerLista.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-remover")){
                    e.target.parentElement.remove();
            };
            let id = e.target.dataset.id;

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
                    const tarefaIndex = tarefas.findIndex((tarefa) => tarefa.id === +btnId);
                    tarefas[tarefaIndex].titulo = titulo.textContent;
                    Storage.salvarTarefas(tarefas);

                };
                modoEdicao = !modoEdicao;
            };
        });
    };
};

class Storage{
    static salvarTarefas(tarefas){
        let storage = localStorage.setItem("tarefas", JSON.stringify(tarefas));
        return storage;
    };
    
    static obterTarefas(){
        let storage = localStorage.getItem("tarefas") === null ? 
        [] : JSON.parse(localStorage.getItem("tarefas"));
        return storage;
    };

};



