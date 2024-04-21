import express from 'express';
import { CardCollection } from './cardCollection.js';
import { Card } from './card.js';
import { FileManager } from './fileManager.js';

const app = express();
const PORT = 3000;

app.use(express.json());

const CARD_BASE_ROUTE = '/cards';

const fileManager = new FileManager('user');

const cardCollection = new CardCollection(fileManager); // Variable para la colección de cartas

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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
