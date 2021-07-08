const express = require("express")
const app = new express()
app.set('viewengine', 'ejs')
const fs = require("fs")
const questions = require("./questions.json")

app.get("/", (req, res) => {
    res.render(__dirname + "/html/home.ejs", { ip: "sex" })
})

app.get("/css", (req, res) => {
    res.type(".css")
    readfile("/code/scufflash.css", res)
})

app.get("/code/:c_name", (req, res) => {
    res.type(".js")
    readfile("/code/" + req.params.c_name, res)
})

app.get("/disablePresentation/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`);
    if (hostSessionID === undefined) return res.send(`{"success": false}`);


    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["host"] != hostSessionID)
                return res.send(`{"success": false}`);
            
            if (!json["game"])
                return res.send(`{"success": false}`);
            var dat = ""
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    dat += element
                    newData += `"${element}",`
                });
            
            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": true, "phrases": [`
            json["phrases"].forEach(element => {
                newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${element["pa1"]}", "pa2": "${element["pa2"]}"},`;
            })
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                return res.send(`{"success": true}`);
            });
        });
    
    } catch (ex) { 
        return res.send(`{"success": false}`);
    }
})

app.get("/startPresentation/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s
    const red = req.query.red
    const blue = req.query.blue

    if (host === undefined) return res.send(`{"success": false}`);
    if (hostSessionID === undefined) return res.send(`{"success": false}`);
    if (red === undefined) return res.send(`{"success": false}`);
    if (blue === undefined) return res.send(`{"success": false}`);


    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["host"] != hostSessionID)
                return res.send(`{"success": false}`);
            
            if (!json["game"])
                return res.send(`{"success": false}`);
            var dat = ""
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    dat += element
                    newData += `"${element}",`
                });
            
            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": true, "present": true, "presentUsers": ["${red}", "${blue}"], "phrases": [`
            json["phrases"].forEach(element => {
                newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${element["pa1"]}", "pa2": "${element["pa2"]}"},`;
            })
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err, dat) {
                if (err) return res.send(`{"success": false}`);
                console.log(newData)
                return res.send(`{"success": true}`);
            });
        });
    
    } catch (ex) { 
        return res.send(`{"success": false}`);
    }
})

app.get("/endGame/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s

    const winner = req.query.winner
    const second = req.query.second
    const third = req.query.third

    if (host === undefined) return res.send(`{"success": false}`)
    if (hostSessionID === undefined) return res.send(`{"success": false}`)
    if (winner === undefined) return res.send(`{"success": false}`)
    if (second === undefined) return res.send(`{"success": false}`)
    if (third === undefined) return res.send(`{"success": false}`)

    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["players"].length <= 0)
                return res.send(`{"success": false}`);

            if (json["host"] !== hostSessionID.replace(" ", ""))
                return res.send(`{"success": false}`);
            
            let dat = "";
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    dat += element
                    newData += `"${element}",`
                });

            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": true, "gameEnd": true, "placements": ["${winner}", "${second}", "${third}"] }`

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                res.send(`{"success": true}`)
            });
        });
    
    } catch (ex) { 
        res.send(`{"success": false}`)
    }
})

app.get("/resetRound/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`)
    if (hostSessionID === undefined) return res.send(`{"success": false}`)
    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["players"].length <= 0)
                return res.send(`{"success": false}`);

            if (json["host"] !== hostSessionID.replace(" ", ""))
                return res.send(`{"success": false}`);
            
            let dat = "";
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    dat += element
                    newData += `"${element}",`
                });

            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }
            if (json.hasOwnProperty("reset"))
                newData += `], "game": true, "present": false, "presentUsers": [], "phrases": [`
            else
                newData += `], "game": true, "present": false, "presentUsers": [], "reset": true, "phrases": [`
            
            let arraymatch = []
            var i = -1
            json["players"].forEach(element => {
                i++
                arraymatch[i] = element

                if (arraymatch.length == 2) {
                    const question = questions["questions"][getRandomArbitrary(0, questions.questions.length)]

                    newData += `{"p1": "${arraymatch[0]}", "p2": "${arraymatch[1]}", "question": "${question}", "pa1": "", "pa2": ""},`
                    // end
                    i = -1
                    arraymatch = []
                }
            })
            if (i == 0) {
                const question = questions["questions"][getRandomArbitrary(0, questions.questions.length)]
                newData += `{"p1": "${arraymatch[0]}", "p2": "bot", "question": "${question}", "pa1": "", "pa2": "no answer"},`
            }
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"
            console.log(newData)

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                res.send(`{"success": true}`)
            });
        });
    
    } catch (ex) { 
        res.send(`{"success": false}`)
    }
})

