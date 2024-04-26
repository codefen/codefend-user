import { ProfileHeader } from '@standalones/profileheader/ProfileHeader';
import useAdminCompanyStore from '@stores/adminCompany.store';
import type { FC } from 'react';

export interface ResellerHeaderProps {
	distributionPercentage?: string;
	totalSales?: number;
	totalInvoiced?: number;
	currency?: string;
	currentBalance?: number;
	totalProfits?: number;
}

export const ResellerHeader: FC<ResellerHeaderProps> = ({
	distributionPercentage = '35%',
	totalSales = 1287,
	totalInvoiced = 1650500,
	currency = 'usdc',
	currentBalance = 54000,
	totalProfits = 577675,
}) => {
	const { companySelected } = useAdminCompanyStore((state) => state);

	return (
		<div className="reseller-header">
			<div className="reseller-header-content">
				<ProfileHeader
					profileMedia={`data:image/png;base64,${companySelected.profile_media}`}
					title={companySelected.name}
					headline={companySelected.web}
					bottomText={`${companySelected.sub_class} distributor`}
				/>
				<div className="reseller-extra-info">
					<div>
						Distribution deal: {distributionPercentage} net sale |{' '}
					</div>
					<div>
						total sales: {totalSales} | total invoiced: ${totalInvoiced}{' '}
						{currency}
					</div>
					<div>
						total profits: ${totalProfits} {currency} |{' '}
						<span className="codefend-text-red">
							current balance: ${currentBalance} {currency}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
