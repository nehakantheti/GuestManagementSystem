const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const path = require('path');

// Parse JSON bodies (for JSON payloads)
// app.use(express.json());

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse request bodies
app.use(bodyparser.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images)
app.use(express.static('public_new'));

const db = mysql.createConnection({
    host : 'localhost',
    user: 'user',
    password:'Password@123',
    database: 'GMS'
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('Connected to database!');
})

app.set('views', path.join(__dirname, '/public_new/views'));

// Define route for the login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public_new/home.html');
});

app.get('/login', (req, res) => {
    res.redirect('/login.html');
});

// app.get('/about', (req, res) => {
//     res.redirect('/about_page.html');
// });

// Define route to handle form submission
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    // Check if username and password match a user in the database

    // For demonstration purposes, assume authentication is successful
    const isAuthenticated = true;

    if (isAuthenticated) {
        // Redirect users based on their role
        if (role === 'admin') {
            const sql = 'SELECT * FROM ADMIN WHERE staff_id = ?';
            db.query(sql,[username],(err,result)=>{
                if(err){
                    throw err;
                }

                if(result.length === 0){
                    res.send('Invalid username or password');
                    return ;
                }

                const user = result[0];
                //Compare passwords
                if(req.body.password === user.password){
                    // console.log("Working successfully!");
                    res.redirect('/admin');
                }else{
                    res.send('Invalid username or password');
                }
            });
        } else if (role === 'student') {
            const sql = 'SELECT * FROM STUDENT WHERE roll_no = ?';
            db.query(sql,[username],(err,result)=>{
                if(err){
                    throw err;
                }

                if(result.length === 0){
                    res.send('Invalid username or password');
                    return ;
                }

                const user = result[0];
                //Compare passwords
                if(req.body.password === user.password){
                    res.redirect('/student');
                }else{
                    res.send('Invalid username or password');
                }
            });
        } else {
            // Handle unknown role
            res.status(400).send('Invalid role');
        }
    } else {
        // Authentication failed, render login page with error message
        res.status(401).send('Invalid credentials');
    }
});

// Define routes for admin and student pages
app.get('/admin', (req, res) => {
    res.send('Welcome, Admin!');
});

app.get('/student', (req, res) => {
    // res.send('Welcome, Student!');
    res.redirect('/student.html')
});

app.get('/book-room', (req, res) => {
    res.redirect('/guest.html')
});

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// app.get('/prev_receipts', (req, res) => {
//     res.render('/prev_receipts')
// });

var accepted = true;

app.post('/submit-guest-info',(req,res)=>{
    //Extract data from the request body
    // console.log('In the post request form')
    // console.log('Received form data : ',req.body);
    var {firstName,lastName,Aadhar,username,Relation,email,Phn_no,address,check_in,check_out,country,state } = req.body;

    const name = firstName + ' ' + lastName;
    // console.log(req.body.check_in);
    // console.log(req.body.check_out);
    const q1 = 'INSERT INTO GUEST (aadhar,roll_no,gname,relation,no_of_ppl,address,g_phno,check_in,check_out) VALUES (?,?,?,?,?,?,?,?,?);'
    const vals = [Aadhar,username,name,Relation,1,address,Phn_no,check_in,check_out];

    db.query(q1, vals, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error inserting guest info into the database' + err['sqlMessage']); // Send error response
        } else {
            console.log('Guest info successfully inserted into database GMS!');
            // res.status(200).send('Guest info submitted successfully!'); // Send success response
            res.redirect('/request.html');
        }
    });
});



// Route to render the prev_receipts page
app.get('/prev-receipts', (req, res) => {
    const sql = 'SELECT check_in, check_out, receipt FROM PREV_RECEIPTS';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('prev_receipts.ejs', { receipts: results });
    });
});

app.post('/book-hostel-room', (req, res) => {
    console.log('Inside post request of book-hostel-room')
    const room = req.body.room;
    console.log('Room booked:', room);
    // Handle room booking logic here
    // res.render('status', { room });
    res.sendFile(path.join(__dirname, 'public_new', 'payment.html'));
});

app.post('/payment', (req, res) => {
    const paymentDetails = req.body;
    console.log('Payment Details:', paymentDetails);
    res.render('details.ejs', { payment: paymentDetails });
});


// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
