const express = require('express');
const app = express();

const port = 3000;

const config = {
  host: 'database',
  user: 'root',
  password: 'root',
  database: 'database'
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);

function createTable(connection) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        console.log("Tabela 'people' foi criada ou já existia.");
      }
    });
  });
}

function sqlInsert(connection) {
  return new Promise((resolve, reject) => {
    const sql = `insert into people(name) values ?`;
    const peoples = [['Obi-Wan Kenobi'], ['R2-D2'], ['Darth Vader']];
    connection.query(sql, [peoples], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        console.log(`Foram inseridas ${result.affectedRows} pessoas!`);
      }
    });
  });
}

function sqlSelect(connection) {
  return new Promise((resolve, reject) => {
    const sql = `select * from people`;
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

createTable(connection)
  .then(() => sqlInsert(connection))
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });

const listPeople = async () => {
  const allPeople = await sqlSelect(connection);
  console.log(allPeople);
  return allPeople;
};

app.get('/', async (req, res) => {
  const peoples = await listPeople();
  const listPeoples = '<ul>' + peoples.map(item => `<li align="center">${item.name}</li>`).join('') + '</ul>';
  res.send(`<h1 align="center">Full Cycle Rocks!</h1>\n${listPeoples}`);
});

app.listen(port, () => {
  console.log(`Ouvindo na porta: ${port}`);
});
