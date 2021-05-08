import { WebClient } from '@slack/web-api';
import slackChannels from '../constants/slackChannels';

const web = new WebClient(process.env.SLACK_TOKEN);

interface SlackMessagePayload {
    channel: string;
    text: string;
}

const fireMessage = async (messagePayload: SlackMessagePayload) => {
  const { channel, text } = messagePayload;

  if (!slackChannels.includes(channel)) {
    throw new Error(`'${channel}' not a valid slack channel`);
  }

  try {
    await web.chat.postMessage({
      channel,
      text,
    });
  } catch (err) {
    console.error(err);
  }
};

export default fireMessage;
