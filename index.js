import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import nodemailer from 'nodemailer';
import { DateTime } from 'luxon';
import schedule from 'node-schedule';
import date from 'date-and-time';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "pride",
  password: "jigar@2004",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "jyanijigar20@gmail.com",
        pass: "wcjm ooqa acil hgxo"
    }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

app.get("/", async (req, res) => {
    res.render("login.ejs");
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
            subject: 'Verification Code',
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
        select username from users
        where email=$1 and password=$2`;
        
            const {rows}=await db.query(cquery,[email,password]);
            if(rows.length==0)
                {
                    
                    res.set('Content-Type', 'text/plain');
                   return res.send('false');
                }
            else
            {
                
                return res.render("login.ejs");
            }
        }
        catch (error) {
            console.error('failed to login into home page', error);
            res.status(500).send('failed');
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
        res.set('Content-Type', 'text/plain');
        res.send("true");
    } catch (error) {
        console.error('Error verifying OTP or storing user info:', error);
        res.status(500).send('Failed to verify OTP or store user info.');
    }
});
app.post('/resend', async (req, res) =>{
    res.render('/send-otp');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
