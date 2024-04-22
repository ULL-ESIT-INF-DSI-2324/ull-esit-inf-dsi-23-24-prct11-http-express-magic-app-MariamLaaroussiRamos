[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-MariamLaaroussiRamos/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-MariamLaaroussiRamos?branch=main)

# Práctica 11 - Aplicación Express para coleccionistas de cartas Magic #
## Introducción #
En esta práctica, hemos implementado una aplicación Express para coleccionistas de cartas Magic, basada en las implementaciones previas de la aplicación. El objetivo principal era proporcionar funcionalidad a través de un servidor HTTP escrito con Express, lo que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la colección de cartas de un usuario mediante peticiones HTTP.
## Objetivo ##
El objetivo era permitir a los usuarios realizar diversas operaciones en su colección de cartas, como añadir, modificar, eliminar, listar y mostrar cartas. Estas operaciones se realizan a través de peticiones HTTP al servidor Express, que almacena la información de las cartas en archivos JSON en el sistema de archivos del servidor.
## card.ts ##
Se trata de la estructura básica del programa.
Enumeraciones:
CardType: Enumera los posibles tipos de carta, como Tierra, Criatura, Encantamiento, etc.
CardColor: Enumera los posibles colores de una carta, como Blanco, Azul, Negro, etc.
CardRarity: Enumera las posibles rarezas de una carta, como Común, Infrecuente, Rara, etc.
```
export enum CardType {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker"
}

/**
 * Enumeración que define los posibles colores de una carta.
 */
export enum CardColor {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor"
}

/**
 * Enumeración que define las posibles rarezas de una carta.
 */
export enum CardRarity {
  Comun = "Común",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mítica"
}
```
Clase Card:

Representa una carta del juego con propiedades como id, name, cost, color, cardType, rarity, rulesText, power, toughness, loyalty, y marketValue.
constructor: Método para crear una nueva instancia de la carta, inicializando sus propiedades con los valores proporcionados.
```
export class Card {
  id: number;
  name: string;
  cost: number;
  color: string;
  cardType: string;
  rarity: string;
  rulesText: string;
  power?: number;
  toughness?: number;
  loyalty?: number;
  marketValue: number;

  constructor(
    id: number,
    name: string,
    cost: number,
    color: string,
    cardType: string,
    rarity: string,
    rulesText: string,
    marketValue: number,
    power?: number,
    toughness?: number,
    loyalty?: number
  ) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.color = color;
    this.cardType = cardType;
    this.rarity = rarity;
    this.rulesText = rulesText;
    this.marketValue = marketValue;
    this.power = power;
    this.toughness = toughness;
    this.loyalty = loyalty;
  }
```
Propiedades de la clase Card:

id: Identificador único de la carta.
name: Nombre de la carta.
cost: Costo de la carta.
color: Color de la carta (de la enumeración CardColor).
cardType: Tipo de carta (de la enumeración CardType).
rarity: Rareza de la carta (de la enumeración CardRarity).
rulesText: Texto de las reglas de la carta.
power: Poder de la carta (solo para criaturas).
toughness: Resistencia de la carta (solo para criaturas).
loyalty: Lealtad de la carta (solo para planeswalkers).
marketValue: Valor de mercado de la carta.

## cardCollection.ts ##
Importaciones:
chalk: Esta biblioteca permite dar color al texto en la consola. Se utiliza para resaltar mensajes importantes en la salida de la aplicación.
Card y FileManager: Se importan las clases Card y FileManager desde sus respectivos archivos para ser utilizadas en esta clase.
fs: Este módulo es parte del sistema de archivos de Node.js y se utiliza para realizar operaciones relacionadas con archivos, como eliminar archivos físicos.
Clase CardCollection:
Propiedad privada collection: Es un array que almacena instancias de la clase Card. Representa la colección de cartas gestionada por esta clase.
Constructor:

Recibe una instancia de FileManager para manejar la carga y guardado de la colección desde y hacia el sistema de archivos.
Al inicializar la clase, carga la colección desde el archivo utilizando el método load de FileManager.
Métodos públicos:

addCard: Agrega una nueva carta a la colección verificando primero si ya existe una carta con el mismo ID.
updateCard: Modifica una carta existente en la colección basándose en su ID.
removeCard: Elimina una carta de la colección por su ID, también elimina físicamente el archivo asociado a esa carta.
listCards: Muestra en consola los ID y nombres de todas las cartas en la colección.
showCard: Muestra los detalles de una carta específica según su ID.
getCardById: Obtiene una carta de la colección por su ID.

