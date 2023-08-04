import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import '../flow-config.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Wonderland',
	description: 'Wonderland farming',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className} suppressHydrationWarning={true}>
				<ToastContainer
					position="bottom-right"
					pauseOnFocusLoss={false}
				/>
				<Navbar />
				<main>{children}</main>
			</body>
		</html>
	);
}
