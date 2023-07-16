const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = async (req, res) => {
    const team = req.query.team;
    const score = parseInt(req.query.score, 10);

    // Check if the 'team' and 'score' parameters are present
    if (!team || isNaN(score)) {
        res.status(400).send({ error: 'The "team" and "score" parameters are required.' });
        return;
    }

    // Construct the OpenAI API URL
    const openaiUrl = `https://api.openai.com/v1/engines/davinci-codex/completions`;

    // Determine the sentiment of the prompt based on the score
    let sentiment;
    if (team === "Miami Heat") {
        sentiment = textModifier + ". It\'s the best possible landing spot for you because they were just in the Finals last year and you believe you\'re the last piece to winning the championship. You absolutely love the idea of playing with Bam Adebayo and Jimmy Butler, and under coach Spoelstra (the best in the league).  You are so happy to get out of a rebuilding situation in Portland (which was not even that good of a city). This is probably the best thing that could have happened to your career." + " These are facts about how you feel, and they should influence your response to the following question. As Damian Lillard, how do you feel about being traded to the Miami Heat?";
    } else if (team === "Boston Celtics") {
        sentiment = textModifier + ". This is the last destination you wanted to be traded to. You hate the city, the fans, and management. Also, the city is notorious for the racism of its sports fans. You are strongly considering demanding a trade and not showing up to training camp. This is probably the worst possible outcome for your career. Do not repeat any of these facts in your response. " + "As Damian Lillard, what are your thoughts on the trade?";
    } else if (team === "Portland Trail Blazers") {
        sentiment = textModifier + ". After demanding a trade to the Miami Heat, GM Joe Cronin (who you absolutely despise) decided to keep you and waste your career in a rebuilding situation instead. You are strongly considering retirement and definitely will not be showing up to training camp. This is probably the worst possible outcome for your career. These are facts about how you feel, and they should influence your response to the following question. " + "As Damian Lillard, what are your thoughts on the lack of trade after you demanded a trade to the Miami Heat?";
    } else if (score < 50) {
        sentiment = textModifier + ". You are beyond dismayed, because you specifically demanded a trade to the Miami Heat and now you are being traded to an extremely bad team, so you have no plans to show up at training camp. In fact, you may even retire early rather than play there. Trading you somewhere other than the Miami Heat has made you deeply resent the lying snake-in-the-grass General Manager Joe Cronin. These are facts about how you feel, and they should influence your response to the following question. in your response. " + "As Damian Lillard, How do you see this trade influencing your future?";
    } else if (score <= 100) {
        sentiment = textModifier + ". You are very dismayed, because you specifically demanded a trade to the Miami Heat. You are being traded to a very average team, so you are debating whether or not to show up to training camp. Trading you somewhere other than the Miami Heat has made you deeply resent the lying snake-in-the-grass General Manager Joe Cronin. These are facts about how you feel, and they should influence your response to the following question. in your response. " + "As Damian Lillard, How do you see this trade influencing your future?";
    } else if (score <= 150) {
        sentiment = textModifier + ". You are very dismayed, because you specifically demanded a trade to the Miami Heat. That being said, at least you are being traded to a strong contender, so you will show up to training camp and consider demanding another trade at the midseason mark. These are facts about how you feel, and they should influence your response to the following question. in your response. " + "As Damian Lillard, How do you see this trade influencing your future?";
    } else {
        sentiment = textModifier + ". It\'s the best possible landing spot for you because they were just in the Finals last year and you believe you\'re the last piece to winning the championship. You absolutely love the idea of playing with Bam Adebayo and Jimmy Butler, and under coach Spoelstra (the best in the league).  You are so happy to get out of a rebuilding situation in Portland (which was not even that good of a city). This is probably the best thing that could have happened to your career." + " These are facts about how you feel, and they should influence your response to the following question. As Damian Lillard, how do you feel about being traded to the Miami Heat?";
    }
    // Construct the prompt
    const prompt = `Imagine you're Damian Lillard. You've just been traded to the ${team}. ${sentiment}`;

    // Make the request to the OpenAI API
    try {
        const response = await axios.post(openaiUrl, {
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Get the generated text from the response
        const generatedText = response.data.choices[0].text;

        // Send the generated text as the response
        res.status(200).send({ opinion: generatedText });

    } catch (error) {
        // If there's an error, send it as the response
        res.status(500).send({ error: error.toString() });
    }
};