app.get("/vote/", (req, res) => {
    const host = req.query.q
    const user = req.query.s
    if (host === undefined) return res.send(`{"success": false}`);
    if (user === undefined) return res.send(`{"success": false}`);


    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (!json.hasOwnProperty("presentUsers"))
                return res.send(`{"success": false}`);

            if (!json["game"])
                return res.send(`{"success": false}`);
            var dat = ""
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    let newInt = parseInt(element.split(";:;")[2])
                    if (element.split(";:;")[1] == user) {
                        newInt += 1000
                    }
                    dat += element
                    newData += `"${element.split(";:;")[0]};:;${element.split(";:;")[1]};:;${newInt}",`
                });
            
            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }
            
            newData += `], "game": true, "present": true, "presentUsers": ["${json["presentUsers"][0]}", "${json["presentUsers"][1]}"], "phrases": [`
            json["phrases"].forEach(element => {
                newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${element["pa1"]}", "pa2": "${element["pa2"]}"},`;
            })
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                return res.send(`{"success": true}`);
            });
        });
    
    } catch (ex) { 
        return res.send(`{"success": false}`);
    }
})

app.get("/makeserver/", (req, res) => {
    res.type(".json")
    const serverid = getRandomArbitrary(10000, 99999)
    const hostID = getRandomArbitrary(10000000000000, 99999999999999)

    try {
        fs.appendFile(`${__dirname}/servers/${serverid}.json`, `{"serverID": "${serverid}", "host": "${hostID}", "players": [], "game": false}`, function (err) {
            if (err) throw err;
            res.send(`{"success": true, "gameID": "${serverid}", "host": "${hostID}" }`)
        }); 
    } catch (ex) {
        res.send(`{"success": false}`)
    }

})

app.get("/host/", (req, res) => {
    const host = req.query.q
    const session = req.query.s

    if (host == undefined) return res.redirect(`/`)
    if (session == undefined) return res.redirect(`/`)

    res.render(__dirname + "/html/hostclient.ejs", { gameID: host, ses: session, address: "glitch.com" })

})

app.get("/playing/", (req, res) => {
    const host = req.query.q
    const username = req.query.u

    console.log(host + " | " + username)
    if (host === undefined) return res.redirect("/")
    if (username === undefined) return res.redirect("/")

    res.render(`${__dirname}/html/playing.ejs`, { id: host, uName: username })

})