```
import chalk from 'chalk';
import { Card } from './card.js';
import { FileManager } from './fileManager.js';
import * as fs from 'fs';

export class CardCollection {
  private collection: Card[];

  constructor(private fileManager: FileManager) {
    this.collection = fileManager.load();
  }

  public addCard(card: Card): void {
    const existingCard = this.getCardById(card.id);
    if (existingCard) {
      console.log(chalk.red('Error: A card with the same ID already exists.'));
    } else {
      this.collection.push(card);
      this.fileManager.save(this.collection);
      console.log(chalk.green('Card added successfully!'));
    }
  }

  public updateCard(updatedCard: Card): void {
    const index = this.collection.findIndex(card => card.id === updatedCard.id);
    if (index !== -1) {
      this.collection[index] = updatedCard;
      this.fileManager.save(this.collection);
      console.log(chalk.green('Card modified successfully!'));
    } else {
      console.log(chalk.red('Error: Card with specified ID not found.'));
    }
  }

  public removeCard(cardId: number): void {
    console.log('Removing card with ID:', cardId);
    const index = this.collection.findIndex(card => card.id === cardId);
    console.log('Card index:', index);
    if (index !== -1) {
      const cardToRemove = this.collection[index];
      const filePath = this.fileManager.getFilePath(cardToRemove.id);
      fs.unlinkSync(filePath);
      this.collection.splice(index, 1);
      this.fileManager.save(this.collection);
      console.log(chalk.green('Card removed successfully!'));
    } else {
      console.log(chalk.red('Error: Card with specified ID not found.'));
    }
  }

  public listCards(): void {
    for (const card of this.collection) {
      console.log(`Card ID: ${card.id}, Name: ${card.name}`);
    }
  }

  public showCard(cardId: number): void {
    const card = this.getCardById(cardId);
    if (card) {
      console.log(chalk.green('Card Details:'));
      console.log('ID:', card.id);
      console.log('Name:', card.name);
      console.log('Cost:', card.cost);
      console.log('Color:', card.color);
      console.log('Type:', card.cardType);
      console.log('Rarity:', card.rarity);
      console.log('Rules Text:', card.rulesText);
      console.log('Market Value:', card.marketValue);
    } else {
      console.log(chalk.red('Error: Card with specified ID not found.'));
    }
  }

  public getCardById(cardId: number): Card | undefined {
    return this.collection.find(card => card.id === cardId);
  }
}
```

## fileManager.ts ##
Este se encarga de gestionar la interacción con el sistema de archivos para las cartas de usuario en una aplicación de colección de cartas. 
En primer lugar:
Se importa el módulo fs de Node.js para trabajar con el sistema de archivos.
Se importa la clase Card desde el archivo card.js para manipular objetos de tipo carta.
```
import * as fs from 'fs'; // Módulo File System de Node.js para trabajar con archivos
import { Card } from './card.js'; // Importamos la clase Card del archivo card.js
```
Clase FileManager:
```
export class FileManager {
  private userDir: string; // Directorio del usuario

  constructor(private username: string) {
    this.userDir = `./src/users/${this.username}`;
    this.createUserDirIfNotExists();
  }

  private createUserDirIfNotExists(): void {
    if (!fs.existsSync(this.userDir)) {
      fs.mkdirSync(this.userDir, { recursive: true });
    }
  }

  public getFilePath(cardId: number): string {
    return `${this.userDir}/card${cardId}.json`;
  }

  public save(collection: Card[]): void {
    for (const card of collection) {
      const filePath = this.getFilePath(card.id);
      fs.writeFileSync(filePath, JSON.stringify(card, null, 2));
    }
  }

  public load(): Card[] {
    const files = fs.readdirSync(this.userDir);
    const collection: Card[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = `${this.userDir}/${file}`;
        try {
          const data = fs.readFileSync(filePath, 'utf-8');
          const card = JSON.parse(data) as Card;
          collection.push(card);
        } catch (error) {
          console.error(`Error loading card from ${filePath}: ${error.message}`);
        }
      }
    }
    return collection;
  }
}
```
Constructor:

Recibe el nombre de usuario para identificar la carpeta de almacenamiento de las cartas.
Crea el directorio del usuario si no existe mediante createUserDirIfNotExists.
Método createUserDirIfNotExists:

Comprueba si el directorio del usuario existe.
Si no existe, lo crea de forma recursiva usando fs.mkdirSync.
Método getFilePath:

