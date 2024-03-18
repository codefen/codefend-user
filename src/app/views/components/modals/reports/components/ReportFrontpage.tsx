import { getCurrentDate } from '../../../../../data';
import { Logo, AimIcon } from '../../../';

export interface ReportFrontpageProps {
	resourceDomainText: string;
}

export const ReportFrontpage: React.FC<ReportFrontpageProps> = (props) => {
	return (
		<div className="portada">
			<div className="codefend-header">
				<div className="date">
					<span>{props.resourceDomainText}</span> - {getCurrentDate()}
				</div>
				<Logo theme="light" />
			</div>
			<div className="aim">
				<AimIcon />
				<h2>CONFIDENTIAL</h2>
			</div>
			<div className="title-portada">
				<p>
					This penetration test on {props.resourceDomainText} was requested
					by <span>[company]</span> and conducted by Codefend.
				</p>
			</div>
		</div>
	);
};
