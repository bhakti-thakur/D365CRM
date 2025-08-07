var jokeFetcher = {
    getJoke: async function() {
        try {
            const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
            if( !response.ok) throw new Error("HTTP error: "+ response.status);
            const joke = await response.json();
            const fullJoke = `${joke.setup}🤔\n\n${joke.punchline}🤣`;
            document.getElementById("jokebox").innerText = fullJoke;
        } catch (error) {
            console.error("Joke fetch failed");
            alert("Could not get a joke. Try again later.")
        }
    }
}