Genera la ruta de archivo para una carta específica basada en su ID.
Método save:

Guarda la colección de cartas en archivos JSON en el sistema de archivos.
Itera sobre cada carta en la colección, obtiene su ruta de archivo y escribe el archivo JSON.
Método load:

Carga las cartas almacenadas en archivos JSON desde el sistema de archivos.
Lee los archivos en el directorio del usuario y los convierte en objetos Card.
Maneja errores al cargar cartas y los muestra en la consola.

## index.ts ##
Configuración del yargs:
```
yargs(hideBin(process.argv))
```
Configuro yargs para trabajar con los argumentos pasados desde la línea de comandos.

Comandos y Argumentos:
Se definen varios comandos (add, update, remove, list, show) junto con sus argumentos correspondientes utilizando el método .command() de yargs.
```
  .command('add', 'Adds a card to the collection', {
    id: { 
      description: 'Card ID', 
      type: 'number', 
      demandOption: true 
    },
    name: { 
      description: 'Card Name', 
      type: 'string', 
      demandOption: true 
    },
    cost: { 
      description: 'Cost', 
      type: 'number', 
      demandOption: true 
    },
    color: { 
      description: 'Card Color', 
      type: 'string', 
      choices: Object.values(CardColor), 
      demandOption: true 
    },
    type: { 
      description: 'Card Type', 
      type: 'string', 
      choices: Object.values(CardType), 
      demandOption: true 
    },
    rarity: { 
      description: 'Card Rarity', 
      type: 'string', 
      choices: Object.values(CardRarity), 
      demandOption: true 
    },
    rulesText: { 
      description: 'Rules Text', 
      type: 'string', 
      demandOption: true 
    },
    marketValue: { 
      description: 'Market Value', 
      type: 'number', 
      demandOption: true 
    },
    power: { 
      description: 'Card Power', 
      type: 'number' 
    },
    toughness: { 
      description: 'Card Toughness', 
      type: 'number' 
    },
    loyalty: { 
      description: 'Card Loyalty', 
      type: 'number' 
    },
  }, (argv) => {
    const USERNAME: string = argv.user as string; // Obtener el nombre de usuario como string
    const fileManager = new FileManager(USERNAME);
    const cardCollection = new CardCollection(fileManager);
    const newCard = new Card(
      argv.id,
      argv.name,
      argv.cost,
      argv.color,
      argv.type,
      argv.rarity,
      argv.rulesText,
      argv.marketValue,
      argv.power,
      argv.toughness,
      argv.loyalty
    );
    cardCollection.addCard(newCard);
  })
  // Comando 'update' para modificar una carta en la colección
  .command('update', 'Modifies a card in the collection', {
    id: { 
      description: 'Card ID', 
      type: 'number', 
      demandOption: true 
    },
    name: { 
      description: 'Card Name', 
      type: 'string', 
      demandOption: true 
    },
    cost: { 
      description: 'Cost', 
      type: 'number', 
      demandOption: true 
    },
    color: { 
      description: 'Card Color', 
      type: 'string', 
      choices: Object.values(CardColor), 
      demandOption: true 
    },
    type: { 
      description: 'Card Type', 
      type: 'string', 
      choices: Object.values(CardType), 
      demandOption: true 
    },
    rarity: { 
      description: 'Card Rarity', 
      type: 'string', 
      choices: Object.values(CardRarity), 
      demandOption: true 
    },
    rulesText: { 
      description: 'Rules Text', 
      type: 'string', 
      demandOption: true 
    },
    marketValue: { 
      description: 'Market Value', 
      type: 'number', 
      demandOption: true 
    },
    power: { 
      description: 'Card Power', 
      type: 'number' 
    },
    toughness: { 
      description: 'Card Toughness', 
      type: 'number' 
    },
    loyalty: { 
      description: 'Card Loyalty', 
      type: 'number' 
    },
  }, (argv) => {
    const USERNAME: string = argv.user as string; // Obtener el nombre de usuario como string
    const fileManager = new FileManager(USERNAME);
    const cardCollection = new CardCollection(fileManager);
    const modifiedCard = new Card(
      argv.id,
      argv.name,
      argv.cost,
      argv.color,
      argv.type,
      argv.rarity,
      argv.rulesText,
      argv.marketValue,
      argv.power,
      argv.toughness,
      argv.loyalty
    );
    cardCollection.updateCard(modifiedCard);
  })
  // Comando 'remove' para eliminar una carta de la colección
  .command('remove', 'Removes a card from the collection', {
    user: { 
      description: 'User name', 
      type: 'string', 
      demandOption: true 
    },
    id: { description: 'Card ID', 
    type: 'number', 
    demandOption: true 
  },
  }, (argv) => {
    const USERNAME = argv.user; // Obtener el nombre de usuario
    const fileManager = new FileManager(USERNAME);
    const cardCollection = new CardCollection(fileManager);
    cardCollection.removeCard(argv.id); // Revisar si argv.id contiene el ID correcto
  })  
  // Comando 'list' para listar todas las cartas en la colección
  .command('list', 'Lists all cards in the collection', {}, (argv) => {
    const USERNAME: string = argv.user as string; // Obtener el nombre de usuario como string
    const fileManager = new FileManager(USERNAME);
    const cardCollection = new CardCollection(fileManager);
    cardCollection.listCards();
  })
  // Comando 'show' para mostrar detalles de una carta específica en la colección
  .command('show', 'Shows details of a specific card in the collection', {
    id: { description: 'Card ID', type: 'number', demandOption: true },
  }, (argv) => {
    const USERNAME: string = argv.user as string; // Obtener el nombre de usuario como string

    const fileManager = new FileManager(USERNAME);
    const cardCollection = new CardCollection(fileManager);
    cardCollection.showCard(argv.id);
  })
```
Cada comando tiene asociada una función de callback que se ejecuta cuando se invoca ese comando desde la línea de comandos.
Ejemplos de Comandos:
Comando add: Agrega una nueva carta a la colección.
Comando update: Modifica una carta existente en la colección.
Comando remove: Elimina una carta de la colección por su ID.
Comando list: Lista todas las cartas en la colección.
Comando show: Muestra detalles de una carta específica en la colección.

