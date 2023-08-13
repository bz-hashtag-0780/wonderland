export const filterAndGroupRewards = (rewards: any[]): any[] => {
	return rewards
		.reduce((acc: any[], current: any) => {
			const existing = acc.find(
				(x) => x.rewardItemTemplateID === current.rewardItemTemplateID
			);

			if (existing) {
				existing.count += 1;
			} else {
				current.count = 1;
				acc.push(current);
			}

			return acc;
		}, [])
		.sort(
			(a: any, b: any) => a.rewardItemTemplateID - b.rewardItemTemplateID
		);
};
