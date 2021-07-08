let active = false;
let init = false;

/**
* The Main EntryPoint for jSync 
* @param Hashtag Add '#' at the beginning of the text to label it as an id
* @param Period Add '.' at the beginning of the text to label it as a class
* @param Document Use 'document' to label the entire body
* @param Tags Use HTML Tags ex. h1, h2, h3, b, for all tags in the Body 
*/
function $s(obj) {
    
    if (obj === this) {
        return;
    }

    if (obj === undefined) {
        return new noargs();
    } else if (obj == document) {
        return new body();
    } else if (obj.charAt(0) == "#") {
        let o = obj;
        o = o.replace("#", "");
        return new idbased(o);
    } else if (obj.charAt(0) == ".") {
        let o = obj;
        o = o.replace(".", "");
        return new classbased(o);
    } else {
        return new tagbased(obj);
    }

}

class $event {
    static active(funct) {
        if (!active) {
            funct();
        }
    }
    static ready(funct) {
        if (init) {
            funct();
        }
    }
    static docReady(funct) {
        document.addEventListener("DOMContentLoaded", function () {
            funct()
        })
    }
    /**
     * Event Onclick
     * @param  function 
     */
    static click(funct) {
        active = true;
        document.addEventListener("onclick", function () {
            funct();
        });
        active = false;
    }
}

class tagbased {
   obj;
    constructor(object) {
       this.obj = object;
    }
    /**
     * Deletes The Given Object : Tags, IDs
     */
    del() {
       active = true;
       var element = document.getElementsByTagName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.removeChild(element[index]);
       }
       active = false;
    }
    hide() {
       active = true;
       var element = document.getElementsByTagName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.style.visibility = "hidden";
           element[index].parentNode.removeChild(element[index]);
       }
       active = false;
    }

    css(style, newval) {
       active = true;
       var element = document.getElementsByTagName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.style.setProperty(style, newval)
       }
       active = false;
    }

    forEach(funct) {
       active = true;
       var element = document.getElementsByTagName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           funct(element[index]);
       }
       active = false;
    }

    only(numb) {
        return new only(this.obj, numb);
    }

}

class classbased {
   obj;
    constructor(object) {
       this.obj = object;
    }
    /**
     * Deletes The Given Object : Tags, IDs
     */
    del() {
       active = true;
       var element = document.getElementsByClassName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.removeChild(element[index]);
       }
       active = false;
    }
    hide() {
       active = true;
       var element = document.getElementsByClassName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.style.visibility = "hidden";
           element[index].parentNode.removeChild(element[index]);
        }
       active = false;
    }

    css(style, newval) {
       active = true;
       var element = document.getElementsByClassName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           element[index].parentNode.style.setProperty(style, newval)
       }
       active = false;
    }

    forEach(funct) {
       active = true;
       var element = document.getElementsByClassName(this.obj), index;

       for (index = element.length - 1; index >= 0; index--) {
           funct(element[index]);
       }
       active = false;
    }

    only(numb) {
        return new onlyClass(this.obj, numb);
    }

}
   
class only {
   obj;
   numb;
   val;
   object;
   text;
    constructor(object, numb) {
       this.obj = object;
       this.numb = numb
        /**
        * Returns The Value of Text if the Tag Provided is an input : Tags
        */
        this.val = (document.getElementsByTagName(this.obj)[this.numb]).value;
        this.object = document.getElementsByTagName(this.obj)[this.numb];
        this.text = document.getElementsByTagName(this.obj)[this.numb].textContent
    }
    /**
     * Deletes The Given Object : Tags, IDs
     */
    del() {
        document.getElementsByTagName(this.obj)[this.numb].remove();
    }
    /**
    * Adds content to the Body : Body 
    * @param HTML
    */
    add(HTML) {
        document.getElementsByTagName(this.obj)[this.numb].innerHTML += HTML;
    }
    /**
    * Resets The Value of Object (Only For Inputs) : IDs
    */
    clear() {
        (document.getElementsByTagName(this.obj)[this.numb]).value = null;
    }
    /**
    * Sets the text of the given ID : IDs
    * @param text 
    */
    setText(text) {
        document.getElementsByTagName(this.obj)[this.numb].textContent = text;
    }
    /**
    * Sets the HTML of the given ID : IDs
    * @param HTML 
    */
    setHTML(text) {
        document.getElementsByTagName(this.obj)[this.numb].innerHTML = text;
    }
    /**
    * Hides the Current Object
    */
    hide() {
        document.getElementsByTagName(this.obj)[this.numb].style.visibility = "hidden";
    }
    /**
    * Shows the Current Object
    */
    show() {
        document.getElementsByTagName(this.obj)[this.numb].style.visibility = "visible";
    }
   
