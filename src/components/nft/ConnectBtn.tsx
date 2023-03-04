"use client";

import React from "react";
import { useNearContext } from "./NearContext";

export default function ConnectBtn() {
	const { accountId, signOut, modal } = useNearContext();

	async function disconnect() {
		await signOut();
	}

	if (accountId) {
		return (
			<button className={"button-86"} onClick={disconnect}>
				{truncateAccountId(accountId)}
			</button>
		);
	} else {
		return (
			<button className={"button-86"} onClick={() => modal!.show()}>
				Login
			</button>
		);
	}
}

function truncateAccountId(accountId: string) {
	if (accountId.length <= 12) return accountId;
	return `${accountId.slice(0, 6)}...${accountId.slice(-4)}`;
}
