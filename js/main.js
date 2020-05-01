
var list = [];

function getTotal(list) {
  var total = 0;
  for(var key in list){
    total += list[key].value * list[key].amount;
  }
  document.getElementById("totalValue").innerHTML = formatValue(total)
}

function setList(list) {
  var table = '<thead><tr><td>Descrição</td><td>Quantidade</td><td>Valor Unitário</td></td><td>Valor total</td><td>Ação</td></tr></thead>';
  for(key in list) {
    table += '<tbody><tr><td>'+ formatDesc(list[key].desc) +'</td><td>'+ list[key].amount +'</td><td>'+ formatValue(list[key].value) +'</td><td>'+ formatValue(list[key].value * list[key].amount)+'</td><td><button class="btn btn-warning" onclick="setUpdate('+key+');">Editar</button> <button class="btn btn-danger" onclick="deleteData('+key+');">Apagar</button></td></tr></tbody>';
  }
  document.getElementById('listTable').innerHTML = table;
  getTotal(list);
  saveToStorage(list);
}

function formatDesc(desc) {

  //definido a string para minúscula
  var str = desc.toLowerCase();

  /**
   * Pegando a primeira letra da string
   * transformando em Uppercase ("str.charAt(0).toUpperCase()")
   * concatenando com o restante da string minuscula ("+ str.slice(1);")
   */
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str
}
 /**
  * Função para formatar valores (R$)
  */
function formatValue(value) {
  var str = parseFloat(value).toFixed(2) + '';
  str = str.replace('.',',');
  str = 'R$ ' + str
  return str
}
/**
 * Função para adicionar novos items
 */
function addData() {
  if(!validateData()){
    return;
  }

  var desc = document.getElementById('desc').value;
  var amount = document.getElementById('amount').value;
  var value = document.getElementById('value').value;

  list.unshift({ 'desc': desc, 'amount': amount, 'value': value });
  setList(list);
}

function setUpdate(id) {
  var obj = list[id];
  document.getElementById('desc').value = obj.desc;
  document.getElementById('amount').value = obj.amount;
  document.getElementById('value').value = obj.value;
  document.getElementById('btnUpdate').style.display = "inline-block";
  document.getElementById('btnAdd').style.display = "none";

  document.getElementById('inputIdUpdate').innerHTML = '<input id="idUpdate" type="hidden" value="'+id+'">';
}

function resetForm() {
  document.getElementById('desc').value = "";
  document.getElementById('amount').value = "";
  document.getElementById('value').value = "";
  document.getElementById('btnUpdate').style.display = "none";
  document.getElementById('btnAdd').style.display = "inline-block";

  document.getElementById('inputIdUpdate').innerHTML = "";
  document.getElementById("errors").style.display = "none";

}

function updateData() {
  if(!validateData()){
    return;
  }
  var id = document.getElementById('idUpdate').value;

  var desc = document.getElementById('desc').value;
  var amount = document.getElementById('amount').value;
  var value = document.getElementById('value').value;

  list[id] = {"desc": desc, "amount": amount, "value": value };
  resetForm();
  setList(list);
}

function deleteData(id) {
  if(confirm('Deseja mesmo apagar essa informação?')) {
    if(id == list.length -1) {
      list.pop();
    } else if ( id === 0) {
      list.shift();
    } else {
      var arrAuxIni = list.slice(0, id);
      var arrAuxEnd = list.slice(id +1);
      list = arrAuxIni.concat(arrAuxEnd);      
    }
    setList(list)
  }
}

function validateData() {
  var desc = document.getElementById('desc').value;
  var amount = document.getElementById('amount').value;
  var value = document.getElementById('value').value;
  var errors = "";

  document.getElementById("errors").style.display = "none";

  if(desc === "") {
    errors += '<div class="alert alert-danger" role="alert">Campo descriçao não pode ficar vazio</div>'
  }

  if(amount === "") {
    errors += '<div class="alert alert-danger" role="alert">Campo quantidade não pode ficar vazio</div>'
  } else if ( amount != parseInt(amount)) {
    errors += '<div class="alert alert-danger" role="alert">Insira uma quantidade válida</div>'
  }

  if(value === "") {
    errors += '<div class="alert alert-danger" role="alert">Campo quantidade não pode ficar vazio</div>'
  } else if ( value != parseFloat(value)) {
    errors += '<div class="alert alert-danger" role="alert">Insira um valor válido</div>'
  }

  if(errors != "") {
    document.getElementById("errors").style.display = "block";
    document.getElementById("errors").innerHTML = errors;
    return 0
  } else {
    return 1
  }
}

function saveToStorage(list){
  var jsonStr = JSON.stringify(list);
  localStorage.setItem("list", jsonStr);
}

function initStorage() {
  var testList = localStorage.getItem("list");
  if(testList){
    list = JSON.parse(testList);
  }
  setList(list)
}

initStorage();