/*document.getElementById('moretextbox').onclick = function() {

    var form = document.getElementById('addsizeform');
    var input = document.createElement('input');

    input.type = 'text';

    var br = document.createElement('br');

    form.appendChild(input);
    form.appendChild(br);
}*/

function moretextbox() {
    var tableRef = document.getElementById('addstock').getElementsByTagName('tbody')[0];

    //Insert a row in the table at the row
    var newRow = tableRef.insertRow(tableRef.rows.length);

    //Insert a cell in the row at index 0
    var newCell = newRow.insertCell(0);
    var newCell1 = newRow.insertCell(1);
    var newCell2 = newRow.insertCell(2);
    var newCell3 = newRow.insertCell(3);
    var newCell4 = newRow.insertCell(4);

    var sizeslug = document.createElement('input');
    sizeslug.type = "text";
    sizeslug.className = "form-control";
    sizeslug.name = "sizeslug[]";

    var sizename = document.createElement('input');
    sizename.type = "text";
    sizename.className = "form-control";
    sizename.name = "sizename[]";

    var initialstock = document.createElement('input');
    initialstock.type = "text";
    initialstock.className = "form-control";
    initialstock.name = "initialstock[]";
    // Append a text node to the cell

    newCell1.appendChild(sizeslug);
    newCell2.appendChild(sizename);
    newCell3.appendChild(initialstock);
    return false;
}
