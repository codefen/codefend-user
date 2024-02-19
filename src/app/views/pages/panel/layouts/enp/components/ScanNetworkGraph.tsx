import React, { useEffect, useRef, useState } from 'react';
import { Show } from '../../../../../components';
import { Doughnut, Line } from 'react-chartjs-2';
import moment from 'moment';
import * as d3 from 'd3';

const RADIUS = 10;

interface Link {
    source: string;
    target: string;
}

const processData = async(data: any) => {

    const nodes: any[] = [];
    const links: any[] = [];

    if (data.lenth === 0) {
        return { nodes, links };
    }

    await data.forEach((item: any) => {
        let osType = 'Other';
        if (item.device_os_release.includes('Windows')) {
            osType = 'Windows';
        } else if (item.device_os_release.includes('Linux') || item.device_os_release.includes('Fedora')) {
            osType = 'Linux';
        }

        const mainNode = {
            id: item.id,
            osType: osType,
            label: item.device_os_name,
            apps: item.apps_found,
        };
        nodes.push(mainNode);
        console.log(mainNode)

        for (let i = 0; i < 100; i++) {
            const childNode = { id: `${item.id}-app-${i}`, label: `${item.id}-app-${i}`, parent: item.id };
            nodes.push(childNode);
            links.push({ source: item.id, target: childNode.id });
        }
    });

    return { nodes, links };
};

const drawNetwork = (context: any, width: any, height: any, nodes: any, links: any) => {
    context.clearRect(0, 0, width, height);

    links.forEach((link: any) => {
        context.beginPath();
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
        context.strokeStyle = '#999';
        context.stroke();
        context.lineWidth = 2;
    });

    nodes.forEach((node: any) => {
        context.beginPath();
        switch (node.osType) {
            case 'Windows':
                context.moveTo(node.x, node.y - RADIUS);
                context.lineTo(node.x + RADIUS, node.y + RADIUS);
                context.lineTo(node.x - RADIUS, node.y + RADIUS);
                context.closePath();
                break;
            case 'Linux':
                context.rect(node.x - RADIUS, node.y - RADIUS, RADIUS * 2, RADIUS * 2);
                break;
            default:
                context.arc(node.x, node.y, 4, 0, 2 * Math.PI);
                break;
        }
        context.fillStyle = '#292b29';
        context.fill();
        context.strokeStyle = '#333';
        context.stroke();
        context.fillStyle = 'black';
        context.font = '7px Arial';
        context.fillText(node.label, node.x + RADIUS + 5, node.y + RADIUS + 5);
    });
};

