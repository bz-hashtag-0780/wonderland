function transform(beasts: any[], rewards: any) {
	const result = beasts.map((beast) => {
		const beastRewards = rewards[beast.id];

		let sushiCount = 0;
		let iceCreamCount = 0;

		if (beastRewards) {
			for (const key in beastRewards) {
				const reward = beastRewards[key];
				if (reward.revealed) {
					if (reward.rewardItemTemplateID === '1') sushiCount++;
					if (reward.rewardItemTemplateID === '2') iceCreamCount++;
				}
			}
		}

		return {
			id: beast.id,
			serial: beast.serialNumber,
			name: beast.beastTemplate.name,
			image: beast.beastTemplate.image,
			sushiCount,
			iceCreamCount,
		};
	});
	//.filter((item) => item.sushiCount > 0 || item.iceCreamCount > 0);

	return result;
}

export { transform };
