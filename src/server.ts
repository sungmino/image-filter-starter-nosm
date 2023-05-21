import bodyParser from 'body-parser';
import express from 'express';
import { User } from './interface/user';
import { auth, generateJWT } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user

  let users: User[] = [
    {
      id: 1,
      username: 'test1',
      password: 123123
    }
  ];

  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.post('/signup', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
     return res.status(400).send({error: true, message: 'Username and Password must be not empty'});
    }

    // for (let item of users) {
    //   if (username === item.username) {
    //     return res.status(409).send({error: true, message: `User name: ${username} existed. please choice other user name`});
    //   }
    // }
    const checkUser = users.filter((item) => item.username === username);
    if (checkUser.length > 0) {
      return res
        .status(409)
        .send({
          error: true,
          message: `User name: ${username} existed. please choice other user name`,
        });
    }

    const newUser = {
      username,
      password,
      id: users.length + 1
    }

    users.push(newUser);

    return res.status(201).send({
      error: false,
      messgae: 'User register successfully',
      token: generateJWT(newUser)
    });

  })

  app.post('/login', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
     return res.status(400).send({error: true, message: 'Username and Password must be not empty'});
    }

    const checkUser = users.filter((user) => user.username === username);

    if (checkUser.length === 0) {
      return res.status(404).send({error: true, message: 'User not found'});
    }

    if (checkUser[0].password !== password) {
      return res.status(400).send({error: true, message: 'Incorrect password'});
    }

    return res.status(201).send({
      error: false,
      message: 'Login successfully',
      token: generateJWT(checkUser[0])
    })
  })

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get('/filteredimage', auth(), (req, res) => {
    const {image_url} = req.query;
    if (!image_url || image_url.length === 0) {
      return res.status(400).send({error: true, message: 'You pass an image url to download'});
    }
  })

  /**************************************************************************** */

  //! END @TODO1


  app.use('*', (req, res) => {
    return res.status(404).send({message: 'Endpoint Not Found'})
  })



  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();