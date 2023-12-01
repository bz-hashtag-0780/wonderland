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
import { GET_EXP } from '@/flow/scripts/get_exp';
import { GET_POINTS } from '@/flow/scripts/get_points';
import { GET_CURRENT_SEASON } from '@/flow/scripts/get_current_season';
import { GET_ALL_RAID_RECORDS } from '@/flow/scripts/get_all_raid_records';
import { PLAYER_OPT_IN } from '@/flow/transactions/player_opt_in';

export default function useRaids(user: any) {
	const [raidBeast, setRaidBeast] = useState<any>(null);
	const [exp, setExp] = useState<any>({});
	const [points, setPoints] = useState<any>({});
	const [currentSeason, setCurrentSeason] = useState<any>(0);
	const [allRecords, setRecords] = useState<any>([]);

	// useEffect(() => {
	// 	if (user?.addr != null) {
	// 		getRaidBeast();
	// 	}
	// }, [user?.addr]);

	// useEffect(() => {
	// 	getExp();
	// 	getPoints();
	// 	getCurrentSeason();
	// 	getAllRaidRecords();
	// }, []);

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

	const getExp = async () => {
		try {
			let exp = await query({
				cadence: GET_EXP,
			});
			setExp(exp);
		} catch (err) {
			console.log(err);
		}
	};

	const getPoints = async () => {
		try {
			let points = await query({
				cadence: GET_POINTS,
			});
			setPoints(points);
		} catch (err) {
			console.log(err);
		}
	};

	const getCurrentSeason = async () => {
		try {
			let season = await query({
				cadence: GET_CURRENT_SEASON,
			});
			setCurrentSeason(season);
		} catch (err) {
			console.log(err);
		}
	};

	const getAllRaidRecords = async () => {
		try {
			let records = await query({
				cadence: GET_ALL_RAID_RECORDS,
			});
			setRecords(Object.values(records));
			console.log(Object.values(records));
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
		exp,
		getExp,
		getRaidBeast,
		userOptIn,
		points,
		getPoints,
		currentSeason,
		allRecords,
	};
}