app.get("/serverData/", (req, res) => {
    res.type(".json")

    const host = req.query.q
    const sID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`)
    if (sID === undefined) return res.send(`{"success": false}`)

    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);
    
    fs.readFile(__dirname + `/servers/${host}.json`, 'utf8', function (err, dat) {
        if (err) return res.send(`{"success": false}`);
        const parsedJSON = JSON.parse(dat)
        if (parsedJSON == undefined) res.send(`{"success": false}`)
        if (parsedJSON["host"] === sID) {
            return res.send(dat)
        } else {
            return res.send(`{"success": false}`);
        }
    });
    
})

app.get("/play/:q/:u", (req, res) => {
    const sessID = getRandomArbitrary(10000000000000, 99999999999999)
    res.type(".json")

    const host = req.params.q
    const username = req.params.u
    if (host === undefined) return res.send(`{"success": false}`)
    if (username === undefined) return res.send(`{"success": false}`)

    if (contains(username, ";:;")) return res.send(`{"success": false}`);

    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);
    
    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["game"]) return res.send(`{"success": false}`);
            
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
            json["players"].forEach(element => {
                newData += `"${element}",`
            });
            newData += `"${username};:;${sessID};:;0"], "game": ${json["game"]}}`

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                console.log(err)
                if (err) throw res.send(`{"success": false}`);
                res.send(`{"success": true, "id": "${sessID}"}`)
            });
        });

    } catch (ex) { 
        res.send(`{"success": false}`)
    }
})

app.get("/startGame/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`)
    if (hostSessionID === undefined) return res.send(`{"success": false}`)
    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["players"].length <= 0)
                return res.send(`{"success": false}`);

            if (json["host"] !== hostSessionID.replace(" ", ""))
                return res.send(`{"success": false}`);
            
            let dat = "";
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    dat += element
                    newData += `"${element}",`
                });

            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": true, "present": false, "presentUsers": [], "phrases": [`
            let arraymatch = []
            var i = -1
            json["players"].forEach(element => {
                i++
                arraymatch[i] = element

                if (arraymatch.length == 2) {
                    const question = questions["questions"][getRandomArbitrary(0, questions.questions.length)]

                    newData += `{"p1": "${arraymatch[0]}", "p2": "${arraymatch[1]}", "question": "${question}", "pa1": "", "pa2": ""},`
                    // end
                    i = -1
                    arraymatch = []
                }
            })
            if (i == 0) {
                const question = questions["questions"][getRandomArbitrary(0, questions.questions.length)]
                newData += `{"p1": "${arraymatch[0]}", "p2": "bot", "question": "${question}", "pa1": "", "pa2": "no answer"},`
            }
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"
            console.log(newData)

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                res.send(`{"success": true}`)
            });
        });
    
    } catch (ex) { 
        res.send(`{"success": false}`)
    }
})

app.get("/gameStatus/", (req, res) => {
    res.type(".json")
    const host = req.query.q
    const userSessionID = req.query.u

    if (host === undefined) return res.send(`{"success": false}`)
    if (userSessionID === undefined) return res.send(`{"success": false}`)
    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            let pData = ""
            let score = ""
            json["players"].forEach(element => {
                if (element.split(";:;")[1] == userSessionID) {
                    score = element.split(";:;")[2]
                }
                pData += element.split(";:;")[1]
            })
            var gson = (`{"success": true, "kicked": ${!contains(pData, userSessionID)}, "score": "${score}", "reset": ${json.hasOwnProperty("reset")}, "game": ${json["game"]}`)
            
            if (json.hasOwnProperty("present")) {
                gson += `, "present": ${json["present"]}`;
                if (json.hasOwnProperty("presentUsers")) {
                    gson += `, "presentUsers": ["${json["presentUsers"][0]}", "${json["presentUsers"][1]}"]`
                }
            }

            if (json.hasOwnProperty("gameEnd")) {
                gson += `, "gameEnd": ${json.hasOwnProperty("gameEnd")}`
                if (json.hasOwnProperty("placements")) {
                    if (contains(json["placements"][0], userSessionID)) {
                        gson += `, "placement": "first"`;
                    } else if (contains(json["placements"][1], userSessionID)) {
                        gson += `, "placement": "second"`
                    } else if (contains(json["placements"][2], userSessionID)) {
                        gson += `, "placement": "third"`
                    } else {
                        gson += `, "placement": "none"`
                    }
                }
            }
                

            gson += "}"
            return res.send(gson)

        });
    
    } catch (ex) { 
        res.send(`{"success": false}`)
    }
}) 

