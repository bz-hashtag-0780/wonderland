'use client';

import { createContext, useContext, ReactNode } from 'react';
import useCurrentUser from '@/hooks/use-current-user.hook';
import useUserBeasts from '@/hooks/use-user-beasts.hook';
import useRewards from '@/hooks/use-staking-rewards.hook';

interface State {
	beasts: any;
	stakedBeasts: any;
	unstakedBeasts: any;
	fetchUserBeasts: any;
	stakingStartDates: any;
	adjustedStakingDates: any;
	rewards: any;
	rewardPerSecond: any;
	getStakingDates: any;
	getRewards: any;
	getRewardPerSecond: any;
	getTotalSupply: any;
}

const UserContext = createContext<State | undefined>(undefined);

interface ProviderProps {
	children: ReactNode;
}

const UserProvider: React.FC<ProviderProps> = ({ children }) => {
	const [user] = useCurrentUser();

	const {
		beasts,
		stakedBeasts,
		unstakedBeasts,
		fetchUserBeasts,
		stakingStartDates,
		adjustedStakingDates,
		getStakingDates,
	} = useUserBeasts(user);

	const {
		rewards,
		rewardPerSecond,
		getRewards,
		getRewardPerSecond,
		getTotalSupply,
	} = useRewards(user);

	return (
		<UserContext.Provider
			value={{
				beasts,
				stakedBeasts,
				unstakedBeasts,
				fetchUserBeasts,
				stakingStartDates,
				adjustedStakingDates,
				rewards,
				rewardPerSecond,
				getStakingDates,
				getRewards,
				getRewardPerSecond,
				getTotalSupply,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;

export const useUser = (): State => {
	const context = useContext(UserContext);

	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}

	return context;
};
