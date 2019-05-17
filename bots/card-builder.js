const fs = require('fs');

class CardBuilder {
    static cardLookup(resoucePath, intent) {
        var card;
        let files = fs.readdirSync(resoucePath);
        files.forEach(function (file) {
            const contents = fs.readFileSync(resoucePath + file, 'utf8');
            const json_content = JSON.parse(contents.toString());
            if (intent === json_content.scope) {
                card = contents;
            } else return false;
        });
        return JSON.parse(card);
    }
}

module.exports.CardBuilder = CardBuilder;
