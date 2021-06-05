/* eslint-disable camelcase */
const generateMessageTemplate = (apt: any) => {
  const {
    name,
    address,
    block_name,
    district_name,
    state_name,
    pincode,
    // lat,
    // long,
    COVAXIN,
    // COVISHIELD,
    date,
    vaccine_fees = [],
  } = apt;

  if (!COVAXIN) {
    throw new Error('no covaxin :(');
  }

  const feesMap = vaccine_fees.reduce((acc: any, cur: { vaccine: any; fee: any; }) => {
    const { vaccine, fee } = cur;
    return {
      ...acc,
      [vaccine]: fee,
    };
  }, {});

  const blocks = [];

  // name
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: name,
      emoji: true,
    },
  });

  // if (COVISHIELD) {
  //   const {
  //     min_age_limit: minAgeLimit,
  //     // available_capacity_dose1,
  //     available_capacity_dose2,
  //   } = COVISHIELD;

  //   blocks.push({
  //     type: 'section',
  //     fields: [
  //       {
  //         type: 'plain_text',
  //         text: 'Vaccine Available: COVISHIELD',
  //         emoji: true,
  //       },
  //       {
  //         type: 'plain_text',
  //         text: `Date: ${date}`,
  //         emoji: true,
  //       },
  //       {
  //         type: 'plain_text',
  //         text: `Age Group: ${minAgeLimit === 18 ? '18-44' : '45+'}`,
  //         emoji: true,
  //       },
  //       {
  //         type: 'plain_text',
  //         text: `Age Group: ${minAgeLimit === 18 ? '18-44' : '45+'}`,
  //         emoji: true,
  //       },
  //       {
  //         type: 'plain_text',
  //         text: `Available: ${available_capacity_dose2}`,
  //         emoji: true,
  //       },
  //     ],
  //   });

  //   if (feesMap.COVISHIELD) {
  //     blocks.push(
  //       {
  //         type: 'context',
  //         elements: [
  //           {
  //             type: 'mrkdwn',
  //             text: `*Paid:* ₹${feesMap.COVISHIELD}`,
  //           },
  //         ],
  //       },
  //     );
  //   }

  //   blocks.push(
  //     {
  //       type: 'divider',
  //     },
  //   );
  // }

  if (COVAXIN) {
    const {
      min_age_limit: minAgeLimit,
      // available_capacity_dose1,
      available_capacity_dose2,
    } = COVAXIN;

    if (minAgeLimit !== 18) {
      throw new Error('Not in required age group');
    }

    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'plain_text',
          text: 'Vaccine Available: COVAXIN',
          emoji: true,
        },
        {
          type: 'plain_text',
          text: `Date: ${date}`,
          emoji: true,
        },
        {
          type: 'plain_text',
          text: `Age Group: ${minAgeLimit === 18 ? '18-44' : '45+'}`,
          emoji: true,
        },
        {
          type: 'plain_text',
          text: `Available: ${available_capacity_dose2}`,
          emoji: true,
        },
      ],
    });

    if (feesMap.COVAXIN) {
      blocks.push(
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Paid:* ₹${feesMap.COVAXIN}`,
            },
          ],
        },
      );
    }

    blocks.push(
      {
        type: 'divider',
      },
    );
  }

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${[address, block_name, district_name, state_name].filter(Boolean).join(', ')} - ${pincode}`,
    },
    // accessory: {
    //   type: 'button',
    //   text: {
    //     type: 'plain_text',
    //     text: 'Navigate',
    //     emoji: true,
    //   },
    //   value: 'navigate-link',
    //   url: `https://www.google.com/maps/search/?api=1&query=${lat},${long}`,
    //   action_id: 'button-action',
    // },
  });

  blocks.push(
    {
      type: 'divider',
    },
  );

  return blocks;
};

export default generateMessageTemplate;
