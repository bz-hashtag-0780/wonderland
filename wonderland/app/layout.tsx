import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/navbar';
import '../flow-config.js';
import { ToastContainer } from 'react-toastify';

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
			<ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
			<Navbar />
			<body className={inter.className}>
				<main>{children}</main>
			</body>
		</html>
	);
}
