document.addEventListener("DOMContentLoaded", () => {
    const list1Input = document.getElementById("list1");
    const color1Input = document.getElementById("color1");
    const list2Input = document.getElementById("list2");
    const color2Input = document.getElementById("color2");
    const scannerInput = document.getElementById("scanner");
    const logTableBody = document.querySelector("#logTable tbody");
    const copyBtn = document.getElementById("copyBtn");

    // --- NOVO: Lógica para ler os parâmetros da URL ---
    const urlParams = new URLSearchParams(window.location.search);

    // Função auxiliar para garantir que a cor passada na URL tenha o "#" antes do código HEX
    function formatColor(colorStr) {
        if (!colorStr) return null;
        return colorStr.startsWith('#') ? colorStr : '#' + colorStr;
    }

    if (urlParams.has('list1')) list1Input.value = urlParams.get('list1');
    if (urlParams.has('list2')) list2Input.value = urlParams.get('list2');
    
    if (urlParams.has('color1')) color1Input.value = formatColor(urlParams.get('color1'));
    if (urlParams.has('color2')) color2Input.value = formatColor(urlParams.get('color2'));
    // --------------------------------------------------

    function parseList(text) {
        return text.split(/[\s,;]+/).filter(item => item.trim() !== "");
    }

    scannerInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            const code = this.value.trim();
            if (!code) return; 

            const list1 = parseList(list1Input.value);
            const list2 = parseList(list2Input.value);
            
            let resultText = "";
            let bgColor = "#ffffff"; 

            if (list1.includes(code)) {
                bgColor = color1Input.value;
                resultText = "Encontrado na Lista 1";
            } else if (list2.includes(code)) {
                bgColor = color2Input.value;
                resultText = "Encontrado na Lista 2";
            } else {
                resultText = "Não encontrado";
            }

            document.body.style.backgroundColor = bgColor;

            const row = document.createElement("tr");
            
            const cellCode = document.createElement("td");
            cellCode.textContent = code;
            
            const cellResult = document.createElement("td");
            cellResult.textContent = resultText;
            
            row.appendChild(cellCode);
            row.appendChild(cellResult);
            logTableBody.prepend(row); 

            this.value = "";
        }
    });

    copyBtn.addEventListener("click", () => {
        let textToCopy = "Código\tResultado\n"; 
        
        const rows = logTableBody.querySelectorAll("tr");
        if (rows.length === 0) {
            alert("O histórico está vazio!");
            return;
        }

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length === 2) {
                textToCopy += `${cells[0].textContent}\t${cells[1].textContent}\n`;
            }
        });

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Histórico copiado com sucesso!");
        }).catch(err => {
            alert("Erro ao copiar o histórico: " + err);
        });
    });
});