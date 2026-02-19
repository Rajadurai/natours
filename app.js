const express = require('express');
const fs = require('fs');
const morgon = require('morgan');
const app = express();

//1) MIDDLEWARES

app.use(morgon('dev'));

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware ;~)');
  next();
});

app.use((req, res, next) => {
  req.requestDate = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

//2) ROUTE HANDLERS

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestDate,
    results: tours.length,
    data: { tours },
  });
};
//responding URL parameter
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (id > tours.length) //if (!tour)
  {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};
// create new tour
const createTour = (req, res) => {
  //console.log(req.body);
  //res.send('Successful');
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    },
  );
};
//handling patch request
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<updated tour here...>' } });
};
//handling delete request
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res.status(204).json({ status: 'success', data: null });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined !',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
