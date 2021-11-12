import * as React from 'react';
import Tree from 'react-d3-tree';

const orgChart = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};

export default function TreePage() {
    //https://codesandbox.io/s/di9nl

    const renderNodeWithCustomEvents = ({ nodeDatum, toggleNode }) => (
        <g>
            <foreignObject x="0" height="120px" width="500px" y="-60px">
                <div
                    title={nodeDatum.fullName}
                    className="elemental-node"
                    style={nodeDatum.style}
                >
          <span title={nodeDatum.fullName} className="elemental-name">
            {nodeDatum.shortName}
          </span>
                    {nodeDatum.fullName === false && (
                        <div className="elemental-node--hover">
                            <span>{nodeDatum.fullName}</span>
                        </div>
                    )}
                </div>
            </foreignObject>
        </g>
    );

    return (
            <div id="treeWrapper" className="w-full h-full">
                <Tree
                    data={orgChart}
                    renderCustomNodeElement={renderNodeWithCustomEvents}
                />
            </div>
    )
}

