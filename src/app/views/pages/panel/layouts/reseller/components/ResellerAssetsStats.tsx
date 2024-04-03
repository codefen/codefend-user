import { StatAsset } from '@standalones/stat-asset/StatAsset';
import { useState, type ReactNode, type FC } from 'react';

export interface Asset {
	value: ReactNode;
	title: string;
}

export interface ResellerAssetsStatsProps {
	assets: Asset[];
	initialActive?: number;
	assetsKey: string;
}

export const ResellerAssetsStats: FC<ResellerAssetsStatsProps> = ({
	assets,
	initialActive = -1,
	assetsKey,
}) => {
	const [assetActive, setAssetActive] = useState<number>(initialActive);
	return (
		<div className="asset-content">
			<div className="stats">
				{assets.map((asset: Asset, i: number) => (
					<StatAsset
						key={`asset-${assetsKey}-${i}`}
						value={asset.value}
						valueTitle={asset.title}
						isActive={assetActive === i}
						onClick={() => setAssetActive(i)}
					/>
				))}
			</div>
		</div>
	);
};
