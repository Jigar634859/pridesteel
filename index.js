import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import pg from "pg";
import nodemailer from 'nodemailer';
import { DateTime } from 'luxon';
import schedule from 'node-schedule';
import session from "express-session";
import pgSession from 'connect-pg-simple';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash from "connect-flash";
import date from 'date-and-time';
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.port;
const _dirname = dirname(fileURLToPath(import.meta.url));


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "pride",
  password: process.env.dbpass,
  port: process.env.portpg,
});
db.connect();
const pgSessionInstance = pgSession(session);

app.set("views", path.join(_dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(_dirname,"public")));

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});




app.use(session({
    store: new pgSessionInstance({
        pool: db,
        tableName: 'session', // Name of the table storing sessions in PostgreSQL
    }),
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        path:'/', // 1 hour in milliseconds
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
    }
}));


// Middleware to log session data for debugging
app.use((req, res, next) => {
  console.log('Session data middleware:', req.session);
  next();
});


// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        console.log("jigaru");
      return next();
    }
    console.log("User not authenticated. Redirecting to login.");
    res.redirect('/');
  }
  app.get('/main', ensureAuthenticated, (req, res) => {
    console.log('Session ID on main page:', req.sessionID);
    console.log('Session data:', req.session);
    res.render("main.ejs", {
      username: req.session.user.username
    });
  });
  
  app.get("/", (req, res) => {
    res.render("login.ejs");
  });
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
//
app.get("/", async (req, res) => {
    res.render("login.ejs");
  });
  app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    console.log(email);
    try{
    if(!email || !password)
        { 
            console.log("true") ; 
            res.set('Content-Type', 'text/plain'); 
            return res.send('email and password require');
        }
        console.log("true");
        const cquery=`
        select username,user_id from users
        where email=$1 and password=$2`;
        
            const {rows}=await db.query(cquery,[email,password]);
            if(rows.length==0)
                {
                    
                    res.set('Content-Type', 'text/plain');
                   return res.send('false');
                }
                else {
                    const user = rows[0];
                    // Store user information in the session
                    req.session.user = {
                      id: user.user_id,
                      username: user.username
                    };
                
                    return res.render("main.ejs",{
                        username:req.session.user.username
                    });
                  }
        }
        catch (error) {
            console.error('failed to login into home page', error);
            res.status(500).send('failed');
        }
});


app.post('/send-otp', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render("login.ejs");
    }

    const queryg = `SELECT username, password FROM users WHERE email=$1`;
    
    try {
        const { rows } = await db.query(queryg, [email]);
        if (rows.length !== 0) {
            res.set('context-type','plain-text');
             return res.send("email exist");
        }
    } catch (error) {
        console.error('Error checking existing email:', error);
        return res.status(500).send('Internal Server Error.');
    }

    const otp = generateOTP();

    const query = `
        INSERT INTO otp_storage (email, otp, username, password, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `;
    
    try {
        await db.query(query, [email, otp, username, password]);

        const mailOptions = {
            from: "jyanijigar20@gmail.com",
            to: email,
            subect: 'Verification Code',
            text: `Your OTP for verification is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        // Schedule a job to delete the OTP after 2 minutes
        schedule.scheduleJob(DateTime.local().plus({ minutes: 2 }).toJSDate(), async () => {
            const deleteQuery = `
                DELETE FROM otp_storage
                WHERE otp = $1 AND email = $2
            `;
            try {
                await db.query(deleteQuery, [otp, email]);
                console.log(`Expired OTP for email: ${email}`);
            } catch (error) {
                console.error('Failed to delete expired OTP:', error);
            }
        });
         res.render('otp.ejs');
    } catch (error) {
        console.error('Failed to send OTP via email or store in database:', error);
        res.status(500).send('Failed to send OTP via email or store in database.');
    }
});





app.post('/verify-otp', async (req, res) => {
    
    const {otp} = req.body;
    console.log(otp);

    if (!otp) {
        console.log("true");
        return res.send('OTP is required.');
    }
    console.log("true");
   try{ const selectQuery = `
        SELECT username, email, password, created_at
        FROM otp_storage
        WHERE otp = $1
        ORDER BY created_at DESC
        LIMIT 1
    `;
    console.log("true");
    
    
        const { rows } = await db.query(selectQuery, [otp]);
        console.log("true");
         
        if (rows.length === 0) {
            console.log("true");
            res.set('Content-Type', 'text/plain');
            return res.send('false');
        }
        console.log(true);

       

        

        const { username, email, password } = rows[0];
        console.log(username);
        const insertUserQuery = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
        `;
        await db.query(insertUserQuery, [username, email, password]);

        const deleteQuery = `
            DELETE FROM otp_storage
            WHERE otp = $1 AND email = $2
        `;
        await db.query(deleteQuery, [otp, email]);
        const query = `select user_id, username from users where email=$1`;
        
        const result = await db.query(query, [email]);
    
        // Check if any rows are returned
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        const user=result.rows[0];
        
        req.session.user = {
          
          
          user_id:user.user_id,
          username:user.username
          
        };
        
        console.log(req.session.user.username);
        res.render('main.ejs',{username:req.session.user.username});
    } catch (error) {
        console.error('Error verifying OTP or storing user info:', error);
        res.status(500).send('Failed to verify OTP or store user info.');
    }
});
app.post('/resend', async (req, res) =>{
    res.redirect('/send-otp');
});
// new thing about forgetting password*****
app.post('/forgetPass', async (req, res) => {
    const { email } = req.body;
    const querys = 'SELECT password FROM users WHERE email=$1';
    try {
      const { rows } = await db.query(querys, [email]);
      if (rows.length === 0) 
        {
        const msg="email not exist";
        return res.render("forgetpassword.ejs",
            {
            message:msg        
            }
          );
        }
      const password = rows[0].password;
      const mailOptions = {
        from: 'jyanijigar20@gmail.com',
        to: email,
        subject: 'Your password',
        text: `Your password is: ${password}`,
      };
      await transporter.sendMail(mailOptions);
      res.redirect('/');
    } catch (error) {
      console.error('Error retrieving password:', error);
      res.status(500).send('Internal Server Error.');
    }
  });
  //to get forgetpassword file
  app.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword.ejs');
});

// passport.use(new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//     async (email, password, done) => {
//       try {
//         const query = `SELECT user_id, username, email FROM users WHERE email=$1 AND password=$2`;
//         const { rows } = await db.query(query, [email, password]);
//         if (rows.length === 0) {
//           return done(null, false, { message: 'Incorrect email or password.' });
//         }
//         const user = rows[0];
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   ));
  
//   passport.serializeUser((user, done) => {
//     done(null, user.user_id);
//   });
  
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const query = `SELECT user_id, username, email FROM users WHERE user_id=$1`;
//       const { rows } = await db.query(query, [id]);
//       if (rows.length === 0) {
//         return done(null, false);
//       }
//       const user = rows[0];
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   });
//   app.get('/main', (req, res) => {
//     if (req.isAuthenticated()) {
//       res.render('main.ejs', {
//         username: req.user.username
//       });
//     } else {
//       res.redirect('/');
//     }
//   });
  
// // end of passport****  
app.get('/cart',async(req,res) => {
    const id=req.session.user.id;
    const query=`select email from users
    where user_id=$1`;
    const email= await db.query(query,[req.session.user.user_id]);
    res.render('cart.ejs',{ email:email.rows[0].email,
        user:req.session.user.username
    }
    );

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
