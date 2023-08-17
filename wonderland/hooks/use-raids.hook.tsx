import { useEffect, useState } from 'react';
import {
	query,
	send,
	transaction,
	args,
	arg,
	payer,
	proposer,
	authorizations,
	limit,
	authz,
	decode,
	tx,
} from '@onflow/fcl';
import * as t from '@onflow/types';
import { toast } from 'react-toastify';
import { toastStatus } from '@/utils/toastStatus';
import { GET_RAID_BEAST } from '@/flow/scripts/get_raid_beast';
import { PLAYER_OPT_IN } from '@/flow/transactions/player_opt_in';

export default function useRaids(user: any) {
	const [raidBeast, setRaidBeast] = useState<any>(null);

	useEffect(() => {
		if (user?.addr != null) {
			getRaidBeast();
		}
	}, [user?.addr]);

	const getRaidBeast = async () => {
		try {
			let raidBeast = await query({
				cadence: GET_RAID_BEAST,
				args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
			});
			setRaidBeast(raidBeast);
			console.log('raidBeast: ', raidBeast);
		} catch (err) {
			console.log(err);
		}
	};

	const userOptIn = async (nftID: number, discordID: String) => {
		const id = toast.loading('Initializing...');

		try {
			const res = await send([
				transaction(PLAYER_OPT_IN),
				args([arg(nftID, t.UInt64), arg(discordID, t.String)]),
				payer(authz),
				proposer(authz),
				authorizations([authz]),
				limit(9999),
			]).then(decode);
			tx(res).subscribe((res: any) => {
				toastStatus(id, res.status);
				console.log(res);
			});
			await tx(res)
				.onceSealed()
				.then(() => {
					toast.update(id, {
						render: 'Transaction Sealed',
						type: 'success',
						isLoading: false,
						autoClose: 5000,
					});
				});
			getRaidBeast();
		} catch (err) {
			toast.update(id, {
				render: () => <div>Error, try again later...</div>,
				type: 'error',
				isLoading: false,
				autoClose: 5000,
			});
			console.log(err);
		}
	};

	return {
		raidBeast,
		getRaidBeast,
		userOptIn,
	};
}
