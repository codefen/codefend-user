import { ModalTitleWrapper, ModalWrapper } from '..';
import {
	BugIcon,
	CLoudIcon,
	GlobeWebIcon,
	LanIcon,
	MobileIcon,
	PeopleGroupIcon,
	SourceCodeIcon,
} from '../..';
import './report-type.scss';

export const SelectReportTypeModal = () => {
	return (
		<ModalTitleWrapper
			headerTitle="Select report type"
			isActive={false}
			close={() => {}}>
			<div className="report-type-modal">
				<h3>Choose the resource class to generate the report</h3>
				<div className="report-type-container">
					<figure className="report-type-card">
						<GlobeWebIcon />

						<figcaption className="caption-card">
							<h4>Web</h4>
							<h5>
								total resource <span>30</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<MobileIcon />

						<figcaption className="caption-card">
							<h4>Mobile</h4>
							<h5>
								total resource <span>7</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<CLoudIcon />

						<figcaption className="caption-card">
							<h4>Cloud</h4>
							<h5>
								total resource <span>5</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<SourceCodeIcon />

						<figcaption className="caption-card">
							<h4>Source</h4>
							<h5>
								total resource <span>10</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<PeopleGroupIcon />

						<figcaption className="caption-card">
							<h4>Social</h4>
							<h5>
								total resource <span>20</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<LanIcon />

						<figcaption className="caption-card">
							<h4>Network</h4>
							<h5>
								total resource <span>0</span>
							</h5>
						</figcaption>
					</figure>

					<figure className="report-type-card">
						<BugIcon />

						<figcaption className="caption-card">
							<h4>Huerfano</h4>
							<h5>
								total resource <span>4</span>
							</h5>
						</figcaption>
					</figure>
				</div>
			</div>
		</ModalTitleWrapper>
	);
};