    link(url) {
        active = true;
        document.getElementsByTagName(this.obj)[this.numb].addEventListener("onclick", function() {
            window.location = url;
        });
        document.getElementsByTagName(this.obj)[this.numb].style.cursor = "pointer";
        active = false;
    }
   
    do(func) {
        active = true;
        func(document.getElementsByTagName(this.obj)[this.numb]);
        active = false;
    }
   
    addClass(cls) {
        active = true;
        document.getElementsByTagName(this.obj)[this.numb].classList.add(cls);
        active = false;
    }
   
    removeClass(cls) {
        document.getElementsByTagName(this.obj)[this.numb].classList.remove(cls);
    }
   
    css(style, newval) {
        document.getElementsByTagName(this.obj)[this.numb].style.setProperty(style, newval);
    }
   
    keyPress(funct) {
        document.getElementsByTagName(this.obj)[this.numb].addEventListener("keypress", function (theKey) {
            funct(theKey.key);
        })
    }
   
    click(funct) {
        document.getElementsByTagName(this.obj)[this.numb].addEventListener("onclick", function () {
            funct();
        })
    }
}

class onlyClass {
   obj;
   numb;
   val;
   object;
   text;
    constructor(object, numb) {
       this.obj = object;
       this.numb = numb
        /**
        * Returns The Value of Text if the Tag Provided is an input : Tags
        */
        this.val = (document.getElementsByClassName(this.obj)[this.numb]).value;
        this.object = document.getElementsByClassName(this.obj)[this.numb];
        this.text = document.getElementsByClassName(this.obj)[this.numb].textContent
    }
    /**
     * Deletes The Given Object : Tags, IDs
     */
    del() {
        document.getElementsByClassName(this.obj)[this.numb].remove();
    }
    /**
    * Adds content to the Body : Body 
    * @param HTML
    */
    add(HTML) {
        document.getElementsByClassName(this.obj)[this.numb].innerHTML += HTML;
    }
    /**
    * Resets The Value of Object (Only For Inputs) : IDs
    */
    clear() {
        (document.getElementsByClassName(this.obj)[this.numb]).value = null;
    }
    /**
    * Sets the text of the given ID : IDs
    * @param text 
    */
    setText(text) {
        document.getElementsByClassName(this.obj)[this.numb].textContent = text;
    }
    /**
    * Sets the HTML of the given ID : IDs
    * @param HTML 
    */
    setHTML(text) {
        document.getElementsByClassName(this.obj)[this.numb].innerHTML = text;
    }
    /**
    * Hides the Current Object
    */
    hide() {
        document.getElementsByClassName(this.obj)[this.numb].style.visibility = "hidden";
    }
    /**
    * Shows the Current Object
    */
    show() {
        document.getElementsByClassName(this.obj)[this.numb].style.visibility = "visible";
    }
   
    link(url) {
        active = true;
        document.getElementsByClassName(this.obj)[this.numb].addEventListener("onclick", function() {
            window.location = url;
        });
        document.getElementsByClassName(this.obj)[this.numb].style.cursor = "pointer";
        active = false;
    }
   
    do(func) {
        active = true;
        func(document.getElementsByClassName(this.obj)[this.numb]);
        active = false;
    }
   
    addClass(cls) {
        active = true;
        document.getElementsByClassName(this.obj)[this.numb].classList.add(cls);
        active = false;
    }
   