Uso de las Clases FileManager y CardCollection:
Se instancia FileManager con el nombre de usuario proporcionado en los argumentos.
```
    const fileManager = new FileManager(USERNAME);

```
Se instancia CardCollection pasando la instancia de FileManager como argumento para gestionar las cartas.
```
    const cardCollection = new CardCollection(fileManager);
    cardCollection.showCard(argv.id);
```
## server.ts #
```
import express from 'express';
import { CardCollection } from './cardCollection.js';
import { Card } from './card.js';
import { FileManager } from './fileManager.js';

const app = express();
const PORT = 3000;

app.use(express.json());
```
Configuración inicial del servidor:
Se importa Express y se crea una instancia del servidor.
Se establece el puerto en el que el servidor escuchará las solicitudes.
Middleware para analizar solicitudes JSON:
Se utiliza express.json() para analizar automáticamente el cuerpo de las solicitudes JSON entrantes.

```
const CARD_BASE_ROUTE = '/cards';

const fileManager = new FileManager('user');

const cardCollection = new CardCollection(fileManager); // Variable para la colección de cartas
```
Definición de constantes y creación de objetos:
CARD_BASE_ROUTE define la ruta base para todas las operaciones relacionadas con las cartas.
Se crea una instancia de FileManager para gestionar el almacenamiento de las cartas en archivos.
Se crea una instancia de CardCollection utilizando el FileManager recién creado.
```
/**
 * Punto de acceso para obtener información sobre una carta o listar todas las cartas de un usuario.
 * Si se proporciona un ID, se recupera la información de esa carta específica.
 * Si no se proporciona un ID, se muestra un mensaje indicando que no hay implementación para listar todas las cartas.
 */
app.get('/cards', (req, res) => {
  const { username, id } = req.query;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  if (!id) {
    res.json({ message: 'No implementation for listing all cards' });
  } else {
    const card = cardCollection.getCardById(parseInt(id.toString()));
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    res.json({ success: true, message: 'Card details retrieved successfully', card });
  }
});

/**
 * Punto de acceso para agregar una carta a la colección de un usuario.
 * Se espera que la solicitud contenga el nombre de usuario en la consulta y los detalles de la carta en el cuerpo.
 * Si falta algún campo requerido para la carta, se devuelve un error.
 */
app.post(CARD_BASE_ROUTE, (req, res) => {
  const { username } = req.query;
  const { id, name, cost, color, cardType, rarity, rulesText, marketValue, power, toughness, loyalty } = req.body;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  if (!id || !name || !cost || !color || !cardType || !rarity || !rulesText || !marketValue) {
    res.status(400).json({ error: 'All fields are required for the card' });
    return;
  }

  const newCard = new Card(
    parseInt(id),
    name,
    parseInt(cost),
    color,
    cardType,
    rarity,
    rulesText,
    parseInt(marketValue),
    power ? parseInt(power) : undefined,
    toughness ? parseInt(toughness) : undefined,
    loyalty ? parseInt(loyalty) : undefined
  );
  cardCollection.addCard(newCard);
  res.json({ success: true, message: 'Card added successfully' });
});

/**
 * Punto de acceso para eliminar una carta de la colección de un usuario.
 * Se espera que la solicitud contenga el nombre de usuario en la consulta y el ID de la carta en los parámetros de la ruta.
 * Si falta el nombre de usuario o el ID de la carta, se devuelve un error.
 */
app.delete(`${CARD_BASE_ROUTE}/:id`, (req, res) => {
  const { username } = req.query;
  const { id } = req.params;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  if (!id) {
    res.status(400).json({ error: 'Card ID is required' });
    return;
  }

  cardCollection.removeCard(parseInt(id));

  res.json({ success: true, message: 'Card deleted successfully' });
});

/**
 * Punto de acceso para modificar la información de una carta existente en la colección de un usuario.
 * Se espera que la solicitud contenga el nombre de usuario en la consulta y los detalles actualizados de la carta en el cuerpo.
 * Si la carta se actualiza con éxito, se devuelve un mensaje de éxito; de lo contrario, se devuelve un mensaje de error.
 */
app.patch('/cards', (req, res) => {
  const { usuario } = req.query;
  const carta: Card = req.body;

  cardCollection.updateCard(carta);

  const updatedCard = cardCollection.getCardById(carta.id);
  if (updatedCard) {
    res.send({ message: 'Card updated successfully' });
  } else {
    res.status(404).send({ error: 'Card not found' });
  }
});
```
Todas las peticiones deberán llevarse a cabo a partir de la ruta /cards y, además, deberán utilizarse los siguientes verbos HTTP para definir la manera en la que el servidor atenderá cada petición hecha en la ruta anterior:

