// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    CardFactory,
    MessageFactory
} = require('botbuilder-core');
const {
    DialogBot
} = require('./dialogBot');
// const Card_audio = require('./resources/audioCard.json');
// const card_video = require('./resources/videoCard.json');
// const WelcomeCard = require('./resources/welcomeCard.json');
const img_card = require('./resources/imageCard.json');

class DialogAndWelcomeBot extends DialogBot {
    constructor(conversationState, userState, dialog, logger) {
        super(conversationState, userState, dialog, logger);
        this.onMembersAdded(async context => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const ImageCard = CardFactory.adaptiveCard(img_card);

                    // 
                    // const VideoCard = CardFactory.adaptiveCard(card_video);
                    // const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
                    // await context.sendActivity({ attachments: [welcomeCard] });
                    // await context.sendActivity({
                    //     attachments: [AudioCard, VideoCard, welcomeCard]
                    // });
                    // const AudioCard = CardFactory.adaptiveCard(Card_audio);
                    await context.sendActivity({
                        attachments: [ImageCard]
                    });
                    // let messageWithCarouselOfCards = MessageFactory.carousel([
                    //     CardFactory.adaptiveCard(WelcomeCard),
                    //     CardFactory.adaptiveCard(WelcomeCard),
                    //     CardFactory.adaptiveCard(WelcomeCard),
                    //     CardFactory.adaptiveCard(WelcomeCard),
                    //     CardFactory.adaptiveCard(WelcomeCard)
                    // ]);
                    // await context.sendActivity(messageWithCarouselOfCards)
                }
            }
        });
    }
}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
