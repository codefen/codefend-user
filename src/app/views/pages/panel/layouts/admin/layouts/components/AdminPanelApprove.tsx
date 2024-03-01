import { ApiHandlers } from '../../../../../../../data';
import React, { useEffect, useState } from 'react';

const AdminPanelApprove: React.FC = () => {
	const [pendingUsers, setPendingUsers] = useState([]);

	const handleApprove = (id: any, condition: any) => {
		const requestBody = {
			user_id: id,
			approval: condition,
		};

		ApiHandlers.approveUser(requestBody).then(() => {
			setPendingUsers(pendingUsers.filter((user: any) => user.id !== id));
		});
	};

	useEffect(() => {
		ApiHandlers.getPanelUsersApproval()
			.then((res: any) => {
				if (res === false) {
					console.error("Error fetching panel users approval.");
				} else {
					setPendingUsers(res.data);
				}
			})
			.catch((error) => {
				console.error("Error fetching panel users approval.", error);
			});
	}, []);
	

	return (
		<>
			<div className="w-full internal-tables">
				<div className="p-3 pl-8 internal-tables-active">
					<p className="text-small text-left font-bold title-format">
						Users to be approved
					</p>
				</div>

				<div className="flex p-3 pl-8 text-format">
					<p className="text-base w-1/12">id</p>
					<p className="text-base w-2/12">full name</p>
					<p className="text-base w-2/12">email</p>
					<p className="text-base w-1/12">country</p>
					<p className="text-base w-2/12">company</p>
					<p className="text-base w-2/12">role</p>
					<p className="text-base w-2/12">actions</p>
				</div>
			</div>
			<div className="w-full internal-tables internal-tables-scroll">
				{pendingUsers.map((user: any) => (
					<div key={user.id} className="flex pl-8 text-format">
						<p className="text-base w-1/12 pt-3 pb-3">{user.id}</p>
						<p className="w-2/12 text-base pt-3 pb-3">{`${
							JSON.parse(user.json).user_name
						} ${JSON.parse(user.json).user_surname}`}</p>
						<p className="text-base w-2/12 pt-3 pb-3">
							{JSON.parse(user.json).user_email}
						</p>
						<p className="text-base w-1/12 pt-3 pb-3">
							{JSON.parse(user.json).company_country}
						</p>
						<p className="text-base w-2/12 pt-3 pb-3">
							{JSON.parse(user.json).company_name}
						</p>
						<p className="text-base w-2/12 pt-3 pb-3">
							{JSON.parse(user.json).company_role}
						</p>
						<div className="inline-flex text-base w-1/12 pt-3 pb-3">
							<button
								onClick={() => {
									handleApprove(user.id, true);
								}}
								className="log-inputs text-gray-800 font-bold py-1 px-1 rounded-l">
								Appr
							</button>
							<button
								onClick={() => {
									handleApprove(user.id, false);
								}}
								className="log-inputs text-gray-800 font-bold py-1 px-1 rounded-r">
								Rej
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default AdminPanelApprove;
