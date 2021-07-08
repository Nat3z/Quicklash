let playing = false
let submitted = false
let alreadyVoted = false;

setInterval(() => {
    $s().getJSON(`/gameStatus?q=${$s("#id").text}&u=${$s("#sessionID").text}`, (data) => {
        //
        if (data["success"]) {
            if (data["gameEnd"]) {
                $s("#qnap1").css("display", "none")
                $s("#qnap2").css("display", "none")
                $s("#thanks").css("display", "none")
                $s("#notewel").css("display", "none")
                $s(".podium").only(0).css("display", "block")
                if (data["placement"] == "first") {
                    $s("#placement").css("color", "#cfbe0a")
                    $s("#placement").setText("1st")
                    $s("#encourageMessage").setText("WINNER WINNER CHICKEN DINNER")
                } else if (data["placement"] == "second") {
                    $s("#placement").css("color", "#7d7d7d")
                    $s("#placement").setText("2nd")
                    $s("#encourageMessage").setText("Nice Job! First place is within reach!")
                } else if (data["placement"] == "third") {
                    $s("#placement").css("color", "#a14d03")
                    $s("#placement").setText("3rd")
                    $s("#encourageMessage").setText("Great Job! Second place is not impossible!")
                } else {
                    $s("#placement").css("color", "#730606")
                    $s("#placement").setText("LOST")
                    $s("#encourageMessage").setText("Don't give up!")
                }
                return
            }


            if (data["reset"]) {
                setTimeout(() => {
                    $s("#qnap1").css("display", "none")
                    $s("#qnap2").css("display", "none")
                    playing = true
                    $s("#thanks").css("display", "none")
                    $s("#submit").css("background-color", "rgba(7, 7, 7, 0.514)")
                    $s("#submit").css("cursor", "default")
                    submitted = false
    
                    console.log("switching to play mode..")
                    $s().getJSON(`/getQuestion?q=${$s("#id").text}&s=${$s("#sessionID").text}`, (data) => {
                        if (data["success"]) {
                            $s("#question").setText(data["question"])
                        } else {
                            $s("#question").setText("No question was given to you! You do not need to answer for this round!")
                             $s("#answer").css("display", "none")
                        }
                    })
                    $s("#questionA").css("display", "block")
                }, 3000);
            }


            if (data["score"] != "") {
                $s("#score").setText(data["score"])
            }
            if (data["kicked"]) {
                window.location.replace("/")
            } else {
                console.log("not kicked")
            }
            if (alreadyVoted && !data.hasOwnProperty("present")) {
                alreadyVoted = false
            }


            if (playing && data.hasOwnProperty("present") && data["present"] && !alreadyVoted) {
                alreadyVoted = true
                $s("#thanks").css("display", "none")
                $s("#questionA").css("display", "none")

                $s("#qnap1").css("display", "block")
                $s("#qnap2").css("display", "block")

                document.getElementById("qnap1").onclick = () => {
                    voteUser(data["presentUsers"][0])
                }
                document.getElementById("qnap2").onclick = () => {
                    voteUser(data["presentUsers"][1])
                }
            } 

            if (data["game"] && !playing) {
                playing = true
                $s("#notewel").del()
                console.log("switching to play mode..")
                $s().getJSON(`/getQuestion?q=${$s("#id").text}&s=${$s("#sessionID").text}`, (data) => {
                    if (data["success"]) {
                        $s("#question").setText(data["question"])
                    } else {
                        $s("#question").setText("No question was given to you! You do not need to answer for this round!")
                        $s("#answer").css("display", "none")
                    }
                })

                $s("#questionA").css("display", "block")

            }
        } else {
            console.log("Ping server success not succ")
        }
    })
}, 1000);
function leave() {
    $s().getJSON(`/kickUser?q=${$s("#id").text}&s=${$s("#sessionID").text}`, (data) => {
        if (data["success"]) {
            window.location.replace("/")
        }
    })
}

function voteUser(vote) {
    // among us
    $s("#qnap1").css("display", "none")
    $s("#qnap2").css("display", "none")
    $s("#thanks").css("display", "block")
    $s().getJSON(`/vote?q=${$s("#id").text}&s=${vote}`, (dat) => {})
}

function submitAnswer() {
    if (!playing) return;
    if (submitted) return;
    
    submitted = true
    const answer = $s("#answer").val

    $s().getJSON(`/submitAnswer?q=${$s("#id").text}&s=${$s("#sessionID").text}&a=${answer}`, (dat) => {
        if (dat["success"]) {
            $s("#submit").css("background-color", "rgba(181, 22, 11, 0.5)")
            $s("#submit").css("cursor", "no-drop")
        }
    })
}
