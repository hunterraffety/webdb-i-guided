const express = require('express');
const knex = require('knex');

const dbConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: './data/posts.db3'
  },
  useNullAsDefault: true
});

const router = express.Router();

router.get('/', (req, res) => {
  dbConnection('posts')
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  dbConnection('posts')
    .where({ id: id })
    .first()
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/', (req, res) => {
  const post = req.body;

  dbConnection('posts')
    .insert(post, 'id')
    .then(arrayOfIds => {
      const idOfLastRecordInserted = arrayOfIds[0];
      res.status(201).json(idOfLastRecordInserted);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const content = req.body;
  dbConnection('posts')
    .where({ id: id })
    .update(content)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) updated.` });
      } else {
        res.status(404).json({ message: 'Post not found.' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  dbConnection('posts')
    .where({ id: id })
    .delete()
    .then(count => {
      res.status(200).json({ message: `${count} record deleted.` });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
