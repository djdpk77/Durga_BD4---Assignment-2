const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

//app.use(express.static('static'));

let db;

const dbFilePath = path.resolve(__dirname, 'database.sqlite');
const tmpDbPath = '/tmp/database.sqlite';

if (!fs.existsSync(tmpDbPath)) {
  fs.copyFileSync(dbFilePath, tmpDbPath);
}

// Then open the database connection using the /tmp path
(async () => {
  db = await open({
    filename: tmpDbPath,
    driver: sqlite3.Database,
  });
})();

//Function to fetch all games from the database
async function fetchAllGames() {
  let query = 'SELECT * FROM games';
  let response = await db.all(query, []);

  return { games: response };
}

//Endpoint 1: Get All Games
app.get('/games', async (req, res) => {
  try {
    let result = await fetchAllGames();

    if (result.games.length === 0) {
      return res.status(404).json({ message: 'No Games found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch a specific game by its ID
async function fetchGamesByID(id) {
  let query = 'SELECT * FROM games WHERE id = ?';
  let response = await db.all(query, [id]);

  return { games: response };
}

//Endpoint 2: Get Game by ID
app.get('/games/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchGamesByID(id);

    if (result.games.length === 0) {
      return res.status(404).json({ message: 'No Games found by ID: ' + id });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch games based on its genre
async function fetchGamesByGenre(genre) {
  let query = 'SELECT * FROM games WHERE genre = ?';
  let response = await db.all(query, [genre]);

  return { games: response };
}

//Endpoint 3: Get Games by genre
app.get('/games/genre/:genre', async (req, res) => {
  let genre = req.params.genre;
  try {
    let result = await fetchGamesByGenre(genre);

    if (result.games.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Games found by genre: ' + genre });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch games based on its platform
async function fetchGamesByPlatform(platform) {
  let query = 'SELECT * FROM games WHERE platform = ?';
  let response = await db.all(query, [platform]);

  return { games: response };
}

//Endpoint 4: Get Games by platform
app.get('/games/platform/:platform', async (req, res) => {
  let platform = req.params.platform;
  try {
    let result = await fetchGamesByPlatform(platform);

    if (result.games.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Games found by platform: ' + platform });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch games sorted by their rating
async function fetchGamesSortedByRating() {
  let query = 'SELECT * FROM games ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { games: response };
}

//Endpoint 5: Get Games Sorted by Rating
app.get('/games/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchGamesSortedByRating();

    if (result.games.length === 0) {
      return res.status(404).json({ message: 'No Games found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all players from the database
async function fetchAllPlayers() {
  let query = 'SELECT * FROM players';
  let response = await db.all(query, []);

  return { players: response };
}

//Endpoint 6: Get All Players
app.get('/players', async (req, res) => {
  try {
    let result = await fetchAllPlayers();

    if (result.players.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch a specific player by their ID
async function fetchPlayersByID(id) {
  let query = 'SELECT * FROM players where id = ?';
  let response = await db.all(query, [id]);

  return { players: response };
}

//Endpoint 7: Get Player by ID
app.get('/players/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchPlayersByID(id);

    if (result.players.length === 0) {
      return res
        .status(404)
        .json({ message: 'No players found with ID: ' + id });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch players based on their platform
async function fetchPlayersByPlatform(platform) {
  let query = 'SELECT * FROM players WHERE platform = ?';
  let response = await db.all(query, [platform]);

  return { players: response };
}

//Endpoint 8: Get Players by Platform
app.get('/players/platform/:platform', async (req, res) => {
  let platform = req.params.platform;
  try {
    let result = await fetchPlayersByPlatform(platform);

    if (result.players.length === 0) {
      return res
        .status(404)
        .json({ message: 'No players found with platform: ' + platform });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch players sorted by their rating
async function fetchPlayersSortedByRating() {
  let query = 'SELECT * FROM players ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { players: response };
}

//Endpoint 9: Get Players Sorted by Rating
app.get('/players/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchPlayersSortedByRating();

    if (result.players.length === 0) {
      return res.status(404).json({ message: 'No players found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all tournaments from the database
async function fetchAllTournaments() {
  let query = 'SELECT * FROM tournaments';
  let response = await db.all(query, []);

  return { tournaments: response };
}

//Endpoint 10: Get All Tournaments
app.get('/tournaments', async (req, res) => {
  try {
    let result = await fetchAllTournaments();

    if (result.tournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch a specific tournament by its ID
async function fetchAllTournamentsByID(id) {
  let query = 'SELECT * FROM tournaments WHERE id = ?';
  let response = await db.all(query, [id]);

  return { tournaments: response };
}

//Endpoint 11: Get Tournament by ID
app.get('/tournaments/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchAllTournamentsByID(id);

    if (result.tournaments.length === 0) {
      return res
        .status(404)
        .json({ message: 'No tournaments found with id: ' + id });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch tournaments based on their game ID
async function fetchAllTournamentsByGameID(gameId) {
  let query = 'SELECT * FROM tournaments WHERE gameId = ?';
  let response = await db.all(query, [gameId]);

  return { tournaments: response };
}

//Endpoint 12: Get Tournaments by Game ID
app.get('/tournaments/game/:gameId', async (req, res) => {
  let gameId = parseInt(req.params.gameId);
  try {
    let result = await fetchAllTournamentsByGameID(gameId);

    if (result.tournaments.length === 0) {
      return res
        .status(404)
        .json({ message: 'No tournaments found with gameId: ' + gameId });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch tournaments sorted by their prize pool
async function fetchAllTournamentsSortedByPrizePool() {
  let query = 'SELECT * FROM tournaments ORDER BY prizePool DESC';
  let response = await db.all(query, []);

  return { tournaments: response };
}

//Endpoint 13: Get Tournaments Sorted by Prize Pool
app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  try {
    let result = await fetchAllTournamentsSortedByPrizePool();

    if (result.tournaments.length === 0) {
      return res.status(404).json({ message: 'No tournaments found' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
