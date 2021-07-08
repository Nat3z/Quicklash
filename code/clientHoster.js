var gaming = false
let secs = 120
let round = 1
let questionaire = []
let currentScoreforQuestions = []
setInterval(() => {
    $s().getJSON(`/serverData?q=${$s("#gameid").text}&s=${$s("#session").text}`, (data) => {
        
        $s("#players").setHTML("")

        let users = 0;
        let usersReady = 0

        data["players"].forEach(element => {
            users++;
            if (!gaming) {
                $s("#players").add(`
                <div style="width: 100%; height: 50px; position: relative; float: left; background-color: rgba(46, 46, 46, 0.5);" id="${element.split(";:;")[1]}" class="kick">
                    <p style="top: 15px; left: 10px; position: relative;">${element.split(";:;")[0]}</p>
                    <p style="top: -1px; left: -12px; position: relative; float: right; font-weight: 100; color: red;" onclick='kickUser("${element.split(";:;")[1]}")'>kick</p>
                </div>
                `)
            } else if (secs > 0) {
                let ready = false;
                data["phrases"].forEach(elem => {
                    if (ready) return;

                    if (elem["p1"].split(";:;")[1] == element.split(";:;")[1] && elem["pa1"] != "") {
                        usersReady++;
                        ready = true
                        $s("#players").add(`
                        <div style="width: 100%; height: 50px; position: relative; float: left; background-color: rgba(46, 46, 46, 0.5);" id="${element.split(";:;")[1]}" class="kick">
                            <p style="top: 15px; left: 10px; position: relative;">${element.split(";:;")[0]}</p>
                            <p style="top: -1px; left: -12px; position: relative; float: right; font-weight: 100; color: green;">Ready</p>
                        </div>
                        `)
                    } else if (elem["p2"] != "bot" && elem["p2"].split(";:;")[1] == element.split(";:;")[1] && elem["pa2"] != "" && elem["pa2"] != "no answer") {
                        usersReady++;
                        ready = true
                        $s("#players").add(`
                        <div style="width: 100%; height: 50px; position: relative; float: left; background-color: rgba(46, 46, 46, 0.5);" id="${element.split(";:;")[1]}" class="kick">
                            <p style="top: 15px; left: 10px; position: relative;">${element.split(";:;")[0]}</p>
                            <p style="top: -1px; left: -12px; position: relative; float: right; font-weight: 100; color: green;">Ready</p>
                        </div>
                        `)
                    }
                    
                })

                if (!ready) {
                    $s("#players").add(`
                    <div style="width: 100%; height: 50px; position: relative; float: left; background-color: rgba(46, 46, 46, 0.5);" id="${element.split(";:;")[1]}" class="kick">
                        <p style="top: 15px; left: 10px; position: relative;">${element.split(";:;")[0]}</p>
                        <p style="top: -1px; left: -12px; position: relative; float: right; font-weight: 100; color: red;">Not Ready</p>
                    </div>
                    `)
                }
            }
        });
        console.log(users + " users")
        console.log(usersReady + " users ready")
        if (users != 0 && usersReady == users) {
            console.log("Users ready!")
            secs = 1
        }
    })
}, 1000);

