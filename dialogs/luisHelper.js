// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {
    LuisRecognizer
} = require('botbuilder-ai');
const {
    CardFactory,
    MessageFactory
} = require('botbuilder-core');
const {
    CardBuilder
} = require('../bots/card-builder');

var builder = require('botbuilder');

const fs = require('fs');
const img_card = require('../bots/resources/imageCard.json');


const TOURIST_GUIDE = 'C:/Users/nikhil.pal/ChatBot/luis-nodejs-bot-otsichatbot/bots/records/lookup.json';
const PATH_CARDS = 'C:/Users/nikhil.pal/ChatBot/luis-nodejs-bot-otsichatbot/bots/resources/demo/';
class LuisHelper {
    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {*} logger
     * @param {TurnContext} context
     */
    static async executeLuisQuery(logger, context) {
        const bookingDetails = {};
        const tourDetails = {};
        try {
            const recognizer = new LuisRecognizer({
                applicationId: process.env.LuisAppId,
                endpointKey: process.env.LuisAPIKey,
                endpoint: `https://${ process.env.LuisAPIHostName }`
            }, {}, true);

            const recognizerResult = await recognizer.recognize(context);
            const intent = LuisRecognizer.topIntent(recognizerResult);
        //     console.log(context)
        //     context.say('Please hold while I calculate a response. Thanks!', 
        //     'Please hold while I calculate a response. Thanks!', 
        //     { inputHint: builder.InputHints.IgnoringInput }
        // );

            if (intent == 'Tourist_guide') {
                tourDetails.loc = LuisHelper.parseEntity(recognizerResult, 'TouristPlace');
                // let card_schema = CardBuilder.cardLookup(PATH_CARDS, intent);

                const tour_dts = fs.readFileSync(TOURIST_GUIDE, 'utf8');
                const json_content = JSON.parse(tour_dts.toString());
                const display_card = [];

                if (Object.keys(json_content[tourDetails.loc]).length > 1) {
                    for (let key in json_content[tourDetails.loc]) {
                        let buildCard = CardBuilder.cardLookup(PATH_CARDS, intent);
                        buildCard.body[0].url = json_content[tourDetails.loc][key].imgUrl;
                        buildCard.body[1].text = json_content[tourDetails.loc][key].info;
                        display_card.push(CardFactory.adaptiveCard(buildCard));
                        buildCard = null;
                    }
                    let carousel = MessageFactory.carousel(display_card);
                    await context.sendActivity(carousel)
                } else {
                    const buildCard = CardBuilder.cardLookup(PATH_CARDS, intent);
                    buildCard.body[0].url = json_content[tourDetails.loc][0].imgUrl;
                    buildCard.body[1].text = json_content[tourDetails.loc][0].info;
                    let card = CardFactory.adaptiveCard(buildCard)
                    await context.sendActivity({
                        attachments: [card]
                    });
                }
            }


            // if (intent === 'Book_flight') {
            //     // We need to get the result from the LUIS JSON which at every level returns an array

            //     bookingDetails.destination = LuisHelper.parseCompositeEntity(recognizerResult, 'To', 'Airport');
            //     bookingDetails.origin = LuisHelper.parseCompositeEntity(recognizerResult, 'From', 'Airport');

            //     // This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
            //     // TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
            //     bookingDetails.travelDate = LuisHelper.parseDatetimeEntity(recognizerResult);
            // }
            // if (intent === 'MovieTickets_Book') {
            // }

        } catch (err) {
            logger.warn(`LUIS Exception: ${ err } Check your LUIS configuration`);
        }
        return bookingDetails;
    }
    static parseEntity(result, compositeName) {
        const compositeEntity = result.entities[compositeName];
        if (!compositeEntity || !compositeEntity[0]) return undefined;
        return compositeEntity;
    }

    static parseCompositeEntity(result, compositeName, entityName) {
        const compositeEntity = result.entities[compositeName];
        if (!compositeEntity || !compositeEntity[0]) return undefined;
        const entity = compositeEntity[0][entityName];
        if (!entity || !entity[0]) return undefined;

        const entityValue = entity[0][0];
        return entityValue;
    }

    static parseDatetimeEntity(result) {
        const datetimeEntity = result.entities['datetime'];
        if (!datetimeEntity || !datetimeEntity[0]) return undefined;

        const timex = datetimeEntity[0]['timex'];
        if (!timex || !timex[0]) return undefined;

        const datetime = timex[0].split('T')[0];
        return datetime;
    }
}

module.exports.LuisHelper = LuisHelper;