app.get("/submitAnswer/", (req, res) => {
    const host = req.query.q
    const hostSessionID = req.query.s
    const answer = req.query.a

    if (host === undefined) return res.send(`{"success": false}`);
    if (hostSessionID === undefined) return res.send(`{"success": false}`);
    if (answer === undefined) return res.send(`{"success": false}`);


    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (!json["game"])
                return res.send(`{"success": false}`);
            
            let verified = false
            let dat = "";
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    if (element.split(";:;")[1] == hostSessionID.replace(" ", "")) {
                        verified = true
                    }
                    dat += element
                    newData += `"${element}",`
                });
            if (!verified)
                return res.send(`{"success": false}`);
            
            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": true, "present": false, "phrases": [`
            json["phrases"].forEach(element => {
                if (element["p1"].split(";:;")[1] === hostSessionID)
                    newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${answer}", "pa2": "${element["pa2"]}"},`;
                else if (element["p2"].split(";:;")[1] === hostSessionID)
                    newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${element["pa1"]}", "pa2": "${answer}"},`;

                else
                    newData += `{"p1": "${element["p1"]}", "p2": "${element["p2"]}", "question": "${element["question"]}", "pa1": "${element["pa1"]}", "pa2": "${element["pa2"]}"},`;
            })
            var pos = newData.lastIndexOf(',');
            newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            newData += "]}"

            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) return res.send(`{"success": false}`);
                return res.send(`{"success": true}`);
            });
        });
    
    } catch (ex) { 
        return res.send(`{"success": false}`);
    }
})

app.get("/kickUser/", (req, res) => {
    const host = req.query.q
    const userSessionID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`)
    if (userSessionID === undefined) return res.send(`{"success": false}`)
    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);

    try {
        fs.readFile(__dirname + `/servers/${host}.json`, function(err, data) {
            if (err) { console.log(err); return res.send(`{"success": false}`)};
            var json = JSON.parse(data)
            if (json["game"])
                return res.send(`{"success": false}`);

            let dat = "";
            var newData = `{"serverID": "${json["serverID"]}", "host": "${json["host"]}", "players": [`
                json["players"].forEach(element => {
                    if (element.split(";:;")[1] !== userSessionID.replace(" ", "")) {
                        dat += element
                        newData += `"${element}",`
                    }
            });
            if (dat !== "") {
                var pos = newData.lastIndexOf(',');
                newData = newData.substring(0,pos) + "" + newData.substring(pos+1)
            }

            newData += `], "game": ${json["game"]}}`
    
            fs.writeFile(__dirname + `/servers/${host}.json`, newData, function (err) {
                if (err) throw res.send(`{"success": false}`);
                res.send(`{"success": true}`)
            });
        });
    
    } catch (ex) { 
        res.send(`{"success": false}`)
    }

    
})

app.get("/getQuestion/", (req, res) => {
    res.type(".json")

    const host = req.query.q
    const uID = req.query.s

    if (host === undefined) return res.send(`{"success": false}`)
    if (uID === undefined) return res.send(`{"success": false}`)

    if (!fs.existsSync(__dirname + `/servers/${host}.json`))
        return res.send(`{"success": false}`);
    fs.readFile(__dirname + `/servers/${host}.json`, 'utf8', function (err, dat) {
        if (err) return res.send(`{"success": false}`);
        const parsedJSON = JSON.parse(dat)
        let succ = false
        if (!parsedJSON.hasOwnProperty("phrases")) return res.send(`{"success": false}`)
        parsedJSON["phrases"].forEach(element => {
            if (element["p1"].split(";:;")[1] == uID || element["p2"].split(";:;")[1] == uID) {
                succ = true;
                return res.send(`{ "success": true, "question": "${element["question"]}" }`);
            }
        })
        if (!succ)
            return res.send(`{"success": false}`);
    });

})

app.listen(1090, () => {
    console.log("QuickLash is ready! Create a lobby to start!")
})

function readfile(dir, res) {
    fs.readFile(__dirname + dir, 'utf8', function (err, data) {
        if (err) return undefined;
        
        if (res !== undefined) {
            res.send(data)
        }
    });
}

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function contains(ob, string) {
    active = true;
    if (ob.indexOf(string) >= 0) {
        active = false;
        return true;
    }
    active = false;
    return false;
}