let loopEnd = false
let slide = -1
let slidshowTime = 15
setInterval(() => {
    if (gaming) {
        secs -= 1
        $s("#timeElapsed").setText(secs + "s")

        if (secs == 0) {
            slideShow()
        }
    }

    if (secs < 0 && slidshowTime > 0) {
        slidshowTime -= 1;
        $s("#questionElapsed").setText(slidshowTime + "s")

        if (slidshowTime == 0) {
            $s("#qnap1").setHTML(`
                ${$s("#qnap1").text}<br><br>
                <p style="color: yellow; font-size: 23px;">${questionaire[0].split(";:;")[0]}</p>
            `)
            $s("#qnap2").setHTML(`
                ${$s("#qnap2").text}<br><br>
                <p style="color: yellow; font-size: 23px;">${questionaire[1].split(";:;")[0]}</p>
            `)
            
            $s().getJSON(`/serverData?q=${$s("#gameid").text}&s=${$s("#session").text}`, (dat) => {
                let firstScore = 0
                let secondScore = 0

                dat["players"].forEach(element => {
                    if (element.startsWith(questionaire[0])) {
                        console.log(element.split(";:;")[2] + " | points saved: | " + currentScoreforQuestions[0])
                        firstScore = (parseInt(element.split(";:;")[2]) - currentScoreforQuestions[0]) / 1000
                    } else if (element.startsWith(questionaire[1])) {
                        console.log(element.split(";:;")[2] + " | points saved: | " + currentScoreforQuestions[1])
                        secondScore = (parseInt(element.split(";:;")[2]) - currentScoreforQuestions[1]) / 1000
                    }
                })
                setTimeout(() => {
                    $s("#qnap1").add(`
                        <p style="font-size: 18px; color: cadetblue;">${firstScore} Votes</p>
                    `)
                    $s("#qnap2").add(`
                        <p style="font-size: 18px; color: cadetblue;">${secondScore} Votes</p>
                    `)
                    setTimeout(() => {
                        if (firstScore > secondScore) {
                            $s("#qnap1").add(`
                                <p style="font-size: 18px; color: green;">WINNER</p>
                            `)
                        } else if (firstScore < secondScore) {
                            $s("#qnap2").add(`
                                <p style="font-size: 18px; color: green;">WINNER</p>
                            `)
                        } else {
                            $s("#qnap1").add(`
                                <p style="font-size: 18px; color: gray;">TIED</p>
                            `)
                            $s("#qnap2").add(`
                                <p style="font-size: 18px; color: gray;">TIED</p>
                            `)
                        }
                    }, 800)
                }, 1300);

            })

            $s().getJSON(`/disablePresentation?q=${$s("#gameid").text}&s=${$s("#session").text}`, (dat) => {
                if (round == 3) {
                    let placementList = ["1st;:;null;:;0", "2nd;:;null;:;0", "3rd;:;null;:;0"]
                    $s().getJSON(`/serverData?q=${$s("#gameid").text}&s=${$s("#session").text}`, (d) => {
                        d["players"].forEach(element => {
                            const score = parseInt(element.split(";:;")[2]);
                            if (parseInt(placementList[0].split(";:;")[2]) < score) {
                                placementList[0] = element
                            } else if (parseInt(placementList[1].split(";:;")[2]) < score) {
                                placementList[1] = element
                            } else if (parseInt(placementList[2].split(";:;")[2]) < score) {
                                placementList[2] = element
                            }
                        })
                        
                        console.log(placementList)
                        console.log(placementList[0])
                        $s().getJSON(`/endGame?q=${$s("#gameid").text}&s=${$s("#session").text}&winner=${placementList[0]}&second=${placementList[1]}&third=${placementList[2]}`, (res) => {
                            if (res["success"]) {
                                $s("#winner").setText(placementList[0].split(";:;")[0])
                                $s("#second").setText(placementList[1].split(";:;")[0])
                                $s("#third").setText(placementList[2].split(";:;")[0])
                                $s(".slides").forEach((el) => {
                                    el.style.display = "none"
                                })
    
                                $s(".podium").only(0).css("display", "block")
                            }
                        })
                    })
                    return;
                }
                if (dat["success"]) {
                    console.log("disabled Presentation")
                    setTimeout(() => {
                        slidshowTime = 15
                        $s().getJSON(`/serverData?q=${$s("#gameid").text}&s=${$s("#session").text}`, (da) => {
                            console.log((da["phrases"].length - 1) + " | " + (slide + 1))
                            if (da["phrases"].length - 1 < (slide + 1)) {
                                slide = -1
                                secs = 160
                                $s().getJSON(`/resetRound?q=${$s("#gameid").text}&s=${$s("#session").text}`, (d) => {})
                                setTimeout(() => {
                                    round++;
                                    startGame()
                                }, 2800);
                            } else {
                                slideShow()
                            }
                        })
                    }, 3500);
                }
            })
        }
    }
}, 1000);


function slideShow() {
    slide += 1

    $s("#players").css("display", "none")
    $s("#qnaw").css("display", "none")
    $s("#timeElapsed").css("display", "block")
    $s().getJSON(`/serverData?q=${$s("#gameid").text}&s=${$s("#session").text}`, (data) => {
        const gson = data["phrases"][slide]
        console.log(gson)
        if (gson === undefined) return false;
        questionaire[0] = gson["p1"].split(";:;")[0] + ";:;" + gson["p1"].split(";:;")[1]
        questionaire[1] = gson["p2"].split(";:;")[0] + ";:;" + gson["p2"].split(";:;")[1]

        currentScoreforQuestions[0] = parseInt(gson["p1"].split(";:;")[2])

        if (gson["p2"].split(";:;")[2] != undefined)
            currentScoreforQuestions[1] = parseInt(gson["p2"].split(";:;")[2])
        else
            currentScoreforQuestions[1] = 0
        
        console.log(gson)
        $s().getJSON(`/startPresentation?q=${$s("#gameid").text}&s=${$s("#session").text}&red=${gson["p1"].split(";:;")[1]}&blue=${gson["p2"].split(";:;")[1]}`, (data) => {
            if (data["success"]) {
                console.log("presentation started")
            }
        })

        $s("#qnae").setText(gson["question"])

        if (gson["pa1"] != "") {
            $s("#qnap1").setHTML(gson["pa1"])
        } else {
            $s("#qnap1").setHTML("No answer provided.")
        }

        if (gson["pa2"] != "") {
            $s("#qnap2").setHTML(gson["pa2"])
        } else {
            $s("#qnap2").setHTML("No answer provided.")
        }

        return true
    })
    $s(".slides").forEach((ele) => {
        ele.style.display = "block"
    })
}

function kickUser(user) {
    console.log(`/kickUser?q=${$s("#gameid").text}&s=${user}`)
    $s().getJSON(`/kickUser?q=${$s("#gameid").text}&s=${user}`, (data) => {
        if (data["success"]) {
            $s(`#${user}`).del()
        } else {
            console.log(data["success"])
        }
    })
}

function startGame() {
    $s("#players").css("display", "block")
    $s("#players").css("display", "block")
    $s("#qnaw").css("display", "block")
    $s("#timeElapsed").css("display", "block")
    $s("#questionElapsed").css("display", "block")

    $s(".slides").forEach((ele) => {
        ele.style.display = "none"
    })

    $s().getJSON(`/startGame?q=${$s("#gameid").text}&s=${$s("#session").text}`, (data) => {
        if (data["success"]) {
            gaming = true
            $s("#content-desc").css("display", "none")
            $s("#startgame").css("display", "none")
            $s("#gamepin").css("display", "none")

            $s("#players").css("top", "10%")
            $s("#players").css("left", "20%")
            $s("#qnaw").css("display", "block")
            for (var i = 0; i < document.getElementsByClassName("kick").length; i++) {
                document.getElementsByClassName("kick")[i].remove()
            }
        }
    })
}