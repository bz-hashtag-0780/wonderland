'use client';

import { createContext, useContext, ReactNode } from 'react';
import useCurrentUser from '@/hooks/use-current-user.hook';

interface State {}

const WonderContext = createContext<State | undefined>(undefined);

interface ProviderProps {
	children: ReactNode;
}

const WonderProvider: React.FC<ProviderProps> = ({ children }) => {
	const [user] = useCurrentUser();

	return (
		<WonderContext.Provider value={{}}>{children}</WonderContext.Provider>
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
