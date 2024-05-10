import { ProfileHeader } from '@standalones/profileheader/ProfileHeader';
import useAdminCompanyStore from '@stores/adminCompany.store';
import { useResellerDashboardHeader } from '@userHooks/resellers/useResellerDashboardHeader';
import { formatNumber } from '@utils/helper';
import { useEffect, type FC } from 'react';

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
	const [reseller_header, company, { getResellerHeader, isLoading }] =
		useResellerDashboardHeader();

	useEffect(() => {
		if (!reseller_header.id || !company.id) {
			getResellerHeader();
		}
	}, []);

	return (
		<div className="reseller-header">
			<div className="reseller-header-content">
				<ProfileHeader
					profileMedia={`data:image/png;base64,${company.profile_media}`}
					title={company.name}
					headline={company.web}
					bottomText={`${company.sub_class} distributor`}
				/>
				<div className="reseller-extra-info">
					<div>
						Distribution deal: {company.reseller_revenue_share}% net sale
						|{' '}
					</div>
					<div>
						total sales:{' '}
						{reseller_header.final_sales_volume
							? formatNumber(reseller_header.final_sales_volume)
							: '...'}{' '}
						| total invoiced: $
						{reseller_header?.sum_funds_full
							? formatNumber(reseller_header?.sum_funds_full)
							: '...'}{' '}
						{currency}
					</div>
					<div>
						total profits: $
						{reseller_header?.sum_funds_reseller
							? formatNumber(reseller_header?.sum_funds_reseller)
							: '...'}{' '}
						{currency} |{' '}
						<span className="codefend-text-red">
							current balance:
							{reseller_header?.balance_now
								? `$${formatNumber(reseller_header.balance_now)}`
								: '...'}{' '}
							{currency}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