get: Para obtener información sobre una carta de la colección de un usuario o para listar todas las cartas de su colección. En este caso, el ID de la carta vendrá dado, junto al usuario, como parámetros de la query string de la petición. Si no se especifica un ID concreto, se estará indicando que se desea obtener la colección completa de cartas del usuario.

post: Para añadir una carta a la colección de un usuario. En este caso, la carta que se desea añadir a la colección deberá venir especificada en formato JSON en el cuerpo de la petición. El usuario deberá indicarse en la query string de la petición.

delete: Para eliminar una carta de la colección de un usuario. En este caso, el ID de la carta que se desea eliminar vendrá dado, junto al usuario, como parámetros de la query string de la petición.

patch: Para modificar la información de una carta existente en la colección de un usuario. En este caso, el ID de la carta que se desea modificar vendrá dado, junto al usuario, como parámetros de la query string de la petición. Además, la información a modificar se especificará en formato JSON en el cuerpo de la petición.
Manejo de las solicitudes y respuestas:
Para cada punto de acceso, se manejan los parámetros de consulta y el cuerpo de la solicitud según sea necesario.
Se validan los campos obligatorios y se envían respuestas de error si faltan campos o si la carta no se encuentra.
Se utilizan los métodos de CardCollection para realizar las operaciones CRUD.
Las respuestas se envían en formato JSON con mensajes de éxito o error según corresponda.

```
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

```
Inicio del servidor:
El servidor se inicia y se pone en escucha en el puerto especificado.
Se imprime un mensaje en la consola para indicar que el servidor está funcionando.

## Conclusión ##
En esta práctica, hemos desarrollado un servidor Express que proporciona una interfaz HTTP para interactuar con una colección de cartas de Magic. Hemos utilizado la metodología de desarrollo dirigido por pruebas (TDD) para garantizar el correcto funcionamiento del código y su robustez ante entradas no válidas o inesperadas. Además, hemos seguido las recomendaciones proporcionadas en la descripción de los requisitos y hemos documentado el código utilizando TypeDoc. Esta práctica nos ha permitido adquirir experiencia en el desarrollo de aplicaciones web utilizando Express.

## Bibliografía ##
> npm: yargs. (n.d.). Npm. https://www.npmjs.com/package/yargs

> npm: chalk. (n.d.). Npm. https://www.npmjs.com/package/chalk

> File system | Node.js v21.7.1 Documentation. (n.d.). https://nodejs.org/docs/latest/api/fs.html

> Events | Node.js v21.7.3 Documentation. (n.d.). https://nodejs.org/docs/latest/api/events.html
