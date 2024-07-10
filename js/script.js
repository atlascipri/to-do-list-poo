const form = document.querySelector("[dado-form]");
const containerLista = document.querySelector("[dado-container-lista]");
const tituloTarefa = document.querySelector("[dado-input]");
const btnRemoverTodasTarefas = document.getElementById("btn-remover-tudo");  
let tarefas = [];

document.addEventListener("DOMContentLoaded", () => {
    tarefas = Storage.obterTarefas();
    UI.exibirTarefas();
    UI.exibirOcultarbtnRemoverTodasTarefas();
    Tarefas.removerTarefa();
    Tarefas.editarTarefa();
    UI.exibirTarefas();
});

form.addEventListener("submit", (e) => { 
    e.preventDefault();
    Tarefas.adicionarTarefa();
    Storage.salvarTarefas(tarefas);
    UI.exibirOcultarbtnRemoverTodasTarefas();
});

btnRemoverTodasTarefas.addEventListener("click", () => {
    Tarefas.removerTodasTarefas();
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
                    </div> `
        });
        containerLista.innerHTML = exibirTarefas.join(" ");
    };

    static exibirOcultarbtnRemoverTodasTarefas(){    
        btnRemoverTodasTarefas.style.display = tarefas.length > 0 ? "flex" : "none";
    };
};


class Tarefas{

    static adicionarTarefa() {
        let id = Math.floor(Math.random() * 1000000);

        const tarefa = new Tarefa(id, tituloTarefa.value);
        
        tarefas = [... tarefas, tarefa];
        
        tituloTarefa.value = "";

        tituloTarefa.focus();

        UI.exibirTarefas();
    };

    static removerTarefa(){
        containerLista.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-remover")){
                    e.target.parentElement.parentElement.remove();  

                    let btnId = e.target.dataset.id;

                    tarefas = tarefas.filter((tarefa) => tarefa.id !== +btnId);
            
                    Storage.salvarTarefas(tarefas); 

                    UI.exibirOcultarbtnRemoverTodasTarefas();
            };
        });
    };
    
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

    static removerTodasTarefas(){
            tarefas = [];
            Storage.salvarTarefas(tarefas);
            UI.exibirTarefas();
            UI.exibirOcultarbtnRemoverTodasTarefas();
        
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



