function hostServer() {
    $s("#loading-screen").css("display", "block")

    $s().getJSON("/makeserver/", (data) => {
        if (data["success"]) {
            console.log("Server Made! Game ID = " + data["gameID"])
            window.location.replace("/host/?q=" + data["gameID"] + "&s=" + data["host"])
        } else {
            $s("#loading-screen").css("background-color", "rgba(255, 0, 0, 0.5)")
            hostServer()
        }
    })
}

function play() {
    $s("#loading-screen").css("display", "block")
    const id = $s("#gmid").val
    const username = $s("#name").val
    console.log(id + " " + username)
    if (id === "") {
        $s("#loading-screen").css("display", "none");
        $s("#notif").setHTML(`<p style="top: 30%; position: relative;">Invalid ID!</p>`);
        $s("#notif").css("background-color", "rgb(237, 14, 14)")
        $s("#notif").css("border", "3px rgb(207, 19, 19) solid")
        $s("#notif").css("color", "white")
        return; 
    } 
    if (username === "") {
        $s("#loading-screen").css("display", "none");
        $s("#notif").setHTML(`<p style="top: 30%; position: relative;">Invalid Username!</p>`);
        $s("#notif").css("background-color", "rgb(237, 14, 14)")
        $s("#notif").css("border", "3px rgb(207, 19, 19) solid")
        $s("#notif").css("color", "white")
        return;
    } 
    $s().getJSON(`/play/${id}/${username}/`, (data) => {
        console.log(data)
        if (data["success"]) {
            window.location.replace(`/playing?q=${id}&u=${data["id"]}`)
        } else {
            $s("#loading-screen").css("display", "none");
            $s("#notif").setHTML(`<p style="top: 30%; position: relative;">Invalid ID or name contains invalid characters!</p>`);
            $s("#notif").css("background-color", "rgb(237, 14, 14)")
            $s("#notif").css("border", "3px rgb(207, 19, 19) solid")
            $s("#notif").css("color", "white")
        }
    })
}