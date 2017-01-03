var tableName = "test";
var db = openDatabase('mydb', '1.0', 'testdb', 2 * 1024 * 1024);

db.transaction(function (tx) {  
	tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName +' (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
});

function printAllItems() {
	var printArea = document.getElementById("printArea");
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM ' + tableName, [], function (tx, results) {
			var newTable = "<table><tr><th>Name</th><th colspan=2>Action</th></tr>";
			var len = results.rows.length, i;
			for (i = 0; i < len; i++) {
				newTable += "<tr><td>" + results.rows.item(i).name + "</td>" 
					+ "<td><a href='javascript:editItem(" +  results.rows.item(i).id + ",\"" + results.rows.item(i).name + "\");'>Edit</a></td>"
					+ "<td><a href='javascript:deleteItem(" + results.rows.item(i).id + ",\"" + results.rows.item(i).name + "\");'>Remove</a></td></tr>";
			}
			if (len==0) {
				newTable += "<tr><td colspan=3>No item on table.</td></tr>";
			}
			newTable += "</table>";
			printArea.innerHTML = newTable;
		})
	});
}

function clickInsert() {
	var newText = document.getElementById("inputItem");
	console.log(newText.value + " INSERTED");
	insertNewItem(newText.value);
}

function insertNewItem(newItem) {
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO ' + tableName + ' (name) VALUES (?)', [newItem]);
	});
	location.reload();
}

function editItem(id, oldname) {
	var newName = prompt("Chaning name for: " + oldname);
	if(newName) {
		db.transaction(function (tx) {
			tx.executeSql('UPDATE ' + tableName + ' SET name=? WHERE id=?', [newName, id]);
		});
		location.reload();
	}
}

function deleteItem(id, name) {
	if(confirm("Delete item: " + name)) {
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM ' + tableName + ' WHERE id = ?', [id]);
		});
		location.reload();
	}
}