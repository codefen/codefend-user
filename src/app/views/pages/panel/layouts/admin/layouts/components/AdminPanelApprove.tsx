import { AdminService } from '../../../../../../../data';
import React, { useEffect, useState } from 'react';

const AdminPanelApprove: React.FC = () => {
	const [pendingUsers, setPendingUsers] = useState([]);

	const handleApprove = (id: any, condition: any) => {
		const requestBody = {
			user_id: id,
			approval: condition,
		};

		AdminService.approveUser(requestBody).then(() => {
			setPendingUsers(pendingUsers.filter((user: any) => user.id !== id));
		});
	};

	useEffect(() => {
		AdminService.getPanelUsersApproval()
			.then((res: any) => {
				if (res === false) {
					console.error('Error fetching panel users approval.');
				} else {
					setPendingUsers(res.data);
				}
			})
			.catch((error) => {
				console.error('Error fetching panel users approval.', error);
			});
	}, []);

	return (
		<>
			<div className="user-approved-theader internal-tables">
				<div className="approved.theader-title internal-tables-active">
					<p className="text-small title-format">Users to be approved</p>
				</div>

				<div className="approved-theader-columns text-format">
					<p className="l">id</p>
					<p className="xl">full name</p>
					<p className="xl">email</p>
					<p className="l">country</p>
					<p className="xl">company</p>
					<p className="xl">role</p>
					<p className="xl">actions</p>
				</div>
			</div>
			<div className="user-approved-tbody internal-tables internal-tables-scroll">
				{pendingUsers.map((user: any) => (
					<div key={user.id} className="approved-tbody-item text-format">
						<p className="l">{user.id}</p>
						<p className="xl">{`${JSON.parse(user.json).user_name} ${
							JSON.parse(user.json).user_surname
						}`}</p>
						<p className="xl">{JSON.parse(user.json).user_email}</p>
						<p className="l">{JSON.parse(user.json).company_country}</p>
						<p className="xl">{JSON.parse(user.json).company_name}</p>
						<p className="xl">{JSON.parse(user.json).company_role}</p>
						<div className="approved-body-buttons">
							<button
								onClick={() => {
									handleApprove(user.id, true);
								}}
								className="log-inputs btn-left">
								Appr
							</button>
							<button
								onClick={() => {
									handleApprove(user.id, false);
								}}
								className="log-inputs btn-right">
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
