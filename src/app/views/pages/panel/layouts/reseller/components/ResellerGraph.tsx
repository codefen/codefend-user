import { SimpleSection } from '@defaults/SimpleSection';
import { ChartIcon } from '@icons';
import { useBarsGraph } from '@userHooks/resellers/useBarsGraph';
import { useEffect } from 'react';

export const ResellerGraph = () => {
  const [svgRef, drawChart, generateData] = useBarsGraph();

  useEffect(() => {
    if (svgRef.current) {
      drawChart(generateData());
    }
  }, []);

  return (
    <div className="card reseller-graph">
      <SimpleSection header="Leads per week" icon={<ChartIcon />}>
        <div className="content">
          <svg ref={svgRef} />
        </div>
      </SimpleSection>
    </div>
  );
};
