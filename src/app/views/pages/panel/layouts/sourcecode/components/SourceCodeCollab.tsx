import React from 'react';
import { SearchIcon, SimpleSection } from '../../../../../components';

export const SourceCodeCollab: React.FC = () => {
	return (
		<>
			<div className="card only-info">
				<SimpleSection
					header="Add out to your repository"
					icon={<SearchIcon />}>
					<div className="content">
						<div className="info">
							<p>
								In order to review the source code in your company
								private repositories we will need contributor access.
								Plase add the following user:
								<a className="cursor-pointer codefend-text-red underline">
									sourcecode@codefend.com
								</a>
							</p>
						</div>
					</div>
				</SimpleSection>
			</div>
		</>
	);
};