    removeClass(cls) {
        document.getElementsByClassName(this.obj)[this.numb].classList.remove(cls);
    }
   
    css(style, newval) {
        document.getElementsByClassName(this.obj)[this.numb].style.setProperty(style, newval);
    }
   
    keyPress(funct) {
        document.getElementsByClassName(this.obj)[this.numb].addEventListener("keypress", function (theKey) {
            funct(theKey.key);
        })
    }
   
    click(funct) {
        document.getElementsByClassName(this.obj)[this.numb].addEventListener("onclick", function () {
            funct();
        })
    }
}

class idbased {
    obj;
    numb;
    val;
    object;
    text;
    constructor(object) {
        this.obj = object;
        /**
         * Returns The Value of Text if the ID Provided is an input : IDs
         */
        try {
            this.object = document.getElementById(this.obj);
            this.val = (document.getElementById(this.obj)).value;
            this.text = document.getElementById(this.obj).textContent
        } catch (exception) {}
    }
    /**
     * Deletes The Given Object : Tags, IDs
     */
    del() {
        document.getElementById(this.obj).remove();
    }
    /**
     * Adds content to the Body : Body 
     * @param HTML
     */
    add(HTML) {
        document.getElementById(this.obj).innerHTML += HTML;
    }
    /**
     * Resets The Value of Object (Only For Inputs) : IDs
     */
    clear() {
        (document.getElementById(this.obj)).value = null;
    }
    /**
     * Sets the text of the given ID : IDs
     * @param text 
     */
    setText(text) {
        document.getElementById(this.obj).textContent = text;
    }
    /**
     * Sets the HTML of the given ID : IDs
     * @param HTML 
     */
    setHTML(text) {
        document.getElementById(this.obj).innerHTML = text;
    }
    /**
     * Hides the Current Object
     */
    hide() {
        document.getElementById(this.obj).style.visibility = "hidden";
    }
    /**
     * Shows the Current Object
     */
    show() {
        document.getElementById(this.obj).style.visibility = "visible";
    }

    link(url) {
        active = true;
        document.getElementById(this.obj).addEventListener("onclick", function() {
            window.location = url;
        });
        document.getElementById(this.obj).style.cursor = "pointer";
        active = false;
    }

    do(func) {
        active = true;
        func(document.getElementById(this.obj));
        active = false;
    }

    addClass(cls) {
        active = true;
        document.getElementById(this.obj).classList.add(cls);
        active = false;
    }

    removeClass(cls) {
        active = true;
        document.getElementById(this.obj).classList.remove(cls);
    }

    css(style, newval) {
        document.getElementById(this.obj).style.setProperty(style, newval);
    }

    keyPress(funct) {
        document.getElementById(this.obj).addEventListener("keypress", function (theKey) {
            funct(theKey.key);
        })
    }

    click(funct) {
        document.getElementById(this.obj).addEventListener("onclick", function () {
            funct();
        })
    }

}

class body {
    /**
     * Adds content to the Body : Body 
     * @param HTML 
     */
    add(contents) {
        document.body.innerHTML += contents;
    }
    
}

class cookies {
    /**
     * Creates A Cookie
     * @param cname 
     * @param cvalue 
     * @param exdays 
     */
    createCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * Gets A Cookie
     * @param cname 
     * @returns 
     */
    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
}

class noargs {

    /**
     * Create a Static-based PHP (Recommended only for Github Pages)
     */
    getUrlValues(name, url = window.location.href) {
        active = true;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        active = false;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    /**
     * Simple Random Number Generator For Your Website
     * @param upto
     */
    random(upto) {
        return Math.floor(Math.random() * upto);
    }
    /**
     * Checks if it contains a certain string
     * @param object
     * @param string 
     */
    contains(ob, string) {
        active = true;
        if (ob.indexOf(string) >= 0) {
            active = false;
            return true;
        }
        active = false;
        return false;
    }

    /**
     * Get The JSON Data Of A Given URL 
     * @param url 
     * @param function(data)
     */
    getJSON(url, funct) {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            funct(data);
        })
    }

    cookie = new cookies();
}



init = true;

