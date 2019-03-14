const addPerson = (request_obj, res) => {
  if (!request_obj.files) {
      return res.status(400).send("No files were uploaded.");
  }

  let Message = '';
  let first_name = request_obj.body.first_name;
  let last_name = request_obj.body.last_name;
  let position = request_obj.body.position;
  let int_number = request_obj.body.number;
  let username = request_obj.body.username;
  let UploadedFile = request_obj.files.image;
  let image_name = UploadedFile.name;
  let fileExtension = UploadedFile.mimetype.split('/')[1];

  let usernameQuery = "SELECT * FROM `people` WHERE user_name = '" + username + "'";

  db.query(usernameQuery, (err, result) => {
      if (err) {
          // Error
          res.status(500).send(err);
      }
      if (result.length > 0) {
          Message = 'Username already exists';
          res.render('add-person.ejs', {
              Message,
              title: "Welcome to Socka | Add a new player"
          });
      } else {
          // check the filetype before uploading it
          if (UploadedFile.mimetype === 'image/png' || UploadedFile.mimetype === 'image/jpeg' || UploadedFile.mimetype === 'image/gif') {
              // upload the file to the /public/assets/img directory
              UploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                  if (err) {
                      return res.status(500).send(err);
                  }
                  // send the person's details to the database
                  let query = "INSERT INTO `people` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                      first_name + "', '" + last_name + "', '" + position + "', '" + int_number + "', '" + image_name + "', '" + username + "')";
                  db.query(query, (err, result) => {
                      if (err) {
                          return res.status(500).send(err);
                      }
                      res.redirect('/');
                  });
              });
          } else {
              Message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
              res.render('add-person.ejs', {
                  Message,
                  title: "Welcome | Add a new person"
              });
          }
      }
  });
}