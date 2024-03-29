const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const port =3000;
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter } = require('firebase-admin/firestore');
const cookieParser = require('cookie-parser');

const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://chatbot-db-4a663.firebaseio.com',
  storageBucket: 'chatbot-db-4a663.appspot.com',
});

const db = getFirestore();
const bucket = admin.storage().bucket();
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
app.post("/search",(req,res)=>{
  const search=req.body.searchdata;
  const search1=search.toLowerCase();
  if(search1=="resturant"){
    res.redirect('/resturant');
  }else if(search1=="hospital"){
    res.redirect('/hospital');
  }else if(search1=="gym"){
    res.redirect('/gym');
  }else if(search1=="beauty"){
     res.redirect('/beauty');
  }else if(search1=="pet shop"){
     res.redirect('/pet');
  }else if(search1=="estate"){
     res.redirect('/estate');
  }else if(search1=="ac service"){
     res.redirect('/acservice');
  }else if(search1=="car service"){
       res.redirect('/carservice');
    }
    else if(search1=="plumber"){
       res.redirect('/plumber');
    }else if(search1=="education"){
         res.redirect('/education');
      }else if(search1=="driving"){
         res.redirect('/driving');
      }else if(search1=="dentist"){
         res.redirect('/dentist');
      }
  else{
    res.send("<h1>No Data Found! Try Again<?h1>");
  }
});
app.post('/upload', upload.single('image'), async (req, res) => {
  const category = req.body.category;
  const gymName = req.body.name;
  const price = req.body.price;
  const contactNumber = req.body.contact;
  const address = req.body.address;
      if (!category || !gymName || !price || !contactNumber) {
        return res.status(400).json({ error: 'Invalid input. Please provide all required fields.' });
      }
  // Check if an image file was uploaded
  if (req.file) {
    const imageFileName = req.file.filename;
    const imageFilePath = path.join(__dirname, 'uploads', imageFileName);

    // Upload the image to Firebase Storage
    const bucketFilePath = `images/${imageFileName}`;
    await bucket.upload(imageFilePath, {
      destination: bucketFilePath,
      public: true,
    });

    // Get the public URL of the uploaded image
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${bucketFilePath}`;

    // Add data and image URL to Firestore
    try {
      await db.collection("connections").add({
        Category: category,
        Name: gymName,
        price: price,
        contactNumber: contactNumber,
        Address:address,
        imageUrl: imageUrl, 
      });

      // Redirect to the corresponding page based on the category
      if (category === 'gym') {
        res.redirect('/gym');
      } else if (category === 'resturant') {
        res.redirect('/resturant');
      } else if(category === 'hospital'){
        res.redirect('/hospital');
      }else if(category === 'beauty'){
        res.redirect('/beauty');
      }else if(category === 'pet'){
        res.redirect('/pet')
      }else if(category === 'estate'){
          res.redirect('/estate')
        }else if(category === 'acservice'){
          res.redirect('/acservice')
        }else if(category === 'carservice'){
          res.redirect('/carservice')
        }
        else if(category === 'plumber'){
          res.redirect('/plumber')
        }else if(category === 'education'){
            res.redirect('/education')
          }else if(category === 'driving'){
            res.redirect('/driving')
          }else if(category === 'dentist'){
            res.redirect('/dentist')
          }
      else {
        res.status(400).send('Invalid category.');
      }
    } catch (error) {
      // Handle error and send an error response to the client
      console.error(error);
      res.status(500).json({ error: 'Failed to submit data and image. Please try again.' });
    }
}
});
   app.get('/gym', async (req, res) => {
       try {
           const db = admin.firestore();
         const gymData = await db.collection('connections').where('Category', '==', 'gym').get();
           const gyms = gymData.docs.map(doc => doc.data());
         console.log(gyms);
           res.render('gym.ejs', { gyms: gyms });
       } catch (error) {
           console.error('Error retrieving gym data from Firestore:', error);
           res.status(500).send('Internal Server Error');
       }
   });
    app.get('/resturant', async (req, res) => {
        try {
            const db = admin.firestore();
            const restaurantData = await db.collection('connections').where('Category', '==', 'resturant').get();
            const restaurants = restaurantData.docs.map(doc => doc.data());
            res.render('resturant.ejs', { restaurants: restaurants });
        } catch (error) {
            console.error('Error retrieving restaurant data from Firestore:', error);
            res.status(500).send('Internal Server Error');
        }
    });

app.get('/hospital', async (req, res) => {
    try {
        const db = admin.firestore();
        const hospitalData = await db.collection('connections').where('Category', '==', 'hospital').get();
        const hospitals = hospitalData.docs.map(doc => doc.data());
        res.render('hospital.ejs', { hospitals: hospitals });
    } catch (error) {
        console.error('Error retrieving hospital data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/beauty', async (req, res) => {
    try {
        const db = admin.firestore();
        const beautyData = await db.collection('connections').where('Category', '==', 'beauty').get();
        const beauties = beautyData.docs.map(doc => doc.data());
        res.render('beauty.ejs', { beauties: beauties });
    } catch (error) {
        console.error('Error retrieving beauty data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/pet', async (req, res) => {
    try {
        const db = admin.firestore();
        const petData = await db.collection('connections').where('Category', '==', 'pet').get();
        const petshop = petData.docs.map(doc => doc.data());
        res.render('pet.ejs', { petshop: petshop });
    } catch (error) {
        console.error('Error retrieving pet data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/estate', async (req, res) => {
    try {
        const db = admin.firestore();
        const estateData = await db.collection('connections').where('Category', '==', 'estate').get();
        const estates = estateData.docs.map(doc => doc.data());
        res.render('estate.ejs', { estates: estates });
    } catch (error) {
        console.error('Error retrieving  estate data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/acservice', async (req, res) => {
    try {
        const db = admin.firestore();
        const acserviceData = await db.collection('connections').where('Category', '==', 'acservice').get();
        const acservices = acserviceData.docs.map(doc => doc.data());
        res.render('acservice.ejs', { acservices: acservices});
    } catch (error) {
        console.error('Error retrieving  acservice data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/carservice', async (req, res) => {
    try {
        const db = admin.firestore();
        const carserviceData = await db.collection('connections').where('Category', '==', 'carservice').get();
        const carservices = carserviceData.docs.map(doc => doc.data());
        res.render('carservice.ejs', { carservices: carservices});
    } catch (error) {
        console.error('Error retrieving  carservice data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/plumber', async (req, res) => {
    try {
        const db = admin.firestore();
        const plumberData = await db.collection('connections').where('Category', '==', 'plumber').get();
        const plumbers= plumberData.docs.map(doc => doc.data());
        res.render('plumber.ejs', { plumbers: plumbers});
    } catch (error) {
        console.error('Error retrieving  plumber data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/education', async (req, res) => {
    try {
        const db = admin.firestore();
        const educationData = await db.collection('connections').where('Category', '==', 'education').get();
        const educations= educationData.docs.map(doc => doc.data());
        res.render('education.ejs', { educations: educations});
    } catch (error) {
        console.error('Error retrieving  education data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/driving', async (req, res) => {
    try {
        const db = admin.firestore();
        const drivingData = await db.collection('connections').where('Category', '==', 'driving').get();
        const drivings= drivingData.docs.map(doc => doc.data());
        res.render('driving.ejs', { drivings: drivings});
    } catch (error) {
        console.error('Error retrieving driving data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/dentist', async (req, res) => {
    try {
        const db = admin.firestore();
        const dentistData = await db.collection('connections').where('Category', '==', 'dentist').get();
        const dentists= dentistData.docs.map(doc => doc.data());
        res.render('dentist.ejs', { dentists: dentists});
    } catch (error) {
        console.error('Error retrieving dentist data from Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/connectWithUs', (req, res) => {
  res.render(__dirname + '/views/connect.ejs');
});


// Endpoint to handle form submission


app.get('/home',(req,res)=>{
  res.render(__dirname + '/views/index.ejs');
});
app.get('/hospital',(req,res)=>{
  res.render(__dirname + '/views/hospital.ejs');
});
app.get('/gym',(req,res)=>{
  res.render(__dirname + '/views/gym.ejs');
});
app.get('/beauty',(req,res)=>{
  res.render(__dirname + '/views/beauty.ejs');
});
app.get('/pet',(req,res)=>{
  res.render(__dirname + '/views/pet.ejs');
});
app.get('/estate',(req,res)=>{
  res.render(__dirname + '/views/estate.ejs');
});
app.get('/acservice',(req,res)=>{
  res.render(__dirname + '/views/acservice.ejs');
});
app.get('/carservice',(req,res)=>{
  res.render(__dirname + '/views/carservice.ejs');
});
app.get('/plumber',(req,res)=>{
  res.render(__dirname + '/views/plumber.ejs');
});
app.get('/education',(req,res)=>{
  res.render(__dirname + '/views/education.ejs');
});
app.get('/driving',(req,res)=>{
  res.render(__dirname + '/views/driving.ejs');
});
app.get('/dentist',(req,res)=>{
  res.render(__dirname + '/views/dentist.ejs');
});
app.get('/contactUs',(req,res)=>{
  res.render(__dirname + '/views/contact.ejs');
});
// app.get('/resturant',(req,res)=>{
//   res.render(__dirname + '/views/resturant.ejs');
// });



app.get("/signup", function (req, res) {
  res.render(__dirname + '/views/signup.ejs', { mess: " ", pass: " ", loginerror: " ", mess1: " " });
});

app.post("/signupSubmit", async (req, res) => {
  const Fname = req.body.name;
  const em = req.body.email;
  const ps = req.body.password;
  const rps = req.body.repass;

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(ps, 10);

  db.collection("services")
    .where(
      Filter.or(
        Filter.where('Firstname', '==', Fname),
        Filter.where('Email', '==', em)
      )
    )
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        const messe = "hey this username or email is already exist try other one";
        res.render(__dirname + '/views/signup.ejs', { mess: " ", pass: " ", loginerror: " ", mess1: messe });
      }
      else {
        //checking if user entered all forms without leaving .

        if (Fname && em && ps && rps) {
          db.collection("services").add({
            Firstname: req.body.name,
            Email: req.body.email,
            Password: hashedPassword,
          }).then(() => {
            res.render(__dirname + '/views/login.ejs', { mess: " ", pass: " ", loginerror: " ", mess1: " " });
          })
        }

        //if user forget to enter any details sending them an error message

        else {
          const messe = "please fill all the forms";
          res.render(__dirname + '/views/signup.ejs', { mess: " ", pass: " ", loginerror: " ", mess1: messe });
        }
      }
    });
})

app.get('/', (req, res) => {
  res.render(__dirname + '/views/login.ejs', { mess: " ", pass: " ", loginerror: " ", mess1: " " });
});

app.post("/loginSubmit", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  // Check if email and password are defined and not empty
  if (!email && !password) {
    const errormess = "Please enter your email or number";
    const errorpass = "please enter your password";
    res.render(__dirname + '/views/login.ejs', { mess: errormess, pass: errorpass, loginerror: "", mess1: " " });
    return;
  }

  //check if only email is entered and password is not entered
  else if (email && !password) {
    const errorpass = "please enter your password";
    res.render(__dirname + '/views/login.ejs', { mess: "", pass: errorpass, loginerror: "" });
    return;
  }

  //check if only  password is entered and email is not entered 
  else if (!email && password) {
    const errormess = "please enter your email";
    res.render(__dirname + '/views/login.ejs', { mess: errormess, pass: "", loginerror: "" });
    return;
  }
  // check if both email and password are entered correctly .

  console.log("Attempting to login with Email:", email, "Password:", password);

  db.collection("services")
    .where("Email", "==", email)
    .get()
    .then(async (docs) => {
      if (docs.size > 0) {
        const userDoc = docs.docs[0]; 
        const userData = userDoc.data(); 
        const hashedPassword = userData.Password;

        // Comparing the input password with the hashed password
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          const firstName = userData.Firstname;
          res.cookie('username', firstName);
          // return res.render(__dirname + '/views/index.ejs');
          return res.redirect('/home');
        } else {
          const login = "Login failure, please enter details correctly";
          return res.render(__dirname + '/views/login.ejs', { loginerror: login, mess: "", pass: "" });
        }
      } else {
        const login = "Login failure, please enter details correctly";
        res.render(__dirname + '/views/login.ejs', { loginerror: login, mess: "", pass: "" });
      }
    })
    .catch((error) => {
      console.error("Error querying Firestore:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
  console.log(` listening on port ${port}`)
})