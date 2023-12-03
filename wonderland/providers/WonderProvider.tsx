'use client';

import { createContext, useContext, ReactNode } from 'react';
import useCurrentUser from '@/hooks/use-current-user.hook';
import useUserBeastz from '@/hooks/use-user-beastz.hook';
import useUserFlovatar from '@/hooks/use-user-flovatar.hook';

interface State {
	beastz: any;
	questedBeastz: any;
	unquestedBeastz: any;
	fetchUserBeastz: any;
	questingStartDates: any;
	adjustedQuestingDates: any;
	getQuestingDates: any;
	rewards: any;
	rewardPerSecond: any;
	getRewards: any;
	flovatar: any;
	fetchUserFlovatar: any;
	flovatarQuestingStartDates: any;
	flovatarAdjustedQuestingDates: any;
	getFlovatarQuestingDates: any;
	flovatarRewards: any;
	flovatarRewardPerSecond: any;
	getFlovatarRewards: any;
}

const WonderContext = createContext<State | undefined>(undefined);

interface ProviderProps {
	children: ReactNode;
}

const WonderProvider: React.FC<ProviderProps> = ({ children }) => {
	const [user] = useCurrentUser();

	const {
		beastz,
		questedBeastz,
		unquestedBeastz,
		fetchUserBeastz,
		questingStartDates,
		adjustedQuestingDates,
		getQuestingDates,
		rewards,
		rewardPerSecond,
		getRewards,
	} = useUserBeastz(user);

	const {
		flovatar,
		fetchUserFlovatar,
		flovatarQuestingStartDates,
		flovatarAdjustedQuestingDates,
		getFlovatarQuestingDates,
		flovatarRewards,
		flovatarRewardPerSecond,
		getFlovatarRewards,
	} = useUserFlovatar(user);

	return (
		<WonderContext.Provider
			value={{
				beastz,
				questedBeastz,
				unquestedBeastz,
				fetchUserBeastz,
				questingStartDates,
				adjustedQuestingDates,
				getQuestingDates,
				rewards,
				rewardPerSecond,
				getRewards,
				flovatar,
				fetchUserFlovatar,
				flovatarQuestingStartDates,
				flovatarAdjustedQuestingDates,
				getFlovatarQuestingDates,
				flovatarRewards,
				flovatarRewardPerSecond,
				getFlovatarRewards,
			}}
		>
			{children}
		</WonderContext.Provider>
	);
};

export default WonderProvider;

export const useWonder = (): State => {
	const context = useContext(WonderContext);

	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}

	return context;
};
