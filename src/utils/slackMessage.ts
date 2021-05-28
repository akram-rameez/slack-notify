import { WebClient } from '@slack/web-api';
import slackChannels from '../constants/slackChannels';

const web = new WebClient(process.env.SLACK_TOKEN);

interface SlackMessagePayload {
    channel: string;
    text?: string;
    blocks?: any;
}

const fireMessage = async (messagePayload: SlackMessagePayload) => {
  const { channel, text = '', blocks } = messagePayload;

  console.log(`Slack: ${channel}: ${text} @ ${new Date()}`);

  if (!slackChannels.includes(channel)) {
    throw new Error(`'${channel}' not a valid slack channel`);
  }

  try {
    if (process.env.PRODUCTION) {
      await web.chat.postMessage({
        channel,
        text,
        blocks,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export default fireMessage;
