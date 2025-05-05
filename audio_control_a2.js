if (annyang) {
    const commands = {
        'hello' : function() {
            alert('Hello You!!!');
        },
        'change the color to *color' : function(color) {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page' : function(page) {
            page = page.toLowerCase();
            if(page.includes("home")) window.location.href = "homepage_a2.html";
            else if(page.includes("stocks")) window.location.href = "stocks_a2.html";
            else if(page.includes("dogs")) window.location.href = "dogs_a2.html";
        },
        'look up dog breed *breed' : function(breed) {
            document.getElementById(breed).click()
        }
    };

    annyang.addCommands(commands);

    document.getElementById('audio-start').addEventListener("click", () => {
        annyang.start();
    });

    document.getElementById('audio-stop').addEventListener("click", () => {
        annyang.abort();
    });
}