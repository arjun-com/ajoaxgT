const express = require("express")
const db = require(__dirname + "/db.js")

const md5 = require("md5")
const bodyParser = require("body-parser")

const urlencodedParser = bodyParser.urlencoded({ extended: false })

function lowerCase(str) {
    var result = ""
    for(var i = 0; i < str.length; i++) {
        result = result + (str[i]).toLowerCase()
    }
    return result
}

function hex(str) {
	var arr = []
	for (var n = 0, len = str.length; n < len; n++) {
		var hex = Number(str.charCodeAt(n)).toString(16)
		arr.push(hex)
	}
	return arr.join('')
}

function unhex(str) {
    var hex = str
    var result = '';
    for (var n = 0; n < hex.length; n += 2) {
        result += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return result;
}

function date_time() {
    var currentdate = new Date(); 
    var datetime = "" + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1)  + "/" 
    + currentdate.getFullYear()
    
    return(datetime)
}

var app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

app.post("/signup", urlencodedParser, (req, res) => {
    try {
        var username = req.body.realname
        var password = req.body.password
        var grade = req.body.grade
        var section = lowerCase((req.body.section).toString())
        var studid = lowerCase((req.body.studid).toString())

        if((req.body.realname).length < 4) { res.send('<script>alert("Username MUST have more than 4 letters."); window.location.href = "/signup";</script>') }
        else if((username).length > 32) { res.send('<script>alert("Username CANNOT have more than 32 letters."); window.location.href = "/signup";</script>') }
        else if((password).length < 4) { res.send('<script>alert("Password Must have more than 4 letters."); window.location.href = "/signup";</script>') }
        else if((grade).length != 2 && !isNaN(req.body.grade)) { res.send('<script>alert("Grade must have 2 characters\nFor example if you\'re in the ninth grade then type 09\nIf you\'re in the tenth grade type 10"); window.location.href = "/signup";</script>') }
        else if((studid).length != 10) { res.send('<script>alert("You\'re student ID is given on you\'re ID card.\nEnter all the characters as given on it.\nFor example i10be120399 "); window.location.href = "/signup";</script>') }
        else if((section) != "a" && (section) != "b" && (section) != "c") { res.send('<script>alert("Enter you\'re section a, b or c"); window.location.href = "/signup";</script>') }
        else {
            var username = hex(username)
            var password = hex(md5(password))
            var grade = hex(grade)
            var section = hex(section)
            var studid = hex(studid)

            var username_check = `select usrnm from users where usrnm = "${ username }"`
            db.query(username_check, (err, resp) => {
                if(resp.length != 0) res.send('<script>alert("An account has aldready been registered with this name."); window.location.href = "/signup";</script>')
                else {
                    var studid_check = `select studid from users where studid = "${ studid }"`
                    db.query(studid_check, (err, resp)=> {
                        if(resp.length != 0) res.send('<script>alert("An account has aldready been registered with this Student ID."); window.location.href = "/signup";</script>')
                        else {
                            var insert_user = `insert into users(usrnm, pswd, dt, grade, studid, sec) values("${ username }", "${ password }", "${ hex(date_time()) }", "${grade}", "${studid}", "${section}");`
                            db.query(insert_user, (err, res) => { if(err) console.log(err) })
                            res.send('<script>alert("Signed up"); window.location.href = "/";</script>')
                            console.info("New user signed up : " + req.body.realname)
                        }
                    })
                }
            })
        }     
    }

    catch(err) {
        console.log(err)
    }
})

app.post("/", urlencodedParser, (req, res) => {
    try {
        var username = hex((req.body.username))
        var password = hex(md5(req.body.password))
        if((req.body.username).length < 4 || (req.body.username).length < 4 ) {
            res.send('<script>alert("Incorrect username or password."); window.location.href = "/";</script>')
        }
        else {
            var user_check = `select usrnm from users where usrnm = "${ username }" and pswd = "${ password }"`
            db.query(user_check, (err, resp) => {
                if(resp.length != 0) {
                    var get_details = `select * from users where usrnm = "${ username }" and pswd = "${ password }";`
                    db.query(get_details, (err, details) => {
                        res.render("home.ejs", {
                            "username" : unhex(details[0].usrnm),
                            "created_time" : unhex(details[0].dt),
                            "studid" : unhex(details[0].studid),
                            "class" : `${unhex(details[0].grade)}${unhex(details[0].sec)}`
                        })
                    })
                }
                else res.send('<script>alert("Incorrect username or password"); window.location.href = "/";</script>')
            })
        }
    }

    catch(err) {
        console.log(err)
    }
})

// app.post("/addmsg", urlencodedParser, (req, res) => {
//     try {
//         var username = req.body.username
//         var password = req.body.password

//     }

//     catch(err) {
//         console.log(err)
//     }
// }) 


app.listen(80, () => { console.info("flListening on port 80 HTTP") })

