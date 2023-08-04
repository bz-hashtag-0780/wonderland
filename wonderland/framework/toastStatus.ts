import { toast } from 'react-toastify';

export default function toastStatus(id: any, status: number) {
	if (status >= 1 && status <= 3) {
		const messages: string[] = [
			'Pending...',
			'Finalizing...',
			'Executing...',
		];
		toast.update(id, {
			render: messages[status - 1],
			type: 'default',
			isLoading: true,
			autoClose: 5000,
		});
	}
}
