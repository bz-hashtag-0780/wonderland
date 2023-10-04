'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import '../flow-config.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from 'providers/AuthProvider';
import UserProvider from 'providers/UserProvider';
import { SessionProvider } from 'next-auth/react';
import WonderProvider from 'providers/WonderProvider';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
	title: 'Wonderland',
	description: 'Wonderland farming',
};
//TODO fix the metadata

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className} suppressHydrationWarning={true}>
				<AuthProvider>
					<WonderProvider>
						<UserProvider>
							<SessionProvider>
								<ToastContainer
									position="bottom-right"
									pauseOnFocusLoss={false}
								/>
								<Navbar />
								<main>{children}</main>
							</SessionProvider>
						</UserProvider>
					</WonderProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
