document.addEventListener('DOMContentLoaded', (event) => {
    // Cria os botões dos portões
    fetch('https://roteamento-back.onrender.com/gates')
    .then(response => response.json())
    .then(gates => {
        gates.forEach(gate => {
            let button = document.createElement('button');
            button.className = 'btn btn-secondary m-1 gate-button'; // Adicionado 'gate-button'
            button.textContent = gate;
            button.onclick = function() {
                this.classList.toggle('btn-primary');
                this.classList.toggle('btn-secondary');
            };
            document.getElementById('gate-buttons').appendChild(button);
        });
    })
    .catch(error => console.error('Error:', error));

    document.getElementById('create-route').onclick = function() {

        // Obtém os portões selecionados
        let selectedGates = Array.from(document.getElementsByClassName('gate-button btn-primary')).map(function(button) {
            return button.textContent;
        });

        console.log(selectedGates);

        // Faz a requisição POST para criar a rota
        fetch('https://roteamento-back.onrender.com/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gates: selectedGates }),
        })
        .then(response => response.json())
        .then(route => {

            // Desmarca os botões de portão selecionados
            Array.from(document.getElementsByClassName('btn-primary')).forEach(function(button) {
                button.classList.toggle('btn-primary');
                button.classList.toggle('btn-secondary');
            });

            // Mostra o resultado na seção de resultado
            document.getElementById('optimal-route').textContent = route.join(' -> ');

            // Adiciona a rota ao histórico
            let row = document.createElement('tr');
            let routeCell = document.createElement('td');
            let timeCell = document.createElement('td');
            routeCell.textContent = route.join(' -> ');
            timeCell.textContent = new Date().toLocaleTimeString();
            row.appendChild(routeCell);
            row.appendChild(timeCell);
            document.getElementById('route-history-body').insertBefore(row, document.getElementById('route-history-body').childNodes[0]);
        })
        .catch(error => {
        });
    };
});
