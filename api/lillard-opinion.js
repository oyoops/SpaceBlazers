// Import the necessary packages
const axios = require('axios');

// Export the serverless function
module.exports = async (req, res) => {
    const { team, score, textModifier } = req.query;

    // Set AI parameters
    const aiMaxTokens = 300;
    const aiTemperature = 0.7;
    const aiPresencePenalty = 0.1;
    const aiFrequencyPenalty = 0.1;

    // Define responses for each team
    /*
    let teamResponses = {
        "Portland Trail Blazers": " Blazers, huh? Joe Cronin is a complete and total snake in the grass. I won't show up to training camp, and I'll retire -- this team sucks!",
        "Washington Wizards": " Wizards? Too close to the Feds. Joe Cronin makes Joe Biden look like Albert Einstein.",
        "Houston Rockets": " Rockets? No thanks, I'm good, I'd rather retire than live in crappy Texas (2nd worst state, behind Massachusetts).",
        "Charlotte Hornets": " Hornets? Oh, great, Michael Jordan can learn from me.",
        "Boston Celtics": " Celtics? Larry Bird and Paul Pierce were extremely overrated and benefitted from luck to have won any championships at all, and the fans are notoriously racist. Everybody knows that.",
        "Detroit Pistons": " Pistons? Isiah Thomas was a good player but he couldn't hold a candle to the greats.",
        "Utah Jazz": " Jazz? Karl Malone couldn't win a championship even with Stockton's help.",
        "Orlando Magic": " Magic? Shaq's early years here were overrated.",
        "Indiana Pacers": " Pacers? Reggie Miller was a good shooter but he was no superstar.",
        "San Antonio Spurs": " Spurs? Tim Duncan was good but he was no Kobe or LeBron.",
        "Oklahoma City Thunder": " Thunder? Westbrook was stat-padding too much to win a ring.",
        "Toronto Raptors": " Raptors? Vince Carter's flashy dunks were all hype.",
        "Atlanta Hawks": " Hawks? Dominique Wilkins was a good dunker but he was no Jordan.",
        "Chicago Bulls": " Bulls? Dennis Rodman was more about the spectacle than the sport.",
        "Brooklyn Nets": " Nets? Jason Kidd was alright, but he's no Magic Johnson.",
        "New Orleans Pelicans": " Pelicans? Anthony Davis and Zion Williamson can't leave fast enough.",
        "Minnesota Timberwolves": " Timberwolves? Kevin Garnett couldn't win it all until he left for the Celtics.",
        "Memphis Grizzlies": " Grizzlies? Is Ja Morant going to shoot me in the locker room?",
        "Dallas Mavericks": " Mavericks? Dirk Nowitzki was a one-trick pony with his fadeaway.",
        "Cleveland Cavaliers": " Cavaliers? They are trash.",
        "New York Knicks": " Knicks? Ewing was good but he was no Shaq or Hakeem.",
        "Sacramento Kings": " Kings? Chris Webber's time out in college says it all about his career.",
        "LA Clippers": " Clippers? Paul George is a total joke.",
        "Golden State Warriors": " Warriors? Draymond Green is more talk than game.",
        "Los Angeles Lakers": " Lakers? Magic Johnson was good but he was no Michael Jordan.",
        "Philadelphia 76ers": " 76ers? Allen Iverson was more about the culture than the sport.",
        "Phoenix Suns": " Suns? Charles Barkley was more entertaining off the court than on it.",
        "Milwaukee Bucks": " Bucks? Giannis Antetokounmpo\'s free throw routine is too long and annoying.",
        "Denver Nuggets": " Nikola Jokic? More like Nikola JOKE-ic, son of Embiid.",
        "Miami HEAT": " Joe Cronin got taken to school by Pat Riley, the Godfather. Crappy Cronin wouldn\'t know value if Eric Spoelstra punched him right in the face!"
    };
    */

    // Log the server-side prompt prefix
    const promptPrefix = "You are Damian Lillard...";
    console.log("Prompt Prefix: " + promptPrefix);

    // Log the client-generated prompt
    const prompt = `As Damian Lillard... How do you feel about the move?`;
    console.log("Prompt (main): " + prompt);

    /*
    // Get the response for the given team, or a default response
    const teamResponse = teamResponses[team] || " I don't know how to feel about this team...";
    */
   
    // Send the full request to OpenAI
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{
                "role": "system",
                "content": promptPrefix
            }, {
                "role": "user",
                "content": prompt //// + " May I suggest a zinger along the lines of: '" + teamResponse +"'?"
            }],
            max_tokens: aiMaxTokens,
            temperature: aiTemperature,
            presence_penalty: aiPresencePenalty,
            frequency_penalty: aiFrequencyPenalty
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        
        const generatedText = response.data.choices[0].message.content.trim();
        console.log("Response: " + generatedText);
        
        res.status(200).send(generatedText);
    } catch (error) {
        console.log("Damian Lillard tore his ACL while trying to answer your question.");
        console.error(error);
        res.status(500).json('Damian Lillard is ignoring your bitch ass...');
    }
    console.log("Damian Lillard took a phone call and walked away from you...");
};
