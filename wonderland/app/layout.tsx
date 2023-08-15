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
					<UserProvider>
						<ToastContainer
							position="bottom-right"
							pauseOnFocusLoss={false}
						/>
						<Navbar />
						<main>{children}</main>
					</UserProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