export const ScanNetworkGraph = ({ data, filteredData }: { data: any; filteredData: any }) => {
    const [endpoints, setEndpoints] = useState<any>({nodes: [], links: []});
    const [chartData, setChartData] = useState<any>(null);;
    const [lineChartData, setLineChartData] = useState<any>(null);
    const [endpointLoaded, setEndpointLoaded] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
        },
        legend: {
            display: true,
            position: 'top',
            labels: {
                fontColor: '#111',
                fontSize: 12,
            },
        },
        tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            bodyFontColor: '#fff',
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        layout: {
            padding: {
                top: 15,
                left: 15,
                right: 15,
                bottom: 15
            }
        },
        cutoutPercentage: 50,
        elements: {
            arc: {
                borderWidth: 2
            }
        }
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                tension: 1
            },
            point: {
                radius: 0,
                hitRadius: 100,
                hoverRadius: 10,
            }
        },
        scales: {
            x: {

                grid: {
                    display: true
                },
                ticks: {
                    display: true
                }
            },
            y: {
                grid: {
                    display: true
                },
                ticks: {
                    display: true
                }
            }
        }
    };

    const processDataLine = () => {
        const scanCounts: { [key: string]: number } = {};

        const startDate = moment().subtract(6, 'days');

        for (let i = 0; i < 7; i++) {
            const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
            scanCounts[date] = 0;
        }

        data.forEach((item: any) => {
            const date = moment(item.creacion).format('YYYY-MM-DD');
            if (scanCounts.hasOwnProperty(date)) {
                scanCounts[date]++;
            }
        });

        const processedChartData = {
            labels: Object.keys(scanCounts),
            datasets: [{
                label: '',
                data: Object.values(scanCounts),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                
            }]
        };
        console.log("linechartdata")
        setLineChartData(processedChartData);
    };

    useEffect(() => {
        processData(filteredData)
            .then((procData: any) => {
                console.log(`procdata: ${procData}`)
                console.log(procData)
                setEndpoints(procData);
        
                console.log("enters")
                console.log(endpoints)
                console.log("triggers main")
        
                if(endpoints.nodes[0]) {
                    console.log("enters nodes")
                    const osCount = { Windows: 0, Mac: 0, Linux: 0 };
        
                    endpoints.nodes.forEach((endpoint: any) => {
                        const osRelease = endpoint.osType ? endpoint.osType : '';
        
                        if (osRelease.includes("Windows")) {
                            osCount.Windows++;
                        } else if (osRelease.includes("Mac")) {
                            osCount.Mac++;
                        } else if (osRelease.includes("Linux")) {
                            osCount.Linux++;
                        }
                    });
                    console.log("enters 2")
        
                    console.log(filteredData.length)
        
                    console.log("triggers")
        
                    if(filteredData.length && filteredData.length !== 0) {
                        processDataLine();
                    }
        
        
                    const processedChartData = {
                        labels: Object.keys(osCount),
                        datasets: [{
                            label: 'OS Distribution',
                            data: Object.values(osCount),
                            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                            borderWidth: 1
                        }]
                    };
        
                    setChartData(processedChartData);
                }

            })
    }, [data, filteredData, endpointLoaded]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const transformRef = useRef(d3.zoomIdentity);
    const simulationRef = useRef<any>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            if (context) {
                simulationRef.current = d3.forceSimulation(endpoints.nodes)
                    .force('link', d3.forceLink(endpoints.links).id((d: any) => d.id).distance(100))
                    .force('collide', d3.forceCollide().radius(() => RADIUS + 2))
                    .force('charge', d3.forceManyBody().strength(-10))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                    const zoom = d3.zoom()
                    .scaleExtent([0.1, 10])
                    .on('zoom', (event) => {
                        transformRef.current = event.transform;
                        draw();
                    });
        
                d3.select(canvas).call(zoom as unknown as (selection: d3.Selection<HTMLCanvasElement, unknown, null, undefined>) => void);
                        const draw = () => {
                    context.save();
                    context.clearRect(0, 0, width, height);
                    context.translate(transformRef.current.x, transformRef.current.y);
                    context.scale(transformRef.current.k, transformRef.current.k);
        
                    drawNetwork(context, width, height, endpoints.nodes, endpoints.links);
        
                    context.restore();
                };

                simulationRef.current.on('tick', draw);

                return () => {
                    if (simulationRef.current) {
                        simulationRef.current.stop();
                    }
                };
            }
        }
        return;
    }, [data]);

    useEffect(() => {
        console.log("enters conditional")
        console.log(endpoints)
        if(endpoints.nodes.length > 0) {
            setEndpointLoaded(true)
        }
        if (chartData && lineChartData) {
            console.log("loaded")
            setDataLoaded(true);
        }
    }, [chartData, lineChartData, endpoints]);

    return (
      <>
        <section className="w-1/6">
            <Show when={dataLoaded}>
                <>
                    <div className="border-t border-x rounded-t h-[300px]">
                        <Doughnut data={chartData} options={chartOptions} key="osChart"/>
                    </div>
                    <div className="flex items-center h-6 bg-slate-100 font-mono text-sm p-1 text-gray-400 rounded-b border-slate-200 border-b border-x cursor-default">
                        devices os
                    </div>
                </>
            </Show>
        </section>

        <section className="w-3/6">
            <Show when={dataLoaded}>
                <>
                    <div className="border-t border-x rounded-t ml-4 h-[300px]">
                        <Line data={lineChartData} options={lineChartOptions} key="scansChart"/>
                    </div>
                    <div className="flex items-center h-6 ml-4 bg-slate-100 font-mono text-sm p-1 text-gray-400 rounded-b border-slate-200 border-b border-x cursor-default">
                        scans made last week
                    </div>
                </>
            </Show>
        </section>

        <section className="w-1/3">
            <Show when={dataLoaded}>
                <>
                    <div className="border-t border-x rounded-t ml-4">
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={300}
                            key="networkGraph"
                        />
                    </div>
                    <div className="flex items-center h-6 ml-4 bg-slate-100 font-mono text-sm p-1 text-gray-400 rounded-b border-slate-200 border-b border-x cursor-default">
                        network graph
                    </div>
                </>
            </Show>
        </section>
      </>
    );
};
