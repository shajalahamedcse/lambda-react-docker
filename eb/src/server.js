const express =     require('express');
const axios =       require("axios");
const cors =        require("cors");
const helmet =      require("helmet");

const app =         express();
const port =        80;
const omdbApiKey=   '6fa52fa7';

var allowedOrigins = [ "*" ];

app.use(cors());
// app.use(morgan("combined", { stream: accessLogStream }));
app.use(helmet());

app.use(
    cors({
      origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
    })
  );

app.get("/search/", (req, res) => {
    try {
      axios
        .get(
          `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${req.query.q}`
        )
        .then(response => {
          res.status(200).send(response.data);
          
        })
        .catch(err => {
          res.status(400).send("Bad Request");
          console.log(err);
        });
    } catch (err) {
      res.status(404).send("404");
    }
  });
  
 

app.get("/getMovieDetail/", (req, res) => {
    try {
      axios
        .get(
          `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${req.query.id}`
        )
        .then(response => {
          res.status(200).send(response.data);
        })
        .catch(err => {
          res.status(400).send("Bad Request");
        });
    } catch (err) {
      res.status(404).send("404");
    }
  });
  

    app.listen(port,()=> {
        console.log(`listen port ${port}`);
        })