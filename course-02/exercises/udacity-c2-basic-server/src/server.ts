import express, { Router, Request, Response } from 'express';
// import bodyParser from 'body-parser'; deprecated
const bodyParser = require('body-parser')

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars: Car[] = cars_list;

  //Create an express application
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name",
    (req: Request, res: Response) => {
      let { name } = req.params;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400)
        .send(`name is required`);
    }

    return res.status(200)
      .send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post("/persons",
    async (req: Request, res: Response) => {

      const { name } = req.body;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  /**
   * @returns Car[] | 500 Error with message
   */
  app.get("/cars",
    async (req: Request, res: Response) => {
      try {
        const make = req.query.make as string

        if (make) {
          return res.status(200).json(cars_list.filter(car => car.make.includes(make)))
        }
        return res.status(200).json(cars_list)
      } catch (err) {
        return res.status(500).json(err)
      }
    })

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  /**
   * @returns Car | (400, 404, 500) Error with message
   */
  app.get("/cars/:id",
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id)

        if (id) {
          // try to find the car
          const car = cars_list.find(elt => elt.id == id)

          if (!car) {
            return res.status(404).json("car is not found!")
          }
          return res.status(200).json(car)
        }
        return res.status(400).json("id is required!")
      } catch (err) {
        return res.status(500).json(err)
      }
    })

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  /**
   * @returns Car | (400, 500) Error with message
   */
  app.post("/cars",
    async (req: Request, res: Response) => {
      try {
        // Retrieving cars properties
        const id = parseInt(req.body.id)
        const cost = parseInt(req.body.cost)
        const { make, type, model } = req.body

        // Check if there is an unfilled property
        if (!id || !make || !type || !model || !cost) {
          return res.status(400).json('make, type, model, cost, id is required')
        }

        // If not, create the new car and save it
        const new_car = { id: id, make: make, type: type, model: model, cost: cost }

        // Return the new car
        cars_list.push(new_car)
        return res.status(200).send(new_car)
      } catch (err) {
        return res.status(500).json(err);
      }
    })

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
