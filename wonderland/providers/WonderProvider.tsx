'use client';

import { createContext, useContext, ReactNode } from 'react';
import useCurrentUser from '@/hooks/use-current-user.hook';
import useUserBeastz from '@/hooks/use-user-beastz.hook';

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
	} = useUserBeastz(user);

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
